import { MODULES, type OpsModule } from "./modules";
import type { Role } from "./roles";

const BORROWER_PATHS = ["/apply", "/applications"];
const SHARED_PATHS = ["/profile", "/forbidden"];

// True when a pathname equals a base path or sits underneath it
const isUnder = (pathname: string, base: string): boolean => pathname === base || pathname.startsWith(`${base}/`);

// Lists the operations modules a role may open (Admin sees all)
export const modulesForRole = (role: Role): OpsModule[] =>
  role === "ADMIN" ? MODULES : MODULES.filter((module) => module.roles.includes(role));

// Where a role lands after login: the applications list for borrowers, own module for executives, overview for Admin
export const homePathForRole = (role: Role): string => {
  if (role === "BORROWER") return "/applications";
  if (role === "ADMIN") return "/dashboard";
  return modulesForRole(role)[0]?.path ?? "/forbidden";
};

// Single source of truth for page access, used by the proxy and by server layouts
export const canAccessPath = (role: Role, pathname: string): boolean => {
  if (SHARED_PATHS.some((base) => isUnder(pathname, base))) return true;
  if (role === "BORROWER") return BORROWER_PATHS.some((base) => isUnder(pathname, base));
  if (pathname === "/dashboard") return true;
  return modulesForRole(role).some((module) => isUnder(pathname, module.path));
};
