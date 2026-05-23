import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useSidebarContext } from "@/shared/context/sidebar-context";
import { cn } from "@/shared/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/painel/dashboard", icon: LayoutDashboard },
  { label: "Usuários", href: "/painel/usuarios", icon: Users },
  { label: "Faturas", href: "/painel/faturas", icon: FileText },
  { label: "Configurações", href: "/painel/configuracoes", icon: Settings },
];

export function Sidebar() {
  const { isExpanded, setIsExpanded } = useSidebarContext();
  const location = useLocation();

  // Mock user data
  const user = {
    name: "Vinicius Morais",
    email: "vinicius123morais@gmail.com",
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen bg-white border-r border-zinc-200 shadow-sm transition-[width] duration-300 overflow-hidden fixed left-0 top-0",
        isExpanded ? "w-60" : "w-16"
      )}
    >
      {/* Header com brand */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-200 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 text-white font-bold text-sm">
            S
          </div>
          {isExpanded && (
            <div className="min-w-0">
              <p className="font-bold text-zinc-900 leading-none">SAF</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Admin Panel</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors shrink-0"
          title={isExpanded ? "Encolher sidebar" : "Expandir sidebar"}
        >
          {isExpanded ? (
            <PanelLeftClose size={20} />
          ) : (
            <PanelLeftOpen size={20} />
          )}
        </button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 p-3 space-y-1 overflow-hidden">
        {NAV_ITEMS.map((item) => {
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
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <Icon size={18} className="shrink-0" />
              {isExpanded && item.label}
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <div className="p-3 border-t border-zinc-200 shrink-0">
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
              <p className="text-sm font-medium text-zinc-900 truncate">
                {user?.name ?? "Usuário"}
              </p>
              <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => console.log("Logout")}
          title={!isExpanded ? "Sair da conta" : undefined}
          className={cn(
            "w-full text-sm text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors",
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
