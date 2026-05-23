import { SidebarProvider } from "@/shared/context/sidebar-context";
import { PanelLayout } from "./panel-layout";

export function PanelLayoutWithProvider() {
  return (
    <SidebarProvider>
      <PanelLayout />
    </SidebarProvider>
  );
}
