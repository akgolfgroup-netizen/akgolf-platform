"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  UserCheck,
  TrendingDown,
  CalendarCheck,
  XCircle,
  Trophy,
  BarChart3,
  Download,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar, HGStatCard } from "@/components/portal/mission-control";

interface ReportData {
  totalStudents: number;
  newStudents: number;
  activeStudents: number;
  retentionRate: number;
  completedSessions: number;
  cancelledSessions: number;
  cancellationRate: number;
  handicapImprovement: number;
  bookingTrends: { week: string; count: number }[];
  tierDistribution: { tier: string; count: number }[];
}

interface RapporterClientProps {
  data: ReportData;
}

const tierLabels: Record<string, string> = {
  VISITOR: "Visitor",
  ACADEMY: "Academy",
  STARTER: "Starter",
  PRO: "Pro",
  ELITE: "Elite",
};

const tierColors: Record<string, string> = {
  VISITOR: "#7A8C85",
  ACADEMY: "#007AFF",
  STARTER: "#C48A32",
  PRO: "#d2f000",
  ELITE: "#005840",
};

const timeRanges = [
  { label: "Siste 7 dager", value: "7d" },
  { label: "Siste 30 dager", value: "30d" },
  { label: "Siste 3 måneder", value: "3m" },
  { label: "År til dato", value: "ytd" },
];

export function RapporterClient({ data }: RapporterClientProps) {
  const { toggle } = useMCSidebar();
  const [timeRange, setTimeRange] = useState("30d");

  const maxBookings = Math.max(...data.bookingTrends.map((t) => t.count), 1);
  const totalTier = data.tierDistribution.reduce((sum, t) => sum + t.count, 0);

  return (
    <>
      <MCTopbar
        title="Rapporter"
        subtitle="KPIer og analyse av akademiets ytelse"
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Time Range & Export */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="hg-tabs">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={cn("hg-tab", timeRange === range.value && "active")}
              >
                {range.label}
              </button>
            ))}
          </div>
          <button className="hg-btn hg-btn-secondary">
            <Download className="w-4 h-4" />
            Eksporter rapport
          </button>
        </div>

        {/* Student KPIs */}
        <div>
          <h2 className="text-sm font-medium text-[var(--hg-text-muted)] uppercase tracking-wider mb-3">Elever</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <HGStatCard
              label="Totalt"
              value={data.totalStudents}
              icon={Users}
            />
            <HGStatCard
              label="Nye (30d)"
              value={`+${data.newStudents}`}
              trend={{ value: 12, direction: "up" }}
              icon={UserPlus}
            />
            <HGStatCard
              label="Aktive (30d)"
              value={data.activeStudents}
              icon={UserCheck}
            />
            <HGStatCard
              label="Retensjon"
              value={`${data.retentionRate}%`}
              icon={BarChart3}
            />
          </div>
        </div>

        {/* Session KPIs */}
        <div>
          <h2 className="text-sm font-medium text-[var(--hg-text-muted)] uppercase tracking-wider mb-3">Økter (siste 30 dager)</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <HGStatCard
              label="Fullførte"
              value={data.completedSessions}
              trend={{ value: 8, direction: "up" }}
              icon={CalendarCheck}
            />
            <HGStatCard
              label="Kansellerte"
              value={data.cancelledSessions}
              trend={{ value: 5, direction: "down" }}
              icon={XCircle}
              variant={data.cancelledSessions > 10 ? "warning" : "default"}
            />
            <HGStatCard
              label="Kanselleringsrate"
              value={`${data.cancellationRate}%`}
              icon={TrendingDown}
              variant={data.cancellationRate > 10 ? "warning" : "default"}
            />
            <HGStatCard
              label="HCP-forbedring"
              value={data.handicapImprovement}
              trend={{ value: 15, direction: "up" }}
              icon={Trophy}
            />
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Booking Trends */}
          <div className="hg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--hg-border)]">
              <h3 className="hg-section-title">Booking-trend</h3>
            </div>
            <div className="p-4 space-y-4">
              {data.bookingTrends.length > 0 ? (
                data.bookingTrends.map((trend, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[var(--hg-text)]">
                        Uke fra {trend.week}
                      </span>
                      <span className="text-sm text-[var(--hg-text-muted)]">
                        {trend.count} bookinger
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--hg-surface-raised)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--hg-primary)] rounded-full transition-all"
                        style={{ width: `${(trend.count / maxBookings) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[var(--hg-text-muted)]">
                  Ingen bookinger i perioden
                </div>
              )}
            </div>
          </div>

          {/* Tier Distribution */}
          <div className="hg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--hg-border)]">
              <h3 className="hg-section-title">Fordeling per tier</h3>
            </div>
            <div className="p-4 space-y-4">
              {data.tierDistribution.length > 0 ? (
                data.tierDistribution.map((tier) => {
                  const percentage = totalTier > 0 ? (tier.count / totalTier) * 100 : 0;
                  const color = tierColors[tier.tier] || "#7A8C85";
                  return (
                    <div key={tier.tier}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-sm"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-sm text-[var(--hg-text)]">
                            {tierLabels[tier.tier] || tier.tier}
                          </span>
                        </div>
                        <span className="text-sm text-[var(--hg-text-muted)]">
                          {tier.count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-[var(--hg-surface-raised)] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${percentage}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-[var(--hg-text-muted)]">
                  Ingen elever funnet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="hg-card p-4">
          <h3 className="hg-section-title mb-4">Innsikt og anbefalinger</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[var(--hg-surface-raised)]">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-[var(--hg-primary)]" />
                <span className="text-sm font-medium text-[var(--hg-text)]">Vekst</span>
              </div>
              <p className="text-xs text-[var(--hg-text-secondary)]">
                {data.newStudents} nye elever denne måneden. Fortsett markedsføringen på Instagram.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--hg-surface-raised)]">
              <div className="flex items-center gap-2 mb-2">
                <CalendarCheck className="w-4 h-4 text-[var(--hg-success)]" />
                <span className="text-sm font-medium text-[var(--hg-text)]">Oppmøte</span>
              </div>
              <p className="text-xs text-[var(--hg-text-secondary)]">
                {data.cancellationRate}% kanselleringsrate er innenfor normalen. Send påminnelser dagen før.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--hg-surface-raised)]">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-[var(--hg-warning)]" />
                <span className="text-sm font-medium text-[var(--hg-text)]">Fremskritt</span>
              </div>
              <p className="text-xs text-[var(--hg-text-secondary)]">
                Elevene forbedrer i snitt {data.handicapImprovement} i handicap. Godt arbeid!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
