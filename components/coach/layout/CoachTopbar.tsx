"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CoachTopbarProps {
  userName: string;
}

export function CoachTopbar({ userName }: CoachTopbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[var(--color-ink-80)] bg-[var(--color-ink-100)] px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-50)]" />
          <input
            type="text"
            placeholder="Sok meldinger, spillere..."
            className="h-10 w-80 rounded-lg bg-[var(--color-ink-90)] pl-10 pr-4 text-sm text-white placeholder:text-[var(--color-ink-50)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5 text-[var(--color-ink-40)]" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            3
          </span>
        </Button>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[var(--color-gold)] flex items-center justify-center text-[var(--color-ink-100)] font-medium">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-white">{userName}</span>
        </div>
      </div>
    </header>
  );
}
