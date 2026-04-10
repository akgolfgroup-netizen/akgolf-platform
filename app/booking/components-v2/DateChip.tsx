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
          ? "bg-[#005840] border-[#005840]"
          : "bg-[#ECF0EF] border-transparent hover:border-[#005840]"
      }`}
    >
      <div className={`text-[10px] font-semibold uppercase ${isSelected ? "text-white/60" : "text-[#A5B2AD]"}`}>
        {dayName}
      </div>
      <div className={`text-lg font-bold mt-0.5 ${isSelected ? "text-white" : "text-[#0A1F18]"}`}>
        {dayNumber}
      </div>
      <div className={`text-[10px] ${isSelected ? "text-[#D1F843]" : "text-[#A5B2AD]"}`}>
        {month}
      </div>
    </button>
  );
}
