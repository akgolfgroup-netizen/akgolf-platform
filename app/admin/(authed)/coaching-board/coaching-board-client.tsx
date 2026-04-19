"use client";

import { AdminPageHeader } from "@/components/portal/mission-control/ui";
import { GroupHealthSection } from "./components/group-health-section";
import { DailyAgendaSection } from "./components/daily-agenda-section";
import { PlayerListSection } from "./components/player-list-section";
import type { CoachingBoardData } from "./actions";

interface CoachingBoardClientProps {
  initialData: CoachingBoardData;
  permissions: {
    canPromote: boolean;
    canEditPlan: boolean;
    canRegisterTest: boolean;
  };
}

export function CoachingBoardClient({
  initialData,
  permissions,
}: CoachingBoardClientProps) {
  const signals = initialData.players
    .map((p) => p.signal)
    .filter((s): s is NonNullable<typeof s> => s !== null);

  const viewLabel =
    initialData.viewMode === "all" ? "alle AK-elever" : "egne spillere";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Coaching Mission Board"
        subtitle={`Dagsagenda, spillerliste og gruppe-helsesjekk for ${viewLabel}. Data oppdateres hver 15 min.`}
      />

      <GroupHealthSection health={initialData.groupHealth} />

      <DailyAgendaSection signals={signals} />

      <PlayerListSection players={initialData.players} />

      {permissions.canPromote && (
        <div className="rounded-xl border border-[var(--hg-border-subtle)] bg-[var(--hg-surface)] p-4">
          <div className="text-xs text-[var(--hg-text-muted)]">
            Du har tilgang til å godkjenne kategori-opprykk. Opprykkssjekker vises
            automatisk i varslene når en spiller er klar.
          </div>
        </div>
      )}
    </div>
  );
}
