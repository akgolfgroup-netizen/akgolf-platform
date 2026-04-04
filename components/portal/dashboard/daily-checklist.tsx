"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  href?: string;
}

interface DailyChecklistProps {
  items: ChecklistItem[];
  title?: string;
}

export function DailyChecklist({
  items,
  title = "Dagens sjekkliste",
}: DailyChecklistProps) {
  const completedCount = items.filter((i) => i.completed).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="portal-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <svg width="48" height="48" className="progress-ring">
            <circle
              cx="24"
              cy="24"
              r={radius}
              stroke="currentColor"
              strokeOpacity={0.1}
              strokeWidth={4}
              fill="none"
              className="text-[var(--portal-card-border)]"
            />
            <motion.circle
              cx="24"
              cy="24"
              r={radius}
              stroke="var(--color-grey-900)"
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="progress-ring-circle"
            />
          </svg>
          <div>
            <h3 className="text-sm font-semibold text-[var(--portal-text-primary)]">{title}</h3>
            <p className="text-xs text-[var(--portal-text-muted)]">
              {completedCount} av {totalCount} fullfort
            </p>
          </div>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-2"
      >
        {items.map((item) => {
          const content = (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                item.completed
                  ? "border-[#2D6A4F]/30 bg-[#2D6A4F]/10"
                  : "border-[var(--portal-card-border)] hover:border-[var(--color-grey-300)]"
              }`}
            >
              {item.completed ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <CheckCircle2 className="h-5 w-5 text-[#2D6A4F]" />
                </motion.div>
              ) : (
                <Circle className="h-5 w-5 text-[var(--portal-text-muted)]" />
              )}
              <span
                className={`text-sm ${
                  item.completed
                    ? "text-[var(--portal-text-muted)] line-through"
                    : "text-[var(--portal-text-primary)]"
                }`}
              >
                {item.label}
              </span>
            </motion.div>
          );

          if (item.href && !item.completed) {
            return (
              <Link key={item.id} href={item.href}>
                {content}
              </Link>
            );
          }

          return <div key={item.id}>{content}</div>;
        })}
      </motion.div>
    </div>
  );
}
