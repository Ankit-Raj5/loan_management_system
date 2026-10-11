import type { NextRequest } from "next/server";
import { handleAuthRequest } from "@/lib/server/auth-handler";

// Logs in through the backend and sets the httpOnly session cookie
export const POST = (request: NextRequest) => handleAuthRequest(request, "/auth/login");
