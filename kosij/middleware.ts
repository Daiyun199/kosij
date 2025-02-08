import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Đặt trong .env

const protectedRoutes: Record<string, string[]> = {
  "/admin": ["admin"],
  "/dashboard": ["admin", "staff"],
};
export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userRole = decodeToken(token)?.role || "guest"; // Nếu không có role, gán "guest"

  const pathname = req.nextUrl.pathname;

  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route) && !allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

// **Real decode function**
function decodeToken(token?: string): { role: string } | null {
  if (!token) return null; // Kiểm tra nếu token undefined

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

// Áp dụng middleware cho các route cần bảo vệ
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
