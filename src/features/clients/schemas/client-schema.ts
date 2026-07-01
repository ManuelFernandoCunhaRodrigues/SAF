import { z } from "zod";

const optionalText = z.string().trim().optional().or(z.literal(""));

const optionalUf = z
  .string()
  .trim()
  .refine((value) => value === "" || value.length === 2, "Estado deve ter 2 caracteres")
  .optional();

export const createClientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  document: z.string().min(1, "Documento é obrigatório"),
  street: optionalText,
  number: optionalText,
  neighborhood: optionalText,
  zipcode: optionalText,
  city: optionalText,
  state: optionalUf,
  status: z.enum(["active", "inactive"]),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

export const updateClientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
  email: z.string().email("E-mail inválido").optional(),
  phone: z.string().min(1, "Telefone não pode ser vazio").optional(),
  document: z.string().min(1, "Documento não pode ser vazio").optional(),
  street: optionalText,
  number: optionalText,
  neighborhood: optionalText,
  zipcode: optionalText,
  city: optionalText,
  state: optionalUf,
  status: z.enum(["active", "inactive"]).optional(),
});

export type UpdateClientInput = z.infer<typeof updateClientSchema>;
