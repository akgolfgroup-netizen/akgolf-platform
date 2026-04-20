"use client";

interface DateChipProps {
  dayName: string;
  dayNumber: number;
  month: string;
  isSelected: boolean;
  onClick: () => void;
}

export function DateChip({ dayName, dayNumber, month, isSelected, onClick }: DateChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-shrink-0 min-w-[72px] px-4 py-2.5 rounded-xl text-center border-2 transition-all snap-start ${
        isSelected
          ? "bg-primary border-primary"
          : "bg-surface border-transparent hover:border-primary"
      }`}
    >
      <div className={`text-[10px] font-semibold uppercase ${isSelected ? "text-surface/60" : "text-muted"}`}>
        {dayName}
      </div>
      <div className={`text-lg font-bold mt-0.5 ${isSelected ? "text-surface" : "text-on-surface"}`}>
        {dayNumber}
      </div>
      <div className={`text-[10px] ${isSelected ? "text-secondary-fixed" : "text-muted"}`}>
        {month}
      </div>
    </button>
  );
}
