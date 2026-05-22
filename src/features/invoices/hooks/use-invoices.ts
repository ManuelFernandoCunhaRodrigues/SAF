import { useQuery } from "@tanstack/react-query";
import { getInvoices } from "../services/invoice-service";

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });
}
