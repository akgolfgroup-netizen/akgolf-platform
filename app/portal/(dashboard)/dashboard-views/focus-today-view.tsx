"use client";


import { Icon } from "@/components/ui/icon";
import { motion } from "framer-motion";
import { WelcomeSection } from "@/components/portal/dashboard/welcome-section";
import { NextBookingCard } from "@/components/portal/dashboard/next-booking-card";
import { CoachInsightCard } from "@/components/portal/dashboard/coach-insight-card";
import { TrainingActivityCard } from "@/components/portal/dashboard/training-activity-card";

import type { DashboardV3Props } from "../dashboard-types";

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

/**
 * Focus Today — dagens fokus og neste steg.
 *
 * View 2 (opt2): Minimal, ren og handlingsorientert.
 */
export function FocusTodayView({
  userName,
  tier,
  memberSince,
  nextBooking,
  coachInsight,
  stats,
}: DashboardV3Props) {
  // TODO: Koble til dagens plan fra TrainingPlanSession
  const todaysFocus = [
    { done: true, text: "10 min putting-rutine" },
    { done: false, text: "TrackMan — 7-jern (20 baller)" },
    { done: false, text: "Mental visualisering — 5 min" },
  ];

  return (
    <motion.div
      className="mx-auto w-full max-w-[900px] space-y-8 pb-12 pt-2"
      initial="hidden"
      animate="show"
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
    >
      <motion.div variants={item}>
        <WelcomeSection userName={userName} tier={tier} memberSince={memberSince} />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <NextBookingCard booking={nextBooking} />
        <TrainingActivityCard sessionsCount={stats.sessionsCount} streak={12} />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Dagens fokus */}
        <div className="rounded-2xl border border-grey-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="my_location" className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-text">Dagens fokus</h3>
          </div>
          <div className="space-y-3">
            {todaysFocus.map((task, i) => (
              <div key={i} className="flex items-center gap-3">
                <Icon name="check"Circle2
                  className={
                    "w-5 h-5 shrink-0 " +
                    (task.done ? "text-success fill-success" : "text-grey-200")
                  } />
                <span
                  className={
                    "text-sm " + (task.done ? "text-muted line-through" : "text-text")
                  }
                >
                  {task.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Neste steg */}
        <div className="rounded-2xl border border-grey-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="schedule" className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-text">Neste steg</h3>
          </div>
          <div className="space-y-3 text-sm text-text">
            <p className="flex items-start gap-2">
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary-soft text-primary text-xs font-bold shrink-0">
                1
              </span>
              Fullfør dagens treningsøkt
            </p>
            <p className="flex items-start gap-2">
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary-soft text-primary text-xs font-bold shrink-0">
                2
              </span>
              Logg resultater i dagboken
            </p>
            <p className="flex items-start gap-2">
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary-soft text-primary text-xs font-bold shrink-0">
                3
              </span>
              Forbered spørsmål til neste coaching
            </p>
          </div>
        </div>
      </motion.div>

      {coachInsight && (
        <motion.div variants={item}>
          <CoachInsightCard coachInsight={coachInsight} />
        </motion.div>
      )}
    </motion.div>
  );
}
