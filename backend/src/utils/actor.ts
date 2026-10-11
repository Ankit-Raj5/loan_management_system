import { Request } from "express";
import { AuditActor } from "../types/audit";
import { UnauthorizedError } from "./errors";
import { MESSAGES } from "./messages";

// Builds the audit actor (id, name, role) from the logged-in user or throws 401
export const getActor = (req: Request): AuditActor => {
  if (!req.user) throw new UnauthorizedError(MESSAGES.AUTH.TOKEN_MISSING);
  return { userId: req.user.id, name: req.user.name, role: req.user.role };
};
