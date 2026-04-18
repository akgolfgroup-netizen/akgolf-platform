"use client";

import { motion } from "framer-motion";
import { ShortcutPills } from "@/components/portal/dashboard/shortcut-pills";
import { NextBookingCard } from "@/components/portal/dashboard/next-booking-card";
import { TrainingActivityCard } from "@/components/portal/dashboard/training-activity-card";
import { Link } from "lucide-react";
import type { DashboardV3Props } from "../dashboard-types";

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

/**
 * Command Center — hurtighandlinger og status.
 *
 * View 5 (opt5): Action-first med CMD+K-stil navigasjon.
 */
export function CommandCenterView({
  nextBooking,
  stats,
  userName,
}: DashboardV3Props) {
  const quickActions = [
    { label: "Book time", href: "/portal/booking", desc: "Finn ledig tid" },
    { label: "Logg økt", href: "/portal/dagbok", desc: "Registrer trening" },
    { label: "Registrer runde", href: "/portal/runde/ny", desc: "Lagre score" },
    { label: "Se statistikk", href: "/portal/statistikk", desc: "Analyser data" },
    { label: "AI-coach", href: "/portal/ai-coach", desc: "Spør om tips" },
    { label: "Meldinger", href: "/portal/meldinger", desc: "Coaching-feedback" },
  ];

  return (
    <motion.div
      className="mx-auto w-full max-w-[900px] space-y-8 pb-12 pt-2"
      initial="hidden"
      animate="show"
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
    >
      {/* Velkomst */}
      <motion.div variants={item}>
        <h2 className="text-2xl font-bold text-text">
          Hei, {userName?.split(" ")[0] ?? "spiller"}
        </h2>
        <p className="text-sm text-muted mt-1">Hva vil du gjøre i dag?</p>
      </motion.div>

      {/* Hurtighandlinger */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickActions.map((action) => (
          <a
            key={action.href}
            href={action.href}
            className="group flex items-center justify-between rounded-xl border border-grey-100 bg-white p-4 shadow-sm transition-all hover:border-primary hover:shadow-md"
          >
            <div>
              <p className="text-sm font-semibold text-text group-hover:text-primary transition-colors">
                {action.label}
              </p>
              <p className="text-xs text-muted">{action.desc}</p>
            </div>
            <Link className="w-4 h-4 text-grey-300 group-hover:text-primary transition-colors" />
          </a>
        ))}
      </motion.div>

      {/* Status-rad */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <NextBookingCard booking={nextBooking} />
        <TrainingActivityCard sessionsCount={stats.sessionsCount} streak={12} />
      </motion.div>

      {/* Snarveier */}
      <motion.div variants={item}>
        <ShortcutPills />
      </motion.div>
    </motion.div>
  );
}
