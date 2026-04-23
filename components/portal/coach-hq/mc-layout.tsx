"use client";

import { useState, createContext, useContext } from "react";
import { CoachHQSidebar } from "./mc-sidebar";

interface CoachHQLayoutProps {
  children: React.ReactNode;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
  };
}

interface CoachHQSidebarContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const CoachHQSidebarContext = createContext<CoachHQSidebarContextType | null>(null);

export function useCoachHQSidebar() {
  const context = useContext(CoachHQSidebarContext);
  if (!context) {
    throw new Error("useCoachHQSidebar must be used within CoachHQLayoutProvider");
  }
  return context;
}

export function CoachHQLayout({ children, user }: CoachHQLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);

  const contextValue: CoachHQSidebarContextType = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };

  return (
    <CoachHQSidebarContext.Provider value={contextValue}>
      <div className="min-h-screen flex bg-surface">
        <CoachHQSidebar user={user} isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <main className="flex-1 lg:ml-64 min-h-screen flex flex-col p-6 lg:p-8">
          {children}
        </main>
      </div>
    </CoachHQSidebarContext.Provider>
  );
}
