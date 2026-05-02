"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/portal/utils/cn";
import {
  addMember,
  removeMember,
  syncGroupPlanToMembers,
  type GroupSummary,
  type GroupMember,
  type PlayerOption,
  type GroupPlanDetail,
  type SyncResult,
} from "./actions";
import { SyncSection } from "./sync-section";

const PERIOD_LABELS: Record<string, string> = {
  grunnperiode: "Grunnperiode",
  spesialiseringsperiode: "Spesialisering",
  turneringsperiode: "Turnering",
};

const PERIOD_COLORS: Record<string, string> = {
  grunnperiode: "bg-info/10 text-info",
  spesialiseringsperiode: "bg-warning/10 text-warning",
  turneringsperiode: "bg-error/10 text-error",
};

interface GroupDetailModalProps {
  group: GroupSummary;
  members: GroupMember[];
  availablePlayers: PlayerOption[];
  groupPlan: GroupPlanDetail | null;
  onClose: () => void;
  onDelete: (groupId: string) => void;
  onMembersChanged: () => void;
}

export function GroupDetailModal({
  group,
  members,
  availablePlayers,
  groupPlan,
  onClose,
  onDelete,
  onMembersChanged,
}: GroupDetailModalProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [syncWeekOffset, setSyncWeekOffset] = useState<number>(0);
  const [syncStrategy, setSyncStrategy] = useState<"skip" | "keep" | "overwrite">(
    "skip",
  );
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);

  function handleAddMember() {
    if (!selectedPlayerId) return;
    startTransition(async () => {
      const result = await addMember(group.id, selectedPlayerId);
      if (result.success) {
        setSelectedPlayerId("");
        onMembersChanged();
      }
    });
  }

  function handleRemoveMember(userId: string) {
    startTransition(async () => {
      const result = await removeMember(group.id, userId);
      if (result.success) {
        onMembersChanged();
      }
    });
  }

  function handleSync() {
    startTransition(async () => {
      const result = await syncGroupPlanToMembers(
        group.id,
        syncWeekOffset,
        syncStrategy,
      );
      setSyncResult(result);
    });
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-on-surface/50" onClick={onClose} />
      <motion.div
        className="relative bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-card-hover p-6"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-headline text-lg font-semibold text-on-surface">
              {group.name}
            </h2>
            <Badge
              className={cn(
                "mt-1 text-[10px] uppercase",
                PERIOD_COLORS[group.periodType],
              )}
            >
              {PERIOD_LABELS[group.periodType]}
            </Badge>
          </div>
          <button
            onClick={() => onDelete(group.id)}
            className="p-2 rounded-lg hover:bg-error/10 text-error transition-colors"
            title="Slett gruppe"
          >
            <Icon name="delete" size={16} />
          </button>
        </div>

        {group.description && (
          <p className="text-sm text-on-surface-variant mt-3">
            {group.description}
          </p>
        )}

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-on-surface mb-2">
            Legg til spiller
          </h3>
          <div className="flex gap-2">
            <select
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-surface border border-outline-variant text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Velg spiller...</option>
              {availablePlayers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name ?? p.email ?? p.id}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              onClick={handleAddMember}
              disabled={!selectedPlayerId || isPending}
            >
              <Icon name="person_add" size={16} className="mr-1" />
              Legg til
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-on-surface mb-2">
            Medlemmer ({members.length})
          </h3>
          <div className="space-y-2">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between bg-surface-container-low rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <Icon
                    name="person"
                    size={16}
                    className="text-on-surface-variant"
                  />
                  <span className="text-sm text-on-surface">
                    {m.name ?? m.email ?? m.userId}
                  </span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                    {m.role}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveMember(m.userId)}
                  className="p-1.5 rounded-md hover:bg-error/10 text-error transition-colors"
                >
                  <Icon name="close" size={16} />
                </button>
              </div>
            ))}
          </div>
          {members.length === 0 && (
            <p className="text-sm text-on-surface-variant">
              Ingen medlemmer ennå.
            </p>
          )}
        </div>

        {groupPlan && (
          <SyncSection
            members={members}
            syncWeekOffset={syncWeekOffset}
            setSyncWeekOffset={setSyncWeekOffset}
            syncStrategy={syncStrategy}
            setSyncStrategy={setSyncStrategy}
            syncResult={syncResult}
            isPending={isPending}
            onSync={handleSync}
          />
        )}

        <div className="mt-6">
          <Button variant="secondary" className="w-full" onClick={onClose}>
            Lukk
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
