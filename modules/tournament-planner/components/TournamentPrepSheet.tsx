"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Map, ListChecks, Brain } from "lucide-react";
import { CourseStrategyGrid } from "./CourseStrategyGrid";
import { PrepChecklistComponent } from "./PrepChecklist";
import { ReadinessMeter } from "./ReadinessMeter";
import type { HoleStrategy, PrepChecklist, TournamentPrepData } from "../types";

const TABS = [
  { key: "strategy", label: "Strategi", icon: Map },
  { key: "checklist", label: "Sjekkliste", icon: ListChecks },
  { key: "mental", label: "Mental", icon: Brain },
] as const;

interface TournamentPrepSheetProps {
  tournamentId: string;
  tournamentName: string;
  initialPrep: TournamentPrepData | null;
  onSave: (data: {
    courseStrategy?: HoleStrategy[];
    checklist?: PrepChecklist;
    readinessScore?: number;
    mentalPrepNotes?: string;
    warmupPlan?: string;
  }) => Promise<void>;
  onClose: () => void;
}

export function TournamentPrepSheet({
  tournamentName,
  initialPrep,
  onSave,
  onClose,
}: TournamentPrepSheetProps) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["key"]>("strategy");
  const [saving, setSaving] = useState(false);

  const [strategy, setStrategy] = useState<HoleStrategy[] | null>(
    initialPrep?.courseStrategy ?? null
  );
  const [checklist, setChecklist] = useState<PrepChecklist | null>(
    initialPrep?.checklist ?? null
  );
  const [readiness, setReadiness] = useState<number | null>(
    initialPrep?.readinessScore ?? null
  );
  const [mentalNotes, setMentalNotes] = useState(initialPrep?.mentalPrepNotes ?? "");
  const [warmupPlan, setWarmupPlan] = useState(initialPrep?.warmupPlan ?? "");

  async function handleSave() {
    setSaving(true);
    await onSave({
      courseStrategy: strategy ?? undefined,
      checklist: checklist ?? undefined,
      readinessScore: readiness ?? undefined,
      mentalPrepNotes: mentalNotes || undefined,
      warmupPlan: warmupPlan || undefined,
    });
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60">
      <div className="bg-[var(--color-bg)] border border-[var(--color-grey-200)] rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-grey-200)]">
          <div>
            <h2 className="font-bold text-[var(--color-grey-900)]">Turneringsforberedelse</h2>
            <p className="text-xs text-[var(--color-grey-400)] mt-0.5">{tournamentName}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[var(--color-grey-100)] rounded">
            <X className="w-4 h-4 text-[var(--color-grey-400)]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--color-grey-200)]">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold transition-colors border-b-2 ${
                activeTab === tab.key
                  ? "text-[var(--color-grey-900)] border-[var(--color-grey-900)]"
                  : "text-[var(--color-grey-400)] border-transparent hover:text-[var(--color-grey-900)]"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === "strategy" && (
            <CourseStrategyGrid strategy={strategy} onChange={setStrategy} />
          )}

          {activeTab === "checklist" && (
            <PrepChecklistComponent checklist={checklist} onChange={setChecklist} />
          )}

          {activeTab === "mental" && (
            <div className="space-y-5">
              <ReadinessMeter score={readiness} onChange={setReadiness} />

              <div>
                <label className="block text-xs font-semibold text-[var(--color-grey-400)] uppercase tracking-wider mb-2">
                  Mental forberedelse
                </label>
                <textarea
                  value={mentalNotes}
                  onChange={(e) => setMentalNotes(e.target.value)}
                  rows={4}
                  placeholder="Fokusområder, rutiner, mantras..."
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] text-[var(--color-grey-900)] text-sm placeholder:text-[var(--color-grey-400)]/50 outline-none focus:border-[var(--color-grey-900)] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-grey-400)] uppercase tracking-wider mb-2">
                  Oppvarmingsplan
                </label>
                <textarea
                  value={warmupPlan}
                  onChange={(e) => setWarmupPlan(e.target.value)}
                  rows={3}
                  placeholder="Range-rutine, putting-rutine, tidsplan..."
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] text-[var(--color-grey-900)] text-sm placeholder:text-[var(--color-grey-400)]/50 outline-none focus:border-[var(--color-grey-900)] resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Save */}
        <div className="p-5 border-t border-[var(--color-grey-200)]">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-black)] text-white font-semibold text-sm hover:bg-[var(--color-grey-400)] transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lagre forberedelse"}
          </button>
        </div>
      </div>
    </div>
  );
}
