import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  UserCheck,
} from "lucide-react";
import { useSidebarContext } from "@/shared/context/use-sidebar";
import { useAuthContext } from "@/app/providers/use-auth";
import { cn } from "@/shared/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard",     href: "/painel/dashboard",      icon: LayoutDashboard, adminOnly: false },
  { label: "Usuários",      href: "/painel/usuarios",        icon: Users,           adminOnly: true  },
  { label: "Faturas",       href: "/painel/faturas",         icon: FileText,        adminOnly: false },
  { label: "Clientes",      href: "/painel/clientes",        icon: UserCheck,       adminOnly: false },
  { label: "Configurações", href: "/painel/configuracoes",   icon: Settings,        adminOnly: false },
];

export function Sidebar() {
  const { isExpanded, setIsExpanded } = useSidebarContext();
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const isAdmin = user?.role === "admin";

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen bg-white dark:bg-[#09090B] border-r border-zinc-100 dark:border-[#27272A] transition-all duration-300 overflow-hidden fixed left-0 top-0",
        isExpanded ? "w-60" : "w-16"
      )}
    >
      {/* Brand */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-100 dark:border-[#27272A] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 text-white font-bold text-sm">
            S
          </div>
          {isExpanded && (
            <div className="min-w-0">
              <p className="font-bold text-zinc-900 dark:text-[#F1F5F9] leading-none">SAF</p>
              <p className="text-[11px] text-zinc-500 dark:text-[#64748B] mt-0.5">Admin Panel</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 text-zinc-500 dark:text-[#64748B] hover:text-zinc-900 dark:hover:text-[#F1F5F9] hover:bg-zinc-100 dark:hover:bg-[#27272A] rounded-lg transition-colors shrink-0"
          title={isExpanded ? "Encolher sidebar" : "Expandir sidebar"}
        >
          {isExpanded ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-hidden">
        {NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              title={!isExpanded ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg text-sm font-medium transition-all",
                isExpanded ? "px-3 py-2.5" : "justify-center py-2.5 px-0",
                isActive
                  ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-zinc-600 dark:text-[#64748B] hover:bg-zinc-100 dark:hover:bg-[#27272A] hover:text-zinc-900 dark:hover:text-[#F1F5F9]"
              )}
            >
              <Icon size={18} className="shrink-0" />
              {isExpanded && item.label}
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <div className="p-3 border-t border-zinc-200 dark:border-[#27272A] shrink-0">
        <div
          className={cn(
            "flex items-center rounded-lg mb-2",
            isExpanded ? "gap-3 px-3 py-2" : "justify-center py-2"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-sm font-semibold text-white shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          {isExpanded && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-900 dark:text-[#F1F5F9] truncate">
                {user?.name ?? "Usuário"}
              </p>
              <p className="text-xs text-zinc-500 dark:text-[#64748B] truncate">{user?.email}</p>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          title={!isExpanded ? "Sair da conta" : undefined}
          className={cn(
            "w-full text-sm text-zinc-600 dark:text-[#64748B] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors",
            isExpanded ? "flex items-center gap-2 px-3 py-2" : "flex justify-center py-2"
          )}
        >
          <LogOut size={16} />
          {isExpanded && "Sair da conta"}
        </button>
      </div>
    </aside>
  );
}
