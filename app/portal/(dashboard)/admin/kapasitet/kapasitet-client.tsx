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
  HGStatCard,
  HGCapacityBar,
  HGAlert,
} from "@/components/portal/mission-control";
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
          <HGStatCard
            label="Denne uken"
            value={`${occupancyPct}%`}
            icon={Gauge}
          />
          <HGStatCard
            label="Ledige sloter"
            value={freeSlots}
            icon={Clock}
          />
          <HGStatCard
            label="Potensiell inntekt"
            value={formatKr(potentialRevenue)}
            icon={DollarSign}
            variant="success"
          />
          <HGStatCard
            label="Ukentlig inntekt"
            value={formatKr(weeklyTotal.revenue)}
            icon={TrendingUp}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Coach Capacity */}
          <div className="lg:col-span-2 hg-card p-4">
            <h3 className="hg-section-title mb-4">Kapasitet per coach</h3>
            <div className="space-y-5">
              {coaches.map((coach) => (
                <div
                  key={coach.id}
                  className="p-4 bg-[var(--hg-surface-raised)] rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--hg-text)]">
                        {coach.name}
                      </h4>
                      <span className="text-xs text-[var(--hg-text-muted)]">
                        {coach.bookedSlots} av {coach.weeklySlots} sloter booket
                      </span>
                    </div>
                    <span className="text-lg font-bold text-[var(--hg-text)] tabular-nums">
                      {Math.round(coach.occupancy * 100)}%
                    </span>
                  </div>
                  <HGCapacityBar
                    current={coach.bookedSlots}
                    max={coach.weeklySlots}
                    showPercentage={false}
                  />
                  <div className="flex items-center justify-between mt-3 text-xs text-[var(--hg-text-muted)]">
                    <span>{formatKr(coach.weeklyRevenue)} inntekt</span>
                    <span>
                      {coach.weeklySlots - coach.bookedSlots} ledige sloter
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Daily Breakdown */}
            <div className="mt-6 pt-6 border-t border-[var(--hg-border)]">
              <h4 className="text-sm font-medium text-[var(--hg-text)] mb-4">
                Daglig oversikt
              </h4>
              <div className="flex items-end gap-2 h-24">
                {dailyBreakdown.map((day, i) => {
                  const totalSlots = Object.values(day.coaches).reduce(
                    (s, c) => s + c.total,
                    0
                  );
                  const bookedSlots = Object.values(day.coaches).reduce(
                    (s, c) => s + c.booked,
                    0
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
                          className="w-8 bg-[var(--hg-primary)] rounded-t transition-all"
                          style={{ height: `${(pct / 100) * 80}px` }}
                        />
                      </div>
                      <span className="text-[10px] text-[var(--hg-text-muted)] capitalize">
                        {day.day.slice(0, 3)}
                      </span>
                      <span className="text-[10px] text-[var(--hg-text-muted)] tabular-nums">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Empty Slots */}
          <div className="hg-card p-4">
            <h3 className="hg-section-title mb-4">Ledige sloter</h3>
            <p className="text-xs text-[var(--hg-text-muted)] mb-3">
              Ledige tider denne uken som kan fylles
            </p>
            <div className="space-y-2">
              {emptySlotsList.length === 0 ? (
                <p className="text-sm text-[var(--hg-text-muted)] py-4 text-center">
                  Ingen ledige sloter denne uken
                </p>
              ) : (
                emptySlotsList.slice(0, 8).map((slot, i) => (
                  <div
                    key={i}
                    className="p-3 bg-[var(--hg-surface-raised)] rounded-lg flex items-center justify-between hover:bg-[var(--hg-border)] transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="text-sm font-medium text-[var(--hg-text)] capitalize">
                        {slot.day}
                      </div>
                      <div className="text-xs text-[var(--hg-text-muted)]">
                        {slot.coach} — {slot.free}{" "}
                        {slot.free === 1 ? "ledig slot" : "ledige sloter"}
                      </div>
                    </div>
                    <button className="p-1.5 rounded-md hover:bg-[var(--hg-surface)] text-[var(--hg-primary)]">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            {emptySlotsList.length > 8 && (
              <p className="text-xs text-[var(--hg-text-muted)] mt-2 text-center">
                + {emptySlotsList.length - 8} flere
              </p>
            )}
          </div>
        </div>

        {/* AI Recommendations (statisk foreløpig) */}
        <div className="hg-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[var(--hg-primary)]" />
            <h3 className="hg-section-title">AI-anbefalinger</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.title}
                className="p-4 bg-[var(--hg-surface-raised)] rounded-lg border border-[var(--hg-border)] hover:border-[var(--hg-border-hover)] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-[var(--hg-text)]">
                    {rec.title}
                  </h4>
                  <span className="text-xs font-medium text-[var(--hg-success)] bg-[var(--hg-success-bg)] px-1.5 py-0.5 rounded">
                    {rec.confidence}% sikkert
                  </span>
                </div>
                <p className="text-xs text-[var(--hg-text-secondary)] mb-3 leading-relaxed">
                  {rec.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--hg-border)]">
                  <span className="text-sm font-bold text-[var(--hg-primary)]">
                    {rec.impact}
                  </span>
                  <button className="text-xs text-[var(--hg-primary)] hover:underline">
                    Implementer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly summary */}
        <div className="hg-card p-4">
          <h3 className="hg-section-title mb-3">
            Denne måneden ({data.monthRange.from} – {data.monthRange.to})
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-[var(--hg-text-muted)]">Inntekt</p>
              <p className="text-lg font-bold text-[var(--hg-text)] tabular-nums">
                {formatKr(data.monthlyTotal.revenue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--hg-text-muted)]">
                Maks potensiell
              </p>
              <p className="text-lg font-bold text-[var(--hg-text)] tabular-nums">
                {formatKr(data.monthlyTotal.maxRevenue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--hg-text-muted)]">Bookinger</p>
              <p className="text-lg font-bold text-[var(--hg-text)] tabular-nums">
                {data.monthlyTotal.bookedCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
