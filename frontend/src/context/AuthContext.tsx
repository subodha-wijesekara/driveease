"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type UserRole = "CUSTOMER" | "ADMIN";

export interface AuthUser {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (userData: AuthUser) => void;
  logout: () => void;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("driveease_user");
    const token = localStorage.getItem("driveease_token");
    if (stored && token) {
      setUser({ ...JSON.parse(stored), token });
    }
    setIsLoading(false);
  }, []);

  const login = (userData: AuthUser) => {
    localStorage.setItem("driveease_token", userData.token);
    localStorage.setItem(
      "driveease_user",
      JSON.stringify({ ...userData, token: undefined })
    );
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("driveease_token");
    localStorage.removeItem("driveease_user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAdmin: user?.role === "ADMIN", isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
