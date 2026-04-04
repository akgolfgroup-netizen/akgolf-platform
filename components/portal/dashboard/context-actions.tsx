"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  BarChart3,
  Calendar,
  BookOpen,
  Video,
  Target,
  Clock,
  ChevronRight,
} from "lucide-react";

interface ContextActionsProps {
  hasUpcomingSession: boolean;
  hasActiveTrainingPlan: boolean;
  todayTrainingCompleted: boolean;
  nextSessionIn?: string; // e.g., "2 timer"
}

export function ContextActions({
  hasUpcomingSession,
  hasActiveTrainingPlan,
  todayTrainingCompleted,
  nextSessionIn,
}: ContextActionsProps) {
  // Build contextual actions based on user state
  const primaryAction = !todayTrainingCompleted
    ? {
        label: "Logg dagens trening",
        description: "Fullfør din daglige økt",
        href: "/portal/dagbok",
        icon: Plus,
        gradient: "from-[var(--color-grey-900)] via-[var(--color-grey-700)] to-[var(--color-grey-900)]",
        priority: true,
      }
    : hasUpcomingSession
    ? {
        label: "Forbered neste time",
        description: nextSessionIn ? `Om ${nextSessionIn}` : "Se detaljer",
        href: "/portal/bookinger",
        icon: Clock,
        gradient: "from-blue-500 via-blue-600 to-blue-500",
        priority: true,
      }
    : {
        label: "Book ny time",
        description: "Fortsett utviklingen",
        href: "/portal/bookinger/ny",
        icon: Calendar,
        gradient: "from-[var(--color-grey-900)] via-[var(--color-grey-700)] to-[var(--color-grey-900)]",
        priority: true,
      };

  const secondaryActions = [
    {
      label: "Statistikk",
      href: "/portal/statistikk",
      icon: BarChart3,
      color: "text-[var(--color-success)]",
      bg: "bg-[var(--color-success)]/10",
    },
    {
      label: "Kalender",
      href: "/portal/kalender",
      icon: Calendar,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: hasActiveTrainingPlan ? "Treningsplan" : "Lag plan",
      href: "/portal/treningsplan",
      icon: Target,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Primary CTA - Takes 5 columns */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="col-span-12 md:col-span-5"
      >
        <Link href={primaryAction.href} className="group block">
          <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-[var(--portal-card-bg-solid)] to-[var(--portal-surface-raised)] border border-[var(--portal-card-border)] hover:border-[var(--color-grey-200)] transition-[border-color] duration-300">
            {/* Animated gradient border effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className={`absolute inset-0 bg-gradient-to-r ${primaryAction.gradient} opacity-5`} />
            </div>

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${primaryAction.gradient} flex items-center justify-center shadow-sm`}
                >
                  <primaryAction.icon className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--portal-text-primary)] group-hover:text-[var(--color-grey-500)] transition-colors">
                    {primaryAction.label}
                  </h3>
                  <p className="text-sm text-[var(--portal-text-muted)]">
                    {primaryAction.description}
                  </p>
                </div>
              </div>
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                className="w-10 h-10 rounded-full bg-[var(--portal-surface-sunken)] flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 text-[var(--portal-text-muted)] group-hover:text-[var(--color-grey-500)] transition-colors" />
              </motion.div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Secondary actions - 7 columns, 3 items */}
      <div className="col-span-12 md:col-span-7 grid grid-cols-3 gap-3">
        {secondaryActions.map((action, i) => (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
          >
            <Link href={action.href} className="group block">
              <div className="flex flex-col items-center gap-3 p-5 rounded-xl border border-[var(--portal-card-border)] bg-[var(--portal-card-bg-solid)] hover:border-white/10 hover:bg-[var(--portal-surface-raised)] transition-[border-color,background-color] duration-200">
                <motion.div
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center transition-colors`}
                >
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </motion.div>
                <span className="text-sm font-medium text-[var(--portal-text-primary)] group-hover:text-white transition-colors">
                  {action.label}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
