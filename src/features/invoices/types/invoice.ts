export type InvoiceStatus = "paid" | "pending" | "overdue" | "cancelled";

export type Invoice = {
  id: string;
  number: string;
  clientName: string;
  clientEmail: string;
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
  clientName: string;
  clientEmail: string;
  amount: number;
  status?: InvoiceStatus;
  dueDate: string;
};

export type UpdateInvoiceData = Partial<CreateInvoiceData>;
