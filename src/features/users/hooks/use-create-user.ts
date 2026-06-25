import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createUser } from "../services/user-service";
import type { CreateUserData } from "../types/user";

function resolveErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message: string = error.response?.data?.message ?? "";
    if (status === 409 || message.toLowerCase().includes("e-mail")) {
      return "Já existe um usuário cadastrado com este e-mail.";
    }
    if (status === 400) {
      return "Dados inválidos. Verifique os campos e tente novamente.";
    }
    if (status === 403) {
      return "Você não tem permissão para criar usuários.";
    }
  }
  return "Não foi possível criar o usuário. Tente novamente.";
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateUserData) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    ...mutation,
    errorMessage: mutation.isError ? resolveErrorMessage(mutation.error) : null,
  };
}
