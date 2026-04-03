"use client";

import { ChevronDown, MapPin } from "lucide-react";

export interface Facility {
  id: string;
  name: string;
  slug: string;
  Location?: {
    id: string;
    name: string;
  };
}

interface Props {
  facilities: Facility[];
  selectedFacilityId: string;
  onChange: (facilityId: string) => void;
  showAll?: boolean;
}

export function FacilitySelector({
  facilities,
  selectedFacilityId,
  onChange,
  showAll = true,
}: Props) {
  return (
    <div className="relative">
      <select
        value={selectedFacilityId}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full text-sm font-medium rounded-xl px-4 py-2.5 pr-10 text-[var(--color-grey-700)] bg-white border border-[var(--color-grey-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)] focus:border-transparent transition-[border-color,box-shadow] duration-200 cursor-pointer"
      >
        {showAll && <option value="">Alle fasiliteter</option>}
        {facilities.map((facility) => (
          <option key={facility.id} value={facility.id}>
            {facility.name}
            {facility.Location && ` (${facility.Location.name})`}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-grey-400)]">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
}

export function FacilityChip({
  facility,
  isSelected,
  onClick,
}: {
  facility: Facility;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-[background-color,color] duration-200 ${
        isSelected
          ? "bg-[var(--color-grey-900)] text-white"
          : "bg-[var(--color-grey-100)] text-[var(--color-grey-600)] hover:bg-[var(--color-grey-200)]"
      }`}
    >
      <MapPin className="w-3 h-3" />
      {facility.name}
    </button>
  );
}
