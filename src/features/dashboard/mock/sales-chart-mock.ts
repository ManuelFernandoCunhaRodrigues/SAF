import type { ChartConfig } from '@/shared/components/ui/line-charts-1';

export const chartData = [
  { month: 'Jan 25', meta: 40000, cobrancas: 48320, cobrancasArea: 48320 },
  { month: 'Fev 25', meta: 50000, cobrancas: 43500, cobrancasArea: 43500 },
  { month: 'Mar 25', meta: 52000, cobrancas: 58000, cobrancasArea: 58000 },
  { month: 'Abr 25', meta: 55000, cobrancas: 47200, cobrancasArea: 47200 },
  { month: 'Mai 25', meta: 48000, cobrancas: 62100, cobrancasArea: 62100 },
  { month: 'Jun 25', meta: 60000, cobrancas: 55800, cobrancasArea: 55800 },
];

export const chartConfig = {
  meta: {
    label: 'Meta',
    color: '#93c5fd',
  },
  cobrancas: {
    label: 'Cobranças',
    color: '#2563EB',
  },
} satisfies ChartConfig;
