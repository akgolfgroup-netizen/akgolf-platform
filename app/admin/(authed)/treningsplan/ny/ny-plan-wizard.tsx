"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useTransition, useEffect } from "react";

import { cn } from "@/lib/portal/utils/cn";
import { CoachHQTopbar, useCoachHQSidebar } from "@/components/portal/coach-hq";
import {
  AdminInput,
  AdminSelect,
  AdminPageHeader,
} from "@/components/portal/coach-hq/ui";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

type FocusArea = "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN";

const FOCUS_AREAS: FocusArea[] = ["FYS", "TEK", "SLAG", "SPILL", "TURN"];

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

const DAY_LABELS: Record<number, string> = {
  1: "Mandag",
  2: "Tirsdag",
  3: "Onsdag",
  4: "Torsdag",
  5: "Fredag",
  6: "Lørdag",
  0: "Søndag",
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

export function NyPlanWizard({
  students,
  drills,
  preselectedStudentId,
}: NyPlanWizardProps) {
  const { toggle } = useCoachHQSidebar();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Wizard state
  const [step, setStep] = useState<WizardStep>(1);

  // Step 1: Metadata
  const [studentId, setStudentId] = useState(preselectedStudentId ?? "");
  const [title, setTitle] = useState("");
  const [periodType, setPeriodType] = useState("grunnperiode");
  const [periodizationPeriodId, setPeriodizationPeriodId] = useState("");
  const [availablePeriods, setAvailablePeriods] = useState<Array<{ id: string; label: string | null; periodType: string; startDate: string; endDate: string }>>([]);
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    const dayOfWeek = d.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    d.setDate(d.getDate() + daysUntilMonday);
    return d.toISOString().split("T")[0];
  });

  // Fetch available periodization periods
  useEffect(() => {
    fetch("/api/portal/public/periodization")
      .then((res) => res.json())
      .then((data) => {
        if (data.periods) {
          setAvailablePeriods(data.periods);
        }
      })
      .catch(() => {
        // Silently fail — coach can still create plan without linking period
      });
  }, []);

  // Step 2: Weeks & sessions
  const [weeks, setWeeks] = useState<ManualPlanWeek[]>(() =>
    Array.from({ length: 4 }, () => createEmptyWeek()),
  );

  // Drill picker state
  const [drillPickerOpen, setDrillPickerOpen] = useState<{
    weekIndex: number;
    sessionIndex: number;
  } | null>(null);

  function handleDurationChange(newDuration: number) {
    setDurationWeeks(newDuration);
    setWeeks((prev) => {
      if (newDuration > prev.length) {
        return [
          ...prev,
          ...Array.from({ length: newDuration - prev.length }, () =>
            createEmptyWeek(),
          ),
        ];
      }
      return prev.slice(0, newDuration);
    });
  }

  function addSession(weekIndex: number) {
    setWeeks((prev) =>
      prev.map((w, i) =>
        i === weekIndex
          ? { ...w, sessions: [...w.sessions, createEmptySession()] }
          : w,
      ),
    );
  }

  function removeSession(weekIndex: number, sessionIndex: number) {
    setWeeks((prev) =>
      prev.map((w, i) =>
        i === weekIndex
          ? {
              ...w,
              sessions: w.sessions.filter((_, si) => si !== sessionIndex),
            }
          : w,
      ),
    );
  }

  function updateSession(
    weekIndex: number,
    sessionIndex: number,
    updates: Partial<ManualPlanSession>,
  ) {
    setWeeks((prev) =>
      prev.map((w, i) =>
        i === weekIndex
          ? {
              ...w,
              sessions: w.sessions.map((s, si) =>
                si === sessionIndex ? { ...s, ...updates } : s,
              ),
            }
          : w,
      ),
    );
  }

  function updateWeek(weekIndex: number, updates: Partial<ManualPlanWeek>) {
    setWeeks((prev) =>
      prev.map((w, i) => (i === weekIndex ? { ...w, ...updates } : w)),
    );
  }

  function addExercisesToSession(
    weekIndex: number,
    sessionIndex: number,
    newExercises: ManualPlanExercise[],
  ) {
    setWeeks((prev) =>
      prev.map((w, i) =>
        i === weekIndex
          ? {
              ...w,
              sessions: w.sessions.map((s, si) =>
                si === sessionIndex
                  ? {
                      ...s,
                      exercises: [...(s.exercises ?? []), ...newExercises],
                    }
                  : s,
              ),
            }
          : w,
      ),
    );
  }

  function removeExercise(
    weekIndex: number,
    sessionIndex: number,
    exerciseIndex: number,
  ) {
    setWeeks((prev) =>
      prev.map((w, i) =>
        i === weekIndex
          ? {
              ...w,
              sessions: w.sessions.map((s, si) =>
                si === sessionIndex
                  ? {
                      ...s,
                      exercises: (s.exercises ?? []).filter(
                        (_, ei) => ei !== exerciseIndex,
                      ),
                    }
                  : s,
              ),
            }
          : w,
      ),
    );
  }

  // Validation
  const step1Valid =
    studentId && title.trim() && startDate && durationWeeks > 0;

  const selectedPeriod = availablePeriods.find((p) => p.id === periodizationPeriodId);
  const step2Valid = weeks.every(
    (w) =>
      w.focus.trim() &&
      w.sessions.length > 0 &&
      w.sessions.every((s) => s.title.trim()),
  );

  // Submit
  function handleSubmit() {
    startTransition(async () => {
      const result = await createManualPlan({
        studentId,
        title,
        periodType,
        periodizationPeriodId: periodizationPeriodId || undefined,
        startDate,
        durationWeeks,
        weeks,
      });

      if (result.success) {
        router.push(
          studentId
            ? `/admin/treningsplan?studentId=${studentId}`
            : "/admin/treningsplan",
        );
      }
    });
  }

  const selectedStudent = students.find((s) => s.id === studentId);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <CoachHQTopbar
        title="Ny treningsplan"
        subtitle="Manuell opprettelse"
        onMenuClick={toggle}
      />

      <div className="flex-1 overflow-y-auto">
        {/* Step indicator */}
        <div className="border-b border-outline-variant/30 bg-surface-container-lowest px-6 py-4">
          <div className="flex items-center gap-2 max-w-2xl mx-auto">
            {([1, 2, 3] as const).map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step === s
                      ? "bg-on-surface text-surface"
                      : step > s
                        ? "bg-success-text text-surface"
                        : "bg-surface-container text-on-surface-variant",
                  )}
                >
                  {step > s ? <Icon name="check" className="w-4 h-4" /> : s}
                </div>
                <span
                  className={cn(
                    "text-sm hidden sm:block",
                    step === s
                      ? "text-on-surface font-medium"
                      : "text-on-surface-variant",
                  )}
                >
                  {s === 1 ? "Grunninfo" : s === 2 ? "Uker og økter" : "Bekreft"}
                </span>
                {s < 3 && (
                  <div className="flex-1 h-px bg-surface-variant mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 max-w-3xl mx-auto space-y-6">
          <AdminPageHeader
            title="Ny treningsplan"
            subtitle="Bygg en manuell treningsplan i tre steg"
            breadcrumbs={[
              { label: "Treningsplaner", href: "/admin/treningsplan" },
              { label: "Ny plan" },
            ]}
          />

          {/* Step 1: Metadata */}
          {step === 1 && (
            <Card>
              <h2 className="text-lg font-semibold text-on-surface mb-5">
                Grunnleggende info
              </h2>

              <div className="space-y-5">
                <AdminSelect
                  label="Elev"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                >
                  <option value="">Velg elev...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name ?? s.email ?? s.id}
                    </option>
                  ))}
                </AdminSelect>

                <AdminInput
                  label="Plantittel"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="F.eks. Grunnperiode V2026"
                />

                <div>
                  <label className="admin-label block mb-1.5">
                    Periodetype
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {PERIOD_TYPES.map((pt) => (
                      <button
                        key={pt.value}
                        type="button"
                        onClick={() => setPeriodType(pt.value)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-medium transition-colors border",
                          periodType === pt.value
                            ? "bg-on-surface text-surface border-black"
                            : "bg-surface-container-lowest border-outline-variant/30 text-on-surface hover:bg-surface-container",
                        )}
                      >
                        {pt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {availablePeriods.length > 0 && (
                  <AdminSelect
                    label="Koble til periodiseringsperiode (valgfritt)"
                    value={periodizationPeriodId}
                    onChange={(e) => {
                      const pid = e.target.value;
                      setPeriodizationPeriodId(pid);
                      const p = availablePeriods.find((ap) => ap.id === pid);
                      if (p) {
                        setPeriodType(p.periodType);
                        setStartDate(p.startDate);
                      }
                    }}
                  >
                    <option value="">Ingen kobling</option>
                    {availablePeriods.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label ?? p.periodType} ({p.startDate} – {p.endDate})
                      </option>
                    ))}
                  </AdminSelect>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <AdminInput
                    label="Startdato"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <AdminSelect
                    label="Antall uker"
                    value={durationWeeks}
                    onChange={(e) => handleDurationChange(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "uke" : "uker"}
                      </option>
                    ))}
                  </AdminSelect>
                </div>
              </div>
            </Card>
          )}

          {/* Step 2: Weeks & sessions */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Period focus recommendation */}
              {selectedPeriod && (
                <Card className="bg-surface-container-low border-info/20">
                  <div className="flex items-start gap-3">
                    <Icon name="info" className="w-5 h-5 text-info mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-on-surface">
                        Anbefalt fokus i {selectedPeriod.label ?? selectedPeriod.periodType}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedPeriod.periodType === "grunnperiode" && (
                          <>
                            <Badge variant="info">50% Teknikk</Badge>
                            <Badge variant="success">30% Fysisk</Badge>
                            <Badge variant="warning">20% SLAG</Badge>
                          </>
                        )}
                        {selectedPeriod.periodType === "spesialiseringsperiode" && (
                          <>
                            <Badge variant="warning">40% SLAG</Badge>
                            <Badge variant="error">30% SPILL</Badge>
                            <Badge variant="info">30% Teknikk</Badge>
                          </>
                        )}
                        {selectedPeriod.periodType === "turneringsperiode" && (
                          <>
                            <Badge variant="error">50% SPILL</Badge>
                            <Badge variant="warning">30% SLAG</Badge>
                            <Badge variant="muted">20% TURN</Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {weeks.map((week, weekIndex) => (
                <Card key={weekIndex} className="p-0 overflow-hidden">
                  {/* Week header */}
                  <div className="px-5 py-4 bg-surface-container border-b border-outline-variant/30">
                    <h3 className="text-sm font-semibold text-on-surface mb-3">
                      Uke {weekIndex + 1}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <AdminInput
                        label="Ukefokus"
                        type="text"
                        value={week.focus}
                        onChange={(e) =>
                          updateWeek(weekIndex, { focus: e.target.value })
                        }
                        placeholder="F.eks. Kort spill og putting"
                      />
                      <AdminInput
                        label="Volum"
                        type="text"
                        value={week.volumeLabel ?? ""}
                        onChange={(e) =>
                          updateWeek(weekIndex, {
                            volumeLabel: e.target.value,
                          })
                        }
                        placeholder="F.eks. Høy, Middels, Lav"
                      />
                    </div>
                  </div>

                  {/* Sessions */}
                  <div className="p-5 space-y-4">
                    {week.sessions.map((session, sessionIndex) => (
                      <div
                        key={sessionIndex}
                        className="rounded-lg border border-outline-variant/30 p-4 space-y-3 bg-surface-container-lowest"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                            Økt {sessionIndex + 1}
                          </span>
                          {week.sessions.length > 1 && (
                            <Button
                              variant="destructive"
                              onClick={() =>
                                removeSession(weekIndex, sessionIndex)
                              }
                              aria-label="Slett økt"
                              className="!px-2 !py-1"
                            >
                              <Icon name="delete" className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <AdminInput
                            label="Tittel"
                            type="text"
                            value={session.title}
                            onChange={(e) =>
                              updateSession(weekIndex, sessionIndex, {
                                title: e.target.value,
                              })
                            }
                            placeholder="F.eks. Teknikkøkt"
                          />
                          <AdminSelect
                            label="Dag"
                            value={session.dayOfWeek}
                            onChange={(e) =>
                              updateSession(weekIndex, sessionIndex, {
                                dayOfWeek: Number(e.target.value),
                              })
                            }
                          >
                            {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                              <option key={d} value={d}>
                                {DAY_LABELS[d]}
                              </option>
                            ))}
                          </AdminSelect>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="admin-label block mb-1.5">
                              Varighet (min)
                            </label>
                            <div className="relative">
                              <Icon name="schedule" className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant pointer-events-none" />
                              <AdminInput
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
                                className="pl-9"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="admin-label block mb-1.5">
                              Fokusområde
                            </label>
                            <div className="flex gap-1">
                              {FOCUS_AREAS.map((fa) => (
                                <button
                                  key={fa}
                                  type="button"
                                  onClick={() =>
                                    updateSession(weekIndex, sessionIndex, {
                                      focusArea: fa,
                                    })
                                  }
                                  className={cn(
                                    "flex-1 py-2 rounded text-xs font-medium transition-colors border",
                                    session.focusArea === fa
                                      ? "bg-on-surface text-surface border-black"
                                      : "bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:bg-surface-container",
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
                            <p className="text-xs font-medium text-on-surface-variant">
                              Øvelser ({session.exercises.length})
                            </p>
                            {session.exercises.map((ex, exIdx) => (
                              <div
                                key={exIdx}
                                className="flex items-center justify-between py-1.5 px-3 rounded bg-surface-container text-sm"
                              >
                                <span className="text-on-surface">
                                  {ex.name}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-on-surface-variant">
                                    {ex.durationMinutes} min
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeExercise(
                                        weekIndex,
                                        sessionIndex,
                                        exIdx,
                                      )
                                    }
                                    className="p-0.5 rounded text-error hover:bg-error/10"
                                    aria-label="Fjern øvelse"
                                  >
                                    <Icon name="delete" className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setDrillPickerOpen({ weekIndex, sessionIndex })
                          }
                          className="flex items-center gap-1.5 text-xs text-on-surface font-medium hover:underline"
                        >
                          <Icon name="add" className="w-3.5 h-3.5" />
                          Legg til øvelser
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addSession(weekIndex)}
                      className="flex items-center gap-2 w-full justify-center py-2.5 rounded-lg border border-dashed border-outline-variant/50 text-sm text-on-surface-variant hover:border-black hover:text-on-surface transition-colors"
                    >
                      <Icon name="add" className="w-4 h-4" />
                      Legg til økt
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Step 3: Preview */}
          {step === 3 && (
            <div className="space-y-6">
              <Card>
                <h2 className="text-lg font-semibold text-on-surface mb-4">
                  Bekreft treningsplan
                </h2>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-on-surface-variant">Elev</p>
                    <p className="font-medium text-on-surface">
                      {selectedStudent?.name ?? selectedStudent?.email ?? "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant">Tittel</p>
                    <p className="font-medium text-on-surface">
                      {title}
                    </p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant">Periodetype</p>
                    <p className="font-medium text-on-surface">
                      {PERIOD_TYPES.find((pt) => pt.value === periodType)?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant">Varighet</p>
                    <p className="font-medium text-on-surface">
                      {durationWeeks} uker fra {startDate}
                    </p>
                  </div>
                </div>
              </Card>

              {weeks.map((week, weekIndex) => (
                <Card key={weekIndex} className="p-0 overflow-hidden">
                  <div className="px-5 py-3 bg-surface-container border-b border-outline-variant/30">
                    <h3 className="text-sm font-semibold text-on-surface">
                      Uke {weekIndex + 1}: {week.focus || "(ingen fokus)"}
                    </h3>
                    {week.volumeLabel && (
                      <p className="text-xs text-on-surface-variant">
                        Volum: {week.volumeLabel}
                      </p>
                    )}
                  </div>
                  <div className="p-5 space-y-2">
                    {week.sessions.map((session, sIdx) => {
                      const focusKey = session.focusArea as FocusArea;
                      const variant = FOCUS_VARIANT[focusKey] ?? "muted";
                      return (
                        <div
                          key={sIdx}
                          className="flex items-center gap-4 py-2 px-3 rounded-lg bg-surface-container text-sm"
                        >
                          <span className="text-on-surface-variant w-20">
                            {DAY_LABELS[session.dayOfWeek]}
                          </span>
                          <span className="font-medium text-on-surface flex-1">
                            {session.title || "(uten tittel)"}
                          </span>
                          <Badge variant={variant}>
                            {session.focusArea}
                          </Badge>
                          <span className="text-on-surface-variant flex items-center gap-1 text-xs">
                            <Icon name="schedule" className="w-3 h-3" />
                            {session.durationMinutes} min
                          </span>
                          {session.exercises && session.exercises.length > 0 && (
                            <span className="text-xs text-on-surface-variant">
                              {session.exercises.length} øvelser
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ))}

              {/* Advarsel om eksisterende plan */}
              <Card className="border-warning/30 bg-warning/5">
                <p className="font-medium mb-1 text-on-surface">Merk</p>
                <p className="text-sm text-on-surface-variant">
                  Eventuelle eksisterende aktive planer for denne eleven vil bli
                  deaktivert når du oppretter den nye planen.
                </p>
              </Card>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-4 pb-8">
            {step > 1 ? (
              <Button
                variant="secondary"
                onClick={() => setStep((s) => (s - 1) as WizardStep)}
              >
                <Icon name="arrow_back" className="w-4 h-4 mr-2" />
                Tilbake
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => router.push("/admin/treningsplan")}
              >
                <Icon name="arrow_back" className="w-4 h-4 mr-2" />
                Avbryt
              </Button>
            )}

            {step < 3 ? (
              <Button
                variant="accent"
                disabled={step === 1 ? !step1Valid : !step2Valid}
                onClick={() => setStep((s) => (s + 1) as WizardStep)}
              >
                Neste
                <Icon name="arrow_forward" className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="accent"
                isLoading={isPending}
                onClick={handleSubmit}
              >
                <Icon name="check" className="w-4 h-4 mr-2" />
                {isPending ? "Oppretter..." : "Opprett plan"}
              </Button>
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
              selected,
            );
            setDrillPickerOpen(null);
          }}
          onClose={() => setDrillPickerOpen(null)}
        />
      )}
    </div>
  );
}
