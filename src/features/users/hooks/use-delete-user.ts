import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { deleteUser } from "../services/user-service";

function resolveErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 404) return "Usuário não encontrado.";
    if (status === 403) return "Você não tem permissão para excluir usuários.";
  }
  return "Não foi possível excluir o usuário. Tente novamente.";
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    ...mutation,
    errorMessage: mutation.isError ? resolveErrorMessage(mutation.error) : null,
  };
}
