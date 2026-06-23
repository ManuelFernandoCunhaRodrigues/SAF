import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createClient } from "../services/client-service";
import type { CreateClientInput } from "../schemas/client-schema";

function buildPayload(data: CreateClientInput) {
  return {
    name: data.name,
    email: data.email || undefined,
    phone: data.phone || undefined,
    document: data.document || undefined,
    type: data.type,
    status: data.status,
  };
}

function resolveErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message: string = error.response?.data?.message ?? "";

    if (
      status === 400 ||
      status === 409 ||
      message.toLowerCase().includes("documento")
    ) {
      return "Já existe um cliente cadastrado com este documento.";
    }
  }
  return "Não foi possível cadastrar o cliente. Tente novamente.";
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateClientInput) => createClient(buildPayload(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  return {
    ...mutation,
    errorMessage: mutation.isError ? resolveErrorMessage(mutation.error) : null,
  };
}
