import React from 'react';
import { ArrowDown, ArrowUp, Calendar, Download, Filter, MoreHorizontal, RefreshCw, Share2 } from 'lucide-react';
import { Area, ComposedChart, Line, XAxis, YAxis } from 'recharts';
import { Badge } from '@/shared/components/ui/badge-2';
import { Button } from '@/shared/components/ui/button-1';
import { Card, CardContent, CardHeader, CardTitle, CardToolbar } from '@/shared/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { ChartContainer, ChartTooltip } from '@/shared/components/ui/line-charts-1';
import { chartConfig, chartData } from '@/features/dashboard/mock/sales-chart-mock';
import type { TooltipProps } from '@/features/dashboard/types/sales-chart';

const ChartLabel = ({ label, color }: { label: string; color: string }) => (
  <div className="flex items-center gap-1.5">
    <div
      className="size-3 border-[3px] rounded-full bg-white dark:bg-zinc-900"
      style={{ borderColor: color }}
    />
    <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
  </div>
);

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;

  const filtered = payload.filter((e) => e.dataKey !== 'cobrancasArea');
  const cobrancas = filtered.find((e) => e.dataKey === 'cobrancas');
  const meta = filtered.find((e) => e.dataKey === 'meta');

  return (
    <div className="rounded-xl border border-[#F4F4F5] dark:border-[#27272A] bg-white dark:bg-[#18181B] px-3.5 py-3 shadow-lg shadow-black/20 min-w-[180px]">
      <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 tracking-wide mb-2.5">
        {label}
      </p>
      <div className="space-y-2">
        {filtered.map((entry) => {
          const cfg = chartConfig[entry.dataKey as keyof typeof chartConfig];
          const pctDiff =
            cobrancas && meta && entry.dataKey === 'meta'
              ? ((entry.value - cobrancas.value) / cobrancas.value) * 100
              : null;

          return (
            <div key={entry.dataKey} className="flex items-center gap-2 text-xs">
              <ChartLabel label={cfg?.label + ':'} color={entry.color} />
              <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  maximumFractionDigits: 0,
                }).format(entry.value)}
              </span>
              {pctDiff !== null && (
                <Badge
                  variant={pctDiff > 0 ? 'primary' : 'destructive'}
                  appearance="light"
                  className="flex items-center gap-1 text-[10px]"
                >
                  {pctDiff > 0 ? <ArrowUp className="size-2.5" /> : <ArrowDown className="size-2.5" />}
                  {Math.abs(pctDiff).toFixed(0)}%
                </Badge>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export function SalesOverviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho de Cobranças</CardTitle>
        <CardToolbar>
          <div className="flex items-center gap-4 text-xs">
            <ChartLabel label="Cobranças" color={chartConfig.cobrancas.color} />
            <ChartLabel label="Meta" color={chartConfig.meta.color} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" mode="icon" className="-me-1">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom">
              <DropdownMenuItem>
                <Download className="size-4" />
                Exportar dados
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="size-4" />
                Alterar período
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Filter className="size-4" />
                Filtrar dados
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="size-4" />
                Atualizar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Share2 className="size-4" />
                Compartilhar relatório
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardToolbar>
      </CardHeader>

      <CardContent className="px-3 pt-4 pb-2">
        <ChartContainer
          config={chartConfig}
          className="h-[300px] w-full [&_.recharts-curve.recharts-tooltip-cursor]:stroke-transparent"
        >
          <ComposedChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 4 }}>
            <defs>
              <linearGradient id="cobrancasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartConfig.cobrancas.color} stopOpacity={0.18} />
                <stop offset="100%" stopColor={chartConfig.cobrancas.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748B' }}
              dy={5}
              tickMargin={10}
            />

            <YAxis
              hide
              domain={['dataMin - 5000', 'dataMax + 5000']}
            />

            <ChartTooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#27272A', strokeWidth: 1 }}
            />

            <Area
              type="monotone"
              dataKey="cobrancasArea"
              stroke="transparent"
              fill="url(#cobrancasGradient)"
              strokeWidth={0}
              dot={false}
              activeDot={false}
            />

            <Line
              type="monotone"
              dataKey="cobrancas"
              stroke={chartConfig.cobrancas.color}
              strokeWidth={2.5}
              dot={{ fill: 'white', strokeWidth: 2.5, r: 4, stroke: chartConfig.cobrancas.color }}
              activeDot={{ r: 6, fill: 'white', strokeWidth: 2.5, stroke: chartConfig.cobrancas.color }}
            />

            <Line
              type="monotone"
              dataKey="meta"
              stroke={chartConfig.meta.color}
              strokeWidth={2}
              dot={{ fill: 'white', strokeWidth: 2, r: 4, stroke: chartConfig.meta.color }}
              activeDot={{ r: 5, fill: 'white', strokeWidth: 2, stroke: chartConfig.meta.color }}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

