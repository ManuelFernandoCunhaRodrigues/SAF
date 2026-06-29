import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, getDashboardRecentInvoices, getDashboardChart } from "../services/dashboard-service";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    staleTime: 1000 * 60,
  });
}

export function useRecentInvoices() {
  return useQuery({
    queryKey: ["dashboard-recent-invoices"],
    queryFn: getDashboardRecentInvoices,
    staleTime: 1000 * 60,
  });
}

export function useDashboardChart() {
  return useQuery({
    queryKey: ["dashboard-chart"],
    queryFn: getDashboardChart,
    staleTime: 1000 * 60 * 5,
  });
}
