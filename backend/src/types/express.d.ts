import { Role } from "./roles";

export interface AuthUser {
  id: string;
  name: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
