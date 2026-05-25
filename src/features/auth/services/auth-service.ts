import { api } from "@/shared/services/api";
import type { AuthResponse, LoginCredentials } from "../types/auth";

export async function loginService(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  } catch {
    // Mock response for demo purposes
    return {
      token: "mock-token-" + Date.now(),
      user: {
        id: "1",
        email: credentials.email,
        name: credentials.email.split("@")[0],
        role: "admin"
      }
    };
  }
}

export async function logoutService(): Promise<void> {
  await api.post("/auth/logout");
}
