"use client";

/**
 * CoachingBoardClient — følger MC Mission Board-mønster:
 * subheader med tittel + handlings-knapper → KPI-strip → main-body (agenda + liste).
 */

import Link from "next/link";
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
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="flex items-start justify-between flex-wrap gap-3 pb-2 border-b border-grey-100">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-grey-400">
            Coaching
          </div>
          <h1 className="mt-1 text-2xl font-bold text-grey-900 tracking-tight">
            Coaching Mission Board
          </h1>
          <p className="mt-1 text-sm text-grey-500 max-w-xl">
            Dagsagenda, spillerliste og gruppe-helsesjekk for {viewLabel}. Data
            oppdateres hver 15 min.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {permissions.canEditPlan && (
            <Link
              href="/admin/treningsplan"
              className="inline-flex items-center rounded-[20px] border border-grey-200 px-4 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50 transition-colors"
            >
              Treningsplaner
            </Link>
          )}
          {permissions.canRegisterTest && (
            <Link
              href="/admin/elever"
              className="inline-flex items-center rounded-[20px] bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-alt transition-colors"
            >
              Registrer test
            </Link>
          )}
        </div>
      </header>

      <GroupHealthSection health={initialData.groupHealth} />

      <DailyAgendaSection signals={signals} />

      <PlayerListSection players={initialData.players} />
    </div>
  );
}
