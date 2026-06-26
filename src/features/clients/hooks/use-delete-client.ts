import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { deleteClient } from "../services/client-service";

function resolveErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 404) return "Cliente não encontrado.";
    if (status === 403) return "Você não tem permissão para excluir clientes.";
  }
  return "Não foi possível excluir o cliente. Tente novamente.";
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  return {
    ...mutation,
    errorMessage: mutation.isError ? resolveErrorMessage(mutation.error) : null,
  };
}
