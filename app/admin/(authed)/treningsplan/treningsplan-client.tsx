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
import {
  AdminCard,
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminBadge,
  AdminStatCard,
  AdminPageHeader,
  AdminEmptyState,
} from "@/components/portal/mission-control/ui";
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
  duplicatePlan,
} from "./actions";

// ---------- Constants ----------

type FocusArea = "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN";

const FOCUS_AREAS: FocusArea[] = ["FYS", "TEK", "SLAG", "SPILL", "TURN"];

const DAY_NAMES = [
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lørdag",
  "Søndag",
] as const;

const FOCUS_VARIANT: Record<
  FocusArea,
  "info" | "success" | "warning" | "error" | "muted"
> = {
  FYS: "info",
  TEK: "success",
  SLAG: "warning",
  SPILL: "error",
  TURN: "muted",
};

const FOCUS_BG: Record<FocusArea, string> = {
  FYS: "bg-[var(--color-primary)]/5 border-[var(--color-primary)]/20",
  TEK: "bg-[var(--color-success)]/5 border-[var(--color-success)]/20",
  SLAG: "bg-[var(--color-warning)]/5 border-[var(--color-warning)]/20",
  SPILL: "bg-[var(--color-error)]/5 border-[var(--color-error)]/20",
  TURN: "bg-[var(--color-grey-100)] border-[var(--color-grey-300)]",
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
  if (studentId && plans) {
    return (
      <StudentPlanEditor
        plans={plans}
        student={student ?? null}
        studentId={studentId}
      />
    );
  }

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
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(q) ||
      name.toLowerCase().includes(q);

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
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--color-grey-50)]">
        <AdminPageHeader
          title="Treningsplaner"
          subtitle="Oversikt over alle aktive og tidligere treningsplaner"
          actions={
            <Link href="/admin/treningsplan/ny">
              <AdminButton
                variant="primary"
                icon={<Plus className="w-4 h-4" />}
              >
                Ny plan
              </AdminButton>
            </Link>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AdminStatCard
            label="Aktive planer"
            value={activePlans}
            icon={<CheckCircle className="w-5 h-5" />}
          />
          <AdminStatCard
            label="AI-genererte"
            value={aiPlans}
            icon={<Sparkles className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Manuelle"
            value={manualPlans}
            icon={<ClipboardList className="w-5 h-5" />}
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-grey-400)] pointer-events-none" />
              <AdminInput
                type="text"
                placeholder="Søk etter elev eller plantittel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "active", "inactive"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilterActive(f)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors border",
                    filterActive === f
                      ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                      : "bg-white border-[var(--color-grey-200)] text-[var(--color-grey-700)] hover:bg-[var(--color-grey-100)]",
                  )}
                >
                  {f === "all" ? "Alle" : f === "active" ? "Aktive" : "Inaktive"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plan list */}
        {filteredPlans.length === 0 ? (
          <AdminEmptyState
            icon={<ClipboardList className="w-6 h-6" />}
            title="Ingen treningsplaner funnet"
            description={
              searchQuery
                ? "Prøv et annet søkeord"
                : "Opprett den første planen for å komme i gang."
            }
            action={
              !searchQuery ? (
                <Link href="/admin/treningsplan/ny">
                  <AdminButton
                    variant="primary"
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Ny plan
                  </AdminButton>
                </Link>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-xl shadow-card p-4 transition-all hover:shadow-md hover:border-[var(--color-grey-300)] border border-[var(--color-grey-200)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-medium text-[var(--color-grey-900)] truncate">
                        {plan.title}
                      </h3>
                      {plan.isActive && (
                        <AdminBadge variant="success">Aktiv</AdminBadge>
                      )}
                      {plan.aiGenerated ? (
                        <AdminBadge variant="info">AI</AdminBadge>
                      ) : (
                        <AdminBadge variant="muted">Manuell</AdminBadge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[var(--color-grey-500)] flex-wrap">
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
                      <span className="text-[var(--color-grey-600)]">
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
    plans.find((p) => p.isActive)?.id ?? plans[0]?.id ?? null,
  );
  const [editingSession, setEditingSession] = useState<PlanSession | null>(
    null,
  );
  const [addingToWeek, setAddingToWeek] = useState<{
    weekId: string;
    dayOfWeek: number;
  } | null>(null);
  const [editingWeekFocus, setEditingWeekFocus] = useState<string | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(
    new Set(plans.find((p) => p.isActive)?.weeks.map((w) => w.id) ?? []),
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

  async function handleDuplicatePlan() {
    if (!activePlanId || !studentId) return;
    startTransition(async () => {
      const result = await duplicatePlan(activePlanId, studentId);
      if (result.success) {
        showFeedback("success", "Plan kopiert");
      } else {
        showFeedback("error", result.error ?? "Kunne ikke kopiere plan");
      }
    });
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

      <div className="p-6 space-y-6 bg-[var(--color-grey-50)] min-h-[calc(100vh-56px)]">
        <AdminPageHeader
          title={student?.name ?? "Treningsplan"}
          subtitle="Rediger uker, økter og fokus for eleven"
          breadcrumbs={[
            { label: "Elever", href: "/admin/elever" },
            { label: student?.name ?? "Elev", href: `/admin/elever/${studentId}` },
            { label: "Treningsplan" },
          ]}
        />

        {/* Back link */}
        <Link
          href={`/admin/elever/${studentId}`}
          className="inline-flex items-center gap-1 text-sm text-[var(--color-grey-500)] hover:text-[var(--color-grey-700)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbake til elevprofil
        </Link>

        {/* Feedback */}
        {feedback && (
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border",
              feedback.type === "success"
                ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20"
                : "bg-[var(--color-error)]/10 text-[var(--color-error)] border-[var(--color-error)]/20",
            )}
          >
            <CheckCircle className="w-4 h-4" />
            {feedback.message}
          </div>
        )}

        {/* No plans */}
        {plans.length === 0 && (
          <AdminEmptyState
            icon={<Target className="w-6 h-6" />}
            title="Ingen treningsplaner"
            description="Denne eleven har ingen treningsplaner ennå. Generer en via AI-verktøyene eller opprett en manuelt."
            action={
              <Link href={`/admin/treningsplan/ny?studentId=${studentId}`}>
                <AdminButton variant="primary" icon={<Plus className="w-4 h-4" />}>
                  Ny plan
                </AdminButton>
              </Link>
            }
          />
        )}

        {/* Plan selector */}
        {plans.length > 1 && (
          <div className="bg-white rounded-xl shadow-card p-4">
            <h3 className="admin-label mb-3">Velg plan</h3>
            <div className="flex gap-2 flex-wrap">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
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
                      : "bg-white text-[var(--color-grey-700)] border-[var(--color-grey-200)] hover:border-[var(--color-primary)]",
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
          <div className="bg-white rounded-xl shadow-card p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="text-lg font-bold text-[var(--color-grey-900)]">
                    {activePlan.title}
                  </h2>
                  {activePlan.aiGenerated && (
                    <AdminBadge variant="info">AI-generert</AdminBadge>
                  )}
                  {activePlan.isActive && (
                    <AdminBadge variant="success">Aktiv</AdminBadge>
                  )}
                </div>
                <p className="text-xs text-[var(--color-grey-500)]">
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
                  <p className="text-sm text-[var(--color-grey-700)] mt-2">
                    {activePlan.description}
                  </p>
                )}
              </div>
              <AdminButton
                variant="secondary"
                icon={<Copy className="w-3.5 h-3.5" />}
                onClick={handleDuplicatePlan}
                disabled={isPending}
              >
                {isPending ? "Kopierer..." : "Kopier plan"}
              </AdminButton>
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
    if (!confirm("Er du sikker på at du vil slette denne sesjonen?")) return;
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
    <div className="bg-white rounded-xl shadow-card border border-[var(--color-grey-200)] overflow-hidden">
      {/* Week header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-grey-100)] transition-colors"
      >
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-[var(--color-grey-400)]" />
        ) : (
          <ChevronRight className="w-4 h-4 text-[var(--color-grey-400)]" />
        )}
        <div className="flex-1 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-[var(--color-grey-900)]">
            Uke {week.weekNumber}
          </span>
          <span className="text-xs text-[var(--color-grey-500)]">
            {format(new Date(week.weekStart), "d. MMM", { locale: nb })}
          </span>
          {week.focus && (
            <AdminBadge variant="info">{week.focus}</AdminBadge>
          )}
          {week.volumeLabel && (
            <span className="text-[10px] text-[var(--color-grey-400)]">
              {week.volumeLabel}
            </span>
          )}
        </div>
        <span className="text-xs text-[var(--color-grey-500)]">
          {week.sessions.length} sesjoner
        </span>
      </button>

      {expanded && (
        <div className="border-t border-[var(--color-grey-200)]">
          {/* Week focus edit */}
          {editingWeekFocus === week.id ? (
            <div className="px-4 py-3 bg-[var(--color-grey-100)] flex items-center gap-2">
              <div className="flex-1">
                <AdminInput
                  type="text"
                  value={weekFocusValue}
                  onChange={(e) => setWeekFocusValue(e.target.value)}
                  placeholder="Ukefokus (f.eks. Putting, Kort spill)"
                />
              </div>
              <AdminButton
                variant="primary"
                onClick={handleSaveWeekFocus}
                disabled={isPending}
                icon={<Save className="w-3.5 h-3.5" />}
              >
                {isPending ? "Lagrer..." : "Lagre"}
              </AdminButton>
              <AdminButton
                variant="secondary"
                onClick={() => onEditWeekFocus(null)}
                aria-label="Avbryt"
              >
                <X className="w-3.5 h-3.5" />
              </AdminButton>
            </div>
          ) : (
            <div className="px-4 py-2 bg-[var(--color-grey-100)] flex items-center justify-between">
              <span className="text-xs text-[var(--color-grey-600)]">
                Fokus: {week.focus || "Ikke satt"}
              </span>
              <button
                type="button"
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
                  <div className="px-3 py-2 border-b border-[var(--color-grey-200)] bg-white">
                    <span className="text-[10px] font-semibold text-[var(--color-grey-500)] uppercase tracking-wider">
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
                              data,
                            );
                            if (result.success) {
                              onEditSession(null);
                              showFeedback("success", "Sesjon oppdatert");
                            } else {
                              showFeedback(
                                "error",
                                result.error ?? "Feil ved oppdatering",
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
                                result.error ?? "Feil ved oppretting",
                              );
                            }
                          });
                        }}
                        onCancel={() => onAddToWeek(null)}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          onAddToWeek({ weekId: week.id, dayOfWeek })
                        }
                        className="w-full flex items-center justify-center gap-1 py-1.5 text-[10px] text-[var(--color-grey-500)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 rounded transition-colors"
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
    session.durationMinutes?.toString() ?? "",
  );
  const [focusArea, setFocusArea] = useState(session.focusArea ?? "");
  const [description, setDescription] = useState(session.description ?? "");

  const focusKey = (session.focusArea ?? "") as FocusArea;
  const bgClass =
    FOCUS_BG[focusKey] ??
    "bg-white border-[var(--color-grey-300)]";
  const variant = FOCUS_VARIANT[focusKey] ?? "muted";

  if (isEditing) {
    return (
      <div className="p-2 bg-white border border-[var(--color-primary)]/40 rounded-lg space-y-2">
        <AdminInput
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tittel"
          className="text-xs !py-1.5"
        />
        <div className="flex gap-1.5">
          <AdminInput
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Min"
            className="text-xs !py-1.5 w-20"
          />
          <AdminSelect
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value)}
            className="text-xs !py-1.5 flex-1"
          >
            <option value="">Velg fokus</option>
            {FOCUS_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </AdminSelect>
        </div>
        <AdminTextarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beskrivelse (valgfritt)"
          rows={2}
          className="text-xs !py-1.5"
        />
        <div className="flex items-center gap-1.5">
          <button
            type="button"
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
            type="button"
            onClick={onCancel}
            className="px-2 py-1 text-[10px] text-[var(--color-grey-500)] hover:text-[var(--color-grey-700)]"
          >
            Avbryt
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isPending}
            className="p-1 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded"
            aria-label="Slett sesjon"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onEdit}
      className={cn(
        "w-full text-left p-2 rounded-lg border transition-colors hover:shadow-sm",
        bgClass,
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <span className="text-[11px] font-semibold leading-tight line-clamp-2 text-[var(--color-grey-900)]">
          {session.title}
        </span>
      </div>
      {session.durationMinutes && (
        <div className="flex items-center gap-1 mt-1">
          <Clock className="w-2.5 h-2.5 text-[var(--color-grey-500)]" />
          <span className="text-[10px] text-[var(--color-grey-500)]">
            {session.durationMinutes} min
          </span>
        </div>
      )}
      {session.focusArea && (
        <div className="mt-1">
          <AdminBadge variant={variant}>{session.focusArea}</AdminBadge>
        </div>
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
      <AdminInput
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tittel på sesjon"
        autoFocus
        className="text-xs !py-1.5"
      />
      <div className="flex gap-1.5">
        <AdminInput
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Min"
          className="text-xs !py-1.5 w-20"
        />
        <AdminSelect
          value={focusArea}
          onChange={(e) => setFocusArea(e.target.value)}
          className="text-xs !py-1.5 flex-1"
        >
          <option value="">Velg fokus</option>
          {FOCUS_AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </AdminSelect>
      </div>
      <div className="flex gap-1.5">
        <button
          type="button"
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
          type="button"
          onClick={onCancel}
          className="px-2 py-1 text-[10px] text-[var(--color-grey-500)] hover:text-[var(--color-grey-700)]"
        >
          Avbryt
        </button>
      </div>
    </div>
  );
}
