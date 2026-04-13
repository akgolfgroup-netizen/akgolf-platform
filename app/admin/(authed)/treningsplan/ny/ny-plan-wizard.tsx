"use client";

import { useState, useTransition } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminInput,
  AdminSelect,
  AdminPageHeader,
} from "@/components/portal/mission-control/ui";
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
    const dayOfWeek = d.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    d.setDate(d.getDate() + daysUntilMonday);
    return d.toISOString().split("T")[0];
  });

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
      <MCTopbar
        title="Ny treningsplan"
        subtitle="Manuell opprettelse"
        onMenuClick={toggle}
      />

      <div className="flex-1 overflow-y-auto">
        {/* Step indicator */}
        <div className="border-b border-grey-200 bg-white px-6 py-4">
          <div className="flex items-center gap-2 max-w-2xl mx-auto">
            {([1, 2, 3] as const).map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step === s
                      ? "bg-black text-white"
                      : step > s
                        ? "bg-success-text text-white"
                        : "bg-grey-100 text-grey-400",
                  )}
                >
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                <span
                  className={cn(
                    "text-sm hidden sm:block",
                    step === s
                      ? "text-black font-medium"
                      : "text-grey-400",
                  )}
                >
                  {s === 1 ? "Grunninfo" : s === 2 ? "Uker og økter" : "Bekreft"}
                </span>
                {s < 3 && (
                  <div className="flex-1 h-px bg-grey-200 mx-2" />
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
              <h2 className="text-lg font-semibold text-black mb-5">
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
                            ? "bg-black text-white border-black"
                            : "bg-white border-grey-200 text-black hover:bg-grey-100",
                        )}
                      >
                        {pt.label}
                      </button>
                    ))}
                  </div>
                </div>

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
              {weeks.map((week, weekIndex) => (
                <Card key={weekIndex} className="p-0 overflow-hidden">
                  {/* Week header */}
                  <div className="px-5 py-4 bg-grey-100 border-b border-grey-200">
                    <h3 className="text-sm font-semibold text-black mb-3">
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
                        className="rounded-lg border border-grey-200 p-4 space-y-3 bg-white"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-grey-400 uppercase tracking-wider">
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
                              <Trash2 className="w-3.5 h-3.5" />
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
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-grey-400 pointer-events-none" />
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
                                      ? "bg-black text-white border-black"
                                      : "bg-white border-grey-200 text-grey-400 hover:bg-grey-100",
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
                            <p className="text-xs font-medium text-grey-400">
                              Øvelser ({session.exercises.length})
                            </p>
                            {session.exercises.map((ex, exIdx) => (
                              <div
                                key={exIdx}
                                className="flex items-center justify-between py-1.5 px-3 rounded bg-grey-100 text-sm"
                              >
                                <span className="text-black">
                                  {ex.name}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-grey-400">
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
                                    <Trash2 className="w-3 h-3" />
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
                          className="flex items-center gap-1.5 text-xs text-black font-medium hover:underline"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Legg til øvelser
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addSession(weekIndex)}
                      className="flex items-center gap-2 w-full justify-center py-2.5 rounded-lg border border-dashed border-grey-300 text-sm text-grey-400 hover:border-black hover:text-black transition-colors"
                    >
                      <Plus className="w-4 h-4" />
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
                <h2 className="text-lg font-semibold text-black mb-4">
                  Bekreft treningsplan
                </h2>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-grey-400">Elev</p>
                    <p className="font-medium text-black">
                      {selectedStudent?.name ?? selectedStudent?.email ?? "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-grey-400">Tittel</p>
                    <p className="font-medium text-black">
                      {title}
                    </p>
                  </div>
                  <div>
                    <p className="text-grey-400">Periodetype</p>
                    <p className="font-medium text-black">
                      {PERIOD_TYPES.find((pt) => pt.value === periodType)?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-grey-400">Varighet</p>
                    <p className="font-medium text-black">
                      {durationWeeks} uker fra {startDate}
                    </p>
                  </div>
                </div>
              </Card>

              {weeks.map((week, weekIndex) => (
                <Card key={weekIndex} className="p-0 overflow-hidden">
                  <div className="px-5 py-3 bg-grey-100 border-b border-grey-200">
                    <h3 className="text-sm font-semibold text-black">
                      Uke {weekIndex + 1}: {week.focus || "(ingen fokus)"}
                    </h3>
                    {week.volumeLabel && (
                      <p className="text-xs text-grey-400">
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
                          className="flex items-center gap-4 py-2 px-3 rounded-lg bg-grey-100 text-sm"
                        >
                          <span className="text-grey-400 w-20">
                            {DAY_LABELS[session.dayOfWeek]}
                          </span>
                          <span className="font-medium text-black flex-1">
                            {session.title || "(uten tittel)"}
                          </span>
                          <Badge variant={variant}>
                            {session.focusArea}
                          </Badge>
                          <span className="text-grey-400 flex items-center gap-1 text-xs">
                            <Clock className="w-3 h-3" />
                            {session.durationMinutes} min
                          </span>
                          {session.exercises && session.exercises.length > 0 && (
                            <span className="text-xs text-grey-400">
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
                <p className="font-medium mb-1 text-black">Merk</p>
                <p className="text-sm text-grey-400">
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
                <ArrowLeft className="w-4 h-4 mr-2" />
                Tilbake
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => router.push("/admin/treningsplan")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
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
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="accent"
                isLoading={isPending}
                onClick={handleSubmit}
              >
                <Check className="w-4 h-4 mr-2" />
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
