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
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { addWeeks, format, startOfWeek } from "date-fns";
import { nb } from "date-fns/locale";
import { cn } from "@/lib/portal/utils/cn";
import {
  PYRAMIDE,
  TRENINGSOMRADER,
  OMRADE_GRUPPER,
  L_FASER,
  LIFE_KODER,
} from "@/lib/portal/training/ak-taxonomy";
import {
  searchExercises,
  createUserExercise,
  type ExerciseSearchResult,
} from "@/lib/portal/training/exercise-actions";
import {
  PlanAdjustmentBanner,
  type AdjustmentSuggestion,
} from "./components/plan-adjustment-banner";
import { PlanAdjustmentModal } from "./components/plan-adjustment-modal";
import { PlanCreatorModal } from "@/components/portal/treningsplan/plan-creator-modal";
import { PlanConversationCard } from "@/components/portal/treningsplan/plan-conversation-card";
import { PlanSuggestionInbox } from "@/components/portal/treningsplan/plan-suggestion-inbox";
import { EmptyState } from "@/components/ui/empty-state";
import { PlanGoalsCard } from "./components/plan-goals-card";
import type { PlanGoalsSummary } from "./actions";
import type { PlanSuggestionView } from "@/lib/portal/training/plan-suggestion-types";

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
  isGroupSession?: boolean;
  groupName?: string | null;
}

interface PeriodizationInfo {
  periodType: string;
  label: string | null;
  weekNumber: number;
  totalWeeks: number;
  focusAllocation: Record<string, number> | null;
}

export interface FacilityOption {
  id: string;
  name: string;
  slug: string;
  locationName: string | null;
}

export interface MyPlanSummary {
  id: string;
  title: string;
  isActive: boolean;
  aiGenerated: boolean;
  startDate: string;
  endDate: string;
  weekCount: number;
}

export interface ConflictDetailUI {
  kind: "BOOKING" | "TRAINING_SESSION";
  title: string;
  message: string;
}

interface TreningsplanPlannerProps {
  weekOffset: number;
  planId: string | null;
  sessionCount?: number;
  totalMinutes?: number;
  adherencePct?: number;
  periodization?: PeriodizationInfo | null;
  events: V2Event[];
  historyEvents: V2Event[];
  facilities?: FacilityOption[];
  myPlans?: MyPlanSummary[];
  goalsSummary?: PlanGoalsSummary | null;
  coachFeedback?: { text: string; at: string | null } | null;
  playerComment?: { text: string; at: string | null } | null;
  onSavePlayerComment?: (
    text: string | null
  ) => Promise<{ success: boolean; error?: string }>;
  pendingSuggestions?: PlanSuggestionView[];
  onAcceptSuggestion?: (
    suggestionId: string
  ) => Promise<{ success: boolean; error?: string }>;
  onRejectSuggestion?: (
    suggestionId: string,
    reason?: string
  ) => Promise<{ success: boolean; error?: string }>;
  onCreateSession: (data: {
    weekOffset: number;
    dayOfWeek: number;
    title: string;
    description?: string;
    durationMinutes?: number;
    focusArea?: string;
    startH?: number;
    startM?: number;
    facilityId?: string;
  }) => Promise<{ success: boolean; sessionId?: string } | { error: string }>;
  onAddExerciseToSession: (
    sessionId: string,
    exercise: {
      id: string;
      name: string;
      description?: string;
      pyramid: string;
      area: string;
      lPhase?: string;
    }
  ) => Promise<{ success: boolean }>;
  onUpdateSession: (
    sessionId: string,
    data: {
      title?: string;
      description?: string;
      durationMinutes?: number;
      focusArea?: string;
      facilityId?: string | null;
    }
  ) => Promise<{ success: boolean }>;
  adjustmentSuggestion?: AdjustmentSuggestion | null;
  onAdjustPlan?: (factor: number) => Promise<{ success: boolean; adjustedCount?: number; error?: string }>;
  onArchivePlan?: (planId: string) => Promise<{ success: boolean }>;
  onActivatePlan?: (planId: string) => Promise<{ success: boolean }>;
  onDeletePlan?: (planId: string) => Promise<{ success: boolean }>;
  onDuplicatePlan?: (planId: string) => Promise<{ success: boolean; planId?: string }>;
  onDuplicateSession?: (sessionId: string) => Promise<{ success: boolean; sessionId?: string }>;
  onReorderSessions?: (
    weekId: string,
    dayOfWeek: number,
    sessionIds: string[]
  ) => Promise<{ success: boolean }>;
  onToggleRestDay?: (weekId: string, dayOfWeek: number) => Promise<{ success: boolean; isRest: boolean }>;
  onDismissAdjustment?: (planId: string) => Promise<{ success: boolean; expiresAt?: string }>;
  onCheckConflicts?: (input: {
    date: string;
    startH: number;
    startM: number;
    durationMinutes: number;
    excludeSessionId?: string;
  }) => Promise<{ hasConflict: boolean; conflicts: ConflictDetailUI[] }>;
}

export function TreningsplanPlanner({
  weekOffset,
  planId,
  sessionCount = 0,
  totalMinutes = 0,
  adherencePct = 0,
  periodization,
  events,
  historyEvents,
  facilities = [],
  myPlans = [],
  goalsSummary,
  coachFeedback,
  playerComment,
  onSavePlayerComment,
  pendingSuggestions = [],
  onAcceptSuggestion,
  onRejectSuggestion,
  onCreateSession,
  onAddExerciseToSession,
  onUpdateSession,
  adjustmentSuggestion,
  onAdjustPlan,
  onArchivePlan,
  onActivatePlan,
  onDeletePlan,
  onDuplicatePlan,
  onDuplicateSession,
  onDismissAdjustment,
  onCheckConflicts,
}: TreningsplanPlannerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<SidebarTab>("exercises");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState(0);
  const [modalHour, setModalHour] = useState(9);
  const [isPending, startTransition] = useTransition();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<V2Event | null>(null);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [planCreatorOpen, setPlanCreatorOpen] = useState(false);

  const showEmptyState = !planId;

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
            {periodization && (
              <div className="mt-1 flex items-center gap-2">
                <span className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                  periodization.periodType === "grunnperiode" && "bg-info/10 text-info",
                  periodization.periodType === "spesialiseringsperiode" && "bg-warning/10 text-warning",
                  periodization.periodType === "turneringsperiode" && "bg-error/10 text-error",
                )}>
                  {periodization.label ?? periodization.periodType}
                </span>
                <span className="text-[10px] text-on-surface-variant">
                  uke {periodization.weekNumber} av {periodization.totalWeeks}
                </span>
              </div>
            )}
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
            onClick={() => {
              if (historyEvents.length === 0) return;
              startTransition(async () => {
                let copied = 0;
                for (const ev of historyEvents) {
                  const d = new Date(ev.date);
                  const day = d.getDay();
                  const dayOfWeek = day === 0 ? 7 : day;
                  const focusLabel = PYRAMIDE.find((p) => p.code === ev.focus)?.label ?? ev.focus;
                  const result = await onCreateSession({
                    weekOffset,
                    dayOfWeek,
                    title: ev.title,
                    durationMinutes: ev.dur,
                    focusArea: focusLabel,
                    startH: ev.startH,
                    startM: ev.startM,
                  });
                  if (result && "success" in result && result.success) {
                    copied++;
                  }
                }
                if (copied > 0) {
                  window.location.reload();
                }
              });
            }}
            className="flex items-center gap-2 rounded-lg border border-outline-variant px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-primary hover:bg-surface-container transition-colors"
          >
            <Icon name="content_copy" size={14} />
            Kopier uke
          </button>
          <button
            onClick={() => {
              setModalDay(1);
              setModalHour(9);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-secondary-fixed px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-primary hover:bg-secondary-fixed/80 transition-colors"
          >
            <Icon name="add" size={14} />
            Ny økt
          </button>
          <button
            onClick={() => setPlanCreatorOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-on-primary hover:bg-primary-container transition-colors"
          >
            <Icon name="auto_awesome" size={14} />
            Ny plan
          </button>
          {planId && (
            <a
              href={`/api/portal/training/export-pdf/${planId}`}
              className="flex items-center gap-2 rounded-lg border border-outline-variant px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-primary hover:bg-surface-container transition-colors"
              title="Last ned PDF"
            >
              <Icon name="picture_as_pdf" size={14} />
              PDF
            </a>
          )}
          {myPlans.length > 0 && (
            <PlansMenu
              plans={myPlans}
              onArchive={onArchivePlan}
              onActivate={onActivatePlan}
              onDelete={onDeletePlan}
              onDuplicate={onDuplicatePlan}
            />
          )}
        </div>
      </header>

      {showEmptyState && (
        <EmptyState
          iconName="event_note"
          title="Du har ingen aktiv treningsplan"
          description="Velg hvordan du vil starte: la AI lage en plan basert på din profil, velg en standardmal, eller bygg helt selv."
          actionLabel="Lag treningsplan"
          actionIconName="auto_awesome"
          onAction={() => setPlanCreatorOpen(true)}
        />
      )}

      {/* Plan-justering banner + modal */}
      {adjustmentSuggestion && adjustmentSuggestion.recommendation !== "none" && (
        <PlanAdjustmentBanner
          suggestion={adjustmentSuggestion}
          onDismiss={async () => {
            if (planId && onDismissAdjustment) {
              await onDismissAdjustment(planId);
            }
          }}
          onAdjust={() => setAdjustModalOpen(true)}
        />
      )}
      <PlanAdjustmentModal
        isOpen={adjustModalOpen}
        onClose={() => setAdjustModalOpen(false)}
        suggestion={adjustmentSuggestion}
        onApprove={async (factor) => {
          if (onAdjustPlan) {
            const result = await onAdjustPlan(factor);
            if (result.success) {
              // Show brief confirmation before reload
              const msg = result.adjustedCount
                ? `Plan justert! ${result.adjustedCount} økt(er) oppdatert.`
                : "Plan justert!";
              alert(msg);
              window.location.reload();
            }
          }
        }}
      />

      {/* Samtale: coach-feedback + spiller-kommentar (Sprint 1) */}
      {!showEmptyState && (
        <PlanConversationCard
          coachFeedback={coachFeedback}
          playerComment={playerComment}
          canEdit={Boolean(planId && onSavePlayerComment)}
          onSavePlayerComment={onSavePlayerComment}
        />
      )}

      {/* Forslag fra coach (Sprint 2) */}
      {!showEmptyState &&
        pendingSuggestions.length > 0 &&
        onAcceptSuggestion &&
        onRejectSuggestion && (
          <PlanSuggestionInbox
            suggestions={pendingSuggestions}
            onAccept={onAcceptSuggestion}
            onReject={onRejectSuggestion}
          />
        )}

      {/* Plan-mål med progress (Epic 7) */}
      {!showEmptyState && goalsSummary && goalsSummary.totalCount > 0 && (
        <PlanGoalsCard summary={goalsSummary} />
      )}

      {/* Hovedgrid: ukes-scheduler + sidebar (skjult ved tom-tilstand) */}
      {!showEmptyState && (
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-0 lg:col-span-9">
          {/* Desktop-grid (md og opp) */}
          <div className="hidden md:block">
            <WeekGrid
              weekDates={weekDates}
              events={events}
              onCellClick={(dayIndex, hour) => {
                setModalDay(dayIndex);
                setModalHour(hour);
                setModalOpen(true);
              }}
              onEventClick={(ev) => {
                if (ev.isGroupSession) {
                  return;
                }
                setEditEvent(ev);
                setEditModalOpen(true);
              }}
              onAddExerciseToSession={onAddExerciseToSession}
            />
          </div>
          {/* Mobil-liste (under md) */}
          <div className="md:hidden">
            <MobileWeekView
              weekDates={weekDates}
              events={events}
              onAddSession={(dayIndex) => {
                setModalDay(dayIndex);
                setModalHour(9);
                setModalOpen(true);
              }}
              onEventClick={(ev) => {
                if (ev.isGroupSession) {
                  return;
                }
                setEditEvent(ev);
                setEditModalOpen(true);
              }}
            />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-3">
          <PlannerSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            historyEvents={historyEvents}
          />
        </div>
      </div>
      )}

      {/* Wizard-modal: lag ny plan */}
      <PlanCreatorModal
        open={planCreatorOpen}
        onClose={() => setPlanCreatorOpen(false)}
      />

      {/* Modal: Opprett økt */}
      {modalOpen && (
        <CreateSessionModal
          weekOffset={weekOffset}
          dayIndex={modalDay}
          startHour={modalHour}
          weekDates={weekDates}
          facilities={facilities}
          onClose={() => setModalOpen(false)}
          onCreate={onCreateSession}
          onCheckConflicts={onCheckConflicts}
          isPending={isPending}
        />
      )}

      {/* Modal: Rediger økt */}
      {editModalOpen && editEvent && (
        <EditSessionModal
          event={editEvent}
          facilities={facilities}
          onClose={() => {
            setEditModalOpen(false);
            setEditEvent(null);
          }}
          onUpdate={onUpdateSession}
          onDuplicate={onDuplicateSession}
          isPending={isPending}
        />
      )}

      {/* Stats-stripe */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant/10 pt-6">
        <div className="flex gap-8">
          <Stat label="Økter" value={String(sessionCount)} />
          <Stat label="Total tid" value={`${totalHours}t ${remMinutes}m`} />
          <Stat
            label="Plan-adherence"
            value={`${adherencePct}%`}
            colorClass={
              adherencePct >= 80
                ? "text-success"
                : adherencePct >= 50
                  ? "text-warning"
                  : "text-error"
            }
          />
        </div>
        <div className="flex items-center gap-3">
          {!planId && (
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
  onEventClick,
  onAddExerciseToSession,
}: {
  weekDates: Date[];
  events: V2Event[];
  onCellClick: (dayIndex: number, hour: number) => void;
  onEventClick: (event: V2Event) => void;
  onAddExerciseToSession: TreningsplanPlannerProps["onAddExerciseToSession"];
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
                    isToday ? "bg-primary text-surface" : "text-primary"
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
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(ev);
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const raw = e.dataTransfer.getData("application/json");
                          if (!raw) return;
                          try {
                            const exercise = JSON.parse(raw);
                            await onAddExerciseToSession(ev.id, exercise);
                            window.location.reload();
                          } catch {
                            // ignore
                          }
                        }}
                        className={`absolute inset-1 cursor-pointer rounded-lg px-2 py-1 text-[10px] font-bold leading-tight shadow-sm ${
                          ev.done
                            ? "bg-primary/20 text-primary/70 line-through"
                            : eventColorClass(ev.focus)
                        }`}
                        title={`${ev.title} · ${ev.dur}m · ${ev.focus}${ev.isGroupSession ? " — Gruppeøkt (ikke redigerbar)" : " — Klikk for å redigere, dropp øvelse her"}`}
                      >
                        <span className="block truncate">
                          {ev.isGroupSession && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-info mr-1 align-middle" />
                          )}
                          {ev.title}
                        </span>
                        <span className="font-mono text-[9px] opacity-80">
                          {ev.dur}m
                          {ev.isGroupSession && ev.groupName && (
                            <span className="ml-1 text-info">· {ev.groupName}</span>
                          )}
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
  facilities,
  onClose,
  onCreate,
  onCheckConflicts,
  isPending,
}: {
  weekOffset: number;
  dayIndex: number;
  startHour: number;
  weekDates: Date[];
  facilities: FacilityOption[];
  onClose: () => void;
  onCreate: TreningsplanPlannerProps["onCreateSession"];
  onCheckConflicts?: TreningsplanPlannerProps["onCheckConflicts"];
  isPending: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(60);
  const [focus, setFocus] = useState<string>("TEK");
  const [notes, setNotes] = useState("");
  const [facilityId, setFacilityId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<ConflictDetailUI[]>([]);
  const [conflictsAcknowledged, setConflictsAcknowledged] = useState(false);

  const date = weekDates[dayIndex];
  const dayOfWeek = dayIndex + 1; // 1 = Man, 7 = Søn
  const dateStr = format(date, "yyyy-MM-dd");

  // Sjekk konflikter når relevant felt endres
  useEffect(() => {
    if (!onCheckConflicts) return;
    let cancelled = false;
    onCheckConflicts({
      date: dateStr,
      startH: startHour,
      startM: 0,
      durationMinutes: duration,
    }).then((result) => {
      if (!cancelled) {
        setConflicts(result.conflicts ?? []);
        setConflictsAcknowledged(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [onCheckConflicts, dateStr, startHour, duration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Tittel er påkrevd");
      return;
    }
    if (conflicts.length > 0 && !conflictsAcknowledged) {
      setConflictsAcknowledged(true);
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
      facilityId: facilityId || undefined,
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
                      ? "bg-primary text-surface"
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
                      ? "bg-primary text-surface"
                      : "border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"
                  }`}
                  title={p.description}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fasilitet */}
          {facilities.length > 0 && (
            <div>
              <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary/60">
                Fasilitet (valgfri)
              </label>
              <select
                value={facilityId}
                onChange={(e) => setFacilityId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="">Ingen valgt</option>
                {facilities.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                    {f.locationName ? ` · ${f.locationName}` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

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

          {/* Konfliktadvarsel */}
          {conflicts.length > 0 && (
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-warning">
                {conflictsAcknowledged ? "Bekreft for å lagre" : "Konflikt"}
              </p>
              <ul className="mt-1 space-y-1 text-xs text-on-surface">
                {conflicts.map((c, i) => (
                  <li key={i}>• {c.message}</li>
                ))}
              </ul>
              {!conflictsAcknowledged && (
                <p className="mt-2 text-[11px] text-on-surface-variant">
                  Trykk «Opprett økt» igjen for å lagre uansett.
                </p>
              )}
            </div>
          )}

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
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-surface hover:bg-primary-container disabled:opacity-50"
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
                  {conflicts.length > 0 && conflictsAcknowledged
                    ? "Lagre likevel"
                    : "Opprett økt"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Modal: Rediger økt ── */

function EditSessionModal({
  event,
  facilities,
  onClose,
  onUpdate,
  onDuplicate,
  isPending,
}: {
  event: V2Event;
  facilities: FacilityOption[];
  onClose: () => void;
  onUpdate: TreningsplanPlannerProps["onUpdateSession"];
  onDuplicate?: TreningsplanPlannerProps["onDuplicateSession"];
  isPending: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(event.title);
  const [duration, setDuration] = useState(event.dur);
  const [focus, setFocus] = useState<string>(event.focus);
  const [notes, setNotes] = useState("");
  const [facilityId, setFacilityId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [duplicating, setDuplicating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Tittel er påkrevd");
      return;
    }

    const result = await onUpdate(event.id, {
      title: title.trim(),
      description: notes.trim() || undefined,
      durationMinutes: duration,
      focusArea: PYRAMIDE.find((p) => p.code === focus)?.label ?? focus,
      facilityId: facilityId || null,
    });

    if ("error" in result) {
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
          <h2 className="text-lg font-bold text-primary">Rediger økt</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-container"
          >
            <Icon name="close" size={18} className="text-on-surface-variant" />
          </button>
        </div>

        <p className="mt-1 font-mono text-[11px] text-on-surface-variant">
          {event.date} · kl {String(event.startH).padStart(2, "0")}:
          {String(event.startM).padStart(2, "0")} · {event.dur}m
        </p>

        {error && (
          <div className="mt-3 rounded-lg bg-error-container px-3 py-2 text-xs text-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary/60">
              Tittel
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
              autoFocus
            />
          </div>

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
                      ? "bg-primary text-surface"
                      : "border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

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
                      ? "bg-primary text-surface"
                      : "border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"
                  }`}
                  title={p.description}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {facilities.length > 0 && (
            <div>
              <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary/60">
                Fasilitet (valgfri)
              </label>
              <select
                value={facilityId}
                onChange={(e) => setFacilityId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="">Ingen valgt</option>
                {facilities.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                    {f.locationName ? ` · ${f.locationName}` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary/60">
              Notater
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Valgfrie notater…"
              rows={3}
              className="mt-1 w-full resize-none rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            {onDuplicate ? (
              <button
                type="button"
                disabled={duplicating || isPending}
                onClick={async () => {
                  setDuplicating(true);
                  const result = await onDuplicate(event.id);
                  setDuplicating(false);
                  if (result.success) {
                    router.refresh();
                    onClose();
                  }
                }}
                className="flex items-center gap-2 rounded-lg border border-outline-variant px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-on-surface hover:bg-surface-container disabled:opacity-50"
              >
                {duplicating ? (
                  <Icon name="progress_activity" size={14} className="animate-spin" />
                ) : (
                  <Icon name="content_copy" size={14} />
                )}
                Dupliser
              </button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-3">
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
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-surface hover:bg-primary-container disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Icon name="progress_activity" size={14} className="animate-spin" />
                    Lagrer…
                  </>
                ) : (
                  <>
                    <Icon name="save" size={14} />
                    Oppdater
                  </>
                )}
              </button>
            </div>
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
  historyEvents,
}: {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  historyEvents: V2Event[];
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
        {activeTab === "history" && <HistoryList events={historyEvents} />}
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

  // X-6: Inline opprett egen øvelse
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createPyramid, setCreatePyramid] = useState<string>("TEK");
  const [createArea, setCreateArea] = useState<string>("TEE");
  const [createLFase, setCreateLFase] = useState<string | null>(null);
  const [createDesc, setCreateDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

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

  const doSearch = async () => {
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
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCreateExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    if (!createName.trim()) {
      setCreateError("Navn er påkrevd");
      return;
    }
    setCreating(true);
    const result = await createUserExercise({
      name: createName.trim(),
      description: createDesc.trim() || undefined,
      pyramid: createPyramid,
      area: createArea,
      lPhase: createLFase ?? undefined,
    });
    setCreating(false);
    if ("error" in result) {
      setCreateError(result.error);
      return;
    }
    // Nullstill form og oppdater søk
    setCreateName("");
    setCreateDesc("");
    setShowCreateForm(false);
    doSearch();
  };

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
                    ? "bg-primary text-surface"
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
                    ? "bg-primary text-surface"
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
                    ? "bg-primary text-surface"
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

      {/* X-6: Opprett egen øvelse */}
      {!showCreateForm ? (
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-outline-variant/40 py-2.5 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant hover:border-primary/30 hover:text-primary transition-colors"
        >
          <Icon name="add" size={14} />
          Opprett egen øvelse
        </button>
      ) : (
        <form
          onSubmit={handleCreateExercise}
          className="space-y-3 rounded-xl border border-outline-variant/20 bg-surface p-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-primary">Ny øvelse</p>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-surface-container"
            >
              <Icon name="close" size={14} className="text-on-surface-variant" />
            </button>
          </div>

          {createError && (
            <p className="rounded bg-error-container px-2 py-1 text-[10px] text-error">
              {createError}
            </p>
          )}

          <input
            type="text"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            placeholder="Navn på øvelse"
            className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-2.5 py-1.5 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
            autoFocus
          />

          {/* Pyramide */}
          <div className="flex flex-wrap gap-1">
            {PYRAMIDE.map((p) => (
              <button
                key={p.code}
                type="button"
                onClick={() => setCreatePyramid(p.code)}
                className={`rounded px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-tight transition-colors ${
                  createPyramid === p.code
                    ? "bg-primary text-surface"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {p.code}
              </button>
            ))}
          </div>

          {/* Område */}
          <select
            value={createArea}
            onChange={(e) => setCreateArea(e.target.value)}
            className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-2.5 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
          >
            {TRENINGSOMRADER.map((o) => (
              <option key={o.code} value={o.code}>
                {o.label}
              </option>
            ))}
          </select>

          {/* L-fase */}
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setCreateLFase(null)}
              className={`rounded px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-tight transition-colors ${
                createLFase === null
                  ? "bg-primary text-surface"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              —
            </button>
            {L_FASER.map((f) => (
              <button
                key={f.code}
                type="button"
                onClick={() => setCreateLFase(f.code)}
                className={`rounded px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-tight transition-colors ${
                  createLFase === f.code
                    ? "bg-primary text-surface"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <textarea
            value={createDesc}
            onChange={(e) => setCreateDesc(e.target.value)}
            placeholder="Beskrivelse (valgfri)"
            rows={2}
            className="w-full resize-none rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-2.5 py-1.5 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
          />

          <button
            type="submit"
            disabled={creating || !createName.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 text-[11px] font-bold uppercase tracking-widest text-surface hover:bg-primary-container disabled:opacity-50"
          >
            {creating ? (
              <>
                <Icon name="progress_activity" size={14} className="animate-spin" />
                Lagrer…
              </>
            ) : (
              <>
                <Icon name="save" size={14} />
                Lagre øvelse
              </>
            )}
          </button>
        </form>
      )}
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
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(
          "application/json",
          JSON.stringify({
            id: exercise.id,
            name: exercise.name,
            description: exercise.description ?? undefined,
            pyramid: exercise.pyramid,
            area: exercise.area,
            lPhase: exercise.lPhase ?? undefined,
          })
        );
        e.dataTransfer.effectAllowed = "copy";
      }}
      className="group cursor-grab rounded-lg border border-outline-variant/20 bg-surface p-2.5 transition-all hover:border-primary/30 hover:bg-surface-container active:cursor-grabbing"
      title="Drag til økt i grid"
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

function HistoryList({ events }: { events: V2Event[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-outline-variant/40 p-6 text-center">
        <Icon name="history" size={28} className="text-primary/20" />
        <p className="mt-2 text-xs text-on-surface-variant">
          Ingen økter registrert forrige uke
        </p>
      </div>
    );
  }

  const totalDur = events.reduce((s, e) => s + e.dur, 0);
  const completed = events.filter((e) => e.done).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-primary/50">
          {events.length} økter · {totalDur}m
        </p>
        {completed > 0 && (
          <span className="rounded-full bg-success/15 px-2 py-0.5 font-mono text-[9px] font-bold text-success">
            {completed} fullført
          </span>
        )}
      </div>
      {events.map((ev) => (
        <div
          key={ev.id}
          className={`rounded-xl border p-3 transition-colors ${
            ev.done
              ? "border-success/20 bg-success/5"
              : "border-outline-variant/10 bg-surface-container-lowest"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-xs font-bold ${
                  ev.done ? "text-success line-through" : "text-primary"
                }`}
              >
                {ev.title}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded bg-surface-container px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-tight text-on-surface-variant">
                  {ev.focus}
                </span>
                <span className="font-mono text-[9px] text-on-surface-variant">
                  {ev.dur}m
                </span>
                {ev.isGroupSession && (
                  <span className="rounded bg-info/10 px-1.5 py-0.5 font-mono text-[9px] text-info">
                    {ev.groupName ?? "Gruppe"}
                  </span>
                )}
              </div>
            </div>
            {ev.done && (
              <Icon name="check_circle" size={16} className="shrink-0 text-success" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Mobile week view (Epic 12) ── */

function MobileWeekView({
  weekDates,
  events,
  onAddSession,
  onEventClick,
}: {
  weekDates: Date[];
  events: V2Event[];
  onAddSession: (dayIndex: number) => void;
  onEventClick: (ev: V2Event) => void;
}) {
  const today = new Date();
  const todayISO = format(today, "yyyy-MM-dd");

  const eventsByDay = new Map<number, V2Event[]>();
  for (const ev of events) {
    const idx = weekDates.findIndex((d) => format(d, "yyyy-MM-dd") === ev.date);
    if (idx === -1) continue;
    const list = eventsByDay.get(idx) ?? [];
    list.push(ev);
    eventsByDay.set(idx, list);
  }

  return (
    <div className="divide-y divide-outline-variant/10">
      {weekDates.map((date, idx) => {
        const dateISO = format(date, "yyyy-MM-dd");
        const isToday = dateISO === todayISO;
        const dayEvents = (eventsByDay.get(idx) ?? []).sort(
          (a, b) => a.startH * 60 + a.startM - (b.startH * 60 + b.startM)
        );

        return (
          <div
            key={idx}
            className={`p-4 ${isToday ? "bg-secondary-fixed/10" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                  {DAYS[idx]}
                </p>
                <p
                  className={`text-lg font-bold ${isToday ? "text-primary" : "text-on-surface"}`}
                >
                  {format(date, "d. MMM", { locale: nb })}
                </p>
              </div>
              <button
                onClick={() => onAddSession(idx)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant text-primary hover:bg-surface-container active:scale-95"
                aria-label="Legg til økt"
              >
                <Icon name="add" size={18} />
              </button>
            </div>

            {dayEvents.length === 0 ? (
              <p className="mt-2 text-xs text-on-surface-variant/70">Ingen økter</p>
            ) : (
              <div className="mt-3 space-y-2">
                {dayEvents.map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => onEventClick(ev)}
                    className={`w-full rounded-xl px-3 py-2.5 text-left transition-colors ${
                      ev.done
                        ? "bg-primary/15 text-primary line-through"
                        : eventColorClass(ev.focus)
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-bold">
                        {ev.isGroupSession && (
                          <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-info align-middle" />
                        )}
                        {ev.title}
                      </span>
                      <span className="font-mono text-[10px] tabular-nums">
                        {String(ev.startH).padStart(2, "0")}:
                        {String(ev.startM).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[10px] opacity-80">
                      <span>{ev.dur} min</span>
                      <span>·</span>
                      <span>{ev.focus}</span>
                      {ev.isGroupSession && ev.groupName && (
                        <>
                          <span>·</span>
                          <span>{ev.groupName}</span>
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Stats ── */

function Stat({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: string;
  colorClass?: string;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-primary/40">
        {label}
      </p>
      <p className={`text-sm font-bold ${colorClass ?? "text-primary"}`}>
        {value}
      </p>
    </div>
  );
}

/* ── Mine planer-meny ── */

function PlansMenu({
  plans,
  onArchive,
  onActivate,
  onDelete,
  onDuplicate,
}: {
  plans: MyPlanSummary[];
  onArchive?: (planId: string) => Promise<{ success: boolean }>;
  onActivate?: (planId: string) => Promise<{ success: boolean }>;
  onDelete?: (planId: string) => Promise<{ success: boolean }>;
  onDuplicate?: (planId: string) => Promise<{ success: boolean; planId?: string }>;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const run = async (
    label: string,
    action?: (planId: string) => Promise<{ success: boolean }>,
    planId?: string,
    confirmMsg?: string
  ) => {
    if (!action || !planId) return;
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setBusy(`${label}-${planId}`);
    try {
      const result = await action(planId);
      if (result.success) {
        setOpen(false);
        router.refresh();
      }
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Handling feilet");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-outline-variant px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-primary hover:bg-surface-container transition-colors"
      >
        <Icon name="folder" size={14} />
        Mine planer
        <Icon name={open ? "expand_less" : "expand_more"} size={14} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-30 mt-2 w-80 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-2 shadow-card-hover"
          onMouseLeave={() => setOpen(false)}
        >
          {plans.length === 0 && (
            <p className="px-3 py-2 text-xs text-on-surface-variant">Ingen planer</p>
          )}
          {plans.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-1 rounded-lg p-2 hover:bg-surface-container"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold text-on-surface">
                  {p.title}
                </span>
                {p.isActive ? (
                  <span className="font-mono text-[9px] uppercase tracking-widest text-success">
                    AKTIV
                  </span>
                ) : (
                  <span className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant">
                    ARKIV
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
                <span>{p.weekCount} uker</span>
                <span>·</span>
                <span>{p.startDate}</span>
                {p.aiGenerated && (
                  <>
                    <span>·</span>
                    <span className="text-primary">AI</span>
                  </>
                )}
              </div>
              <div className="mt-1 flex items-center gap-2">
                {p.isActive ? (
                  <button
                    type="button"
                    disabled={busy === `archive-${p.id}`}
                    onClick={() =>
                      run("archive", onArchive, p.id, "Arkiver planen?")
                    }
                    className="rounded-md border border-outline-variant px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface disabled:opacity-50"
                  >
                    Arkiver
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busy === `activate-${p.id}`}
                    onClick={() => run("activate", onActivate, p.id)}
                    className="rounded-md border border-primary bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-on-primary hover:bg-primary-container disabled:opacity-50"
                  >
                    Aktiver
                  </button>
                )}
                <button
                  type="button"
                  disabled={busy === `duplicate-${p.id}`}
                  onClick={() => run("duplicate", onDuplicate, p.id)}
                  className="rounded-md border border-outline-variant px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface disabled:opacity-50"
                >
                  Dupliser
                </button>
                {!p.isActive && (
                  <button
                    type="button"
                    disabled={busy === `delete-${p.id}`}
                    onClick={() =>
                      run(
                        "delete",
                        onDelete,
                        p.id,
                        "Slette planen permanent? Dette kan ikke angres."
                      )
                    }
                    className="ml-auto rounded-md border border-error px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-error hover:bg-error-container disabled:opacity-50"
                  >
                    Slett
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
