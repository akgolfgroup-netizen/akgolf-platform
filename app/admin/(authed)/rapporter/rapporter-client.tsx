"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import { UserCheck, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { CoachHQTopbar, useCoachHQSidebar } from "@/components/portal/coach-hq";
import {
  AdminStatCard,
  AdminPageHeader,
  AdminEmptyState,
} from "@/components/portal/coach-hq/ui";
import { Button } from "@/components/ui/button";
import { exportBookingsCSV } from "./actions";
import { MonoLabel } from "@/components/portal/patterns";

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
  const { toggle } = useCoachHQSidebar();
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const maxBookings = Math.max(...data.bookingTrends.map((t) => t.count), 1);
  const totalTier = data.tierDistribution.reduce(
    (sum, t) => sum + t.count,
    0,
  );

  return (
    <>
      <CoachHQTopbar
        title="Rapporter"
        subtitle="KPIer og analyse av akademiets ytelse"
        onMenuClick={toggle}
      />

      <div className="p-6 space-y-6">
        <AdminPageHeader
          title="Rapporter"
          subtitle="KPIer og analyse av akademiets ytelse"
          actions={
            <Button
              variant="secondary"
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
              <Icon name="download" className="w-4 h-4 mr-2" />
              Eksporter rapport
            </Button>
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
                    ? "bg-on-surface text-surface border-black"
                    : "bg-surface-container-lowest border-outline-variant/30 text-text hover:bg-surface",
                )}
              >
                {range.label}
              </button>
            );
          })}
        </div>

        {/* Student KPIs */}
        <div>
          <MonoLabel as="h2" size="xs" uppercase className="text-on-surface-variant block mb-3">
            Elever
          </MonoLabel>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminStatCard
              label="Totalt"
              value={data.totalStudents}
              icon={<Icon name="group" className="w-5 h-5" />}
            />
            <AdminStatCard
              label="Nye (30d)"
              value={`+${data.newStudents}`}
              change={{ value: 12, positive: true }}
              icon={<Icon name="person_add" className="w-5 h-5" />}
            />
            <AdminStatCard
              label="Aktive (30d)"
              value={data.activeStudents}
              icon={<Icon name="person_check" className="w-5 h-5" />}
            />
            <AdminStatCard
              label="Retensjon"
              value={`${data.retentionRate}%`}
              icon={<Icon name="bar_chart" className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* Session KPIs */}
        <div>
          <MonoLabel as="h2" size="xs" uppercase className="text-on-surface-variant block mb-3">
            Økter (siste 30 dager)
          </MonoLabel>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminStatCard
              label="Fullførte"
              value={data.completedSessions}
              change={{ value: 8, positive: true }}
              icon={<Icon name="event_available" className="w-5 h-5" />}
            />
            <AdminStatCard
              label="Kansellerte"
              value={data.cancelledSessions}
              change={{ value: 5, positive: false }}
              icon={<Icon name="cancel" className="w-5 h-5" />}
            />
            <AdminStatCard
              label="Kanselleringsrate"
              value={`${data.cancellationRate}%`}
              icon={<Icon name="trending_down" className="w-5 h-5" />}
            />
            <AdminStatCard
              label="HCP-forbedring"
              value={data.handicapImprovement}
              change={{ value: 15, positive: true }}
              icon={<Icon name="emoji_events" className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Trends */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-outline-variant/30">
              <h3 className="text-sm font-semibold text-on-surface">
                Booking-trend
              </h3>
            </div>
            <div className="p-5 space-y-4">
              {data.bookingTrends.length > 0 ? (
                data.bookingTrends.map((trend, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-text">
                        Uke fra {trend.week}
                      </span>
                      <span className="text-sm text-on-surface-variant">
                        {trend.count} bookinger
                      </span>
                    </div>
                    <div className="h-2 bg-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-surface-variant rounded-full transition-all"
                        style={{
                          width: `${(trend.count / maxBookings) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-sm text-on-surface-variant">
                  Ingen bookinger i perioden
                </div>
              )}
            </div>
          </div>

          {/* Tier Distribution */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-outline-variant/30">
              <h3 className="text-sm font-semibold text-on-surface">
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
                          <span className="text-sm text-text">
                            {tierLabels[tier.tier] ?? tier.tier}
                          </span>
                        </div>
                        <span className="text-sm text-on-surface-variant">
                          {tier.count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-surface rounded-full overflow-hidden">
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
                  icon={<Icon name="group" className="w-6 h-6" />}
                  title="Ingen elever funnet"
                  description="Fordeling per tier vil vises når data er tilgjengelig."
                  className="border-0"
                />
              )}
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="bg-surface-container-lowest rounded-xl shadow-card p-5">
          <h3 className="text-sm font-semibold text-on-surface mb-4">
            Innsikt og anbefalinger
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="group" className="w-4 h-4 text-on-surface-variant/80" />
                <span className="text-sm font-medium text-text">
                  Vekst
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                {data.newStudents} nye elever denne måneden. Fortsett
                markedsføringen på Instagram.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="event_available" className="w-4 h-4 text-success-text" />
                <span className="text-sm font-medium text-text">
                  Oppmøte
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                {data.cancellationRate}% kanselleringsrate er innenfor normalen.
                Send påminnelser dagen før.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="emoji_events" className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium text-text">
                  Fremskritt
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Elevene forbedrer i snitt {data.handicapImprovement} i handicap.
                Godt arbeid!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
