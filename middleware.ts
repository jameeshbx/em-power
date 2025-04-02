import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check user role and implement redirections
    if (token?.role) {
      // Admin routes protection
      if (path.startsWith("/superadmin") && token.role !== "SUPERADMIN") {
        return NextResponse.redirect(new URL("/403", req.url));
      }

      if (path.startsWith("/admin") && token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/403", req.url));
      }

      // Add more role-based redirections as needed
      // Example: Protect manager routes
      if (path.startsWith("/manager") && token.role !== "MANAGER") {
        return NextResponse.redirect(new URL("/403", req.url));
      }

      if (path.startsWith("/employee") && token.role !== "EMPLOYEE") {
        return NextResponse.redirect(new URL("/403", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|forgot-password|reset-password|_next/static|_next/image|favicon.ico).*)",
  ], // Protect all dashboard pages
};
