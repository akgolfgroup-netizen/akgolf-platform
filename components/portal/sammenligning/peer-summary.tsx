"use client";

import { Icon } from "@/components/ui/icon";

interface PeerSummaryProps {
  skillLevelLabel: string;
  peerCount: number;
  aboveAverageCount: number;
  totalCategories: number;
}

export function PeerSummary({
  skillLevelLabel,
  peerCount,
  aboveAverageCount,
  totalCategories,
}: PeerSummaryProps) {
  return (
    <div className="flex items-start gap-4 rounded-3xl p-5 bg-gradient-to-br from-primary/5 to-white border border-primary/15">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <Icon name="groups" className="h-5 w-5 text-primary" />
      </div>
      <p className="text-sm leading-relaxed text-on-surface">
        Du er over snittet i{" "}
        <span className="font-bold text-primary">
          {aboveAverageCount}/{totalCategories}
        </span>{" "}
        SG-kategorier sammenlignet med{" "}
        <span className="font-bold text-primary">{peerCount}</span>{" "}
        spillere på nivå {skillLevelLabel}.
      </p>
    </div>
  );
}
