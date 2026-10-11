import type { NextRequest } from "next/server";
import { handleAuthRequest } from "@/lib/server/auth-handler";

// Allow up to 60s so a sleeping free-tier backend has time to wake up
export const maxDuration = 60;

// Logs in through the backend and sets the httpOnly session cookie
export const POST = (request: NextRequest) => handleAuthRequest(request, "/auth/login");
