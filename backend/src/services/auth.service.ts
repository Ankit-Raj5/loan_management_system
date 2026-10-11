import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { IUser, User, UserDocument } from "../models/user.model";
import { Role } from "../types/roles";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors";
import { MESSAGES } from "../utils/messages";

const SALT_ROUNDS = 10;

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  lastLoginAt: Date | null;
  createdAt: Date;
}

export interface AuthResult {
  user: PublicUser;
  token: string;
}

export interface TokenPayload {
  id: string;
  role: Role;
}

// Strips sensitive fields so only safe user data is returned to clients
const toPublicUser = (user: UserDocument): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
});

// Creates a signed JWT containing the user's id and role
const signToken = (user: UserDocument): string =>
  jwt.sign({ id: user.id, role: user.role } satisfies TokenPayload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as SignOptions);

// Verifies a JWT and returns its payload, throwing if invalid or expired
export const verifyToken = (token: string): TokenPayload =>
  jwt.verify(token, env.jwtSecret) as TokenPayload;

// Hashes a plain-text password with bcrypt
export const hashPassword = (plain: string): Promise<string> => bcrypt.hash(plain, SALT_ROUNDS);

// Creates a new account (BORROWER by default, never ADMIN) and returns the user with a token
export const register = async (
  input: Pick<IUser, "name" | "email" | "password"> & { role?: Role }
): Promise<AuthResult> => {
  const exists = await User.exists({ email: input.email.toLowerCase() });
  if (exists) throw new ConflictError(MESSAGES.AUTH.EMAIL_EXISTS);

  const password = await hashPassword(input.password);
  const user = await User.create({ ...input, password, role: input.role ?? Role.BORROWER });

  return { user: toPublicUser(user), token: signToken(user) };
};

// Checks credentials (and the selected role, if given), updates lastLoginAt and returns the user with a token
export const login = async (email: string, password: string, role?: Role): Promise<AuthResult> => {
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) throw new UnauthorizedError(MESSAGES.AUTH.INVALID_CREDENTIALS);

  const matches = await bcrypt.compare(password, user.password);
  if (!matches) throw new UnauthorizedError(MESSAGES.AUTH.INVALID_CREDENTIALS);
  if (!user.isActive) throw new UnauthorizedError(MESSAGES.AUTH.ACCOUNT_DISABLED);
  if (role && user.role !== role) throw new NotFoundError(MESSAGES.AUTH.ROLE_ACCOUNT_NOT_FOUND);

  user.lastLoginAt = new Date();
  await user.save();

  return { user: toPublicUser(user), token: signToken(user) };
};

// Fetches the public profile of the given user id
export const getProfile = async (userId: string): Promise<PublicUser> => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError(MESSAGES.AUTH.USER_NOT_FOUND);
  return toPublicUser(user);
};

// Verifies the current password and saves a new hashed password for the user
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new NotFoundError(MESSAGES.AUTH.USER_NOT_FOUND);

  const matches = await bcrypt.compare(currentPassword, user.password);
  if (!matches) throw new UnauthorizedError(MESSAGES.AUTH.INCORRECT_CURRENT_PASSWORD);

  if (currentPassword === newPassword) throw new BadRequestError(MESSAGES.AUTH.PASSWORD_UNCHANGED);

  user.password = await hashPassword(newPassword);
  await user.save();
};
