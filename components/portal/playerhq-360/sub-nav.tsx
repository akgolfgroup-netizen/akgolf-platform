"use client";

import {
  User,
  Activity,
  Users,
  Dumbbell,
  Brain,
  ClipboardCheck,
  CreditCard,
  AlertCircle,
  Clock,
  type LucideIcon,
} from "lucide-react";

export type SectionKey =
  | "ident"
  | "stats"
  | "coach"
  | "train"
  | "mind"
  | "test"
  | "money"
  | "signal"
  | "act";

interface SubNavItem {
  key: SectionKey;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export const SECTION_ITEMS: readonly SubNavItem[] = [
  { key: "ident", label: "Identitet", icon: User },
  { key: "stats", label: "Golf-statistikk", icon: Activity },
  { key: "coach", label: "Coaching", icon: Users },
  { key: "train", label: "Trening", icon: Dumbbell },
  { key: "mind", label: "Mental og prognose", icon: Brain },
  { key: "test", label: "Tester", icon: ClipboardCheck },
  { key: "money", label: "Økonomi", icon: CreditCard },
  { key: "signal", label: "Signaler", icon: AlertCircle, badge: 0 },
  { key: "act", label: "Aktivitet", icon: Clock },
] as const;

interface SubNavProps {
  active: SectionKey;
  signalCount: number;
  onClick: (key: SectionKey) => void;
}

export function SubNav({ active, signalCount, onClick }: SubNavProps) {
  return (
    <div
      className="sticky top-0 z-30 mr-0 lg:mr-[22px] mt-4 overflow-hidden"
      style={{
        background: "rgba(13,46,35,0.92)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 14,
      }}
    >
      <div
        className="flex gap-1 overflow-x-auto p-2"
        style={{ scrollbarWidth: "none" }}
      >
        {SECTION_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          const badge = item.key === "signal" ? signalCount : item.badge ?? 0;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onClick(item.key)}
              className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-[13px] font-semibold transition"
              style={{
                background: isActive ? "#D1F843" : "transparent",
                color: isActive ? "#0A1F18" : "rgba(255,255,255,0.55)",
                fontWeight: isActive ? 700 : 600,
                letterSpacing: "-0.005em",
              }}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2} />
              {item.label}
              {badge > 0 ? (
                <span
                  className="ml-0.5 rounded-[4px] px-1.5 font-mono text-[10px] font-bold"
                  style={{
                    background: isActive
                      ? "rgba(10,31,24,0.20)"
                      : "rgba(255,255,255,0.10)",
                    color: isActive ? "#0A1F18" : "rgba(255,255,255,0.85)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
