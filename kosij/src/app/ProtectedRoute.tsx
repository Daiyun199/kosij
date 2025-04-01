import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { isAuthenticated, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated, "userRole:", userRole);
    if (!isAuthenticated || !userRole || !allowedRoles.includes(userRole)) {
      console.log("Redirecting to login...");
      router.push(
        "/login?error=unauthenticated&path=" + window.location.pathname
      );
    }
  }, [isAuthenticated, userRole, allowedRoles, router]);

  if (!isAuthenticated || !userRole || !allowedRoles.includes(userRole)) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
