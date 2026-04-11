"use client";

import { useMemo } from "react";
import {
  Gauge,
  TrendingUp,
  Clock,
  DollarSign,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  MCTopbar,
  useMCSidebar,
  HGAlert,
} from "@/components/portal/mission-control";
import {
  AdminCard,
  AdminStatCard,
  AdminBadge,
  AdminGauge,
  AdminProgressRing,
  AdminBarChart,
  AdminAreaChart,
  AdminHeatmap,
  AdminDataTable,
} from "@/components/portal/mission-control/ui";
import type {
  AdminBarChartDatum,
  AdminAreaChartDatum,
  AdminHeatmapCell,
  AdminDataTableColumn,
} from "@/components/portal/mission-control/ui";
import type { CapacityData, CoachCapacity } from "./actions";

interface KapasitetClientProps {
  data: CapacityData;
}

const recommendations = [
  {
    type: "pricing",
    title: "Øk prisen på ettermiddagstimer",
    description:
      "Etterspørselen er høyest mellom 16:00-18:00. Vurder å øke prisen med 10-15% i dette tidsrommet.",
    impact: "+8 000 kr/uke",
    confidence: 85,
  },
  {
    type: "availability",
    title: "Legg til flere timer på onsdag",
    description:
      "Onsdag har kun 50% kapasitetsutnyttelse. Markedsfør spesialtilbud for denne dagen.",
    impact: "+5 000 kr/uke",
    confidence: 72,
  },
  {
    type: "booking",
    title: "Åpne for gruppetimer",
    description:
      "4 elever har etterspurt gruppetimer. Vurder å tilby dette for å øke kapasiteten.",
    impact: "+12 000 kr/mnd",
    confidence: 90,
  },
];

function formatKr(amount: number): string {
  return `${Math.round(amount).toLocaleString("nb-NO")} kr`;
}

// Ukesutnyttelse-trend (syntetisk — reell data kobles på senere)
function buildTrendData(current: number): AdminAreaChartDatum[] {
  const weeks = ["U-5", "U-4", "U-3", "U-2", "U-1", "Nå"];
  const base = Math.max(10, current - 20);
  return weeks.map((label, i) => ({
    label,
    value: Math.round(base + (current - base) * (i / (weeks.length - 1))),
  }));
}

interface CoachRow {
  id: string;
  name: string;
  bookedSlots: number;
  weeklySlots: number;
  occupancy: number;
  weeklyRevenue: number;
}

export function KapasitetClient({ data }: KapasitetClientProps) {
  const { toggle } = useMCSidebar();

  const { weeklyTotal, coaches, dailyBreakdown } = data;
  const occupancyPct = Math.round(weeklyTotal.occupancy * 100);
  const freeSlots = weeklyTotal.slots - weeklyTotal.booked;
  const potentialRevenue = weeklyTotal.maxRevenue - weeklyTotal.revenue;

  // Bygg ledige sloter fra daglig nedbrytning
  const emptySlotsList: { day: string; coach: string; free: number }[] = [];
  for (const day of dailyBreakdown) {
    for (const [coachName, stats] of Object.entries(day.coaches)) {
      const free = stats.total - stats.booked;
      if (free > 0) {
        emptySlotsList.push({ day: day.day, coach: coachName, free });
      }
    }
  }

  // Bar chart — ukesutnyttelse per dag
  const weekBarData = useMemo<AdminBarChartDatum[]>(
    () =>
      dailyBreakdown.map((day) => {
        const totalSlots = Object.values(day.coaches).reduce(
          (s, c) => s + c.total,
          0,
        );
        const bookedSlots = Object.values(day.coaches).reduce(
          (s, c) => s + c.booked,
          0,
        );
        const pct =
          totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0;
        return {
          label: day.day.slice(0, 3),
          value: pct,
        };
      }),
    [dailyBreakdown],
  );

  // Heatmap — belegg per coach × dag
  const heatmapRows = useMemo(() => coaches.map((c) => c.name), [coaches]);
  const heatmapCols = useMemo(
    () => dailyBreakdown.map((d) => d.day.slice(0, 3)),
    [dailyBreakdown],
  );
  const heatmapData = useMemo<AdminHeatmapCell[]>(() => {
    const cells: AdminHeatmapCell[] = [];
    for (const coach of coaches) {
      for (const day of dailyBreakdown) {
        const stats = day.coaches[coach.name];
        const pct =
          stats && stats.total > 0
            ? Math.round((stats.booked / stats.total) * 100)
            : 0;
        cells.push({
          row: coach.name,
          col: day.day.slice(0, 3),
          value: pct,
        });
      }
    }
    return cells;
  }, [coaches, dailyBreakdown]);

  // Trend
  const trendData = useMemo(() => buildTrendData(occupancyPct), [occupancyPct]);

  // Data table
  const coachRows = useMemo<CoachRow[]>(
    () =>
      coaches.map((c: CoachCapacity) => ({
        id: c.id,
        name: c.name,
        bookedSlots: c.bookedSlots,
        weeklySlots: c.weeklySlots,
        occupancy: Math.round(c.occupancy * 100),
        weeklyRevenue: c.weeklyRevenue,
      })),
    [coaches],
  );

  const coachColumns: AdminDataTableColumn<CoachRow>[] = [
    { key: "name", label: "Coach", sortable: true },
    {
      key: "bookedSlots",
      label: "Booket",
      sortable: true,
      align: "right",
      render: (r) => (
        <span className="tabular-nums">
          {r.bookedSlots} / {r.weeklySlots}
        </span>
      ),
    },
    {
      key: "occupancy",
      label: "Utnyttelse",
      sortable: true,
      align: "right",
      render: (r) => (
        <span className="tabular-nums font-semibold">{r.occupancy}%</span>
      ),
    },
    {
      key: "weeklyRevenue",
      label: "Inntekt",
      sortable: true,
      align: "right",
      render: (r) => (
        <span className="tabular-nums">{formatKr(r.weeklyRevenue)}</span>
      ),
    },
  ];

  return (
    <>
      <MCTopbar
        title="Kapasitet"
        subtitle={`${data.weekRange.from} – ${data.weekRange.to}`}
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Alert */}
        <HGAlert variant="info">
          <strong>Kapasitetsoversikt:</strong> Basert på tilgjengelighet og
          bookinger for denne uken ({data.weekRange.from} – {data.weekRange.to}
          ).
        </HGAlert>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            label="Denne uken"
            value={`${occupancyPct}%`}
            icon={<Gauge className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Ledige sloter"
            value={freeSlots}
            icon={<Clock className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Potensiell inntekt"
            value={formatKr(potentialRevenue)}
            icon={<DollarSign className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Ukentlig inntekt"
            value={formatKr(weeklyTotal.revenue)}
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>

        {/* Hero — total utnyttelse + trend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <AdminCard>
            <h3 className="admin-section-title mb-4">Total utnyttelse</h3>
            <div className="flex flex-col items-center gap-3">
              <AdminProgressRing
                value={occupancyPct}
                size={160}
                strokeWidth={14}
                label="denne uken"
              />
              <div className="text-center">
                <p className="text-xs text-[var(--color-muted)]">
                  {weeklyTotal.booked} av {weeklyTotal.slots} sloter
                </p>
              </div>
            </div>
          </AdminCard>

          <AdminCard className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="admin-section-title">Kapasitetstrend</h3>
              <AdminBadge variant="info">Siste 6 uker</AdminBadge>
            </div>
            <AdminAreaChart
              data={trendData}
              height={200}
              valueLabel="Utnyttelse %"
            />
          </AdminCard>
        </div>

        {/* Coach Gauges */}
        <AdminCard>
          <h3 className="admin-section-title mb-4">Kapasitet per coach</h3>
          {coaches.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)] py-4 text-center">
              Ingen coacher å vise.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coaches.map((coach) => {
                const coachPct = Math.round(coach.occupancy * 100);
                return (
                  <div
                    key={coach.id}
                    className="flex flex-col items-center p-4 rounded-lg bg-[var(--color-grey-100)]"
                  >
                    <AdminGauge
                      value={coachPct}
                      size={160}
                      strokeWidth={14}
                      label={coach.name}
                    />
                    <div className="mt-2 text-center">
                      <p className="text-xs text-[var(--color-muted)]">
                        {coach.bookedSlots} av {coach.weeklySlots} sloter
                      </p>
                      <p className="text-xs text-[var(--color-muted)]">
                        {formatKr(coach.weeklyRevenue)} inntekt
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </AdminCard>

        {/* Ukesutnyttelse + belegg heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AdminCard>
            <h3 className="admin-section-title mb-4">Ukesutnyttelse</h3>
            <AdminBarChart
              data={weekBarData}
              height={240}
              valueLabel="Utnyttelse %"
            />
          </AdminCard>

          <AdminCard>
            <h3 className="admin-section-title mb-4">Belegg per coach og dag</h3>
            {heatmapRows.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)] py-4 text-center">
                Ingen data å vise.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <AdminHeatmap
                  data={heatmapData}
                  rows={heatmapRows}
                  cols={heatmapCols}
                  cellSize={32}
                  formatTooltip={(cell) =>
                    `${cell.row} ${cell.col}: ${cell.value}% belegg`
                  }
                />
              </div>
            )}
          </AdminCard>
        </div>

        {/* Detail table */}
        <div>
          <h3 className="admin-section-title mb-3">Detaljer per coach</h3>
          <AdminDataTable
            columns={coachColumns}
            data={coachRows}
            searchable
            searchPlaceholder="Søk coach..."
            emptyMessage="Ingen coacher funnet."
          />
        </div>

        {/* Empty slots */}
        <AdminCard>
          <h3 className="admin-section-title mb-4">Ledige sloter</h3>
          <p className="text-xs text-[var(--color-muted)] mb-3">
            Ledige tider denne uken som kan fylles
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {emptySlotsList.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)] py-4 text-center col-span-full">
                Ingen ledige sloter denne uken
              </p>
            ) : (
              emptySlotsList.slice(0, 9).map((slot, i) => (
                <div
                  key={i}
                  className="p-3 bg-[var(--color-grey-100)] rounded-lg flex items-center justify-between hover:bg-[var(--color-grey-200)] transition-colors cursor-pointer"
                >
                  <div>
                    <div className="text-sm font-medium text-[var(--color-text)] capitalize">
                      {slot.day}
                    </div>
                    <div className="text-xs text-[var(--color-muted)]">
                      {slot.coach} — {slot.free}{" "}
                      {slot.free === 1 ? "ledig slot" : "ledige sloter"}
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Se detaljer"
                    className="p-1.5 rounded-md hover:bg-white text-[var(--color-primary)]"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
          {emptySlotsList.length > 9 && (
            <p className="text-xs text-[var(--color-muted)] mt-2 text-center">
              + {emptySlotsList.length - 9} flere
            </p>
          )}
        </AdminCard>

        {/* AI Recommendations (statisk foreløpig) */}
        <AdminCard>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[var(--color-ai)]" />
            <h3 className="admin-section-title">AI-anbefalinger</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.title}
                className="p-4 bg-[var(--color-grey-100)] rounded-lg border border-[var(--color-grey-200)] hover:border-[var(--color-primary)]/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h4 className="text-sm font-semibold text-[var(--color-text)]">
                    {rec.title}
                  </h4>
                  <AdminBadge variant="success">
                    {rec.confidence}% sikkert
                  </AdminBadge>
                </div>
                <p className="text-xs text-[var(--color-muted)] mb-3 leading-relaxed">
                  {rec.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-grey-200)]">
                  <span className="text-sm font-bold text-[var(--color-primary)]">
                    {rec.impact}
                  </span>
                  <button
                    type="button"
                    className="text-xs text-[var(--color-primary)] hover:underline"
                  >
                    Implementer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Monthly summary */}
        <AdminCard>
          <h3 className="admin-section-title mb-3">
            Denne måneden ({data.monthRange.from} – {data.monthRange.to})
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-[var(--color-muted)]">Inntekt</p>
              <p className="text-lg font-bold text-[var(--color-text)] tabular-nums">
                {formatKr(data.monthlyTotal.revenue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-muted)]">
                Maks potensiell
              </p>
              <p className="text-lg font-bold text-[var(--color-text)] tabular-nums">
                {formatKr(data.monthlyTotal.maxRevenue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-muted)]">Bookinger</p>
              <p className="text-lg font-bold text-[var(--color-text)] tabular-nums">
                {data.monthlyTotal.bookedCount}
              </p>
            </div>
          </div>
        </AdminCard>
      </div>
    </>
  );
}
