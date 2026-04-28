"use client";

import Link from "next/link";
import { CalendarPlus, CalendarX } from "lucide-react";

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div
      className="text-center"
      style={{
        background: "#0D2E23",
        border: "1px dashed #1a4a3a",
        borderRadius: 14,
        padding: "40px 24px",
      }}
    >
      <div
        className="grid place-items-center mx-auto mb-4"
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: "rgba(209,248,67,0.10)",
          color: "#D1F843",
        }}
      >
        <CalendarX className="w-6 h-6" strokeWidth={1.8} />
      </div>
      <p
        style={{
          color: "rgba(255,255,255,0.7)",
          fontSize: 13,
          maxWidth: 360,
          margin: "0 auto 18px",
        }}
      >
        {message}
      </p>
      <Link
        href="/portal/bookinger/ny"
        className="inline-flex items-center gap-1.5"
        style={{
          padding: "10px 16px",
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 700,
          background: "#D1F843",
          color: "#0A1F18",
          border: "1px solid #D1F843",
        }}
      >
        <CalendarPlus className="w-3.5 h-3.5" strokeWidth={2} /> Book din første
        time
      </Link>
    </div>
  );
}
