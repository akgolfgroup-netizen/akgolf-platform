"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft } from "lucide-react";

/* ── Types ── */

type ExerciseType = "TEK" | "SLAG";

interface ExerciseDetailProps {
  open: boolean;
  onClose: () => void;
  type: ExerciseType;
  name: string;
}

/* ── TEK Form ── */

function TekForm() {
  const [lPhase, setLPhase] = useState("ARM");
  const [pPosition, setPPosition] = useState("P4.0-P7.0");
  const [cue, setCue] = useState("");
  const [cs, setCs] = useState(40);
  const [reps, setReps] = useState(15);
  const [tempo, setTempo] = useState(60);
  const [balance, setBalance] = useState(4);
  const [quality, setQuality] = useState<number | null>(null);
  const [note, setNote] = useState("");

  return (
    <div className="space-y-4">
      <Field label="L-fase">
        <select value={lPhase} onChange={(e) => setLPhase(e.target.value)} className="portal-input">
          {["KROPP", "ARM", "KOLLE", "BALL", "AUTO"].map((l) => (
            <option key={l} value={l}>L-{l}</option>
          ))}
        </select>
      </Field>

      <Field label="P-posisjon">
        <select value={pPosition} onChange={(e) => setPPosition(e.target.value)} className="portal-input">
          <option value="P1.0">P1.0</option>
          <option value="P2.0-P3.0">P2.0-P3.0</option>
          <option value="P4.0-P7.0">P4.0-P7.0</option>
          <option value="P7.0-P10.0">P7.0-P10.0</option>
          <option value="P1.0-P10.0">P1.0-P10.0 (full)</option>
        </select>
      </Field>

      <Field label="Bevegelsescue">
        <input
          type="text"
          value={cue}
          onChange={(e) => setCue(e.target.value)}
          placeholder="F.eks. Lead arm mot kroppen i P5"
          className="portal-input"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="CS% (tempo)">
          <select value={cs} onChange={(e) => setCs(Number(e.target.value))} className="portal-input">
            {[0, 20, 40, 60, 80, 100].map((c) => (
              <option key={c} value={c}>CS{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Repetisjoner">
          <input type="number" value={reps} onChange={(e) => setReps(Number(e.target.value))} className="portal-input" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Tempo (BPM)">
          <input type="number" value={tempo} onChange={(e) => setTempo(Number(e.target.value))} className="portal-input" />
        </Field>
        <Field label="Balanse (1-5)">
          <select value={balance} onChange={(e) => setBalance(Number(e.target.value))} className="portal-input">
            {[1, 2, 3, 4, 5].map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Post-exercise quality */}
      <div className="bg-surface rounded-xl p-4">
        <span className="text-[10px] font-bold uppercase tracking-wide text-grey-400 block mb-2">
          Etter ovelsen
        </span>
        <Field label="Kvalitet (1-10)">
          <select
            value={quality ?? ""}
            onChange={(e) => setQuality(e.target.value ? Number(e.target.value) : null)}
            className="portal-input"
          >
            <option value="">Ikke vurdert</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Notat">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="portal-input resize-none"
        />
      </Field>
    </div>
  );
}

/* ── SLAG Form ── */

function SlagForm() {
  const [category, setCategory] = useState("Putting");
  const [club, setClub] = useState("Putter");
  const [distance, setDistance] = useState("1.5m");
  const [spread, setSpread] = useState("10cm");
  const [pr, setPr] = useState(2);
  const [mLevel, setMLevel] = useState(2);
  const [lPhase, setLPhase] = useState("BALL");
  const [score, setScore] = useState<string>("");
  const [preShot, setPreShot] = useState<string>("");
  const [note, setNote] = useState("");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Slagkategori">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="portal-input">
            {["Tee Total", "Approach", "Chip", "Pitch", "Bunker", "Lob", "Putting"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Klubb">
          <select value={club} onChange={(e) => setClub(e.target.value)} className="portal-input">
            {["Driver", "3-tre", "5-tre", "4-hybrid", "5-jern", "6-jern", "7-jern", "8-jern", "9-jern", "PW", "GW", "SW", "LW", "Putter"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Malavstand">
          <input
            type="text"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="portal-input"
          />
        </Field>
        <Field label="Spredning (mal)">
          <input
            type="text"
            value={spread}
            onChange={(e) => setSpread(e.target.value)}
            placeholder="F.eks. 10cm"
            className="portal-input"
          />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Field label="PR-press">
          <select value={pr} onChange={(e) => setPr(Number(e.target.value))} className="portal-input">
            {[1, 2, 3, 4, 5].map((p) => (
              <option key={p} value={p}>PR{p}</option>
            ))}
          </select>
        </Field>
        <Field label="M-miljo">
          <select value={mLevel} onChange={(e) => setMLevel(Number(e.target.value))} className="portal-input">
            {[0, 1, 2, 3, 4].map((m) => (
              <option key={m} value={m}>M{m}</option>
            ))}
          </select>
        </Field>
        <Field label="L-fase">
          <select value={lPhase} onChange={(e) => setLPhase(e.target.value)} className="portal-input">
            {["KROPP", "ARM", "KOLLE", "BALL", "AUTO"].map((l) => (
              <option key={l} value={l}>L-{l}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Post-exercise scoring */}
      <div className="bg-surface rounded-xl p-4 space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wide text-grey-400 block">
          Etter ovelsen
        </span>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Score (treff)">
            <input
              type="text"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="F.eks. 7 / 10"
              className="portal-input"
            />
          </Field>
          <Field label="Pre-shot rutine">
            <select
              value={preShot}
              onChange={(e) => setPreShot(e.target.value)}
              className="portal-input"
            >
              <option value="">Ikke vurdert</option>
              <option value="ja">Ja</option>
              <option value="delvis">Delvis</option>
              <option value="nei">Nei</option>
            </select>
          </Field>
        </div>
      </div>

      {/* TrackMan data */}
      <div className="border border-grey-200 rounded-xl p-4">
        <span className="text-[10px] font-bold uppercase tracking-wide text-grey-400 block mb-3">
          TrackMan-data (valgfritt)
        </span>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Ball speed">
            <input type="text" placeholder="\u2014" className="portal-input font-mono text-xs tabular-nums" />
          </Field>
          <Field label="Launch">
            <input type="text" placeholder="\u2014" className="portal-input font-mono text-xs tabular-nums" />
          </Field>
          <Field label="Spin">
            <input type="text" placeholder="\u2014" className="portal-input font-mono text-xs tabular-nums" />
          </Field>
        </div>
      </div>

      <Field label="Notat">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="portal-input resize-none"
        />
      </Field>
    </div>
  );
}

/* ── Main Component ── */

export function ExerciseDetail({ open, onClose, type, name }: ExerciseDetailProps) {
  const pyramidBadge = type === "TEK"
    ? "bg-[var(--pyramid-tek)] text-white"
    : "bg-[var(--pyramid-slag)] text-white";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-[480px] bg-white border-l border-grey-200 z-50 flex flex-col shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-grey-200">
              <button onClick={onClose} className="p-1.5 hover:bg-grey-100 rounded-lg transition-colors">
                <ChevronLeft className="w-4 h-4 text-grey-400" />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${pyramidBadge}`}>
                    {type}
                  </span>
                  <h2 className="text-[15px] font-semibold text-black">{name}</h2>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-grey-100 rounded-lg transition-colors">
                <X className="w-4 h-4 text-grey-400" />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {type === "TEK" ? <TekForm /> : <SlagForm />}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-grey-200 flex justify-between">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-grey-400 hover:text-black transition-colors"
              >
                Tilbake
              </button>
              <button className="px-6 py-2.5 rounded-full bg-black text-white text-sm font-semibold hover:bg-grey-700 transition-colors">
                Lagre
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Shared Field ── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-[0.05em] text-grey-400 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
