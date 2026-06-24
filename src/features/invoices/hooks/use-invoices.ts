import { useQuery } from "@tanstack/react-query";
import { getInvoices } from "../services/invoice-service";
import type { InvoiceStatus } from "../types/invoice";

export function useInvoices(status?: InvoiceStatus) {
  return useQuery({
    queryKey: ["invoices", status ?? "all"],
    queryFn: () => getInvoices(status),
  });
}
