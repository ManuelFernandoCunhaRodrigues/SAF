import { createContext } from "react";

interface SidebarContextType {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
