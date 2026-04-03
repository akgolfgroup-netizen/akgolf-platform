"use client";

import { useState, useEffect, useId } from "react";
import { X, Loader2 } from "lucide-react";
import { createGoal, updateGoal } from "@/app/portal/(dashboard)/profil/goal-actions";
import type { GoalCategory } from "@prisma/client";

const CATEGORIES: { value: GoalCategory; label: string }[] = [
  { value: "SCORE", label: "Score" },
  { value: "PHYSICAL", label: "Fysisk" },
  { value: "MENTAL", label: "Mental" },
  { value: "TOURNAMENT", label: "Turnering" },
  { value: "PROCESS", label: "Prosess" },
];

interface GoalModalProps {
  goal?: {
    id: string;
    title: string;
    description: string | null;
    category: GoalCategory;
    targetValue: number | null;
    currentValue: number | null;
    unit: string | null;
    targetDate: Date | null;
  } | null;
  onClose: () => void;
}

export function GoalModal({ goal, onClose }: GoalModalProps) {
  const isEditing = !!goal;
  const titleId = useId();
  const [title, setTitle] = useState(goal?.title ?? "");
  const [description, setDescription] = useState(goal?.description ?? "");
  const [category, setCategory] = useState<GoalCategory>(goal?.category ?? "SCORE");
  const [targetValue, setTargetValue] = useState(goal?.targetValue?.toString() ?? "");
  const [currentValue, setCurrentValue] = useState(goal?.currentValue?.toString() ?? "");
  const [unit, setUnit] = useState(goal?.unit ?? "");
  const [targetDate, setTargetDate] = useState(
    goal?.targetDate ? new Date(goal.targetDate).toISOString().split("T")[0] : ""
  );
  const [saving, setSaving] = useState(false);

  // Escape key handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);

    if (isEditing) {
      await updateGoal(goal.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        targetValue: targetValue ? parseFloat(targetValue) : undefined,
        currentValue: currentValue ? parseFloat(currentValue) : undefined,
        unit: unit.trim() || undefined,
        targetDate: targetDate || undefined,
      });
    } else {
      await createGoal({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        targetValue: targetValue ? parseFloat(targetValue) : undefined,
        unit: unit.trim() || undefined,
        targetDate: targetDate || undefined,
      });
    }

    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      />
      <form
        onSubmit={handleSubmit}
        className="relative bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] rounded-2xl p-6 w-full max-w-md overscroll-contain"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id={titleId} className="font-bold text-[var(--color-grey-900)]">
            {isEditing ? "Rediger mål" : "Nytt mål"}
          </h2>
          <button type="button" onClick={onClose} className="p-1 hover:bg-[var(--color-grey-100)] rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-grey-900)]" aria-label="Lukk dialog">
            <X className="w-4 h-4 text-[var(--color-grey-500)]" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--color-grey-500)] mb-1.5">
              Tittel *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="F.eks: Nå handicap 10 innen juli"
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] text-[var(--color-grey-900)] text-sm placeholder:text-[var(--color-grey-500)]/50 outline-none focus:border-[var(--color-grey-900)]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-grey-500)] mb-1.5">
              Beskrivelse
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Valgfri utdypning..."
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] text-[var(--color-grey-900)] text-sm placeholder:text-[var(--color-grey-500)]/50 outline-none focus:border-[var(--color-grey-900)] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-grey-500)] mb-1.5">
              Kategori
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    category === c.value
                      ? "border-[var(--color-grey-900)] bg-[var(--color-grey-900)]/10 text-[var(--color-grey-900)]"
                      : "border-[var(--color-grey-200)] text-[var(--color-grey-500)] hover:border-[var(--color-grey-900)]/30"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--color-grey-500)] mb-1.5">
                Målverdi
              </label>
              <input
                type="number"
                step="any"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="10"
                className="w-full px-3 py-2 rounded-xl bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] text-[var(--color-grey-900)] text-sm outline-none focus:border-[var(--color-grey-900)]"
              />
            </div>
            {isEditing && (
              <div>
                <label className="block text-xs font-medium text-[var(--color-grey-500)] mb-1.5">
                  Nåværende
                </label>
                <input
                  type="number"
                  step="any"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] text-[var(--color-grey-900)] text-sm outline-none focus:border-[var(--color-grey-900)]"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-[var(--color-grey-500)] mb-1.5">
                Enhet
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="HCP"
                className="w-full px-3 py-2 rounded-xl bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] text-[var(--color-grey-900)] text-sm outline-none focus:border-[var(--color-grey-900)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-grey-500)] mb-1.5">
              Måldato
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] text-[var(--color-grey-900)] text-sm outline-none focus:border-[var(--color-grey-900)]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || !title.trim()}
          className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-grey-900)] text-white font-semibold text-sm hover:bg-[var(--color-grey-700)] transition-colors disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-grey-900)]"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : isEditing ? (
            "Lagre endringer"
          ) : (
            "Opprett mål"
          )}
        </button>
      </form>
    </div>
  );
}
