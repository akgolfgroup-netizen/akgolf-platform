"use client";

import Link from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { ArrowRight, MessageSquare, Sparkles, Target } from "lucide-react";
import { PremiumCard } from "./premium-card";

interface CoachInsight {
  focusAreas: string[] | null;
  primaryFocus: string | null;
  summary: string | null;
  date: Date | string;
}

interface AiInsight {
  summary: string;
  strengths: string[];
  improvements: string[];
  focusTip: string;
  generatedAt: Date | string;
}

interface CoachInsightCardProps {
  coachInsight: CoachInsight | null;
  aiInsight: AiInsight | null;
}

export function CoachInsightCard({
  coachInsight,
  aiInsight,
}: CoachInsightCardProps) {
  if (coachInsight && (coachInsight.primaryFocus || coachInsight.summary)) {
    const focusAreas = (coachInsight.focusAreas ?? []).slice(0, 3);
    return (
      <PremiumCard className="flex h-full flex-col" glow="green">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <MessageSquare className="h-4 w-4 text-primary" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-portal-text)]">Fra din coach</h3>
            <p className="text-[10px] text-[var(--color-portal-muted)]">
              {format(new Date(coachInsight.date), "d. MMMM yyyy", { locale: nb })}
            </p>
          </div>
        </div>

        {coachInsight.primaryFocus && (
          <div className="mt-4 rounded-[10px] border border-black/[0.04] bg-black/[0.02] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-portal-muted)]">
              Primaert fokus
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-[var(--color-portal-text)]">
              <Target className="h-3.5 w-3.5 text-primary" />
              {coachInsight.primaryFocus}
            </p>
          </div>
        )}

        {coachInsight.summary && (
          <p className="mt-4 text-sm leading-relaxed text-text">
            {coachInsight.summary}
          </p>
        )}

        {focusAreas.length > 0 && (
          <div className="mt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-portal-muted)]">
              Fokusomraader
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {focusAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-black/[0.06] bg-black/[0.02] px-3 py-1 text-[11px] font-medium text-text"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link
          href="/portal/coaching-historikk"
          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[12px] font-semibold text-primary transition-all hover:gap-2"
        >
          Se full coaching-historikk
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </PremiumCard>
    );
  }

  if (aiInsight?.focusTip || aiInsight?.summary) {
    return (
      <PremiumCard className="flex h-full flex-col" glow="ai">
        {/* AI glow line */}
        <div className="absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-ai to-transparent" />

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-ai/15 bg-ai/[0.08]">
            <Sparkles className="h-4 w-4 text-ai" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-portal-text)]">AI-innsikt</h3>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-portal-muted)]">
              Basert paa treningshistorikk
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm italic leading-relaxed text-text">
          {aiInsight.focusTip || aiInsight.summary}
        </p>

        <Link
          href="/portal/ai-coach"
          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[12px] font-semibold text-ai transition-all hover:gap-2"
        >
          Snakk med AI Coach
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard className="flex h-full flex-col border-dashed">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-ai/15 bg-ai/[0.08]">
          <Sparkles className="h-4 w-4 text-ai" strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-portal-text)]">Bli kjent med AI Coach</h3>
          <p className="text-[10px] text-[var(--color-portal-muted)]">Din personlige assistent</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-text">
        Naar du har logget okter og runder, vil AI Coach gi deg personlige innsikter og anbefalinger.
      </p>
      <Link
        href="/portal/ai-coach"
        className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[12px] font-semibold text-ai transition-all hover:gap-2"
      >
        Start en samtale
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </PremiumCard>
  );
}
