"use client";

import { Search, Bell, MessageSquare } from "lucide-react";

interface CoachHQDarkTopbarProps {
  title: string;
  meta?: string;
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function CoachHQDarkTopbar({
  title,
  meta,
  user,
}: CoachHQDarkTopbarProps) {
  const initials = (user.name ?? user.email ?? "AK")
    .split(/[\s@]/)[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className="sticky top-0 z-10 h-full flex items-center px-6 gap-4 border-b"
      style={{
        background: "#102B1E",
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      <div className="min-w-0">
        <div
          className="text-[15px] font-semibold truncate"
          style={{ color: "#FFFFFF", letterSpacing: "-0.01em" }}
        >
          {title}
        </div>
        {meta && (
          <div
            className="text-[11px] truncate"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.06em",
            }}
          >
            {meta}
          </div>
        )}
      </div>

      <div
        className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg w-[280px]"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.55)",
          fontSize: "12px",
        }}
      >
        <Search className="w-3.5 h-3.5" strokeWidth={1.8} />
        <span>Søk spillere, økter, bookinger…</span>
        <span
          className="ml-auto px-1.5 rounded text-[10px]"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Cmd K
        </span>
      </div>

      <button
        className="relative w-[34px] h-[34px] rounded-lg grid place-items-center transition-colors"
        style={{ color: "rgba(255,255,255,0.7)" }}
        aria-label="Notifikasjoner"
      >
        <Bell className="w-4 h-4" strokeWidth={1.8} />
        <span
          className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
          style={{
            background: "#D1F843",
            boxShadow: "0 0 8px #D1F843",
          }}
        />
      </button>

      <button
        className="w-[34px] h-[34px] rounded-lg grid place-items-center transition-colors"
        style={{ color: "rgba(255,255,255,0.7)" }}
        aria-label="Meldinger"
      >
        <MessageSquare className="w-4 h-4" strokeWidth={1.8} />
      </button>

      <button
        className="w-8 h-8 rounded-full grid place-items-center font-bold text-[11px]"
        style={{
          background: "#D1F843",
          color: "#0A1F18",
        }}
        title={user.name ?? user.email ?? "Profil"}
        aria-label="Profil"
      >
        {initials}
      </button>
    </header>
  );
}
