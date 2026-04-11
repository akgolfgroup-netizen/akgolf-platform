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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminCard,
  AdminButton,
  AdminStatCard,
  AdminPageHeader,
  AdminEmptyState,
} from "@/components/portal/mission-control/ui";
import { exportBookingsCSV } from "./actions";

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

// Bruk kun var(--color-*)-tokens. Alle tiers mappes til brand-palette.
const tierColorVars: Record<string, string> = {
  VISITOR: "var(--color-muted)",
  ACADEMY: "var(--color-info)",
  STARTER: "var(--color-warning)",
  PRO: "var(--color-accent-cta)",
  ELITE: "var(--color-primary)",
};

const timeRanges = [
  { label: "Siste 7 dager", value: "7d" },
  { label: "Siste 30 dager", value: "30d" },
  { label: "Siste 3 måneder", value: "3m" },
  { label: "År til dato", value: "ytd" },
] as const;

type TimeRange = (typeof timeRanges)[number]["value"];

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function RapporterClient({ data }: RapporterClientProps) {
  const { toggle } = useMCSidebar();
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const maxBookings = Math.max(...data.bookingTrends.map((t) => t.count), 1);
  const totalTier = data.tierDistribution.reduce(
    (sum, t) => sum + t.count,
    0,
  );

  return (
    <>
      <MCTopbar
        title="Rapporter"
        subtitle="KPIer og analyse av akademiets ytelse"
        onMenuClick={toggle}
      />

      <div className="p-6 space-y-6">
        <AdminPageHeader
          title="Rapporter"
          subtitle="KPIer og analyse av akademiets ytelse"
          actions={
            <AdminButton
              variant="secondary"
              icon={<Download className="w-4 h-4" />}
              onClick={async () => {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const result = await exportBookingsCSV(
                  thirtyDaysAgo.toISOString(),
                  new Date().toISOString()
                );
                downloadCsv(result.csv, result.filename);
              }}
            >
              Eksporter rapport
            </AdminButton>
          }
        />

        {/* Time Range tabs */}
        <div className="flex flex-wrap gap-2">
          {timeRanges.map((range) => {
            const isActive = timeRange === range.value;
            return (
              <button
                key={range.value}
                type="button"
                onClick={() => setTimeRange(range.value)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border",
                  isActive
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                    : "bg-white border-[var(--color-grey-200)] text-[var(--color-text)] hover:bg-[var(--color-grey-100)]",
                )}
              >
                {range.label}
              </button>
            );
          })}
        </div>

        {/* Student KPIs */}
        <div>
          <h2 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">
            Elever
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminStatCard
              label="Totalt"
              value={data.totalStudents}
              icon={<Users className="w-5 h-5" />}
            />
            <AdminStatCard
              label="Nye (30d)"
              value={`+${data.newStudents}`}
              change={{ value: 12, positive: true }}
              icon={<UserPlus className="w-5 h-5" />}
            />
            <AdminStatCard
              label="Aktive (30d)"
              value={data.activeStudents}
              icon={<UserCheck className="w-5 h-5" />}
            />
            <AdminStatCard
              label="Retensjon"
              value={`${data.retentionRate}%`}
              icon={<BarChart3 className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* Session KPIs */}
        <div>
          <h2 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">
            Økter (siste 30 dager)
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminStatCard
              label="Fullførte"
              value={data.completedSessions}
              change={{ value: 8, positive: true }}
              icon={<CalendarCheck className="w-5 h-5" />}
            />
            <AdminStatCard
              label="Kansellerte"
              value={data.cancelledSessions}
              change={{ value: 5, positive: false }}
              icon={<XCircle className="w-5 h-5" />}
            />
            <AdminStatCard
              label="Kanselleringsrate"
              value={`${data.cancellationRate}%`}
              icon={<TrendingDown className="w-5 h-5" />}
            />
            <AdminStatCard
              label="HCP-forbedring"
              value={data.handicapImprovement}
              change={{ value: 15, positive: true }}
              icon={<Trophy className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Trends */}
          <AdminCard className="p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--color-grey-200)]">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">
                Booking-trend
              </h3>
            </div>
            <div className="p-5 space-y-4">
              {data.bookingTrends.length > 0 ? (
                data.bookingTrends.map((trend, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[var(--color-text)]">
                        Uke fra {trend.week}
                      </span>
                      <span className="text-sm text-[var(--color-muted)]">
                        {trend.count} bookinger
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--color-grey-100)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)] rounded-full transition-all"
                        style={{
                          width: `${(trend.count / maxBookings) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-sm text-[var(--color-muted)]">
                  Ingen bookinger i perioden
                </div>
              )}
            </div>
          </AdminCard>

          {/* Tier Distribution */}
          <AdminCard className="p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--color-grey-200)]">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">
                Fordeling per tier
              </h3>
            </div>
            <div className="p-5 space-y-4">
              {data.tierDistribution.length > 0 ? (
                data.tierDistribution.map((tier) => {
                  const percentage =
                    totalTier > 0 ? (tier.count / totalTier) * 100 : 0;
                  const colorVar =
                    tierColorVars[tier.tier] ?? "var(--color-muted)";
                  return (
                    <div key={tier.tier}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-sm"
                            style={{ backgroundColor: colorVar }}
                          />
                          <span className="text-sm text-[var(--color-text)]">
                            {tierLabels[tier.tier] ?? tier.tier}
                          </span>
                        </div>
                        <span className="text-sm text-[var(--color-muted)]">
                          {tier.count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-[var(--color-grey-100)] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: colorVar,
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <AdminEmptyState
                  icon={<Users className="w-6 h-6" />}
                  title="Ingen elever funnet"
                  description="Fordeling per tier vil vises når data er tilgjengelig."
                  className="border-0"
                />
              )}
            </div>
          </AdminCard>
        </div>

        {/* Additional Insights */}
        <AdminCard>
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">
            Innsikt og anbefalinger
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[var(--color-grey-100)]">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm font-medium text-[var(--color-text)]">
                  Vekst
                </span>
              </div>
              <p className="text-xs text-[var(--color-muted)]">
                {data.newStudents} nye elever denne måneden. Fortsett
                markedsføringen på Instagram.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--color-grey-100)]">
              <div className="flex items-center gap-2 mb-2">
                <CalendarCheck className="w-4 h-4 text-[var(--color-success)]" />
                <span className="text-sm font-medium text-[var(--color-text)]">
                  Oppmøte
                </span>
              </div>
              <p className="text-xs text-[var(--color-muted)]">
                {data.cancellationRate}% kanselleringsrate er innenfor normalen.
                Send påminnelser dagen før.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--color-grey-100)]">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-[var(--color-warning)]" />
                <span className="text-sm font-medium text-[var(--color-text)]">
                  Fremskritt
                </span>
              </div>
              <p className="text-xs text-[var(--color-muted)]">
                Elevene forbedrer i snitt {data.handicapImprovement} i handicap.
                Godt arbeid!
              </p>
            </div>
          </div>
        </AdminCard>
      </div>
    </>
  );
}
