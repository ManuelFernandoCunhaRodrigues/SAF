import { api } from "@/shared/services/api";

// ─── Stats ────────────────────────────────────────────────────────────────────

export type DashboardStats = {
  totalUsers: number;
  totalInvoices: number;
  totalReceived: number;
  pending: number;
  overdue: number;
};

type DashboardStatsApiResponse = {
  totalUsers?: number | string | null;
  totalInvoices?: number | string | null;
  totalReceived?: number | string | null;
  pending?: number | string | null;
  overdue?: number | string | null;
};

function toSafeNumber(value: number | string | null | undefined): number {
  const numericValue = Number(value ?? 0);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function mapDashboardStats(data: DashboardStatsApiResponse | null): DashboardStats {
  return {
    totalUsers: toSafeNumber(data?.totalUsers),
    totalInvoices: toSafeNumber(data?.totalInvoices),
    totalReceived: toSafeNumber(data?.totalReceived),
    pending: toSafeNumber(data?.pending),
    overdue: toSafeNumber(data?.overdue),
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<DashboardStatsApiResponse | null>("/dashboard/stats");
  return mapDashboardStats(response.data);
}

// ─── Cobranças recentes ───────────────────────────────────────────────────────

export type RecentInvoice = {
  id: string;
  number: string;
  clientName: string;
  amount: number | string;
  status: string;
  dueDate: string;
};

export async function getDashboardRecentInvoices(): Promise<RecentInvoice[]> {
  const response = await api.get<RecentInvoice[]>("/invoices");
  return response.data.slice(0, 5);
}

// ─── Gráfico mensal ───────────────────────────────────────────────────────────

export type DashboardChartItem = {
  month: string;
  received: number;
  pending: number;
  overdue: number;
};

export async function getDashboardChart(): Promise<DashboardChartItem[]> {
  const response = await api.get<DashboardChartItem[]>("/dashboard/chart");
  return response.data;
}
