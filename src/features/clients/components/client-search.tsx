import { Search, SlidersHorizontal } from "lucide-react";
import type { ClientStatus } from "../types/client";

export type StatusFilter = "all" | ClientStatus;

type ClientSearchProps = {
  search: string;
  onSearch: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
};

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all",      label: "Todos" },
  { value: "active",   label: "Ativo" },
  { value: "inactive", label: "Inativo" },
];

export function ClientSearch({ search, onSearch, statusFilter, onStatusChange }: ClientSearchProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 w-64">
        <Search size={13} className="text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
        <input
          type="text"
          placeholder="Buscar por nome, email ou documento..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="flex-1 text-xs bg-transparent text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none"
        />
      </div>

      <div className="flex items-center gap-0.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-1">
        <SlidersHorizontal size={12} className="text-zinc-400 dark:text-zinc-500 mx-1.5" />
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onStatusChange(f.value)}
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
  );
}
