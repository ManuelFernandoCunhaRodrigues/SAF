import { Outlet } from "react-router";
import { useSidebarContext } from "@/shared/context/sidebar-context";
import { Sidebar } from "./sidebar";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { PainelHeader } from "./painel-header";

export function PanelLayout() {
  const { isExpanded } = useSidebarContext();

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Sidebar - Desktop only */}
      <Sidebar />

      {/* Main content area - com margin-left dinâmico baseado em isExpanded */}
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

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
}
