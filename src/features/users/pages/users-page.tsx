import { useState } from "react";
import { Plus, Search, Users, ShieldCheck, UserIcon, SlidersHorizontal } from "lucide-react";
import { UserCard } from "../components/user-card";
import { UserForm } from "../components/user-form";
import { EditUserForm } from "../components/edit-user-form";
import { useUsers } from "../hooks/use-users";
import { useDeleteUser } from "../hooks/use-delete-user";
import type { User } from "../types/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";

type RoleFilter = "Todos" | "Admin" | "User";

export function UsersPage() {
  const { data: users = [], isLoading, isError } = useUsers();
  const { mutate: deleteUser, isPending: isDeleting, variables: deletingId } = useDeleteUser();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("Todos");
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const admins  = users.filter((u) => u.role === "admin").length;
  const regular = users.filter((u) => u.role === "user").length;

  const STATS = [
    { label: "Total de usuários", value: String(users.length), Icon: Users,       iBg: "bg-blue-50 dark:bg-[#2563EB]/10", iC: "text-blue-600 dark:text-[#3B82F6]" },
    { label: "Administradores",   value: String(admins),        Icon: ShieldCheck, iBg: "bg-blue-50 dark:bg-[#60A5FA]/10",  iC: "text-blue-400 dark:text-[#60A5FA]" },
    { label: "Usuários comuns",   value: String(regular),       Icon: UserIcon,    iBg: "bg-blue-50 dark:bg-[#93C5FD]/10",  iC: "text-blue-300 dark:text-[#93C5FD]" },
  ];

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    const roleLabel: RoleFilter = u.role === "admin" ? "Admin" : "User";
    const matchRole = roleFilter === "Todos" || roleLabel === roleFilter;
    return matchSearch && matchRole;
  });

  function handleDelete(user: User) {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário "${user.name}"? Esta ação não pode ser desfeita.`))
      return;
    deleteUser(user.id);
  }

  return (
    <div className="py-8 space-y-8">

      {/* ── Cabeçalho ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
            Usuários
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Gerencie os usuários do sistema
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors whitespace-nowrap"
        >
          <Plus size={15} strokeWidth={2.5} />
          Novo Usuário
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        {STATS.map((s) => {
          const Icon = s.Icon;
          return (
            <div
              key={s.label}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-xl ${s.iBg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={s.iC} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mt-0.5 leading-none">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Filtros ── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 flex-1 max-w-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 shadow-sm">
          <Search size={14} className="text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1 shadow-sm">
          <SlidersHorizontal size={13} className="text-zinc-400 dark:text-zinc-500 ml-2 mr-1" />
          {(["Todos", "Admin", "User"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setRoleFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                roleFilter === f
                  ? "bg-blue-600 text-white"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
            >
              {f === "User" ? "Usuário" : f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Lista de usuários ── */}
      <div className="flex flex-col gap-5">
        {isLoading ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 shadow-sm flex flex-col items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Carregando usuários...</p>
          </div>
        ) : isError ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 shadow-sm flex flex-col items-center gap-3">
            <p className="text-sm font-semibold text-[#EF4444]">Erro ao carregar usuários</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">Tente novamente mais tarde</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={() => setEditUser(user)}
              onDelete={() => handleDelete(user)}
              isDeleting={isDeleting && deletingId === user.id}
            />
          ))
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 shadow-sm flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <Users size={20} className="text-zinc-400 dark:text-zinc-500" />
            </div>
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Nenhum usuário encontrado</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">Tente ajustar o filtro ou a busca</p>
          </div>
        )}
      </div>

      {!isLoading && !isError && filtered.length > 0 && (
        <p className="text-xs text-zinc-400 dark:text-zinc-600">
          Exibindo {filtered.length} de {users.length} usuário{users.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* ── Modal: Novo Usuário ── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
              Novo Usuário
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
              Preencha os dados para cadastrar um novo usuário no sistema.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            onSuccess={() => setCreateOpen(false)}
            onCancel={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* ── Modal: Editar Usuário ── */}
      <Dialog open={!!editUser} onOpenChange={(open) => { if (!open) setEditUser(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
              Editar Usuário
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
              Atualize os dados do usuário.
            </DialogDescription>
          </DialogHeader>
          {editUser && (
            <EditUserForm
              key={editUser.id}
              user={editUser}
              onSuccess={() => setEditUser(null)}
              onCancel={() => setEditUser(null)}
            />
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
