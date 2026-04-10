"use client";

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
} from "@/components/portal/mission-control/ui";
import type { CapacityData } from "./actions";

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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Coach Capacity */}
          <AdminCard className="lg:col-span-2">
            <h3 className="admin-section-title mb-4">Kapasitet per coach</h3>
            <div className="space-y-5">
              {coaches.map((coach) => {
                const coachPct = Math.round(coach.occupancy * 100);
                return (
                  <div
                    key={coach.id}
                    className="p-4 bg-[var(--color-grey-100)] rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--color-text)]">
                          {coach.name}
                        </h4>
                        <span className="text-xs text-[var(--color-muted)]">
                          {coach.bookedSlots} av {coach.weeklySlots} sloter
                          booket
                        </span>
                      </div>
                      <span className="text-lg font-bold text-[var(--color-text)] tabular-nums">
                        {coachPct}%
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--color-grey-200)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)] transition-all"
                        style={{ width: `${coachPct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-3 text-xs text-[var(--color-muted)]">
                      <span>{formatKr(coach.weeklyRevenue)} inntekt</span>
                      <span>
                        {coach.weeklySlots - coach.bookedSlots} ledige sloter
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Daily Breakdown */}
            <div className="mt-6 pt-6 border-t border-[var(--color-grey-200)]">
              <h4 className="text-sm font-medium text-[var(--color-text)] mb-4">
                Daglig oversikt
              </h4>
              <div className="flex items-end gap-2 h-24">
                {dailyBreakdown.map((day, i) => {
                  const totalSlots = Object.values(day.coaches).reduce(
                    (s, c) => s + c.total,
                    0,
                  );
                  const bookedSlots = Object.values(day.coaches).reduce(
                    (s, c) => s + c.booked,
                    0,
                  );
                  const pct =
                    totalSlots > 0
                      ? Math.round((bookedSlots / totalSlots) * 100)
                      : 0;
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <div className="relative w-full flex justify-center">
                        <div
                          className="w-8 bg-[var(--color-primary)] rounded-t transition-all"
                          style={{ height: `${(pct / 100) * 80}px` }}
                        />
                      </div>
                      <span className="text-[10px] text-[var(--color-muted)] capitalize">
                        {day.day.slice(0, 3)}
                      </span>
                      <span className="text-[10px] text-[var(--color-muted)] tabular-nums">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </AdminCard>

          {/* Empty Slots */}
          <AdminCard>
            <h3 className="admin-section-title mb-4">Ledige sloter</h3>
            <p className="text-xs text-[var(--color-muted)] mb-3">
              Ledige tider denne uken som kan fylles
            </p>
            <div className="space-y-2">
              {emptySlotsList.length === 0 ? (
                <p className="text-sm text-[var(--color-muted)] py-4 text-center">
                  Ingen ledige sloter denne uken
                </p>
              ) : (
                emptySlotsList.slice(0, 8).map((slot, i) => (
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
                    <button className="p-1.5 rounded-md hover:bg-white text-[var(--color-primary)]">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            {emptySlotsList.length > 8 && (
              <p className="text-xs text-[var(--color-muted)] mt-2 text-center">
                + {emptySlotsList.length - 8} flere
              </p>
            )}
          </AdminCard>
        </div>

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
                  <button className="text-xs text-[var(--color-primary)] hover:underline">
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
