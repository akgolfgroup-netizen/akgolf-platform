"use client";


import { Icon } from "@/components/ui/icon";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

import Link from "next/link";
import { colors } from "@/lib/design-tokens";

interface CoachInsight {
  focusAreas: string[] | null;
  primaryFocus: string | null;
  summary: string | null;
  date: Date | string;
}

interface CoachInsightCardProps {
  coachInsight: CoachInsight | null;
}

export function CoachInsightCard({ coachInsight }: CoachInsightCardProps) {
  const hasCoach = coachInsight && (coachInsight.summary || coachInsight.primaryFocus);

  const formatDate = (d: Date | string) => {
    const date = typeof d === "string" ? new Date(d) : d;
    return format(date, "d. MMMM yyyy", { locale: nb });
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-grey-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-grey-200 hover:shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: `${colors.primary.accent}20` }}
        >
          <Icon name="chat" className="h-4 w-4" style={{ color: colors.primary.dark }} />
        </div>
        <h3 className="text-sm font-semibold text-black">Fra treneren din</h3>
      </div>

      {hasCoach ? (
        <div className="flex-1">
          <p className="line-clamp-4 text-sm leading-relaxed text-grey-500">
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
            Coaching-notater vises her etter din første økt med treneren.
          </p>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-grey-100">
        <Link
          href="/portal/coaching-historikk"
          className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
          style={{ color: colors.primary.main }}
        >
          Se historikk
          <Icon name="arrow_forward" className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
