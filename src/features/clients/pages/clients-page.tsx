import { useState } from "react";
import { Plus, Users, UserCheck, UserX, Building2 } from "lucide-react";
import { useClients } from "../hooks/use-clients";
import { ClientTable } from "../components/client-table";
import { ClientForm } from "../components/client-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";

export function ClientsPage() {
  const { data: clients = [], isLoading, isError } = useClients();
  const [dialogOpen, setDialogOpen] = useState(false);

  const total     = clients.length;
  const active    = clients.filter((c) => c.status === "active").length;
  const inactive  = clients.filter((c) => c.status === "inactive").length;
  const companies = clients.filter((c) => c.type === "company").length;

  const kpis = [
    {
      label: "Total de Clientes",
      value: total,
      sub: isLoading ? "Carregando..." : `${total} cadastrado${total !== 1 ? "s" : ""}`,
      Icon: Users,
      iBg: "bg-blue-50 dark:bg-[#2563EB]/10",
      iC: "text-blue-600 dark:text-[#3B82F6]",
      vC: "text-zinc-800 dark:text-zinc-100",
    },
    {
      label: "Clientes Ativos",
      value: active,
      sub: `${active} ativo${active !== 1 ? "s" : ""}`,
      Icon: UserCheck,
      iBg: "bg-blue-50 dark:bg-[#3B82F6]/10",
      iC: "text-blue-500 dark:text-[#60A5FA]",
      vC: "text-blue-500 dark:text-[#60A5FA]",
    },
    {
      label: "Clientes Inativos",
      value: inactive,
      sub: `${inactive} inativo${inactive !== 1 ? "s" : ""}`,
      Icon: UserX,
      iBg: "bg-zinc-100 dark:bg-zinc-800",
      iC: "text-zinc-500 dark:text-zinc-400",
      vC: "text-zinc-500 dark:text-zinc-400",
    },
    {
      label: "Empresas",
      value: companies,
      sub: `${companies} empresa${companies !== 1 ? "s" : ""} cadastrada${companies !== 1 ? "s" : ""}`,
      Icon: Building2,
      iBg: "bg-blue-50 dark:bg-blue-500/10",
      iC: "text-blue-600 dark:text-blue-400",
      vC: "text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <div className="py-8 space-y-7">

      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
            Clientes
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Gerencie os clientes do sistema
          </p>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors whitespace-nowrap"
        >
          <Plus size={15} strokeWidth={2.5} />
          Novo Cliente
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.Icon;
          return (
            <div
              key={k.label}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center gap-4"
            >
              <div
                className={`w-10 h-10 rounded-xl ${k.iBg} flex items-center justify-center flex-shrink-0`}
              >
                <Icon size={18} className={k.iC} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  {k.label}
                </p>
                <p className={`text-lg font-bold mt-0.5 leading-none ${k.vC}`}>{k.value}</p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">{k.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabela */}
      <ClientTable
        clients={clients}
        totalCount={total}
        isLoading={isLoading}
        isError={isError}
      />

      {/* Modal de cadastro */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
              Novo Cliente
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
              Preencha os dados para cadastrar um novo cliente no sistema.
            </DialogDescription>
          </DialogHeader>

          <ClientForm
            onSuccess={() => setDialogOpen(false)}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

    </div>
  );
}
