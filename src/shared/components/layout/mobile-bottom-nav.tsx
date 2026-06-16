import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useAuthContext } from "@/app/providers/use-auth";

const PRIMARY_ITEMS = [
  { label: "Dashboard", href: "/painel/dashboard", icon: LayoutDashboard },
  { label: "Usuários", href: "/painel/usuarios", icon: Users },
  { label: "Faturas", href: "/painel/faturas", icon: FileText },
  { label: "Configurações", href: "/painel/configuracoes", icon: Settings },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { logout } = useAuthContext();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-zinc-200 bg-white flex items-center justify-around h-16 z-40">
      {PRIMARY_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;

        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 h-full text-[10px] font-medium transition-colors",
              isActive ? "text-blue-600" : "text-zinc-600 hover:text-zinc-900"
            )}
          >
            <Icon size={24} />
            <span>{item.label}</span>
          </Link>
        );
      })}

      <button
        onClick={logout}
        className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-[10px] font-medium text-zinc-600 hover:text-red-600 transition-colors"
      >
        <LogOut size={24} />
        <span>Sair</span>
      </button>
    </nav>
  );
}
