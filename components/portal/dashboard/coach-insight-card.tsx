import Link from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { ArrowRight, MessageSquare, Sparkles, Target } from "lucide-react";

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
  // Coach-innsikt tar prioritet
  if (coachInsight && (coachInsight.primaryFocus || coachInsight.summary)) {
    const focusAreas = (coachInsight.focusAreas ?? []).slice(0, 3);
    return (
      <div className="flex h-full flex-col rounded-2xl border border-[var(--color-grey-200)] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
              <MessageSquare
                className="h-5 w-5 text-[var(--color-primary)]"
                strokeWidth={1.75}
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-grey-900)]">
                Fra din coach
              </h3>
              <p className="text-[11px] text-[var(--color-muted)]">
                {format(new Date(coachInsight.date), "d. MMMM yyyy", { locale: nb })}
              </p>
            </div>
          </div>
        </div>

        {coachInsight.primaryFocus && (
          <div className="mt-4 rounded-xl bg-[var(--color-surface)] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Primært fokus
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-[var(--color-grey-900)]">
              <Target className="h-3.5 w-3.5 text-[var(--color-primary)]" />
              {coachInsight.primaryFocus}
            </p>
          </div>
        )}

        {coachInsight.summary && (
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-text)]">
            {coachInsight.summary}
          </p>
        )}

        {focusAreas.length > 0 && (
          <div className="mt-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Fokusområder
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {focusAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-[var(--color-grey-200)] bg-[var(--color-surface)] px-3 py-1 text-[11px] font-medium text-[var(--color-text)]"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link
          href="/portal/coaching-historikk"
          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[12px] font-semibold text-[var(--color-primary)] hover:gap-2 transition-all"
        >
          Se full coaching-historikk
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  // AI-innsikt fallback
  if (aiInsight?.focusTip || aiInsight?.summary) {
    return (
      <div className="flex h-full flex-col rounded-2xl border border-[var(--color-grey-200)] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-ai)]/10">
            <Sparkles className="h-5 w-5 text-[var(--color-ai)]" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-grey-900)]">
              AI-innsikt
            </h3>
            <p className="text-[11px] text-[var(--color-muted)] uppercase tracking-wider">
              Basert på treningshistorikk
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-[var(--color-text)]">
          {aiInsight.focusTip || aiInsight.summary}
        </p>
        <Link
          href="/portal/ai-coach"
          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[12px] font-semibold text-[var(--color-ai)] hover:gap-2 transition-all"
        >
          Snakk med AI Coach
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  // Empty state
  return (
    <div className="flex h-full flex-col rounded-2xl border border-dashed border-[var(--color-grey-200)] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-ai)]/10">
          <Sparkles className="h-5 w-5 text-[var(--color-ai)]" strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-grey-900)]">
            Bli kjent med AI Coach
          </h3>
          <p className="text-[11px] text-[var(--color-muted)]">
            Din personlige assistent
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-[var(--color-text)]">
        Når du har logget økter og runder, vil AI Coach gi deg personlige innsikter og anbefalinger.
      </p>
      <Link
        href="/portal/ai-coach"
        className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[12px] font-semibold text-[var(--color-ai)] hover:gap-2 transition-all"
      >
        Start en samtale
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
