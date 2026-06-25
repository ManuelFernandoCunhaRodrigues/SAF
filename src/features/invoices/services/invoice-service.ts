import { api } from "@/shared/services/api";
import type {
  CreateInvoiceData,
  Invoice,
  InvoiceApiResponse,
  InvoiceStatus,
  UpdateInvoiceData,
} from "../types/invoice";

function mapInvoice(invoice: InvoiceApiResponse): Invoice {
  const amount =
    typeof invoice.amount === "number" ? invoice.amount : Number(invoice.amount);

  return {
    ...invoice,
    amount: Number.isFinite(amount) ? amount : 0,
  };
}

export async function getInvoices(status?: InvoiceStatus): Promise<Invoice[]> {
  const response = await api.get<InvoiceApiResponse[]>("/invoices", {
    params: status ? { status } : undefined,
  });
  return response.data.map(mapInvoice);
}

export async function getInvoiceById(id: string): Promise<Invoice> {
  const response = await api.get<InvoiceApiResponse>(`/invoices/${id}`);
  return mapInvoice(response.data);
}

export async function createInvoice(data: CreateInvoiceData): Promise<Invoice> {
  const response = await api.post<InvoiceApiResponse>("/invoices", data);
  return mapInvoice(response.data);
}

export async function updateInvoice(
  id: string,
  data: UpdateInvoiceData
): Promise<Invoice> {
  const response = await api.put<InvoiceApiResponse>(`/invoices/${id}`, data);
  return mapInvoice(response.data);
}

export async function deleteInvoice(id: string): Promise<void> {
  await api.delete(`/invoices/${id}`);
}
