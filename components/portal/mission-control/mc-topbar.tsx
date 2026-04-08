"use client";

import { Search, Menu, Plus } from "lucide-react";
import { useState } from "react";
import { AdminNotificationBell } from "@/components/portal/admin/AdminNotificationBell";
import { getWeek } from "date-fns";
import Image from "next/image";
import Link from "next/link";

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
  children?: React.ReactNode; // For mode toggle or other elements
}

export function MCTopbar({
  title,
  subtitle,
  onMenuClick,
  user,
  notificationCount = 0,
  children,
}: MCTopbarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-14 hg-topbar flex items-center justify-between px-5 sticky top-0 z-10">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-[var(--hg-text-muted)] hover:text-[var(--hg-text)] hover:bg-[var(--hg-surface-raised)] transition-colors cursor-pointer"
          aria-label="Apne meny"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base font-bold text-[var(--hg-text)]">{title}</h1>
          {subtitle && (
            <p className="text-[10px] text-[var(--hg-text-muted)]">
              {subtitle} <span className="text-[var(--hg-border)] mx-1">|</span> Uke {getWeek(new Date(), { weekStartsOn: 1 })}
            </p>
          )}
        </div>

        {/* Optional children (mode toggle, etc.) */}
        {children}
      </div>

      {/* Center Section - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="flex items-center gap-2 w-full bg-[var(--hg-surface)] border border-[var(--hg-border)] px-3 py-2 rounded-lg focus-within:border-[var(--hg-primary)] focus-within:shadow-[0_0_0_3px_var(--hg-primary-glow)] transition-all">
          <Search className="w-3.5 h-3.5 text-[var(--hg-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sok elever, bookinger..."
            className="flex-1 bg-transparent text-xs text-[var(--hg-text)] placeholder:text-[var(--hg-text-muted)] outline-none"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* New booking button */}
        <Link
          href="/portal/admin/bookinger/ny"
          className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg hg-btn-primary text-[11px]"
        >
          <Plus className="w-3.5 h-3.5" />
          Ny booking
        </Link>

        {/* Mobile search button */}
        <button
          className="md:hidden p-2 rounded-lg text-[var(--hg-text-muted)] hover:text-[var(--hg-text)] hover:bg-[var(--hg-surface-raised)] transition-colors cursor-pointer"
          aria-label="Sok"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <AdminNotificationBell className="relative p-2 rounded-lg bg-[var(--hg-surface-raised)] hover:bg-[var(--hg-border)] transition-colors cursor-pointer text-[var(--hg-text-muted)] hover:text-[var(--hg-text)]" />

        {/* User Avatar */}
        {user && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--hg-surface-raised)] to-[var(--hg-border)] flex items-center justify-center text-[var(--hg-text)] text-[10px] font-semibold cursor-pointer overflow-hidden border border-[var(--hg-border)]">
            {user.image ? (
              <Image
                src={user.image}
                alt=""
                width={32}
                height={32}
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
    <div className="flex bg-[var(--hg-surface-raised)] rounded-lg p-0.5">
      <button
        onClick={() => onModeChange?.("oversikt")}
        className={`px-3.5 py-1.5 text-[10px] font-semibold rounded-md transition-colors cursor-pointer ${
          activeMode === "oversikt"
            ? "bg-[var(--hg-primary)] text-[var(--hg-bg)]"
            : "text-[var(--hg-text-muted)] hover:text-[var(--hg-text)]"
        }`}
      >
        Oversikt
      </button>
      <button
        onClick={() => onModeChange?.("focus")}
        className={`px-3.5 py-1.5 text-[10px] font-semibold rounded-md transition-colors cursor-pointer ${
          activeMode === "focus"
            ? "bg-[var(--hg-primary)] text-[var(--hg-bg)]"
            : "text-[var(--hg-text-muted)] hover:text-[var(--hg-text)]"
        }`}
      >
        Focus
      </button>
    </div>
  );
}
