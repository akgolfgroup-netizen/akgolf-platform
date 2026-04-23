"use client";


import { Icon } from "@/components/ui/icon";
import { motion } from "framer-motion";

import { PremiumCard } from "@/components/portal/dashboard/premium-card";

interface PlanProgressTrackerProps {
  weekTitle: string;
  loggedCount: number;
  plannedCount: number;
}

export function PlanProgressTracker({
  weekTitle,
  loggedCount,
  plannedCount,
}: PlanProgressTrackerProps) {
  const progress = plannedCount > 0 ? Math.round((loggedCount / plannedCount) * 100) : 0;
  const remaining = Math.max(0, plannedCount - loggedCount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <PremiumCard variant="accent" padding="md" className="border-l-4 border-l-primary">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Icon name="my_location" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                Aktiv treningsplan
              </p>
              <h3 className="text-sm font-semibold text-on-surface">{weekTitle}</h3>
              <p className="text-[12px] text-on-surface-variant">
                {loggedCount} av {plannedCount} økter logget denne uken
                {remaining > 0 && ` — ${remaining} igjen`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:w-48">
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between text-[11px] font-medium">
                <span className="text-on-surface-variant">Fremdrift</span>
                <span className="text-on-surface">{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </div>
            {progress === 100 ? (
              <Icon name="check_circle" className="h-5 w-5 shrink-0 text-success" />
            ) : (
              <Icon name="calendar_today" className="h-5 w-5 shrink-0 text-on-surface-variant/60" />
            )}
          </div>
        </div>
      </PremiumCard>
    </motion.div>
  );
}
