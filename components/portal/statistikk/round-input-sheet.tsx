"use client";

import { useState } from "react";
import { X, Loader2, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { addRoundStats } from "@/app/portal/(dashboard)/statistikk/actions";

const SECTIONS = [
  { key: "scoring",   label: "Scoring" },
  { key: "sg",        label: "Strokes Gained" },
  { key: "driving",   label: "Drive" },
  { key: "approach",  label: "Innspill" },
  { key: "shortGame", label: "Rundt grønn" },
  { key: "putting",   label: "Putting" },
  { key: "mental",    label: "Mentalt" },
] as const;

export function RoundInputSheet({ onClose }: { onClose: () => void }) {
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["scoring"]));
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    courseName: "",
    // Scoring
    totalScore: "",
    scoreToPar: "",
    eagleCount: "",
    birdieCount: "", parCount: "", bogeyCount: "", doublePlusCount: "", bounceBackCount: "",
    par3Average: "", par4Average: "", par5Average: "",
    // SG
    sgTotal: "", sgOffTheTee: "", sgApproach: "", sgAroundTheGreen: "", sgPutting: "",
    // Driving
    drivingDistance: "", fairwaysHit: "", fairwaysTotal: "14", dispersion: "",
    // Approach
    gir: "", girTotal: "18", proximityToHole: "",
    approach100: "", approach150: "", approach200: "", approach200Plus: "",
    // Short game
    upAndDownMade: "", upAndDownTotal: "", sandSaveMade: "", sandSaveTotal: "",
    scrambleProximity: "",
    // Putting
    totalPutts: "", puttsPerGir: "", onePuttCount: "", threePuttCount: "",
    makePct3ft: "", makePct6ft: "", makePct10ft: "", speedRatio: "",
    // Mental
    mentalProcessRating: "",
    notes: "",
  });

  function toggleSection(key: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function numField(label: string, key: string, placeholder?: string) {
    return (
      <div>
        <label className="block text-[10px] font-medium text-[var(--color-gold-muted)] mb-1">
          {label}
        </label>
        <input
          type="number"
          step="any"
          value={(form as Record<string, string>)[key]}
          onChange={(e) => update(key, e.target.value)}
          placeholder={placeholder}
          className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm outline-none focus:border-[var(--color-gold)]"
        />
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.date) return;
    setSaving(true);

    const toNum = (v: string) => (v ? parseFloat(v) : undefined);
    const toInt = (v: string) => (v ? parseInt(v) : undefined);

    await addRoundStats({
      date: form.date,
      courseName: form.courseName || undefined,
      source: "UPGAME",
      // Scoring
      totalScore: toInt(form.totalScore),
      scoreToPar: toInt(form.scoreToPar),
      eagleCount: toInt(form.eagleCount),
      birdieCount: toInt(form.birdieCount),
      parCount: toInt(form.parCount),
      bogeyCount: toInt(form.bogeyCount),
      doublePlusCount: toInt(form.doublePlusCount),
      bounceBackCount: toInt(form.bounceBackCount),
      par3Average: toNum(form.par3Average),
      par4Average: toNum(form.par4Average),
      par5Average: toNum(form.par5Average),
      // SG
      sgTotal: toNum(form.sgTotal),
      sgOffTheTee: toNum(form.sgOffTheTee),
      sgApproach: toNum(form.sgApproach),
      sgAroundTheGreen: toNum(form.sgAroundTheGreen),
      sgPutting: toNum(form.sgPutting),
      // Driving
      drivingDistance: toNum(form.drivingDistance),
      fairwaysHit: toInt(form.fairwaysHit),
      fairwaysTotal: toInt(form.fairwaysTotal),
      dispersion: toNum(form.dispersion),
      // Approach
      gir: toInt(form.gir),
      girTotal: toInt(form.girTotal),
      proximityToHole: toNum(form.proximityToHole),
      approach100: toNum(form.approach100),
      approach150: toNum(form.approach150),
      approach200: toNum(form.approach200),
      approach200Plus: toNum(form.approach200Plus),
      // Short game
      upAndDownMade: toInt(form.upAndDownMade),
      upAndDownTotal: toInt(form.upAndDownTotal),
      sandSaveMade: toInt(form.sandSaveMade),
      sandSaveTotal: toInt(form.sandSaveTotal),
      scrambleProximity: toNum(form.scrambleProximity),
      // Putting
      totalPutts: toInt(form.totalPutts),
      puttsPerGir: toNum(form.puttsPerGir),
      onePuttCount: toInt(form.onePuttCount),
      threePuttCount: toInt(form.threePuttCount),
      makePct3ft: toNum(form.makePct3ft),
      makePct6ft: toNum(form.makePct6ft),
      makePct10ft: toNum(form.makePct10ft),
      speedRatio: toNum(form.speedRatio),
      // Mental
      mentalProcessRating: toInt(form.mentalProcessRating),
      notes: form.notes || undefined,
    });

    setSaving(false);
    onClose();
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-t-2xl sm:rounded-2xl p-5 w-full max-w-lg max-h-[85vh] overflow-y-auto"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[var(--color-snow)]">Registrer runde</h2>
          <button type="button" onClick={onClose} className="p-1 hover:bg-[var(--color-muted)] rounded">
            <X className="w-4 h-4 text-[var(--color-gold-muted)]" />
          </button>
        </div>

        {/* Required fields */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-[10px] font-medium text-[var(--color-gold-muted)] mb-1">Dato *</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              required
              className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm outline-none focus:border-[var(--color-gold)]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-[var(--color-gold-muted)] mb-1">Bane</label>
            <input
              type="text"
              value={form.courseName}
              onChange={(e) => update("courseName", e.target.value)}
              placeholder="GFGK"
              className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm outline-none focus:border-[var(--color-gold)]"
            />
          </div>
        </div>

        {/* Collapsible sections */}
        <div className="space-y-2">
          {SECTIONS.map((section) => (
            <div key={section.key} className="border border-[var(--color-border)] rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection(section.key)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-[var(--color-gold-muted)] hover:bg-[var(--color-muted)]/50 transition-colors"
              >
                {section.label}
                {expandedSections.has(section.key) ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
              {expandedSections.has(section.key) && (
                <div className="px-3 pb-3 grid grid-cols-2 gap-2">
                  {section.key === "scoring" && (
                    <>
                      {numField("Total Score", "totalScore", "78")}
                      {numField("Til par", "scoreToPar", "-2")}
                      {numField("Eagles", "eagleCount")}
                      {numField("Birdies", "birdieCount")}
                      {numField("Par", "parCount")}
                      {numField("Bogey", "bogeyCount")}
                      {numField("Dobbel+", "doublePlusCount")}
                      {numField("Bounce Back", "bounceBackCount")}
                      {numField("Snitt par 3", "par3Average")}
                      {numField("Snitt par 4", "par4Average")}
                      {numField("Snitt par 5", "par5Average")}
                    </>
                  )}
                  {section.key === "sg" && (
                    <>
                      {numField("SG Total", "sgTotal")}
                      {numField("SG Off the Tee", "sgOffTheTee")}
                      {numField("SG Approach", "sgApproach")}
                      {numField("SG Rundt Green", "sgAroundTheGreen")}
                      {numField("SG Putting", "sgPutting")}
                    </>
                  )}
                  {section.key === "driving" && (
                    <>
                      {numField("Driving-distanse (m)", "drivingDistance")}
                      {numField("Fairways truffet", "fairwaysHit")}
                      {numField("Fairways totalt", "fairwaysTotal")}
                      {numField("Dispersion (m)", "dispersion")}
                    </>
                  )}
                  {section.key === "approach" && (
                    <>
                      {numField("GIR", "gir")}
                      {numField("GIR totalt", "girTotal")}
                      {numField("Proximity (m)", "proximityToHole")}
                      {numField("Snitt 100m (m)", "approach100")}
                      {numField("Snitt 150m (m)", "approach150")}
                      {numField("Snitt 200m (m)", "approach200")}
                      {numField("Snitt 200m+ (m)", "approach200Plus")}
                    </>
                  )}
                  {section.key === "shortGame" && (
                    <>
                      {numField("Up & Down gjort", "upAndDownMade")}
                      {numField("Up & Down totalt", "upAndDownTotal")}
                      {numField("Sand Save gjort", "sandSaveMade")}
                      {numField("Sand Save totalt", "sandSaveTotal")}
                      {numField("Scramble proximity (m)", "scrambleProximity")}
                    </>
                  )}
                  {section.key === "putting" && (
                    <>
                      {numField("Totalt putts", "totalPutts")}
                      {numField("Putts/GIR", "puttsPerGir")}
                      {numField("1-putts", "onePuttCount")}
                      {numField("3-putts", "threePuttCount")}
                      {numField("Make% 3ft", "makePct3ft")}
                      {numField("Make% 6ft", "makePct6ft")}
                      {numField("Make% 10ft", "makePct10ft")}
                      {numField("Speed ratio", "speedRatio")}
                    </>
                  )}
                  {section.key === "mental" && (
                    <div className="col-span-2">
                      {numField("Mental prosessrating (1-10)", "mentalProcessRating")}
                      <div className="mt-2">
                        <label className="block text-[10px] font-medium text-[var(--color-gold-muted)] mb-1">
                          Notater
                        </label>
                        <textarea
                          value={form.notes}
                          onChange={(e) => update("notes", e.target.value)}
                          rows={2}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm outline-none focus:border-[var(--color-gold)] resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving || !form.date}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-gold)] text-[var(--color-bg-deep)] font-semibold text-sm hover:bg-[var(--color-gold-muted)] transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Lagre runde
        </button>
      </motion.form>
    </motion.div>
  );
}
