import { Link, useLocation } from "react-router";
import safLogo from "@/assets/saf-incone-logo.png";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useSidebarContext } from "@/shared/context/use-sidebar";
import { cn } from "@/shared/lib/utils";
import { useAuthContext } from "@/app/providers/use-auth";

const NAV_ITEMS = [
  { label: "Dashboard",    href: "/painel/dashboard",    icon: LayoutDashboard },
  { label: "Usuários",     href: "/painel/usuarios",     icon: Users },
  { label: "Cobranças",    href: "/painel/faturas",      icon: DollarSign },
  { label: "Configurações",href: "/painel/configuracoes",icon: Settings },
];

export function Sidebar() {
  const { isExpanded, setIsExpanded } = useSidebarContext();
  const { user, logout } = useAuthContext();
  const location = useLocation();

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
          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
            <img src={safLogo} alt="SAF" className="w-full h-full object-contain" />
          </div>
          {isExpanded && (
            <div className="min-w-0">
              <p className="font-bold text-zinc-900 dark:text-[#F1F5F9] leading-none tracking-tight">SAF</p>
              <p className="text-[11px] text-zinc-500 dark:text-[#64748B] mt-0.5">Automação</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 text-zinc-500 dark:text-[#64748B] hover:text-zinc-900 dark:hover:text-[#F1F5F9] hover:bg-zinc-100 dark:hover:bg-[#27272A] rounded-lg transition-colors shrink-0"
          title={isExpanded ? "Encolher sidebar" : "Expandir sidebar"}
        >
          {isExpanded ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href ||
            (item.href === "/painel/dashboard" && location.pathname === "/painel");
          return (
            <Link
              key={item.href}
              to={item.href}
              title={!isExpanded ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg text-sm font-medium transition-all",
                isExpanded ? "px-3 py-2.5" : "justify-center py-2.5 px-0",
                isActive
                  ? "bg-blue-50 dark:bg-[#2563EB]/10 text-blue-600 dark:text-[#60A5FA]"
                  : "text-zinc-600 dark:text-[#64748B] hover:bg-zinc-100 dark:hover:bg-[#27272A] hover:text-zinc-900 dark:hover:text-[#F1F5F9]"
              )}
            >
              <Icon size={17} className="shrink-0" />
              {isExpanded && item.label}
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <div className="p-3 border-t border-zinc-100 dark:border-[#27272A] shrink-0">
        <div
          className={cn(
            "flex items-center rounded-lg mb-1",
            isExpanded ? "gap-3 px-3 py-2" : "justify-center py-2"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-sm font-semibold text-white shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          {isExpanded && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-900 dark:text-[#F1F5F9] truncate leading-none">
                {user?.name ?? "Usuário"}
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-[#64748B] truncate mt-0.5">
                {user?.role === "admin" ? "Administrador" : "Usuário"}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          title={!isExpanded ? "Sair da conta" : undefined}
          className={cn(
            "w-full text-sm text-zinc-500 dark:text-[#64748B] hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/8 rounded-lg transition-colors",
            isExpanded ? "flex items-center gap-2 px-3 py-2" : "flex justify-center py-2"
          )}
        >
          <LogOut size={15} />
          {isExpanded && "Sair da conta"}
        </button>
      </div>
    </aside>
  );
}
