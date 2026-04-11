"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { EASE_ENTRANCE } from "@/lib/design-tokens";

interface WeeklyInsight {
  summary: string;
  strengths: string[];
  improvements: string[];
  focusTip: string;
  generatedAt: string | Date;
}

interface AiInsightCardProps {
  insight: WeeklyInsight | null;
  delay?: number;
}

export function AiInsightCard({ insight, delay = 0 }: AiInsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE_ENTRANCE }}
      className="flex h-full flex-col rounded-xl bg-ai-light p-5 shadow-card"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ai/10">
          <Sparkles className="h-5 w-5 text-ai" strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ai-text">AI-innsikt</h3>
          <p className="text-[11px] uppercase tracking-wider text-ai-text/60">
            Basert på treningshistorikk
          </p>
        </div>
      </div>

      {/* Content */}
      {insight ? (
        <>
          <p className="mt-4 text-sm italic leading-relaxed text-ai-text/80">
            &ldquo;{insight.focusTip || insight.summary}&rdquo;
          </p>

          {/* Improvement tags */}
          {insight.improvements.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {insight.improvements.slice(0, 3).map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-ai/10 px-2.5 py-1 text-[11px] font-medium text-ai-text"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-ai-text/70">
          Når du har logget økter og runder, vil AI Coach gi deg personlige
          innsikter og anbefalinger.
        </p>
      )}

      {/* Link */}
      <Link
        href="/portal/ai-coach"
        className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-semibold text-ai-text transition-all hover:gap-2"
      >
        {insight ? "Se full analyse" : "Start en samtale"}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </motion.div>
  );
}
