import { NextFunction, Request, Response } from "express";
import { Role } from "../types/roles";
import { ForbiddenError, UnauthorizedError } from "../utils/errors";
import { MESSAGES } from "../utils/messages";

/**
 * Allows only the listed roles. ADMIN is always allowed (can access every module).
 * Must run after `authenticate`. 401 = not logged in, 403 = logged in but wrong role.
 */
export const authorize =
  (...allowed: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new UnauthorizedError(MESSAGES.AUTH.TOKEN_MISSING));
    if (req.user.role === Role.ADMIN || allowed.includes(req.user.role)) return next();
    next(new ForbiddenError(MESSAGES.AUTH.FORBIDDEN_ROLE));
  };
