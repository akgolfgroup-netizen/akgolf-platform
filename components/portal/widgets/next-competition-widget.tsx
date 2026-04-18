"use client";

import { Calendar, MapPin, Clock } from "lucide-react";

/**
 * NextCompetitionWidget — nedtelling til neste konkurranse.
 *
 * Data-kilde: Tournament + TournamentPrep
 * Brukes på: P1 (Dashboard), P3 (Kalender), N02 (Konkurranseforberedelse)
 */
export function NextCompetitionWidget() {
  // TODO: Koble til reelle data via server action
  const daysLeft = 14;
  const tournament = "Olyo Juniortour — Ringerike";
  const date = "12. mai 2026";
  const location = "Ringerike GK";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-soft">
          <span className="text-lg font-bold text-primary">{daysLeft}</span>
        </div>
        <div>
          <p className="text-xs text-muted">dager igjen</p>
          <p className="text-sm font-semibold text-text truncate max-w-[160px]">
            {tournament}
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <Calendar className="w-3.5 h-3.5" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <MapPin className="w-3.5 h-3.5" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <Clock className="w-3.5 h-3.5" />
          <span>Forberedelse 67% fullført</span>
        </div>
      </div>
    </div>
  );
}
