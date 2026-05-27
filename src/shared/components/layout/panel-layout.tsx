import { Outlet } from "react-router";
import { useSidebarContext } from "@/shared/context/use-sidebar";
import { Sidebar } from "./sidebar";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { PainelHeader } from "./painel-header";

export function PanelLayout() {
  const { isExpanded } = useSidebarContext();

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
      <Sidebar />

      <main
        className={`flex-1 flex flex-col min-w-0 overflow-hidden hidden md:flex transition-all duration-300 ${
          isExpanded ? "ml-60" : "ml-16"
        }`}
      >
        <PainelHeader />
        <div className="flex-1 overflow-y-auto px-8">
          <Outlet />
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
