import { Bell, Moon, Sun } from "lucide-react";
import { useLocation } from "react-router";
import { useTheme } from "@/shared/context/theme-context";
import { useAuthContext } from "@/app/providers/use-auth";

const ROUTE_LABELS: Record<string, string> = {
  "/painel/dashboard":     "Dashboard",
  "/painel/usuarios":      "Usuários",
  "/painel/faturas":       "Cobranças",
  "/painel/configuracoes": "Configurações",
};

export function PainelHeader() {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const { user } = useAuthContext();

  const pageTitle = ROUTE_LABELS[pathname] ?? "Painel";

  return (
    <header className="h-16 border-b border-zinc-100 dark:border-[#27272A] bg-white dark:bg-[#09090B] flex items-center justify-between px-6 shrink-0 transition-colors duration-200">
      <h1 className="text-[15px] font-semibold text-zinc-800 dark:text-[#F1F5F9] tracking-tight">
        {pageTitle}
      </h1>

      <div className="flex items-center gap-1">
        <button
          onClick={toggleTheme}
          className="p-2 text-zinc-400 dark:text-[#64748B] hover:text-zinc-700 dark:hover:text-[#F1F5F9] rounded-lg hover:bg-zinc-100 dark:hover:bg-[#27272A] transition-colors"
          title={theme === "dark" ? "Modo claro" : "Modo escuro"}
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button
          className="p-2 text-zinc-400 dark:text-[#64748B] hover:text-zinc-700 dark:hover:text-[#F1F5F9] rounded-lg hover:bg-zinc-100 dark:hover:bg-[#27272A] transition-colors relative"
          title="Notificações"
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2.5 pl-3 ml-1 border-l border-zinc-100 dark:border-[#27272A]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-sm font-semibold text-white shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-zinc-700 dark:text-[#F1F5F9] leading-none">
              {user?.name ?? "Usuário"}
            </p>
            <p className="text-[11px] text-zinc-400 dark:text-[#64748B] mt-0.5">
              {user?.role === "admin" ? "Administrador" : "Usuário"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
