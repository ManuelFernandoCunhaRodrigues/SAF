import { useState } from "react";
import { AlertTriangle, Check, Copy, ExternalLink, FileText, Loader2, Receipt, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { Invoice, InvoiceBoletoData } from "../types/invoice";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

function BoletoUnavailable({ status }: { status: Invoice["status"] }) {
  if (status === "paid") {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
          <Check size={20} className="text-blue-500 dark:text-blue-400" />
        </div>
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Esta fatura já está paga</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">Não é necessário gerar um boleto.</p>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <X size={20} className="text-zinc-400 dark:text-zinc-500" />
        </div>
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Fatura cancelada</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">Não é possível gerar boleto para uma fatura cancelada.</p>
      </div>
    );
  }

  return null;
}

type InvoiceBoletoContentProps = {
  invoice: Invoice;
  boletoData: InvoiceBoletoData | null;
  isLoading: boolean;
  errorMessage: string | null;
  onGenerate: () => void;
};

function InvoiceBoletoContent({
  invoice,
  boletoData,
  isLoading,
  errorMessage,
  onGenerate,
}: InvoiceBoletoContentProps) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const cannotGenerate = invoice.status === "paid" || invoice.status === "cancelled";
  const boletoUrl = boletoData?.boletoUrl ?? boletoData?.paymentUrl;

  async function handleCopy() {
    if (!boletoData?.digitableLine) return;

    // Primary: Clipboard API
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(boletoData.digitableLine);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        return;
      } catch {
        // falls through to execCommand
      }
    }

    // Fallback: execCommand (deprecated but widely supported)
    try {
      const ta = document.createElement("textarea");
      ta.value = boletoData.digitableLine;
      ta.style.cssText = "position:fixed;opacity:0;pointer-events:none;";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (!ok) throw new Error("execCommand returned false");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyFailed(true);
      setTimeout(() => setCopyFailed(false), 3000);
    }
  }

  if (cannotGenerate) return <BoletoUnavailable status={invoice.status} />;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <Loader2 size={28} className="text-blue-600 animate-spin" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Gerando boleto...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
          <AlertTriangle size={20} className="text-red-500 dark:text-[#EF4444]" />
        </div>
        <p className="text-sm font-semibold text-red-500 dark:text-[#EF4444]">{errorMessage}</p>
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-60"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!boletoData) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
          <Receipt size={20} className="text-blue-600 dark:text-blue-400" />
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Clique no botão abaixo para gerar o boleto desta fatura.
        </p>
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-60"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Gerando...
            </span>
          ) : (
            "Gerar boleto"
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-lg px-3 py-2">
          <p className="text-zinc-400 dark:text-zinc-500 uppercase tracking-wide font-semibold text-[10px]">Valor</p>
          <p className="font-bold text-zinc-800 dark:text-zinc-100 mt-0.5">{formatCurrency(boletoData.amount)}</p>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-lg px-3 py-2">
          <p className="text-zinc-400 dark:text-zinc-500 uppercase tracking-wide font-semibold text-[10px]">Vencimento</p>
          <p className="font-bold text-zinc-800 dark:text-zinc-100 mt-0.5">{formatDate(boletoData.expiresAt)}</p>
        </div>
        <div className="col-span-2 bg-zinc-50 dark:bg-zinc-800/60 rounded-lg px-3 py-2">
          <p className="text-zinc-400 dark:text-zinc-500 uppercase tracking-wide font-semibold text-[10px]">Status</p>
          <p className="font-bold text-zinc-800 dark:text-zinc-100 mt-0.5 capitalize">{boletoData.status}</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          Linha digitável
        </p>
        <div className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2">
          <p className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300 break-all leading-relaxed select-all">
            {boletoData.digitableLine}
          </p>
        </div>
        <button
          onClick={() => void handleCopy()}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            copyFailed
              ? "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-500/30"
              : copied
              ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-600"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {copyFailed ? (
            <><AlertTriangle size={14} /> Não foi possível copiar</>
          ) : copied ? (
            <><Check size={14} /> Linha copiada!</>
          ) : (
            <><Copy size={14} /> Copiar linha digitável</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {boletoUrl && (
          <button
            onClick={() => window.open(boletoUrl, "_blank", "noopener,noreferrer")}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <ExternalLink size={14} /> Abrir boleto
          </button>
        )}
        {boletoData.pdfUrl && (
          <button
            onClick={() => window.open(boletoData.pdfUrl!, "_blank", "noopener,noreferrer")}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <FileText size={14} /> Abrir PDF
          </button>
        )}
      </div>
    </div>
  );
}

type InvoiceBoletoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice;
  boletoData: InvoiceBoletoData | null;
  isLoading: boolean;
  errorMessage: string | null;
  onGenerateBoleto: () => void;
};

export function InvoiceBoletoDialog({
  open,
  onOpenChange,
  invoice,
  boletoData,
  isLoading,
  errorMessage,
  onGenerateBoleto,
}: InvoiceBoletoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
            Pagamento via boleto
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
            {invoice.clientName} · Fatura #{invoice.number}
          </DialogDescription>
        </DialogHeader>

        <InvoiceBoletoContent
          invoice={invoice}
          boletoData={boletoData}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onGenerate={onGenerateBoleto}
        />
      </DialogContent>
    </Dialog>
  );
}
