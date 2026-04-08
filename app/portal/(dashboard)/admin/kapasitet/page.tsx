"use client";

import { useState } from "react";
import {
  Gauge,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  Users,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import {
  MCTopbar,
  useMCSidebar,
  HGStatCard,
  HGCapacityBar,
  HGAlert,
} from "@/components/portal/mission-control";

// Mock data
const capacityData = {
  currentWeek: { used: 28, available: 40, percentage: 70 },
  nextWeek: { used: 22, available: 40, percentage: 55 },
  trend: [
    { week: "Uke 14", usage: 75, revenue: 52000 },
    { week: "Uke 15", usage: 68, revenue: 48000 },
    { week: "Uke 16", usage: 70, revenue: 50000 },
    { week: "Uke 17", usage: 55, revenue: 42000 },
  ],
};

const coachCapacity = [
  { name: "Anders Kristiansen", used: 18, available: 24, specialty: "Coaching" },
  { name: "Maria Hansen", used: 10, available: 16, specialty: "Junior" },
];

const recommendations = [
  {
    type: "pricing",
    title: "Øk prisen på ettermiddagstimer",
    description: "Etterspørselen er høyest mellom 16:00-18:00. Vurder å øke prisen med 10-15% i dette tidsrommet.",
    impact: "+8 000 kr/uke",
    confidence: 85,
  },
  {
    type: "availability",
    title: "Legg til flere timer på onsdag",
    description: "Onsdag har kun 50% kapasitetsutnyttelse. Markedsfør spesialtilbud for denne dagen.",
    impact: "+5 000 kr/uke",
    confidence: 72,
  },
  {
    type: "booking",
    title: "Åpne for gruppetimer",
    description: "4 elever har etterspurt gruppetimer. Vurder å tilby dette for å øke kapasiteten.",
    impact: "+12 000 kr/mnd",
    confidence: 90,
  },
];

const emptySlots = [
  { date: "I morgen", time: "09:00", coach: "Anders Kristiansen", duration: "50 min" },
  { date: "I morgen", time: "16:00", coach: "Maria Hansen", duration: "60 min" },
  { date: "Onsdag", time: "14:00", coach: "Anders Kristiansen", duration: "50 min" },
  { date: "Torsdag", time: "10:00", coach: "Maria Hansen", duration: "60 min" },
  { date: "Fredag", time: "15:00", coach: "Anders Kristiansen", duration: "50 min" },
];

export default function KapasitetPage() {
  const { toggle } = useMCSidebar();

  return (
    <>
      <MCTopbar
        title="Kapasitet"
        subtitle="Analyse av kapasitetsutnyttelse og anbefalinger"
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Alert */}
        <HGAlert variant="info">
          <strong>AI-innsikt:</strong> Basert på historiske data kan du øke inntekten med ca. 15% ved å følge anbefalingene nedenfor.
        </HGAlert>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <HGStatCard
            label="Denne uken"
            value={`${capacityData.currentWeek.percentage}%`}
            trend={{ value: 5, direction: "down" }}
            icon={Gauge}
          />
          <HGStatCard
            label="Ledige timer"
            value={capacityData.currentWeek.available - capacityData.currentWeek.used}
            icon={Clock}
          />
          <HGStatCard
            label="Potensiell inntekt"
            value="18 400 kr"
            icon={DollarSign}
            variant="success"
          />
          <HGStatCard
            label="Gj.snitt siste 4 uker"
            value="67%"
            trend={{ value: 3, direction: "up" }}
            icon={TrendingUp}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Coach Capacity */}
          <div className="lg:col-span-2 hg-card p-4">
            <h3 className="hg-section-title mb-4">Kapasitet per coach</h3>
            <div className="space-y-5">
              {coachCapacity.map((coach) => (
                <div key={coach.name} className="p-4 bg-[var(--hg-surface-raised)] rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--hg-text)]">{coach.name}</h4>
                      <span className="text-xs text-[var(--hg-text-muted)]">{coach.specialty}</span>
                    </div>
                    <span className="text-lg font-bold text-[var(--hg-text)] tabular-nums">
                      {Math.round((coach.used / coach.available) * 100)}%
                    </span>
                  </div>
                  <HGCapacityBar
                    current={coach.used}
                    max={coach.available}
                    showPercentage={false}
                  />
                  <div className="flex items-center justify-between mt-3 text-xs text-[var(--hg-text-muted)]">
                    <span>{coach.used} bookinger</span>
                    <span>{coach.available - coach.used} ledige</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Trend Chart */}
            <div className="mt-6 pt-6 border-t border-[var(--hg-border)]">
              <h4 className="text-sm font-medium text-[var(--hg-text)] mb-4">Trend siste 4 uker</h4>
              <div className="flex items-end gap-2 h-24">
                {capacityData.trend.map((week, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="relative w-full flex justify-center">
                      <div
                        className="w-8 bg-[var(--hg-primary)] rounded-t transition-all"
                        style={{ height: `${(week.usage / 100) * 80}px` }}
                      />
                    </div>
                    <span className="text-[10px] text-[var(--hg-text-muted)]">{week.week}</span>
                    <span className="text-[10px] text-[var(--hg-text-muted)] tabular-nums">{week.usage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Empty Slots */}
          <div className="hg-card p-4">
            <h3 className="hg-section-title mb-4">Ledige sloter</h3>
            <p className="text-xs text-[var(--hg-text-muted)] mb-3">
              Disse tidene kan fylles for å øke inntekten
            </p>
            <div className="space-y-2">
              {emptySlots.map((slot, i) => (
                <div
                  key={i}
                  className="p-3 bg-[var(--hg-surface-raised)] rounded-lg flex items-center justify-between hover:bg-[var(--hg-border)] transition-colors cursor-pointer"
                >
                  <div>
                    <div className="text-sm font-medium text-[var(--hg-text)]">
                      {slot.date} {slot.time}
                    </div>
                    <div className="text-xs text-[var(--hg-text-muted)]">
                      {slot.coach} • {slot.duration}
                    </div>
                  </div>
                  <button className="p-1.5 rounded-md hover:bg-[var(--hg-surface)] text-[var(--hg-primary)]">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 hg-btn hg-btn-secondary text-xs">
              Se alle ledige
            </button>
          </div>
        </div>

        {/* AI Recommendations */}
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
                  <h4 className="text-sm font-semibold text-[var(--hg-text)]">{rec.title}</h4>
                  <span className="text-xs font-medium text-[var(--hg-success)] bg-[var(--hg-success-bg)] px-1.5 py-0.5 rounded">
                    {rec.confidence}% sikkert
                  </span>
                </div>
                <p className="text-xs text-[var(--hg-text-secondary)] mb-3 leading-relaxed">
                  {rec.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--hg-border)]">
                  <span className="text-sm font-bold text-[var(--hg-primary)]">{rec.impact}</span>
                  <button className="text-xs text-[var(--hg-primary)] hover:underline">
                    Implementer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
