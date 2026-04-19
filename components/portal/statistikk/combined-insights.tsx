"use client";


import { Icon } from "@/components/ui/icon";
import { motion } from "framer-motion";

import type { GolfProfileSummary } from "@/app/portal/(dashboard)/statistikk/actions";

interface CombinedInsightsProps {
  profile: GolfProfileSummary;
}

export function CombinedInsights({ profile }: CombinedInsightsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-grey-200/50 bg-white p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/10">
          <Icon name="lightbulb" className="h-4 w-4 text-black" />
        </div>
        <h3 className="text-sm font-semibold text-black">Dine innsikter</h3>
      </div>

      <ul className="space-y-3">
        {profile.combinedInsights.map((insight, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + idx * 0.08 }}
            className="flex items-start gap-3"
          >
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-grey-100">
              {idx === 0 ? (
                <Icon name="trending_up" className="h-3 w-3 text-success" />
              ) : idx === 1 ? (
                <Icon name="trending_down" className="h-3 w-3 text-info" />
              ) : (
                <Icon name="remove" className="h-3 w-3 text-grey-400" />
              )}
            </span>
            <p className="text-[13px] leading-relaxed text-text">{insight}</p>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
