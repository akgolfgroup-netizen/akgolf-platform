import Link from "next/link";
import {
  Target,
  CheckSquare,
  Users,
  MessageCircle,
  Calendar,
  Package,
  CreditCard,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import type { HubModuleCounts, HubStats } from "@/app/admin/(authed)/hub/hub-actions";

interface ModuleStripProps {
  counts: HubModuleCounts;
  stats: HubStats;
}

interface ModuleConfig {
  href: string;
  icon: LucideIcon;
  title: string;
  buildSub: (counts: HubModuleCounts, stats: HubStats) => string;
  buildBadge: (counts: HubModuleCounts) => { label: string; tone?: "accent" | "warn" } | null;
}

const MODULES: ModuleConfig[] = [
  {
    href: "/admin",
    icon: Target,
    title: "Dagens fokus",
    buildSub: (c) => `${c.todaysFocusCount} prioriterte oppgaver + dagsplan`,
    buildBadge: (c) =>
      c.todaysFocusCount > 0 ? { label: `${c.todaysFocusCount} I DAG`, tone: "accent" } : null,
  },
  {
    href: "/admin/godkjenninger",
    icon: CheckSquare,
    title: "Godkjenninger",
    buildSub: () => "Bookinger og refusjoner som krever deg",
    buildBadge: (c) =>
      c.pendingApprovals > 0
        ? { label: `${c.pendingApprovals} VENTER`, tone: "warn" }
        : null,
  },
  {
    href: "/admin/elever",
    icon: Users,
    title: "Spillere",
    buildSub: (_, s) => `${s.activeStudents} aktive · medlemskap · coaching-historikk`,
    buildBadge: () => null,
  },
  {
    href: "/admin/meldinger",
    icon: MessageCircle,
    title: "Meldinger",
    buildSub: () => "Samtaler med spillere og foreldre",
    buildBadge: (c) =>
      c.unreadMessages > 0
        ? { label: `${c.unreadMessages} ULESTE`, tone: "accent" }
        : null,
  },
  {
    href: "/admin/kalender",
    icon: Calendar,
    title: "Kalender",
    buildSub: (_, s) =>
      `${s.weeklySessionsCount} økter · ${s.utilizationPct}% belegg`,
    buildBadge: () => null,
  },
  {
    href: "/admin/tjenester",
    icon: Package,
    title: "Tjenester",
    buildSub: () => "Pakker, abo, drop-in og camp",
    buildBadge: () => null,
  },
  {
    href: "/admin/okonomi",
    icon: CreditCard,
    title: "Økonomi",
    buildSub: (_, s) => `${s.mtdRevenueK}k MTD · fakturaer · P&L`,
    buildBadge: () => null,
  },
  {
    href: "/admin/analytics",
    icon: BarChart3,
    title: "Rapporter",
    buildSub: () => "Coach-effekt · 12-mnd snitt-HCP",
    buildBadge: () => null,
  },
];

export function ModuleStrip({ counts, stats }: ModuleStripProps) {
  return (
    <section className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-4">
      {MODULES.map((m) => {
        const Icon = m.icon;
        const badge = m.buildBadge(counts);
        const sub = m.buildSub(counts, stats);

        return (
          <Link
            key={m.href}
            href={m.href}
            className="relative rounded-xl p-5 transition hover:-translate-y-0.5"
            style={{
              background: "#0D2E23",
              border: "1px solid #1a4a3a",
            }}
          >
            {badge ? (
              <span
                className="absolute top-3.5 right-3.5 rounded text-[9.5px] font-bold tracking-[0.06em] uppercase px-1.5 py-0.5"
                style={{
                  background:
                    badge.tone === "warn"
                      ? "rgba(232,185,103,0.18)"
                      : "rgba(209,248,67,0.15)",
                  color: badge.tone === "warn" ? "#E8B967" : "#D1F843",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {badge.label}
              </span>
            ) : null}
            <div
              className="w-10 h-10 rounded-[10px] grid place-items-center mb-3.5"
              style={{
                background: "rgba(209,248,67,0.15)",
                color: "#D1F843",
              }}
            >
              <Icon className="w-[18px] h-[18px]" />
            </div>
            <div
              className="text-[14px] font-bold"
              style={{ color: "#FFFFFF" }}
            >
              {m.title}
            </div>
            <div
              className="text-[12px] mt-1 leading-[1.5]"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {sub}
            </div>
          </Link>
        );
      })}
    </section>
  );
}
