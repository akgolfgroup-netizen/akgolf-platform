"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Plus, Check, Pause, Trash2, Pencil } from "lucide-react";
import { GoalModal } from "./goal-modal";
import { updateGoal, deleteGoal } from "@/app/portal/(dashboard)/profil/goal-actions";
import type { GoalCategory, GoalStatus } from "@prisma/client";

interface Goal {
  id: string;
  title: string;
  description: string | null;
  category: GoalCategory;
  targetValue: number | null;
  currentValue: number | null;
  unit: string | null;
  targetDate: Date | null;
  status: GoalStatus;
}

const CATEGORY_CONFIG: Record<GoalCategory, { label: string; color: string }> = {
  SCORE: { label: "Score", color: "var(--color-grey-900)" },
  PHYSICAL: { label: "Fysisk", color: "#10B981" },
  MENTAL: { label: "Mental", color: "#8B5CF6" },
  TOURNAMENT: { label: "Turnering", color: "#38BDF8" },
  PROCESS: { label: "Prosess", color: "#F59E0B" },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function GoalList({ goals, canCreate }: { goals: Goal[]; canCreate: boolean }) {
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const activeGoals = goals.filter((g) => g.status === "ACTIVE");
  const completedGoals = goals.filter((g) => g.status === "COMPLETED");

  async function handleStatusToggle(goal: Goal) {
    const newStatus = goal.status === "ACTIVE" ? "COMPLETED" : "ACTIVE";
    await updateGoal(goal.id, { status: newStatus as GoalStatus });
  }

  async function handlePause(goal: Goal) {
    await updateGoal(goal.id, { status: "PAUSED" as GoalStatus });
  }

  async function handleDelete(goalId: string) {
    await deleteGoal(goalId);
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "var(--color-grey-100)",
        border: "1px solid var(--color-grey-200)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[var(--color-grey-900)]" />
          <h2 className="text-sm font-semibold text-[var(--color-grey-900)]">Mine mål</h2>
        </div>
        {canCreate && (
          <button
            onClick={() => { setEditingGoal(null); setShowModal(true); }}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[var(--color-grey-900)] text-[var(--color-grey-900)] font-medium hover:bg-[var(--color-grey-500)] transition-colors"
          >
            <Plus className="w-3 h-3" />
            Nytt mål
          </button>
        )}
      </div>

      {goals.length === 0 ? (
        <p className="text-xs text-[var(--color-grey-500)] text-center py-6">
          {canCreate
            ? "Ingen mål ennå. Sett ditt første mål!"
            : "Ingen mål ennå. Oppgrader til Pro for å sette mål."}
        </p>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
          {activeGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onToggle={() => handleStatusToggle(goal)}
              onPause={() => handlePause(goal)}
              onEdit={() => { setEditingGoal(goal); setShowModal(true); }}
              onDelete={() => handleDelete(goal.id)}
            />
          ))}
          {completedGoals.length > 0 && (
            <div className="pt-2">
              <p className="text-[10px] font-semibold text-[var(--color-grey-400)] uppercase tracking-widest mb-2">
                Fullført
              </p>
              {completedGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onToggle={() => handleStatusToggle(goal)}
                  onDelete={() => handleDelete(goal.id)}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {showModal && (
        <GoalModal
          goal={editingGoal}
          onClose={() => { setShowModal(false); setEditingGoal(null); }}
        />
      )}
    </div>
  );
}

function GoalCard({
  goal,
  onToggle,
  onPause,
  onEdit,
  onDelete,
}: {
  goal: Goal;
  onToggle: () => void;
  onPause?: () => void;
  onEdit?: () => void;
  onDelete: () => void;
}) {
  const config = CATEGORY_CONFIG[goal.category];
  const progress =
    goal.targetValue && goal.currentValue
      ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
      : null;
  const isCompleted = goal.status === "COMPLETED";

  return (
    <motion.div
      variants={item}
      className="group flex items-start gap-3 p-3 rounded-xl border border-[var(--color-grey-200)] hover:border-[var(--color-grey-900)]/20 transition-colors"
      style={{ background: isCompleted ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.02)" }}
    >
      <button
        onClick={onToggle}
        className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors"
        style={{
          borderColor: isCompleted ? "#10B981" : "var(--color-grey-200)",
          background: isCompleted ? "rgba(34,197,94,0.15)" : "transparent",
        }}
      >
        {isCompleted && <Check className="w-3 h-3 text-[#2D6A4F]" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className={`text-sm font-medium ${isCompleted ? "line-through text-[var(--color-grey-500)]/50" : "text-[var(--color-grey-900)]"}`}
          >
            {goal.title}
          </span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
            style={{ background: `${config.color}15`, color: config.color }}
          >
            {config.label}
          </span>
        </div>

        {goal.description && (
          <p className="text-xs text-[var(--color-grey-500)] mb-1.5 line-clamp-1">
            {goal.description}
          </p>
        )}

        {progress !== null && !isCompleted && (
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-1.5 rounded-full bg-[var(--color-grey-200)]">
              <div
                className="h-1.5 rounded-full transition-[width] duration-500"
                style={{ width: `${progress}%`, background: config.color }}
              />
            </div>
            <span className="text-[10px] text-[var(--color-grey-500)] flex-shrink-0">
              {goal.currentValue} / {goal.targetValue} {goal.unit}
            </span>
          </div>
        )}

        {goal.targetDate && !isCompleted && (
          <p className="text-[10px] text-[var(--color-grey-500)]/50 mt-1">
            Mål: {new Date(goal.targetDate).toLocaleDateString("nb-NO")}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {onEdit && !isCompleted && (
          <button onClick={onEdit} className="p-1 rounded hover:bg-[var(--color-grey-200)] transition-colors">
            <Pencil className="w-3 h-3 text-[var(--color-grey-500)]" />
          </button>
        )}
        {onPause && !isCompleted && (
          <button onClick={onPause} className="p-1 rounded hover:bg-[var(--color-grey-200)] transition-colors">
            <Pause className="w-3 h-3 text-[var(--color-grey-500)]" />
          </button>
        )}
        <button onClick={onDelete} className="p-1 rounded hover:bg-[#D14343]/10 transition-colors">
          <Trash2 className="w-3 h-3 text-[#D14343]/50 hover:text-[#D14343]" />
        </button>
      </div>
    </motion.div>
  );
}
