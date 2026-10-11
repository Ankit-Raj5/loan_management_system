import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "../config";
import type { User } from "../types";
import { API_URL } from "./env";

interface AuthData {
  user: User;
  token: string;
}

// Forwards login or register to the backend; on success stores the token in an httpOnly cookie and returns only the user
export const handleAuthRequest = async (request: NextRequest, backendPath: "/auth/login" | "/auth/register") => {
  const backendRes = await fetch(`${API_URL}${backendPath}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
    cache: "no-store",
  });
  const body = await backendRes.json().catch(() => null);

  if (!backendRes.ok || !body?.success) {
    return NextResponse.json(
      body ?? { success: false, message: "Could not reach the server", error: { code: "UPSTREAM_ERROR" } },
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
