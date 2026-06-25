import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { updateInvoice } from "../services/invoice-service";
import type { InvoiceStatus } from "../types/invoice";

function resolveErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 404) return "Fatura não encontrada.";
    if (status === 400) return "Status inválido.";
  }
  return "Não foi possível atualizar o status. Tente novamente.";
}

export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: InvoiceStatus }) =>
      updateInvoice(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  return {
    ...mutation,
    errorMessage: mutation.isError ? resolveErrorMessage(mutation.error) : null,
  };
}
