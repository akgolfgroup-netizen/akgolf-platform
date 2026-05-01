"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type ReactNode } from "react";

interface BookingShellProps {
  children: ReactNode;
}

export function BookingShell({ children }: BookingShellProps) {
  return (
    <div
      className="booking-v2-root min-h-screen"
      style={{
        background: "var(--color-surface)",
        color: "var(--color-ink)",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      <BookingTopBar />
      <main className="mx-auto max-w-[1280px] px-4 pb-24 pt-6 md:px-8 md:pt-10">
        {children}
      </main>
    </div>
  );
}

function BookingTopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[var(--color-surface)]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-3.5 md:px-8">
        <Link href="/booking-v2" className="flex items-center gap-2.5">
          <span
            className="grid h-7 w-7 place-items-center rounded-md text-[11px] font-extrabold tracking-[-0.04em]"
            style={{
              background: "var(--color-accent)",
              color: "var(--color-ink)",
            }}
          >
            AK
          </span>
          <span
            className="text-[15px] font-bold tracking-[-0.02em]"
            style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
          >
            AK Golf
          </span>
        </Link>

        <div className="flex items-center gap-4 text-[13px]">
          <Link
            href="/portal"
            className="hidden font-medium md:inline-block"
            style={{ color: "var(--color-ink-muted)" }}
          >
            Min side
          </Link>
          <Link
            href="/booking-v2"
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-bold transition-all hover:-translate-y-px"
            style={{
              background: "var(--color-accent)",
              color: "var(--color-ink)",
            }}
          >
            Book nå
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
          </Link>
        </div>
      </div>
    </header>
  );
}
