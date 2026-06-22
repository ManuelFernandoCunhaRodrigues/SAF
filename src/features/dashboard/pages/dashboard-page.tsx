import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/app/providers/use-auth";
import { useDashboardStats } from "../hooks/use-dashboard";
import { PerformanceChart } from "../components/performance-chart";
import {
  Calendar, Plus,
  MessageSquare, Zap,
  AlertTriangle, DollarSign, Clock, CheckCircle,
  FileText, ArrowRight, Download, FileSpreadsheet, FileDown,
} from "lucide-react";

/* ─── tipos ─── */
type StatusCobranca = "Pago" | "Pendente" | "Vencido" | "Respondido";

const COBRANCAS: {
  cliente: string; doc: string; venc: string;
  canal: string; status: StatusCobranca; etapa: string; valor: string;
  etapaCor?: string; canalCor?: string;
}[] = [
  { cliente: "João Silva",     doc: "CPF 123.456.789-00",      venc: "16 Jun 2025", canal: "WhatsApp",        canalCor: "blue",   status: "Pago",       etapa: "Pós-vencimento D+1", valor: "R$ 189,90" },
  { cliente: "Maria Souza",    doc: "CPF 987.654.321-00",      venc: "15 Jun 2025", canal: "WhatsApp + Pix",  canalCor: "blue",   status: "Pendente",   etapa: "No vencimento",      valor: "R$ 249,90" },
  { cliente: "Carlos Lima",    doc: "CNPJ 12.345.678/0001-90", venc: "14 Jun 2025", canal: "Boleto",          canalCor: "violet", status: "Vencido",    etapa: "7 dias em atraso",   valor: "R$ 329,90", etapaCor: "red" },
  { cliente: "Ana Paula",      doc: "CPF 456.123.789-00",      venc: "13 Jun 2025", canal: "WhatsApp",        canalCor: "blue",   status: "Respondido", etapa: "D-3 pré-vencimento", valor: "R$ 159,90" },
  { cliente: "Fernanda Costa", doc: "CNPJ 98.765.432/0001-10", venc: "12 Jun 2025", canal: "WhatsApp+Boleto", canalCor: "blue",   status: "Pago",       etapa: "No vencimento",      valor: "R$ 549,90" },
  { cliente: "Ricardo Faria",  doc: "CPF 789.012.345-00",      venc: "11 Jun 2025", canal: "SMS",             canalCor: "amber",  status: "Vencido",    etapa: "Enc. financeiro",    valor: "R$ 899,90", etapaCor: "violet" },
];

const STATUS_CFG: Record<StatusCobranca, { bg: string; text: string; dot: string }> = {
  Pago:       { bg: "bg-[#EFF6FF] dark:bg-[#2563EB]/10", text: "text-[#1E3A8A] dark:text-[#60A5FA]",  dot: "bg-blue-600 dark:bg-[#60A5FA]" },
  Pendente:   { bg: "bg-slate-50 dark:bg-[#64748B]/10",  text: "text-slate-600 dark:text-[#94A3B8]",  dot: "bg-slate-500 dark:bg-[#94A3B8]" },
  Vencido:    { bg: "bg-zinc-100 dark:bg-[#52525B]/10",  text: "text-zinc-600 dark:text-[#94A3B8]",   dot: "bg-zinc-500 dark:bg-[#94A3B8]" },
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

/* ─── export helpers ─── */
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

/* ─── componente ExportMenu ─── */
function ExportMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const options = [
    { label: "Exportar CSV",  Icon: FileText,        action: exportCSV,  cls: "text-blue-500 dark:text-blue-400",      iBg: "bg-blue-50 dark:bg-blue-500/10" },
    { label: "Exportar XLS",  Icon: FileSpreadsheet, action: exportXLS,  cls: "text-blue-400 dark:text-[#60A5FA]",     iBg: "bg-blue-50 dark:bg-[#60A5FA]/10" },
    { label: "Exportar PDF",  Icon: FileDown,        action: exportPDF,  cls: "text-blue-300 dark:text-[#93C5FD]",     iBg: "bg-blue-50 dark:bg-[#93C5FD]/10" },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 font-medium shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors whitespace-nowrap"
      >
        <Download size={13} className="text-zinc-400 dark:text-zinc-500" />
        Exportar
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-50 overflow-hidden py-1">
          <p className="px-4 pt-2 pb-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Formato do relatório
          </p>
          {options.map(({ label, Icon, action, cls, iBg }) => (
            <button
              key={label}
              onClick={() => { action(); setOpen(false); }}
              className="w-full px-4 py-2.5 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-3 transition-colors"
            >
              <div className={`w-6 h-6 rounded-md ${iBg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={12} className={cls} />
              </div>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuthContext();
  const [animated, setAnimated] = useState(false);
  const {
    data: stats,
    isLoading: statsLoading,
    isFetching: statsFetching,
    isError: statsError,
    refetch,
  } = useDashboardStats();
  const shouldShowCardError = statsError && !stats;

  const kpis = [
    { label: "Cobranças enviadas",   value: formatNumber(stats?.totalInvoices),    change: "", up: true  as true | false | null, sub: "total cadastradas", Icon: Zap,           iBg: "bg-blue-50 dark:bg-[#2563EB]/10",    iC: "text-blue-600 dark:text-[#3B82F6]" },
    { label: "Pagamentos recebidos", value: formatCurrency(stats?.totalReceived), change: "", up: true  as true | false | null, sub: "valor total pago",  Icon: DollarSign,    iBg: "bg-blue-50 dark:bg-[#3B82F6]/10",    iC: "text-blue-500 dark:text-[#60A5FA]" },
    { label: "Pendentes",            value: formatNumber(stats?.pending),          change: "", up: null  as true | false | null, sub: "aguardando pag.",   Icon: Clock,         iBg: "bg-blue-50 dark:bg-[#93C5FD]/10",    iC: "text-blue-300 dark:text-[#93C5FD]" },
    { label: "Inadimplentes",        value: formatNumber(stats?.overdue),          change: "", up: false as true | false | null, sub: "requer atenção",    Icon: AlertTriangle, iBg: "bg-red-50 dark:bg-[#EF4444]/10",     iC: "text-red-500 dark:text-[#EF4444]" },
  ];

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

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
          <button className="flex items-center gap-2 px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 font-medium shadow-sm whitespace-nowrap">
            <Calendar size={12} className="text-zinc-400 dark:text-zinc-500" />
            Últimos 30 dias
          </button>
          <ExportMenu />
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap">
            <Plus size={12} strokeWidth={2.8} />
            Nova Automação
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

        <PerformanceChart />

        {/* Fluxo de automação */}
        <div className={C}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Fluxo da automação</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Régua de cobrança ativa</p>
            </div>
            <span className="text-[10px] font-bold bg-blue-50 dark:bg-[#2563EB]/10 text-blue-600 dark:text-[#3B82F6] px-2 py-1 rounded-full">● Ativo</span>
          </div>
          <div className="flex flex-col">
            {[
              { code: "D-5", name: "5 dias antes do vencimento", desc: "Lembrete amigável via WhatsApp", stat: "634 enviados · 48% abertos",    bg: "bg-blue-50 dark:bg-[#2563EB]/10",   text: "text-blue-600 dark:text-[#3B82F6]" },
              { code: "D0",  name: "No dia do vencimento",       desc: "Pix e boleto disponibilizados", stat: "412 enviados · 62% pagaram",      bg: "bg-blue-50 dark:bg-[#3B82F6]/10",   text: "text-blue-500 dark:text-[#60A5FA]" },
              { code: "D+3", name: "3 dias em atraso",           desc: "Cobrança reforçada com link",   stat: "189 enviados · 31% responderam",  bg: "bg-blue-50 dark:bg-[#93C5FD]/10",   text: "text-blue-300 dark:text-[#93C5FD]" },
              { code: "D+7", name: "7 dias em atraso",           desc: "Aviso de pendência financeira", stat: "98 enviados · 18% regularizaram", bg: "bg-red-50 dark:bg-[#EF4444]/10",    text: "text-red-500 dark:text-[#EF4444]" },
              { code: "FIN", name: "Encaminhar ao financeiro",   desc: "Após 15 dias sem resposta",     stat: "23 casos · em análise",           bg: "bg-blue-50 dark:bg-[#60A5FA]/10",   text: "text-blue-400 dark:text-[#60A5FA]" },
            ].map((step, i, arr) => (
              <div key={step.code} className="flex items-start gap-3 relative pb-4 last:pb-0">
                {i < arr.length - 1 && (
                  <div className="absolute left-[13px] top-[26px] bottom-0 w-px bg-zinc-200 dark:bg-zinc-700" />
                )}
                <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold z-10 ${step.bg} ${step.text}`}>
                  {step.code}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{step.name}</p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">{step.desc}</p>
                  <p className="text-[10px] font-bold text-blue-500 dark:text-[#60A5FA] mt-1">{step.stat}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>


      {/* ── Tabela ── */}
      <div className={C}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Cobranças recentes</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Acompanhamento das cobranças automatizadas</p>
          </div>
          <button className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            Ver tudo
          </button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              {["Cliente", "Vencimento", "Canal", "Status", "Etapa da régua", "Valor"].map((col, i) => (
                <th
                  key={col}
                  className={`pb-2.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider ${i === 5 ? "text-right" : "text-left"}`}
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
              const canalCls = c.canalCor ? CANAL_CFG[c.canalCor] : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400";
              const etapaCls = c.etapaCor ? ETAPA_CFG[c.etapaCor] : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400";
              const valorCls = c.status === "Pago" ? "text-blue-500 dark:text-[#60A5FA]"
                : c.status === "Vencido" ? "text-red-500 dark:text-[#EF4444]"
                : "text-zinc-800 dark:text-zinc-100";
              return (
                <tr key={i} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors last:border-none">
                  <td className="py-3">
                    <p className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200">{c.cliente}</p>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{c.doc}</p>
                  </td>
                  <td className="py-3 px-3.5 text-xs text-zinc-500 dark:text-zinc-400">{c.venc}</td>
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

      {/* ── Conversão + Atividades ── */}
      <div className="grid grid-cols-2 gap-4">

        {/* Conversão */}
        <div className={C}>
          <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Conversão por automação</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 mb-4">Taxa de pagamento por etapa da régua</p>
          {[
            { name: "Pré-vencimento (D-5)", pct: 48, sub: "634 enviados · 304 pagamentos", color: "bg-[#2563EB]" },
            { name: "No vencimento (D0)",   pct: 62, sub: "412 enviados · 255 pagamentos", color: "bg-[#3B82F6]" },
            { name: "Pós-vencimento (D+3)", pct: 31, sub: "189 enviados · 59 pagamentos",  color: "bg-[#60A5FA]" },
            { name: "Inadimplente (D+7)",   pct: 18, sub: "98 enviados · 18 pagamentos",   color: "bg-[#EF4444]" },
            { name: "Enc. financeiro",      pct: 9,  sub: "23 casos · 2 regularizados",    color: "bg-[#93C5FD]" },
          ].map((item) => (
            <div key={item.name} className="py-2.5 border-b border-zinc-100 dark:border-zinc-800 last:border-none last:pb-0 first:pt-0">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{item.name}</span>
                <span className="text-[13px] font-bold text-zinc-800 dark:text-zinc-100">{item.pct}%</span>
              </div>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mb-1.5">{item.sub}</p>
              <div className="h-[5px] bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
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
          <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Atividades recentes</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 mb-4">Eventos do sistema hoje</p>
          {[
            { Icon: MessageSquare, iBg: "bg-blue-50 dark:bg-[#2563EB]/10",  iC: "text-blue-600 dark:text-[#3B82F6]",  text: <><strong className="text-zinc-800 dark:text-zinc-100">12 clientes</strong> responderam hoje</>,        meta: "há 5 min · WhatsApp" },
            { Icon: CheckCircle,   iBg: "bg-blue-50 dark:bg-[#3B82F6]/10",  iC: "text-blue-500 dark:text-[#60A5FA]",  text: <><strong className="text-zinc-800 dark:text-zinc-100">8 pagamentos</strong> confirmados</>,             meta: "há 12 min · Pix e Boleto" },
            { Icon: ArrowRight,    iBg: "bg-blue-50 dark:bg-[#60A5FA]/10",  iC: "text-blue-400 dark:text-[#60A5FA]",  text: <><strong className="text-zinc-800 dark:text-zinc-100">3 cobranças</strong> encaminhadas ao financeiro</>, meta: "há 34 min · Automação D+15" },
            { Icon: AlertTriangle, iBg: "bg-red-50 dark:bg-[#EF4444]/10",   iC: "text-red-500 dark:text-[#EF4444]",   text: <><strong className="text-zinc-800 dark:text-zinc-100">2 falhas de envio</strong> detectadas</>,             meta: "há 1h · Número inválido" },
            { Icon: Clock,         iBg: "bg-blue-50 dark:bg-[#93C5FD]/10",  iC: "text-blue-300 dark:text-[#93C5FD]",  text: <><strong className="text-zinc-800 dark:text-zinc-100">58 cobranças</strong> agendadas para amanhã</>,        meta: "há 2h · Automação programada" },
            { Icon: DollarSign,    iBg: "bg-blue-50 dark:bg-[#3B82F6]/10",  iC: "text-blue-500 dark:text-[#60A5FA]",  text: <><strong className="text-zinc-800 dark:text-zinc-100">R$ 4.830,00</strong> recuperados esta semana</>,  meta: "há 3h · Resumo semanal" },
          ].map((act, i) => {
            const Icon = act.Icon;
            return (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800 last:border-none last:pb-0 first:pt-0">
                <div className={`w-[28px] h-[28px] rounded-lg ${act.iBg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={13} className={act.iC} />
                </div>
                <div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-[1.4]">{act.text}</p>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{act.meta}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
