import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "../config";
import type { User } from "../types";
import { API_URL } from "./env";
import { unreachableResponse } from "./upstream";

interface AuthData {
  user: User;
  token: string;
}

// Forwards login or register to the backend; on success stores the token in an httpOnly cookie and returns only the user
export const handleAuthRequest = async (request: NextRequest, backendPath: "/auth/login" | "/auth/register") => {
  let backendRes: Response;
  try {
    backendRes = await fetch(`${API_URL}${backendPath}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
      cache: "no-store",
    });
  } catch (error) {
    console.error(`Auth request failed: could not reach ${API_URL}${backendPath}`, error);
    return unreachableResponse("Could not reach the server. Please try again in a moment.");
  }

  const body = await backendRes.json().catch(() => null);

  if (!backendRes.ok || !body?.success) {
    if (!body) console.error(`Auth request: backend answered ${backendRes.status} with a non-JSON body (check API_URL includes /api)`);
    return NextResponse.json(
      body ?? { success: false, message: "Unexpected response from the server", error: { code: "UPSTREAM_ERROR" } },
      { status: backendRes.ok ? 502 : backendRes.status }
    );
  }

  const { user, token } = body.data as AuthData;
  const response = NextResponse.json({ success: true, message: body.message, data: { user } });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
};
