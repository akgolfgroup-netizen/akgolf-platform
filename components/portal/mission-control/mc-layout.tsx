"use client";

import { useState, createContext, useContext } from "react";
import { CoachHQSidebar } from "@/components/admin/CoachHQSidebar";
import { CoachHQMobileHeader } from "./coachhq-mobile-header";

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
 * Brand Guide V2.0 (2026-04-25). Sidebar er inline (flex) pa desktop, og
 * apnes som drawer-overlay pa mobil via CoachHQMobileHeader.
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
      {/* Mobil-header (< lg) — vises kun pa mobil/tablet */}
      <CoachHQMobileHeader />

      <div
        className="min-h-screen flex"
        style={{ background: "#0A1F18" }}
      >
        {/* CoachHQ-sidebar — desktop (>= lg = 1024px) */}
        <div className="hidden lg:flex">
          <CoachHQSidebar user={user} />
        </div>

        {/* Mobile drawer-overlay (< lg) — apnes via hamburger i mobile-header */}
        {isOpen ? (
          <>
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Lukk meny"
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
            />
            {/* Drawer-panel som huser CoachHQSidebar */}
            <div className="fixed top-0 left-0 bottom-0 z-50 lg:hidden flex">
              <CoachHQSidebar user={user} />
            </div>
          </>
        ) : null}

        <main
          className="coachhq-dark-content flex-1 min-h-screen flex flex-col overflow-x-hidden pt-14 lg:pt-0"
          style={{ background: "#102B1E" }}
        >
          {children}
        </main>
      </div>
    </MCSidebarContext.Provider>
  );
}
