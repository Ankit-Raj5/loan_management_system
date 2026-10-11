import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { ApiError } from "../api-error";
import { canAccessPath } from "../access";
import type { User } from "../types";
import { backendFetch, getToken } from "./backend";

// Fetches the logged-in user once per request (null when logged out or the token is no longer valid)
export const getCurrentUser = cache(async (): Promise<User | null> => {
  if (!(await getToken())) return null;
  try {
    const { user } = await backendFetch<{ user: User }>("/auth/me");
    return user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
});

// Returns the logged-in user or sends the visitor to log out (clears a stale cookie) and sign in again
export const requireUser = async (): Promise<User> => {
  const user = await getCurrentUser();
  if (!user) redirect("/api/auth/logout");
  return user;
};

// Returns the logged-in user, sending them to the "no access" page when their role may not open the path
export const requireAccess = async (pathname: string): Promise<User> => {
  const user = await requireUser();
  if (!canAccessPath(user.role, pathname)) redirect("/forbidden");
  return user;
};
