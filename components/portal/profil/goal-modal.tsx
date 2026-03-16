"use client";

import { useState } from "react";
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
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[var(--color-snow)]">
            {isEditing ? "Rediger mål" : "Nytt mål"}
          </h2>
          <button type="button" onClick={onClose} className="p-1 hover:bg-[var(--color-muted)] rounded">
            <X className="w-4 h-4 text-[var(--color-gold-muted)]" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--color-gold-muted)] mb-1.5">
              Tittel *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="F.eks: Nå handicap 10 innen juli"
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm placeholder:text-[var(--color-gold-muted)]/50 outline-none focus:border-[var(--color-gold)]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-gold-muted)] mb-1.5">
              Beskrivelse
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Valgfri utdypning..."
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm placeholder:text-[var(--color-gold-muted)]/50 outline-none focus:border-[var(--color-gold)] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-gold-muted)] mb-1.5">
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
                      ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                      : "border-[var(--color-border)] text-[var(--color-gold-muted)] hover:border-[var(--color-gold)]/30"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--color-gold-muted)] mb-1.5">
                Målverdi
              </label>
              <input
                type="number"
                step="any"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="10"
                className="w-full px-3 py-2 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm outline-none focus:border-[var(--color-gold)]"
              />
            </div>
            {isEditing && (
              <div>
                <label className="block text-xs font-medium text-[var(--color-gold-muted)] mb-1.5">
                  Nåværende
                </label>
                <input
                  type="number"
                  step="any"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm outline-none focus:border-[var(--color-gold)]"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-[var(--color-gold-muted)] mb-1.5">
                Enhet
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="HCP"
                className="w-full px-3 py-2 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm outline-none focus:border-[var(--color-gold)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-gold-muted)] mb-1.5">
              Måldato
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm outline-none focus:border-[var(--color-gold)]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || !title.trim()}
          className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-gold)] text-[var(--color-bg-deep)] font-semibold text-sm hover:bg-[var(--color-gold-muted)] transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
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
