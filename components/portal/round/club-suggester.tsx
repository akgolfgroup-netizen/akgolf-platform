"use client";

import { useEffect, useState, useTransition } from "react";
import { Crosshair } from "lucide-react";
import { suggestClubFromDistance } from "@/lib/portal/round/club-suggester";

interface ClubSuggesterProps {
  distanceMeters: number;
  userId: string;
  onSelectClub?: (club: string) => void;
  selectedClub?: string;
}

export function ClubSuggester({
  distanceMeters,
  userId,
  onSelectClub,
  selectedClub,
}: ClubSuggesterProps) {
  const [suggestion, setSuggestion] = useState<{
    club: string;
    avgCarryMeters: number | null;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (distanceMeters <= 0) {
      setSuggestion(null);
      return;
    }
    startTransition(async () => {
      try {
        const result = await suggestClubFromDistance(distanceMeters, userId);
        setSuggestion(result);
        if (result?.club && !selectedClub) {
          onSelectClub?.(result.club);
        }
      } catch {
        setSuggestion(null);
      }
    });
  }, [distanceMeters, userId, selectedClub, onSelectClub]);

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-ink-muted">
        <Crosshair className="w-4 h-4 animate-spin" />
        Beregner kolleforslag...
      </div>
    );
  }

  if (!suggestion) {
    return (
      <div className="text-sm text-ink-muted">
        Ingen kolleforslag tilgjengelig
      </div>
    );
  }

  const isSelected = selectedClub === suggestion.club;

  return (
    <button
      onClick={() => onSelectClub?.(suggestion.club)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
        isSelected
          ? "border-primary bg-primary-soft"
          : "border-line bg-card hover:border-primary/40"
      }`}
    >
      <div className="flex items-center gap-3">
        <Crosshair className="w-5 h-5 text-primary" />
        <div className="text-left">
          <p className="text-sm font-semibold text-ink">
            {suggestion.club}
          </p>
          <p className="text-xs text-ink-muted">
            Snitt carry {suggestion.avgCarryMeters ? `${Math.round(suggestion.avgCarryMeters)} m` : "ukjent"}
          </p>
        </div>
      </div>
      <span className="text-xs font-medium text-primary">
        {isSelected ? "Valgt" : "Velg"}
      </span>
    </button>
  );
}
