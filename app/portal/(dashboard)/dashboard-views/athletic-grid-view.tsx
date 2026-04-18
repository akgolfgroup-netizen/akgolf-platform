"use client";

import { motion } from "framer-motion";
import { WelcomeSection } from "@/components/portal/dashboard/welcome-section";
import { NextBookingCard } from "@/components/portal/dashboard/next-booking-card";
import { PlayerProfileCard } from "@/components/portal/dashboard/player-profile-card";
import { WeekCalendar } from "@/components/portal/dashboard/week-calendar";
import { ShortcutPills } from "@/components/portal/dashboard/shortcut-pills";
import { WidgetGrid } from "@/components/portal/widgets/widget-grid";
import { DEFAULT_DASHBOARD_LAYOUT } from "@/lib/portal/widgets/registry";
import type { DashboardV3Props } from "../dashboard-types";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

/**
 * Athletic Grid — widget-basert dashboard med drag-drop.
 *
 * View 1 (opt1): Kraftfull oversikt med KPI-kort og modulære widgets.
 */
export function AthleticGridView({
  userName,
  tier,
  memberSince,
  nextBooking,
  weekRings,
  stats,
  handicap,
  playerLevel,
}: DashboardV3Props) {
  return (
    <motion.div
      className="mx-auto w-full max-w-[1400px] space-y-6 pb-12 pt-2"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Rad 1: Velkomst + Neste booking + Profil */}
      <motion.div variants={item} className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <WelcomeSection userName={userName} tier={tier} memberSince={memberSince} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <NextBookingCard booking={nextBooking} />
            <PlayerProfileCard
              userName={userName}
              tier={tier}
              memberSince={memberSince}
              handicap={handicap.current}
              roundsCount={stats.roundsCount}
            />
          </div>
        </div>
        <div className="lg:col-span-4">
          <WeekCalendar days={weekRings.days} />
          <div className="mt-5">
            <ShortcutPills />
          </div>
        </div>
      </motion.div>

      {/* Rad 2: Widget Grid */}
      <motion.div variants={item}>
        <WidgetGrid
          initialWidgets={DEFAULT_DASHBOARD_LAYOUT}
          onLayoutChange={(widgets) => {
            // TODO: Persist layout til UserPreferences
            console.log("[AthleticGrid] Layout endret:", widgets);
          }}
        />
      </motion.div>
    </motion.div>
  );
}
