import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { generateInvoicePix } from "../services/invoice-service";

function resolveErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const msg = error.response?.data?.message as string | undefined;
    if (status === 404) return "Fatura não encontrada.";
    if (status === 409) return "Geração de Pix já em andamento. Aguarde alguns instantes e tente novamente.";
    if (status === 422) return msg ?? "Não é possível gerar Pix para esta fatura.";
    if (status === 503) return "Integração Efí não está habilitada no servidor.";
    if (status === 502 || status === 504) return "Falha ao comunicar com a Efí. Tente novamente.";
  }
  return "Não foi possível gerar o Pix. Tente novamente.";
}

export function useGenerateInvoicePix() {
  const mutation = useMutation({
    mutationFn: (invoiceId: string) => generateInvoicePix(invoiceId),
  });

  return {
    ...mutation,
    errorMessage: mutation.isError ? resolveErrorMessage(mutation.error) : null,
  };
}
