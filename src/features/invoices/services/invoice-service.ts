import { api } from "@/shared/services/api";
import type { Invoice } from "../types/invoice";

export async function getInvoices(): Promise<Invoice[]> {
  const response = await api.get<Invoice[]>("/invoices");
  return response.data;
}

export async function getInvoiceById(id: string): Promise<Invoice> {
  const response = await api.get<Invoice>(`/invoices/${id}`);
  return response.data;
}

export async function createInvoice(
  data: Omit<Invoice, "id" | "number" | "createdAt">
): Promise<Invoice> {
  const response = await api.post<Invoice>("/invoices", data);
  return response.data;
}

export async function deleteInvoice(id: string): Promise<void> {
  await api.delete(`/invoices/${id}`);
}
