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
};
