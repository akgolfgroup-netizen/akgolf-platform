"use client";

import Link from "next/link";
import { Menu, Bell } from "lucide-react";
import { useSidebar } from "./sidebar-context";

export function MobileHeader() {
  const { toggle } = useSidebar();

  return (
    <header
      className="fixed top-0 left-0 right-0 h-14 z-30 flex items-center justify-between px-4 lg:hidden"
      style={{
        background: "var(--portal-bg)",
        borderBottom: "1px solid var(--portal-card-border)",
      }}
    >
      <button
        onClick={toggle}
        className="p-2 rounded-lg text-[var(--portal-text-muted)] hover:text-white transition-colors cursor-pointer"
        aria-label="Meny"
      >
        <Menu className="w-5 h-5" />
      </button>

      <span className="text-sm font-bold text-white">AK Golf</span>

      <Link
        href="/portal"
        className="p-2 rounded-lg text-[var(--portal-text-muted)] hover:text-white transition-colors"
        aria-label="Notifikasjoner"
      >
        <Bell className="w-5 h-5" />
      </Link>
    </header>
  );
}
