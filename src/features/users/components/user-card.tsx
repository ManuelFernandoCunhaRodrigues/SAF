import { Mail, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

type Role = "Admin" | "User";

type UserCardProps = {
  name: string;
  email: string;
  role: Role;
  initials: string;
  avatarColor: string;
};

const ROLE_CFG: Record<Role, { label: string; cls: string }> = {
  Admin: {
    label: "Admin",
    cls: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20",
  },
  User: {
    label: "Usuário",
    cls: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700",
  },
};

export function UserCard({ name, email, role, initials, avatarColor }: UserCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cfg = ROLE_CFG[role];

  return (
    <article className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-8 py-7 shadow-sm flex items-center justify-between gap-6 hover:shadow-md transition-shadow duration-200 relative group">

      {/* Avatar + info */}
      <div className="flex items-center gap-5">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm ${avatarColor}`}
        >
          {initials}
        </div>
        <div>
          <p className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100 leading-tight">
            {name}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <Mail size={11} className="text-zinc-400 dark:text-zinc-500" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{email}</p>
          </div>
        </div>
      </div>

      {/* Role + actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${cfg.cls}`}>
          {cfg.label}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
            title="Editar"
          >
            <Pencil size={14} />
          </button>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            title="Excluir"
          >
            <Trash2 size={14} />
          </button>
        </div>

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
                <button className="w-full px-4 py-2.5 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2.5 transition-colors">
                  <Pencil size={13} className="text-zinc-400" /> Editar usuário
                </button>
                <button className="w-full px-4 py-2.5 text-left text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2.5 transition-colors">
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
