import { api } from "@/shared/services/api";
import type { User } from "../types/user";

export async function getUsers(): Promise<User[]> {
  const response = await api.get("/users");
  return response.data;
}

export async function getUserById(id: string): Promise<User> {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

export async function createUser(data: Omit<User, "id">): Promise<User> {
  const response = await api.post("/users", data);
  return response.data;
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}
