"use client";

import React from "react";
import Link from "next/link";
import {
  MCTopbar,
  useMCSidebar,
} from "@/components/portal/mission-control";
import { WebhookHealthCard } from "@/components/portal/mission-control";
import {
  AdminGauge,
  AdminSparkline,
  AdminLineChart,
  AdminDonutChart,
} from "@/components/portal/mission-control/ui";
import type {
  AdminLineChartDatum,
  AdminDonutChartDatum,
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

// Badge component with grey tokens
function Badge({
  children,
  variant = "muted",
}: {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "muted";
}) {
  const variantStyles = {
    success: "bg-success-light text-success",
    warning: "bg-warning-light text-warning",
    error: "bg-error-light text-error",
    info: "bg-grey-200 text-black",
    muted: "bg-grey-50 text-grey-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}

// Card component with grey tokens
function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-xl border border-grey-200 ${className}`}>
      {children}
    </div>
  );
}

// Button component with grey tokens
function Button({
  children,
  variant = "secondary",
  icon,
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
  className?: string;
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors";
  const variantStyles = {
    primary: "bg-black text-white hover:bg-grey-800",
    secondary: "bg-white border border-grey-200 text-black hover:bg-grey-50",
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  );
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
    {
      label: "Ny booking",
      icon: Plus,
      href: "/admin/bookinger/ny",
      variant: "primary" as const,
    },
    {
      label: "Send melding",
      icon: MessageSquare,
      href: "/admin/meldinger",
      variant: "secondary" as const,
    },
    {
      label: "Legg til elev",
      icon: UserPlus,
      href: "/admin/elever",
      variant: "secondary" as const,
    },
  ];

  const allActionItems = [
    ...data.divisions.coaching.actionItems,
    ...data.divisions.junior.actionItems,
  ];

  const kapasitetPct = Math.round((data.kpis.activeStudents / 150) * 100);

  // Sparkline-data for KPI-kortene (siste 14 dager — eksempel-data)
  const sparkSessions = [6, 7, 5, 8, 9, 7, 10, 8, 9, 11, 10, 12, 11, 13];
  const sparkActiveStudents = [
    140, 142, 143, 145, 146, 147, 148, 149, 150, 150, 151, 152, 153, 154,
  ];
  const sparkPending = [3, 2, 4, 3, 5, 4, 3, 2, 4, 3, 2, 3, 4, 2];
  const sparkRevenue = [
    210000, 225000, 230000, 245000, 260000, 255000, 270000, 280000, 290000,
    295000, 310000, 320000, 325000, 340000,
  ];

  // Handicap-trend siste 30 dager (eksempel — gjennomsnitt alle aktive elever)
  const handicapTrend: AdminLineChartDatum[] = React.useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
          label: date.toLocaleDateString("nb-NO", {
            day: "numeric",
            month: "short",
          }),
          value: Number((18.4 - i * 0.04 - (i % 3) * 0.1).toFixed(1)),
        };
      }),
    []
  );

  // Elevfordeling per tier (VISITOR / ACADEMY / STARTER / PRO / ELITE)
  const tierDistribution: AdminDonutChartDatum[] = [
    {
      label: "Visitor",
      value: data.divisions.gfgk.studentCount,
      color: "var(--color-grey-300)",
    },
    {
      label: "Academy",
      value: Math.round(data.divisions.junior.studentCount * 0.6),
      color: "var(--color-accent-cta)",
    },
    {
      label: "Starter",
      value: Math.round(data.divisions.junior.studentCount * 0.4),
      color: "var(--color-warning)",
    },
    {
      label: "Pro",
      value: Math.round(data.divisions.coaching.studentCount * 0.7),
      color: "var(--color-primary)",
    },
    {
      label: "Elite",
      value: Math.round(data.divisions.coaching.studentCount * 0.3),
      color: "var(--color-ai)",
    },
  ];

  return (
    <>
      <MCTopbar
        title="Hub — Oversikt"
        subtitle={dateString.charAt(0).toUpperCase() + dateString.slice(1)}
        onMenuClick={toggle}
        user={user}
        notificationCount={data.alerts.length}
      />

      <div className="p-6 space-y-6 bg-grey-50 min-h-screen">
        {/* Alerts */}
        {data.alerts.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {data.alerts.map((a, i) => (
              <Badge key={i} variant={a.variant}>
                {a.label}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats Grid med sparklines */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-grey-400 uppercase tracking-wide">
                  Økter i dag
                </p>
                <p className="mt-2 text-3xl font-bold text-black tracking-tight tabular-nums">
                  {data.kpis.sessionsToday}
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-grey-50 text-black">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <AdminSparkline data={sparkSessions} width="100%" height={32} />
          </Card>

          <Card className="p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-grey-400 uppercase tracking-wide">
                  Aktive elever
                </p>
                <p className="mt-2 text-3xl font-bold text-black tracking-tight tabular-nums">
                  {data.kpis.activeStudents}
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-grey-50 text-black">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <AdminSparkline
              data={sparkActiveStudents}
              width="100%"
              height={32}
              color="var(--color-success)"
            />
          </Card>

          <Card className="p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-grey-400 uppercase tracking-wide">
                  Ventende bookinger
                </p>
                <p className="mt-2 text-3xl font-bold text-black tracking-tight tabular-nums">
                  {data.kpis.pendingBookings}
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-grey-50 text-black">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <AdminSparkline
              data={sparkPending}
              width="100%"
              height={32}
              color="var(--color-warning)"
            />
          </Card>

          <Card className="p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-grey-400 uppercase tracking-wide">
                  Omsetning MTD
                </p>
                <p className="mt-2 text-3xl font-bold text-black tracking-tight tabular-nums">
                  {formatRevenue(data.kpis.mtdRevenue)}
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-grey-50 text-black">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <AdminSparkline
              data={sparkRevenue}
              width="100%"
              height={32}
              color="var(--color-primary)"
            />
          </Card>
        </div>

        {/* Kapasitet + Tier fordeling + Handicap-trend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-black mb-4">
              Kapasitetsutnyttelse
            </h3>
            <div className="flex flex-col items-center justify-center py-2">
              <AdminGauge
                value={kapasitetPct}
                size={180}
                label={`${data.kpis.activeStudents} av 150 plasser`}
              />
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-black mb-4">
              Elevfordeling per tier
            </h3>
            <AdminDonutChart
              data={tierDistribution}
              height={240}
              centerLabel="Totalt"
              centerValue={tierDistribution.reduce((s, d) => s + d.value, 0)}
            />
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-black">
                Handicap-trend (30 dager)
              </h3>
              <Badge variant="info">Snitt</Badge>
            </div>
            <AdminLineChart data={handicapTrend} height={240} />
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-grey-200">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-grey-400" />
                  <h2 className="text-sm font-semibold text-black">
                    Dagens timeplan
                  </h2>
                </div>
                <Link
                  href="/admin/kalender"
                  className="text-sm text-grey-400 hover:text-black font-medium inline-flex items-center gap-1.5 transition-colors"
                >
                  Se kalender
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {timelineItems.length > 0 ? (
                <ul className="divide-y divide-grey-50">
                  {timelineItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-5 px-6 py-4 hover:bg-grey-50 transition-colors"
                    >
                      <div className="min-w-[60px] text-center">
                        <p className="text-lg font-bold text-black tabular-nums">
                          {item.time}
                        </p>
                        <p className="text-[10px] uppercase tracking-wide text-grey-400">
                          {item.duration}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-black truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-grey-400 truncate mt-0.5">
                          {item.subtitle ?? item.division}
                        </p>
                      </div>
                      {item.isActive ? (
                        <Badge variant="success">Aktiv</Badge>
                      ) : (
                        <Badge variant="muted">{item.division}</Badge>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-6 py-16 text-center">
                  <Calendar className="w-10 h-10 text-grey-300 mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-grey-400">Ingen økter i dag</p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar - Takes 1 column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-black mb-4">
                Snarveier
              </h3>
              <div className="space-y-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="block"
                    >
                      <Button
                        variant={action.variant}
                        className="w-full justify-start"
                        icon={<Icon className="w-4 h-4" />}
                      >
                        {action.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </Card>

            {/* Division Stats */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-black mb-4">
                Divisjoner
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-grey-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-black" />
                    <span className="text-sm text-grey-400">Coaching</span>
                  </div>
                  <span className="text-sm font-semibold text-black tabular-nums">
                    {data.divisions.coaching.studentCount}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-grey-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-warning" />
                    <span className="text-sm text-grey-400">Junior</span>
                  </div>
                  <span className="text-sm font-semibold text-black tabular-nums">
                    {data.divisions.junior.studentCount}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-grey-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-sm text-grey-400">GFGK</span>
                  </div>
                  <span className="text-sm font-semibold text-black tabular-nums">
                    {data.divisions.gfgk.studentCount}
                  </span>
                </div>
              </div>
            </Card>

            {/* System Health */}
            <WebhookHealthCard />

            {/* Pending Actions */}
            {allActionItems.length > 0 && (
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-black mb-3">
                  Påminnelser
                </h3>
                <div className="space-y-2">
                  {allActionItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 p-3 rounded-lg bg-grey-50"
                    >
                      <AlertCircle
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          item.variant === "error"
                            ? "text-[var(--color-error)]"
                            : item.variant === "warning"
                              ? "text-[var(--color-warning)]"
                              : "text-[var(--color-info)]"
                        }`}
                      />
                      <span className="text-xs text-grey-400">{item.text}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
