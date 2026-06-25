import { z } from "zod";

export const invoiceSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente."),
  amount: z.number().positive("O valor deve ser maior que zero."),
  dueDate: z.string().min(1, "Informe a data de vencimento."),
  status: z.enum(["pending", "paid", "overdue", "cancelled"]),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
