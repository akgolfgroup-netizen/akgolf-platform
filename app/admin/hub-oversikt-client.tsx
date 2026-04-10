"use client";

import Link from "next/link";
import {
  MCTopbar,
  useMCSidebar,
} from "@/components/portal/mission-control";
import {
  AdminCard,
  AdminStatCard,
  AdminButton,
  AdminBadge,
} from "@/components/portal/mission-control/ui";
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  Plus,
  MessageSquare,
  UserPlus,
  AlertCircle,
  ArrowRight,
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

  // Combine today's sessions from all divisions, sorted by time
  const timelineItems = [
    ...data.divisions.coaching.sessions.map((s) => ({
      ...s,
      division: "Coaching",
      duration: "50 min",
    })),
    ...data.divisions.junior.sessions.map((s) => ({
      ...s,
      division: "Junior",
      duration: "60 min",
    })),
    ...data.divisions.gfgk.sessions.map((s) => ({
      ...s,
      division: "GFGK",
      duration: "90 min",
    })),
  ].sort((a, b) => a.time.localeCompare(b.time));

  // Quick actions
  const quickActions = [
    { label: "Ny booking", icon: Plus, href: "/admin/bookinger/ny", variant: "primary" as const },
    { label: "Send melding", icon: MessageSquare, href: "/admin/meldinger", variant: "secondary" as const },
    { label: "Legg til elev", icon: UserPlus, href: "/admin/elever", variant: "secondary" as const },
  ];

  const allActionItems = [
    ...data.divisions.coaching.actionItems,
    ...data.divisions.junior.actionItems,
  ];

  const kapasitetPct = Math.round((data.kpis.activeStudents / 150) * 100);

  return (
    <>
      <MCTopbar
        title="Hub — Oversikt"
        subtitle={dateString.charAt(0).toUpperCase() + dateString.slice(1)}
        onMenuClick={toggle}
        user={user}
        notificationCount={data.alerts.length}
      />

      <div className="p-6 space-y-6">
        {/* Alerts */}
        {data.alerts.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {data.alerts.map((a, i) => (
              <AdminBadge key={i} variant={a.variant}>
                {a.label}
              </AdminBadge>
            ))}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            label="Okter i dag"
            value={data.kpis.sessionsToday}
            icon={<Calendar className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Aktive elever"
            value={data.kpis.activeStudents}
            icon={<Users className="w-5 h-5" />}
            change={{ value: 8, positive: true }}
          />
          <AdminStatCard
            label="Kapasitet"
            value={`${kapasitetPct}%`}
            icon={<Clock className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Omsetning MTD"
            value={formatRevenue(data.kpis.mtdRevenue)}
            icon={<TrendingUp className="w-5 h-5" />}
            change={{ value: 12, positive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule - Takes 2 columns */}
          <div className="lg:col-span-2">
            <AdminCard className="p-0 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-grey-200)]">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                  <h2 className="admin-section-title">Dagens timeplan</h2>
                </div>
                <Link
                  href="/admin/kalender"
                  className="text-sm text-[var(--color-primary)] hover:opacity-80 font-medium inline-flex items-center gap-1.5 transition-opacity"
                >
                  Se kalender
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {timelineItems.length > 0 ? (
                <ul className="divide-y divide-[var(--color-grey-100)]">
                  {timelineItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-5 px-6 py-4 hover:bg-[var(--color-grey-50)] transition-colors"
                    >
                      <div className="min-w-[60px] text-center">
                        <p className="text-lg font-bold text-[var(--color-text)] tabular-nums">
                          {item.time}
                        </p>
                        <p className="text-[10px] uppercase tracking-wide text-[var(--color-muted)]">
                          {item.duration}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[var(--color-text)] truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-[var(--color-muted)] truncate mt-0.5">
                          {item.subtitle ?? item.division}
                        </p>
                      </div>
                      {item.isActive ? (
                        <AdminBadge variant="success">Aktiv</AdminBadge>
                      ) : (
                        <AdminBadge variant="muted">{item.division}</AdminBadge>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-6 py-16 text-center">
                  <Calendar className="w-10 h-10 text-[var(--color-muted)] mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-[var(--color-muted)]">
                    Ingen okter i dag
                  </p>
                </div>
              )}
            </AdminCard>
          </div>

          {/* Sidebar - Takes 1 column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <AdminCard>
              <h3 className="admin-section-title mb-4">Snarveier</h3>
              <div className="space-y-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.label} href={action.href} className="block">
                      <AdminButton
                        variant={action.variant}
                        className="w-full justify-start"
                        icon={<Icon className="w-4 h-4" />}
                      >
                        {action.label}
                      </AdminButton>
                    </Link>
                  );
                })}
              </div>
            </AdminCard>

            {/* Division Stats */}
            <AdminCard>
              <h3 className="admin-section-title mb-4">Divisjoner</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-grey-50)]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                    <span className="text-sm text-[var(--color-text)]">
                      Coaching
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-[var(--color-text)] tabular-nums">
                    {data.divisions.coaching.studentCount}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-grey-50)]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-warning)]" />
                    <span className="text-sm text-[var(--color-text)]">
                      Junior
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-[var(--color-text)] tabular-nums">
                    {data.divisions.junior.studentCount}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-grey-50)]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
                    <span className="text-sm text-[var(--color-text)]">
                      GFGK
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-[var(--color-text)] tabular-nums">
                    {data.divisions.gfgk.studentCount}
                  </span>
                </div>
              </div>
            </AdminCard>

            {/* Pending Actions */}
            {allActionItems.length > 0 && (
              <AdminCard>
                <h3 className="admin-section-title mb-3">Paminnelser</h3>
                <div className="space-y-2">
                  {allActionItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 p-3 rounded-lg bg-[var(--color-grey-50)]"
                    >
                      <AlertCircle
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          item.variant === "error"
                            ? "text-[var(--color-error)]"
                            : item.variant === "warning"
                              ? "text-[var(--color-warning)]"
                              : "text-[var(--color-primary)]"
                        }`}
                      />
                      <span className="text-xs text-[var(--color-text)]">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </AdminCard>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
