"use client";

import { Calendar, Club, FileText } from "lucide-react";

interface UploadMetadataFieldsProps {
  date: string;
  onDateChange: (value: string) => void;
  club: string;
  onClubChange: (value: string) => void;
  notes: string;
  onNotesChange: (value: string) => void;
  clubs: string[];
}

const DEFAULT_CLUBS = [
  "Driver",
  "3 Wood",
  "5 Wood",
  "3 Iron",
  "4 Iron",
  "5 Iron",
  "6 Iron",
  "7 Iron",
  "8 Iron",
  "9 Iron",
  "PW",
  "GW",
  "SW",
  "LW",
];

export function UploadMetadataFields({
  date,
  onDateChange,
  club,
  onClubChange,
  notes,
  onNotesChange,
  clubs,
}: UploadMetadataFieldsProps) {
  const allClubs = clubs.length > 0 ? clubs : DEFAULT_CLUBS;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-ink-muted flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          Dato
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-line bg-card text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-ink-muted flex items-center gap-1.5">
          <Club className="w-3.5 h-3.5" />
          Kolle
        </label>
        <select
          value={club}
          onChange={(e) => onClubChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-line bg-card text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none"
        >
          <option value="">Auto-detekter fra data</option>
          {allClubs.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2 space-y-1.5">
        <label className="text-xs font-medium text-ink-muted flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          Notater
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={3}
          placeholder="Valgfrie notater om økten..."
          className="w-full px-3 py-2 rounded-lg border border-line bg-card text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
        />
      </div>
    </div>
  );
}
