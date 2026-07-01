import { useState } from "react";
import {
  Plus, Search, SlidersHorizontal, TrendingUp,
  Eye, MessageCircle, MoreHorizontal,
  Pencil, Trash2, FileText,
  DollarSign, CheckCircle, Clock, AlertTriangle, Loader2,
  Send, BadgeDollarSign, CalendarX, QrCode,
} from "lucide-react";

import { useInvoices } from "../hooks/use-invoices";
import { useCreateInvoice } from "../hooks/use-create-invoice";
import { useUpdateInvoice } from "../hooks/use-update-invoice";
import { useUpdateInvoiceStatus } from "../hooks/use-update-invoice-status";
import { useDeleteInvoice } from "../hooks/use-delete-invoice";
import { useGenerateInvoicePix } from "../hooks/use-generate-invoice-pix";
import { useGenerateInvoiceBoleto } from "../hooks/use-generate-invoice-boleto";
import { InvoiceForm } from "../components/invoice-form";
import { InvoicePixDialog } from "../components/invoice-pix-dialog";
import { InvoiceBoletoDialog } from "../components/invoice-boleto-dialog";
import type { Invoice, InvoiceStatus } from "../types/invoice";
import type { InvoiceFormData } from "../schemas/invoice-schema";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";

/* ─── helpers ─── */
function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

const STATUS_CFG: Record<InvoiceStatus, { label: string; dot: string; bg: string; text: string }> = {
  paid:      { label: "Paga",     dot: "bg-[#3B82F6]",  bg: "bg-blue-50 dark:bg-[#3B82F6]/10",   text: "text-blue-500 dark:text-[#60A5FA]" },
  pending:   { label: "Enviada",  dot: "bg-[#93C5FD]",  bg: "bg-blue-50 dark:bg-[#93C5FD]/10",   text: "text-blue-300 dark:text-[#93C5FD]" },
  overdue:   { label: "Vencida",  dot: "bg-[#EF4444]",  bg: "bg-red-50 dark:bg-[#EF4444]/10",    text: "text-red-500 dark:text-[#EF4444]" },
  cancelled: { label: "Cancelada",dot: "bg-zinc-400",   bg: "bg-zinc-100 dark:bg-zinc-800",      text: "text-zinc-500 dark:text-zinc-400" },
};

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const cfg = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

/* ─── menu de ações da linha ─── */
type RowMenuProps = {
  invoice: Invoice;
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onStatusChange: (id: string, status: InvoiceStatus) => void;
  isChangingStatus: boolean;
};

function RowMenu({ invoice, onEdit, onDelete, isDeleting, onStatusChange, isChangingStatus }: RowMenuProps) {
  const [open, setOpen] = useState(false);

  function handleEdit() { setOpen(false); onEdit(invoice); }
  function handleDelete() { setOpen(false); onDelete(invoice.id); }
  function handleStatus(status: InvoiceStatus) { setOpen(false); onStatusChange(invoice.id, status); }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={isDeleting || isChangingStatus}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
      >
        {isChangingStatus
          ? <Loader2 size={14} className="animate-spin" />
          : <MoreHorizontal size={15} />}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-20 overflow-hidden py-1">

            <button
              onClick={handleEdit}
              className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5 transition-colors text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              <Pencil size={13} className="text-zinc-400 dark:text-zinc-500" /> Editar fatura
            </button>

            {/* ── Alteração rápida de status ── */}
            {invoice.status !== "pending" && (
              <button
                onClick={() => handleStatus("pending")}
                className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5 transition-colors text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <Send size={13} className="text-blue-400" /> Marcar como Enviada
              </button>
            )}
            {invoice.status !== "paid" && (
              <button
                onClick={() => handleStatus("paid")}
                className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5 transition-colors text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <BadgeDollarSign size={13} className="text-blue-500" /> Marcar como Paga
              </button>
            )}
            {invoice.status !== "overdue" && (
              <button
                onClick={() => handleStatus("overdue")}
                className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5 transition-colors text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <CalendarX size={13} className="text-red-400" /> Marcar como Vencida
              </button>
            )}

            <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />
            <button
              onClick={() => { setOpen(false); }}
              className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5 transition-colors text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              <Eye size={13} className="text-zinc-400 dark:text-zinc-500" /> Ver detalhes
            </button>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5 transition-colors text-[#EF4444] hover:bg-[#EF4444]/10"
            >
              <Trash2 size={13} className="text-[#EF4444]" /> Excluir fatura
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── página principal ─── */
export function InvoicesPage() {
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatus]     = useState<"Todas" | InvoiceStatus>("Todas");
  const [createOpen, setCreateOpen]   = useState(false);
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);
  const [pixInvoice, setPixInvoice]   = useState<Invoice | null>(null);
  const [boletoInvoice, setBoletoInvoice] = useState<Invoice | null>(null);

  const activeStatus = statusFilter !== "Todas" ? statusFilter as InvoiceStatus : undefined;

  const { data: allInvoices = [] }                        = useInvoices();
  const { data: statusFiltered = [], isLoading, isError } = useInvoices(activeStatus);

  const filtered = statusFiltered.filter((inv) =>
    inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
    inv.number.includes(search)
  );

  /* mutations */
  const createMutation = useCreateInvoice();
  const updateMutation = useUpdateInvoice(editInvoice?.id ?? "");
  const statusMutation = useUpdateInvoiceStatus();
  const deleteMutation = useDeleteInvoice();
  const pixMutation    = useGenerateInvoicePix();
  const boletoMutation = useGenerateInvoiceBoleto();

  /* handlers */
  function handleCreate(data: InvoiceFormData) {
    createMutation.mutate(data, {
      onSuccess: () => {
        setCreateOpen(false);
        createMutation.reset();
      },
    });
  }

  function handleUpdate(data: InvoiceFormData) {
    updateMutation.mutate(data, {
      onSuccess: () => setTimeout(() => setEditInvoice(null), 1200),
    });
  }

  function handleStatusChange(id: string, status: InvoiceStatus) {
    statusMutation.mutate({ id, status });
  }

  function handleDelete(id: string) {
    if (!window.confirm("Tem certeza que deseja excluir esta fatura? Esta ação não pode ser desfeita.")) return;
    deleteMutation.mutate(id);
  }

  function handleCloseCreate(open: boolean) {
    setCreateOpen(open);
    if (!open) createMutation.reset();
  }

  function handleCloseEdit(open: boolean) {
    if (!open) {
      setEditInvoice(null);
      updateMutation.reset();
    }
  }

  function handleOpenPix(invoice: Invoice) {
    pixMutation.reset();
    setPixInvoice(invoice);
  }

  function handleClosePix(open: boolean) {
    if (!open) {
      setPixInvoice(null);
      pixMutation.reset();
    }
  }

  function handleOpenBoleto(invoice: Invoice) {
    boletoMutation.reset();
    setBoletoInvoice(invoice);
  }

  function handleCloseBoleto(open: boolean) {
    if (!open) {
      setBoletoInvoice(null);
      boletoMutation.reset();
    }
  }

  /* KPIs — sempre sobre allInvoices (sem filtro) */
  const total   = allInvoices.reduce((s, i) => s + i.amount, 0);
  const paid    = allInvoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const pending = allInvoices.filter((i) => i.status === "pending").reduce((s, i) => s + i.amount, 0);
  const overdue = allInvoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.amount, 0);

  const paidCount    = allInvoices.filter((i) => i.status === "paid").length;
  const pendingCount = allInvoices.filter((i) => i.status === "pending").length;
  const overdueCount = allInvoices.filter((i) => i.status === "overdue").length;

  /* defaultValues para edição — dueDate precisa ser yyyy-mm-dd para input[type=date] */
  const editDefaultValues = editInvoice
    ? {
        clientId: editInvoice.clientId ?? "",
        amount:   editInvoice.amount,
        dueDate:  editInvoice.dueDate.slice(0, 10),
        status:   editInvoice.status,
      }
    : undefined;

  return (
    <div className="py-8 space-y-7">

      {/* ── Cabeçalho ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">Faturas</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Gerencie as faturas do sistema</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors whitespace-nowrap"
        >
          <Plus size={15} strokeWidth={2.5} />
          Nova Fatura
        </button>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total em Faturas",   value: total,   sub: isLoading ? "Carregando faturas" : `${allInvoices.length} faturas cadastradas`,              Icon: TrendingUp,    iBg: "bg-blue-50 dark:bg-[#2563EB]/10",  iC: "text-blue-600 dark:text-[#3B82F6]",  vC: "text-zinc-800 dark:text-zinc-100" },
          { label: "Faturas Pagas",      value: paid,    sub: `${paidCount} fatura${paidCount !== 1 ? "s" : ""} confirmada${paidCount !== 1 ? "s" : ""}`,  Icon: CheckCircle,   iBg: "bg-blue-50 dark:bg-[#3B82F6]/10",  iC: "text-blue-500 dark:text-[#60A5FA]",  vC: "text-blue-500 dark:text-[#60A5FA]" },
          { label: "Faturas Enviadas",   value: pending, sub: `${pendingCount} aguardando pagamento`,                                                       Icon: Clock,         iBg: "bg-blue-50 dark:bg-[#93C5FD]/10",  iC: "text-blue-300 dark:text-[#93C5FD]",  vC: "text-blue-300 dark:text-[#93C5FD]" },
          { label: "Faturas Vencidas",   value: overdue, sub: `${overdueCount} fatura${overdueCount !== 1 ? "s" : ""} em atraso`,                          Icon: AlertTriangle, iBg: "bg-red-50 dark:bg-[#EF4444]/10",   iC: "text-red-500 dark:text-[#EF4444]",   vC: "text-red-500 dark:text-[#EF4444]" },
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

        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Lista de Faturas</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Acompanhe o status das cobranças emitidas</p>
          </div>

          <div className="flex items-center gap-2">
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

            <div className="flex items-center gap-0.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-1">
              <SlidersHorizontal size={12} className="text-zinc-400 dark:text-zinc-500 mx-1.5" />
              {([
                { value: "Todas",     label: "Todas" },
                { value: "paid",      label: "Pagas" },
                { value: "pending",   label: "Enviadas" },
                { value: "overdue",   label: "Vencidas" },
                { value: "cancelled", label: "Canceladas" },
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
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 size={24} className="text-blue-600 animate-spin" />
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Carregando faturas...</p>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-[#EF4444]/10 flex items-center justify-center">
                      <AlertTriangle size={20} className="text-red-500 dark:text-[#EF4444]" />
                    </div>
                    <p className="text-sm font-semibold text-[#EF4444]">Erro ao carregar faturas</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">Verifique a conexão com a API</p>
                  </div>
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((inv) => {
                const isChangingThisStatus = statusMutation.isPending && statusMutation.variables?.id === inv.id;
                return (
                  <tr
                    key={inv.id}
                    className={`border-t border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${
                      (deleteMutation.isPending || isChangingThisStatus) ? "opacity-60 pointer-events-none" : ""
                    }`}
                  >
                    <td className="py-4 pl-6 pr-4">
                      <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md font-mono">
                        #{inv.number}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                          <DollarSign size={13} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{inv.clientName}</p>
                          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">{inv.clientEmail ?? ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{formatCurrency(inv.amount)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="py-4 px-4">
                      <p className={`text-sm font-medium ${inv.status === "overdue" ? "text-red-500 dark:text-[#EF4444]" : "text-zinc-600 dark:text-zinc-300"}`}>
                        {formatDate(inv.dueDate)}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-zinc-400 dark:text-zinc-500">{formatDate(inv.createdAt)}</p>
                    </td>
                    <td className="py-4 pl-4 pr-6">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenPix(inv)}
                          disabled={inv.status === "paid" || inv.status === "cancelled"}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          title={inv.status === "paid" ? "Fatura já paga" : inv.status === "cancelled" ? "Fatura cancelada" : "Gerar Pix"}
                        >
                          <QrCode size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenBoleto(inv)}
                          disabled={inv.status === "paid" || inv.status === "cancelled"}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          title={inv.status === "paid" ? "Fatura já paga" : inv.status === "cancelled" ? "Fatura cancelada" : "Gerar Boleto"}
                        >
                          <FileText size={14} />
                        </button>
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
                        <RowMenu
                          invoice={inv}
                          onEdit={setEditInvoice}
                          onDelete={handleDelete}
                          isDeleting={deleteMutation.isPending}
                          onStatusChange={handleStatusChange}
                          isChangingStatus={isChangingThisStatus}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
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

        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-xs text-zinc-400 dark:text-zinc-600">
              Exibindo {filtered.length} de {statusFiltered.length} fatura{statusFiltered.length !== 1 ? "s" : ""}
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

      {/* ── Dialog: Nova Fatura ── */}
      <Dialog open={createOpen} onOpenChange={handleCloseCreate}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
              Nova Fatura
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
              Preencha os dados para registrar uma nova fatura no sistema.
            </DialogDescription>
          </DialogHeader>
          <InvoiceForm
            onSubmit={handleCreate}
            onCancel={() => handleCloseCreate(false)}
            isSubmitting={createMutation.isPending}
            errorMessage={createMutation.errorMessage}
            submitLabel="Criar fatura"
          />
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Pix ── */}
      {pixInvoice && (
        <InvoicePixDialog
          open={!!pixInvoice}
          onOpenChange={handleClosePix}
          invoice={pixInvoice}
          pixData={pixMutation.data ?? null}
          isLoading={pixMutation.isPending}
          errorMessage={pixMutation.errorMessage}
          onGeneratePix={() => pixMutation.mutate(pixInvoice.id)}
        />
      )}

      {/* ── Dialog: Boleto ── */}
      {boletoInvoice && (
        <InvoiceBoletoDialog
          open={!!boletoInvoice}
          onOpenChange={handleCloseBoleto}
          invoice={boletoInvoice}
          boletoData={boletoMutation.data ?? null}
          isLoading={boletoMutation.isPending}
          errorMessage={boletoMutation.errorMessage}
          onGenerateBoleto={() => boletoMutation.mutate(boletoInvoice.id)}
        />
      )}

      {/* ── Dialog: Editar Fatura ── */}
      <Dialog open={!!editInvoice} onOpenChange={handleCloseEdit}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
              Editar Fatura
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
              Atualize os dados da fatura selecionada.
            </DialogDescription>
          </DialogHeader>
          <InvoiceForm
            key={editInvoice?.id}
            defaultValues={editDefaultValues}
            onSubmit={handleUpdate}
            onCancel={() => handleCloseEdit(false)}
            isSubmitting={updateMutation.isPending}
            isSuccess={updateMutation.isSuccess}
            errorMessage={updateMutation.errorMessage}
            submitLabel="Salvar alterações"
          />
        </DialogContent>
      </Dialog>

    </div>
  );
}
