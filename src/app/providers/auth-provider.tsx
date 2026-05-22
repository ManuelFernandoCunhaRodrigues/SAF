import { createContext, useContext, useState, useEffect } from "react";
import type { AuthUser, AuthContextType, LoginCredentials } from "@/features/auth/types/auth";
import { loginService } from "@/features/auth/services/auth-service";

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("@saf:user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("@saf:user");
      }
    }
  }, []);

  async function login(credentials: LoginCredentials) {
    const { token, user } = await loginService(credentials);
    localStorage.setItem("@saf:token", token);
    localStorage.setItem("@saf:user", JSON.stringify(user));
    setUser(user);
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
