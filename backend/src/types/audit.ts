import { Role } from "./roles";

export type AuditRole = Role | "SYSTEM";

export interface AuditActor {
  userId?: string;
  name: string;
  role: AuditRole;
}

export const SYSTEM_ACTOR: AuditActor = { name: "System", role: "SYSTEM" };
