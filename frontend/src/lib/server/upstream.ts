import "server-only";
import { NextResponse } from "next/server";
import { API_URL } from "./env";

// The host the frontend is trying to reach, so a wrong API_URL is obvious from the error itself
const describeTarget = (): string => {
  try {
    return new URL(API_URL).host;
  } catch {
    return "invalid (API_URL must start with https://)";
  }
};

// 502 in the standard error shape, for when the backend cannot be reached; details help diagnose a wrong or missing API_URL
export const unreachableResponse = (message = "Could not reach the server") =>
  NextResponse.json(
    {
      success: false,
      message,
      error: { code: "UPSTREAM_ERROR", details: { apiUrlConfigured: Boolean(process.env.API_URL), apiHost: describeTarget() } },
    },
    { status: 502 }
  );
