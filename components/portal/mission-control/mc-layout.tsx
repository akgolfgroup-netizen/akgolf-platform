"use client";

import { useState, createContext, useContext } from "react";
import { CoachHQSidebar } from "@/components/admin/CoachHQSidebar";

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

/**
 * MCLayout — beholdt navn for bakoverkompatibilitet, men bruker nå CoachHQSidebar.
 * Brand Guide V2.0 (2026-04-25). Sidebar er inline (flex), ikke fixed.
 */
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
      <div
        className="min-h-screen flex"
        style={{ background: "var(--color-surface)" }}
      >
        {/* CoachHQ-sidebar — desktop kun (1280px+) per Sprint 1-spec */}
        <div className="hidden lg:flex">
          <CoachHQSidebar user={user} />
        </div>
        <main className="flex-1 min-h-screen flex flex-col p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </MCSidebarContext.Provider>
  );
}
