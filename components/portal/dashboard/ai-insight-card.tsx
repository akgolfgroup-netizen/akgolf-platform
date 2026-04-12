"use client";

import { Sparkles } from "lucide-react";
import { PremiumCard } from "./premium-card";

interface AiInsightCardProps {
  insight: {
    summary: string;
    focusTip: string;
  } | null;
  delay?: number;
}

const FALLBACK_TEXT =
  "Jern-spillet trenger fokus. Approach-skudd lander i snitt 12m fra hullet. Anbefaler 15 min dedikert trening med avstandskontroll 100-140m for neste okt.";

export function AiInsightCard({ insight, delay = 0 }: AiInsightCardProps) {
  const text = insight?.focusTip || insight?.summary || FALLBACK_TEXT;

  return (
    <PremiumCard delay={delay} glow="ai" className="relative">
      {/* Purple glow line across top */}
      <div className="absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-ai to-transparent" />

      {/* Header */}
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-ai/15 bg-ai/[0.08]">
          <Sparkles className="h-[14px] w-[14px] text-ai" strokeWidth={2} />
        </div>
        <span className="text-sm font-semibold tracking-[-0.01em] text-[var(--color-portal-text)]">
          AI-innsikt
        </span>
        <span className="ml-auto rounded-md border border-ai/15 bg-ai/[0.08] px-2.5 py-1 text-[11px] font-medium text-ai">
          Ny
        </span>
      </div>

      {/* Content — first sentence bold, rest normal */}
      <p className="text-[13px] leading-[1.65] text-[var(--color-portal-secondary)]">
        <HighlightedText text={text} />
      </p>
    </PremiumCard>
  );
}

function HighlightedText({ text }: { text: string }) {
  const dotIndex = text.indexOf(".");
  if (dotIndex === -1) return <>{text}</>;

  const bold = text.slice(0, dotIndex + 1);
  const rest = text.slice(dotIndex + 1);

  return (
    <>
      <strong className="font-medium text-[var(--color-portal-text)]">{bold}</strong>
      {rest}
    </>
  );
}
