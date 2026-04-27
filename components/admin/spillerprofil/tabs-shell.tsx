"use client";

import {
  Activity,
  BellRing,
  Brain,
  Dumbbell,
  Flag,
  LayoutDashboard,
  Wallet,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { COLORS } from "./primitives";

export type TabKey =
  | "oversikt"
  | "golf"
  | "coaching"
  | "mental"
  | "trening"
  | "okonomi"
  | "signaler";

type TabDef = {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  alert?: boolean;
};

const TABS: TabDef[] = [
  { key: "oversikt", label: "Oversikt", icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
  { key: "golf", label: "Golf", icon: <Flag className="h-3.5 w-3.5" />, badge: "86" },
  { key: "coaching", label: "Coaching", icon: <Dumbbell className="h-3.5 w-3.5" />, badge: "23" },
  { key: "mental", label: "Mental", icon: <Brain className="h-3.5 w-3.5" /> },
  { key: "trening", label: "Trening", icon: <Activity className="h-3.5 w-3.5" /> },
  { key: "okonomi", label: "Økonomi", icon: <Wallet className="h-3.5 w-3.5" /> },
  {
    key: "signaler",
    label: "Signaler",
    icon: <BellRing className="h-3.5 w-3.5" />,
    badge: "2",
    alert: true,
  },
];

/**
 * Sticky tabs + body. Children mottar valgt tab via render prop.
 */
export function TabsShell({
  initial = "oversikt",
  render,
}: {
  initial?: TabKey;
  render: (tab: TabKey) => ReactNode;
}) {
  const [active, setActive] = useState<TabKey>(initial);

  return (
    <>
      <nav
        className="sticky z-[5] -mx-7 flex gap-0 px-7"
        style={{
          top: 58,
          background: "#0A1F18",
          borderBottom: `1px solid ${COLORS.line}`,
          marginTop: -1,
        }}
      >
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className="inline-flex items-center gap-[6px] whitespace-nowrap px-[18px] py-[14px] text-[13px] transition"
              style={{
                color: isActive ? COLORS.accent : "rgba(255,255,255,0.55)",
                fontWeight: isActive ? 600 : 500,
                borderBottom: `2px solid ${isActive ? COLORS.accent : "transparent"}`,
                marginBottom: -1,
              }}
            >
              {tab.icon}
              {tab.label}
              {tab.badge ? (
                <span
                  className="rounded-full px-[6px] py-[1px] font-mono text-[10px]"
                  style={{
                    background: tab.alert
                      ? "rgba(184,66,51,0.30)"
                      : isActive
                        ? "rgba(209,248,67,0.20)"
                        : "rgba(255,255,255,0.10)",
                    color: tab.alert
                      ? COLORS.danger
                      : isActive
                        ? COLORS.accent
                        : "rgba(255,255,255,0.75)",
                  }}
                >
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
      <div className="pt-[26px]">{render(active)}</div>
    </>
  );
}
