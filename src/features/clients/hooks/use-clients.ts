import { useQuery } from "@tanstack/react-query";
import { getClients } from "../services/client-service";

export function useClients(search?: string) {
  return useQuery({
    queryKey: ["clients", search || "all"],
    queryFn: () => getClients(search),
  });
}
