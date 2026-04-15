"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { MessageSquare, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

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
  const hasCoach =
    coachInsight && (coachInsight.summary || coachInsight.primaryFocus);
  const hasAi = aiInsight && aiInsight.summary;

  const formatDate = (d: Date | string) => {
    const date = typeof d === "string" ? new Date(d) : d;
    return format(date, "d. MMMM yyyy", { locale: nb });
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-grey-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-grey-400" />
        <h3 className="text-sm font-semibold text-black">Fra treneren din</h3>
      </div>

      {hasCoach ? (
        <div className="flex-1">
          <p className="line-clamp-3 text-sm leading-relaxed text-grey-500">
            {coachInsight.summary || coachInsight.primaryFocus}
          </p>
          {coachInsight.date && (
            <p className="mt-3 text-xs text-grey-400">
              {formatDate(coachInsight.date)}
            </p>
          )}
        </div>
      ) : (
        <div className="flex-1">
          <p className="text-sm text-grey-400">
            Coaching-notater vises her etter din forste okt med treneren.
          </p>
        </div>
      )}

      <div className="mt-4 border-t border-grey-100 pt-4">
        {hasAi ? (
          <div className="flex flex-col gap-2">
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent-cta px-2 py-0.5 text-[10px] font-bold text-accent-cta-text">
              <Sparkles className="h-3 w-3" />
              AI-innsikt
            </div>
            <p className="line-clamp-2 text-xs leading-relaxed text-grey-500">
              {aiInsight.summary}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-grey-400">
              Ingen innsikt enna. Logg trening for a fa personlige
              anbefalinger.
            </p>
            <Link
              href="/portal/dagbok"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Logg trening
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
