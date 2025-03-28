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
    // If not authenticated or role doesn't match, redirect to login
    if (!isAuthenticated || !userRole || !allowedRoles.includes(userRole)) {
      router.push("/login?error=unauthenticated&path=" + window.location.pathname);
    }
  }, [isAuthenticated, userRole, allowedRoles, router]);

  if (!isAuthenticated || !userRole || !allowedRoles.includes(userRole)) {
    return <div>Loading...</div>;  // Wait for the check to complete
  }

  return <>{children}</>;
}
