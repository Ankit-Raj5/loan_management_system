import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { UnauthorizedError } from "../utils/errors";
import { MESSAGES } from "../utils/messages";
import { sendCreated, sendSuccess } from "../utils/response";
import { assertValid, validateLogin, validateRegister } from "../utils/validators";

export const register = async (req: Request, res: Response) => {
  assertValid(validateRegister(req.body ?? {}));
  const { name, email, password } = req.body;
  const result = await authService.register({ name: name.trim(), email: email.trim(), password });
  return sendCreated(res, result, MESSAGES.AUTH.REGISTERED);
};

export const login = async (req: Request, res: Response) => {
  assertValid(validateLogin(req.body ?? {}));
  const result = await authService.login(req.body.email.trim(), req.body.password);
  return sendSuccess(res, result, MESSAGES.AUTH.LOGGED_IN);
};

export const me = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError(MESSAGES.AUTH.TOKEN_MISSING);
  const user = await authService.getProfile(req.user.id);
  return sendSuccess(res, { user }, MESSAGES.AUTH.PROFILE_FETCHED);
};
