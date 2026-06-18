import { useState } from "react";
import {
  Plus, Search, SlidersHorizontal, TrendingUp,
  Eye, MessageCircle, MoreHorizontal,
  Pencil, Copy, FileText, Printer,
  DollarSign, CheckCircle, Clock, AlertTriangle,
} from "lucide-react";

/* ─── helpers ─── */
function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

/* ─── tipos ─── */
type InvoiceStatus = "paid" | "pending" | "overdue";

const STATUS_CFG: Record<InvoiceStatus, { label: string; dot: string; bg: string; text: string }> = {
  paid:    { label: "Pago",     dot: "bg-[#3B82F6]",  bg: "bg-blue-50 dark:bg-[#3B82F6]/10",   text: "text-blue-500 dark:text-[#60A5FA]" },
  pending: { label: "Pendente", dot: "bg-[#93C5FD]",  bg: "bg-blue-50 dark:bg-[#93C5FD]/10",   text: "text-blue-300 dark:text-[#93C5FD]" },
  overdue: { label: "Vencida",  dot: "bg-[#EF4444]",  bg: "bg-red-50 dark:bg-[#EF4444]/10",    text: "text-red-500 dark:text-[#EF4444]" },
};

/* ─── dados ─── */
const INVOICES: {
  id: string; number: string; clientName: string; clientEmail: string;
  amount: number; status: InvoiceStatus; dueDate: string; createdAt: string;
}[] = [
  { id: "1", number: "001", clientName: "Empresa A", clientEmail: "contato@empresaa.com", amount: 5000, status: "paid",    dueDate: "2026-06-29", createdAt: "2026-05-19" },
  { id: "2", number: "002", clientName: "Empresa B", clientEmail: "contato@empresab.com", amount: 3500, status: "pending", dueDate: "2026-06-14", createdAt: "2026-05-14" },
  { id: "3", number: "003", clientName: "Empresa C", clientEmail: "contato@empresac.com", amount: 8000, status: "overdue", dueDate: "2026-05-09", createdAt: "2026-04-09" },
];

/* ─── sub-componente: badge ─── */
function StatusBadge({ status }: { status: InvoiceStatus }) {
  const cfg = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

/* ─── sub-componente: menu de ações ─── */
function RowMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-20 overflow-hidden py-1">
            {[
              { Icon: Eye,      label: "Ver detalhes",  cls: "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800" },
              { Icon: Pencil,   label: "Editar fatura",  cls: "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800" },
              { Icon: Copy,     label: "Copiar Pix",     cls: "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800" },
              { Icon: FileText, label: "Gerar boleto",   cls: "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800" },
              { Icon: Printer,  label: "Imprimir",       cls: "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800" },
            ].map(({ Icon, label, cls }) => (
              <button key={label} className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5 transition-colors ${cls}`}>
                <Icon size={13} className="text-zinc-400 dark:text-zinc-500" /> {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── página principal ─── */
export function InvoicesPage() {
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState<"Todos" | InvoiceStatus>("Todos");

  const filtered = INVOICES.filter((inv) => {
    const matchSearch =
      inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.number.includes(search);
    const matchStatus = statusFilter === "Todos" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const total   = INVOICES.reduce((s, i) => s + i.amount, 0);
  const paid    = INVOICES.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const pending = INVOICES.filter((i) => i.status === "pending").reduce((s, i) => s + i.amount, 0);
  const overdue = INVOICES.filter((i) => i.status === "overdue").reduce((s, i) => s + i.amount, 0);

  const paidCount    = INVOICES.filter((i) => i.status === "paid").length;
  const pendingCount = INVOICES.filter((i) => i.status === "pending").length;
  const overdueCount = INVOICES.filter((i) => i.status === "overdue").length;

  return (
    <div className="py-8 space-y-7">

      {/* ── Cabeçalho ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">Faturas</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Gerencie as faturas do sistema</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors whitespace-nowrap">
          <Plus size={15} strokeWidth={2.5} />
          Nova Fatura
        </button>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total em Faturas",  value: total,   sub: `${INVOICES.length} faturas cadastradas`,                                                   Icon: TrendingUp,    iBg: "bg-blue-50 dark:bg-[#2563EB]/10",  iC: "text-blue-600 dark:text-[#3B82F6]",  vC: "text-zinc-800 dark:text-zinc-100" },
          { label: "Faturas Pagas",     value: paid,    sub: `${paidCount} fatura${paidCount !== 1 ? "s" : ""} confirmada${paidCount !== 1 ? "s" : ""}`,         Icon: CheckCircle,   iBg: "bg-blue-50 dark:bg-[#3B82F6]/10",  iC: "text-blue-500 dark:text-[#60A5FA]",  vC: "text-blue-500 dark:text-[#60A5FA]" },
          { label: "Faturas Pendentes", value: pending, sub: `${pendingCount} aguardando pagamento`,                                                              Icon: Clock,         iBg: "bg-blue-50 dark:bg-[#93C5FD]/10",  iC: "text-blue-300 dark:text-[#93C5FD]",  vC: "text-blue-300 dark:text-[#93C5FD]" },
          { label: "Faturas Vencidas",  value: overdue, sub: `${overdueCount} fatura${overdueCount !== 1 ? "s" : ""} em atraso`,                                 Icon: AlertTriangle, iBg: "bg-red-50 dark:bg-[#EF4444]/10",   iC: "text-red-500 dark:text-[#EF4444]",   vC: "text-red-500 dark:text-[#EF4444]" },
        ].map((k) => {
          const Icon = k.Icon;
          return (
            <div key={k.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${k.iBg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={k.iC} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{k.label}</p>
                <p className={`text-lg font-bold mt-0.5 leading-none ${k.vC}`}>{formatCurrency(k.value)}</p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">{k.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Card da tabela ── */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">

        {/* Cabeçalho do card */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Lista de Faturas</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Acompanhe o status das cobranças emitidas</p>
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-2">
            {/* Busca */}
            <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 w-56">
              <Search size={13} className="text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="Buscar cliente ou nº..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-xs bg-transparent text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none"
              />
            </div>

            {/* Status */}
            <div className="flex items-center gap-0.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-1">
              <SlidersHorizontal size={12} className="text-zinc-400 dark:text-zinc-500 mx-1.5" />
              {([
                { value: "Todos",   label: "Todos" },
                { value: "paid",    label: "Pago" },
                { value: "pending", label: "Pendente" },
                { value: "overdue", label: "Vencida" },
              ] as const).map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatus(f.value)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    statusFilter === f.value
                      ? "bg-blue-600 text-white"
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabela */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-800/50">
              {["Nº", "Cliente", "Valor", "Status", "Vencimento", "Emissão", "Ações"].map((col, i) => (
                <th
                  key={col}
                  className={`py-3 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ${i === 6 ? "text-center" : "text-left"}`}
                  style={{ paddingLeft: i === 0 ? 24 : 16, paddingRight: i === 6 ? 24 : 16 }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((inv, i) => (
                <tr
                  key={inv.id}
                  className={`border-t border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group ${i === filtered.length - 1 ? "" : ""}`}
                >
                  {/* Nº */}
                  <td className="py-4 pl-6 pr-4">
                    <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md font-mono">
                      #{inv.number}
                    </span>
                  </td>

                  {/* Cliente */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <DollarSign size={13} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{inv.clientName}</p>
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">{inv.clientEmail}</p>
                      </div>
                    </div>
                  </td>

                  {/* Valor */}
                  <td className="py-4 px-4">
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{formatCurrency(inv.amount)}</p>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <StatusBadge status={inv.status} />
                  </td>

                  {/* Vencimento */}
                  <td className="py-4 px-4">
                    <p className={`text-sm font-medium ${inv.status === "overdue" ? "text-red-500 dark:text-[#EF4444]" : "text-zinc-600 dark:text-zinc-300"}`}>
                      {formatDate(inv.dueDate)}
                    </p>
                  </td>

                  {/* Emissão */}
                  <td className="py-4 px-4">
                    <p className="text-sm text-zinc-400 dark:text-zinc-500">{formatDate(inv.createdAt)}</p>
                  </td>

                  {/* Ações */}
                  <td className="py-4 pl-4 pr-6">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#3B82F6] hover:bg-[#3B82F6]/10 transition-colors"
                        title="Enviar via WhatsApp"
                      >
                        <MessageCircle size={14} />
                      </button>
                      <RowMenu />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      <FileText size={20} className="text-zinc-400 dark:text-zinc-500" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Nenhuma fatura encontrada</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">Tente ajustar o filtro ou a busca</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer da tabela */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-xs text-zinc-400 dark:text-zinc-600">
              Exibindo {filtered.length} de {INVOICES.length} fatura{INVOICES.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-1">
              {["←", "1", "→"].map((p) => (
                <button
                  key={p}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                    p === "1"
                      ? "bg-blue-600 text-white"
                      : "text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
