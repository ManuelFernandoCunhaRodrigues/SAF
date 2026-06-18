import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CHART_DATA = [
  { month: "Jan 25", cobrancas: 50000, meta: 42000 },
  { month: "Fev 25", cobrancas: 46000, meta: 52000 },
  { month: "Mar 25", cobrancas: 61000, meta: 54000 },
  { month: "Abr 25", cobrancas: 53000, meta: 58000 },
  { month: "Mai 25", cobrancas: 65000, meta: 51000 },
  { month: "Jun 25", cobrancas: 59000, meta: 64000 },
];

const fmtAxisBRL = (v: number) => `R$ ${(v / 1000).toFixed(0)} mil`;

const fmtCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

interface TooltipPayloadItem {
  dataKey: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const cobr = payload.find((p) => p.dataKey === "cobrancas")?.value ?? 0;
  const meta = payload.find((p) => p.dataKey === "meta")?.value ?? 0;
  const diff = cobr - meta;
  const pct = meta > 0 ? Math.abs(Math.round((diff / meta) * 100)) : 0;
  const isUp = diff >= 0;

  return (
    <div
      className="rounded-xl px-4 py-3 shadow-2xl min-w-[168px]"
      style={{ background: "#18181B", border: "1px solid #2A2D36" }}
    >
      <p className="text-xs font-semibold mb-2.5" style={{ color: "#A1A1AA" }}>
        {label}
      </p>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#3B82F6" }} />
          <span className="text-xs" style={{ color: "#A1A1AA" }}>
            Cobranças:
          </span>
          <span className="text-xs font-bold ml-auto" style={{ color: "#F4F4F5" }}>
            {fmtCurrency(cobr)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#93C5FD" }} />
          <span className="text-xs" style={{ color: "#A1A1AA" }}>
            Meta:
          </span>
          <span className="text-xs font-bold ml-auto" style={{ color: "#F4F4F5" }}>
            {fmtCurrency(meta)}
          </span>
        </div>
        {pct > 0 && (
          <div className="pt-1">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                color: isUp ? "#22C55E" : "#EF4444",
                background: isUp ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
              }}
            >
              {isUp ? "↑" : "↓"} {pct}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function PerformanceChart() {
  const [filter, setFilter] = useState<"Diário" | "Semanal" | "Mensal">("Mensal");

  return (
    <div
      className="rounded-2xl p-6 flex flex-col shadow-xl"
      style={{ background: "#111318", border: "1px solid #2A2D36" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-sm font-bold" style={{ color: "#F4F4F5" }}>
            Desempenho de Cobranças
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#A1A1AA" }}>
            Cobranças vs meta por período
          </p>
        </div>
        <div className="flex items-center gap-5">
          {/* Legenda */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: "#2563EB" }} />
              <span className="text-xs" style={{ color: "#D4D4D8" }}>
                Cobranças
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: "#93C5FD" }} />
              <span className="text-xs" style={{ color: "#D4D4D8" }}>
                Meta
              </span>
            </div>
          </div>
          {/* Filtros */}
          <div className="flex gap-1">
            {(["Diário", "Semanal", "Mensal"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1 rounded-lg text-xs font-semibold border transition-colors"
                style={
                  filter === f
                    ? { background: "#2563EB", color: "#fff", borderColor: "#2563EB" }
                    : { background: "transparent", color: "#A1A1AA", borderColor: "#2A2D36" }
                }
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={CHART_DATA}
            margin={{ top: 10, right: 8, left: 4, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradCobrancas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.08)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "#A1A1AA", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis hide domain={[35000, 70000]} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="cobrancas"
              stroke="#2563EB"
              strokeWidth={2.5}
              fill="url(#gradCobrancas)"
              dot={{ r: 4, fill: "#2563EB", strokeWidth: 2, stroke: "#111318" }}
              activeDot={{ r: 6, fill: "#3B82F6", strokeWidth: 2, stroke: "#111318" }}
            />
            <Area
              type="monotone"
              dataKey="meta"
              stroke="#93C5FD"
              strokeWidth={2}
              fillOpacity={0}
              dot={{ r: 3.5, fill: "#93C5FD", strokeWidth: 2, stroke: "#111318" }}
              activeDot={{ r: 5.5, fill: "#93C5FD", strokeWidth: 2, stroke: "#111318" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
