"use client";

import { useEffect, useState } from "react";
import { BarChart3, Info, TrendingDown, Lightbulb, Target, Calendar, Award, ChevronRight } from "lucide-react";
import { PORTAL_CONTENT } from "@/lib/website-constants";
import { BentoGrid } from "@/components/portal/apple/bento-grid";
import { BentoCard } from "@/components/portal/apple/bento-card";
import { StatCard } from "@/components/portal/apple/stat-card";
import { AppleCard } from "@/components/portal/apple/apple-card";
import { AppleBadge } from "@/components/portal/apple/apple-badge";
import { AppleButton } from "@/components/portal/apple/apple-button";

export default function StatistikkPage() {
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const periods = ["7 dager", "30 dager", "90 dager", "1 ar"];

  // Demo data for visualization
  const currentHandicap = 12.4;
  const handicapTrend = -0.6;

  const sgData = {
    teeTotal: 0.8,
    approach: -0.3,
    naerspill: 0.2,
    putting: -0.1,
  };

  const focusAreas = [
    { name: "Putting", percent: 35, color: "bg-[var(--color-grey-900)]" },
    { name: "Naerspill", percent: 28, color: "bg-blue-500" },
    { name: "Approach", percent: 22, color: "bg-green-500" },
    { name: "Tee Total", percent: 15, color: "bg-purple-500" },
  ];

  const recentRounds = [
    { date: "24", month: "Mar", course: "Gamle Fredrikstad GK", par: 72, score: 78, diff: "+6" },
    { date: "18", month: "Mar", course: "Sarpsborg GK", par: 71, score: 74, diff: "+3" },
    { date: "12", month: "Mar", course: "Gamle Fredrikstad GK", par: 72, score: 76, diff: "+4" },
  ];

  return (
    <div className="apple-light-bg min-h-screen -m-6 -mt-4 p-8">
      {/* Page Header */}
      <div className="max-w-[1200px] mx-auto mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-[var(--apple-gray-950)] tracking-[-0.02em] mb-1">
              Statistikk
            </h1>
            <p className="text-[15px] text-[var(--color-grey-500)]">
              Folg utviklingen din over tid
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 shadow-sm">
            {periods.map((period, idx) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(idx)}
                className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                  idx === selectedPeriod
                    ? "bg-white text-[var(--color-grey-900)] shadow-sm"
                    : "text-[var(--color-grey-500)] hover:text-[var(--color-grey-700)]"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Hero Section */}
      <div className="max-w-[1200px] mx-auto mb-8">
        <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
          <StatCard
            label="Handicap"
            value={currentHandicap.toFixed(1)}
            trend={handicapTrend}
            icon={Target}
            iconColor="text-[var(--color-grey-900)]"
            iconBg="bg-[var(--color-grey-100)]"
          />
          <StatCard
            label="Runder"
            value="12"
            trend={3}
            trendLabel="denne mnd"
            icon={Calendar}
            iconColor="text-blue-500"
            iconBg="bg-blue-50"
          />
          <StatCard
            label="Beste score"
            value="71"
            trendLabel="-1 fra par"
            icon={Award}
            iconColor="text-green-500"
            iconBg="bg-green-50"
          />
          <StatCard
            label="Trenings-timer"
            value="12.5"
            trend={2.5}
            trendLabel="timer"
            icon={BarChart3}
            iconColor="text-purple-500"
            iconBg="bg-purple-50"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-[1200px] mx-auto">
        <BentoGrid gap="md">
          {/* Handicap Chart - Wide */}
          <BentoCard
            span={8}
            title="Handicap-utvikling"
            icon={TrendingDown}
            iconColor="text-green-500"
            action={
              <AppleBadge variant="success" size="sm" dot>
                {handicapTrend} siste 30 dager
              </AppleBadge>
            }
          >
            <div className="h-[200px] flex items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-grey-100)] to-white border border-[var(--color-grey-100)]">
              <div className="text-center text-[var(--color-grey-400)]">
                <TrendingDown className="w-10 h-10 mx-auto mb-3 text-green-400" />
                <p className="text-sm font-medium">Handicap-graf</p>
                <p className="text-xs mt-1">Viser trend over valgt periode</p>
              </div>
            </div>
          </BentoCard>

          {/* Recent Rounds - Narrow */}
          <BentoCard
            span={4}
            title="Siste runder"
            action={
              <button className="text-[13px] font-medium text-[var(--color-grey-900)] flex items-center gap-1 hover:text-[var(--color-grey-900)] transition-colors">
                Se alle
                <ChevronRight className="w-4 h-4" />
              </button>
            }
          >
            <div className="space-y-3">
              {recentRounds.map((round, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-grey-100)] hover:bg-[var(--color-grey-100)] transition-colors cursor-pointer"
                >
                  <div className="w-11 h-11 bg-white rounded-xl flex flex-col items-center justify-center shadow-sm flex-shrink-0">
                    <span className="text-[15px] font-bold text-[var(--color-grey-900)] leading-none">{round.date}</span>
                    <span className="text-[10px] font-semibold text-[var(--color-grey-500)] uppercase">{round.month}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[var(--color-grey-900)] truncate">{round.course}</p>
                    <p className="text-[11px] text-[var(--color-grey-500)]">Par {round.par}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[var(--apple-gray-950)]">{round.score}</p>
                    <p className={`text-[11px] font-medium ${
                      parseInt(round.diff) > 0 ? "text-red-500" : "text-green-500"
                    }`}>{round.diff}</p>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Strokes Gained Radar */}
          <BentoCard
            span={6}
            title="Strokes Gained"
            icon={Target}
            action={
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--color-grey-400)] hover:bg-[var(--color-grey-100)] transition-colors">
                <Info className="w-4 h-4" />
              </button>
            }
          >
            <div className="flex gap-6">
              {/* Radar placeholder */}
              <div className="w-[160px] h-[160px] rounded-full bg-gradient-to-br from-[var(--color-grey-100)] to-white border-2 border-[var(--color-grey-100)] flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-[var(--color-grey-400)]">SG Radar</span>
              </div>

              {/* SG Stats */}
              <div className="flex-1 grid grid-cols-2 gap-3">
                {[
                  { label: "Tee Total", value: sgData.teeTotal, positive: true },
                  { label: "Approach", value: sgData.approach, positive: false },
                  { label: "Naerspill", value: sgData.naerspill, positive: true },
                  { label: "Putting", value: sgData.putting, positive: false },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-3 rounded-xl bg-[var(--color-grey-100)] text-center"
                  >
                    <p className="text-[11px] font-medium text-[var(--color-grey-500)] mb-1">{stat.label}</p>
                    <p className={`text-lg font-bold ${
                      stat.positive ? "text-green-500" : "text-red-500"
                    }`}>
                      {stat.positive && "+"}{stat.value.toFixed(1)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* Training Volume */}
          <BentoCard
            span={6}
            title="Treningsvolum"
            icon={BarChart3}
            iconColor="text-purple-500"
          >
            <div className="h-[140px] flex items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-grey-100)] to-white border border-[var(--color-grey-100)] mb-4">
              <div className="text-center text-[var(--color-grey-400)]">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <p className="text-sm font-medium">Ukentlig treningsvolum</p>
              </div>
            </div>
            <div className="flex justify-between pt-4 border-t border-[var(--color-grey-100)]">
              <div>
                <p className="text-[11px] font-medium text-[var(--color-grey-500)]">Totalt denne mnd</p>
                <p className="text-lg font-bold text-[var(--apple-gray-950)]">12 timer 30 min</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-medium text-[var(--color-grey-500)]">Snitt per uke</p>
                <p className="text-lg font-bold text-[var(--apple-gray-950)]">3 timer 8 min</p>
              </div>
            </div>
          </BentoCard>

          {/* Focus Area Distribution - Full Width */}
          <BentoCard
            span={12}
            title="Fokusomrade-fordeling"
            icon={Target}
            iconColor="text-[var(--color-grey-900)]"
          >
            <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2">
              {focusAreas.map((area) => (
                <div key={area.name} className="text-center">
                  <div className="h-[100px] rounded-xl bg-[var(--color-grey-100)] relative overflow-hidden mb-3">
                    <div
                      className={`absolute bottom-0 left-0 right-0 ${area.color} transition-all duration-500 rounded-b-xl`}
                      style={{ height: `${area.percent}%` }}
                    />
                  </div>
                  <p className="text-[13px] font-semibold text-[var(--color-grey-900)]">{area.name}</p>
                  <p className="text-xs text-[var(--color-grey-500)]">{area.percent}%</p>
                </div>
              ))}
            </div>

            {/* AI Recommendation */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-amber-900 mb-1">AI-anbefaling</p>
                  <p className="text-[13px] text-amber-700">
                    Basert pa SG-data bor du oke fokus pa Approach-trening. Du taper mest slag pa innspill til green.
                  </p>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* SG Explanation */}
          <BentoCard span={12} variant="solid" hover={false}>
            <details className="group">
              <summary className="flex items-center gap-3 cursor-pointer list-none">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-grey-100)] flex items-center justify-center">
                  <Info className="w-5 h-5 text-[var(--color-grey-900)]" />
                </div>
                <span className="text-[15px] font-semibold text-[var(--color-grey-900)]">
                  Hva er Strokes Gained?
                </span>
                <ChevronRight className="w-5 h-5 text-[var(--color-grey-400)] ml-auto transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 pt-4 border-t border-[var(--color-grey-100)]">
                <p className="text-[14px] text-[var(--color-grey-600)] mb-4 leading-relaxed">
                  {PORTAL_CONTENT.statistikk.sgExplanation.intro}
                </p>
                <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
                  {PORTAL_CONTENT.statistikk.sgExplanation.categories.map((cat) => (
                    <div key={cat.key} className="flex gap-3 p-3 rounded-xl bg-[var(--color-grey-100)]">
                      <AppleBadge variant="dark" size="sm">{cat.key}</AppleBadge>
                      <span className="text-[13px] text-[var(--color-grey-600)]">{cat.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          </BentoCard>
        </BentoGrid>
      </div>
    </div>
  );
}
