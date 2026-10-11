import type { NextRequest } from "next/server";
import { handleAuthRequest } from "@/lib/server/auth-handler";

// Registers through the backend and sets the httpOnly session cookie
export const POST = (request: NextRequest) => handleAuthRequest(request, "/auth/register");
