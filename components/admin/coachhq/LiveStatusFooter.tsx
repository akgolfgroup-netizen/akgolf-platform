"use client";

import { useEffect, useState } from "react";

interface LiveStatusFooterProps {
  /**
   * Antall økter som pågår nå. Hvis ikke gitt brukes en stub.
   * I prod hentes dette fra `/api/portal/admin/live-sessions` (kommer i Sprint 2).
   */
  liveSessions?: number;
  /** Stedsbeskrivelse, f.eks. "Bossum + WANG". */
  locationLabel?: string;
}

/**
 * Live-status-pill nederst i navnlisten.
 * Matcher public/design-reference/coachhq-reference.html.
 */
export function LiveStatusFooter({
  liveSessions,
  locationLabel = "Bossum + WANG",
}: LiveStatusFooterProps) {
  const [count, setCount] = useState(liveSessions ?? 0);

  // Stub: pulser tilfeldig 0–4 hvert 30 sek til API er klar
  useEffect(() => {
    if (liveSessions !== undefined) return;
    const t = setInterval(() => {
      setCount(Math.floor(Math.random() * 5));
    }, 30_000);
    return () => clearInterval(t);
  }, [liveSessions]);

  return (
    <div
      className="mt-3 mx-3 p-3 rounded-xl border"
      style={{
        background: "var(--color-sidebar-hover)",
        borderColor: "var(--color-sidebar-divider)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <PulseDot />
        <span
          className="text-[10px] font-mono uppercase tracking-widest"
          style={{ color: "var(--color-sidebar-muted)" }}
        >
          Pågår nå
        </span>
      </div>
      <div className="font-display text-[20px] font-bold leading-none flex items-baseline gap-1.5">
        <span style={{ color: "var(--color-accent)" }}>{count}</span>
        <span className="text-white text-[13px] font-medium">
          {count === 1 ? "økt live" : "økter live"}
        </span>
      </div>
      <div
        className="text-[10px] font-mono mt-2"
        style={{ color: "var(--color-sidebar-muted)" }}
      >
        på {locationLabel}
      </div>
    </div>
  );
}

function PulseDot() {
  return (
    <span
      className="relative w-1.5 h-1.5 rounded-full"
      style={{ background: "var(--color-success)" }}
    >
      <span
        aria-hidden
        className="absolute inset-[-4px] rounded-full"
        style={{
          background: "var(--color-success)",
          opacity: 0.55,
          animation: "coachhq-pulse 1.8s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes coachhq-pulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </span>
  );
}
