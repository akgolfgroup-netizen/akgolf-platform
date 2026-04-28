"use client";

import Link from "next/link";
import { CalendarPlus } from "lucide-react";

interface PageHeaderProps {
  upcomingCount: number;
  pastCount: number;
}

export function PageHeader({ upcomingCount, pastCount }: PageHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
      <div>
        <div
          className="font-mono uppercase"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "0.14em",
            color: "#D1F843",
          }}
        >
          Kalender · Bookinger
        </div>
        <h1
          className="mt-1.5"
          style={{
            fontFamily: "'Inter Tight', Inter, sans-serif",
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#fff",
            lineHeight: 1.05,
          }}
        >
          Bookinger
        </h1>
        <p
          className="mt-2"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.55)",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#fff", fontWeight: 700 }}>
            {upcomingCount}
          </span>{" "}
          kommende ·{" "}
          <span style={{ color: "#fff", fontWeight: 700 }}>{pastCount}</span>{" "}
          gjennomført
        </p>
      </div>
      <Link
        href="/portal/bookinger/ny"
        className="inline-flex items-center gap-2 transition-colors"
        style={{
          padding: "12px 20px",
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 700,
          background: "#D1F843",
          color: "#0A1F18",
          border: "1px solid #D1F843",
          boxShadow:
            "0 0 0 1px rgba(209,248,67,0.20), 0 4px 16px rgba(209,248,67,0.20)",
        }}
      >
        <CalendarPlus className="w-4 h-4" strokeWidth={2} />
        Book økt
      </Link>
    </div>
  );
}
