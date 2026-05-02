"use client";



import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getWeek } from "date-fns";
import { AdminNotificationBell } from "@/components/admin/notifications/AdminNotificationBell";
import { cn } from "@/lib/utils";

interface MCTopbarProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  notificationCount?: number;
  showSearch?: boolean;
  showNewBooking?: boolean;
  children?: React.ReactNode;
}

export function MCTopbar({
  title,
  subtitle,
  onMenuClick,
  user,
  showSearch = true,
  showNewBooking = true,
  children,
}: MCTopbarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-14 bg-surface-container-lowest border-b border-[var(--color-grey-200)] flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      {/* Venstre */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-grey-100)] transition-colors cursor-pointer"
          aria-label="Apne meny"
        >
          <Icon name="menu" className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-[var(--color-text)] truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[var(--color-muted)] truncate">
              {subtitle}
              <span className="text-[var(--color-grey-200)] mx-1.5">|</span>
              Uke {getWeek(new Date(), { weekStartsOn: 1 })}
            </p>
          )}
        </div>

        {children}
      </div>

      {/* Midten – sok */}
      {showSearch && (
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="flex items-center gap-2 w-full bg-[var(--color-grey-100)] border border-transparent px-3.5 py-2 rounded-lg focus-within:bg-surface-container-lowest focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 transition-all">
            <Icon name="search" className="w-4 h-4 text-[var(--color-muted)] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sok elever, bookinger..."
              className="flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none"
            />
          </div>
        </div>
      )}

      {/* Hoyre */}
      <div className="flex items-center gap-2 md:gap-3">
        {showNewBooking && (
          <Link
            href="/admin/bookinger/ny"
            className="admin-btn admin-btn-primary hidden md:inline-flex"
          >
            <Icon name="add" className="w-4 h-4" />
            Ny booking
          </Link>
        )}

        <button
          className="md:hidden p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-grey-100)] transition-colors cursor-pointer"
          aria-label="Sok"
        >
          <Icon name="search" className="w-5 h-5" />
        </button>

        <AdminNotificationBell className="relative p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-grey-100)] transition-colors cursor-pointer" />

        {user && (
          <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-sm font-semibold cursor-pointer overflow-hidden">
            {user.image ? (
              <Image
                src={user.image}
                alt=""
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            ) : (
              (user.name ?? user.email ?? "U")[0].toUpperCase()
            )}
          </div>
        )}
      </div>
    </header>
  );
}

// Mode Toggle component for Hub pages
interface ModeToggleProps {
  activeMode: "oversikt" | "focus";
  onModeChange?: (mode: "oversikt" | "focus") => void;
}

export function MCModeToggle({ activeMode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex bg-[var(--color-grey-100)] rounded-lg p-0.5">
      <button
        onClick={() => onModeChange?.("oversikt")}
        className={cn(
          "px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer",
          activeMode === "oversikt"
            ? "bg-surface-container-lowest text-[var(--color-primary)] shadow-sm"
            : "text-[var(--color-muted)] hover:text-[var(--color-text)]",
        )}
      >
        Oversikt
      </button>
      <button
        onClick={() => onModeChange?.("focus")}
        className={cn(
          "px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer",
          activeMode === "focus"
            ? "bg-surface-container-lowest text-[var(--color-primary)] shadow-sm"
            : "text-[var(--color-muted)] hover:text-[var(--color-text)]",
        )}
      >
        Focus
      </button>
    </div>
  );
}
