import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token"); // Assuming you store the token in cookies
  const url = request.url;

  if (!token && !url.includes("/login")) {
    return NextResponse.redirect(new URL("/login", url));
  }

  // Safely extract userRole from the cookies
  const userRole = request.cookies.get("userRole")?.value;

  // If the user is not logged in or doesn't have the correct role, redirect
  if (userRole !== "farmbreeder" && url.includes("/farmbreeder")) {
    return NextResponse.redirect(new URL("/login", url));
  }

  return NextResponse.next(); // Proceed if authenticated and authorized
}
