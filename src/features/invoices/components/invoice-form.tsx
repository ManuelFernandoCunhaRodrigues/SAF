import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

import { invoiceSchema, type InvoiceFormData } from "../schemas/invoice-schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

type InvoiceFormProps = {
  defaultValues?: Partial<InvoiceFormData>;
  isSubmitting?: boolean;
  isSuccess?: boolean;
  errorMessage?: string | null;
  onSubmit: (data: InvoiceFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
};

export function InvoiceForm({
  defaultValues,
  isSubmitting = false,
  isSuccess = false,
  errorMessage,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
}: InvoiceFormProps) {
  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      amount: 0,
      dueDate: "",
      status: "pending",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

        {/* Nome do cliente */}
        <FormField
          control={form.control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Nome do cliente <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Nome completo do cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* E-mail do cliente */}
        <FormField
          control={form.control}
          name="clientEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                E-mail do cliente <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="cliente@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Valor + Vencimento */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Valor (R$) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0,00"
                    {...field}
                    value={field.value === 0 ? "" : field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Vencimento <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Status <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="overdue">Vencida</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sucesso */}
        {isSuccess && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20">
            <CheckCircle2 size={15} className="text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-700 dark:text-green-400">
              Fatura salva com sucesso.
            </p>
          </div>
        )}

        {/* Erro global */}
        {errorMessage && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-[#EF4444]/10 border border-red-100 dark:border-[#EF4444]/20">
            <AlertCircle size={15} className="text-red-500 dark:text-[#EF4444] flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-[#EF4444]">{errorMessage}</p>
          </div>
        )}

        {/* Botões */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || isSuccess}
            className="rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>

      </form>
    </Form>
  );
}
