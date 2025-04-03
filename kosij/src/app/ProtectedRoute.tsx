import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);  // Add loading state

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated, "userRole:", userRole);
    if (isAuthenticated !== undefined && userRole !== null) {
      setLoading(false);  // Set loading to false when auth state is ready
    }
    if (isAuthenticated === false || userRole === null || !allowedRoles.includes(userRole)) {
      console.log("Redirecting to login...");
      router.push(
        "/login?error=unauthenticated&path=" + window.location.pathname
      );
    }
  }, [isAuthenticated, userRole, allowedRoles, router, loading]);

  if (!isAuthenticated || !userRole || !allowedRoles.includes(userRole)) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
