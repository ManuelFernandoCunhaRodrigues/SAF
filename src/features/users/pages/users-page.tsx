import { useState } from "react";
import { Plus, Search, Users, ShieldCheck, UserIcon, SlidersHorizontal } from "lucide-react";
import { UserCard } from "../components/user-card";

type Role = "Admin" | "User";

const ALL_USERS: {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials: string;
  avatarColor: string;
}[] = [
  { id: "1", name: "João Silva",      email: "joao@example.com",   role: "Admin", initials: "JS", avatarColor: "bg-blue-600" },
  { id: "2", name: "Maria Santos",    email: "maria@example.com",  role: "User",  initials: "MS", avatarColor: "bg-blue-500" },
  { id: "3", name: "Pedro Oliveira",  email: "pedro@example.com",  role: "User",  initials: "PO", avatarColor: "bg-blue-400" },
];

const STATS = [
  { label: "Total de usuários", value: "3",  Icon: Users,       iBg: "bg-blue-50 dark:bg-blue-500/10",   iC: "text-blue-600 dark:text-blue-400" },
  { label: "Administradores",   value: "1",  Icon: ShieldCheck, iBg: "bg-blue-100 dark:bg-blue-800/20",  iC: "text-blue-800 dark:text-blue-200" },
  { label: "Usuários comuns",   value: "2",  Icon: UserIcon,    iBg: "bg-blue-50 dark:bg-blue-500/10",   iC: "text-blue-500 dark:text-blue-400" },
];

export function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"Todos" | Role>("Todos");

  const filtered = ALL_USERS.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "Todos" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="py-8 space-y-8">

      {/* â”€â”€ CabeÃ§alho â”€â”€ */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-zinc-500 dark:text-[#64748B]">
          Gerencie os usuários do sistema
        </p>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors whitespace-nowrap">
          <Plus size={15} strokeWidth={2.5} />
          Novo Usuário
        </button>
      </div>

      {/* â”€â”€ Stats â”€â”€ */}
      <div className="grid grid-cols-3 gap-4">
        {STATS.map((s) => {
          const Icon = s.Icon;
          return (
            <div
              key={s.label}
              className="bg-white dark:bg-[#18181B] border border-zinc-100 dark:border-[#27272A] rounded-2xl p-6 shadow-sm flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-xl ${s.iBg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={s.iC} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 dark:text-[#64748B] uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-bold text-zinc-800 dark:text-[#F1F5F9] mt-0.5 leading-none">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* â”€â”€ Filtros â”€â”€ */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2.5 flex-1 max-w-xs bg-white dark:bg-[#18181B] border border-zinc-100 dark:border-[#27272A] rounded-xl px-3.5 py-2.5">
          <Search size={14} className="text-zinc-400 dark:text-[#94A3B8] flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none"
          />
        </div>

        {/* Role filter */}
        <div className="flex items-center gap-1 bg-white dark:bg-[#18181B] border border-zinc-100 dark:border-[#27272A] rounded-xl p-1">
          <SlidersHorizontal size={13} className="text-zinc-400 dark:text-[#94A3B8] ml-2 mr-1" />
          {(["Todos", "Admin", "User"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setRoleFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                roleFilter === f
                  ? "bg-blue-600 text-white"
                  : "text-zinc-500 dark:text-[#64748B] hover:bg-zinc-100 dark:hover:bg-[#27272A] hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
            >
              {f === "User" ? "Usuário" : f}
            </button>
          ))}
        </div>
      </div>

      {/* â”€â”€ Lista de usuÃ¡rios â”€â”€ */}
      <div className="flex flex-col gap-5">
        {filtered.length > 0 ? (
          filtered.map((user) => (
            <UserCard key={user.id} {...user} />
          ))
        ) : (
          <div className="bg-white dark:bg-[#18181B] border border-zinc-100 dark:border-[#27272A] rounded-2xl p-12 shadow-sm flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <Users size={20} className="text-zinc-400 dark:text-[#94A3B8]" />
            </div>
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Nenhum usuário encontrado</p>
            <p className="text-xs text-zinc-400 dark:text-[#94A3B8]">Tente ajustar o filtro ou a busca</p>
          </div>
        )}
      </div>

      {/* â”€â”€ Footer count â”€â”€ */}
      {filtered.length > 0 && (
        <p className="text-xs text-zinc-400 dark:text-zinc-600">
          Exibindo {filtered.length} de {ALL_USERS.length} usuário{ALL_USERS.length !== 1 ? "s" : ""}
        </p>
      )}

    </div>
  );
}

