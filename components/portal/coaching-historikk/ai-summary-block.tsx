"use client";


import { Icon } from "@/components/ui/icon";
import { motion } from "framer-motion";

import { MonoLabel } from "@/components/portal/patterns";

interface AISummaryBlockProps {
  keyPoints: string[];
  focusAreas: string[];
  actionItems: string[];
  generatedAt?: Date | null;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export function AISummaryBlock({
  keyPoints,
  focusAreas,
  actionItems,
  generatedAt,
}: AISummaryBlockProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="rounded-xl border border-ai/15 bg-ai-light p-5 space-y-5"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ai/20">
          <Icon name="bolt" className="h-3.5 w-3.5 text-ai-text" />
        </div>
        <MonoLabel size="xs" uppercase className="text-ai-text">
          Oppsummering
        </MonoLabel>
        {generatedAt && (
          <MonoLabel size="xs" className="ml-auto text-ai-text/60">
            {new Date(generatedAt).toLocaleDateString("nb-NO")}
          </MonoLabel>
        )}
      </div>

      {/* Key Points */}
      {keyPoints.length > 0 && (
        <div>
          <MonoLabel size="xs" uppercase className="mb-2 block text-ai-text/70">
            Nøkkelpunkter
          </MonoLabel>
          <motion.ul variants={container} className="space-y-1.5">
            {keyPoints.map((point, i) => (
              <motion.li key={i} variants={item} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ai" />
                <span className="text-sm text-on-surface">{point}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      )}

      {/* Focus Areas */}
      {focusAreas.length > 0 && (
        <div>
          <MonoLabel size="xs" uppercase className="mb-2 block text-ai-text/70">
            Fokusområder
          </MonoLabel>
          <motion.div variants={container} className="flex flex-wrap gap-2">
            {focusAreas.map((area, i) => (
              <motion.span
                key={i}
                variants={item}
                className="flex items-center gap-1.5 rounded-full border border-ai/25 bg-surface-container-lowest px-3 py-1.5 text-xs text-ai-text"
              >
                <Icon name="my_location" className="h-3 w-3" />
                {area}
              </motion.span>
            ))}
          </motion.div>
        </div>
      )}

      {/* Action Items */}
      {actionItems.length > 0 && (
        <div>
          <MonoLabel size="xs" uppercase className="mb-2 block text-ai-text/70">
            Treningsoppgaver
          </MonoLabel>
          <motion.ul variants={container} className="space-y-1.5">
            {actionItems.map((action, i) => (
              <motion.li key={i} variants={item} className="flex items-start gap-2">
                <Icon name="check"Square className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-on-surface">{action}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      )}
    </motion.div>
  );
}
