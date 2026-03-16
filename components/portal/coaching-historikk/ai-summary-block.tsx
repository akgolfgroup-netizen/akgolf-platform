"use client";

import { motion } from "framer-motion";
import { Zap, Target, CheckSquare } from "lucide-react";

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
      className="bg-[var(--color-bg)] border border-[var(--color-gold)]/20 rounded-xl p-5 space-y-5"
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-[var(--color-gold)]" />
        </div>
        <span className="text-xs font-semibold text-[var(--color-gold)] uppercase tracking-wider">
          Oppsummering
        </span>
        {generatedAt && (
          <span className="text-xs text-[var(--color-gold-muted)]/50 ml-auto">
            {new Date(generatedAt).toLocaleDateString("nb-NO")}
          </span>
        )}
      </div>

      {/* Key Points */}
      {keyPoints.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-[var(--color-snow)]/60 uppercase tracking-wider mb-2">
            Nøkkelpunkter
          </h4>
          <motion.ul variants={container} className="space-y-1.5">
            {keyPoints.map((point, i) => (
              <motion.li key={i} variants={item} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] mt-1.5 flex-shrink-0" />
                <span className="text-sm text-[var(--color-snow)]">{point}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      )}

      {/* Focus Areas */}
      {focusAreas.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-[var(--color-snow)]/60 uppercase tracking-wider mb-2">
            Fokusområder
          </h4>
          <motion.div variants={container} className="flex flex-wrap gap-2">
            {focusAreas.map((area, i) => (
              <motion.span
                key={i}
                variants={item}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-[var(--color-blue)]/10 border border-[var(--color-blue)]/20 text-[var(--color-blue)]"
              >
                <Target className="w-3 h-3" />
                {area}
              </motion.span>
            ))}
          </motion.div>
        </div>
      )}

      {/* Action Items */}
      {actionItems.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-[var(--color-snow)]/60 uppercase tracking-wider mb-2">
            Treningsoppgaver
          </h4>
          <motion.ul variants={container} className="space-y-1.5">
            {actionItems.map((action, i) => (
              <motion.li key={i} variants={item} className="flex items-start gap-2">
                <CheckSquare className="w-4 h-4 text-[var(--color-green)] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[var(--color-snow)]">{action}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      )}
    </motion.div>
  );
}
