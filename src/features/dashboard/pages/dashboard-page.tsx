import { Users, FileText, DollarSign, Clock } from "lucide-react";
import { StatsCard } from "../components/stats-card";
import { Card, CardContent } from "@/shared/components/ui/card";

const recentActivity = [
  {
    description: "Novo usuário cadastrado: Maria Silva",
    time: "há 2 minutos",
    color: "bg-green-500",
  },
  {
    description: "Fatura #1042 paga por João Santos",
    time: "há 15 minutos",
    color: "bg-blue-500",
  },
  {
    description: "Fatura #1041 emitida para Empresa ABC",
    time: "há 1 hora",
    color: "bg-blue-500",
  },
  {
    description: "Usuário Carlos Oliveira atualizado",
    time: "há 2 horas",
    color: "bg-zinc-400",
  },
  {
    description: "Fatura #1040 vencida — Empresa XYZ",
    time: "há 3 horas",
    color: "bg-red-500",
  },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-800">Visão Geral</h2>
        <p className="text-zinc-500 text-sm mt-1">
          Resumo das atividades do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total de Usuários"
          value="1.284"
          description="+12% em relação ao mês anterior"
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatsCard
          title="Faturas Emitidas"
          value="342"
          description="+8% em relação ao mês anterior"
          icon={FileText}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
        />
        <StatsCard
          title="Receita Total"
          value="R$ 48.500"
          description="+23% em relação ao mês anterior"
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatsCard
          title="Faturas Pendentes"
          value="27"
          description="Aguardando pagamento"
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-zinc-800 mb-4">
              Atividade Recente
            </h3>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.color}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-700">{item.description}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-zinc-800 mb-4">
              Status das Faturas
            </h3>
            <div className="space-y-3">
              {[
                { label: "Pagas", value: 215, total: 342, color: "bg-emerald-500" },
                { label: "Pendentes", value: 100, total: 342, color: "bg-amber-500" },
                { label: "Vencidas", value: 27, total: 342, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-600">{item.label}</span>
                    <span className="font-medium text-zinc-800">
                      {item.value}
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{
                        width: `${Math.round((item.value / item.total) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
