"use client";

import { useState } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Trophy, Calendar, CheckCircle2, MapPin, Clock,
  ExternalLink, Target, Flag, ChevronRight,
} from "lucide-react";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { NumberTicker } from "@/components/portal/dashboard/number-ticker";
import type { PortalTournament, TournamentStats } from "./actions";

// ── Helpers ─────────────────────────────────────────────────

function getPeriodLabel(date: Date): string {
  const month = date.getMonth();
  if (month >= 3 && month <= 5) return "Forberedelse";
  if (month >= 6 && month <= 8) return "Konkurransesesong";
  if (month >= 9 && month <= 10) return "Restitusjon";
  return "Vintertrening";
}

function getLevelColor(level: string): string {
  switch (level.toLowerCase()) {
    case "major":
    case "nasjonal":
      return "bg-[#0A1F18]/10 text-[#0A1F18]";
    case "regional":
      return "bg-[#EFF6FF] text-[#1E40AF]";
    default:
      return "bg-[#F5F8F7] text-[#324D45]";
  }
}

// ── Types ───────────────────────────────────────────────────

type TabKey = "kommende" | "pameldt" | "resultater";

// ── Component ───────────────────────────────────────────────

interface Props {
  tournaments: PortalTournament[];
  stats: TournamentStats;
}

export function TurneringsplanClient({ tournaments, stats }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("kommende");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const registered = tournaments.filter((t) => t.isRegistered);

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "kommende", label: "Kommende", count: stats.upcoming },
    { key: "pameldt", label: "Påmeldt", count: stats.registered },
    { key: "resultater", label: "Resultater", count: stats.completed },
  ];

  const displayList =
    activeTab === "pameldt"
      ? registered
      : activeTab === "resultater"
        ? [] // Resultater er historisk — ikke tilgjengelig i denne dataen ennå
        : tournaments;

  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 pb-12 pt-8">

      {/* ═══ HEADER ═══ */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7A8C85]">
          Sesong 2026
        </p>
        <h1 className="mt-1 text-[28px] font-bold tracking-tight text-[#0A1F18]">
          Turneringsplan
        </h1>
      </div>

      {/* ═══ STAT-KORT ═══ */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <PremiumCard delay={0} >
          <div className="flex flex-col items-center py-2 text-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7A8C85]">
              Kommende
            </span>
            <span className="mt-1.5 text-3xl font-extrabold tracking-tight text-[#0A1F18] tabular-nums">
              <NumberTicker value={stats.upcoming} />
            </span>
            <Target className="mt-2 h-4 w-4 text-[#7A8C85]" />
          </div>
        </PremiumCard>

        <PremiumCard delay={0.06}>
          <div className="flex flex-col items-center py-2 text-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7A8C85]">
              Påmeldt
            </span>
            <span className="mt-1.5 text-3xl font-extrabold tracking-tight text-[#0A1F18] tabular-nums">
              <NumberTicker value={stats.registered} />
            </span>
            <CheckCircle2 className="mt-2 h-4 w-4 text-[#7A8C85]" />
          </div>
        </PremiumCard>

        <PremiumCard delay={0.12}>
          <div className="flex flex-col items-center py-2 text-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7A8C85]">
              Fullført
            </span>
            <span className="mt-1.5 text-3xl font-extrabold tracking-tight text-[#0A1F18] tabular-nums">
              <NumberTicker value={stats.completed} />
            </span>
            <Flag className="mt-2 h-4 w-4 text-[#7A8C85]" />
          </div>
        </PremiumCard>
      </div>

      {/* ═══ TABS ═══ */}
      <div className="mb-5 flex gap-1.5 rounded-[10px] bg-[#F5F8F7] p-[3px]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-[7px] px-4 py-[7px] text-[13px] font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-[#0A1F18] text-white shadow-[0_2px_8px_rgba(10,31,24,0.3)]"
                : "text-[#7A8C85] hover:text-[#324D45]"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 tabular-nums">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* ═══ TURNERINGSLISTE ═══ */}
      {activeTab === "resultater" && stats.completed === 0 && (
        <PremiumCard delay={0}>
          <div className="flex flex-col items-center py-12 text-center">
            <Trophy className="mb-3 h-8 w-8 text-[#7A8C85] opacity-40" />
            <p className="text-sm font-medium text-[#324D45]">
              Ingen resultater ennå
            </p>
            <p className="mt-1 text-xs text-[#7A8C85]">
              Resultater vises her etter gjennomførte turneringer
            </p>
          </div>
        </PremiumCard>
      )}

      {activeTab === "resultater" && stats.completed > 0 && (
        <PremiumCard delay={0}>
          <div className="flex flex-col items-center py-12 text-center">
            <Trophy className="mb-3 h-8 w-8 text-[#0A1F18] opacity-60" />
            <p className="text-sm font-medium text-[#324D45]">
              {stats.completed} fullførte turneringer
            </p>
            <p className="mt-1 text-xs text-[#7A8C85]">
              Detaljert resultatoversikt kommer snart
            </p>
          </div>
        </PremiumCard>
      )}

      {activeTab !== "resultater" && displayList.length === 0 && (
        <PremiumCard delay={0}>
          <div className="flex flex-col items-center py-12 text-center">
            <Calendar className="mb-3 h-8 w-8 text-[#7A8C85] opacity-40" />
            <p className="text-sm font-medium text-[#324D45]">
              {activeTab === "pameldt"
                ? "Du er ikke påmeldt noen turneringer"
                : "Ingen kommende turneringer"}
            </p>
            <p className="mt-1 text-xs text-[#7A8C85]">
              {activeTab === "pameldt"
                ? "Meld deg på fra listen over kommende turneringer"
                : "Nye turneringer legges til fortløpende"}
            </p>
          </div>
        </PremiumCard>
      )}

      {activeTab !== "resultater" && displayList.length > 0 && (
        <div className="space-y-3">
          {displayList.map((t, i) => {
            const isExpanded = expandedId === t.id;
            const tournamentDate = new Date(t.startDate);

            return (
              <PremiumCard key={t.id} delay={i * 0.03} className="p-0">
                {/* Kort-header — klikk for å utvide */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : t.id)}
                  className="flex w-full items-start gap-4 p-5 text-left"
                >
                  {/* Dato-blokk */}
                  <div className="flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-[#F5F8F7]">
                    <span className="text-[10px] font-semibold uppercase leading-none text-[#7A8C85]">
                      {format(tournamentDate, "MMM", { locale: nb })}
                    </span>
                    <span className="text-lg font-bold leading-tight text-[#0A1F18] tabular-nums">
                      {format(tournamentDate, "d")}
                    </span>
                  </div>

                  {/* Innhold */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-[14px] font-semibold text-[#0A1F18]">
                        {t.name}
                      </h3>
                      {t.isRegistered && (
                        <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-[#E8F5EF] px-2 py-0.5 text-[10px] font-semibold text-[#1A4D36]">
                          <CheckCircle2 className="h-3 w-3" />
                          Påmeldt
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[#7A8C85]">
                      {(t.course ?? t.location) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {t.course ?? t.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(tournamentDate, "EEEE d. MMMM", { locale: nb })}
                      </span>
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${getLevelColor(t.level)}`}>
                        {t.level}
                      </span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <ChevronRight
                    className={`h-4 w-4 flex-shrink-0 text-[#7A8C85] transition-transform duration-200 ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {/* Utvidet detaljer */}
                {isExpanded && (
                  <div className="border-t border-[#D5DFDB] px-5 pb-5 pt-4">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7A8C85]">
                          Periode
                        </span>
                        <p className="mt-0.5 text-sm font-medium text-[#0A1F18]">
                          {getPeriodLabel(tournamentDate)}
                        </p>
                      </div>
                      {t.numberOfHoles && (
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7A8C85]">
                            Hull
                          </span>
                          <p className="mt-0.5 text-sm font-medium text-[#0A1F18]">
                            {t.numberOfHoles}
                          </p>
                        </div>
                      )}
                      {t.series && (
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7A8C85]">
                            Serie
                          </span>
                          <p className="mt-0.5 text-sm font-medium text-[#0A1F18]">
                            {t.series}
                          </p>
                        </div>
                      )}
                      {t.planLevel && (
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7A8C85]">
                            Prioritet
                          </span>
                          <p className="mt-0.5 text-sm font-medium text-[#0A1F18]">
                            {t.planLevel}
                          </p>
                        </div>
                      )}
                    </div>

                    {t.goalType && (
                      <div className="mt-3">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7A8C85]">
                          Mål
                        </span>
                        <p className="mt-0.5 text-sm text-[#324D45]">
                          {t.goalType}
                        </p>
                      </div>
                    )}

                    {t.planNotes && (
                      <div className="mt-3">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7A8C85]">
                          Notater
                        </span>
                        <p className="mt-0.5 text-sm italic text-[#324D45]">
                          {t.planNotes}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 flex items-center gap-3">
                      {!t.isRegistered && (
                        <button className="inline-flex items-center gap-1.5 rounded-full bg-[#D1F843] px-4 py-2 text-[12px] font-bold text-[#0A1F18] transition-opacity hover:opacity-85">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Meld meg på
                        </button>
                      )}
                      {t.externalUrl && (
                        <a
                          href={t.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#D5DFDB] bg-white px-4 py-2 text-[12px] font-medium text-[#324D45] transition-colors hover:border-[#A5B2AD]"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Se turnering
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </PremiumCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
