"use client";

import { useRouter } from "next/navigation";
import type { TournamentWithPlan } from "../types";
import { TournamentCard } from "./TournamentCard";
import { Trophy } from "lucide-react";

interface TournamentListProps {
  tournaments: TournamentWithPlan[];
  studentId: string;
}

export function TournamentList({ tournaments, studentId }: TournamentListProps) {
  const router = useRouter();

  if (tournaments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Trophy className="w-10 h-10 text-[var(--color-border)] mb-3" />
        <p className="text-sm text-[var(--color-gold-muted)]">
          Ingen turneringer lagt inn ennå.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tournaments.map((t) => (
        <TournamentCard
          key={t.id}
          tournament={t}
          studentId={studentId}
          onPlanUpdated={() => router.refresh()}
        />
      ))}
    </div>
  );
}
