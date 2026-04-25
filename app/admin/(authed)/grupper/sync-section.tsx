"use client";

import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/portal/utils/cn";
import type { GroupMember, SyncResult } from "./actions";

const DAYS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

interface SyncSectionProps {
  members: GroupMember[];
  syncWeekOffset: number;
  setSyncWeekOffset: (offset: number) => void;
  syncStrategy: "skip" | "keep" | "overwrite";
  setSyncStrategy: (strategy: "skip" | "keep" | "overwrite") => void;
  syncResult: SyncResult | null;
  isPending: boolean;
  onSync: () => void;
}

export function SyncSection({
  members,
  syncWeekOffset,
  setSyncWeekOffset,
  syncStrategy,
  setSyncStrategy,
  syncResult,
  isPending,
  onSync,
}: SyncSectionProps) {
  return (
    <div className="mt-6 border-t border-outline-variant pt-6">
      <h3 className="text-sm font-semibold text-on-surface mb-2">
        Synkroniser plan til medlemmer
      </h3>

      <div className="space-y-3">
        <div>
          <label className="text-[11px] text-on-surface-variant block mb-1">
            Uke
          </label>
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((offset) => (
              <button
                key={offset}
                type="button"
                onClick={() => setSyncWeekOffset(offset)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex-1",
                  syncWeekOffset === offset
                    ? "bg-on-surface text-surface border-on-surface"
                    : "bg-surface-container-lowest border-outline-variant text-on-surface hover:bg-surface-container",
                )}
              >
                {offset === 0 ? "Denne uken" : `+${offset} uker`}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] text-on-surface-variant block mb-1">
            Ved konflikt (spiller har egen økt samme dag)
          </label>
          <select
            value={syncStrategy}
            onChange={(e) =>
              setSyncStrategy(e.target.value as "skip" | "keep" | "overwrite")
            }
            className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="skip">Hopp over (behold begge)</option>
            <option value="keep">Behold spillerens økt</option>
            <option value="overwrite">Overskriv med gruppeøkt</option>
          </select>
        </div>

        <Button onClick={onSync} isLoading={isPending} className="w-full">
          <Icon name="sync" size={16} className="mr-2" />
          Synkroniser nå
        </Button>
      </div>

      {syncResult && (
        <SyncResultPanel result={syncResult} memberCount={members.length} />
      )}
    </div>
  );
}

function SyncResultPanel({
  result,
  memberCount,
}: {
  result: SyncResult;
  memberCount: number;
}) {
  return (
    <div className="mt-3 space-y-2">
      {result.success ? (
        <div className="rounded-lg bg-success/10 px-3 py-2 text-xs text-success">
          {result.syncedCount} økter synkronisert til {memberCount} medlemmer
        </div>
      ) : result.syncedCount > 0 ? (
        <div className="rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning">
          {result.syncedCount} økter synkronisert, men {result.conflictCount}{" "}
          konflikter funnet
        </div>
      ) : (
        <div className="rounded-lg bg-error/10 px-3 py-2 text-xs text-error">
          Ingen økter synkronisert.{" "}
          {result.errors[0]?.message ?? "Sjekk konflikter."}
        </div>
      )}

      {result.conflicts.length > 0 && (
        <div className="rounded-lg bg-surface-container-low px-3 py-2">
          <p className="text-[11px] font-semibold text-on-surface mb-1">
            Konflikter:
          </p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {result.conflicts.map((c, i) => (
              <p key={i} className="text-[11px] text-on-surface-variant">
                {c.userName ?? c.userId}: {c.groupSessionTitle} vs{" "}
                {c.existingSessionTitle} ({DAYS[c.dayOfWeek - 1]})
              </p>
            ))}
          </div>
        </div>
      )}

      {result.errors.length > 0 && (
        <div className="rounded-lg bg-error/5 px-3 py-2">
          <p className="text-[11px] font-semibold text-error mb-1">Feil:</p>
          {result.errors.map((e, i) => (
            <p key={i} className="text-[11px] text-error/80">
              {e.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
