"use client";

import { Calendar, CheckCircle2, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { accent, accentSoft, monoFont } from "./styles";

export type TabKey = "kommende" | "gjennomforte" | "utforsk";

export interface TabCount {
  key: TabKey;
  label: string;
  count: number;
  icon: LucideIcon;
}

interface Props {
  active: TabKey;
  onChange: (key: TabKey) => void;
  counts: { kommende: number; gjennomforte: number; utforsk: number };
}

export function TurneringerTabs({ active, onChange, counts }: Props) {
  const items: TabCount[] = [
    { key: "kommende", label: "Kommende", count: counts.kommende, icon: Calendar },
    { key: "gjennomforte", label: "Gjennomforte", count: counts.gjennomforte, icon: CheckCircle2 },
    { key: "utforsk", label: "Utforsk", count: counts.utforsk, icon: Search },
  ];

  return (
    <div
      className="mb-[18px] inline-flex w-fit gap-1 rounded-xl border p-1"
      style={{
        background: "rgba(255,255,255,0.04)",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      {items.map((t) => {
        const Icon = t.icon;
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[12.5px] font-semibold transition-colors"
            style={{
              background: isActive ? accentSoft : "transparent",
              color: isActive ? accent : "rgba(255,255,255,0.6)",
            }}
          >
            <Icon className="h-3.5 w-3.5" />
            {t.label}
            <span
              className="rounded px-[5px] py-px text-[10px] font-semibold"
              style={{
                fontFamily: monoFont,
                background: isActive ? "rgba(0,0,0,0.20)" : "rgba(255,255,255,0.10)",
              }}
            >
              {t.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
