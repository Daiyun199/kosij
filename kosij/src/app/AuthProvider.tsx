"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/domain/User/role.enum";

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

  // useEffect(() => {
  //   const token = getAuthToken();
  //   console.log("Token1:", token);
  //   if (token) {
  //     const storedRole = localStorage.getItem("userRole") as UserRole | null;
  //     console.log("Stored role:", storedRole);
  //     if (storedRole) {
  //       setUserRole(storedRole);
  //       setIsAuthenticated(true);
  //     }
  //   } else {
  //     setUserRole(null);
  //     setIsAuthenticated(false);
  //   }
  // }, []);

  const login = (role: UserRole) => {
    localStorage.setItem("userRole", role);
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    setUserRole(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

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
