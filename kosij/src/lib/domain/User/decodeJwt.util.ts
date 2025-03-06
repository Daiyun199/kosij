"use client";
import { JwtToken } from "@/lib/domain/User/JwtToken";
import { Role } from "@/lib/domain/User/role.enum";

export function decodeJwt(jwt: string): JwtToken {
  const base64Url = jwt.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = JSON.parse(jsonPayload) as Record<string, any>;

  // ✅ Extract role from namespaced claim
  const roleClaim =
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
  const role = (payload[roleClaim] as string)?.toLowerCase(); // Normalize to lowercase

  return {
    username: payload.sub, // Assuming "sub" is the username
    phone: payload.phone || "", // Ensure phone exists
    exp: payload.exp,
    id: payload.sub, // Assuming sub is the user ID
    role: (Object.values(Role) as string[]).includes(role)
      ? (role as Role)
      : Role.customer, // Validate role
  };
}
