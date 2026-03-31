"use client";

interface PeerSummaryProps {
  skillLevelLabel: string;
  peerCount: number;
  aboveAverageCount: number;
  totalCategories: number;
}

export function PeerSummary({ skillLevelLabel, peerCount, aboveAverageCount, totalCategories }: PeerSummaryProps) {
  return (
    <div
      className="rounded-xl p-4 border border-[var(--color-grey-900)]/20"
      style={{ background: "var(--color-grey-200)" }}
    >
      <p className="text-sm text-[var(--color-grey-900)]">
        Du er over snittet i{" "}
        <span className="font-bold text-[var(--color-grey-900)]">
          {aboveAverageCount}/{totalCategories}
        </span>{" "}
        SG-kategorier sammenlignet med{" "}
        <span className="font-bold text-[var(--color-grey-900)]">{peerCount}</span>{" "}
        spillere på nivå {skillLevelLabel}.
      </p>
    </div>
  );
}
