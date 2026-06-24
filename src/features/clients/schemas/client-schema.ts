import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  document: z.string().min(1, "Documento é obrigatório"),
  status: z.enum(["active", "inactive"]).optional().default("active"),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

export const updateClientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
  email: z.string().email("E-mail inválido").optional(),
  phone: z.string().min(1, "Telefone não pode ser vazio").optional(),
  document: z.string().min(1, "Documento não pode ser vazio").optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type UpdateClientInput = z.infer<typeof updateClientSchema>;
