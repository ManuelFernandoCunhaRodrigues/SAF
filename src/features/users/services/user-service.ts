import { api } from "@/shared/services/api";
import type { User, CreateUserData, UpdateUserData } from "../types/user";

export async function getUsers(): Promise<User[]> {
  const response = await api.get<User[]>("/users");
  return response.data;
}

export async function getUserById(id: string): Promise<User> {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
}

export async function createUser(data: CreateUserData): Promise<User> {
  const response = await api.post<User>("/users", data);
  return response.data;
}

export async function updateUser(id: string, data: UpdateUserData): Promise<User> {
  const response = await api.put<User>(`/users/${id}`, data);
  return response.data;
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}
