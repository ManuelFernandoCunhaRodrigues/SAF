import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z
    .string()
    .optional()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "E-mail inválido",
    }),
  phone: z.string().optional(),
  document: z.string().optional(),
  type: z.enum(["individual", "company"], {
    required_error: "Tipo é obrigatório",
  }),
  status: z.enum(["active", "inactive"]),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
