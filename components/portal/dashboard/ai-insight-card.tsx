"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";

interface WeeklyInsight {
  summary: string;
  strengths: string[];
  improvements: string[];
  focusTip: string;
  generatedAt: string | Date;
}

interface AiInsightCardProps {
  insight: WeeklyInsight | null;
}

export function AiInsightCard({ insight }: AiInsightCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const updateIsNew = () => {
      if (!insight) {
        setIsNew(false);
        return;
      }

      const generatedAt = new Date(insight.generatedAt);
      setIsNew(Date.now() - generatedAt.getTime() < 24 * 60 * 60 * 1000);
    };

    const timeoutId = window.setTimeout(updateIsNew, 0);
    return () => window.clearTimeout(timeoutId);
  }, [insight]);

  if (!insight) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-grey-100)] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[var(--color-grey-400)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-grey-900)]">
              AI-innsikt
            </h3>
            <p className="text-xs text-[var(--color-grey-500)]">
              Ingen innsikt enna
            </p>
          </div>
        </div>
        <p className="text-sm text-[var(--color-grey-500)]">
          Logg treningsoekter og runder for a fa personlige AI-anbefalinger hver mandag.
        </p>
      </div>
    );
  }

  const generatedAt = new Date(insight.generatedAt);

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl border border-[var(--color-grey-200)] overflow-hidden"
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-ai-light)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[var(--color-ai)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[var(--color-grey-900)]">
                  Ukentlig innsikt
                </h3>
                {isNew && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-[var(--color-ai-light)] text-[var(--color-ai)] rounded-full">
                    Ny
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--color-grey-500)]">
                Oppdatert{" "}
                {formatDistanceToNow(generatedAt, {
                  addSuffix: true,
                  locale: nb,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-[var(--color-grey-700)] leading-relaxed">
          {insight.summary}
        </p>

        {/* Focus tip */}
        <div className="flex items-start gap-3 mt-4 p-3 rounded-xl bg-[#ECF0EF] border border-[#D5DFDB]">
          <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-[var(--color-grey-700)] uppercase tracking-wide mb-1">
              Ukens fokus
            </p>
            <p className="text-sm text-[var(--color-grey-600)]">
              {insight.focusTip}
            </p>
          </div>
        </div>

        {/* Expand button */}
        {(insight.strengths.length > 0 || insight.improvements.length > 0) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 mt-4 text-xs font-medium text-[var(--color-grey-500)] hover:text-[var(--color-grey-700)] transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Skjul detaljer
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Se styrker og forbedringspunkter
              </>
            )}
          </button>
        )}
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-[var(--color-grey-100)]"
          >
            <div className="p-6 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Strengths */}
              {insight.strengths.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[var(--color-success)] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Styrker
                  </p>
                  <ul className="space-y-1.5">
                    {insight.strengths.map((strength, i) => (
                      <li
                        key={i}
                        className="text-sm text-[var(--color-grey-600)] flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] mt-1.5 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {insight.improvements.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Forbedringspunkter
                  </p>
                  <ul className="space-y-1.5">
                    {insight.improvements.map((improvement, i) => (
                      <li
                        key={i}
                        className="text-sm text-[var(--color-grey-600)] flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
