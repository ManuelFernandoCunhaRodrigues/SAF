import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { deleteInvoice } from "../services/invoice-service";

function resolveErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 404) return "Fatura não encontrada.";
  }
  return "Não foi possível excluir a fatura. Tente novamente.";
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  return {
    ...mutation,
    errorMessage: mutation.isError ? resolveErrorMessage(mutation.error) : null,
  };
}
