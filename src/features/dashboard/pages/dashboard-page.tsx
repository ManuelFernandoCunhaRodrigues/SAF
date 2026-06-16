import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/app/providers/use-auth";
import {
  Calendar, Plus, TrendingUp, TrendingDown,
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

const BARS = [
  { label: "JAN", env: 52, pago: 38, pend: 18 },
  { label: "FEV", env: 61, pago: 44, pend: 21 },
  { label: "MAR", env: 48, pago: 35, pend: 16 },
  { label: "ABR", env: 84, pago: 68, pend: 30, hi: true },
  { label: "MAI", env: 72, pago: 55, pend: 24 },
  { label: "JUN", env: 65, pago: 50, pend: 22 },
];

/* ─── card base reutilizável ─── */
const C = "bg-white dark:bg-[#18181B] border border-zinc-100 dark:border-[#27272A] rounded-2xl p-6";

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
    { label: "Exportar CSV",  Icon: FileText,  action: exportCSV,  cls: "text-blue-600 dark:text-blue-400",    iBg: "bg-blue-50 dark:bg-blue-500/10" },
    { label: "Exportar XLS",  Icon: FileSpreadsheet, action: exportXLS, cls: "text-emerald-600 dark:text-emerald-400", iBg: "bg-emerald-50 dark:bg-emerald-500/10" },
    { label: "Exportar PDF",  Icon: FileDown,  action: exportPDF,  cls: "text-red-500 dark:text-red-400",      iBg: "bg-red-50 dark:bg-red-500/10" },
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
  const [filter, setFilter] = useState<"Diário" | "Semanal" | "Mensal">("Mensal");

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
      <div className="grid grid-cols-4 gap-4">
        {([
          { label: "Cobranças enviadas",    value: "1.847",     change: "+14,2%", up: true,  sub: "este mês",        Icon: Zap,           iBg: "bg-blue-50 dark:bg-blue-500/10",    iC: "text-blue-600 dark:text-blue-400" },
          { label: "Pagamentos recebidos",  value: "R$ 48.320", change: "+22,5%", up: true,  sub: "vs mês anterior", Icon: DollarSign,    iBg: "bg-emerald-50 dark:bg-emerald-500/10", iC: "text-emerald-600 dark:text-emerald-400" },
          { label: "Pendentes",             value: "342",       change: "estável",up: null,  sub: "aguardando pag.", Icon: Clock,         iBg: "bg-amber-50 dark:bg-amber-500/10",  iC: "text-amber-600 dark:text-amber-400" },
          { label: "Inadimplentes",         value: "89",        change: "+8,4%",  up: false, sub: "requer atenção",  Icon: AlertTriangle, iBg: "bg-red-50 dark:bg-red-500/10",      iC: "text-red-500 dark:text-red-400" },
        ] as const).map((k) => {
          const Icon = k.Icon;
          return (
            <div key={k.label} className={`${C} flex items-center gap-3`}>
              <div className={`w-[42px] h-[42px] rounded-xl ${k.iBg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={k.iC} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider truncate">{k.label}</p>
                <p className="text-[21px] font-bold text-zinc-800 dark:text-zinc-100 mt-0.5 leading-none tracking-tight">{k.value}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {k.up === null ? (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">= {k.change}</span>
                  ) : (
                    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${k.up ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400"}`}>
                      {k.up ? <TrendingUp size={9} /> : <TrendingDown size={9} />} {k.change}
                    </span>
                  )}
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{k.sub}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Gráfico + Fluxo ── */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 268px" }}>

        {/* Gráfico de desempenho */}
        <div className={`${C} flex flex-col`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Desempenho da régua de cobrança</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Eficiência das automações por período</p>
            </div>
            <div className="flex gap-1.5">
              {(["Diário", "Semanal", "Mensal"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                    filter === f
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-5 mb-4">
            {[
              { label: "Mensagens enviadas",  value: "1.847" },
              { label: "Respostas recebidas", value: "634" },
              { label: "Pagamentos",          value: "412" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{s.label}</p>
                <p className="text-[15px] font-bold text-zinc-800 dark:text-zinc-100 mt-0.5">{s.value}</p>
              </div>
            ))}
            <div className="ml-auto flex items-center gap-4">
              {[
                { cls: "bg-blue-500",    label: "Enviadas" },
                { cls: "bg-emerald-500", label: "Pagas" },
                { cls: "bg-zinc-300 dark:bg-zinc-600 border border-zinc-400 dark:border-zinc-500", label: "Pendentes" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-sm ${l.cls}`} />
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 flex-1">
            <div className="flex flex-col justify-between text-right pb-5 flex-shrink-0">
              {["100%", "75%", "50%", "25%", "0%"].map((l) => (
                <span key={l} className="text-[10px] text-zinc-400 dark:text-zinc-600">{l}</span>
              ))}
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col justify-between pointer-events-none">
                {[0,1,2,3].map((i) => <div key={i} className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />)}
              </div>
              <div className="flex items-end gap-2 h-[150px] pt-2">
                {BARS.map((bar) => (
                  <div key={bar.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end relative">
                    {bar.hi && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                        +17,8% conversão
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-emerald-500" />
                      </div>
                    )}
                    <div className="flex items-end gap-0.5 w-full justify-center h-full">
                      {[
                        { h: bar.env,  bg: "#3b82f6" },
                        { h: bar.pago, bg: "#10b981" },
                        { h: bar.pend, bg: "#d4d4d8" },
                      ].map((b, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-[3px] transition-all duration-700 max-w-[14px]"
                          style={{ height: animated ? `${b.h}%` : "0%", background: b.bg }}
                        />
                      ))}
                    </div>
                    <span className={`text-[10px] font-semibold ${bar.hi ? "text-emerald-500" : "text-zinc-400 dark:text-zinc-600"}`}>
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fluxo de automação */}
        <div className={C}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Fluxo da automação</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Régua de cobrança ativa</p>
            </div>
            <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-full">● Ativo</span>
          </div>
          <div className="flex flex-col">
            {[
              { code: "D-5", name: "5 dias antes do vencimento", desc: "Lembrete amigável via WhatsApp", stat: "634 enviados · 48% abertos",    bg: "bg-blue-50 dark:bg-blue-500/10",    text: "text-blue-600 dark:text-blue-400" },
              { code: "D0",  name: "No dia do vencimento",       desc: "Pix e boleto disponibilizados", stat: "412 enviados · 62% pagaram",      bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
              { code: "D+3", name: "3 dias em atraso",           desc: "Cobrança reforçada com link",   stat: "189 enviados · 31% responderam",  bg: "bg-amber-50 dark:bg-amber-500/10",  text: "text-amber-600 dark:text-amber-400" },
              { code: "D+7", name: "7 dias em atraso",           desc: "Aviso de pendência financeira", stat: "98 enviados · 18% regularizaram", bg: "bg-red-50 dark:bg-red-500/10",      text: "text-red-500 dark:text-red-400" },
              { code: "FIN", name: "Encaminhar ao financeiro",   desc: "Após 15 dias sem resposta",     stat: "23 casos · em análise",           bg: "bg-violet-50 dark:bg-violet-500/10",text: "text-violet-600 dark:text-violet-400" },
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
                  <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">{step.stat}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Status + Canais + Mensagens ── */}
      <div className="grid grid-cols-3 gap-4">

        {/* Status */}
        <div className={C}>
          <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Status das cobranças</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 mb-3">Distribuição atual</p>
          {[
            { label: "Pagas",            value: 538, pct: 43, color: "bg-emerald-500" },
            { label: "Pendentes",        value: 367, pct: 29, color: "bg-amber-500" },
            { label: "Aguardando resp.", value: 200, pct: 16, color: "bg-blue-500" },
            { label: "Vencidas",         value: 142, pct: 11, color: "bg-red-500" },
          ].map((item) => (
            <div key={item.label} className="mt-3 first:mt-0">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-zinc-700 dark:text-zinc-300">{item.label}</span>
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100">{item.value}</span>
              </div>
              <div className="h-[5px] bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-700`}
                  style={{ width: animated ? `${item.pct}%` : "0%" }}
                />
              </div>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-600 text-right mt-0.5">{item.pct}%</p>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Total de cobranças</span>
            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">1.247</span>
          </div>
        </div>

        {/* Canais */}
        <div className={C}>
          <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Canais de envio</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 mb-1">Distribuição este mês</p>
          {[
            { Icon: MessageSquare, name: "WhatsApp",      desc: "Mensagens automáticas", count: "968", pct: "52%", iBg: "bg-green-50 dark:bg-green-500/10",   iC: "text-green-600 dark:text-green-400" },
            { Icon: DollarSign,    name: "Pix gerado",    desc: "Chave e QR code",       count: "448", pct: "24%", iBg: "bg-blue-50 dark:bg-blue-500/10",     iC: "text-blue-600 dark:text-blue-400" },
            { Icon: FileText,      name: "Boleto emitido",desc: "PDF + código barras",   count: "280", pct: "15%", iBg: "bg-violet-50 dark:bg-violet-500/10", iC: "text-violet-600 dark:text-violet-400" },
          ].map((ch) => {
            const Icon = ch.Icon;
            return (
              <div key={ch.name} className="flex items-center gap-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800 last:border-none first:pt-2">
                <div className={`w-[34px] h-[34px] rounded-[10px] ${ch.iBg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={14} className={ch.iC} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{ch.name}</p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{ch.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{ch.count}</p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{ch.pct}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mensagens recentes */}
        <div className={C}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Mensagens recentes</p>
            <button className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Ver tudo</button>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Últimas interações</p>
          {[
            { initials: "JS", bg: "bg-blue-500",    name: "João Silva",    type: "Lembrete de vencimento", time: "10:30", badge: "Enviado",    bCfg: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" },
            { initials: "MS", bg: "bg-emerald-500", name: "Maria Souza",   type: "Cobrança em atraso",     time: "11:15", badge: "Respondido", bCfg: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
            { initials: "CL", bg: "bg-amber-500",   name: "Carlos Lima",   type: "Pix enviado",            time: "12:05", badge: "Aguardando", bCfg: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" },
            { initials: "AP", bg: "bg-violet-600",  name: "Ana Paula",     type: "Boleto emitido",         time: "12:48", badge: "Pago",       bCfg: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
            { initials: "RF", bg: "bg-red-500",     name: "Ricardo Faria", type: "7 dias em atraso",       time: "13:22", badge: "Vencido",    bCfg: "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400" },
          ].map((m) => (
            <div key={m.name} className="flex items-center gap-2.5 py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-none last:pb-0 first:pt-0">
              <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 ${m.bg}`}>
                {m.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">{m.name}</p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">{m.type}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{m.time}</p>
                <span className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 ${m.bCfg}`}>
                  {m.badge}
                </span>
              </div>
            </div>
          ))}
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
              const valorCls = c.status === "Pago" ? "text-emerald-600 dark:text-emerald-400"
                : c.status === "Vencido" ? "text-red-500 dark:text-red-400"
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
            { name: "Pré-vencimento (D-5)", pct: 48, sub: "634 enviados · 304 pagamentos", color: "bg-blue-500" },
            { name: "No vencimento (D0)",   pct: 62, sub: "412 enviados · 255 pagamentos", color: "bg-emerald-500" },
            { name: "Pós-vencimento (D+3)", pct: 31, sub: "189 enviados · 59 pagamentos",  color: "bg-amber-500" },
            { name: "Inadimplente (D+7)",   pct: 18, sub: "98 enviados · 18 pagamentos",   color: "bg-red-500" },
            { name: "Enc. financeiro",      pct: 9,  sub: "23 casos · 2 regularizados",    color: "bg-violet-600" },
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
            { Icon: MessageSquare, iBg: "bg-blue-50 dark:bg-blue-500/10",    iC: "text-blue-600 dark:text-blue-400",    text: <><strong className="text-zinc-800 dark:text-zinc-100">12 clientes</strong> responderam hoje</>,         meta: "há 5 min · WhatsApp" },
            { Icon: CheckCircle,   iBg: "bg-emerald-50 dark:bg-emerald-500/10", iC: "text-emerald-600 dark:text-emerald-400", text: <><strong className="text-zinc-800 dark:text-zinc-100">8 pagamentos</strong> confirmados</>,              meta: "há 12 min · Pix e Boleto" },
            { Icon: ArrowRight,    iBg: "bg-violet-50 dark:bg-violet-500/10", iC: "text-violet-600 dark:text-violet-400", text: <><strong className="text-zinc-800 dark:text-zinc-100">3 cobranças</strong> encaminhadas ao financeiro</>,  meta: "há 34 min · Automação D+15" },
            { Icon: AlertTriangle, iBg: "bg-red-50 dark:bg-red-500/10",      iC: "text-red-500 dark:text-red-400",       text: <><strong className="text-zinc-800 dark:text-zinc-100">2 falhas de envio</strong> detectadas</>,              meta: "há 1h · Número inválido" },
            { Icon: Clock,         iBg: "bg-amber-50 dark:bg-amber-500/10",  iC: "text-amber-600 dark:text-amber-400",  text: <><strong className="text-zinc-800 dark:text-zinc-100">58 cobranças</strong> agendadas para amanhã</>,         meta: "há 2h · Automação programada" },
            { Icon: DollarSign,    iBg: "bg-emerald-50 dark:bg-emerald-500/10", iC: "text-emerald-600 dark:text-emerald-400", text: <><strong className="text-zinc-800 dark:text-zinc-100">R$ 4.830,00</strong> recuperados esta semana</>,  meta: "há 3h · Resumo semanal" },
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
