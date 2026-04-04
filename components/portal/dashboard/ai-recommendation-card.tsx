"use client";

import { Sparkles } from "lucide-react";

interface AIRecommendationCardProps {
  title?: string;
  recommendation?: string | null;
}

export function AIRecommendationCard({
  title = "AI-anbefaling",
  recommendation,
}: AIRecommendationCardProps) {
  return (
    <div className="bg-[var(--color-ai-light)] border border-[var(--color-ai)]/10 rounded-[14px] p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-[var(--color-ai)] flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-xs font-semibold text-[var(--color-ai-text)]">{title}</span>
      </div>
      <p className="text-sm text-[#1D1D1F] leading-relaxed">
        {recommendation || "Logg din forste okt eller runde for a fa personlige anbefalinger basert pa dine data."}
      </p>
    </div>
  );
}
