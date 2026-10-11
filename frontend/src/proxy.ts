import { NextResponse, type NextRequest } from "next/server";
import { canAccessPath, homePathForRole } from "@/lib/access";
import { SESSION_COOKIE } from "@/lib/config";
import { isRole, type Role } from "@/lib/roles";

const AUTH_PAGES = ["/login", "/register"];

// Reads the role from the JWT without verifying it (the backend verifies; this only routes the visitor)
const readRole = (token: string | undefined): Role | null => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) return null;
    return isRole(payload.role) ? payload.role : null;
  } catch {
    return null;
  }
};

// Optimistic route guard: logged-out visitors go to login, logged-in users are kept inside the pages their role may open
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = readRole(request.cookies.get(SESSION_COOKIE)?.value);

  // The landing page is public; the page itself sends signed-in users to their home
  if (pathname === "/") return NextResponse.next();

  if (AUTH_PAGES.includes(pathname)) {
    return role ? NextResponse.redirect(new URL(homePathForRole(role), request.url)) : NextResponse.next();
  }

  if (!role) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (!canAccessPath(role, pathname)) return NextResponse.redirect(new URL("/forbidden", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
