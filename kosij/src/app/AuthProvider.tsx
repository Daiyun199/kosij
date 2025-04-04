"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/domain/User/role.enum";
import Cookies from "js-cookie";
import { decodeJwt } from "@/lib/domain/User/decodeJwt.util";

type UserRole = Role;

interface AuthContextType {
  userRole: UserRole | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token =
      (localStorage.getItem("authToken") &&
        sessionStorage.getItem("authToken")) ||
      Cookies.get("token");
    if (token) {
      try {
        const payload = decodeJwt(token);
        if (payload) {
          setUserRole(payload.role);
          setIsAuthenticated(true);
        } else {
          logout();
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        logout();
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
    setLoading(false);
  }, []);

  const login = (role: UserRole) => {
    localStorage.setItem("userRole", role);
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    Cookies.remove("token");
    sessionStorage.removeItem("authToken");

    setUserRole(null);
    setIsAuthenticated(false);

    router.push("/login?logout=success");
    router.push("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ userRole, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
