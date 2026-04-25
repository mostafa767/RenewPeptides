import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

const ADMIN_PUBLIC_ROUTES = ["/admin/login", "/api/admin/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isPublicAdminRoute = ADMIN_PUBLIC_ROUTES.some((r) =>
    pathname.startsWith(r)
  );

  if (isAdminRoute && !isPublicAdminRoute) {
    const token = getTokenFromRequest(request);

    if (!token) {
      return redirectToLogin(request);
    }

    const session = await verifyToken(token);
    if (!session) {
      return redirectToLogin(request);
    }

    // Inject admin email into request headers for downstream use
    const headers = new Headers(request.headers);
    headers.set("x-admin-email", session.email);
    return NextResponse.next({ request: { headers } });
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
