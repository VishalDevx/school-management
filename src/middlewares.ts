import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const path = req.nextUrl.pathname;

  // Public paths
  if (path.startsWith("/auth") || path === "/") return NextResponse.next();

  // Require authentication
  if (!token) return NextResponse.redirect(new URL("/auth/login", req.url));

  // Role-based protection
  if (path.startsWith("/admin") && token.role !== "ADMIN")
    return NextResponse.redirect(new URL("/auth/login", req.url));

  if (path.startsWith("/staff") && token.role !== "STAFF")
    return NextResponse.redirect(new URL("/auth/login", req.url));

  if (path.startsWith("/student") && token.role !== "STUDENT")
    return NextResponse.redirect(new URL("/auth/login", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*", "/student/:path*"],
};
