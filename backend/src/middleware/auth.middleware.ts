import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import { verifyToken } from "../services/auth.service";
import { UnauthorizedError } from "../utils/errors";
import { MESSAGES } from "../utils/messages";

// Protects routes by verifying the Bearer token and attaching the user's id and role to req.user
export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw new UnauthorizedError(MESSAGES.AUTH.TOKEN_MISSING);

    let payload;
    try {
      payload = verifyToken(header.slice(7));
    } catch {
      throw new UnauthorizedError(MESSAGES.AUTH.TOKEN_INVALID);
    }

    const user = await User.findById(payload.id).select("role isActive");
    if (!user) throw new UnauthorizedError(MESSAGES.AUTH.USER_NOT_FOUND);
    if (!user.isActive) throw new UnauthorizedError(MESSAGES.AUTH.ACCOUNT_DISABLED);

    req.user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    next(err);
  }
};
