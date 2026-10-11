import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { UnauthorizedError } from "../utils/errors";
import { MESSAGES } from "../utils/messages";
import { sendCreated, sendSuccess } from "../utils/response";
import {
  assertValid,
  validateChangePassword,
  validateLogin,
  validateRegister,
} from "../utils/validators";

// Handles new borrower signup: validates input and creates the account
export const register = async (req: Request, res: Response) => {
  assertValid(validateRegister(req.body ?? {}));
  const { name, email, password } = req.body;
  const result = await authService.register({ name: name.trim(), email: email.trim(), password });
  return sendCreated(res, result, MESSAGES.AUTH.REGISTERED);
};

// Handles login for every role: validates input and returns user and token
export const login = async (req: Request, res: Response) => {
  assertValid(validateLogin(req.body ?? {}));
  const result = await authService.login(req.body.email.trim(), req.body.password);
  return sendSuccess(res, result, MESSAGES.AUTH.LOGGED_IN);
};

// Returns the profile of the currently logged-in user
export const me = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError(MESSAGES.AUTH.TOKEN_MISSING);
  const user = await authService.getProfile(req.user.id);
  return sendSuccess(res, { user }, MESSAGES.AUTH.PROFILE_FETCHED);
};

// Lets the logged-in user change their own password
export const changePassword = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError(MESSAGES.AUTH.TOKEN_MISSING);
  assertValid(validateChangePassword(req.body ?? {}));
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user.id, currentPassword, newPassword);
  return sendSuccess(res, null, MESSAGES.AUTH.PASSWORD_CHANGED);
};
