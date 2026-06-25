export type InvoiceStatus = "paid" | "pending" | "overdue" | "cancelled";

export type Invoice = {
  id: string;
  number: string;
  clientId?: string | null;
  client?: {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    document?: string | null;
    status: "active" | "inactive";
  };
  clientName: string;
  clientEmail: string | null;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceApiResponse = Omit<Invoice, "amount"> & {
  amount: number | string;
};

export type CreateInvoiceData = {
  clientId: string;
  amount: number;
  status?: InvoiceStatus;
  dueDate: string;
};

export type UpdateInvoiceData = Partial<{
  clientId: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
}>;
