import { Response } from "express";

/**
 * Standard response envelope for every API.
 *
 * Success: { success: true,  message, data }
 * Error:   { success: false, message, error: { code, details? } }  (see error.middleware)
 */
export interface SuccessBody<T> {
  success: true;
  message: string;
  data: T;
}

export interface ErrorBody {
  success: false;
  message: string;
  error: { code: string; details?: unknown };
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200
): Response<SuccessBody<T>> =>
  res.status(statusCode).json({ success: true, message, data });

export const sendCreated = <T>(res: Response, data: T, message = "Created successfully") =>
  sendSuccess(res, data, message, 201);
