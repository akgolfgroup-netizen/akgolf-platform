"use client";

import {
  Activity,
  BellRing,
  Brain,
  CalendarPlus,
  Dumbbell,
  Flag,
  Hammer,
  History,
  LayoutDashboard,
  MessageCircle,
  Target,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { COLORS } from "./primitives";

type TocItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  alert?: boolean;
};

const ITEMS: TocItem[] = [
  { id: "sec-summary", label: "Sammendrag", icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
  { id: "sec-golf", label: "Golf-ferdigheter", icon: <Flag className="h-3.5 w-3.5" />, badge: "86" },
  { id: "sec-coaching", label: "Coaching", icon: <Dumbbell className="h-3.5 w-3.5" />, badge: "23" },
  { id: "sec-mental", label: "Mental", icon: <Brain className="h-3.5 w-3.5" /> },
  { id: "sec-trening", label: "Trening", icon: <Activity className="h-3.5 w-3.5" /> },
  { id: "sec-utstyr", label: "Utstyr", icon: <Hammer className="h-3.5 w-3.5" /> },
  { id: "sec-okonomi", label: "Økonomi", icon: <Wallet className="h-3.5 w-3.5" /> },
  {
    id: "sec-signaler",
    label: "Signaler",
    icon: <BellRing className="h-3.5 w-3.5" />,
    badge: "2",
    alert: true,
  },
  { id: "sec-aktivitet", label: "Aktivitet", icon: <History className="h-3.5 w-3.5" /> },
];

export function LongPageToc() {
  const [active, setActive] = useState<string>("sec-summary");

  useEffect(() => {
    const handler = () => {
      let current = "";
      for (const item of ITEMS) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top < 120) current = item.id;
      }
      if (current) setActive(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <aside
      className="sticky top-[80px] rounded-[12px] py-[12px] px-[8px]"
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.line}`,
      }}
    >
      <div
        className="px-[10px] pb-[8px] pt-[4px] font-mono text-[9px] uppercase tracking-[0.14em]"
        style={{ color: COLORS.textTertiary }}
      >
        Innhold
      </div>
      {ITEMS.map((item) => {
        const isActive = item.id === active;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="mb-[1px] flex items-center gap-[8px] rounded-[6px] px-[10px] py-[7px] text-[12px]"
            style={{
              color: isActive ? COLORS.accent : COLORS.textMuted,
              background: isActive ? "rgba(209,248,67,0.10)" : "transparent",
              borderLeft: `2px solid ${isActive ? COLORS.accent : "transparent"}`,
            }}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge ? (
              <span
                className="ml-auto font-mono text-[9px]"
                style={{ color: item.alert ? COLORS.danger : COLORS.textTertiary }}
              >
                {item.badge}
              </span>
            ) : null}
          </a>
        );
      })}
      <div
        className="mt-[16px] flex flex-col gap-[6px] border-t pt-[12px]"
        style={{ borderColor: COLORS.line }}
      >
        <TocBtn icon={<MessageCircle className="h-3 w-3" />} label="Melding" />
        <TocBtn icon={<CalendarPlus className="h-3 w-3" />} label="Bok økt" />
        <TocBtn icon={<Target className="h-3 w-3" />} label="Sett mål" accent />
      </div>
    </aside>
  );
}

function TocBtn({
  icon,
  label,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  accent?: boolean;
}) {
  return (
    <button
      className="inline-flex items-center justify-start gap-[6px] rounded-[6px] px-[10px] py-[6px] text-[11px] font-medium"
      style={{
        background: accent ? COLORS.accent : "rgba(255,255,255,0.05)",
        color: accent ? "#0A1F18" : "#fff",
        border: accent ? "none" : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {icon}
      {label}
    </button>
  );
}
