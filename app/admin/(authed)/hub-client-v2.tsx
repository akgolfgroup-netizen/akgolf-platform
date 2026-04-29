"use client";

import Link from "next/link";
import {
  CalendarDays,
  TrendingUp,
  Users,
  Clock,
  Plus,
  MessageSquare,
  Target,
  BarChart3,
  CreditCard,
  Settings,
  Bell,
  ChevronRight,
} from "lucide-react";
import {
  McPageHead,
  McKpiCard,
  McCard,
  McCardHeader,
  McPill,
  McButton,
} from "@/components/admin/mc-v2";
import type { ActivityItem } from "@/components/admin/mc-v2/McActivityItem";
import { McActivityItem as ActivityRow } from "@/components/admin/mc-v2/McActivityItem";
import type {
  HubStats,
  HubModuleCounts,
  HubActivityItem,
} from "./hub/hub-actions";

interface Props {
  userName: string;
  stats: HubStats;
  counts: HubModuleCounts;
  activity: HubActivityItem[];
}

export function HubClientV2({ userName, stats, counts, activity }: Props) {
  const greeting = getGreeting();
  const contextParts: string[] = [];
  if (counts.todaysFocusCount > 0)
    contextParts.push(`${counts.todaysFocusCount} økter i dag`);
  if (counts.pendingApprovals > 0)
    contextParts.push(`${counts.pendingApprovals} godkjenninger venter`);

  return (
    <div className="space-y-6">
      <McPageHead
        eyebrow="CoachHQ · Hub"
        title={`${greeting}, ${userName.split(" ")[0]}`}
        description={
          contextParts.length > 0
            ? `${contextParts.join(" · ")}. Alt du trenger for dagen — én oversikt.`
            : "Alt du trenger for dagen — én oversikt."
        }
        actions={
          <McButton variant="accent" icon={<Plus className="w-3.5 h-3.5" />}>
            <Link href="/admin/bookinger/ny" className="text-inherit no-underline">
              Ny booking
            </Link>
          </McButton>
        }
      />

      {/* KPI-rad */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <McKpiCard
          label="Bookinger i dag"
          value={counts.todaysFocusCount}
          icon={<CalendarDays className="w-4 h-4" />}
          tone={counts.todaysFocusCount > 0 ? "accent" : "default"}
          sub={counts.todaysFocusCount > 0 ? `${counts.todaysFocusCount} bekreftet` : "Ingen i dag"}
        />
        <McKpiCard
          label="Inntekt denne uken"
          value={stats.mtdRevenueK}
          unit="k"
          icon={<TrendingUp className="w-4 h-4" />}
          tone="success"
          sub="MTD"
        />
        <McKpiCard
          label="Aktive spillere"
          value={stats.activeStudents}
          icon={<Users className="w-4 h-4" />}
          tone="default"
          sub={`${stats.weeklySessionsCount} økter denne uken`}
        />
        <McKpiCard
          label="Belegg"
          value={stats.utilizationPct}
          unit="%"
          icon={<Clock className="w-4 h-4" />}
          tone={stats.utilizationPct > 80 ? "accent" : "default"}
          sub="av kapasitet"
        />
      </div>

      {/* Bottom split */}
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <QuickActions />
          <ActivityPanel items={activity} />
        </div>
        <ModulePanel counts={counts} />
      </div>
    </div>
  );
}

/* ─── Quick Actions ─── */

function QuickActions() {
  const actions = [
    { icon: <Plus className="w-4 h-4" />, label: "Ny booking", href: "/admin/bookinger/ny" },
    { icon: <MessageSquare className="w-4 h-4" />, label: "Send melding", href: "/admin/meldinger" },
    { icon: <Target className="w-4 h-4" />, label: "Treningsplan", href: "/admin/treningsplan" },
    { icon: <BarChart3 className="w-4 h-4" />, label: "Rapporter", href: "/admin/rapporter" },
    { icon: <CreditCard className="w-4 h-4" />, label: "Økonomi", href: "/admin/okonomi" },
    { icon: <Settings className="w-4 h-4" />, label: "Innstillinger", href: "/admin/fasiliteter/innstillinger" },
  ];

  return (
    <McCard>
      <McCardHeader title="Hurtighandlinger" sub="vanlige oppgaver" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {actions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white/80 transition-colors hover:bg-white/[0.04] hover:text-white no-underline"
            style={{ border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span className="text-white/45">{a.icon}</span>
            {a.label}
          </Link>
        ))}
      </div>
    </McCard>
  );
}

/* ─── Activity Panel ─── */

function ActivityPanel({ items }: { items: HubActivityItem[] }) {
  const mapped: ActivityItem[] = items.map((item) => ({
    id: item.id,
    icon: <Bell className="w-3.5 h-3.5" />,
    iconBg: toneToBg(item.tone),
    iconColor: toneToColor(item.tone),
    title: item.bodyHighlight ? (
      <>
        <span className="text-white/80">{item.bodyHighlight}</span>
        <span className="text-white/50">{item.body}</span>
      </>
    ) : (
      item.body
    ),
    body: "",
    when: item.when,
  }));

  return (
    <McCard>
      <McCardHeader
        title="Aktivitet"
        sub="siste 24 timer"
        action={<McPill tone="accent">{items.length} nye</McPill>}
      />
      {mapped.length === 0 ? (
        <p className="text-[13px] text-white/40 py-4">Ingen aktivitet siste 24 timer.</p>
      ) : (
        mapped.map((item, i) => (
          <ActivityRow key={item.id} item={item} isLast={i === mapped.length - 1} />
        ))
      )}
    </McCard>
  );
}

/* ─── Module Panel ─── */

function ModulePanel({ counts }: { counts: HubModuleCounts }) {
  const modules = [
    { label: "Dagens fokus", count: counts.todaysFocusCount, href: "/admin/denne-uken", tone: "accent" as const },
    { label: "Godkjenninger", count: counts.pendingApprovals, href: "/admin/godkjenninger", tone: "warning" as const },
    { label: "Meldinger", count: counts.unreadMessages, href: "/admin/meldinger", tone: "default" as const },
    { label: "Spillere", count: counts.activeStudents, href: "/admin/elever", tone: "default" as const },
  ];

  return (
    <McCard>
      <McCardHeader title="Moduler" sub="hopp til" />
      <div className="flex flex-col gap-1">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[13px] text-white/80 transition-colors hover:bg-white/[0.04] hover:text-white no-underline"
          >
            <span className="font-medium">{m.label}</span>
            <div className="flex items-center gap-2">
              {m.count > 0 && <McPill tone={m.tone}>{m.count}</McPill>}
              <ChevronRight className="w-3.5 h-3.5 text-white/30" />
            </div>
          </Link>
        ))}
      </div>
    </McCard>
  );
}

/* ─── Helpers ─── */

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "God morgen";
  if (h < 17) return "God ettermiddag";
  return "God kveld";
}

function toneToBg(tone: HubActivityItem["tone"]): string {
  const map: Record<string, string> = {
    green: "rgba(42,125,90,0.18)",
    amber: "rgba(196,138,50,0.16)",
    purple: "rgba(175,82,222,0.14)",
    neutral: "rgba(255,255,255,0.06)",
  };
  return map[tone] ?? map.neutral;
}

function toneToColor(tone: HubActivityItem["tone"]): string {
  const map: Record<string, string> = {
    green: "#6FCBA1",
    amber: "#E8B967",
    purple: "#C896E8",
    neutral: "rgba(255,255,255,0.55)",
  };
  return map[tone] ?? map.neutral;
}
