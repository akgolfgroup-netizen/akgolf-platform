"use client";


import { Icon } from "@/components/ui/icon";
import { useMemo } from "react";
import { DollarSign } from "lucide-react";
import {
  MCTopbar,
  useMCSidebar,
} from "@/components/portal/mission-control";
import {
  AdminStatCard,
  AdminGauge,
  AdminProgressRing,
  AdminBarChart,
  AdminAreaChart,
  AdminHeatmap,
  AdminDataTable,
} from "@/components/portal/mission-control/ui";
import { MonoLabel, BentoGrid, BentoCard, NightSurface, GlassPanel } from "@/components/portal/patterns";
import { Badge } from "@/components/ui/badge";
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

      <div className="p-6 space-y-6">
        {/* Heritage Grid Header */}
        <div className="space-y-2">
          <MonoLabel size="xs" uppercase className="block text-outline">CoachHQ</MonoLabel>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">Kapasitet<span className="text-outline">.</span></h1>
          <p className="text-on-surface-variant">{data.weekRange.from} – {data.weekRange.to}</p>
        </div>

        {/* Alert */}
        <div className="flex items-start gap-3 rounded-xl bg-info-light border border-info/20 p-4 text-info-text">
          <Icon name="info" className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">
            <strong>Kapasitetsoversikt:</strong> Basert på tilgjengelighet og
            bookinger for denne uken ({data.weekRange.from} – {data.weekRange.to}
            ).
          </p>
        </div>

        {/* Stats */}
        <BentoGrid cols={4} gap="md">
          <BentoCard variant="light" padding="md">
            <MonoLabel size="xs" uppercase className="text-outline block">Denne uken</MonoLabel>
            <p className="text-2xl font-bold text-on-surface mt-1">{occupancyPct}%</p>
          </BentoCard>
          <BentoCard variant="light" padding="md">
            <MonoLabel size="xs" uppercase className="text-outline block">Ledige sloter</MonoLabel>
            <p className="text-2xl font-bold text-on-surface mt-1">{freeSlots}</p>
          </BentoCard>
          <BentoCard variant="light" padding="md">
            <MonoLabel size="xs" uppercase className="text-outline block">Potensiell inntekt</MonoLabel>
            <p className="text-2xl font-bold text-on-surface mt-1">{formatKr(potentialRevenue)}</p>
          </BentoCard>
          <BentoCard variant="light" padding="md">
            <MonoLabel size="xs" uppercase className="text-outline block">Ukentlig inntekt</MonoLabel>
            <p className="text-2xl font-bold text-on-surface mt-1">{formatKr(weeklyTotal.revenue)}</p>
          </BentoCard>
        </BentoGrid>

        {/* Legacy stat cards - hidden, replaced by BentoGrid above */}
        <div className="hidden">
          <AdminStatCard
            label="Denne uken"
            value={`${occupancyPct}%`}
            icon={<Icon name="speed" className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Ledige sloter"
            value={freeSlots}
            icon={<Icon name="schedule" className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Potensiell inntekt"
            value={formatKr(potentialRevenue)}
            icon={<DollarSign className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Ukentlig inntekt"
            value={formatKr(weeklyTotal.revenue)}
            icon={<Icon name="trending_up" className="w-5 h-5" />}
          />
        </div>

        <NightSurface variant="ambient" className="rounded-2xl p-6">
          <MonoLabel size="xs" uppercase className="text-surface/60 block mb-4">Kapasitetsanalyse</MonoLabel>

          {/* Hero — total utnyttelse + trend */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-on-surface mb-4">
              Total utnyttelse
            </h3>
            <div className="flex flex-col items-center gap-3">
              <AdminProgressRing
                value={occupancyPct}
                size={160}
               
                label="denne uken"
              />
              <div className="text-center">
                <p className="text-xs text-on-surface-variant">
                  {weeklyTotal.booked} av {weeklyTotal.slots} sloter
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-on-surface">
                Kapasitetstrend
              </h3>
              <Badge variant="info">Siste 6 uker</Badge>
            </div>
            <AdminAreaChart
              data={trendData}
              height={200}
              valueLabel="Utnyttelse %"
            />
          </div>
        </div>

          {/* Coach Gauges */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-on-surface mb-4">
            Kapasitet per coach
          </h3>
          {coaches.length === 0 ? (
            <p className="text-sm text-on-surface-variant py-4 text-center">
              Ingen coacher å vise.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coaches.map((coach) => {
                const coachPct = Math.round(coach.occupancy * 100);
                return (
                  <div
                    key={coach.id}
                    className="flex flex-col items-center p-4 rounded-lg bg-surface"
                  >
                    <AdminGauge
                      value={coachPct}
                      size={160}
                     
                      label={coach.name}
                    />
                    <div className="mt-2 text-center">
                      <p className="text-xs text-on-surface-variant">
                        {coach.bookedSlots} av {coach.weeklySlots} sloter
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {formatKr(coach.weeklyRevenue)} inntekt
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

          {/* Ukesutnyttelse + belegg heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-on-surface mb-4">
              Ukesutnyttelse
            </h3>
            <AdminBarChart
              data={weekBarData}
              height={240}
              valueLabel="Utnyttelse %"
            />
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-on-surface mb-4">
              Belegg per coach og dag
            </h3>
            {heatmapRows.length === 0 ? (
              <p className="text-sm text-on-surface-variant py-4 text-center">
                Ingen data å vise.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <AdminHeatmap
                  data={heatmapData}
                  rows={heatmapRows}
                  cols={heatmapCols}
                  cellSize={32}
                  color="grey-500"
                  formatTooltip={(cell) =>
                    `${cell.row} ${cell.col}: ${cell.value}% belegg`
                  }
                />
              </div>
            )}
          </div>
        </div>

          {/* Detail table */}
          <div>
            <h3 className="text-lg font-semibold text-on-surface mb-3">
              Detaljer per coach
            </h3>
            <AdminDataTable
            columns={coachColumns}
            data={coachRows}
            searchable
            searchPlaceholder="Søk coach..."
            emptyMessage="Ingen coacher funnet."
            />
          </div>
        </NightSurface>

        {/* Monthly summary */}
        <GlassPanel variant="light" padding="md">
          <div className="mb-4 flex items-center gap-2">
            <Icon name="calendar_today" size={20} className="text-primary" />
            <MonoLabel size="xs" uppercase>Månedsoversikt</MonoLabel>
          </div>
          <h3 className="text-lg font-semibold text-on-surface mb-3">
            Denne måneden ({data.monthRange.from} – {data.monthRange.to})
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-on-surface-variant">Inntekt</p>
              <p className="text-lg font-bold text-on-surface tabular-nums">
                {formatKr(data.monthlyTotal.revenue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Maks potensiell</p>
              <p className="text-lg font-bold text-on-surface tabular-nums">
                {formatKr(data.monthlyTotal.maxRevenue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Bookinger</p>
              <p className="text-lg font-bold text-on-surface tabular-nums">
                {data.monthlyTotal.bookedCount}
              </p>
            </div>
          </div>
        </GlassPanel>

        {/* Empty slots */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-on-surface mb-4">
            Ledige sloter
          </h3>
          <p className="text-xs text-on-surface-variant mb-3">
            Ledige tider denne uken som kan fylles
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {emptySlotsList.length === 0 ? (
              <p className="text-sm text-on-surface-variant py-4 text-center col-span-full">
                Ingen ledige sloter denne uken
              </p>
            ) : (
              emptySlotsList.slice(0, 9).map((slot, i) => (
                <div
                  key={i}
                  className="p-3 bg-surface rounded-lg flex items-center justify-between hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <div>
                    <div className="text-sm font-medium text-on-surface capitalize">
                      {slot.day}
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      {slot.coach} — {slot.free}{" "}
                      {slot.free === 1 ? "ledig slot" : "ledige sloter"}
                    </div>
                  </div>
                  <span className="p-1.5 text-on-surface-variant">
                    <Icon name="chevron_right" className="w-4 h-4" />
                  </span>
                </div>
              ))
            )}
          </div>
          {emptySlotsList.length > 9 && (
            <p className="text-xs text-on-surface-variant mt-2 text-center">
              + {emptySlotsList.length - 9} flere
            </p>
          )}
        </div>

        {/* AI Recommendations (statisk foreløpig) */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="auto_awesome" className="w-5 h-5 text-on-surface-variant/80" />
            <h3 className="text-lg font-semibold text-on-surface">
              AI-anbefalinger
            </h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.title}
                className="p-4 bg-surface rounded-lg border border-outline-variant/30 hover:border-outline-variant/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h4 className="text-sm font-semibold text-on-surface">
                    {rec.title}
                  </h4>
                  <Badge variant="success">
                    {rec.confidence}% sikkert
                  </Badge>
                </div>
                <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
                  {rec.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30">
                  <span className="text-sm font-bold text-on-surface">
                    {rec.impact}
                  </span>
                  <span
                    className="text-xs text-on-surface-variant cursor-not-allowed"
                    title="Kommer snart"
                  >
                    Kommer snart
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
