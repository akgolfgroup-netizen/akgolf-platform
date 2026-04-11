"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, GripVertical, Plus, Repeat, Trash2 } from "lucide-react";

/* ── Types ── */

type PyramidLevel = "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN";
type LPhase = "KROPP" | "ARM" | "KOLLE" | "BALL" | "AUTO";

interface SessionExerciseItem {
  id: string;
  name: string;
  durationMinutes: number;
  meta: string;
}

interface SessionBuilderProps {
  open: boolean;
  onClose: () => void;
  dayLabel?: string;
  timeLabel?: string;
}

/* ── Constants ── */

const PYRAMID_OPTIONS: { id: PyramidLevel; label: string }[] = [
  { id: "FYS", label: "Fysisk" },
  { id: "TEK", label: "Teknikk" },
  { id: "SLAG", label: "Slagtrening" },
  { id: "SPILL", label: "Spilltrening" },
  { id: "TURN", label: "Turnering" },
];

const AREA_OPTIONS: Record<PyramidLevel, string[]> = {
  FYS: ["Styrke", "Kondisjon", "Mobilitet", "Eksplosivitet"],
  TEK: ["Full swing - Driver", "Full swing - Jern", "Naerspill", "Putting"],
  SLAG: ["Tee Total", "Approach", "Naerspill", "Putting"],
  SPILL: ["Banemanagement", "Strategi", "Mental"],
  TURN: ["Turnering", "Test"],
};

const P_POSITIONS = [
  "P1.0", "P2.0", "P3.0", "P4.0", "P4.5", "P5.0", "P5.5",
  "P6.0", "P6.5", "P7.0", "P8.0", "P9.0", "P10.0",
];

const L_PHASE_OPTIONS: { id: LPhase; label: string }[] = [
  { id: "KROPP", label: "L-KROPP" },
  { id: "ARM", label: "L-ARM" },
  { id: "KOLLE", label: "L-KOLLE" },
  { id: "BALL", label: "L-BALL" },
  { id: "AUTO", label: "L-AUTO" },
];

const CS_OPTIONS = [0, 20, 40, 60, 80, 100];
const M_OPTIONS = [0, 1, 2, 3, 4];
const PR_OPTIONS = [1, 2, 3, 4, 5];

const PYRAMID_BADGE_COLORS: Record<PyramidLevel, string> = {
  FYS: "bg-[var(--pyramid-fys)] text-white",
  TEK: "bg-[var(--pyramid-tek)] text-white",
  SLAG: "bg-[var(--pyramid-slag)] text-white",
  SPILL: "bg-[var(--pyramid-spill)] text-white",
  TURN: "bg-[var(--pyramid-turn)] text-white",
};

/* ── Component ── */

export function SessionBuilder({ open, onClose, dayLabel, timeLabel }: SessionBuilderProps) {
  const [mode, setMode] = useState<"quick" | "full">("quick");
  const [pyramid, setPyramid] = useState<PyramidLevel>("TEK");
  const [area, setArea] = useState("");
  const [pPosition, setPPosition] = useState("");
  const [lPhase, setLPhase] = useState<LPhase>("ARM");
  const [cs, setCs] = useState(40);
  const [mLevel, setMLevel] = useState(2);
  const [pr, setPr] = useState(2);
  const [life, setLife] = useState("SELV");
  const [duration, setDuration] = useState(45);
  const [exercises, setExercises] = useState<SessionExerciseItem[]>([
    { id: "1", name: "Slow motion P4-P7", durationMinutes: 10, meta: "L-ARM \u00B7 CS40 \u00B7 15 reps" },
    { id: "2", name: "Mirror drill \u2014 P4 posisjon", durationMinutes: 10, meta: "L-ARM \u00B7 CS0 \u00B7 20 reps" },
    { id: "3", name: "Ball hitting \u2014 7-jern P4", durationMinutes: 25, meta: "L-BALL \u00B7 CS60 \u00B7 20 baller" },
  ]);

  const isTek = pyramid === "TEK";

  // Generate session ID
  const sessionId = [
    pyramid,
    area.replace(/\s/g, "_").toUpperCase() || "UKJENT",
    isTek ? `L-${lPhase}` : "",
    isTek ? `CS${cs}` : "",
    `M${mLevel}`,
    `PR${pr}`,
    pPosition ? pPosition : "",
    `LIFE-${life}`,
  ]
    .filter(Boolean)
    .join("_");

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-[520px] bg-white border-l border-grey-200 z-50 flex flex-col shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-grey-200">
              <div>
                <h2 className="text-lg font-semibold text-black">Okt-builder</h2>
                {dayLabel && (
                  <p className="text-xs text-grey-400 mt-0.5">
                    {dayLabel}
                    {timeLabel ? ` \u00B7 ${timeLabel}` : ""}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Mode toggle */}
                <div className="flex border border-grey-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setMode("quick")}
                    className={`text-[10px] font-semibold px-3 py-1.5 transition-colors ${
                      mode === "quick" ? "bg-black text-white" : "text-grey-400 hover:bg-grey-100"
                    }`}
                  >
                    Quick
                  </button>
                  <button
                    onClick={() => setMode("full")}
                    className={`text-[10px] font-semibold px-3 py-1.5 transition-colors ${
                      mode === "full" ? "bg-black text-white" : "text-grey-400 hover:bg-grey-100"
                    }`}
                  >
                    Full
                  </button>
                </div>
                <button onClick={onClose} className="p-1.5 hover:bg-grey-100 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-grey-400" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {/* Pyramid */}
              <FormField label="Pyramideniva">
                <select
                  value={pyramid}
                  onChange={(e) => {
                    setPyramid(e.target.value as PyramidLevel);
                    setArea("");
                  }}
                  className="portal-input"
                >
                  {PYRAMID_OPTIONS.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </FormField>

              {/* Area */}
              <FormField label="Treningsomrade">
                <select value={area} onChange={(e) => setArea(e.target.value)} className="portal-input">
                  <option value="">Velg omrade...</option>
                  {AREA_OPTIONS[pyramid].map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </FormField>

              {/* P-position (TEK only) */}
              {isTek && (
                <FormField label="P-posisjon">
                  <select value={pPosition} onChange={(e) => setPPosition(e.target.value)} className="portal-input">
                    <option value="">Velg posisjon...</option>
                    {P_POSITIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </FormField>
              )}

              {/* Full mode fields */}
              {mode === "full" && (
                <>
                  {(isTek || pyramid === "SLAG") && (
                    <FormField label="L-fase">
                      <select value={lPhase} onChange={(e) => setLPhase(e.target.value as LPhase)} className="portal-input">
                        {L_PHASE_OPTIONS.map((l) => (
                          <option key={l.id} value={l.id}>{l.label}</option>
                        ))}
                      </select>
                    </FormField>
                  )}

                  {isTek && (
                    <FormField label="CS% (tempo)">
                      <select value={cs} onChange={(e) => setCs(Number(e.target.value))} className="portal-input">
                        {CS_OPTIONS.map((c) => (
                          <option key={c} value={c}>CS{c}</option>
                        ))}
                      </select>
                    </FormField>
                  )}

                  <FormField label="M-miljo">
                    <select value={mLevel} onChange={(e) => setMLevel(Number(e.target.value))} className="portal-input">
                      {M_OPTIONS.map((m) => (
                        <option key={m} value={m}>M{m} {m === 0 ? "Speil" : m === 1 ? "Stasjon" : m === 2 ? "Range" : m === 3 ? "Simulert" : "Bane"}</option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="PR-press">
                    <select value={pr} onChange={(e) => setPr(Number(e.target.value))} className="portal-input">
                      {PR_OPTIONS.map((p) => (
                        <option key={p} value={p}>PR{p} {p === 1 ? "Ingen" : p === 2 ? "Lav" : p === 3 ? "Moderat" : p === 4 ? "Hoy" : "Turnering"}</option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Varighet">
                    <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="portal-input">
                      {[15, 20, 30, 45, 60, 90, 120].map((d) => (
                        <option key={d} value={d}>{d} min</option>
                      ))}
                    </select>
                  </FormField>
                </>
              )}

              {/* Session ID */}
              <div className="bg-surface rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wide text-grey-400 block">
                    OKT-ID (auto)
                  </span>
                  <span className="text-[11px] font-mono text-black mt-0.5 block break-all">
                    {sessionId}
                  </span>
                </div>
                <span className={`text-[9px] font-bold px-2 py-1 rounded-md ${PYRAMID_BADGE_COLORS[pyramid]}`}>
                  {pyramid}
                </span>
              </div>

              {/* Exercises */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="portal-label">Ovelser i denne okten</span>
                  <button className="flex items-center gap-1 text-[10px] font-semibold text-black hover:text-primary transition-colors">
                    <Plus className="w-3 h-3" />
                    Legg til
                  </button>
                </div>
                <div className="space-y-1.5">
                  {exercises.map((ex, idx) => (
                    <div
                      key={ex.id}
                      className="flex items-center gap-2 p-3 rounded-xl bg-surface hover:bg-grey-200/60 group transition-colors"
                    >
                      <GripVertical className="w-3 h-3 text-muted cursor-grab flex-shrink-0" />
                      <span className="text-xs font-semibold text-grey-400 w-5">{idx + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-black block truncate">
                          {ex.name}
                        </span>
                        <span className="text-[10px] text-grey-400">{ex.meta}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-grey-400 tabular-nums">
                        {ex.durationMinutes} min
                      </span>
                      <button
                        onClick={() => setExercises(exercises.filter((e) => e.id !== ex.id))}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:text-error transition-all"
                      >
                        <Trash2 className="w-3 h-3 text-grey-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Repeat */}
              <div className="pt-2">
                <FormField label="Gjenta">
                  <div className="flex gap-1">
                    {["Ikke gjenta", "Hver uke", "Custom"].map((opt) => (
                      <button
                        key={opt}
                        className="text-[10px] font-semibold px-3 py-1.5 rounded-lg border border-grey-200 text-grey-400 hover:bg-grey-100 transition-colors"
                      >
                        <Repeat className="w-3 h-3 inline mr-1" />
                        {opt}
                      </button>
                    ))}
                  </div>
                </FormField>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-grey-200 flex justify-between">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-grey-400 hover:text-black transition-colors"
              >
                Avbryt
              </button>
              <button className="px-6 py-2.5 rounded-full bg-black text-white text-sm font-semibold hover:bg-grey-700 transition-colors">
                Lagre okt
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Form Field ── */

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-[0.05em] text-grey-400 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
