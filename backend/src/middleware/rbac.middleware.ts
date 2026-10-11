import { NextFunction, Request, Response } from "express";
import { Role } from "../types/roles";
import { ForbiddenError, UnauthorizedError } from "../utils/errors";
import { MESSAGES } from "../utils/messages";

// Restricts a route to exactly the listed roles with no Admin bypass; returns 403 otherwise
export const restrictTo =
  (...allowed: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new UnauthorizedError(MESSAGES.AUTH.TOKEN_MISSING));
    if (allowed.includes(req.user.role)) return next();
    next(new ForbiddenError(MESSAGES.AUTH.FORBIDDEN_ROLE));
  };

// Restricts a route to the listed roles (Admin always allowed); returns 403 otherwise
export const authorize =
  (...allowed: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new UnauthorizedError(MESSAGES.AUTH.TOKEN_MISSING));
    if (req.user.role === Role.ADMIN || allowed.includes(req.user.role)) return next();
    next(new ForbiddenError(MESSAGES.AUTH.FORBIDDEN_ROLE));
  };
