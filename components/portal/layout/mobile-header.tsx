"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useSidebar } from "./sidebar-context";
import { NotificationBell } from "./notification-bell";

export function MobileHeader() {
  const { toggle } = useSidebar();

  return (
    <header className="fixed top-0 left-0 right-0 h-14 z-30 flex items-center justify-between px-4 lg:hidden bg-white border-b border-[#E8E8ED]">
      <button
        onClick={toggle}
        className="p-2 rounded-lg text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors cursor-pointer"
        aria-label="Meny"
      >
        <Menu className="w-5 h-5" />
      </button>

      <Link href="/portal" className="text-sm font-bold text-[#1D1D1F]">
        AK Golf
      </Link>

      <NotificationBell />
    </header>
  );
}
