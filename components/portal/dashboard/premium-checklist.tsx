"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Sparkles, Gift, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  completed: boolean;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  points?: number;
}

interface PremiumChecklistProps {
  items: ChecklistItem[];
  title?: string;
  onComplete?: () => void;
}

export function PremiumChecklist({
  items,
  title = "Dagens oppgaver",
  onComplete,
}: PremiumChecklistProps) {
  const [justCompleted, setJustCompleted] = useState<string | null>(null);
  const completedCount = items.filter((i) => i.completed).length;
  const totalCount = items.length;
  const allComplete = completedCount === totalCount;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Celebration when all items complete
  useEffect(() => {
    if (allComplete && completedCount > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#B07D4F", "#D4A76A", "#FFD700"],
      });
      onComplete?.();
    }
  }, [allComplete, completedCount, onComplete]);

  return (
    <div className="portal-card rounded-2xl overflow-hidden">
      {/* Header with progress bar */}
      <div className="p-5 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              {allComplete ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Sparkles className="w-5 h-5 text-gold" />
                </motion.div>
              ) : (
                <span className="text-lg font-bold text-gold">{completedCount}</span>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="text-xs text-[var(--portal-text-muted)]">
                {allComplete ? "Alt fullfort! Bra jobba!" : `${completedCount} av ${totalCount} fullfort`}
              </p>
            </div>
          </div>

          {/* Reward indicator */}
          {!allComplete && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20">
              <Gift className="w-3.5 h-3.5 text-gold" />
              <span className="text-xs font-medium text-gold">+50 XP</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-[var(--color-grey-100)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-gold to-amber-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="p-3">
        <AnimatePresence mode="popLayout">
          {items.map((item, idx) => {
            const isJustCompleted = justCompleted === item.id;

            const content = (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className={`group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                  item.completed
                    ? "bg-emerald-500/5"
                    : "hover:bg-[var(--color-grey-100)] cursor-pointer"
                }`}
              >
                {/* Checkbox */}
                <div className="relative flex-shrink-0">
                  {item.completed ? (
                    <motion.div
                      initial={isJustCompleted ? { scale: 0 } : { scale: 1 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-[var(--portal-card-border)] group-hover:border-gold/50 transition-colors flex items-center justify-center">
                      <Circle className="w-3 h-3 text-transparent group-hover:text-gold/30 transition-colors" />
                    </div>
                  )}

                  {/* Completion ripple effect */}
                  {isJustCompleted && (
                    <motion.div
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 rounded-full bg-emerald-500"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium transition-colors ${
                      item.completed
                        ? "text-[var(--portal-text-muted)] line-through"
                        : "text-white group-hover:text-gold"
                    }`}
                  >
                    {item.label}
                  </p>
                  {item.description && (
                    <p className="text-xs text-[var(--portal-text-muted)] mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Points badge */}
                {item.points && !item.completed && (
                  <div className="flex-shrink-0 px-2 py-1 rounded-md bg-gold/10 text-[11px] font-medium text-gold">
                    +{item.points} XP
                  </div>
                )}

                {/* Arrow for incomplete items */}
                {!item.completed && item.href && (
                  <ChevronRight className="w-4 h-4 text-[var(--portal-text-muted)] group-hover:text-gold transition-colors flex-shrink-0" />
                )}
              </motion.div>
            );

            if (item.href && !item.completed) {
              return (
                <Link key={item.id} href={item.href} className="block">
                  {content}
                </Link>
              );
            }

            return content;
          })}
        </AnimatePresence>
      </div>

      {/* Completion celebration */}
      <AnimatePresence>
        {allComplete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-5 pb-5"
          >
            <div className="p-4 rounded-xl bg-gradient-to-r from-gold/10 to-amber-500/5 border border-gold/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Fantastisk innsats!</p>
                  <p className="text-xs text-[var(--portal-text-muted)]">
                    Du har fullfort alle dagens oppgaver
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
