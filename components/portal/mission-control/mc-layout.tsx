"use client";

import { useState, createContext, useContext } from "react";
import { MCSidebar } from "./mc-sidebar";

interface MCLayoutProps {
  children: React.ReactNode;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
  };
}

// Context for mobile menu state
interface MCSidebarContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const MCSidebarContext = createContext<MCSidebarContextType | null>(null);

export function useMCSidebar() {
  const context = useContext(MCSidebarContext);
  if (!context) {
    throw new Error("useMCSidebar must be used within MCLayoutProvider");
  }
  return context;
}

export function MCLayout({ children, user }: MCLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);

  const contextValue: MCSidebarContextType = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };

  return (
    <MCSidebarContext.Provider value={contextValue}>
      <div className="min-h-screen flex hg-bg">
        <MCSidebar user={user} isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <main className="flex-1 lg:ml-[220px] min-h-screen flex flex-col">
          {children}
        </main>
      </div>
    </MCSidebarContext.Provider>
  );
}
