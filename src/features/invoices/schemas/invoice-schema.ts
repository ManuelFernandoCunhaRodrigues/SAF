import { z } from "zod";

export const invoiceSchema = z.object({
  clientName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  clientEmail: z.string().email("E-mail inválido"),
  amount: z.number().positive("Valor deve ser maior que zero"),
  dueDate: z.string().min(1, "Data de vencimento é obrigatória"),
  status: z.enum(["paid", "pending", "overdue", "cancelled"]),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
