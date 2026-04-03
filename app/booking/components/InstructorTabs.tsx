"use client";

import { cn } from "@/lib/portal/utils/cn";

interface Instructor {
  id: string;
  name: string;
}

interface Props {
  instructors: Instructor[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function InstructorTabs({ instructors, selectedId, onSelect }: Props) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      {/* "Alle" first for better UX */}
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-[background-color,color]",
          selectedId === null
            ? "bg-black text-white"
            : "bg-grey-100 text-grey-600 hover:bg-grey-200"
        )}
      >
        Alle
      </button>
      {instructors.map((instructor) => (
        <button
          key={instructor.id}
          onClick={() => onSelect(instructor.id)}
          className={cn(
            "flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-[background-color,color]",
            selectedId === instructor.id
              ? "bg-black text-white"
              : "bg-grey-100 text-grey-600 hover:bg-grey-200"
          )}
        >
          {instructor.name}
        </button>
      ))}
    </div>
  );
}
