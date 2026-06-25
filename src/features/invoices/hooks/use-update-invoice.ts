import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { updateInvoice } from "../services/invoice-service";
import type { UpdateInvoiceData } from "../types/invoice";

function resolveErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 400) return "Dados inválidos. Verifique os campos e tente novamente.";
    if (status === 404) return "Fatura não encontrada.";
  }
  return "Não foi possível atualizar a fatura. Tente novamente.";
}

export function useUpdateInvoice(id: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateInvoiceData) => updateInvoice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  return {
    ...mutation,
    errorMessage: mutation.isError ? resolveErrorMessage(mutation.error) : null,
  };
}
