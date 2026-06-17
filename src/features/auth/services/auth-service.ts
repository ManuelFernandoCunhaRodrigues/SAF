import { api } from "@/shared/services/api";
import type { AuthResponse, LoginCredentials } from "../types/auth";

export async function loginService(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/users/login", credentials);
  return response.data;
}

export async function logoutService(): Promise<void> {
  localStorage.removeItem("@saf:token");
  localStorage.removeItem("@saf:user");
}
