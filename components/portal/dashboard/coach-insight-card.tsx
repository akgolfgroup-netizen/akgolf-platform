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
      <PremiumCard className="flex h-full flex-col" radius="large">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F8F7]">
            <MessageSquare className="h-4 w-4 text-[#0A1F18]" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#0A1F18]">Fra din coach</h3>
            <p className="text-[10px] text-[#7A8C85]">
              {format(new Date(coachInsight.date), "d. MMMM yyyy", { locale: nb })}
            </p>
          </div>
        </div>

        {coachInsight.primaryFocus && (
          <div className="mt-4 rounded-xl border border-[#D5DFDB] bg-[#F5F8F7] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7A8C85]">
              Primært fokus
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-[#0A1F18]">
              <Target className="h-3.5 w-3.5 text-[#1A4D36]" />
              {coachInsight.primaryFocus}
            </p>
          </div>
        )}

        {coachInsight.summary && (
          <p className="mt-4 text-sm leading-relaxed text-[#324D45]">
            {coachInsight.summary}
          </p>
        )}

        {focusAreas.length > 0 && (
          <div className="mt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7A8C85]">
              Fokusområder
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {focusAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-[#D5DFDB] bg-[#F5F8F7] px-3 py-1 text-[11px] font-medium text-[#0A1F18]"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link
          href="/portal/coaching-historikk"
          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[12px] font-semibold text-[#0A1F18] transition-all hover:gap-2"
        >
          Se full coaching-historikk
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </PremiumCard>
    );
  }

  if (aiInsight?.focusTip || aiInsight?.summary) {
    return (
      <PremiumCard className="flex h-full flex-col" radius="large">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#AF52DE]/20 bg-[#FAF5FF]">
            <Sparkles className="h-4 w-4 text-[#AF52DE]" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#0A1F18]">AI-innsikt</h3>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7A8C85]">
              Basert på treningshistorikk
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm italic leading-relaxed text-[#324D45]">
          {aiInsight.focusTip || aiInsight.summary}
        </p>

        <Link
          href="/portal/ai-coach"
          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[12px] font-semibold text-[#AF52DE] transition-all hover:gap-2"
        >
          Snakk med AI Coach
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard className="flex h-full flex-col border-dashed border-[#D5DFDB]" radius="large">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#AF52DE]/20 bg-[#FAF5FF]">
          <Sparkles className="h-4 w-4 text-[#AF52DE]" strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#0A1F18]">Bli kjent med AI Coach</h3>
          <p className="text-[10px] text-[#7A8C85]">Din personlige assistent</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-[#324D45]">
        Når du har logget økter og runder, vil AI Coach gi deg personlige innsikter og anbefalinger.
      </p>
      <Link
        href="/portal/ai-coach"
        className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[12px] font-semibold text-[#AF52DE] transition-all hover:gap-2"
      >
        Start en samtale
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </PremiumCard>
  );
}
