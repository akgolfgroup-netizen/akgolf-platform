"use client";

import { motion } from "framer-motion";
import { Trophy, Target, Dumbbell, Zap } from "lucide-react";
import type { GolfProfileSummary } from "@/app/portal/(dashboard)/statistikk/actions";

interface GolfProfileHeroProps {
  profile: GolfProfileSummary;
}

export function GolfProfileHero({ profile }: GolfProfileHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl bg-black p-6 sm:p-8"
    >
      {/* Decorative gradient blob */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-cta/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/30 blur-3xl" />

      <div className="relative z-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-grey-300">
          Din golfprofil
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          Siste 30 dager
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-grey-300">
              <Trophy className="h-4 w-4" />
              <span className="text-[11px] font-medium uppercase tracking-wider">HCP</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-white tabular-nums">
              {profile.handicap != null ? profile.handicap.toFixed(1) : "–"}
            </p>
          </div>

          <div className="rounded-xl bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-grey-300">
              <Target className="h-4 w-4" />
              <span className="text-[11px] font-medium uppercase tracking-wider">Runder</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-white tabular-nums">
              {profile.roundCount30d}
            </p>
          </div>

          <div className="rounded-xl bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-grey-300">
              <Dumbbell className="h-4 w-4" />
              <span className="text-[11px] font-medium uppercase tracking-wider">Trening</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-white tabular-nums">
              {profile.trainingSessions30d}
            </p>
          </div>

          <div className="rounded-xl bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-grey-300">
              <Zap className="h-4 w-4" />
              <span className="text-[11px] font-medium uppercase tracking-wider">Beste carry</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-white tabular-nums">
              {profile.trackManBestCarry ? `${Math.round(profile.trackManBestCarry)}m` : "–"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
