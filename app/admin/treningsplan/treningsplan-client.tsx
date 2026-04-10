"use client";

import { useState, useTransition } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  X,
  Clock,
  Target,
  ChevronDown,
  ChevronRight,
  Copy,
  CheckCircle,
  Search,
  Calendar,
  User,
  Sparkles,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import type {
  StudentPlan,
  PlanWeek,
  PlanSession,
  StudentInfo,
  ExistingPlanSummary,
} from "./actions";
import {
  updateSession,
  deleteSession,
  addSession,
  updateWeekFocus,
} from "./actions";

// ---------- Constants ----------

const FOCUS_AREAS = ["FYS", "TEK", "SLAG", "SPILL", "TURN"] as const;

const DAY_NAMES = [
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lordag",
  "Sondag",
] as const;

const FOCUS_COLORS: Record<string, string> = {
  FYS: "bg-blue-100 text-blue-700 border-blue-200",
  TEK: "bg-emerald-100 text-emerald-700 border-emerald-200",
  SLAG: "bg-orange-100 text-orange-700 border-orange-200",
  SPILL: "bg-purple-100 text-purple-700 border-purple-200",
  TURN: "bg-rose-100 text-rose-700 border-rose-200",
};

const PERIOD_LABELS: Record<string, string> = {
  grunnperiode: "Grunnperiode",
  spesialiseringsperiode: "Spesialiseringsperiode",
  turneringsperiode: "Turneringsperiode",
};

// ---------- Props ----------

interface TreningsplanClientProps {
  // Oversikt-modus (alle planer)
  initialPlans?: ExistingPlanSummary[];
  // Elevspesifikk modus (redigering)
  plans?: StudentPlan[];
  student?: StudentInfo | null;
  studentId?: string;
}

// ---------- Main component ----------

export function TreningsplanClient({
  initialPlans,
  plans,
  student,
  studentId,
}: TreningsplanClientProps) {
  // Elevspesifikk modus med ukeredigering
  if (studentId && plans) {
    return (
      <StudentPlanEditor
        plans={plans}
        student={student ?? null}
        studentId={studentId}
      />
    );
  }

  // Oversiktsmodus
  return <PlanOverview initialPlans={initialPlans ?? []} />;
}

// ==========================================================
// Oversiktsvisning (alle planer)
// ==========================================================

function PlanOverview({
  initialPlans,
}: {
  initialPlans: ExistingPlanSummary[];
}) {
  const { toggle } = useMCSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState<
    "all" | "active" | "inactive"
  >("all");

  const filteredPlans = initialPlans.filter((p) => {
    const name = p.student?.name ?? p.student?.email ?? "";
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && p.isActive) ||
      (filterActive === "inactive" && !p.isActive);

    return matchesSearch && matchesFilter;
  });

  const activePlans = initialPlans.filter((p) => p.isActive).length;
  const aiPlans = initialPlans.filter((p) => p.aiGenerated).length;
  const manualPlans = initialPlans.filter((p) => !p.aiGenerated).length;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <MCTopbar
        title="Treningsplaner"
        subtitle="Opprett og administrer treningsplaner"
        onMenuClick={toggle}
      >
        <Link
          href="/admin/treningsplan/ny"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary)]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ny plan
        </Link>
      </MCTopbar>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-[var(--color-grey-200)] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--color-success)]/10">
                <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-muted)]">
                  Aktive planer
                </p>
                <p className="text-2xl font-semibold text-[var(--color-text)]">
                  {activePlans}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--color-grey-200)] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--color-ai)]/10">
                <Sparkles className="w-5 h-5 text-[var(--color-ai)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-muted)]">
                  AI-genererte
                </p>
                <p className="text-2xl font-semibold text-[var(--color-text)]">
                  {aiPlans}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--color-grey-200)] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--color-primary)]/10">
                <ClipboardList className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-muted)]">Manuelle</p>
                <p className="text-2xl font-semibold text-[var(--color-text)]">
                  {manualPlans}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
            <input
              type="text"
              placeholder="Sok etter elev eller plantittel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--color-grey-200)] bg-white text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "active", "inactive"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterActive(f)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                  filterActive === f
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-white border border-[var(--color-grey-200)] text-[var(--color-text)] hover:bg-[var(--color-grey-100)]"
                )}
              >
                {f === "all" ? "Alle" : f === "active" ? "Aktive" : "Inaktive"}
              </button>
            ))}
          </div>
        </div>

        {/* Plan list */}
        {filteredPlans.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-3" />
            <p className="text-[var(--color-text)] font-medium">
              Ingen treningsplaner funnet
            </p>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              {searchQuery
                ? "Prov et annet sokeord"
                : "Opprett den forste planen"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-xl border border-[var(--color-grey-200)] bg-white p-4 hover:border-[var(--color-primary)]/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-[var(--color-text)] truncate">
                        {plan.title}
                      </h3>
                      {plan.isActive && (
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-success)]/10 text-[var(--color-success)]">
                          Aktiv
                        </span>
                      )}
                      {plan.aiGenerated ? (
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-ai)]/10 text-[var(--color-ai)]">
                          AI
                        </span>
                      ) : (
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                          Manuell
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[var(--color-muted)]">
                      {plan.student?.name && (
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {plan.student.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(plan.startDate), "d. MMM", {
                          locale: nb,
                        })}
                        {" - "}
                        {format(new Date(plan.endDate), "d. MMM yyyy", {
                          locale: nb,
                        })}
                      </span>
                      <span>
                        {PERIOD_LABELS[plan.periodType] ?? plan.periodType}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================================
// Elevspesifikk redigering
// ==========================================================

function StudentPlanEditor({
  plans,
  student,
  studentId,
}: {
  plans: StudentPlan[];
  student: StudentInfo | null;
  studentId: string;
}) {
  const { toggle } = useMCSidebar();
  const [activePlanId, setActivePlanId] = useState<string | null>(
    plans.find((p) => p.isActive)?.id ?? plans[0]?.id ?? null
  );
  const [editingSession, setEditingSession] = useState<PlanSession | null>(
    null
  );
  const [addingToWeek, setAddingToWeek] = useState<{
    weekId: string;
    dayOfWeek: number;
  } | null>(null);
  const [editingWeekFocus, setEditingWeekFocus] = useState<string | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(
    new Set(plans.find((p) => p.isActive)?.weeks.map((w) => w.id) ?? [])
  );
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const activePlan = plans.find((p) => p.id === activePlanId) ?? null;

  function showFeedback(type: "success" | "error", message: string) {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  }

  function toggleWeek(weekId: string) {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekId)) {
        next.delete(weekId);
      } else {
        next.add(weekId);
      }
      return next;
    });
  }

  return (
    <>
      <MCTopbar
        title="Treningsplan"
        subtitle={student?.name ?? "Elev"}
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Back link */}
        <Link
          href={`/admin/elever/${studentId}`}
          className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbake til elevprofil
        </Link>

        {/* Feedback */}
        {feedback && (
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium",
              feedback.type === "success"
                ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                : "bg-[var(--color-error)]/10 text-[var(--color-error)]"
            )}
          >
            <CheckCircle className="w-4 h-4" />
            {feedback.message}
          </div>
        )}

        {/* No plans */}
        {plans.length === 0 && (
          <div className="hg-card p-8 text-center">
            <Target className="w-8 h-8 text-[var(--color-muted)] mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">
              Ingen treningsplaner
            </h3>
            <p className="text-xs text-[var(--color-muted)]">
              Denne eleven har ingen treningsplaner enna. Generer en via
              AI-verktoyene.
            </p>
          </div>
        )}

        {/* Plan selector */}
        {plans.length > 1 && (
          <div className="hg-card p-4">
            <h3 className="hg-label mb-3">Velg plan</h3>
            <div className="flex gap-2 flex-wrap">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => {
                    setActivePlanId(plan.id);
                    setExpandedWeeks(new Set(plan.weeks.map((w) => w.id)));
                    setEditingSession(null);
                    setAddingToWeek(null);
                  }}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border",
                    activePlanId === plan.id
                      ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                      : "bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-grey-300)] hover:border-[var(--color-primary)]"
                  )}
                >
                  {plan.title}
                  {plan.isActive && (
                    <span className="ml-1.5 text-[10px] opacity-70">
                      (aktiv)
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active plan header */}
        {activePlan && (
          <div className="hg-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-[var(--color-text)]">
                    {activePlan.title}
                  </h2>
                  {activePlan.aiGenerated && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-[var(--color-ai)]/10 text-[var(--color-ai)] font-medium">
                      AI-generert
                    </span>
                  )}
                  {activePlan.isActive && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-[var(--color-success)]/10 text-[var(--color-success)] font-medium">
                      Aktiv
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--color-muted)]">
                  {format(new Date(activePlan.startDate), "d. MMM yyyy", {
                    locale: nb,
                  })}{" "}
                  &ndash;{" "}
                  {format(new Date(activePlan.endDate), "d. MMM yyyy", {
                    locale: nb,
                  })}{" "}
                  &middot; {activePlan.periodType} &middot;{" "}
                  {activePlan.weeks.length} uker
                </p>
                {activePlan.description && (
                  <p className="text-sm text-[var(--color-text)] mt-2">
                    {activePlan.description}
                  </p>
                )}
              </div>
              <button className="hg-btn hg-btn-secondary text-xs">
                <Copy className="w-3.5 h-3.5" />
                Kopier plan
              </button>
            </div>
          </div>
        )}

        {/* Weeks */}
        {activePlan?.weeks.map((week) => (
          <WeekCard
            key={week.id}
            week={week}
            expanded={expandedWeeks.has(week.id)}
            onToggle={() => toggleWeek(week.id)}
            editingSession={editingSession}
            onEditSession={setEditingSession}
            addingToWeek={addingToWeek}
            onAddToWeek={setAddingToWeek}
            editingWeekFocus={editingWeekFocus}
            onEditWeekFocus={setEditingWeekFocus}
            isPending={isPending}
            startTransition={startTransition}
            showFeedback={showFeedback}
          />
        ))}
      </div>
    </>
  );
}

// ---------- Week card ----------

interface WeekCardProps {
  week: PlanWeek;
  expanded: boolean;
  onToggle: () => void;
  editingSession: PlanSession | null;
  onEditSession: (s: PlanSession | null) => void;
  addingToWeek: { weekId: string; dayOfWeek: number } | null;
  onAddToWeek: (v: { weekId: string; dayOfWeek: number } | null) => void;
  editingWeekFocus: string | null;
  onEditWeekFocus: (id: string | null) => void;
  isPending: boolean;
  startTransition: (cb: () => void) => void;
  showFeedback: (type: "success" | "error", msg: string) => void;
}

function WeekCard({
  week,
  expanded,
  onToggle,
  editingSession,
  onEditSession,
  addingToWeek,
  onAddToWeek,
  editingWeekFocus,
  onEditWeekFocus,
  isPending,
  startTransition,
  showFeedback,
}: WeekCardProps) {
  const [weekFocusValue, setWeekFocusValue] = useState(week.focus ?? "");

  const sessionsByDay = new Map<number, PlanSession[]>();
  for (const s of week.sessions) {
    const arr = sessionsByDay.get(s.dayOfWeek) ?? [];
    arr.push(s);
    sessionsByDay.set(s.dayOfWeek, arr);
  }

  function handleSaveWeekFocus() {
    startTransition(async () => {
      const result = await updateWeekFocus(week.id, weekFocusValue);
      if (result.success) {
        onEditWeekFocus(null);
        showFeedback("success", "Ukefokus oppdatert");
      } else {
        showFeedback("error", result.error ?? "Feil ved oppdatering");
      }
    });
  }

  function handleDeleteSession(sessionId: string) {
    if (!confirm("Er du sikker pa at du vil slette denne sesjonen?")) return;
    startTransition(async () => {
      const result = await deleteSession(sessionId);
      if (result.success) {
        onEditSession(null);
        showFeedback("success", "Sesjon slettet");
      } else {
        showFeedback("error", result.error ?? "Feil ved sletting");
      }
    });
  }

  return (
    <div className="hg-card overflow-hidden">
      {/* Week header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-grey-100)] transition-colors"
      >
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-[var(--color-muted)]" />
        ) : (
          <ChevronRight className="w-4 h-4 text-[var(--color-muted)]" />
        )}
        <div className="flex-1 flex items-center gap-3">
          <span className="text-sm font-semibold text-[var(--color-text)]">
            Uke {week.weekNumber}
          </span>
          <span className="text-xs text-[var(--color-muted)]">
            {format(new Date(week.weekStart), "d. MMM", { locale: nb })}
          </span>
          {week.focus && (
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium">
              {week.focus}
            </span>
          )}
          {week.volumeLabel && (
            <span className="text-[10px] text-[var(--color-muted)]">
              {week.volumeLabel}
            </span>
          )}
        </div>
        <span className="text-xs text-[var(--color-muted)]">
          {week.sessions.length} sesjoner
        </span>
      </button>

      {expanded && (
        <div className="border-t border-[var(--color-grey-200)]">
          {/* Week focus edit */}
          {editingWeekFocus === week.id ? (
            <div className="px-4 py-3 bg-[var(--color-grey-100)] flex items-center gap-2">
              <input
                type="text"
                value={weekFocusValue}
                onChange={(e) => setWeekFocusValue(e.target.value)}
                placeholder="Ukefokus (f.eks. Putting, Kort spill)"
                className="flex-1 px-3 py-1.5 text-sm bg-white border border-[var(--color-grey-300)] rounded-lg text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
              />
              <button
                onClick={handleSaveWeekFocus}
                disabled={isPending}
                className="hg-btn hg-btn-primary text-xs"
              >
                <Save className="w-3.5 h-3.5" />
                {isPending ? "Lagrer..." : "Lagre"}
              </button>
              <button
                onClick={() => onEditWeekFocus(null)}
                className="hg-btn hg-btn-secondary text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="px-4 py-2 bg-[var(--color-grey-100)] flex items-center justify-between">
              <span className="text-xs text-[var(--color-muted)]">
                Fokus: {week.focus || "Ikke satt"}
              </span>
              <button
                onClick={() => {
                  setWeekFocusValue(week.focus ?? "");
                  onEditWeekFocus(week.id);
                }}
                className="text-xs text-[var(--color-primary)] hover:underline"
              >
                Endre fokus
              </button>
            </div>
          )}

          {/* Days grid */}
          <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-[var(--color-grey-200)]">
            {DAY_NAMES.map((dayName, idx) => {
              const dayOfWeek = idx + 1;
              const daySessions = sessionsByDay.get(dayOfWeek) ?? [];

              return (
                <div key={dayOfWeek} className="min-h-[120px]">
                  <div className="px-3 py-2 border-b border-[var(--color-grey-200)] bg-[var(--color-surface)]">
                    <span className="text-[10px] font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                      {dayName}
                    </span>
                  </div>
                  <div className="p-2 space-y-1.5">
                    {daySessions.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        isEditing={editingSession?.id === session.id}
                        onEdit={() => onEditSession(session)}
                        onDelete={() => handleDeleteSession(session.id)}
                        onSave={(data) => {
                          startTransition(async () => {
                            const result = await updateSession(
                              session.id,
                              data
                            );
                            if (result.success) {
                              onEditSession(null);
                              showFeedback("success", "Sesjon oppdatert");
                            } else {
                              showFeedback(
                                "error",
                                result.error ?? "Feil ved oppdatering"
                              );
                            }
                          });
                        }}
                        onCancel={() => onEditSession(null)}
                        isPending={isPending}
                      />
                    ))}

                    {/* Add session */}
                    {addingToWeek?.weekId === week.id &&
                    addingToWeek?.dayOfWeek === dayOfWeek ? (
                      <AddSessionForm
                        isPending={isPending}
                        onSave={(data) => {
                          startTransition(async () => {
                            const result = await addSession(week.id, {
                              dayOfWeek,
                              ...data,
                            });
                            if (result.success) {
                              onAddToWeek(null);
                              showFeedback("success", "Sesjon lagt til");
                            } else {
                              showFeedback(
                                "error",
                                result.error ?? "Feil ved oppretting"
                              );
                            }
                          });
                        }}
                        onCancel={() => onAddToWeek(null)}
                      />
                    ) : (
                      <button
                        onClick={() =>
                          onAddToWeek({ weekId: week.id, dayOfWeek })
                        }
                        className="w-full flex items-center justify-center gap-1 py-1.5 text-[10px] text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 rounded transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Legg til
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Session card ----------

interface SessionCardProps {
  session: PlanSession;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSave: (data: {
    title?: string;
    durationMinutes?: number;
    focusArea?: string;
    description?: string;
  }) => void;
  onCancel: () => void;
  isPending: boolean;
}

function SessionCard({
  session,
  isEditing,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  isPending,
}: SessionCardProps) {
  const [title, setTitle] = useState(session.title);
  const [duration, setDuration] = useState(
    session.durationMinutes?.toString() ?? ""
  );
  const [focusArea, setFocusArea] = useState(session.focusArea ?? "");
  const [description, setDescription] = useState(session.description ?? "");

  const focusColor =
    FOCUS_COLORS[session.focusArea ?? ""] ??
    "bg-[var(--color-grey-200)] text-[var(--color-text)] border-[var(--color-grey-300)]";

  if (isEditing) {
    return (
      <div className="p-2 bg-white border border-[var(--color-primary)]/30 rounded-lg space-y-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tittel"
          className="w-full px-2 py-1 text-xs bg-[var(--color-surface)] border border-[var(--color-grey-300)] rounded text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
        />
        <div className="flex gap-1.5">
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Min"
            className="w-14 px-2 py-1 text-xs bg-[var(--color-surface)] border border-[var(--color-grey-300)] rounded text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
          />
          <select
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value)}
            className="flex-1 px-2 py-1 text-xs bg-[var(--color-surface)] border border-[var(--color-grey-300)] rounded text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
          >
            <option value="">Velg fokus</option>
            {FOCUS_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beskrivelse (valgfritt)"
          rows={2}
          className="w-full px-2 py-1 text-xs bg-[var(--color-surface)] border border-[var(--color-grey-300)] rounded text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] resize-none"
        />
        <div className="flex items-center gap-1.5">
          <button
            onClick={() =>
              onSave({
                title,
                durationMinutes: duration ? parseInt(duration, 10) : undefined,
                focusArea: focusArea || undefined,
                description: description || undefined,
              })
            }
            disabled={isPending || !title.trim()}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-[10px] font-medium bg-[var(--color-primary)] text-white rounded hover:opacity-90 disabled:opacity-50"
          >
            <Save className="w-3 h-3" />
            {isPending ? "Lagrer..." : "Lagre"}
          </button>
          <button
            onClick={onCancel}
            className="px-2 py-1 text-[10px] text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            Avbryt
          </button>
          <button
            onClick={onDelete}
            disabled={isPending}
            className="p-1 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onEdit}
      className={cn(
        "w-full text-left p-2 rounded-lg border transition-colors hover:shadow-sm",
        focusColor
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <span className="text-[11px] font-semibold leading-tight line-clamp-2">
          {session.title}
        </span>
      </div>
      {session.durationMinutes && (
        <div className="flex items-center gap-1 mt-1">
          <Clock className="w-2.5 h-2.5 opacity-60" />
          <span className="text-[10px] opacity-70">
            {session.durationMinutes} min
          </span>
        </div>
      )}
      {session.focusArea && (
        <span className="text-[9px] font-medium uppercase tracking-wider opacity-60 mt-0.5 block">
          {session.focusArea}
        </span>
      )}
    </button>
  );
}

// ---------- Add session form ----------

interface AddSessionFormProps {
  isPending: boolean;
  onSave: (data: {
    title: string;
    durationMinutes: number;
    focusArea: string;
  }) => void;
  onCancel: () => void;
}

function AddSessionForm({ isPending, onSave, onCancel }: AddSessionFormProps) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("30");
  const [focusArea, setFocusArea] = useState<string>("");

  return (
    <div className="p-2 bg-white border border-dashed border-[var(--color-primary)]/40 rounded-lg space-y-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tittel pa sesjon"
        autoFocus
        className="w-full px-2 py-1 text-xs bg-[var(--color-surface)] border border-[var(--color-grey-300)] rounded text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
      />
      <div className="flex gap-1.5">
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Min"
          className="w-14 px-2 py-1 text-xs bg-[var(--color-surface)] border border-[var(--color-grey-300)] rounded text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
        />
        <select
          value={focusArea}
          onChange={(e) => setFocusArea(e.target.value)}
          className="flex-1 px-2 py-1 text-xs bg-[var(--color-surface)] border border-[var(--color-grey-300)] rounded text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
        >
          <option value="">Velg fokus</option>
          {FOCUS_AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-1.5">
        <button
          onClick={() =>
            onSave({
              title,
              durationMinutes: parseInt(duration, 10) || 30,
              focusArea,
            })
          }
          disabled={isPending || !title.trim()}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-[10px] font-medium bg-[var(--color-primary)] text-white rounded hover:opacity-90 disabled:opacity-50"
        >
          <Plus className="w-3 h-3" />
          {isPending ? "Legger til..." : "Legg til"}
        </button>
        <button
          onClick={onCancel}
          className="px-2 py-1 text-[10px] text-[var(--color-muted)] hover:text-[var(--color-text)]"
        >
          Avbryt
        </button>
      </div>
    </div>
  );
}
