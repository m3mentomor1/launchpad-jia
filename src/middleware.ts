// src/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;
  const url = request.nextUrl.clone();

  // Removed hellojia.ai specific redirect

  // Removed redirect to hellojia.ai - keep users on current domain

  if (host.startsWith("admin.hirejia.ai") && pathname === "/") {
    const url = request.nextUrl.clone();
    // Redirect to admin-portal
    url.pathname = `/admin-portal`;
    return NextResponse.rewrite(url);
  }
  // Redirect to hirejia.ai for recruiter portal
  if (
    !host.includes("hirejia") &&
    !host.includes("localhost") &&
    pathname.includes("old-dashboard")
  ) {
    const newUrl = new URL(request.url);
    newUrl.hostname = `hirejia.ai`;
    return NextResponse.redirect(newUrl);
  }

  // Removed redirect to hellojia.ai - keep users on current domain

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/recruiter-dashboard/:path*",
    "/applicant/:path*",
    "/dashboard/:path*",
    "/job-openings/:path*",
    "/whitecloak/:path*",
    "/admin-portal/:path*",
    "/",
  ],
};
