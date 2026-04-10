"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Loader2, Save, ClipboardList } from "lucide-react";
import { createManualPlan, type ManualPlanInput } from "@/app/portal/(dashboard)/treningsplan/actions";

const PERIOD_TYPES = [
  { value: "PREPARATION", label: "Forberedelse" },
  { value: "COMPETITION", label: "Konkurranse" },
  { value: "RECOVERY", label: "Restitusjon" },
  { value: "OFF_SEASON", label: "Off-season" },
] as const;

const FOCUS_AREAS = [
  { value: "TEE_TOTAL", label: "Tee" },
  { value: "APPROACH", label: "Innspill" },
  { value: "SHORT_GAME", label: "Nærspill" },
  { value: "PUTTING", label: "Putting" },
  { value: "DRIVING", label: "Driver" },
  { value: "IRON_PLAY", label: "Jernspill" },
  { value: "CHIPPING", label: "Chipping" },
  { value: "PITCHING", label: "Pitching" },
  { value: "BUNKER", label: "Bunker" },
  { value: "COURSE_MANAGEMENT", label: "Baneledelse" },
  { value: "MENTAL", label: "Mental" },
  { value: "FITNESS", label: "Fysisk" },
];

const DAYS = [
  { value: 1, label: "Man" },
  { value: 2, label: "Tir" },
  { value: 3, label: "Ons" },
  { value: 4, label: "Tor" },
  { value: 5, label: "Fre" },
  { value: 6, label: "Lør" },
  { value: 7, label: "Søn" },
];

interface SessionDraft {
  dayOfWeek: number;
  title: string;
  description?: string;
  durationMinutes?: number;
  focusArea?: string;
}

interface WeekDraft {
  weekNumber: number;
  focus?: string;
  volumeLabel?: string;
  sessions: SessionDraft[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  studentId?: string;
}

export function ManualPlanModal({ open, onClose, studentId }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  // Steg 1: plan-info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState("");
  const [periodType, setPeriodType] = useState<ManualPlanInput["periodType"]>("PREPARATION");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [numWeeks, setNumWeeks] = useState(4);

  // Steg 2: uker og økter
  const [weeks, setWeeks] = useState<WeekDraft[]>([]);

  function initWeeks() {
    setWeeks(
      Array.from({ length: numWeeks }, (_, i) => ({
        weekNumber: i + 1,
        focus: "",
        volumeLabel: "",
        sessions: [],
      }))
    );
  }

  function handleNext() {
    setError(null);
    if (!title.trim()) {
      setError("Tittel er påkrevd");
      return;
    }
    if (numWeeks < 1 || numWeeks > 52) {
      setError("Antall uker må være mellom 1 og 52");
      return;
    }
    initWeeks();
    setStep(2);
  }

  function addSession(weekIdx: number) {
    const updated = [...weeks];
    updated[weekIdx].sessions.push({
      dayOfWeek: 1,
      title: "",
      durationMinutes: 60,
    });
    setWeeks(updated);
  }

  function removeSession(weekIdx: number, sessionIdx: number) {
    const updated = [...weeks];
    updated[weekIdx].sessions.splice(sessionIdx, 1);
    setWeeks(updated);
  }

  function updateSession(weekIdx: number, sessionIdx: number, field: keyof SessionDraft, value: string | number) {
    const updated = [...weeks];
    const session = updated[weekIdx].sessions[sessionIdx];
    if (field === "dayOfWeek" || field === "durationMinutes") {
      session[field] = typeof value === "string" ? parseInt(value, 10) : value;
    } else {
      session[field] = value as string;
    }
    setWeeks(updated);
  }

  function updateWeek(weekIdx: number, field: "focus" | "volumeLabel", value: string) {
    const updated = [...weeks];
    updated[weekIdx][field] = value;
    setWeeks(updated);
  }

  function handleSubmit() {
    setError(null);

    // Valider at hver uke har minst én økt
    const emptyWeeks = weeks.filter((w) => w.sessions.length === 0);
    if (emptyWeeks.length > 0) {
      setError(`Uke ${emptyWeeks[0].weekNumber} mangler økter`);
      return;
    }

    // Valider at alle økter har tittel
    for (const week of weeks) {
      for (const session of week.sessions) {
        if (!session.title.trim()) {
          setError(`Uke ${week.weekNumber}: Alle økter må ha tittel`);
          return;
        }
      }
    }

    startTransition(async () => {
      try {
        await createManualPlan({
          studentId,
          title,
          description: description || undefined,
          goals: goals || undefined,
          periodType,
          startDate,
          weeks: weeks.map((w) => ({
            weekNumber: w.weekNumber,
            focus: w.focus || undefined,
            volumeLabel: w.volumeLabel || undefined,
            sessions: w.sessions.map((s) => ({
              dayOfWeek: s.dayOfWeek,
              title: s.title,
              description: s.description || undefined,
              durationMinutes: s.durationMinutes,
              focusArea: s.focusArea || undefined,
            })),
          })),
        });
        handleClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Kunne ikke lagre plan");
      }
    });
  }

  function handleClose() {
    setStep(1);
    setTitle("");
    setDescription("");
    setGoals("");
    setPeriodType("PREPARATION");
    setStartDate(new Date().toISOString().slice(0, 10));
    setNumWeeks(4);
    setWeeks([]);
    setError(null);
    onClose();
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div className="sticky top-0 bg-white border-b border-[var(--color-grey-200)] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-5 h-5 text-[var(--color-primary)]" />
              <h2 className="text-lg font-semibold text-[var(--color-grey-900)]">
                {step === 1 ? "Ny manuell treningsplan" : `Uker og økter (${weeks.length} uker)`}
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-1 rounded-lg hover:bg-[var(--color-grey-100)] transition-colors"
              aria-label="Lukk"
            >
              <X className="w-5 h-5 text-[var(--color-grey-500)]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {step === 1 ? (
              <div className="space-y-5">
                <div>
                  <label htmlFor="plan-title" className="block text-sm font-medium text-[var(--color-grey-700)] mb-1.5">
                    Tittel *
                  </label>
                  <input
                    id="plan-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="f.eks. Forberedelse vår 2026"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-grey-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="plan-description" className="block text-sm font-medium text-[var(--color-grey-700)] mb-1.5">
                    Beskrivelse
                  </label>
                  <textarea
                    id="plan-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Kort beskrivelse av planen"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-grey-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="plan-goals" className="block text-sm font-medium text-[var(--color-grey-700)] mb-1.5">
                    Mål
                  </label>
                  <textarea
                    id="plan-goals"
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    rows={2}
                    placeholder="Hva vil du oppnå med denne planen?"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-grey-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="plan-period" className="block text-sm font-medium text-[var(--color-grey-700)] mb-1.5">
                      Periode-type *
                    </label>
                    <select
                      id="plan-period"
                      value={periodType}
                      onChange={(e) => setPeriodType(e.target.value as ManualPlanInput["periodType"])}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--color-grey-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
                    >
                      {PERIOD_TYPES.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="plan-start" className="block text-sm font-medium text-[var(--color-grey-700)] mb-1.5">
                      Startdato *
                    </label>
                    <input
                      id="plan-start"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-[var(--color-grey-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="plan-weeks" className="block text-sm font-medium text-[var(--color-grey-700)] mb-1.5">
                    Antall uker *
                  </label>
                  <input
                    id="plan-weeks"
                    type="number"
                    min="1"
                    max="52"
                    value={numWeeks}
                    onChange={(e) => setNumWeeks(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-grey-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {weeks.map((week, weekIdx) => (
                  <div
                    key={weekIdx}
                    className="border border-[var(--color-grey-200)] rounded-xl p-4 bg-[var(--color-grey-100)]/30"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-[var(--color-grey-900)]">Uke {week.weekNumber}</h3>
                      <button
                        type="button"
                        onClick={() => addSession(weekIdx)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white text-xs font-medium hover:opacity-90 transition-opacity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Legg til økt
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input
                        type="text"
                        value={week.focus || ""}
                        onChange={(e) => updateWeek(weekIdx, "focus", e.target.value)}
                        placeholder="Ukens fokus (valgfritt)"
                        className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-grey-300)] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                      <input
                        type="text"
                        value={week.volumeLabel || ""}
                        onChange={(e) => updateWeek(weekIdx, "volumeLabel", e.target.value)}
                        placeholder="Volum (f.eks. Høy, Moderat)"
                        className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-grey-300)] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </div>

                    {week.sessions.length === 0 ? (
                      <p className="text-xs text-[var(--color-grey-500)] text-center py-3">
                        Ingen økter lagt til
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {week.sessions.map((session, sessionIdx) => (
                          <div
                            key={sessionIdx}
                            className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg bg-white border border-[var(--color-grey-200)]"
                          >
                            <select
                              value={session.dayOfWeek}
                              onChange={(e) => updateSession(weekIdx, sessionIdx, "dayOfWeek", e.target.value)}
                              className="col-span-2 px-2 py-1.5 rounded border border-[var(--color-grey-300)] text-xs bg-white"
                            >
                              {DAYS.map((d) => (
                                <option key={d.value} value={d.value}>
                                  {d.label}
                                </option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={session.title}
                              onChange={(e) => updateSession(weekIdx, sessionIdx, "title", e.target.value)}
                              placeholder="Tittel"
                              className="col-span-4 px-2 py-1.5 rounded border border-[var(--color-grey-300)] text-xs"
                            />
                            <select
                              value={session.focusArea || ""}
                              onChange={(e) => updateSession(weekIdx, sessionIdx, "focusArea", e.target.value)}
                              className="col-span-3 px-2 py-1.5 rounded border border-[var(--color-grey-300)] text-xs bg-white"
                            >
                              <option value="">Fokus</option>
                              {FOCUS_AREAS.map((f) => (
                                <option key={f.value} value={f.value}>
                                  {f.label}
                                </option>
                              ))}
                            </select>
                            <input
                              type="number"
                              min="1"
                              max="480"
                              value={session.durationMinutes || ""}
                              onChange={(e) => updateSession(weekIdx, sessionIdx, "durationMinutes", e.target.value)}
                              placeholder="Min"
                              className="col-span-2 px-2 py-1.5 rounded border border-[var(--color-grey-300)] text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => removeSession(weekIdx, sessionIdx)}
                              className="col-span-1 p-1.5 rounded text-[var(--color-error)] hover:bg-[var(--color-error)]/10 transition-colors"
                              aria-label="Fjern økt"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div role="alert" className="mt-4 p-3 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white border-t border-[var(--color-grey-200)] px-6 py-4 flex items-center justify-between">
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isPending}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-grey-700)] hover:bg-[var(--color-grey-100)] transition-colors disabled:opacity-50"
              >
                Tilbake
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-grey-700)] hover:bg-[var(--color-grey-100)] transition-colors"
              >
                Avbryt
              </button>
            )}

            {step === 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
              >
                Neste
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Lagre plan
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
