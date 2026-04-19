"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Target } from "lucide-react";
import { logSession, updateTrainingLog, deleteTrainingLog } from "@/app/portal/(dashboard)/dagbok/actions";
import { cn } from "@/lib/utils";

// Training types mapped to focus areas
const TRAINING_TYPES = [
  { value: "FITNESS", label: "Styrke", icon: Dumbbell, color: "bg-blue-500", description: "Fysisk styrketrening" },
  { value: "TEE_TOTAL", label: "Teknikk", icon: Target, color: "bg-[#16A34A]", description: "Teknisk trening" },
  { value: "DRIVING", label: "Slagtrening", icon: Target, color: "bg-[#D4AF37]", description: "Slagtrening på range" },
  { value: "COURSE_MANAGEMENT", label: "Spill", icon: Target, color: "bg-orange-500", description: "Spill på banen" },
  { value: "OTHER", label: "Turnering", icon: Target, color: "bg-red-500", description: "Turneringsrunde" },
  { value: "MENTAL", label: "Mental", icon: Target, color: "bg-purple-500", description: "Mental trening" },
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
  { value: 1, emoji: "😫", label: "Helt utmattet", color: "text-red-500" },
  { value: 2, emoji: "😴", label: "Sliten", color: "text-orange-500" },
  { value: 3, emoji: "😐", label: "Gjennomsnittlig", color: "text-yellow-500" },
  { value: 4, emoji: "🙂", label: "God", color: "text-green-500" },
  { value: 5, emoji: "🤩", label: "Super", color: "text-green-600" },
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-grey-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-lg font-semibold text-black">
                {editLog ? "Rediger treningsøkt" : "Logg ny treningsøkt"}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <button 
                  onClick={() => setStep("type")}
                  className={cn(
                    "text-xs font-medium transition-colors",
                    step === "type" ? "text-black" : "text-grey-400 hover:text-grey-600"
                  )}
                >
                  1. Type
                </button>
                <span className="text-grey-300">→</span>
                <button 
                  onClick={() => typeValue && setStep("details")}
                  className={cn(
                    "text-xs font-medium transition-colors",
                    step === "details" ? "text-black" : "text-grey-400 hover:text-grey-600"
                  )}
                >
                  2. Detaljer
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-grey-100 transition-colors"
            >
              <Icon name="close" className="w-5 h-5 text-grey-400" />
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
                  <p className="text-sm text-grey-400">Velg type treningsøkt:</p>
                  
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
                              ? `border-black bg-grey-50`
                              : "border-grey-200 hover:border-grey-300 bg-white"
                          )}
                        >
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", t.color)}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <p className="font-semibold text-black text-sm">{t.label}</p>
                          <p className="text-xs text-grey-400 mt-1">{t.description}</p>
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
                    <div className="flex items-center gap-3 p-3 bg-grey-50 rounded-xl">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", selectedTypeInfo.color)}>
                        <selectedTypeInfo.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-grey-400">Valgt type</p>
                        <p className="font-medium text-black">{selectedTypeInfo.label}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep("type")}
                        className="ml-auto text-xs text-grey-400 hover:text-black underline"
                      >
                        Endre
                      </button>
                    </div>
                  )}

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-grey-700 mb-1.5">
                      Dato
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      disabled={!!editLog}
                      required
                      className="w-full px-3 py-2.5 rounded-xl border border-grey-200 focus:outline-none focus:ring-2 focus:ring-accent-cta focus:border-transparent disabled:bg-grey-50"
                    />
                  </div>

                  {/* Duration slider */}
                  <div>
                    <label className="block text-sm font-medium text-grey-700 mb-1.5">
                      Varighet: <span className="text-black font-semibold">{durationMinutes || 0} minutter</span>
                    </label>
                    <input
                      type="range"
                      min="15"
                      max="180"
                      step="15"
                      value={durationMinutes || 60}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                      className="w-full accent-accent-cta"
                    />
                    <div className="flex justify-between text-xs text-grey-400 mt-1">
                      <span>15 min</span>
                      <span>60 min</span>
                      <span>180 min</span>
                    </div>
                  </div>

                  {/* Focus areas */}
                  <div>
                    <label className="block text-sm font-medium text-grey-700 mb-2">
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
                              ? "bg-black text-white border-black"
                              : "bg-white text-grey-600 border-grey-200 hover:border-grey-300"
                          )}
                        >
                          {area.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-grey-700 mb-2">
                      Vurdering: <span className="text-black font-semibold">{rating}/10</span>
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
                              ? "bg-accent-cta text-black"
                              : "bg-grey-100 text-grey-400 hover:bg-grey-200"
                          )}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-grey-700 mb-1.5">
                      Notater
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      maxLength={2000}
                      placeholder="Hva jobbet du med? Hva gikk bra? Hva kan forbedres?"
                      className="w-full px-3 py-2.5 rounded-xl border border-grey-200 focus:outline-none focus:ring-2 focus:ring-accent-cta focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Deviation from plan */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-grey-700 cursor-pointer">
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
                        className="w-full mt-2 px-3 py-2 rounded-xl border border-grey-200 focus:outline-none focus:ring-2 focus:ring-accent-cta focus:border-transparent resize-none text-sm"
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-grey-200">
              {editLog && step === "details" ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
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
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-grey-600 hover:bg-grey-100 transition-colors"
                  >
                    Tilbake
                  </button>
                )}
                
                {step === "details" && (
                  <button
                    type="submit"
                    disabled={isPending || !typeValue}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-accent-cta text-black hover:opacity-90 transition-opacity disabled:opacity-50"
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
