import { useQuery } from "@tanstack/react-query";
import { getClientById } from "../services/client-service";

export function useClient(id: string) {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: () => getClientById(id),
    enabled: Boolean(id),
  });
}
