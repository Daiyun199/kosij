import { NextRequest, NextResponse } from "next/server";

// Define protected routes with roles
const protectedRoutes = ['/farmbreeder', '/manager', '/salesstaff'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  const userRole = req.cookies.get("userRole")?.value;

  // Check if the user is trying to access a protected route
  const isProtectedRoute = protectedRoutes.some(path => req.nextUrl.pathname.startsWith(path));

  // If the route is protected but the token or role is invalid, redirect to login
  if (isProtectedRoute) {
    if (!token || !userRole || !["manager", "salesstaff", "farmbreeder"].includes(userRole)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}
