"use client";

import { Search, Bell, Menu, Plus } from "lucide-react";
import { useState } from "react";
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
    <header className="h-14 bg-white border-b border-[#E8E8ED] flex items-center justify-between px-5 sticky top-0 z-10">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors cursor-pointer"
          aria-label="Apne meny"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base font-bold text-[#1D1D1F]">{title}</h1>
          {subtitle && (
            <p className="text-[10px] text-[#86868B]">
              {subtitle} <span className="text-[#D2D2D7] mx-1">|</span> Uke {getWeek(new Date(), { weekStartsOn: 1 })}
            </p>
          )}
        </div>

        {/* Optional children (mode toggle, etc.) */}
        {children}
      </div>

      {/* Center Section - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="flex items-center gap-2 w-full bg-[#F5F5F7] px-3 py-2 rounded-lg">
          <Search className="w-3.5 h-3.5 text-[#86868B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sok elever, bookinger..."
            className="flex-1 bg-transparent text-xs text-[#1D1D1F] placeholder:text-[#86868B] outline-none"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* New booking button */}
        <Link
          href="/portal/admin/bookinger/ny"
          className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-[980px] bg-[#1D1D1F] text-white text-[11px] font-semibold hover:bg-[#3A3A3C] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Ny booking
        </Link>

        {/* Mobile search button */}
        <button
          className="md:hidden p-2 rounded-lg text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors cursor-pointer"
          aria-label="Sok"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg bg-[#F5F5F7] hover:bg-[#E8E8ED] transition-colors cursor-pointer">
          <Bell className="w-4 h-4 text-[#6E6E73]" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[14px] h-[14px] px-1 bg-[#D14343] text-white text-[9px] font-semibold rounded-full flex items-center justify-center">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        {/* User Avatar */}
        {user && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1D1D1F] to-[#3a3a3c] flex items-center justify-center text-white text-[10px] font-semibold cursor-pointer overflow-hidden">
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
    <div className="flex bg-[#E8E8ED] rounded-lg p-0.5">
      <button
        onClick={() => onModeChange?.("oversikt")}
        className={`px-3.5 py-1.5 text-[10px] font-semibold rounded-md transition-colors cursor-pointer ${
          activeMode === "oversikt"
            ? "bg-[#1D1D1F] text-white"
            : "text-[#6E6E73] hover:text-[#1D1D1F]"
        }`}
      >
        Oversikt
      </button>
      <button
        onClick={() => onModeChange?.("focus")}
        className={`px-3.5 py-1.5 text-[10px] font-semibold rounded-md transition-colors cursor-pointer ${
          activeMode === "focus"
            ? "bg-[#1D1D1F] text-white"
            : "text-[#6E6E73] hover:text-[#1D1D1F]"
        }`}
      >
        Focus
      </button>
    </div>
  );
}
