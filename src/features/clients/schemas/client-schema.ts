import { z } from "zod";

const emptyToUndefined = (v: unknown) => (v === "" ? undefined : v);

export const createClientSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.preprocess(
    emptyToUndefined,
    z.string().email("E-mail inválido").optional()
  ),
  phone: z.preprocess(emptyToUndefined, z.string().optional()),
  document: z.preprocess(emptyToUndefined, z.string().optional()),
  type: z.enum(["individual", "company"]),
  status: z.enum(["active", "inactive"]),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

export const updateClientSchema = createClientSchema;
export type UpdateClientInput = CreateClientInput;
