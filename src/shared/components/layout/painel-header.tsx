import { Bell, Link2, Zap } from "lucide-react";

export function PainelHeader() {
  // Mock user data
  const user = {
    name: "Vinicius Morais",
    role: "admin",
  };

  return (
    <header className="h-16 border-b border-zinc-200 bg-white flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-zinc-800">Dashboard</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="p-2 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors relative"
          title="Notificações"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button
          className="p-2 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
          title="Compartilhar link"
        >
          <Link2 size={20} />
        </button>

        <button
          className="p-2 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
          title="Atalhos"
        >
          <Zap size={20} />
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
