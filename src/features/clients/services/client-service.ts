import { api } from "@/shared/services/api";
import type { Client, CreateClientData, UpdateClientData } from "../types/client";

export async function getClients(): Promise<Client[]> {
  const response = await api.get<Client[]>("/clients");
  return response.data;
}

export async function getClientById(id: string): Promise<Client> {
  const response = await api.get<Client>(`/clients/${id}`);
  return response.data;
}

export async function createClient(data: CreateClientData): Promise<Client> {
  const response = await api.post<Client>("/clients", data);
  return response.data;
}

export async function updateClient(id: string, data: UpdateClientData): Promise<Client> {
  const response = await api.put<Client>(`/clients/${id}`, data);
  return response.data;
}

export async function deleteClient(id: string): Promise<void> {
  await api.delete(`/clients/${id}`);
}
