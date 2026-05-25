import { useContext } from "react";
import { AuthContext } from "./auth-context";
import type { AuthContextType } from "@/features/auth/types/auth";

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
}
