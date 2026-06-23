import { useState } from "react";
import {
  Eye, Pencil, Trash2, MoreHorizontal,
  Loader2, AlertTriangle, Users,
} from "lucide-react";
import type { Client, ClientType } from "../types/client";
import { ClientStatusBadge } from "./client-status-badge";
import { ClientSearch, type TypeFilter } from "./client-search";

type ClientTableProps = {
  clients: Client[];
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
};

const TYPE_CFG: Record<ClientType, { label: string; bg: string; text: string }> = {
  individual: {
    label: "Pessoa Física",
    bg: "bg-purple-50 dark:bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400",
  },
  company: {
    label: "Empresa",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
  },
};

const COLS = ["Nome", "Email", "Telefone", "Documento", "Tipo", "Status", "Criado em", "Ações"];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

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
              { Icon: Eye,    label: "Ver detalhes",    cls: "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800" },
              { Icon: Pencil, label: "Editar cliente",  cls: "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800" },
              { Icon: Trash2, label: "Excluir cliente", cls: "text-[#EF4444] hover:bg-[#EF4444]/10" },
            ].map(({ Icon, label, cls }) => (
              <button
                key={label}
                className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5 transition-colors ${cls}`}
              >
                <Icon size={13} className="text-zinc-400 dark:text-zinc-500" />
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ClientTable({ clients, totalCount, isLoading, isError }: ClientTableProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const filtered = clients.filter((c) => {
    const matchSearch = (c.name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || c.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">

      {/* Card header */}
      <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800 flex-wrap">
        <div>
          <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Lista de Clientes</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Gerencie os clientes cadastrados no sistema
          </p>
        </div>
        <ClientSearch
          search={search}
          onSearch={setSearch}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-800/50">
              {COLS.map((col, i) => (
                <th
                  key={col}
                  className={`py-3 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ${
                    i === COLS.length - 1 ? "text-center" : "text-left"
                  }`}
                  style={{
                    paddingLeft: i === 0 ? 24 : 16,
                    paddingRight: i === COLS.length - 1 ? 24 : 16,
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={COLS.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 size={24} className="text-blue-600 animate-spin" />
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Carregando clientes...
                    </p>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={COLS.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-[#EF4444]/10 flex items-center justify-center">
                      <AlertTriangle size={20} className="text-red-500 dark:text-[#EF4444]" />
                    </div>
                    <p className="text-sm font-semibold text-[#EF4444]">Erro ao carregar clientes</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      Verifique a conexão com a API
                    </p>
                  </div>
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((client) => {
                const typeCfg = TYPE_CFG[client.type];
                const initial = (client.name ?? "?")[0].toUpperCase();
                return (
                  <tr
                    key={client.id}
                    className="border-t border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    {/* Nome */}
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">{initial}</span>
                        </div>
                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">
                          {client.name}
                        </p>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-4">
                      <p className="text-sm text-zinc-600 dark:text-zinc-300">
                        {client.email ?? "—"}
                      </p>
                    </td>

                    {/* Telefone */}
                    <td className="py-4 px-4">
                      <p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
                        {client.phone ?? "—"}
                      </p>
                    </td>

                    {/* Documento */}
                    <td className="py-4 px-4">
                      <p className="text-sm font-mono text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
                        {client.document ?? "—"}
                      </p>
                    </td>

                    {/* Tipo */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${typeCfg.bg} ${typeCfg.text}`}
                      >
                        {typeCfg.label}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <ClientStatusBadge status={client.status} />
                    </td>

                    {/* Criado em */}
                    <td className="py-4 px-4">
                      <p className="text-sm text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                        {formatDate(client.createdAt)}
                      </p>
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
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        <RowMenu />
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={COLS.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      <Users size={20} className="text-zinc-400 dark:text-zinc-500" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Nenhum cliente encontrado
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      Tente ajustar o filtro ou a busca
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {!isLoading && !isError && filtered.length > 0 && (
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            Exibindo {filtered.length} de {totalCount} cliente{totalCount !== 1 ? "s" : ""}
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
  );
}
