"use client";


import { Icon } from "@/components/ui/icon";
import { motion } from "framer-motion";
import { HandicapTrendChart } from "@/components/portal/dashboard/handicap-trend-chart";
import { AchievementsWidget } from "@/components/portal/dashboard/achievements-widget";
import { SessionsDonut } from "@/components/portal/dashboard/sessions-donut";

import type { DashboardV3Props } from "../dashboard-types";

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

/**
 * Progress Story — visuell progresjon over tid.
 *
 * View 4 (opt4): Fokus på reisen, milepæler og historikk.
 */
export function ProgressStoryView({
  handicapHistory,
  achievements,
  totalAchievements,
  stats,
  userName,
}: DashboardV3Props) {
  // TODO: Koble til reelle historiske milepæler
  const milestones = [
    { date: "Jan 2025", title: "Første registrerte runde", icon: "start" },
    { date: "Mar 2025", title: "HCP under 20", icon: "milestone" },
    { date: "Jun 2025", title: "50 treningstimer fullført", icon: "milestone" },
    { date: "Sep 2025", title: "Første turnering", icon: "competition" },
    { date: "Jan 2026", title: "HCP under 10", icon: "milestone" },
  ];

  return (
    <motion.div
      className="mx-auto w-full max-w-[1000px] space-y-8 pb-12 pt-2"
      initial="hidden"
      animate="show"
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
    >
      {/* Overskrift */}
      <motion.div variants={item} className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-text">
          {userName ? `${userName}s golfreise` : "Din golfreise"}
        </h2>
        <p className="text-sm text-muted">
          {stats.roundsCount} runder · {stats.sessionsCount} økter · {achievements.length} av {totalAchievements} achievements
        </p>
      </motion.div>

      {/* HCP-historikk */}
      <motion.div variants={item}>
        <HandicapTrendChart data={handicapHistory} />
      </motion.div>

      {/* Tidslinje */}
      <motion.div variants={item} className="rounded-2xl border border-grey-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Icon name="calendar_today" className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-text">Milepæler</h3>
        </div>
        <div className="relative space-y-6 pl-4">
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-grey-200" />
          {milestones.map((m, i) => (
            <div key={i} className="relative flex items-start gap-4">
              <div className="relative z-10 w-5 h-5 rounded-full bg-primary border-2 border-white shadow-sm shrink-0" />
              <div>
                <p className="text-xs text-muted">{m.date}</p>
                <p className="text-sm font-medium text-text">{m.title}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievements + distribusjon */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AchievementsWidget achievements={achievements} totalAchievements={totalAchievements} />
        <SessionsDonut />
      </motion.div>
    </motion.div>
  );
}
