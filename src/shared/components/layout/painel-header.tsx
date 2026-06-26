import { Bell, Link2, Zap, Moon, Sun } from "lucide-react";
import { useTheme } from "@/shared/context/theme-context";
import { useAuthContext } from "@/app/providers/use-auth";

export function PainelHeader() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuthContext();

  return (
    <header className="h-16 border-b border-zinc-100 dark:border-[#27272A] bg-white dark:bg-[#09090B] flex items-center justify-between px-6 shrink-0 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-zinc-800 dark:text-[#F1F5F9]">Dashboard</h1>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={toggleTheme}
          className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-[#F1F5F9] rounded-lg hover:bg-zinc-100 dark:hover:bg-[#27272A] transition-colors"
          title={theme === "dark" ? "Modo claro" : "Modo escuro"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-[#F1F5F9] rounded-lg hover:bg-zinc-100 dark:hover:bg-[#27272A] transition-colors relative"
          title="Notificações"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        <button
          className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-[#F1F5F9] rounded-lg hover:bg-zinc-100 dark:hover:bg-[#27272A] transition-colors"
          title="Compartilhar link"
        >
          <Link2 size={18} />
        </button>

        <button
          className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-[#F1F5F9] rounded-lg hover:bg-zinc-100 dark:hover:bg-[#27272A] transition-colors"
          title="Atalhos"
        >
          <Zap size={18} />
        </button>

        <div className="flex items-center gap-2.5 pl-3 ml-1 border-l border-zinc-200 dark:border-[#27272A]">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold text-white shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-zinc-700 dark:text-[#F1F5F9] leading-none">
              {user?.name ?? "Usuário"}
            </p>
            <p className="text-xs text-zinc-400 dark:text-[#64748B] mt-0.5">
              {user?.role === "admin" ? "Administrador" : "Usuário"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
