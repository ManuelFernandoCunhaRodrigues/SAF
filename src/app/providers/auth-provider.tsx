import { useState } from "react";
import type { AuthUser, LoginCredentials } from "@/features/auth/types/auth";
import { loginService, logoutService } from "@/features/auth/services/auth-service";
import { AuthContext } from "./auth-context";

function getInitialUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("@saf:user");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem("@saf:user");
    }
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getInitialUser);

  async function login(credentials: LoginCredentials) {
    const { token, user } = await loginService(credentials);
    localStorage.setItem("@saf:token", token);
    localStorage.setItem("@saf:user", JSON.stringify(user));
    setUser(user);
  }

  function logout() {
    logoutService();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
