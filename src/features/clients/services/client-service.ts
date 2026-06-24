import { api } from "@/shared/services/api";
import type { ApiResponse } from "@/shared/types/global";
import type { Client, CreateClientData, UpdateClientData } from "../types/client";

export async function getClients(): Promise<Client[]> {
  const response = await api.get<ApiResponse<Client[]>>("/clients");
  return response.data.data;
}

export async function getClientById(id: string): Promise<Client> {
  const response = await api.get<ApiResponse<Client>>(`/clients/${id}`);
  return response.data.data;
}

export async function createClient(data: CreateClientData): Promise<Client> {
  const response = await api.post<ApiResponse<Client>>("/clients", data);
  return response.data.data;
}

export async function updateClient(id: string, data: UpdateClientData): Promise<Client> {
  const response = await api.put<ApiResponse<Client>>(`/clients/${id}`, data);
  return response.data.data;
}

export async function deleteClient(id: string): Promise<void> {
  await api.delete(`/clients/${id}`);
}
