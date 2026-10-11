import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/config";

// Clears the session cookie, returning JSON for fetch calls
export const POST = () => {
  const response = NextResponse.json({ success: true, message: "Logged out", data: null });
  response.cookies.delete(SESSION_COOKIE);
  return response;
};

// Clears a stale or expired session cookie and sends the visitor to the login page
export const GET = (request: NextRequest) => {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete(SESSION_COOKIE);
  return response;
};
