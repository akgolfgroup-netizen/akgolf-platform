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
import { GroupSessionsPanel } from "@/components/admin/grupper/group-sessions-panel";
import { GroupPlanPanel } from "@/components/admin/grupper/group-plan-panel";

const PERIOD_LABELS: Record<string, string> = {
  grunnperiode: "Grunnperiode",
  spesialiseringsperiode: "Spesialisering",
  turneringsperiode: "Turnering",
};

const PERIOD_COLORS: Record<string, string> = {
  grunnperiode: "bg-[rgba(107,177,255,0.18)] text-[#6BB1FF]",
  spesialiseringsperiode: "bg-[rgba(232,185,103,0.20)] text-[#E8B967]",
  turneringsperiode: "bg-[rgba(184,66,51,0.20)] text-[#F49283]",
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
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        className="relative bg-[#0D2E23] border border-[#1a4a3a] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 text-white"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
      >
        <div className="flex items-start justify-between border-b border-[#1a4a3a] pb-4 mb-4">
          <div>
            <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-accent">
              / GRUPPER · DETALJ
            </div>
            <h2 className="font-inter-tight text-[24px] font-bold leading-tight tracking-tight text-white mt-1">
              {group.name}
            </h2>
            <Badge
              className={cn(
                "mt-2 text-[9px] uppercase font-mono tracking-[0.14em] font-bold",
                PERIOD_COLORS[group.periodType],
              )}
            >
              {PERIOD_LABELS[group.periodType]}
            </Badge>
          </div>
          <button
            onClick={() => onDelete(group.id)}
            className="p-2 rounded-lg hover:bg-[rgba(184,66,51,0.20)] text-[#F49283] transition-colors"
            title="Slett gruppe"
          >
            <Icon name="delete" size={16} />
          </button>
        </div>

        {group.description && (
          <p className="text-[13px] text-white/70 leading-[1.55] mb-4">
            {group.description}
          </p>
        )}

        <div className="mt-6">
          <h3 className="text-[14px] font-bold text-white mb-3">
            Legg til spiller
          </h3>
          <div className="flex gap-2">
            <select
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-sm text-white focus:outline-none focus:border-accent"
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
              className="bg-primary hover:bg-[#00422F] text-white border-primary"
            >
              <Icon name="person_add" size={16} className="mr-1" />
              Legg til
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-[14px] font-bold text-white mb-3 flex items-center justify-between">
            <span>Roster</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/50">
              {members.length} SPILLERE
            </span>
          </h3>
          <div className="space-y-1.5">
            {members.map((m) => {
              const initials =
                (m.name ?? m.email ?? "??")
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((w) => w[0]?.toUpperCase() ?? "")
                  .join("") || "??";
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold text-[#0A1F18]"
                      style={{ background: "#6FCBA1" }}
                    >
                      {initials}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-white">
                        {m.name ?? m.email ?? m.userId}
                      </div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.10em] text-white/50">
                        {m.role}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(m.userId)}
                    className="p-1.5 rounded-md hover:bg-[rgba(184,66,51,0.20)] text-[#F49283] transition-colors"
                  >
                    <Icon name="close" size={16} />
                  </button>
                </div>
              );
            })}
          </div>
          {members.length === 0 && (
            <p className="text-[13px] text-white/55">
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

        <div className="mt-6 pt-6 border-t border-[#1a4a3a]">
          <GroupPlanPanel
            groupId={group.id}
            hasActivePlan={!!groupPlan}
            onPlanCreated={onMembersChanged}
          />
        </div>

        <div className="mt-6 pt-6 border-t border-[#1a4a3a]">
          <GroupSessionsPanel groupId={group.id} />
        </div>

        <div className="mt-6">
          <Button
            variant="secondary"
            className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10"
            onClick={onClose}
          >
            Lukk
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
