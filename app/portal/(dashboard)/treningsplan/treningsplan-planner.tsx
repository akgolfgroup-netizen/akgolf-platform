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

import { useState, useEffect, useTransition } from "react";
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
import {
  searchExercises,
  type ExerciseSearchResult,
} from "@/lib/portal/training/exercise-actions";

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 06:00–21:00
const DAYS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
type SidebarTab = "exercises" | "templates" | "history";

interface V2Event {
  id: string;
  date: string;
  startH: number;
  startM: number;
  dur: number;
  title: string;
  focus: string;
  exercises: unknown[];
  done: boolean;
}

interface TreningsplanPlannerProps {
  weekOffset: number;
  planId: string | null;
  sessionCount?: number;
  totalMinutes?: number;
  adherencePct?: number;
  events: V2Event[];
  onCreateSession: (data: {
    weekOffset: number;
    dayOfWeek: number;
    title: string;
    description?: string;
    durationMinutes?: number;
    focusArea?: string;
    startH?: number;
    startM?: number;
  }) => Promise<{ success: boolean; sessionId?: string } | { error: string }>;
}

export function TreningsplanPlanner({
  weekOffset,
  planId,
  sessionCount = 0,
  totalMinutes = 0,
  adherencePct = 0,
  events,
  onCreateSession,
}: TreningsplanPlannerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<SidebarTab>("exercises");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState(0);
  const [modalHour, setModalHour] = useState(9);
  const [isPending, startTransition] = useTransition();

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
          <WeekGrid
            weekDates={weekDates}
            events={events}
            onCellClick={(dayIndex, hour) => {
              setModalDay(dayIndex);
              setModalHour(hour);
              setModalOpen(true);
            }}
          />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <PlannerSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Modal: Opprett økt */}
      {modalOpen && (
        <CreateSessionModal
          weekOffset={weekOffset}
          dayIndex={modalDay}
          startHour={modalHour}
          weekDates={weekDates}
          onClose={() => setModalOpen(false)}
          onCreate={onCreateSession}
          isPending={isPending}
        />
      )}

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

function WeekGrid({
  weekDates,
  events,
  onCellClick,
}: {
  weekDates: Date[];
  events: V2Event[];
  onCellClick: (dayIndex: number, hour: number) => void;
}) {
  const today = new Date();
  const todayISO = format(today, "yyyy-MM-dd");

  // Bygg lookup: `${dayIndex}-${hour}` → event[]
  const eventMap = new Map<string, V2Event[]>();
  for (const ev of events) {
    const dayIndex = weekDates.findIndex(
      (d) => format(d, "yyyy-MM-dd") === ev.date
    );
    if (dayIndex === -1) continue;
    const key = `${dayIndex}-${ev.startH}`;
    const list = eventMap.get(key) ?? [];
    list.push(ev);
    eventMap.set(key, list);
  }

  const hasAnyEvents = events.length > 0;

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
              {weekDates.map((_, dayIndex) => {
                const key = `${dayIndex}-${h}`;
                const slotEvents = eventMap.get(key) ?? [];
                return (
                  <div
                    key={dayIndex}
                    onClick={() => {
                      if (slotEvents.length === 0) onCellClick(dayIndex, h);
                    }}
                    className={`relative h-14 border-r border-outline-variant/5 transition-colors ${
                      slotEvents.length === 0
                        ? "cursor-pointer hover:bg-surface-container/60"
                        : ""
                    }`}
                  >
                    {slotEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className={`absolute inset-1 rounded-lg px-2 py-1 text-[10px] font-bold leading-tight shadow-sm ${
                          ev.done
                            ? "bg-primary/20 text-primary/70 line-through"
                            : eventColorClass(ev.focus)
                        }`}
                        title={`${ev.title} · ${ev.dur}m · ${ev.focus}`}
                      >
                        <span className="block truncate">{ev.title}</span>
                        <span className="font-mono text-[9px] opacity-80">
                          {ev.dur}m
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Tom state */}
        {!hasAnyEvents && (
          <div className="px-8 py-12 text-center">
            <Icon name="calendar_today" size={36} className="text-primary/20" />
            <p className="mt-3 text-sm text-on-surface-variant">
              Klikk på en time-slot for å opprette din første økt
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function eventColorClass(focus: string): string {
  switch (focus) {
    case "FYS":
      return "bg-primary/15 text-primary";
    case "TEK":
      return "bg-secondary-container/80 text-primary";
    case "SLAG":
      return "bg-secondary-fixed/40 text-primary";
    case "SPILL":
      return "bg-tertiary-container/40 text-primary";
    case "TURN":
      return "bg-error-container/40 text-primary";
    default:
      return "bg-surface-container-high text-on-surface-variant";
  }
}

/* ── Modal: Opprett økt ── */

function CreateSessionModal({
  weekOffset,
  dayIndex,
  startHour,
  weekDates,
  onClose,
  onCreate,
  isPending,
}: {
  weekOffset: number;
  dayIndex: number;
  startHour: number;
  weekDates: Date[];
  onClose: () => void;
  onCreate: TreningsplanPlannerProps["onCreateSession"];
  isPending: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(60);
  const [focus, setFocus] = useState<string>("TEK");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const date = weekDates[dayIndex];
  const dayOfWeek = dayIndex + 1; // 1 = Man, 7 = Søn

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Tittel er påkrevd");
      return;
    }

    const result = await onCreate({
      weekOffset,
      dayOfWeek,
      title: title.trim(),
      description: notes.trim() || undefined,
      durationMinutes: duration,
      focusArea: PYRAMIDE.find((p) => p.code === focus)?.label ?? focus,
      startH: startHour,
      startM: 0,
    });

    if (result && "error" in result) {
      setError(result.error);
      return;
    }

    router.refresh();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-card-hover">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">Ny økt</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-container"
          >
            <Icon name="close" size={18} className="text-on-surface-variant" />
          </button>
        </div>

        <p className="mt-1 font-mono text-[11px] text-on-surface-variant">
          {DAYS[dayIndex]} {format(date, "d. MMMM", { locale: nb })} · kl{" "}
          {String(startHour).padStart(2, "0")}:00
        </p>

        {error && (
          <div className="mt-3 rounded-lg bg-error-container px-3 py-2 text-xs text-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Tittel */}
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary/60">
              Tittel
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="f.eks. Range-session"
              className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
              autoFocus
            />
          </div>

          {/* Varighet */}
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary/60">
              Varighet
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              {[15, 30, 45, 60, 90, 120].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDuration(m)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    duration === m
                      ? "bg-primary text-white"
                      : "border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

          {/* Pyramide-fokus */}
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary/60">
              Fokus
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              {PYRAMIDE.map((p) => (
                <button
                  key={p.code}
                  type="button"
                  onClick={() => setFocus(p.code)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    focus === p.code
                      ? "bg-primary text-white"
                      : "border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"
                  }`}
                  title={p.description}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notater */}
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary/60">
              Notater
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Valgfrie notater om økten…"
              rows={3}
              className="mt-1 w-full resize-none rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
            />
          </div>

          {/* Knapper */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-outline-variant px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={isPending || !title.trim()}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-white hover:bg-primary-container disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Icon
                    name="progress_activity"
                    size={14}
                    className="animate-spin"
                  />
                  Lagrer…
                </>
              ) : (
                <>
                  <Icon name="add" size={14} />
                  Opprett økt
                </>
              )}
            </button>
          </div>
        </form>
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
  const [omraadeCode, setOmraadeCode] = useState<string | null>(null);
  const [lFase, setLFase] = useState<string | null>(null);
  const [life, setLife] = useState<string | null>(null);
  const [sok, setSok] = useState("");
  const [results, setResults] = useState<ExerciseSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredOmrader = omraadeGruppe
    ? TRENINGSOMRADER.filter((o) => o.gruppe === omraadeGruppe)
    : TRENINGSOMRADER;

  const resetFilters = () => {
    setPyramide(null);
    setOmraadeGruppe(null);
    setOmraadeCode(null);
    setLFase(null);
    setLife(null);
    setSok("");
  };

  const hasFilters =
    pyramide || omraadeGruppe || omraadeCode || lFase || life || sok;

  // Debounced søk ved filter-endring
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchExercises({
          query: sok || undefined,
          pyramid: pyramide ?? undefined,
          area: omraadeCode ?? undefined,
          lPhase: lFase ?? undefined,
          lifeCode: life ?? undefined,
          limit: 30,
        });
        if (!cancelled) setResults(data);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [sok, pyramide, omraadeCode, lFase, life]);

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
                onClick={() => {
                  if (active) {
                    setOmraadeGruppe(null);
                    setOmraadeCode(null);
                  } else {
                    setOmraadeGruppe(g.code);
                    setOmraadeCode(null);
                  }
                }}
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
            {filteredOmrader.map((o) => {
              const active = omraadeCode === o.code;
              return (
                <button
                  key={o.code}
                  onClick={() => setOmraadeCode(active ? null : o.code)}
                  className={`rounded px-2 py-0.5 font-mono text-[9px] uppercase tracking-tight transition-colors ${
                    active
                      ? "bg-secondary-fixed text-primary"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                  }`}
                  title={o.label}
                >
                  {o.code}
                </button>
              );
            })}
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

      {/* Resultater */}
      <ExerciseList results={results} loading={loading} hasFilters={Boolean(hasFilters)} />
    </div>
  );
}

function ExerciseList({
  results,
  loading,
  hasFilters,
}: {
  results: ExerciseSearchResult[];
  loading: boolean;
  hasFilters: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-outline-variant/40 p-6">
        <Icon
          name="progress_activity"
          size={18}
          className="animate-spin text-primary/50"
        />
        <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
          Laster…
        </span>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-outline-variant/40 p-6 text-center">
        <Icon name="fitness_center" size={28} className="text-primary/20" />
        <p className="mt-2 text-xs text-on-surface-variant">
          {hasFilters
            ? "Ingen øvelser matcher filter"
            : "Ingen øvelser i databasen ennå"}
        </p>
        <p className="mt-1 text-[10px] text-on-surface-variant/70">
          {hasFilters
            ? "Juster filter eller opprett egen øvelse"
            : "Seed kjører i X-2/X-3 (se plan-fil)"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-primary/50">
        {results.length} treff
      </p>
      {results.map((r) => (
        <ExerciseCard key={r.id} exercise={r} />
      ))}
    </div>
  );
}

function ExerciseCard({ exercise }: { exercise: ExerciseSearchResult }) {
  const durationLabel =
    exercise.minDurationMinutes === exercise.maxDurationMinutes
      ? `${exercise.minDurationMinutes}m`
      : `${exercise.minDurationMinutes}–${exercise.maxDurationMinutes}m`;
  return (
    <div
      className="group cursor-grab rounded-lg border border-outline-variant/20 bg-surface p-2.5 transition-all hover:border-primary/30 hover:bg-surface-container active:cursor-grabbing"
      title="Drag til slot (drag-drop kommer i B-1.4)"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="flex-1 text-xs font-bold text-primary leading-tight">
          {exercise.name}
        </p>
        {exercise.isFavorite && (
          <Icon name="star" filled size={12} className="text-secondary-fixed-dim flex-shrink-0" />
        )}
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-1">
        <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-tight text-primary">
          {exercise.pyramid}
        </span>
        <span className="rounded bg-surface-container-high px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-tight text-on-surface-variant">
          {exercise.area}
        </span>
        {exercise.lPhase && (
          <span className="rounded bg-surface-container-high px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-tight text-on-surface-variant">
            {exercise.lPhase}
          </span>
        )}
        <span className="ml-auto font-mono text-[9px] text-on-surface-variant">
          {durationLabel}
        </span>
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
