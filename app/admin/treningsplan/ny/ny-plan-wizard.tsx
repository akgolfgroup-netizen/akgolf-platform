"use client";

import { useState, useTransition } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Loader2,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { useRouter } from "next/navigation";
import { createManualPlan } from "../actions";
import type {
  StudentOption,
  DrillOption,
  ManualPlanWeek,
  ManualPlanSession,
  ManualPlanExercise,
} from "../actions";
import { DrillPicker } from "./drill-picker";

const PERIOD_TYPES = [
  { value: "grunnperiode", label: "Grunnperiode" },
  { value: "spesialiseringsperiode", label: "Spesialiseringsperiode" },
  { value: "turneringsperiode", label: "Turneringsperiode" },
] as const;

const FOCUS_AREAS = ["FYS", "TEK", "SLAG", "SPILL", "TURN"] as const;

const DAY_LABELS: Record<number, string> = {
  1: "Mandag",
  2: "Tirsdag",
  3: "Onsdag",
  4: "Torsdag",
  5: "Fredag",
  6: "Lordag",
  0: "Sondag",
};

interface NyPlanWizardProps {
  students: StudentOption[];
  drills: DrillOption[];
  preselectedStudentId: string | null;
}

type WizardStep = 1 | 2 | 3;

function createEmptySession(): ManualPlanSession {
  return {
    dayOfWeek: 1,
    title: "",
    durationMinutes: 60,
    focusArea: "TEK",
    exercises: [],
  };
}

function createEmptyWeek(): ManualPlanWeek {
  return {
    focus: "",
    volumeLabel: "",
    sessions: [createEmptySession()],
  };
}

export function NyPlanWizard({ students, drills, preselectedStudentId }: NyPlanWizardProps) {
  const { toggle } = useMCSidebar();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Wizard state
  const [step, setStep] = useState<WizardStep>(1);

  // Step 1: Metadata
  const [studentId, setStudentId] = useState(preselectedStudentId ?? "");
  const [title, setTitle] = useState("");
  const [periodType, setPeriodType] = useState("grunnperiode");
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    // Neste mandag
    const dayOfWeek = d.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    d.setDate(d.getDate() + daysUntilMonday);
    return d.toISOString().split("T")[0];
  });

  // Step 2: Weeks & sessions
  const [weeks, setWeeks] = useState<ManualPlanWeek[]>(() =>
    Array.from({ length: 4 }, () => createEmptyWeek())
  );

  // Drill picker state
  const [drillPickerOpen, setDrillPickerOpen] = useState<{
    weekIndex: number;
    sessionIndex: number;
  } | null>(null);

  // Sync weeks array when durationWeeks changes
  function handleDurationChange(newDuration: number) {
    setDurationWeeks(newDuration);
    setWeeks((prev) => {
      if (newDuration > prev.length) {
        return [
          ...prev,
          ...Array.from({ length: newDuration - prev.length }, () => createEmptyWeek()),
        ];
      }
      return prev.slice(0, newDuration);
    });
  }

  // Session management
  function addSession(weekIndex: number) {
    setWeeks((prev) =>
      prev.map((w, i) =>
        i === weekIndex ? { ...w, sessions: [...w.sessions, createEmptySession()] } : w
      )
    );
  }

  function removeSession(weekIndex: number, sessionIndex: number) {
    setWeeks((prev) =>
      prev.map((w, i) =>
        i === weekIndex
          ? { ...w, sessions: w.sessions.filter((_, si) => si !== sessionIndex) }
          : w
      )
    );
  }

  function updateSession(
    weekIndex: number,
    sessionIndex: number,
    updates: Partial<ManualPlanSession>
  ) {
    setWeeks((prev) =>
      prev.map((w, i) =>
        i === weekIndex
          ? {
              ...w,
              sessions: w.sessions.map((s, si) =>
                si === sessionIndex ? { ...s, ...updates } : s
              ),
            }
          : w
      )
    );
  }

  function updateWeek(weekIndex: number, updates: Partial<ManualPlanWeek>) {
    setWeeks((prev) => prev.map((w, i) => (i === weekIndex ? { ...w, ...updates } : w)));
  }

  function addExercisesToSession(
    weekIndex: number,
    sessionIndex: number,
    newExercises: ManualPlanExercise[]
  ) {
    setWeeks((prev) =>
      prev.map((w, i) =>
        i === weekIndex
          ? {
              ...w,
              sessions: w.sessions.map((s, si) =>
                si === sessionIndex
                  ? { ...s, exercises: [...(s.exercises ?? []), ...newExercises] }
                  : s
              ),
            }
          : w
      )
    );
  }

  function removeExercise(weekIndex: number, sessionIndex: number, exerciseIndex: number) {
    setWeeks((prev) =>
      prev.map((w, i) =>
        i === weekIndex
          ? {
              ...w,
              sessions: w.sessions.map((s, si) =>
                si === sessionIndex
                  ? {
                      ...s,
                      exercises: (s.exercises ?? []).filter((_, ei) => ei !== exerciseIndex),
                    }
                  : s
              ),
            }
          : w
      )
    );
  }

  // Validation
  const step1Valid = studentId && title.trim() && startDate && durationWeeks > 0;
  const step2Valid = weeks.every(
    (w) => w.focus.trim() && w.sessions.length > 0 && w.sessions.every((s) => s.title.trim())
  );

  // Submit
  function handleSubmit() {
    startTransition(async () => {
      const result = await createManualPlan({
        studentId,
        title,
        periodType,
        startDate,
        durationWeeks,
        weeks,
      });

      if (result.success) {
        router.push(
          studentId
            ? `/admin/treningsplan?studentId=${studentId}`
            : "/admin/treningsplan"
        );
      }
    });
  }

  const selectedStudent = students.find((s) => s.id === studentId);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <MCTopbar title="Ny treningsplan" subtitle="Manuell opprettelse" onMenuClick={toggle} />

      <div className="flex-1 overflow-y-auto">
        {/* Step indicator */}
        <div className="border-b border-[var(--color-grey-200)] bg-white px-6 py-4">
          <div className="flex items-center gap-2 max-w-2xl mx-auto">
            {([1, 2, 3] as const).map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step === s
                      ? "bg-[var(--color-primary)] text-white"
                      : step > s
                        ? "bg-[var(--color-success)] text-white"
                        : "bg-[var(--color-grey-200)] text-[var(--color-muted)]"
                  )}
                >
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                <span
                  className={cn(
                    "text-sm hidden sm:block",
                    step === s ? "text-[var(--color-text)] font-medium" : "text-[var(--color-muted)]"
                  )}
                >
                  {s === 1 ? "Grunninfo" : s === 2 ? "Uker og okter" : "Bekreft"}
                </span>
                {s < 3 && (
                  <div className="flex-1 h-px bg-[var(--color-grey-200)] mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 max-w-3xl mx-auto space-y-6">
          {/* Step 1: Metadata */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[var(--color-grey-200)] bg-white p-6 space-y-5">
                <h2 className="text-lg font-semibold text-[var(--color-text)]">Grunnleggende info</h2>

                {/* Student */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Elev
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
                    <select
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[var(--color-grey-200)] bg-white text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] appearance-none"
                    >
                      <option value="">Velg elev...</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name ?? s.email ?? s.id}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)] pointer-events-none" />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Plantittel
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="F.eks. Grunnperiode V2026"
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-grey-200)] bg-white text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                  />
                </div>

                {/* Period type */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Periodetype
                  </label>
                  <div className="flex gap-2">
                    {PERIOD_TYPES.map((pt) => (
                      <button
                        key={pt.value}
                        onClick={() => setPeriodType(pt.value)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                          periodType === pt.value
                            ? "bg-[var(--color-primary)] text-white"
                            : "bg-white border border-[var(--color-grey-200)] text-[var(--color-text)] hover:bg-[var(--color-grey-100)]"
                        )}
                      >
                        {pt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start date & duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                      Startdato
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-grey-200)] bg-white text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                      Antall uker
                    </label>
                    <select
                      value={durationWeeks}
                      onChange={(e) => handleDurationChange(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-grey-200)] bg-white text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] appearance-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "uke" : "uker"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Weeks & sessions */}
          {step === 2 && (
            <div className="space-y-6">
              {weeks.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  className="rounded-xl border border-[var(--color-grey-200)] bg-white overflow-hidden"
                >
                  {/* Week header */}
                  <div className="px-5 py-4 bg-[var(--color-grey-100)] border-b border-[var(--color-grey-200)]">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-[var(--color-text)]">
                        Uke {weekIndex + 1}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-[var(--color-muted)] mb-1">
                          Ukefokus
                        </label>
                        <input
                          type="text"
                          value={week.focus}
                          onChange={(e) => updateWeek(weekIndex, { focus: e.target.value })}
                          placeholder="F.eks. Kort spill og putting"
                          className="w-full px-3 py-2 rounded-lg border border-[var(--color-grey-200)] bg-white text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[var(--color-muted)] mb-1">
                          Volum
                        </label>
                        <input
                          type="text"
                          value={week.volumeLabel ?? ""}
                          onChange={(e) => updateWeek(weekIndex, { volumeLabel: e.target.value })}
                          placeholder="F.eks. Hoy, Middels, Lav"
                          className="w-full px-3 py-2 rounded-lg border border-[var(--color-grey-200)] bg-white text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sessions */}
                  <div className="p-5 space-y-4">
                    {week.sessions.map((session, sessionIndex) => (
                      <div
                        key={sessionIndex}
                        className="rounded-lg border border-[var(--color-grey-200)] p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">
                            Okt {sessionIndex + 1}
                          </span>
                          {week.sessions.length > 1 && (
                            <button
                              onClick={() => removeSession(weekIndex, sessionIndex)}
                              className="p-1 rounded text-[var(--color-error)] hover:bg-[var(--color-error)]/10 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-[var(--color-muted)] mb-1">
                              Tittel
                            </label>
                            <input
                              type="text"
                              value={session.title}
                              onChange={(e) =>
                                updateSession(weekIndex, sessionIndex, { title: e.target.value })
                              }
                              placeholder="F.eks. Teknikkokt"
                              className="w-full px-3 py-2 rounded-lg border border-[var(--color-grey-200)] bg-white text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[var(--color-muted)] mb-1">
                              Dag
                            </label>
                            <select
                              value={session.dayOfWeek}
                              onChange={(e) =>
                                updateSession(weekIndex, sessionIndex, {
                                  dayOfWeek: Number(e.target.value),
                                })
                              }
                              className="w-full px-3 py-2 rounded-lg border border-[var(--color-grey-200)] bg-white text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] appearance-none"
                            >
                              {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                                <option key={d} value={d}>
                                  {DAY_LABELS[d]}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-[var(--color-muted)] mb-1">
                              Varighet (min)
                            </label>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-muted)]" />
                              <input
                                type="number"
                                min={10}
                                max={240}
                                step={5}
                                value={session.durationMinutes}
                                onChange={(e) =>
                                  updateSession(weekIndex, sessionIndex, {
                                    durationMinutes: Number(e.target.value),
                                  })
                                }
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--color-grey-200)] bg-white text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-[var(--color-muted)] mb-1">
                              Fokusomrade
                            </label>
                            <div className="flex gap-1">
                              {FOCUS_AREAS.map((fa) => (
                                <button
                                  key={fa}
                                  onClick={() =>
                                    updateSession(weekIndex, sessionIndex, { focusArea: fa })
                                  }
                                  className={cn(
                                    "flex-1 py-2 rounded text-xs font-medium transition-colors cursor-pointer",
                                    session.focusArea === fa
                                      ? "bg-[var(--color-primary)] text-white"
                                      : "bg-[var(--color-grey-100)] text-[var(--color-muted)] hover:bg-[var(--color-grey-200)]"
                                  )}
                                >
                                  {fa}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Exercises */}
                        {session.exercises && session.exercises.length > 0 && (
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium text-[var(--color-muted)]">
                              Ovelser ({session.exercises.length})
                            </p>
                            {session.exercises.map((ex, exIdx) => (
                              <div
                                key={exIdx}
                                className="flex items-center justify-between py-1.5 px-3 rounded bg-[var(--color-grey-100)] text-sm"
                              >
                                <span className="text-[var(--color-text)]">{ex.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-[var(--color-muted)]">
                                    {ex.durationMinutes} min
                                  </span>
                                  <button
                                    onClick={() =>
                                      removeExercise(weekIndex, sessionIndex, exIdx)
                                    }
                                    className="p-0.5 rounded text-[var(--color-error)] hover:bg-[var(--color-error)]/10 cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <button
                          onClick={() =>
                            setDrillPickerOpen({ weekIndex, sessionIndex })
                          }
                          className="flex items-center gap-1.5 text-xs text-[var(--color-primary)] font-medium hover:underline cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Legg til ovelser
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() => addSession(weekIndex)}
                      className="flex items-center gap-2 w-full justify-center py-2.5 rounded-lg border border-dashed border-[var(--color-grey-300)] text-sm text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Legg til okt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Preview */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[var(--color-grey-200)] bg-white p-6 space-y-4">
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  Bekreft treningsplan
                </h2>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[var(--color-muted)]">Elev</p>
                    <p className="font-medium text-[var(--color-text)]">
                      {selectedStudent?.name ?? selectedStudent?.email ?? "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[var(--color-muted)]">Tittel</p>
                    <p className="font-medium text-[var(--color-text)]">{title}</p>
                  </div>
                  <div>
                    <p className="text-[var(--color-muted)]">Periodetype</p>
                    <p className="font-medium text-[var(--color-text)]">
                      {PERIOD_TYPES.find((pt) => pt.value === periodType)?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-[var(--color-muted)]">Varighet</p>
                    <p className="font-medium text-[var(--color-text)]">
                      {durationWeeks} uker fra {startDate}
                    </p>
                  </div>
                </div>
              </div>

              {weeks.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  className="rounded-xl border border-[var(--color-grey-200)] bg-white overflow-hidden"
                >
                  <div className="px-5 py-3 bg-[var(--color-grey-100)] border-b border-[var(--color-grey-200)]">
                    <h3 className="text-sm font-semibold text-[var(--color-text)]">
                      Uke {weekIndex + 1}: {week.focus || "(ingen fokus)"}
                    </h3>
                    {week.volumeLabel && (
                      <p className="text-xs text-[var(--color-muted)]">Volum: {week.volumeLabel}</p>
                    )}
                  </div>
                  <div className="p-5 space-y-2">
                    {week.sessions.map((session, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-center gap-4 py-2 px-3 rounded-lg bg-[var(--color-grey-100)] text-sm"
                      >
                        <span className="text-[var(--color-muted)] w-20">
                          {DAY_LABELS[session.dayOfWeek]}
                        </span>
                        <span className="font-medium text-[var(--color-text)] flex-1">
                          {session.title || "(uten tittel)"}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                          {session.focusArea}
                        </span>
                        <span className="text-[var(--color-muted)] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {session.durationMinutes} min
                        </span>
                        {session.exercises && session.exercises.length > 0 && (
                          <span className="text-xs text-[var(--color-muted)]">
                            {session.exercises.length} ovelser
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Advarsel om eksisterende plan */}
              <div className="rounded-xl border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5 p-4 text-sm text-[var(--color-text)]">
                <p className="font-medium mb-1">Merk</p>
                <p className="text-[var(--color-muted)]">
                  Eventuelle eksisterende aktive planer for denne eleven vil bli deaktivert nar du
                  oppretter den nye planen.
                </p>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-4 pb-8">
            {step > 1 ? (
              <button
                onClick={() => setStep((s) => (s - 1) as WizardStep)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--color-grey-200)] text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-grey-100)] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Tilbake
              </button>
            ) : (
              <button
                onClick={() => router.push("/admin/treningsplan")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--color-grey-200)] text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-grey-100)] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Avbryt
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep((s) => (s + 1) as WizardStep)}
                disabled={step === 1 ? !step1Valid : !step2Valid}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                  (step === 1 ? step1Valid : step2Valid)
                    ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90"
                    : "bg-[var(--color-grey-200)] text-[var(--color-muted)] cursor-not-allowed"
                )}
              >
                Neste
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary)]/90 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Oppretter...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Opprett plan
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Drill picker modal */}
      {drillPickerOpen && (
        <DrillPicker
          drills={drills}
          onSelect={(selected) => {
            addExercisesToSession(
              drillPickerOpen.weekIndex,
              drillPickerOpen.sessionIndex,
              selected
            );
            setDrillPickerOpen(null);
          }}
          onClose={() => setDrillPickerOpen(null)}
        />
      )}
    </div>
  );
}
