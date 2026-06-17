import { api } from "@/shared/services/api";

export type DashboardStats = {
  totalUsers: number;
  totalInvoices: number;
  totalReceived: number;
  pending: number;
  overdue: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<DashboardStats>("/dashboard/stats");
  return response.data;
}
