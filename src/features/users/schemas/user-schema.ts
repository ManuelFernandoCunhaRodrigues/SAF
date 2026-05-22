export type CreateUserInput = {
  name: string;
  email: string;
  status: "active" | "inactive";
};

export function validateCreateUser(input: CreateUserInput): string[] {
  const errors: string[] = [];
  if (!input.name.trim()) errors.push("Nome é obrigatório");
  if (!input.email.trim()) errors.push("Email é obrigatório");
  if (!input.email.includes("@")) errors.push("Email inválido");
  return errors;
}
