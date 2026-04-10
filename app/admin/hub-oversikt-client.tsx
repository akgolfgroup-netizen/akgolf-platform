"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MCTopbar,
  MCModeToggle,
  useMCSidebar,
  HGStatCard,
  HGBookingTimeline,
  HGAlertBanner,
  HGQuickActions,
} from "@/components/portal/mission-control";
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  Plus,
  MessageSquare,
  UserPlus,
  AlertCircle,
} from "lucide-react";

interface Session {
  id: string;
  name: string;
  time: string;
  isActive?: boolean;
  subtitle?: string;
}

interface ActionItem {
  text: string;
  variant: "error" | "warning" | "info";
}

interface HubData {
  kpis: {
    sessionsToday: number;
    activeStudents: number;
    pendingBookings: number;
    mtdRevenue: number;
  };
  divisions: {
    coaching: {
      studentCount: number;
      sessions: Session[];
      actionItems: ActionItem[];
    };
    junior: {
      studentCount: number;
      sessions: Session[];
      actionItems: ActionItem[];
    };
    gfgk: {
      studentCount: number;
      sessions: Session[];
      nextWeekItems?: string[];
    };
  };
  alerts: { label: string; variant: "success" | "warning" | "error" | "info" }[];
}

interface HubOversiktClientProps {
  data: HubData;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function HubOversiktClient({ data, user }: HubOversiktClientProps) {
  const router = useRouter();
  const { toggle } = useMCSidebar();

  const today = new Date();
  const dateString = today.toLocaleDateString("nb-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Format revenue
  const formatRevenue = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M kr`;
    }
    if (amount >= 1000) {
      return `${Math.round(amount / 1000)}k kr`;
    }
    return `${amount} kr`;
  };

  // Build timeline items from divisions
  const timelineItems = [
    ...data.divisions.coaching.sessions.map((s) => ({
      id: s.id,
      time: s.time,
      name: s.name,
      type: "individual" as const,
      status: (s.isActive ? "confirmed" : "pending") as "confirmed" | "pending" | "cancelled",
      coach: "Anders",
      duration: "50 min",
    })),
    ...data.divisions.junior.sessions.map((s) => ({
      id: s.id,
      time: s.time,
      name: s.name,
      type: "junior" as const,
      status: "confirmed" as const,
      coach: "Junior",
      duration: "60 min",
    })),
    ...data.divisions.gfgk.sessions.map((s) => ({
      id: s.id,
      time: s.time,
      name: s.name,
      type: "gruppe" as const,
      status: "confirmed" as const,
      coach: "GFGK",
      duration: "90 min",
    })),
  ].sort((a, b) => a.time.localeCompare(b.time));

  // Build alerts
  const alertItems = data.alerts.map((a, i) => ({
    id: `alert-${i}`,
    message: a.label,
    variant: a.variant as "success" | "warning" | "error" | "info",
  }));

  // Quick actions
  const quickActions = [
    { label: "Ny booking", icon: Plus, href: "/portal/admin/bookinger/ny", variant: "primary" as const },
    { label: "Send melding", icon: MessageSquare, href: "/portal/admin/meldinger" },
    { label: "Legg til elev", icon: UserPlus, href: "/portal/admin/elever" },
  ];

  return (
    <>
      <MCTopbar
        title="Hub — Oversikt"
        subtitle={dateString.charAt(0).toUpperCase() + dateString.slice(1)}
        onMenuClick={toggle}
        user={user}
        notificationCount={data.alerts.length}
      >
        <Link href="/portal/admin/focus">
          <MCModeToggle
            activeMode="oversikt"
            onModeChange={(mode) => {
              if (mode === "focus") {
                router.push("/portal/admin/focus");
              }
            }}
          />
        </Link>
      </MCTopbar>

      <div className="p-5 space-y-5">
        {/* Alerts */}
        {alertItems.length > 0 && (
          <HGAlertBanner alerts={alertItems} />
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <HGStatCard
            label="Økter i dag"
            value={data.kpis.sessionsToday}
            icon={Calendar}
          />
          <HGStatCard
            label="Aktive elever"
            value={data.kpis.activeStudents}
            icon={Users}
            trend={{ value: 8, direction: "up" }}
          />
          <HGStatCard
            label="Kapasitet"
            value={`${Math.round((data.kpis.activeStudents / 150) * 100)}%`}
            icon={Clock}
            variant={data.kpis.activeStudents / 150 > 0.9 ? "warning" : "default"}
          />
          <HGStatCard
            label="Omsetning MTD"
            value={formatRevenue(data.kpis.mtdRevenue)}
            icon={TrendingUp}
            trend={{ value: 12, direction: "up" }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Today's Schedule - Takes 2 columns */}
          <div className="lg:col-span-2">
            <HGBookingTimeline
              items={timelineItems}
              title="Dagens timeplan"
            />
          </div>

          {/* Sidebar - Takes 1 column */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <HGQuickActions actions={quickActions} title="Snarveier" />

            {/* Division Stats */}
            <div className="hg-card p-4">
              <h3 className="hg-section-title mb-4">Divisjoner</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--hg-surface-raised)]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--hg-text)]" />
                    <span className="text-sm text-[var(--hg-text)]">Coaching</span>
                  </div>
                  <span className="text-sm font-semibold text-[var(--hg-text)] tabular-nums">
                    {data.divisions.coaching.studentCount}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--hg-surface-raised)]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--hg-info)]" />
                    <span className="text-sm text-[var(--hg-text)]">Junior</span>
                  </div>
                  <span className="text-sm font-semibold text-[var(--hg-text)] tabular-nums">
                    {data.divisions.junior.studentCount}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--hg-surface-raised)]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--hg-success)]" />
                    <span className="text-sm text-[var(--hg-text)]">GFGK</span>
                  </div>
                  <span className="text-sm font-semibold text-[var(--hg-text)] tabular-nums">
                    {data.divisions.gfgk.studentCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Pending Actions */}
            {(data.divisions.coaching.actionItems.length > 0 || data.divisions.junior.actionItems.length > 0) && (
              <div className="hg-card p-4">
                <h3 className="hg-section-title mb-3">Påminnelser</h3>
                <div className="space-y-2">
                  {[...data.divisions.coaching.actionItems, ...data.divisions.junior.actionItems].map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 p-2.5 rounded-lg ${
                        item.variant === "error"
                          ? "bg-[var(--hg-error-bg)] text-[var(--hg-error)]"
                          : item.variant === "warning"
                          ? "bg-[var(--hg-warning-bg)] text-[var(--hg-warning)]"
                          : "bg-[var(--hg-info-bg)] text-[var(--hg-info)]"
                      }`}
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span className="text-xs">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
