import { Search, SlidersHorizontal } from "lucide-react";
import type { ClientType } from "../types/client";

export type TypeFilter = "all" | ClientType;

type ClientSearchProps = {
  search: string;
  onSearch: (value: string) => void;
  typeFilter: TypeFilter;
  onTypeChange: (value: TypeFilter) => void;
};

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: "all",        label: "Todos" },
  { value: "individual", label: "Pessoa Física" },
  { value: "company",    label: "Empresa" },
];

export function ClientSearch({ search, onSearch, typeFilter, onTypeChange }: ClientSearchProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 w-64">
        <Search size={13} className="text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
        <input
          type="text"
          placeholder="Buscar cliente por nome..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="flex-1 text-xs bg-transparent text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none"
        />
      </div>

      <div className="flex items-center gap-0.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-1">
        <SlidersHorizontal size={12} className="text-zinc-400 dark:text-zinc-500 mx-1.5" />
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onTypeChange(f.value)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              typeFilter === f.value
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
