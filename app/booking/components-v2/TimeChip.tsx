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
          ? "bg-transparent text-[#A5B2AD] line-through cursor-not-allowed border-transparent"
          : isSelected
          ? "bg-[#D1F843] text-[#005840] border-[#D1F843]"
          : "bg-[#ECF0EF] text-[#0A1F18] border-transparent hover:border-[#005840]"
      }`}
    >
      {time}
    </button>
  );
}
