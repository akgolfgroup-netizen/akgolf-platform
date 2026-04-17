"use client";

import Link from "next/link";
import { Dumbbell, Flag, CalendarPlus, Bot, ArrowUpRight, Target } from "lucide-react";
import { colors } from "@/lib/design-tokens";

const shortcuts = [
  { href: "/portal/dagbok", icon: Dumbbell, label: "Logg trening", color: colors.primary.accent },
  { href: "/portal/runde/ny", icon: Flag, label: "Registrer runde", color: colors.data.coral },
  { href: "/portal/bookinger/ny", icon: CalendarPlus, label: "Book coaching", color: colors.primary.dark },
  { href: "/portal/min-plan", icon: Target, label: "Min plan", color: colors.primary.main },
  { href: "/portal/ai-coach", icon: Bot, label: "AI Coach", color: colors.ai.primary },
];

export function ShortcutPills() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {shortcuts.map((s) => (
        <Link
          key={s.href}
          href={s.href}
          className="group relative flex flex-col justify-between rounded-2xl border border-grey-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-grey-200 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${s.color}15` }}
            >
              <s.icon className="h-5 w-5" style={{ color: s.color }} />
            </div>
            <ArrowUpRight className="h-4 w-4 text-grey-300 transition-colors group-hover:text-grey-400" />
          </div>
          <div className="mt-3">
            <h4 className="text-sm font-semibold text-black">{s.label}</h4>
          </div>
        </Link>
      ))}
    </div>
  );
}
