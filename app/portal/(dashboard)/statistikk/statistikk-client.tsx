"use client";

import { useState } from "react";
import { BarChart3, Info, TrendingDown, Lightbulb, Target, Calendar, Award, ChevronRight } from "lucide-react";
import { PORTAL_CONTENT } from "@/lib/website-constants";
import { BentoGrid } from "@/components/portal/apple/bento-grid";
import { BentoCard } from "@/components/portal/apple/bento-card";
import { StatCard } from "@/components/portal/apple/stat-card";
import { AppleBadge } from "@/components/portal/apple/apple-badge";

interface FocusArea {
  name: string;
  percent: number;
  color: string;
}

interface Round {
  date: string;
  month: string;
  course: string;
  par: number;
  score: number;
  diff: string;
}

interface SGData {
  teeTotal: number;
  approach: number;
  naerspill: number;
  putting: number;
}

interface StatistikkClientProps {
  currentHandicap: number | null;
  handicapTrend: number;
  sgData: SGData;
  focusAreas: FocusArea[];
  recentRounds: Round[];
  roundsCount: number;
  bestScore: number | null;
  totalHours: number;
  weakestAreaName: string | null;
}

export function StatistikkClient({
  currentHandicap,
  handicapTrend,
  sgData,
  focusAreas,
  recentRounds,
  roundsCount,
  bestScore,
  totalHours,
  weakestAreaName,
}: StatistikkClientProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const periods = ["7 dager", "30 dager", "90 dager", "1 år"];

  return (
    <div className="apple-light-bg min-h-screen -m-6 -mt-4 p-8">
      {/* Page Header */}
      <div className="max-w-[1200px] mx-auto mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-[var(--apple-gray-950)] tracking-[-0.02em] mb-1">
              Statistikk
            </h1>
            <p className="text-[15px] text-[var(--apple-gray-500)]">
              Følg utviklingen din over tid
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
                    ? "bg-white text-[var(--apple-gray-900)] shadow-sm"
                    : "text-[var(--apple-gray-500)] hover:text-[var(--apple-gray-700)]"
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
            value={currentHandicap?.toFixed(1) ?? "-"}
            trend={handicapTrend}
            icon={Target}
            iconColor="text-[var(--apple-gold-500)]"
            iconBg="bg-[var(--apple-gold-50)]"
          />
          <StatCard
            label="Runder"
            value={String(roundsCount)}
            icon={Calendar}
            iconColor="text-blue-500"
            iconBg="bg-blue-50"
          />
          <StatCard
            label="Beste score"
            value={bestScore ? String(bestScore) : "-"}
            icon={Award}
            iconColor="text-green-500"
            iconBg="bg-green-50"
          />
          <StatCard
            label="Trenings-timer"
            value={String(totalHours)}
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
              handicapTrend !== 0 ? (
                <AppleBadge variant={handicapTrend > 0 ? "success" : "warning"} size="sm" dot>
                  {handicapTrend > 0 ? "-" : "+"}{Math.abs(handicapTrend).toFixed(1)} siste 30 dager
                </AppleBadge>
              ) : undefined
            }
          >
            <div className="h-[200px] flex items-center justify-center rounded-xl bg-gradient-to-br from-[var(--apple-gray-50)] to-white border border-[var(--apple-gray-100)]">
              <div className="text-center text-[var(--apple-gray-400)]">
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
              <button className="text-[13px] font-medium text-[var(--apple-gold-600)] flex items-center gap-1 hover:text-[var(--apple-gold-700)] transition-colors">
                Se alle
                <ChevronRight className="w-4 h-4" />
              </button>
            }
          >
            <div className="space-y-3">
              {recentRounds.length > 0 ? recentRounds.map((round, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[var(--apple-gray-50)] hover:bg-[var(--apple-gray-100)] transition-colors cursor-pointer"
                >
                  <div className="w-11 h-11 bg-white rounded-xl flex flex-col items-center justify-center shadow-sm flex-shrink-0">
                    <span className="text-[15px] font-bold text-[var(--apple-gray-900)] leading-none">{round.date}</span>
                    <span className="text-[10px] font-semibold text-[var(--apple-gray-500)] uppercase">{round.month}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[var(--apple-gray-900)] truncate">{round.course}</p>
                    <p className="text-[11px] text-[var(--apple-gray-500)]">Par {round.par}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[var(--apple-gray-950)]">{round.score}</p>
                    <p className={`text-[11px] font-medium ${
                      parseInt(round.diff) > 0 ? "text-red-500" : "text-green-500"
                    }`}>{round.diff}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-[var(--apple-gray-500)] text-center py-4">
                  Ingen runder registrert
                </p>
              )}
            </div>
          </BentoCard>

          {/* Strokes Gained Radar */}
          <BentoCard
            span={6}
            title="Strokes Gained"
            icon={Target}
            action={
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--apple-gray-400)] hover:bg-[var(--apple-gray-100)] transition-colors">
                <Info className="w-4 h-4" />
              </button>
            }
          >
            <div className="flex gap-6">
              <div className="w-[160px] h-[160px] rounded-full bg-gradient-to-br from-[var(--apple-gray-50)] to-white border-2 border-[var(--apple-gray-100)] flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-[var(--apple-gray-400)]">SG Radar</span>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                {[
                  { label: "Tee Total", value: sgData.teeTotal },
                  { label: "Approach", value: sgData.approach },
                  { label: "Nærespill", value: sgData.naerspill },
                  { label: "Putting", value: sgData.putting },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 rounded-xl bg-[var(--apple-gray-50)] text-center">
                    <p className="text-[11px] font-medium text-[var(--apple-gray-500)] mb-1">{stat.label}</p>
                    <p className={`text-lg font-bold ${
                      stat.value === 0 ? "text-[var(--apple-gray-400)]" : stat.value >= 0 ? "text-green-500" : "text-red-500"
                    }`}>
                      {stat.value === 0 ? "-" : (stat.value >= 0 ? "+" : "")}{stat.value.toFixed(1)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* Training Volume */}
          <BentoCard span={6} title="Treningsvolum" icon={BarChart3} iconColor="text-purple-500">
            <div className="h-[140px] flex items-center justify-center rounded-xl bg-gradient-to-br from-[var(--apple-gray-50)] to-white border border-[var(--apple-gray-100)] mb-4">
              <div className="text-center text-[var(--apple-gray-400)]">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <p className="text-sm font-medium">Ukentlig treningsvolum</p>
              </div>
            </div>
            <div className="flex justify-between pt-4 border-t border-[var(--apple-gray-100)]">
              <div>
                <p className="text-[11px] font-medium text-[var(--apple-gray-500)]">Totalt denne mnd</p>
                <p className="text-lg font-bold text-[var(--apple-gray-950)]">{totalHours} timer</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-medium text-[var(--apple-gray-500)]">Snitt per uke</p>
                <p className="text-lg font-bold text-[var(--apple-gray-950)]">{Math.round(totalHours / 4)} timer</p>
              </div>
            </div>
          </BentoCard>

          {/* Focus Area Distribution */}
          <BentoCard span={12} title="Fokusområde-fordeling" icon={Target} iconColor="text-[var(--apple-gold-500)]">
            <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2">
              {focusAreas.map((area) => (
                <div key={area.name} className="text-center">
                  <div className="h-[100px] rounded-xl bg-[var(--apple-gray-50)] relative overflow-hidden mb-3">
                    <div className={`absolute bottom-0 left-0 right-0 ${area.color} transition-all duration-500 rounded-b-xl`} style={{ height: `${area.percent}%` }} />
                  </div>
                  <p className="text-[13px] font-semibold text-[var(--apple-gray-900)]">{area.name}</p>
                  <p className="text-xs text-[var(--apple-gray-500)]">{area.percent}%</p>
                </div>
              ))}
            </div>
            {weakestAreaName && (
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-amber-900 mb-1">AI-anbefaling</p>
                    <p className="text-[13px] text-amber-700">Basert på SG-data bør du øke fokus på {weakestAreaName}-trening.</p>
                  </div>
                </div>
              </div>
            )}
          </BentoCard>

          {/* SG Explanation */}
          <BentoCard span={12} variant="solid" hover={false}>
            <details className="group">
              <summary className="flex items-center gap-3 cursor-pointer list-none">
                <div className="w-10 h-10 rounded-xl bg-[var(--apple-gold-50)] flex items-center justify-center">
                  <Info className="w-5 h-5 text-[var(--apple-gold-500)]" />
                </div>
                <span className="text-[15px] font-semibold text-[var(--apple-gray-900)]">Hva er Strokes Gained?</span>
                <ChevronRight className="w-5 h-5 text-[var(--apple-gray-400)] ml-auto transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 pt-4 border-t border-[var(--apple-gray-100)]">
                <p className="text-[14px] text-[var(--apple-gray-600)] mb-4 leading-relaxed">{PORTAL_CONTENT.statistikk.sgExplanation.intro}</p>
                <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
                  {PORTAL_CONTENT.statistikk.sgExplanation.categories.map((cat) => (
                    <div key={cat.key} className="flex gap-3 p-3 rounded-xl bg-[var(--apple-gray-50)]">
                      <AppleBadge variant="gold" size="sm">{cat.key}</AppleBadge>
                      <span className="text-[13px] text-[var(--apple-gray-600)]">{cat.description}</span>
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
