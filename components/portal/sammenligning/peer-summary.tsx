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
    <div className="flex items-start gap-4 rounded-[24px] p-5 bg-gradient-to-br from-[var(--color-primary)]/[0.04] to-white border border-[var(--color-primary)]/15">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
        <Icon name="person"s className="h-5 w-5 text-[var(--color-primary)]" />
      </div>
      <p className="text-sm leading-relaxed text-[var(--color-text)]">
        Du er over snittet i{" "}
        <span className="font-bold text-[var(--color-primary)]">
          {aboveAverageCount}/{totalCategories}
        </span>{" "}
        SG-kategorier sammenlignet med{" "}
        <span className="font-bold text-[var(--color-primary)]">{peerCount}</span>{" "}
        spillere på nivå {skillLevelLabel}.
      </p>
    </div>
  );
}
