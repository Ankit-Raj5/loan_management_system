import "server-only";
import { cookies } from "next/headers";
import { parseEnvelope } from "../api-error";
import { SESSION_COOKIE } from "../config";
import { API_URL } from "./env";

// Reads the session token from the httpOnly cookie
export const getToken = async (): Promise<string | undefined> => (await cookies()).get(SESSION_COOKIE)?.value;

// Calls the backend from a server component with the cookie's token and returns the response data
export const backendFetch = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: { ...(token && { Authorization: `Bearer ${token}` }), ...init.headers },
  });
  return parseEnvelope<T>(res);
};
