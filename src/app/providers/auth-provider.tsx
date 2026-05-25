import { useState } from "react";
import type { AuthUser, LoginCredentials } from "@/features/auth/types/auth";
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
    // Mock login - sem requisição à API
    const mockUser: AuthUser = {
      id: "1",
      email: credentials.email,
      name: credentials.email.split("@")[0],
      role: "admin"
    };
    localStorage.setItem("@saf:token", "mock-token-" + Date.now());
    localStorage.setItem("@saf:user", JSON.stringify(mockUser));
    setUser(mockUser);
  }

  function logout() {
    localStorage.removeItem("@saf:token");
    localStorage.removeItem("@saf:user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
