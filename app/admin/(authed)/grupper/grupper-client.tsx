"use client";

import { useState, useTransition } from "react";
import { AnimatePresence } from "framer-motion";
import { Filter, Plus, AlertTriangle, Calendar } from "lucide-react";
import { GroupsKpiRow } from "@/components/admin/grupper/groups-kpi-row";
import {
  createGroup,
  deleteGroup,
  getGroupMembers,
  listAvailablePlayers,
  getGroupPlan,
  type GroupSummary,
  type GroupMember,
  type PlayerOption,
  type GroupPlanDetail,
} from "./actions";
import { GroupDetailModal } from "./group-detail-modal";
import { CreateGroupModal } from "./create-group-modal";

const PERIOD_LABELS: Record<string, string> = {
  grunnperiode: "Grunnperiode",
  spesialiseringsperiode: "Spesialisering",
  turneringsperiode: "Turnering",
};

const AVATAR_COLORS = ["#6BB1FF", "#C99CF3", "#E8B967", "#6FCBA1", "#D1F843"];

interface GrupperClientProps {
  initialGroups: GroupSummary[];
  initialPlayers: PlayerOption[];
}

export function GrupperClient({
  initialGroups,
  initialPlayers,
}: GrupperClientProps) {
  const [groups, setGroups] = useState<GroupSummary[]>(initialGroups);
  const [isPending, startTransition] = useTransition();

  const [createOpen, setCreateOpen] = useState(false);
  const [detailGroup, setDetailGroup] = useState<GroupSummary | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [availableForDetail, setAvailableForDetail] = useState<PlayerOption[]>(
    [],
  );
  const [groupPlan, setGroupPlan] = useState<GroupPlanDetail | null>(null);

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPeriod, setNewPeriod] = useState("grunnperiode");

  const totalMembers = groups.reduce((sum, g) => sum + g.memberCount, 0);
  const totalPlans = groups.reduce((sum, g) => sum + g.planCount, 0);
  const underbooked = groups.filter((g) => g.memberCount === 0).length;

  const kpis = [
    { label: "Aktive grupper", value: String(groups.length) },
    { label: "Spillere på roster", value: String(totalMembers) },
    { label: "Planer totalt", value: String(totalPlans) },
    {
      label: "Snitt per gruppe",
      value: groups.length
        ? String(Math.round(totalMembers / groups.length))
        : "0",
    },
    underbooked > 0
      ? {
          label: "Uten spillere",
          value: String(underbooked),
          suffix: "grupper",
          tone: "alert" as const,
        }
      : { label: "Uten spillere", value: "0", suffix: "grupper" },
  ];

  function handleCreate() {
    if (!newName.trim()) return;
    startTransition(async () => {
      const result = await createGroup({
        name: newName,
        description: newDesc,
        periodType: newPeriod,
      });
      if (result.success && result.groupId) {
        setGroups((prev) => [
          {
            id: result.groupId!,
            name: newName,
            description: newDesc || null,
            periodType: newPeriod,
            memberCount: 0,
            planCount: 0,
            createdAt: new Date(),
          },
          ...prev,
        ]);
        setCreateOpen(false);
        setNewName("");
        setNewDesc("");
        setNewPeriod("grunnperiode");
      }
    });
  }

  function handleDelete(groupId: string) {
    if (!confirm("Er du sikker på at du vil slette denne gruppen?")) return;
    startTransition(async () => {
      const result = await deleteGroup(groupId);
      if (result.success) {
        setGroups((prev) => prev.filter((g) => g.id !== groupId));
        if (detailGroup?.id === groupId) setDetailGroup(null);
      }
    });
  }

  async function refreshMembers(groupId: string) {
    const [ms, av] = await Promise.all([
      getGroupMembers(groupId),
      listAvailablePlayers(groupId),
    ]);
    setMembers(ms);
    setAvailableForDetail(av);
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, memberCount: ms.length } : g,
      ),
    );
  }

  async function openDetail(group: GroupSummary) {
    setDetailGroup(group);
    const [ms, av, plan] = await Promise.all([
      getGroupMembers(group.id),
      listAvailablePlayers(group.id),
      getGroupPlan(group.id),
    ]);
    setMembers(ms);
    setAvailableForDetail(av);
    setGroupPlan(plan);
  }

  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-white">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between border-b border-[#1a4a3a] pb-5">
        <div>
          <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-accent">
            / MENNESKER · GRUPPER
          </div>
          <h1 className="mt-2 font-inter-tight text-[28px] font-bold leading-tight tracking-tight text-white">
            Treningsgrupper og kohorter.
          </h1>
          <p className="mt-1.5 max-w-2xl text-[13px] text-white/60">
            {groups.length} aktive grupper. Klikk en gruppe for å redigere
            spillere og planer.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => alert("Filter kommer snart — alle grupper vises foreløpig")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] font-medium text-white/90 transition hover:border-white/20 hover:bg-white/10"
          >
            <Filter className="h-3.5 w-3.5" strokeWidth={1.8} /> Filter
          </button>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary bg-primary px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#00422F]"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.8} /> Ny gruppe
          </button>
        </div>
      </div>

      <GroupsKpiRow kpis={kpis} />

      {/* Grid */}
      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => {
          const initials =
            group.name
              .split(/\s+/)
              .slice(0, 2)
              .map((w) => w[0]?.toUpperCase() ?? "")
              .join("") || "GR";
          const periodLabel =
            PERIOD_LABELS[group.periodType] ?? group.periodType;
          const isEmpty = group.memberCount === 0;
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => openDetail(group)}
              className={
                "flex flex-col gap-3 rounded-[14px] border border-white/[0.06] bg-[#0D2E23] p-[18px] text-left transition hover:border-white/[0.12] " +
                (isEmpty ? "opacity-70" : "")
              }
            >
              <div className="flex items-center justify-between">
                <div className="text-[15px] font-bold tracking-tight text-white">
                  {group.name}
                </div>
                <span
                  className={
                    "rounded-[5px] px-[7px] py-[3px] font-mono text-[9px] font-bold uppercase tracking-[0.14em] " +
                    (isEmpty
                      ? "bg-[rgba(184,66,51,0.20)] text-[#F49283]"
                      : "bg-[rgba(209,248,67,0.18)] text-accent")
                  }
                >
                  {periodLabel}
                </span>
              </div>

              <div className="text-[12px] leading-[1.55] text-white/65">
                {group.description ?? "Ingen beskrivelse."}
              </div>

              <div className="flex">
                <div
                  className="grid h-[26px] w-[26px] place-items-center rounded-full border-2 border-[#0D2E23] text-[9px] font-bold text-[#0A1F18]"
                  style={{ background: AVATAR_COLORS[0] }}
                >
                  {initials}
                </div>
                {group.memberCount > 1 ? (
                  <div
                    className="grid h-[26px] w-[26px] place-items-center rounded-full border-2 border-[#0D2E23] bg-white/[0.08] text-[9px] font-bold text-white/70"
                    style={{ marginLeft: -6 }}
                  >
                    +{group.memberCount - 1}
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-2.5 text-[12px] text-white/85">
                {isEmpty ? (
                  <AlertTriangle
                    className="h-3.5 w-3.5 text-[#E8B967]"
                    strokeWidth={1.8}
                  />
                ) : (
                  <Calendar
                    className="h-3.5 w-3.5 text-accent"
                    strokeWidth={1.8}
                  />
                )}
                <span className="truncate">
                  {isEmpty
                    ? "Ingen spillere — legg til for å starte"
                    : `${group.planCount} ${group.planCount === 1 ? "plan" : "planer"} aktive`}
                </span>
              </div>

              <div className="mt-auto grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-3">
                <div className="font-mono">
                  <div className="text-[9px] uppercase tracking-[0.10em] text-white/50">
                    Roster
                  </div>
                  <div className="mt-0.5 text-[16px] font-bold text-white">
                    {group.memberCount}
                  </div>
                </div>
                <div className="font-mono">
                  <div className="text-[9px] uppercase tracking-[0.10em] text-white/50">
                    Planer
                  </div>
                  <div className="mt-0.5 text-[16px] font-bold text-white">
                    {group.planCount}
                  </div>
                </div>
                <div className="font-mono">
                  <div className="text-[9px] uppercase tracking-[0.10em] text-white/50">
                    Periode
                  </div>
                  <div className="mt-0.5 text-[11px] font-bold text-white">
                    {periodLabel}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {groups.length === 0 && (
        <div className="mt-12 rounded-2xl border border-white/[0.06] bg-[#0D2E23] p-12 text-center">
          <p className="text-white/70">Ingen grupper ennå.</p>
          <p className="mt-1 text-sm text-white/50">
            Klikk &quot;Ny gruppe&quot; for å komme i gang.
          </p>
        </div>
      )}

      <AnimatePresence>
        {createOpen && (
          <CreateGroupModal
            name={newName}
            setName={setNewName}
            desc={newDesc}
            setDesc={setNewDesc}
            period={newPeriod}
            setPeriod={setNewPeriod}
            isPending={isPending}
            onCreate={handleCreate}
            onClose={() => setCreateOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detailGroup && (
          <GroupDetailModal
            group={detailGroup}
            members={members}
            availablePlayers={availableForDetail}
            groupPlan={groupPlan}
            onClose={() => setDetailGroup(null)}
            onDelete={handleDelete}
            onMembersChanged={() => refreshMembers(detailGroup.id)}
          />
        )}
      </AnimatePresence>

      {/* Avoid unused-prop warning while initialPlayers is reserved for future inline-add UI */}
      <span className="hidden">{initialPlayers.length}</span>
    </div>
  );
}
