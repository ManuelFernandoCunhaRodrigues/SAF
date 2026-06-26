import { Mail, MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import type { User } from "../types/user";

type UserCardProps = {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
};

const ROLE_CFG: Record<"admin" | "user", { label: string; cls: string }> = {
  admin: {
    label: "Admin",
    cls: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20",
  },
  user: {
    label: "Usuário",
    cls: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700",
  },
};

const AVATAR_COLORS = [
  "bg-[#2563EB]",
  "bg-[#1D4ED8]",
  "bg-[#3B82F6]",
  "bg-[#1E40AF]",
  "bg-[#60A5FA]",
  "bg-[#1E3A8A]",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function getAvatarColor(name: string): string {
  let hash = 0;
  for (const c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function UserCard({ user, onEdit, onDelete, isDeleting }: UserCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cfg = ROLE_CFG[user.role];
  const initials = getInitials(user.name);
  const avatarColor = getAvatarColor(user.name);

  function handleEdit() {
    setMenuOpen(false);
    onEdit();
  }

  function handleDelete() {
    setMenuOpen(false);
    onDelete();
  }

  return (
    <article
      className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-8 py-7 shadow-sm flex items-center justify-between gap-6 hover:shadow-md transition-shadow duration-200 relative group ${
        isDeleting ? "opacity-50 pointer-events-none" : ""
      }`}
    >

      {/* Avatar + info */}
      <div className="flex items-center gap-5">
        {isDeleting ? (
          <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
            <Loader2 size={18} className="text-zinc-400 animate-spin" />
          </div>
        ) : (
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm ${avatarColor}`}
          >
            {initials}
          </div>
        )}
        <div>
          <p className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100 leading-tight">
            {user.name}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <Mail size={11} className="text-zinc-400 dark:text-zinc-500" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
          </div>
          {!user.isActive && (
            <span className="inline-block mt-1.5 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
              Inativo
            </span>
          )}
        </div>
      </div>

      {/* Role + actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${cfg.cls}`}>
          {cfg.label}
        </span>

        {/* Ações rápidas (visíveis no hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={handleEdit}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
            title="Editar"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
            title="Excluir"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Menu de contexto */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-20 overflow-hidden py-1">
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2.5 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2.5 transition-colors"
                >
                  <Pencil size={13} className="text-zinc-400" /> Editar usuário
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2.5 text-left text-sm text-[#EF4444] hover:bg-[#EF4444]/10 flex items-center gap-2.5 transition-colors"
                >
                  <Trash2 size={13} /> Excluir usuário
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
