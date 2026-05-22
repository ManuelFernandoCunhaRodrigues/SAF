import { Plus } from "lucide-react";
import { useInvoices } from "../hooks/use-invoices";
import type { InvoiceStatus } from "../types/invoice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

const statusConfig: Record<
  InvoiceStatus,
  { label: string; className: string }
> = {
  paid: { label: "Pago", className: "bg-emerald-100 text-emerald-700" },
  pending: { label: "Pendente", className: "bg-amber-100 text-amber-700" },
  overdue: { label: "Vencida", className: "bg-red-100 text-red-700" },
  cancelled: { label: "Cancelada", className: "bg-zinc-100 text-zinc-500" },
};

export function InvoicesPage() {
  const { data, isLoading, isError } = useInvoices();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-800">Faturas</h2>
          <p className="text-zinc-500 text-sm mt-1">
            Gerencie as faturas do sistema
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Nova Fatura
        </Button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {isLoading && (
          <div className="p-12 text-center text-zinc-400">
            Carregando faturas...
          </div>
        )}

        {isError && (
          <div className="p-12 text-center text-red-500">
            Erro ao carregar faturas.
          </div>
        )}

        {!isLoading && !isError && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Emissão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!data || data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-zinc-400 py-12"
                  >
                    Nenhuma fatura encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((invoice) => {
                  const status = statusConfig[invoice.status];
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium text-zinc-600">
                        #{invoice.number}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-zinc-800">
                          {invoice.clientName}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {invoice.clientEmail}
                        </p>
                      </TableCell>
                      <TableCell className="font-semibold text-zinc-800">
                        {formatCurrency(invoice.amount)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-zinc-600">
                        {formatDate(invoice.dueDate)}
                      </TableCell>
                      <TableCell className="text-zinc-400 text-sm">
                        {formatDate(invoice.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
