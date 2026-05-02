"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/portal/mission-control/ui";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/portal/utils/cn";
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

const PERIOD_COLORS: Record<string, string> = {
  grunnperiode: "bg-info/10 text-info",
  spesialiseringsperiode: "bg-warning/10 text-warning",
  turneringsperiode: "bg-error/10 text-error",
};

interface GrupperClientProps {
  initialGroups: GroupSummary[];
  initialPlayers: PlayerOption[];
}

export function GrupperClient({
  initialGroups,
  initialPlayers,
}: GrupperClientProps) {
  const { toggle } = useMCSidebar();
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
    <div className="flex-1 flex flex-col min-h-0">
      <MCTopbar
        title="Treningsgrupper"
        subtitle="Opprett og administrer grupper"
        onMenuClick={toggle}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <AdminPageHeader
          title="Treningsgrupper"
          subtitle="Coach grupper med spillere og synkroniserte planer"
          breadcrumbs={[{ label: "Treningsgrupper" }]}
        />

        <div className="mt-6 flex justify-between items-center">
          <Button onClick={() => setCreateOpen(true)}>
            <Icon name="add" size={16} className="mr-2" />
            Ny gruppe
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <Card
              key={group.id}
              className="p-5 cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => openDetail(group)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-on-surface">{group.name}</h3>
                  {group.description && (
                    <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">
                      {group.description}
                    </p>
                  )}
                </div>
                <Badge
                  className={cn(
                    "text-[10px] uppercase",
                    PERIOD_COLORS[group.periodType],
                  )}
                >
                  {PERIOD_LABELS[group.periodType] ?? group.periodType}
                </Badge>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <Icon name="people" size={16} />
                  {group.memberCount} medlemmer
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="menu_book" size={16} />
                  {group.planCount} planer
                </span>
              </div>
            </Card>
          ))}
        </div>

        {groups.length === 0 && (
          <div className="mt-12 text-center">
            <Icon
              name="groups"
              size={48}
              className="text-on-surface-variant/40 mx-auto mb-3"
            />
            <p className="text-on-surface-variant">Ingen grupper ennå.</p>
            <p className="text-sm text-on-surface-variant/70 mt-1">
              Klikk &quot;Ny gruppe&quot; for å komme i gang.
            </p>
          </div>
        )}
      </div>

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
    </div>
  );
}


