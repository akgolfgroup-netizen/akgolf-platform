"use client";

/**
 * Treningsplan-planlegger (Heritage-stil)
 *
 * Autoritativ terminologi: lib/portal/training/ak-taxonomy.ts
 * (speiler masterdokument v2.0 seksjon 3, 4, 9, 10).
 *
 * Layout: ukesgrid + sidebar med 3 faner (Øvelser/Maler/Historikk).
 * Data-kobling i B-1.2, drag-drop i B-1.4.
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { addWeeks, format, startOfWeek } from "date-fns";
import { nb } from "date-fns/locale";
import {
  PYRAMIDE,
  TRENINGSOMRADER,
  OMRADE_GRUPPER,
  L_FASER,
  LIFE_KODER,
} from "@/lib/portal/training/ak-taxonomy";

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 06:00–21:00
const DAYS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
type SidebarTab = "exercises" | "templates" | "history";

interface TreningsplanPlannerProps {
  weekOffset: number;
  planId: string | null;
  sessionCount?: number;
  totalMinutes?: number;
  adherencePct?: number;
}

export function TreningsplanPlanner({
  weekOffset,
  planId,
  sessionCount = 0,
  totalMinutes = 0,
  adherencePct = 0,
}: TreningsplanPlannerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<SidebarTab>("exercises");

  // Uke-navigasjon
  const baseMonday = startOfWeek(new Date(), { weekStartsOn: 1 });
  const currentMonday = addWeeks(baseMonday, weekOffset);
  const weekDates = DAYS.map((_, i) => {
    const d = new Date(currentMonday);
    d.setDate(d.getDate() + i);
    return d;
  });
  const weekLabel = `${format(weekDates[0], "d.", { locale: nb })}–${format(
    weekDates[6],
    "d. MMMM",
    { locale: nb }
  )}`;
  const weekNumber = format(currentMonday, "I");

  const changeWeek = (delta: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("week", String(weekOffset + delta));
    router.push(`/portal/treningsplan?${params.toString()}`);
  };

  const totalHours = Math.floor(totalMinutes / 60);
  const remMinutes = totalMinutes % 60;

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary/50">
              Uke {weekNumber}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-primary">
              Treningsplan
            </h1>
          </div>
          <div className="hidden h-10 w-px bg-outline-variant sm:block" />
          <div className="hidden items-center gap-2 rounded-full bg-surface-container px-3 py-1 sm:flex">
            <button
              onClick={() => changeWeek(-1)}
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-surface-container-high"
              aria-label="Forrige uke"
            >
              <Icon name="chevron_left" size={16} className="text-primary" />
            </button>
            <span className="font-mono text-[11px] uppercase tracking-tighter text-on-surface-variant">
              {weekLabel}
            </span>
            <button
              onClick={() => changeWeek(1)}
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-surface-container-high"
              aria-label="Neste uke"
            >
              <Icon name="chevron_right" size={16} className="text-primary" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            disabled
            className="flex items-center gap-2 rounded-lg border border-outline-variant px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-primary/50 opacity-50"
            title="Kommer i B-1.6"
          >
            <Icon name="content_copy" size={14} />
            Kopier uke
          </button>
          <button
            disabled
            className="flex items-center gap-2 rounded-lg bg-secondary-fixed px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-primary opacity-50"
            title="Kommer i B-1.2"
          >
            <Icon name="add" size={14} />
            Ny økt
          </button>
        </div>
      </header>

      {/* Hovedgrid: ukes-scheduler + sidebar */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-0 lg:col-span-9">
          <WeekGrid weekDates={weekDates} />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <PlannerSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Stats-stripe */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant/10 pt-6">
        <div className="flex gap-8">
          <Stat label="Økter" value={String(sessionCount)} />
          <Stat label="Total tid" value={`${totalHours}t ${remMinutes}m`} />
          <Stat label="Plan-adherence" value={`${adherencePct}%`} />
        </div>
        <div className="flex items-center gap-3">
          {planId ? (
            <Link
              href={`/portal/treningsplan?view=viewer&week=${weekOffset}`}
              className="font-mono text-[11px] uppercase tracking-widest text-primary/60 hover:text-primary"
            >
              Vis som liste →
            </Link>
          ) : (
            <span className="font-mono text-[11px] uppercase tracking-widest text-primary/40">
              Ingen aktiv plan
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Ukes-grid ── */

function WeekGrid({ weekDates }: { weekDates: Date[] }) {
  const today = new Date();
  const todayISO = format(today, "yyyy-MM-dd");

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px]">
        {/* Dagsheader */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-outline-variant/10">
          <div className="border-r border-outline-variant/10 py-3" />
          {weekDates.map((d, i) => {
            const dateISO = format(d, "yyyy-MM-dd");
            const isToday = dateISO === todayISO;
            return (
              <div
                key={i}
                className={`flex flex-col items-center gap-1 border-r border-outline-variant/10 py-3 ${
                  isToday ? "bg-secondary-fixed/10" : ""
                }`}
              >
                <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                  {DAYS[i]}
                </span>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    isToday ? "bg-primary text-white" : "text-primary"
                  }`}
                >
                  {format(d, "d")}
                </span>
              </div>
            );
          })}
        </div>

        {/* Time-rader */}
        <div>
          {HOURS.map((h) => (
            <div
              key={h}
              className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-outline-variant/5"
            >
              <div className="flex items-start justify-end border-r border-outline-variant/10 pr-2 pt-1">
                <span className="font-mono text-[10px] uppercase tracking-tight text-on-surface-variant">
                  {String(h).padStart(2, "0")}:00
                </span>
              </div>
              {weekDates.map((_, dayIndex) => (
                <div
                  key={dayIndex}
                  className="h-14 cursor-pointer border-r border-outline-variant/5 transition-colors hover:bg-surface-container/60"
                  title="Klikk for å opprette økt (kommer i B-1.2)"
                />
              ))}
            </div>
          ))}
        </div>

        {/* Tom state overlay */}
        <div className="px-8 py-12 text-center">
          <Icon name="calendar_today" size={36} className="text-primary/20" />
          <p className="mt-3 text-sm text-on-surface-variant">
            Ukesgrid er klar — klikk-å-opprette aktiveres i neste steg (B-1.2)
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Sidebar ── */

function PlannerSidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}) {
  const tabs: { id: SidebarTab; label: string; icon: string }[] = [
    { id: "exercises", label: "Øvelser", icon: "sports_golf" },
    { id: "templates", label: "Maler", icon: "dashboard_customize" },
    { id: "history", label: "Historikk", icon: "history" },
  ];

  return (
    <div className="sticky top-20 rounded-3xl border border-outline-variant/10 bg-surface-container-lowest">
      <div className="flex border-b border-outline-variant/10">
        {tabs.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                active
                  ? "border-b-2 border-primary text-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <Icon name={tab.icon} size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="p-4">
        {activeTab === "exercises" && <ExercisesPlaceholder />}
        {activeTab === "templates" && <TemplatesPlaceholder />}
        {activeTab === "history" && <HistoryPlaceholder />}
      </div>
    </div>
  );
}

function ExercisesPlaceholder() {
  const [pyramide, setPyramide] = useState<string | null>(null);
  const [omraadeGruppe, setOmraadeGruppe] = useState<string | null>(null);
  const [lFase, setLFase] = useState<string | null>(null);
  const [life, setLife] = useState<string | null>(null);
  const [sok, setSok] = useState("");

  const filteredOmrader = omraadeGruppe
    ? TRENINGSOMRADER.filter((o) => o.gruppe === omraadeGruppe)
    : TRENINGSOMRADER;

  const resetFilters = () => {
    setPyramide(null);
    setOmraadeGruppe(null);
    setLFase(null);
    setLife(null);
    setSok("");
  };

  const hasFilters = pyramide || omraadeGruppe || lFase || life || sok;

  return (
    <div className="space-y-3">
      {/* Søk */}
      <div className="flex items-center gap-2 rounded-lg bg-surface-container px-3 py-2">
        <Icon name="search" size={14} className="text-on-surface-variant" />
        <input
          type="text"
          value={sok}
          onChange={(e) => setSok(e.target.value)}
          placeholder="Søk øvelse…"
          className="flex-1 bg-transparent font-mono text-[11px] text-on-surface placeholder:text-on-surface-variant focus:outline-none"
        />
        {hasFilters && (
          <button
            onClick={resetFilters}
            className="font-mono text-[10px] uppercase tracking-widest text-primary/60 hover:text-primary"
          >
            Nullstill
          </button>
        )}
      </div>

      {/* Pyramide */}
      <FilterSection label="Pyramide">
        <div className="flex flex-wrap gap-1">
          {PYRAMIDE.map((p) => {
            const active = pyramide === p.code;
            return (
              <button
                key={p.code}
                onClick={() => setPyramide(active ? null : p.code)}
                className={`rounded px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  active
                    ? "bg-primary text-white"
                    : "bg-surface text-on-surface-variant hover:bg-surface-container"
                }`}
                title={p.description}
              >
                {p.code}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Område */}
      <FilterSection label="Område">
        <div className="flex flex-wrap gap-1">
          {OMRADE_GRUPPER.map((g) => {
            const active = omraadeGruppe === g.code;
            return (
              <button
                key={g.code}
                onClick={() => setOmraadeGruppe(active ? null : g.code)}
                className={`rounded px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  active
                    ? "bg-primary text-white"
                    : "bg-surface text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
        {omraadeGruppe && (
          <div className="mt-2 flex flex-wrap gap-1">
            {filteredOmrader.map((o) => (
              <span
                key={o.code}
                className="rounded bg-surface-container-low px-2 py-0.5 font-mono text-[9px] uppercase tracking-tight text-on-surface-variant"
              >
                {o.code}
              </span>
            ))}
          </div>
        )}
      </FilterSection>

      {/* L-fase */}
      <FilterSection label="L-fase">
        <div className="flex flex-wrap gap-1">
          {L_FASER.map((f) => {
            const active = lFase === f.code;
            return (
              <button
                key={f.code}
                onClick={() => setLFase(active ? null : f.code)}
                className={`rounded px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  active
                    ? "bg-primary text-white"
                    : "bg-surface text-on-surface-variant hover:bg-surface-container"
                }`}
                title={`${f.description} · ${f.csAnbefalt}`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* LIFE */}
      <FilterSection label="LIFE">
        <div className="flex flex-wrap gap-1">
          {LIFE_KODER.map((l) => {
            const active = life === l.code;
            const short = l.code.replace("LIFE-", "");
            return (
              <button
                key={l.code}
                onClick={() => setLife(active ? null : l.code)}
                className={`rounded px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  active
                    ? "bg-secondary-fixed text-primary"
                    : "bg-surface text-on-surface-variant hover:bg-surface-container"
                }`}
                title={l.description}
              >
                {short}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Liste-placeholder */}
      <div className="rounded-2xl border border-dashed border-outline-variant/40 p-6 text-center">
        <Icon name="fitness_center" size={28} className="text-primary/20" />
        <p className="mt-2 text-xs text-on-surface-variant">
          {hasFilters ? "Filter-resultater" : "Øvelsesbibliotek"} fylles i B-1.3
        </p>
      </div>
    </div>
  );
}

function FilterSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-primary/50">
        {label}
      </p>
      {children}
    </div>
  );
}

function TemplatesPlaceholder() {
  return (
    <div className="rounded-2xl border border-dashed border-outline-variant/40 p-6 text-center">
      <Icon name="dashboard_customize" size={28} className="text-primary/20" />
      <p className="mt-2 text-xs text-on-surface-variant">
        Ukes- og øktsmaler kommer i B-1.6
      </p>
    </div>
  );
}

function HistoryPlaceholder() {
  return (
    <div className="rounded-2xl border border-dashed border-outline-variant/40 p-6 text-center">
      <Icon name="history" size={28} className="text-primary/20" />
      <p className="mt-2 text-xs text-on-surface-variant">
        Forrige ukers økter vises i B-1.3
      </p>
    </div>
  );
}

/* ── Stats ── */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-primary/40">
        {label}
      </p>
      <p className="text-sm font-bold text-primary">{value}</p>
    </div>
  );
}
