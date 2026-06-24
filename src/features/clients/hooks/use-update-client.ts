import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { updateClient } from "../services/client-service";
import type { UpdateClientInput } from "../schemas/client-schema";

function resolveErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message: string = error.response?.data?.message ?? "";
    if (status === 409 || message.toLowerCase().includes("documento")) {
      return "Já existe um cliente cadastrado com este documento.";
    }
    if (status === 404) {
      return "Cliente não encontrado.";
    }
    if (status === 400) {
      return "Dados inválidos. Verifique os campos e tente novamente.";
    }
  }
  return "Não foi possível atualizar o cliente. Tente novamente.";
}

export function useUpdateClient(id: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateClientInput) => updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients", id] });
    },
  });

  return {
    ...mutation,
    errorMessage: mutation.isError ? resolveErrorMessage(mutation.error) : null,
  };
}
