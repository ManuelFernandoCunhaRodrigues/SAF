import { useLocation } from "react-router";
import { Bell } from "lucide-react";
import { useAuthContext } from "@/app/providers/auth-provider";

const pageTitles: Record<string, string> = {
  "/painel/dashboard": "Dashboard",
  "/painel/usuarios": "Usuários",
  "/painel/faturas": "Faturas",
  "/painel/configuracoes": "Configurações",
};

export function Navbar() {
  const location = useLocation();
  const { user } = useAuthContext();
  const title = pageTitles[location.pathname] ?? "Painel";

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0">
      <h1 className="text-lg font-semibold text-zinc-800">{title}</h1>

      <div className="flex items-center gap-3">
        <button className="p-2 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-zinc-200">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold text-white shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-zinc-700 leading-none">
              {user?.name ?? "Usuário"}
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              {user?.role === "admin" ? "Administrador" : "Usuário"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
