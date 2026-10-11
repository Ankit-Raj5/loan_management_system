import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { IUser, User, UserDocument } from "../models/user.model";
import { Role } from "../types/roles";
import { ConflictError, NotFoundError, UnauthorizedError } from "../utils/errors";
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

const toPublicUser = (user: UserDocument): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
});

const signToken = (user: UserDocument): string =>
  jwt.sign({ id: user.id, role: user.role } satisfies TokenPayload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as SignOptions);

export const verifyToken = (token: string): TokenPayload =>
  jwt.verify(token, env.jwtSecret) as TokenPayload;

/** Public signup — always creates a BORROWER; roles are never taken from client input. */
export const register = async (
  input: Pick<IUser, "name" | "email" | "password">
): Promise<AuthResult> => {
  const exists = await User.exists({ email: input.email.toLowerCase() });
  if (exists) throw new ConflictError(MESSAGES.AUTH.EMAIL_EXISTS);

  const password = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await User.create({ ...input, password, role: Role.BORROWER });

  return { user: toPublicUser(user), token: signToken(user) };
};

export const login = async (email: string, password: string): Promise<AuthResult> => {
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  // Same message for unknown email and wrong password to avoid user enumeration
  if (!user) throw new UnauthorizedError(MESSAGES.AUTH.INVALID_CREDENTIALS);

  const matches = await bcrypt.compare(password, user.password);
  if (!matches) throw new UnauthorizedError(MESSAGES.AUTH.INVALID_CREDENTIALS);
  if (!user.isActive) throw new UnauthorizedError(MESSAGES.AUTH.ACCOUNT_DISABLED);

  user.lastLoginAt = new Date();
  await user.save();

  return { user: toPublicUser(user), token: signToken(user) };
};

export const getProfile = async (userId: string): Promise<PublicUser> => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError(MESSAGES.AUTH.USER_NOT_FOUND);
  return toPublicUser(user);
};

export const hashPassword = (plain: string): Promise<string> => bcrypt.hash(plain, SALT_ROUNDS);
