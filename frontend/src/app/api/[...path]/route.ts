import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/config";
import { API_URL } from "@/lib/server/env";
import { unreachableResponse } from "@/lib/server/upstream";

// Allow up to 60s so a sleeping free-tier backend has time to wake up
export const maxDuration = 60;

// Forwards any /api/* call to the backend, adding the Bearer token from the httpOnly cookie
const forward = async (request: NextRequest, { params }: RouteContext<"/api/[...path]">) => {
  const { path } = await params;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  if (token) headers.set("authorization", `Bearer ${token}`);

  try {
    const backendRes = await fetch(`${API_URL}/${path.join("/")}${request.nextUrl.search}`, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
    });
    return new NextResponse(backendRes.body, {
      status: backendRes.status,
      headers: { "content-type": backendRes.headers.get("content-type") ?? "application/json" },
    });
  } catch (error) {
    console.error(`Proxy failed: could not reach ${API_URL}/${path.join("/")}`, error);
    return unreachableResponse();
  }
};

export { forward as GET, forward as POST, forward as PATCH, forward as PUT, forward as DELETE };
