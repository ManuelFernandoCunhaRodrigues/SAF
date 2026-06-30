import { useState, useEffect } from "react";
import { Copy, Check, Loader2, AlertTriangle, QrCode, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import type { Invoice, InvoicePixData } from "../types/invoice";

/* ─── helpers ─── */
function formatCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}
function formatDate(s: string) {
  return new Date(s).toLocaleDateString("pt-BR");
}
function formatDateTime(s: string) {
  return new Date(s).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function getQrCodeSrc(qrCodeImage: string): string {
  if (qrCodeImage.startsWith("data:image")) return qrCodeImage;
  if (qrCodeImage.startsWith("http")) return qrCodeImage;
  return `data:image/png;base64,${qrCodeImage}`;
}

/* ─── estados sem Pix disponível ─── */
function PixUnavailable({ status }: { status: Invoice["status"] }) {
  if (status === "paid") {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
          <Check size={20} className="text-blue-500 dark:text-blue-400" />
        </div>
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Esta fatura já está paga</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">Não é necessário gerar um novo Pix.</p>
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
        <p className="text-xs text-zinc-400 dark:text-zinc-500">Não é possível gerar Pix para uma fatura cancelada.</p>
      </div>
    );
  }
  return null;
}

/* ─── conteúdo principal ─── */
type InvoicePixContentProps = {
  invoice: Invoice;
  pixData: InvoicePixData | null;
  isLoading: boolean;
  errorMessage: string | null;
  onGenerate: () => void;
};

function InvoicePixContent({ invoice, pixData, isLoading, errorMessage, onGenerate }: InvoicePixContentProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!pixData?.pixCopyPaste) return;
    try {
      await navigator.clipboard.writeText(pixData.pixCopyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback para browsers antigos ou HTTP
      const ta = document.createElement("textarea");
      ta.value = pixData.pixCopyPaste;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  const cannotGenerate = invoice.status === "paid" || invoice.status === "cancelled";

  if (cannotGenerate) return <PixUnavailable status={invoice.status} />;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <Loader2 size={28} className="text-blue-600 animate-spin" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Gerando Pix...</p>
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
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!pixData) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
          <QrCode size={20} className="text-blue-600 dark:text-blue-400" />
        </div>
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Gerar QR Code Pix</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Clique abaixo para criar uma cobrança Pix para esta fatura.
        </p>
        <button
          onClick={onGenerate}
          className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
        >
          Gerar Pix
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* QR Code */}
      <div className="flex justify-center">
        <div className="p-3 bg-white rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm">
          <img
            src={getQrCodeSrc(pixData.qrCodeImage)}
            alt="QR Code Pix"
            className="w-48 h-48 object-contain"
          />
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-lg px-3 py-2">
          <p className="text-zinc-400 dark:text-zinc-500 uppercase tracking-wide font-semibold text-[10px]">Valor</p>
          <p className="font-bold text-zinc-800 dark:text-zinc-100 mt-0.5">{formatCurrency(pixData.amount)}</p>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-lg px-3 py-2">
          <p className="text-zinc-400 dark:text-zinc-500 uppercase tracking-wide font-semibold text-[10px]">Vencimento</p>
          <p className="font-bold text-zinc-800 dark:text-zinc-100 mt-0.5">{formatDate(invoice.dueDate)}</p>
        </div>
        {pixData.expiresAt && (
          <div className="col-span-2 bg-zinc-50 dark:bg-zinc-800/60 rounded-lg px-3 py-2">
            <p className="text-zinc-400 dark:text-zinc-500 uppercase tracking-wide font-semibold text-[10px]">QR Code válido até</p>
            <p className="font-bold text-zinc-800 dark:text-zinc-100 mt-0.5">{formatDateTime(pixData.expiresAt)}</p>
          </div>
        )}
      </div>

      {/* Código copia e cola */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          Pix copia e cola
        </p>
        <div className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2">
          <p className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300 break-all leading-relaxed line-clamp-3">
            {pixData.pixCopyPaste}
          </p>
        </div>
        <button
          onClick={() => void handleCopy()}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            copied
              ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-600"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {copied ? (
            <><Check size={14} /> Código copiado!</>
          ) : (
            <><Copy size={14} /> Copiar código Pix</>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── dialog principal ─── */
type InvoicePixDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice;
  pixData: InvoicePixData | null;
  isLoading: boolean;
  errorMessage: string | null;
  onGeneratePix: () => void;
};

export function InvoicePixDialog({
  open,
  onOpenChange,
  invoice,
  pixData,
  isLoading,
  errorMessage,
  onGeneratePix,
}: InvoicePixDialogProps) {
  useEffect(() => {
    if (open && !pixData && !isLoading && invoice.status !== "paid" && invoice.status !== "cancelled") {
      onGeneratePix();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
            Pagamento via Pix
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
            {invoice.clientName} · Fatura #{invoice.number}
          </DialogDescription>
        </DialogHeader>

        <InvoicePixContent
          invoice={invoice}
          pixData={pixData}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onGenerate={onGeneratePix}
        />
      </DialogContent>
    </Dialog>
  );
}
