"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ProfileShell } from "./profile-shell";

interface SettingsShellProps {
  children: ReactNode;
  side: ReactNode;
  lede?: string;
}

export function SettingsShell({ children, side, lede }: SettingsShellProps) {
  return (
    <ProfileShell>
      <Link
        href="/portal/profil"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Tilbake til profil
      </Link>

      <div className="mb-6 font-mono text-[10px] uppercase tracking-[0.18em] text-[#D1F843]/80">
        Min side · Innstillinger
      </div>
      <h1 className="font-display text-4xl font-extrabold tracking-[-0.025em] text-white">
        Innstillinger
      </h1>
      {lede ? <p className="mt-2 max-w-prose text-sm text-white/60">{lede}</p> : null}

      <div className="mt-7 grid gap-7 lg:grid-cols-[220px_1fr]">
        <aside className="flex gap-1 overflow-x-auto lg:sticky lg:top-20 lg:flex-col lg:overflow-visible">
          {side}
        </aside>
        <section className="flex flex-col gap-3.5">{children}</section>
      </div>
    </ProfileShell>
  );
}
