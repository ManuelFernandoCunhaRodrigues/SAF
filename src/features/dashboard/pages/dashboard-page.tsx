import { useEffect, useState } from "react";
import { useAuthContext } from "@/app/providers/use-auth";
import { SalesOverviewChart } from "@/features/dashboard/components/sales-overview-chart";
import {
  Calendar, Plus, TrendingUp, TrendingDown,
  MessageSquare, Zap,
  AlertTriangle, DollarSign, Clock, CheckCircle,
  FileText, ArrowRight,
} from "lucide-react";

type StatusCobranca = "Pago" | "Pendente" | "Vencido" | "Respondido";

const COBRANCAS: {
  cliente: string; doc: string; venc: string;
  canal: string; status: StatusCobranca; etapa: string; valor: string;
  etapaCor?: string; canalCor?: string;
}[] = [
  { cliente: "João Silva",     doc: "CPF 123.456.789-00",      venc: "16 Jun 2025", canal: "WhatsApp",        canalCor: "blue",   status: "Pago",       etapa: "Pós-vencimento D+1",  valor: "R$ 189,90" },
  { cliente: "Maria Souza",    doc: "CPF 987.654.321-00",      venc: "15 Jun 2025", canal: "WhatsApp + Pix",  canalCor: "blue",   status: "Pendente",   etapa: "No vencimento",       valor: "R$ 249,90" },
  { cliente: "Carlos Lima",    doc: "CNPJ 12.345.678/0001-90", venc: "14 Jun 2025", canal: "Boleto",          canalCor: "violet", status: "Vencido",    etapa: "7 dias em atraso",    valor: "R$ 329,90", etapaCor: "red" },
  { cliente: "Ana Paula",      doc: "CPF 456.123.789-00",      venc: "13 Jun 2025", canal: "WhatsApp",        canalCor: "blue",   status: "Respondido", etapa: "D-3 pré-vencimento",  valor: "R$ 159,90" },
  { cliente: "Fernanda Costa", doc: "CNPJ 98.765.432/0001-10", venc: "12 Jun 2025", canal: "WhatsApp+Boleto", canalCor: "blue",   status: "Pago",       etapa: "No vencimento",       valor: "R$ 549,90" },
  { cliente: "Ricardo Faria",  doc: "CPF 789.012.345-00",      venc: "11 Jun 2025", canal: "SMS",             canalCor: "amber",  status: "Vencido",    etapa: "Enc. financeiro",     valor: "R$ 899,90", etapaCor: "violet" },
];

const STATUS_CFG: Record<StatusCobranca, { bg: string; text: string; dot: string }> = {
  Pago:       { bg: "bg-[#EFF6FF] dark:bg-[#2563EB]/10", text: "text-[#1E3A8A] dark:text-[#60A5FA]",  dot: "bg-blue-600 dark:bg-[#60A5FA]" },
  Pendente:   { bg: "bg-slate-50 dark:bg-[#64748B]/10",  text: "text-slate-600 dark:text-[#94A3B8]",  dot: "bg-slate-500 dark:bg-[#94A3B8]" },
  Vencido:    { bg: "bg-zinc-100 dark:bg-[#52525B]/10",    text: "text-zinc-600 dark:text-[#94A3B8]",    dot: "bg-zinc-1000 dark:bg-[#94A3B8]" },
  Respondido: { bg: "bg-blue-50 dark:bg-[#2563EB]/10",   text: "text-blue-600 dark:text-[#60A5FA]",   dot: "bg-blue-500 dark:bg-[#60A5FA]" },
};

const CANAL_CFG: Record<string, string> = {
  blue:   "bg-[#EFF6FF] dark:bg-blue-500/10 text-[#1E3A8A] dark:text-blue-400",
  violet: "bg-slate-100 dark:bg-slate-700/20 text-slate-500 dark:text-slate-400",
  amber:  "bg-[#EFF6FF] dark:bg-blue-900/15 text-blue-600 dark:text-blue-300",
};

const ETAPA_CFG: Record<string, string> = {
  red:    "bg-zinc-100/70 dark:bg-zinc-900/10 text-zinc-500 dark:text-zinc-500/70",
  violet: "bg-[#EFF6FF] dark:bg-blue-900/20 text-[#1E3A8A] dark:text-blue-300",
};

const C = "bg-white dark:bg-[#18181B] border border-zinc-100 dark:border-[#27272A] rounded-2xl p-6";

function triggerDownload(content: string, filename: string, mime: string) {
  const blob = new Blob(["﻿" + content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function exportCSV() {
  const headers = ["Cliente", "Documento", "Vencimento", "Canal", "Status", "Etapa", "Valor"];
  const rows = COBRANCAS.map((c) => [c.cliente, c.doc, c.venc, c.canal, c.status, c.etapa, c.valor]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(";")).join("\n");
  triggerDownload(csv, "relatorio-cobrancas.csv", "text/csv;charset=utf-8");
}

function exportXLS() {
  const th = ["Cliente", "Documento", "Vencimento", "Canal", "Status", "Etapa", "Valor"];
  const trs = COBRANCAS.map(
    (c) => `<tr>${[c.cliente, c.doc, c.venc, c.canal, c.status, c.etapa, c.valor].map((v) => `<td>${v}</td>`).join("")}</tr>`
  ).join("");
  const xls = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"/></head><body><table><tr>${th.map((h) => `<th>${h}</th>`).join("")}</tr>${trs}</table></body></html>`;
  triggerDownload(xls, "relatorio-cobrancas.xls", "application/vnd.ms-excel");
}

function exportPDF() {
  window.print();
}

export function DashboardPage() {
  const { user } = useAuthContext();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-5 py-6">

      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
<p className="text-sm font-medium text-zinc-700 dark:text-[#CBD5E1] mt-2">
            Bem-vindo de volta, {user?.name ?? "Usuário"} 👋
          </p>
          <p className="text-xs text-zinc-500 dark:text-[#64748B] mt-0.5">
            Gerencie cobranças automáticas, mensagens e pagamentos via WhatsApp
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="flex items-center gap-2 px-3 py-2 border border-zinc-100 dark:border-[#27272A] rounded-lg bg-white dark:bg-[#18181B] text-xs text-zinc-600 dark:text-[#94A3B8] font-medium whitespace-nowrap hover:bg-zinc-50 dark:hover:bg-[#27272A] transition-colors">
            <Calendar size={12} className="text-zinc-400 dark:text-[#64748B]" />
            Últimos 30 dias
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-blue-900/30">
            <Plus size={12} strokeWidth={2.8} />
            Nova Automação
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {([
          { label: "Cobranças enviadas",   value: "1.847",     change: "+14,2%",  up: true,  sub: "este mês",        Icon: Zap,           iBg: "bg-blue-50 dark:bg-[#2563EB]/10",    iC: "text-blue-600 dark:text-[#60A5FA]" },
          { label: "Pagamentos recebidos", value: "R$ 48.320", change: "+22,5%",  up: true,  sub: "vs mês anterior", Icon: DollarSign,    iBg: "bg-blue-50 dark:bg-[#2563EB]/10", iC: "text-blue-600 dark:text-[#60A5FA]" },
          { label: "Pendentes",            value: "342",       change: "estável", up: null,  sub: "aguardando pag.", Icon: Clock,         iBg: "bg-slate-50 dark:bg-[#64748B]/10",   iC: "text-slate-600 dark:text-[#94A3B8]" },
          { label: "Inadimplentes",        value: "89",        change: "+8,4%",   up: false, sub: "requer atenção",  Icon: AlertTriangle, iBg: "bg-zinc-100 dark:bg-[#52525B]/10",     iC: "text-zinc-600 dark:text-[#94A3B8]" },
        ] as const).map((k) => {
          const Icon = k.Icon;
          return (
            <div key={k.label} className={`${C} flex items-center gap-3`}>
              <div className={`w-[42px] h-[42px] rounded-xl ${k.iBg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={k.iC} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-zinc-500 dark:text-[#64748B] uppercase tracking-wider truncate">{k.label}</p>
                <p className="text-[21px] font-bold text-zinc-800 dark:text-[#F1F5F9] mt-0.5 leading-none tracking-tight">{k.value}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {k.up === null ? (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-[#27272A] text-zinc-600 dark:text-[#64748B]">= {k.change}</span>
                  ) : (
                    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${k.up ? "bg-blue-50 dark:bg-[#2563EB]/10 text-blue-600 dark:text-[#60A5FA]" : "bg-zinc-100 dark:bg-[#52525B]/10 text-zinc-600 dark:text-[#94A3B8]"}`}>
                      {k.up ? <TrendingUp size={9} /> : <TrendingDown size={9} />} {k.change}
                    </span>
                  )}
                  <span className="text-[10px] text-zinc-400 dark:text-[#94A3B8]">{k.sub}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Área analítica: Gráfico (2/3) + Status (1/3) */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "2fr 1fr" }}>

        <SalesOverviewChart />

        <div className={C}>
          <p className="text-sm font-bold text-zinc-800 dark:text-[#F1F5F9]">Status das cobranças</p>
          <p className="text-xs text-zinc-500 dark:text-[#64748B] mt-0.5 mb-4">Distribuição atual</p>
          {[
            { label: "Pagas",            value: 538, pct: 43, color: "bg-[#2563EB]" },
            { label: "Pendentes",        value: 367, pct: 29, color: "bg-[#64748B]" },
            { label: "Aguardando resp.", value: 200, pct: 16, color: "bg-[#3B82F6]" },
            { label: "Inadimplente",     value:  89, pct:  7, color: "bg-[#52525B]" },
            { label: "Enc. financeiro",  value:  23, pct:  2, color: "bg-[#64748B]" },
          ].map((item) => (
            <div key={item.label} className="mb-4 last:mb-0">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-zinc-700 dark:text-[#CBD5E1]">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-800 dark:text-[#F1F5F9]">{item.value}</span>
                  <span className="text-[10px] text-zinc-400 dark:text-[#64748B] w-8 text-right">{item.pct}%</span>
                </div>
              </div>
              <div className="h-[4px] bg-zinc-100 dark:bg-[#27272A] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-700`}
                  style={{ width: animated ? `${item.pct}%` : "0%" }}
                />
              </div>
            </div>
          ))}
          <div className="mt-4 pt-3 border-t border-[#F4F4F5] dark:border-[#27272A] flex justify-between">
            <span className="text-[11px] text-zinc-500 dark:text-[#64748B]">Total de cobranças</span>
            <span className="text-sm font-bold text-zinc-800 dark:text-[#F1F5F9]">1.217</span>
          </div>
        </div>

      </div>

      {/* Tabela */}
      <div className={C}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-bold text-zinc-800 dark:text-[#F1F5F9]">Cobranças recentes</p>
            <p className="text-xs text-zinc-500 dark:text-[#64748B] mt-0.5">Acompanhamento das cobranças automatizadas</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={exportCSV} className="px-3 py-1.5 border border-zinc-100 dark:border-zinc-700 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-800 transition-colors">CSV</button>
            <button onClick={exportXLS} className="px-3 py-1.5 border border-zinc-100 dark:border-zinc-700 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-800 transition-colors">XLS</button>
            <button onClick={exportPDF} className="px-3 py-1.5 border border-zinc-100 dark:border-zinc-700 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-800 transition-colors">PDF</button>
          </div>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#F4F4F5] dark:border-[#27272A]">
              {["Cliente", "Vencimento", "Canal", "Status", "Etapa da régua", "Valor"].map((col, i) => (
                <th
                  key={col}
                  className={`pb-2.5 text-[10px] font-semibold text-[#475569] dark:text-[#94A3B8] uppercase tracking-wider ${i === 5 ? "text-right" : "text-left"}`}
                  style={{ paddingLeft: i === 0 ? 0 : 14, paddingRight: i === 5 ? 0 : 14 }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COBRANCAS.map((c, i) => {
              const s = STATUS_CFG[c.status];
              const canalCls = c.canalCor ? CANAL_CFG[c.canalCor] : "bg-zinc-100 dark:bg-[#27272A] text-zinc-600 dark:text-[#64748B]";
              const etapaCls = c.etapaCor ? ETAPA_CFG[c.etapaCor] : "bg-zinc-100 dark:bg-[#27272A] text-zinc-600 dark:text-[#64748B]";
              const valorCls = c.status === "Pago"    ? "text-blue-700 dark:text-[#60A5FA]"
                : c.status === "Vencido" ? "text-zinc-600 dark:text-[#94A3B8]"
                : "text-[#0F172A] dark:text-[#F1F5F9]";
              return (
                <tr key={i} className="border-b border-[#F4F4F5]/50 dark:border-[#27272A]/50 hover:bg-[#EFF6FF]/40 dark:hover:bg-[#27272A]/80 transition-colors last:border-none">
                  <td className="py-3">
                    <p className="text-[13px] font-semibold text-[#0F172A] dark:text-[#E2E8F0]">{c.cliente}</p>
                    <p className="text-[10px] text-[#475569] dark:text-[#94A3B8]">{c.doc}</p>
                  </td>
                  <td className="py-3 px-3.5 text-xs text-[#475569] dark:text-[#64748B]">{c.venc}</td>
                  <td className="py-3 px-3.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${canalCls}`}>{c.canal}</span>
                  </td>
                  <td className="py-3 px-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${s.bg} ${s.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-3.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${etapaCls}`}>{c.etapa}</span>
                  </td>
                  <td className={`py-3 text-right text-sm font-bold ${valorCls}`}>{c.valor}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Conversão + Atividades */}
      <div className="grid grid-cols-2 gap-4">

        {/* Conversão */}
        <div className={C}>
          <p className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9]">Conversão por automação</p>
          <p className="text-xs text-[#475569] dark:text-[#64748B] mt-0.5 mb-4">Taxa de pagamento por etapa da régua</p>
          {[
            { name: "No vencimento (D0)",   pct: 62, sub: "412 enviados · 255 pagamentos", color: "bg-[#2563EB]" },
            { name: "Pré-vencimento (D-5)", pct: 48, sub: "634 enviados · 304 pagamentos", color: "bg-[#60A5FA]" },
            { name: "Pós-vencimento (D+3)", pct: 31, sub: "189 enviados · 59 pagamentos",  color: "bg-[#93C5FD]" },
            { name: "Inadimplente (D+7)",   pct: 18, sub: "98 enviados · 18 pagamentos",   color: "bg-[#BFDBFE]" },
            { name: "Enc. financeiro",      pct: 9,  sub: "23 casos · 2 regularizados",    color: "bg-[#F4F4F5]" },
          ].map((item) => (
            <div key={item.name} className="py-2.5 border-b border-[#F4F4F5]/60 dark:border-[#27272A] last:border-none last:pb-0 first:pt-0">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-semibold text-[#0F172A] dark:text-[#CBD5E1]">{item.name}</span>
                <span className="text-[13px] font-bold text-[#0F172A] dark:text-[#F1F5F9]">{item.pct}%</span>
              </div>
              <p className="text-[10px] text-[#475569] dark:text-[#94A3B8] mb-1.5">{item.sub}</p>
              <div className="h-[5px] bg-[#EFF6FF] dark:bg-[#27272A] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-700`}
                  style={{ width: animated ? `${item.pct}%` : "0%" }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Atividades */}
        <div className={C}>
          <p className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9]">Atividades recentes</p>
          <p className="text-xs text-[#475569] dark:text-[#64748B] mt-0.5 mb-4">Eventos do sistema hoje</p>
          {[
            { Icon: MessageSquare, iBg: "bg-[#EFF6FF] dark:bg-blue-500/10",  iC: "text-[#2563EB] dark:text-blue-400",    text: <><strong className="text-[#0F172A] dark:text-[#F1F5F9]">12 clientes</strong> responderam hoje</>,        meta: "há 5 min · WhatsApp" },
            { Icon: CheckCircle,   iBg: "bg-[#EFF6FF] dark:bg-blue-900/20",  iC: "text-[#1E3A8A] dark:text-blue-300",    text: <><strong className="text-[#0F172A] dark:text-[#F1F5F9]">8 pagamentos</strong> confirmados</>,             meta: "há 12 min · Pix e Boleto" },
            { Icon: ArrowRight,    iBg: "bg-slate-100 dark:bg-slate-700/20", iC: "text-slate-400 dark:text-slate-400",    text: <><strong className="text-[#0F172A] dark:text-[#F1F5F9]">3 cobranças</strong> encaminhadas ao financeiro</>, meta: "há 34 min · Automação D+15" },
            { Icon: AlertTriangle, iBg: "bg-zinc-100/60 dark:bg-zinc-900/10",   iC: "text-zinc-500 dark:text-zinc-500/70",     text: <><strong className="text-[#0F172A] dark:text-[#F1F5F9]">2 falhas de envio</strong> detectadas</>,             meta: "há 1h · Número inválido" },
            { Icon: Clock,         iBg: "bg-[#EFF6FF] dark:bg-blue-500/10",  iC: "text-[#2563EB]/70 dark:text-blue-400", text: <><strong className="text-[#0F172A] dark:text-[#F1F5F9]">58 cobranças</strong> agendadas para amanhã</>,      meta: "há 2h · Automação programada" },
            { Icon: DollarSign,    iBg: "bg-[#EFF6FF] dark:bg-blue-900/20",  iC: "text-[#1E3A8A] dark:text-blue-300",    text: <><strong className="text-[#0F172A] dark:text-[#F1F5F9]">R$ 4.830,00</strong> recuperados esta semana</>,  meta: "há 3h · Resumo semanal" },
          ].map((act, i) => {
            const Icon = act.Icon;
            return (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-[#F4F4F5]/60 dark:border-[#27272A] last:border-none last:pb-0 first:pt-0">
                <div className={`w-[28px] h-[28px] rounded-lg ${act.iBg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={13} className={act.iC} />
                </div>
                <div>
                  <p className="text-xs text-[#0F172A] dark:text-[#CBD5E1] leading-[1.4]">{act.text}</p>
                  <span className="text-[10px] text-[#475569] dark:text-[#94A3B8]">{act.meta}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
