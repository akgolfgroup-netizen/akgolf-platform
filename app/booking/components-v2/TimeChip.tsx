"use client";

interface TimeChipProps {
  time: string;
  isSelected: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function TimeChip({ time, isSelected, disabled, onClick }: TimeChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-[10px] text-sm font-semibold border-2 transition-all tabular-nums ${
        disabled
          ? "bg-transparent text-muted line-through cursor-not-allowed border-transparent"
          : isSelected
          ? "bg-accent-cta text-primary border-accent-cta"
          : "bg-surface text-black border-transparent hover:border-primary"
      }`}
    >
      {time}
    </button>
  );
}
