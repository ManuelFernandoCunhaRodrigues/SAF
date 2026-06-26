import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { updateUser } from "../services/user-service";
import type { UpdateUserData } from "../types/user";

function resolveErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message: string = error.response?.data?.message ?? "";
    if (status === 409 || message.toLowerCase().includes("e-mail")) {
      return "Já existe um usuário cadastrado com este e-mail.";
    }
    if (status === 404) return "Usuário não encontrado.";
    if (status === 400) return "Dados inválidos. Verifique os campos e tente novamente.";
    if (status === 403) return "Você não tem permissão para editar usuários.";
  }
  return "Não foi possível atualizar o usuário. Tente novamente.";
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateUserData) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    ...mutation,
    errorMessage: mutation.isError ? resolveErrorMessage(mutation.error) : null,
  };
}
