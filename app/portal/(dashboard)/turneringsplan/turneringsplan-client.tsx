"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { NumberTicker } from "@/components/portal/dashboard/number-ticker";
import { AddTournamentModal } from "@/components/portal/turneringer/add-tournament-modal";
import { registerForTournament, type PortalTournament, type TournamentStats } from "./actions";
import {
  VerticalTimeline,
  MonoLabel,
  type TimelineItem,
} from "@/components/portal/patterns";

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
      return "bg-black/10 text-black";
    case "regional":
      return "bg-blue-50 text-blue-800";
    default:
      return "bg-grey-50 text-grey-400";
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
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  async function handleRegister(tournamentId: string) {
    setRegisteringId(tournamentId);
    try {
      const result = await registerForTournament({ tournamentId });
      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error || "Kunne ikke melde på");
      }
    } catch {
      alert("Kunne ikke melde på");
    } finally {
      setRegisteringId(null);
    }
  }

  const registered = tournaments.filter((t) => t.isRegistered);

  // v3.1 P-06: Timeline for neste 6 turneringer
  const nextTimelineItems: TimelineItem[] = tournaments
    .slice(0, 6)
    .map((t) => {
      const d = new Date(t.startDate);
      const isoDate = `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      const isMajor = t.level?.toLowerCase().includes("major") || t.level?.toLowerCase().includes("nasjonal");
      return {
        id: t.id,
        time: isoDate,
        title: t.name,
        meta: `${t.level?.toUpperCase() ?? "LOKAL"} · ${t.location ?? t.course ?? "TBD"}`,
        dotColor: isMajor ? "lime" : t.isRegistered ? "sage" : "muted",
        active: t.isRegistered,
        href: t.externalUrl ?? undefined,
      };
    });

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
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <MonoLabel size="xs" uppercase className="text-grey-400 block">
            Sesong 2026
          </MonoLabel>
          <h1 className="mt-1 text-[28px] font-bold tracking-tight text-black">
            Turneringsplan
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-[20px] bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-alt"
        >
          <Icon name="add" className="h-4 w-4" />
          Legg til egen turnering
        </button>
      </div>

      <AddTournamentModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={() => window.location.reload()}
      />


      {/* ═══ STAT-KORT ═══ */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <PremiumCard delay={0} >
          <div className="flex flex-col items-center py-2 text-center">
            <MonoLabel size="xs" uppercase className="text-grey-400">Kommende</MonoLabel>
            <span className="mt-1.5 text-3xl font-extrabold tracking-tight text-black tabular-nums">
              <NumberTicker value={stats.upcoming} />
            </span>
            <Icon name="my_location" className="mt-2 h-4 w-4 text-grey-400" />
          </div>
        </PremiumCard>

        <PremiumCard delay={0.06}>
          <div className="flex flex-col items-center py-2 text-center">
            <MonoLabel size="xs" uppercase className="text-grey-400">Påmeldt</MonoLabel>
            <span className="mt-1.5 text-3xl font-extrabold tracking-tight text-black tabular-nums">
              <NumberTicker value={stats.registered} />
            </span>
            <Icon name="check"Circle2 className="mt-2 h-4 w-4 text-grey-400" />
          </div>
        </PremiumCard>

        <PremiumCard delay={0.12}>
          <div className="flex flex-col items-center py-2 text-center">
            <MonoLabel size="xs" uppercase className="text-grey-400">Fullført</MonoLabel>
            <span className="mt-1.5 text-3xl font-extrabold tracking-tight text-black tabular-nums">
              <NumberTicker value={stats.completed} />
            </span>
            <Icon name="flag" className="mt-2 h-4 w-4 text-grey-400" />
          </div>
        </PremiumCard>
      </div>

      {/* ═══ NESTE TURNERINGER (v3.1 timeline) ═══ */}
      {nextTimelineItems.length > 0 && (
        <div className="mb-6 rounded-xl bg-white shadow-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <MonoLabel size="xs" uppercase className="text-grey-400">
              Neste turneringer
            </MonoLabel>
            <MonoLabel size="xs" className="text-grey-400">
              {nextTimelineItems.length} av {tournaments.length}
            </MonoLabel>
          </div>
          <VerticalTimeline items={nextTimelineItems} compact />
        </div>
      )}

      {/* ═══ TABS ═══ */}
      <div className="mb-5 flex gap-1.5 rounded-[10px] bg-grey-50 p-[3px]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-[7px] px-4 py-[7px] text-[13px] font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-black text-white shadow-[0_2px_8px_rgba(10,31,24,0.3)]"
                : "text-grey-400 hover:text-grey-400"
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
            <Icon name="emoji_events" className="mb-3 h-8 w-8 text-grey-400 opacity-40" />
            <p className="text-sm font-medium text-grey-400">
              Ingen resultater ennå
            </p>
            <p className="mt-1 text-xs text-grey-400">
              Resultater vises her etter gjennomførte turneringer
            </p>
          </div>
        </PremiumCard>
      )}

      {activeTab === "resultater" && stats.completed > 0 && (
        <PremiumCard delay={0}>
          <div className="flex flex-col items-center py-12 text-center">
            <Icon name="emoji_events" className="mb-3 h-8 w-8 text-black opacity-60" />
            <p className="text-sm font-medium text-grey-400">
              {stats.completed} fullførte turneringer
            </p>
            <p className="mt-1 text-xs text-grey-400">
              Detaljert resultatoversikt kommer snart
            </p>
          </div>
        </PremiumCard>
      )}

      {activeTab !== "resultater" && displayList.length === 0 && (
        <PremiumCard delay={0}>
          <div className="flex flex-col items-center py-12 text-center">
            <Icon name="calendar_today" className="mb-3 h-8 w-8 text-grey-400 opacity-40" />
            <p className="text-sm font-medium text-grey-400">
              {activeTab === "pameldt"
                ? "Du er ikke påmeldt noen turneringer"
                : "Ingen kommende turneringer"}
            </p>
            <p className="mt-1 text-xs text-grey-400">
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
                  <div className="flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-grey-50">
                    <span className="text-[10px] font-semibold uppercase leading-none text-grey-400">
                      {format(tournamentDate, "MMM", { locale: nb })}
                    </span>
                    <span className="text-lg font-bold leading-tight text-black tabular-nums">
                      {format(tournamentDate, "d")}
                    </span>
                  </div>

                  {/* Innhold */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-[14px] font-semibold text-black">
                        {t.name}
                      </h3>
                      {t.isRegistered && (
                        <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-success-light px-2 py-0.5 text-[10px] font-semibold text-success">
                          <Icon name="check"Circle2 className="h-3 w-3" />
                          Påmeldt
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-grey-400">
                      {(t.course ?? t.location) && (
                        <span className="flex items-center gap-1">
                          <Icon name="location_on" className="h-3 w-3" />
                          {t.course ?? t.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Icon name="calendar_today" className="h-3 w-3" />
                        {format(tournamentDate, "EEEE d. MMMM", { locale: nb })}
                      </span>
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${getLevelColor(t.level)}`}>
                        {t.level}
                      </span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <Icon name="chevron_right"
                    className={`h-4 w-4 flex-shrink-0 text-grey-400 transition-transform duration-200 ${
                      isExpanded ? "rotate-90" : ""
                    }`} />
                </button>

                {/* Utvidet detaljer */}
                {isExpanded && (
                  <div className="border-t border-[grey-200] px-5 pb-5 pt-4">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div>
                        <MonoLabel size="xs" uppercase className="text-grey-400">Periode</MonoLabel>
                        <p className="mt-0.5 text-sm font-medium text-black">
                          {getPeriodLabel(tournamentDate)}
                        </p>
                      </div>
                      {t.numberOfHoles && (
                        <div>
                          <MonoLabel size="xs" uppercase className="text-grey-400">Hull</MonoLabel>
                          <p className="mt-0.5 text-sm font-medium text-black">
                            {t.numberOfHoles}
                          </p>
                        </div>
                      )}
                      {t.series && (
                        <div>
                          <MonoLabel size="xs" uppercase className="text-grey-400">Serie</MonoLabel>
                          <p className="mt-0.5 text-sm font-medium text-black">
                            {t.series}
                          </p>
                        </div>
                      )}
                      {t.planLevel && (
                        <div>
                          <MonoLabel size="xs" uppercase className="text-grey-400">Prioritet</MonoLabel>
                          <p className="mt-0.5 text-sm font-medium text-black">
                            {t.planLevel}
                          </p>
                        </div>
                      )}
                    </div>

                    {t.goalType && (
                      <div className="mt-3">
                        <MonoLabel size="xs" uppercase className="text-grey-400">Mål</MonoLabel>
                        <p className="mt-0.5 text-sm text-grey-400">
                          {t.goalType}
                        </p>
                      </div>
                    )}

                    {t.planNotes && (
                      <div className="mt-3">
                        <MonoLabel size="xs" uppercase className="text-grey-400">Notater</MonoLabel>
                        <p className="mt-0.5 text-sm italic text-grey-400">
                          {t.planNotes}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 flex items-center gap-3">
                      {!t.isRegistered && (
                        <button
                          onClick={() => handleRegister(t.id)}
                          disabled={registeringId === t.id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[accent-cta] px-4 py-2 text-[12px] font-bold text-black transition-opacity hover:opacity-85 disabled:opacity-60"
                        >
                          <Icon name="check"Circle2 className="h-3.5 w-3.5" />
                          {registeringId === t.id ? "Melder på..." : "Meld meg på"}
                        </button>
                      )}
                      {t.externalUrl && (
                        <a
                          href={t.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-[grey-200] bg-white px-4 py-2 text-[12px] font-medium text-grey-400 transition-colors hover:border-[grey-300]"
                        >
                          <Icon name="open_in_new" className="h-3.5 w-3.5" />
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
