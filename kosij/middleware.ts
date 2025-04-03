import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const url = request.url;

  if (!token && !url.includes("/login")) {
    return NextResponse.redirect(new URL("/login", url));
  }

  const userRole = request.cookies.get("userRole")?.value;

  if (
    (userRole !== "farmbreeder" && url.includes("/farmbreeder")) &&
    (userRole !== "manager" && url.includes("/manager")) &&
    (userRole !== "salesstaff" && url.includes("/salesstaff"))
  ) {
    return NextResponse.redirect(new URL("/login", url));
  }

  return NextResponse.next();
}
