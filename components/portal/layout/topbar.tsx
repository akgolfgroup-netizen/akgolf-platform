"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const today = format(new Date(), "EEEE d. MMMM", { locale: nb });

  return (
    <header className="h-16 flex items-center justify-between px-6 sticky top-0 z-10 bg-[var(--color-deep-ink)]/90 backdrop-blur-md border-b border-[rgba(15,41,80,0.4)]">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-lg font-semibold leading-tight text-[var(--color-snow)]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs leading-tight mt-0.5 text-[var(--color-gold)]">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <span className="text-xs capitalize hidden sm:block text-[var(--color-ink-40)]">
        {today}
      </span>
    </header>
  );
}
