import { Response } from "express";

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

// Sends the standard success response envelope with the given status code
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200
): Response<SuccessBody<T>> =>
  res.status(statusCode).json({ success: true, message, data });

// Sends the standard success response envelope with status 201
export const sendCreated = <T>(res: Response, data: T, message = "Created successfully") =>
  sendSuccess(res, data, message, 201);
