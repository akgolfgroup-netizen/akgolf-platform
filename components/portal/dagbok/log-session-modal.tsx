"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Target } from "lucide-react";
import { logSession, updateTrainingLog, deleteTrainingLog } from "@/app/portal/(dashboard)/dagbok/actions";
import { cn } from "@/lib/utils";

// Training types mapped to focus areas
const TRAINING_TYPES = [
  { value: "FITNESS", label: "Styrke", icon: Dumbbell, color: "bg-primary-container", description: "Fysisk styrketrening" },
  { value: "TEE_TOTAL", label: "Teknikk", icon: Target, color: "bg-primary", description: "Teknisk trening" },
  { value: "DRIVING", label: "Slagtrening", icon: Target, color: "bg-secondary-fixed", description: "Slagtrening på range" },
  { value: "COURSE_MANAGEMENT", label: "Spill", icon: Target, color: "bg-tertiary-container", description: "Spill på banen" },
  { value: "OTHER", label: "Turnering", icon: Target, color: "bg-error", description: "Turneringsrunde" },
  { value: "MENTAL", label: "Mental", icon: Target, color: "bg-primary-container/80", description: "Mental trening" },
];

const FOCUS_AREAS = [
  { value: "TEE_TOTAL", label: "Tee (Driver + Lange køller)" },
  { value: "APPROACH", label: "Innspill (Approach)" },
  { value: "SHORT_GAME", label: "Nærspill" },
  { value: "PUTTING", label: "Putting" },
  { value: "DRIVING", label: "Driver" },
  { value: "IRON_PLAY", label: "Jernspill" },
  { value: "CHIPPING", label: "Chipping" },
  { value: "PITCHING", label: "Pitching" },
  { value: "BUNKER", label: "Bunker" },
  { value: "COURSE_MANAGEMENT", label: "Baneledelse" },
  { value: "FITNESS", label: "Fysisk trening" },
  { value: "OTHER", label: "Annet" },
];

// Energy/fatigue levels with emojis
const ENERGY_LEVELS = [
  { value: 1, emoji: "😫", label: "Helt utmattet", color: "text-error" },
  { value: 2, emoji: "😴", label: "Sliten", color: "text-primary" },
  { value: 3, emoji: "😐", label: "Gjennomsnittlig", color: "text-on-surface-variant" },
  { value: 4, emoji: "🙂", label: "God", color: "text-primary-container" },
  { value: 5, emoji: "🤩", label: "Super", color: "text-success" },
];

interface LogEntry {
  id: string;
  date: Date | string;
  durationMinutes: number | null;
  focusArea: string | null;
  notes: string | null;
  rating: number | null;
  deviatedFromPlan: boolean;
  deviationReason: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  editLog?: LogEntry | null;
}

export function LogSessionModal({ open, onClose, editLog }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"type" | "details">("type");

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [typeValue, setTypeValue] = useState<string>("");
  const [durationMinutes, setDurationMinutes] = useState<string>("");
  const [focusArea, setFocusArea] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [notes, setNotes] = useState<string>("");
  const [deviatedFromPlan, setDeviatedFromPlan] = useState(false);
  const [deviationReason, setDeviationReason] = useState<string>("");

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (editLog) {
        const d = new Date(editLog.date);
        setDate(d.toISOString().slice(0, 10));
        setTypeValue(editLog.focusArea || "");
        setDurationMinutes(editLog.durationMinutes?.toString() ?? "");
        setFocusArea(editLog.focusArea ?? "");
        setRating(editLog.rating ?? 5);
        setNotes(editLog.notes ?? "");
        setDeviatedFromPlan(editLog.deviatedFromPlan);
        setDeviationReason(editLog.deviationReason ?? "");
        setStep("details");
      } else {
        setDate(today);
        setTypeValue("");
        setDurationMinutes("");
        setFocusArea("");
        setRating(5);
        setNotes("");
        setDeviatedFromPlan(false);
        setDeviationReason("");
        setStep("type");
      }
      setError(null);
    }, 0);

    return () => window.clearTimeout(id);
  }, [editLog, open, today]);

  function handleTypeSelect(selectedValue: string) {
    setTypeValue(selectedValue);
    setFocusArea(selectedValue);
    setStep("details");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const duration = durationMinutes ? parseInt(durationMinutes, 10) : undefined;
    if (duration !== undefined && (isNaN(duration) || duration < 1 || duration > 480)) {
      setError("Varighet må være mellom 1 og 480 minutter");
      return;
    }

    startTransition(async () => {
      try {
        if (editLog) {
          await updateTrainingLog(editLog.id, {
            durationMinutes: duration,
            focusArea: focusArea || undefined,
            notes: notes || undefined,
            rating,
            deviatedFromPlan,
            deviationReason: deviationReason || undefined,
          });
        } else {
          await logSession({
            date,
            durationMinutes: duration,
            focusArea: focusArea || undefined,
            notes: notes || undefined,
            rating,
            deviatedFromPlan,
            deviationReason: deviationReason || undefined,
          });
        }
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Noe gikk galt");
      }
    });
  }

  function handleDelete() {
    if (!editLog) return;
    if (!confirm("Er du sikker på at du vil slette denne økten?")) return;

    startTransition(async () => {
      try {
        await deleteTrainingLog(editLog.id);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Kunne ikke slette");
      }
    });
  }

  if (!open) return null;

  const selectedTypeInfo = TRAINING_TYPES.find(t => t.value === typeValue);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-surface-container-lowest border-b border-outline-variant/30 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-lg font-semibold text-on-surface">
                {editLog ? "Rediger treningsøkt" : "Logg ny treningsøkt"}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <button 
                  onClick={() => setStep("type")}
                  className={cn(
                    "text-xs font-medium transition-colors",
                    step === "type" ? "text-on-surface" : "text-on-surface-variant hover:text-on-surface-variant/80"
                  )}
                >
                  1. Type
                </button>
                <span className="text-on-surface-variant/60">→</span>
                <button 
                  onClick={() => typeValue && setStep("details")}
                  className={cn(
                    "text-xs font-medium transition-colors",
                    step === "details" ? "text-on-surface" : "text-on-surface-variant hover:text-on-surface-variant/80"
                  )}
                >
                  2. Detaljer
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-surface-container transition-colors"
            >
              <Icon name="close" className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <AnimatePresence mode="wait">
              {step === "type" ? (
                <motion.div
                  key="type-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-on-surface-variant">Velg type treningsøkt:</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {TRAINING_TYPES.map((t) => {
                      const Icon = t.icon;
                      return (
                        <motion.button
                          key={t.value}
                          type="button"
                          onClick={() => handleTypeSelect(t.value)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "p-4 rounded-xl border-2 text-left transition-all",
                            typeValue === t.value
                              ? `border-black bg-surface`
                              : "border-outline-variant/30 hover:border-outline-variant/50 bg-surface-container-lowest"
                          )}
                        >
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", t.color)}>
                            <Icon className="w-5 h-5 text-surface" />
                          </div>
                          <p className="font-semibold text-on-surface text-sm">{t.label}</p>
                          <p className="text-xs text-on-surface-variant mt-1">{t.description}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="details-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-5"
                >
                  {/* Selected type indicator */}
                  {selectedTypeInfo && (
                    <div className="flex items-center gap-3 p-3 bg-surface rounded-xl">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", selectedTypeInfo.color)}>
                        <selectedTypeInfo.icon className="w-4 h-4 text-surface" />
                      </div>
                      <div>
                        <p className="text-xs text-on-surface-variant">Valgt type</p>
                        <p className="font-medium text-on-surface">{selectedTypeInfo.label}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep("type")}
                        className="ml-auto text-xs text-on-surface-variant hover:text-on-surface underline"
                      >
                        Endre
                      </button>
                    </div>
                  )}

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant/90 mb-1.5">
                      Dato
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      disabled={!!editLog}
                      required
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-secondary-fixed focus:border-transparent disabled:bg-surface"
                    />
                  </div>

                  {/* Duration slider */}
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant/90 mb-1.5">
                      Varighet: <span className="text-on-surface font-semibold">{durationMinutes || 0} minutter</span>
                    </label>
                    <input
                      type="range"
                      min="15"
                      max="180"
                      step="15"
                      value={durationMinutes || 60}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                      className="w-full accent-secondary-fixed"
                    />
                    <div className="flex justify-between text-xs text-on-surface-variant mt-1">
                      <span>15 min</span>
                      <span>60 min</span>
                      <span>180 min</span>
                    </div>
                  </div>

                  {/* Focus areas */}
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant/90 mb-2">
                      Fokusområder
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {FOCUS_AREAS.map((area) => (
                        <button
                          key={area.value}
                          type="button"
                          onClick={() => setFocusArea(area.value === focusArea ? "" : area.value)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                            focusArea === area.value
                              ? "bg-on-surface text-surface border-black"
                              : "bg-surface-container-lowest text-on-surface-variant/80 border-outline-variant/30 hover:border-outline-variant/50"
                          )}
                        >
                          {area.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant/90 mb-2">
                      Vurdering: <span className="text-on-surface font-semibold">{rating}/10</span>
                    </label>
                    <div className="flex gap-2">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRating(num)}
                          className={cn(
                            "w-8 h-8 rounded-lg text-sm font-medium transition-all",
                            rating === num
                              ? "bg-secondary-fixed text-on-surface"
                              : "bg-surface-container text-on-surface-variant hover:bg-surface-variant"
                          )}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant/90 mb-1.5">
                      Notater
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      maxLength={2000}
                      placeholder="Hva jobbet du med? Hva gikk bra? Hva kan forbedres?"
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-secondary-fixed focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Deviation from plan */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-on-surface-variant/90 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deviatedFromPlan}
                        onChange={(e) => setDeviatedFromPlan(e.target.checked)}
                        className="w-4 h-4 accent-black rounded"
                      />
                      Avvek fra planlagt økt
                    </label>
                    {deviatedFromPlan && (
                      <textarea
                        value={deviationReason}
                        onChange={(e) => setDeviationReason(e.target.value)}
                        rows={2}
                        maxLength={500}
                        placeholder="Hvorfor avvek du fra planen?"
                        className="w-full mt-2 px-3 py-2 rounded-xl border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-secondary-fixed focus:border-transparent resize-none text-sm"
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="p-3 rounded-xl bg-error/10 text-error text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
              {editLog && step === "details" ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                >
                  <Icon name="delete" className="w-4 h-4" />
                  Slett
                </button>
              ) : (
                <div />
              )}
              
              <div className="flex items-center gap-2">
                {step === "details" && (
                  <button
                    type="button"
                    onClick={() => setStep("type")}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant/80 hover:bg-surface-container transition-colors"
                  >
                    Tilbake
                  </button>
                )}
                
                {step === "details" && (
                  <button
                    type="submit"
                    disabled={isPending || !typeValue}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-secondary-fixed text-on-surface hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isPending ? (
                      <Icon name="progress_activity" className="w-4 h-4 animate-spin" />
                    ) : (
                      <Icon name="save" className="w-4 h-4" />
                    )}
                    {editLog ? "Oppdater" : "Lagre økt"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
