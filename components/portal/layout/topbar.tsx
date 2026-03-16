"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

const THEME = {
  text: "#02060D",
  textSecondary: "#64748B",
  gold: "#B8975C",
  border: "#EBE5DA",
};

export function Topbar({ title, subtitle }: TopbarProps) {
  const today = format(new Date(), "EEEE d. MMMM", { locale: nb });

  return (
    <header
      className="h-16 flex items-center justify-between px-8 sticky top-0 z-10"
      style={{
        background: "rgba(250,251,252,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${THEME.border}`,
      }}
    >
      <div className="flex items-center gap-3">
        <div>
          <h1 
            className="text-lg font-semibold leading-tight"
            style={{ color: THEME.text }}
          >
            {title}
          </h1>
          {subtitle && (
            <p 
              className="text-xs leading-tight mt-0.5"
              style={{ color: THEME.gold }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <span 
        className="text-xs capitalize hidden sm:block"
        style={{ color: THEME.textSecondary }}
      >
        {today}
      </span>
    </header>
  );
}
