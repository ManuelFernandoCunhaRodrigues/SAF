import { useState, ReactNode } from "react";
import { SidebarContext } from "./sidebar";

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <SidebarContext.Provider value={{ isExpanded, setIsExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
}
