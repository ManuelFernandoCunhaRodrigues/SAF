import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

import { useAuthContext } from "@/app/providers/auth-provider";
import { cn } from "@/shared/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/painel/dashboard", icon: LayoutDashboard },
  { label: "Usuários", href: "/painel/usuarios", icon: Users },
  { label: "Faturas", href: "/painel/faturas", icon: FileText },
  { label: "Configurações", href: "/painel/configuracoes", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-zinc-900 text-zinc-100 shrink-0">
      <div className="px-6 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div>
            <p className="font-bold text-white leading-none">SAF</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              )}
            >
              <Icon size={18} className="shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-1 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold text-white shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-100 truncate">
              {user?.name ?? "Usuário"}
            </p>
            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          Sair da conta
        </button>
      </div>
    </aside>
  );
}
