import { Request } from "express";
import { BadRequestError } from "./errors";
import { MESSAGES } from "./messages";
import { isValidObjectId } from "./validators";

// Reads the :id route param and throws 400 unless it is a valid MongoDB ObjectId
export const getIdParam = (req: Request): string => {
  const id = req.params.id;
  if (!isValidObjectId(id)) throw new BadRequestError(MESSAGES.OPERATIONS.INVALID_ID);
  return id;
};
