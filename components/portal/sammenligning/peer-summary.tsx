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
      className="rounded-xl p-4 border border-[var(--color-gold)]/20"
      style={{ background: "rgba(184,151,92,0.05)" }}
    >
      <p className="text-sm text-[var(--color-snow)]">
        Du er over snittet i{" "}
        <span className="font-bold text-[var(--color-gold)]">
          {aboveAverageCount}/{totalCategories}
        </span>{" "}
        SG-kategorier sammenlignet med{" "}
        <span className="font-bold text-[var(--color-gold)]">{peerCount}</span>{" "}
        spillere på nivå {skillLevelLabel}.
      </p>
    </div>
  );
}
