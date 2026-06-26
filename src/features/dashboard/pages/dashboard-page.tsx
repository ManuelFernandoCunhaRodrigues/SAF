import { useAuthContext } from "@/app/providers/use-auth";
import { useDashboardStats } from "../hooks/use-dashboard";
import {
  Calendar,
  AlertTriangle, DollarSign, Clock,
  Zap,
} from "lucide-react";

/* ─── card base reutilizável ─── */
const C = "bg-white dark:bg-[#18181B] border border-zinc-100 dark:border-[#27272A] rounded-2xl p-6";

function safeNumber(value: number | string | null | undefined) {
  const numericValue = Number(value ?? 0);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function formatNumber(value: number | string | null | undefined) {
  return safeNumber(value).toLocaleString("pt-BR");
}

function formatCurrency(value: number | string | null | undefined) {
  return safeNumber(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function KpiValue({
  value,
  isLoading,
  isError,
}: {
  value: string;
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) {
    return (
      <span className="block h-[25px] w-24 rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
    );
  }

  return (
    <span className={isError ? "text-red-500 dark:text-[#EF4444]" : undefined}>
      {isError ? "Erro" : value}
    </span>
  );
}

/* ─── placeholder reutilizável ─── */
function SectionPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{description}</p>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuthContext();
  const {
    data: stats,
    isLoading: statsLoading,
    isFetching: statsFetching,
    isError: statsError,
    refetch,
  } = useDashboardStats();
  const shouldShowCardError = statsError && !stats;

  const kpis = [
    { label: "Cobranças enviadas",   value: formatNumber(stats?.totalInvoices),    sub: "total cadastradas", Icon: Zap,           iBg: "bg-blue-50 dark:bg-[#2563EB]/10",    iC: "text-blue-600 dark:text-[#3B82F6]" },
    { label: "Pagamentos recebidos", value: formatCurrency(stats?.totalReceived),  sub: "valor total pago",  Icon: DollarSign,    iBg: "bg-blue-50 dark:bg-[#3B82F6]/10",    iC: "text-blue-500 dark:text-[#60A5FA]" },
    { label: "Pendentes",            value: formatNumber(stats?.pending),           sub: "aguardando pag.",   Icon: Clock,         iBg: "bg-blue-50 dark:bg-[#93C5FD]/10",    iC: "text-blue-300 dark:text-[#93C5FD]" },
    { label: "Inadimplentes",        value: formatNumber(stats?.overdue),           sub: "requer atenção",    Icon: AlertTriangle, iBg: "bg-red-50 dark:bg-[#EF4444]/10",     iC: "text-red-500 dark:text-[#EF4444]" },
  ];

  return (
    <div className="space-y-5 py-6">

      {/* ── Cabeçalho ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[19px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
            Bem-vindo de volta, {user?.name ?? "Usuário"} 👋
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Gerencie cobranças automáticas, mensagens e pagamentos via WhatsApp
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            disabled
            className="flex items-center gap-2 px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 font-medium shadow-sm whitespace-nowrap cursor-not-allowed opacity-60"
            title="Filtro de período em desenvolvimento"
          >
            <Calendar size={12} className="text-zinc-400 dark:text-zinc-500" />
            Últimos 30 dias
          </button>
        </div>
      </div>

      {/* ── KPIs ── */}
      {statsError && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          <span>Não foi possível carregar os indicadores. Verifique a conexão com a API.</span>
          <button
            type="button"
            onClick={() => void refetch()}
            className="text-xs font-semibold text-red-600 dark:text-red-300 hover:underline whitespace-nowrap"
          >
            Tentar novamente
          </button>
        </div>
      )}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.Icon;
          return (
            <div key={k.label} className={`${C} flex items-center gap-3`} aria-busy={statsLoading || statsFetching}>
              <div className={`w-[42px] h-[42px] rounded-xl ${k.iBg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={k.iC} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider truncate">{k.label}</p>
                <p className="text-[21px] font-bold text-zinc-800 dark:text-zinc-100 mt-0.5 leading-none tracking-tight min-h-[25px] flex items-center">
                  <KpiValue value={k.value} isLoading={statsLoading} isError={shouldShowCardError} />
                </p>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{k.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Gráfico + Fluxo ── */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 268px" }}>

        <div className={C}>
          <SectionPlaceholder
            title="Desempenho de Cobranças"
            description="Gráfico em desenvolvimento. Os dados serão exibidos quando a integração estiver ativa."
          />
        </div>

        <div className={C}>
          <SectionPlaceholder
            title="Fluxo da automação"
            description="Módulo de automação em desenvolvimento. Os dados de atividades e fluxo serão exibidos quando a integração com cobrança automática estiver ativa."
          />
        </div>

      </div>

      {/* ── Cobranças recentes ── */}
      <div className={C}>
        <SectionPlaceholder
          title="Cobranças recentes"
          description="Módulo em desenvolvimento. Os dados serão exibidos quando a integração estiver ativa."
        />
      </div>

      {/* ── Conversão + Atividades ── */}
      <div className="grid grid-cols-2 gap-4">

        <div className={C}>
          <SectionPlaceholder
            title="Conversão por automação"
            description="Módulo em desenvolvimento. Os dados serão exibidos quando a integração estiver ativa."
          />
        </div>

        <div className={C}>
          <SectionPlaceholder
            title="Atividades recentes"
            description="Módulo de automação em desenvolvimento. Os dados de atividades e fluxo serão exibidos quando a integração com cobrança automática estiver ativa."
          />
        </div>

      </div>

    </div>
  );
}
