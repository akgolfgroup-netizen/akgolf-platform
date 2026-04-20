"use client";


import { Icon } from "@/components/ui/icon";
import Link from "next/link";

import { useSidebar } from "./sidebar-context";
import { NotificationBell } from "./notification-bell";
import { AKLogo } from "@/components/website/AKLogo";

export function MobileHeader() {
  const { toggle } = useSidebar();

  return (
    <header className="fixed top-0 left-0 right-0 h-14 z-30 flex items-center justify-between px-4 lg:hidden bg-surface-container-lowest/95 backdrop-blur-sm border-b border-[var(--color-grey-200)]">
      {/* Logo venstre */}
      <Link href="/portal" className="flex items-center gap-2">
        <AKLogo variant="black" size={24} />
        <span className="text-sm font-bold text-[var(--color-grey-900)]">
          AK Golf
        </span>
      </Link>

      {/* Actions hoyre */}
      <div className="flex items-center gap-1">
        <NotificationBell />
        <button
          onClick={toggle}
          className="p-2 rounded-lg text-[var(--color-grey-400)] hover:text-[var(--color-primary)] hover:bg-[var(--color-grey-100)] transition-colors cursor-pointer"
          aria-label="Meny"
        >
          <Icon name="menu" className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
