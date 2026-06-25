import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createInvoice } from "../services/invoice-service";
import type { CreateInvoiceData } from "../types/invoice";

function resolveErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 400) return "Dados inválidos. Verifique os campos e tente novamente.";
    if (status === 404) return "Cliente não encontrado.";
  }
  return "Não foi possível criar a fatura. Tente novamente.";
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateInvoiceData) => createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  return {
    ...mutation,
    errorMessage: mutation.isError ? resolveErrorMessage(mutation.error) : null,
  };
}
