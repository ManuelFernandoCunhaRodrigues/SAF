import { createContext, useContext, useState, useEffect } from "react";
import type { AuthUser, AuthContextType, LoginCredentials } from "@/features/auth/types/auth";

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
