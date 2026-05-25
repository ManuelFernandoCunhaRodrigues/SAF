import { useContext } from "react";
import { SidebarContext } from "./sidebar";

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext deve ser usado dentro de SidebarProvider");
  }
  return context;
}
