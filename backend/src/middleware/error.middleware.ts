import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { AppError, NotFoundError } from "../utils/errors";
import { MESSAGES } from "../utils/messages";
import { ErrorBody } from "../utils/response";

// Forwards requests that matched no route as a 404 error
export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) =>
  next(new NotFoundError(MESSAGES.COMMON.ROUTE_NOT_FOUND));

// Converts every thrown error into the standard error response
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  let appError: AppError;

  if (err instanceof AppError) {
    appError = err;
  } else if ((err as { code?: number })?.code === 11000) {
    appError = new AppError(409, "Duplicate value for a unique field", "CONFLICT");
  } else if ((err as { type?: string })?.type === "entity.parse.failed") {
    appError = new AppError(400, "Malformed JSON body", "BAD_REQUEST");
  } else {
    console.error(err);
    appError = new AppError(500, MESSAGES.COMMON.SERVER_ERROR, "INTERNAL_SERVER_ERROR");
  }

  const body: ErrorBody = {
    success: false,
    message: appError.message,
    error: {
      code: appError.code,
      ...(appError.details !== undefined && { details: appError.details }),
    },
  };
  if (env.nodeEnv === "development" && appError.statusCode === 500) {
    (body.error as Record<string, unknown>).stack = (err as Error)?.stack;
  }
  res.status(appError.statusCode).json(body);
};
