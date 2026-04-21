"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/portal/mission-control/ui";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/portal/utils/cn";
import {
  createGroup,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
  getGroupMembers,
  listAvailablePlayers,
  type GroupSummary,
  type GroupMember,
  type PlayerOption,
} from "./actions";

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

export function GrupperClient({ initialGroups, initialPlayers }: GrupperClientProps) {
  const { toggle } = useMCSidebar();
  const [groups, setGroups] = useState<GroupSummary[]>(initialGroups);
  const [players] = useState<PlayerOption[]>(initialPlayers);
  const [isPending, startTransition] = useTransition();

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [detailGroup, setDetailGroup] = useState<GroupSummary | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [availableForDetail, setAvailableForDetail] = useState<PlayerOption[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");

  // Create form
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPeriod, setNewPeriod] = useState("grunnperiode");

  async function handleCreate() {
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

  async function handleDelete(groupId: string) {
    if (!confirm("Er du sikker på at du vil slette denne gruppen?")) return;
    startTransition(async () => {
      const result = await deleteGroup(groupId);
      if (result.success) {
        setGroups((prev) => prev.filter((g) => g.id !== groupId));
        if (detailGroup?.id === groupId) setDetailGroup(null);
      }
    });
  }

  async function openDetail(group: GroupSummary) {
    setDetailGroup(group);
    const [ms, av] = await Promise.all([
      getGroupMembers(group.id),
      listAvailablePlayers(group.id),
    ]);
    setMembers(ms);
    setAvailableForDetail(av);
    setSelectedPlayerId("");
  }

  async function handleAddMember() {
    if (!detailGroup || !selectedPlayerId) return;
    startTransition(async () => {
      const result = await addMember(detailGroup.id, selectedPlayerId);
      if (result.success) {
        const [ms, av] = await Promise.all([
          getGroupMembers(detailGroup.id),
          listAvailablePlayers(detailGroup.id),
        ]);
        setMembers(ms);
        setAvailableForDetail(av);
        setSelectedPlayerId("");
        setGroups((prev) =>
          prev.map((g) =>
            g.id === detailGroup.id ? { ...g, memberCount: g.memberCount + 1 } : g
          )
        );
      }
    });
  }

  async function handleRemoveMember(userId: string) {
    if (!detailGroup) return;
    startTransition(async () => {
      const result = await removeMember(detailGroup.id, userId);
      if (result.success) {
        setMembers((prev) => prev.filter((m) => m.userId !== userId));
        setAvailableForDetail((prev) => [
          ...prev,
          players.find((p) => p.id === userId)!,
        ].filter(Boolean));
        setGroups((prev) =>
          prev.map((g) =>
            g.id === detailGroup.id ? { ...g, memberCount: g.memberCount - 1 } : g
          )
        );
      }
    });
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
            <Icon name="add" className="w-4 h-4 mr-2" />
            Ny gruppe
          </Button>
        </div>

        {/* Group list */}
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
                  className={cn("text-[10px] uppercase", PERIOD_COLORS[group.periodType])}
                >
                  {PERIOD_LABELS[group.periodType] ?? group.periodType}
                </Badge>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <Icon name="people" className="w-4 h-4" />
                  {group.memberCount} medlemmer
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="notebook" className="w-4 h-4" />
                  {group.planCount} planer
                </span>
              </div>
            </Card>
          ))}
        </div>

        {groups.length === 0 && (
          <div className="mt-12 text-center">
            <Icon name="groups" className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-3" />
            <p className="text-on-surface-variant">Ingen grupper ennå.</p>
            <p className="text-sm text-on-surface-variant/70 mt-1">
              Klikk "Ny gruppe" for å komme i gang.
            </p>
          </div>
        )}
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {createOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setCreateOpen(false)} />
            <motion.div
              className="relative bg-surface-container-lowest border border-outline-variant/30 rounded-2xl w-full max-w-md p-6 shadow-2xl"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
            >
              <h2 className="text-lg font-bold text-on-surface mb-4">Ny treningsgruppe</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-on-surface-variant block mb-1">Navn</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="F.eks. Junior Elite 2026"
                  />
                </div>
                <div>
                  <label className="text-sm text-on-surface-variant block mb-1">Beskrivelse</label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Valgfri beskrivelse"
                  />
                </div>
                <div>
                  <label className="text-sm text-on-surface-variant block mb-1">Periode</label>
                  <div className="flex gap-2">
                    {["grunnperiode", "spesialiseringsperiode", "turneringsperiode"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewPeriod(p)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-medium transition-colors border flex-1",
                          newPeriod === p
                            ? "bg-on-surface text-surface border-black"
                            : "bg-surface-container-lowest border-outline-variant/30 text-on-surface hover:bg-surface-container",
                        )}
                      >
                        {PERIOD_LABELS[p]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button className="flex-1" onClick={handleCreate} isLoading={isPending}>
                  Opprett
                </Button>
                <Button
                  className="flex-1"
                  variant="secondary"
                  onClick={() => setCreateOpen(false)}
                >
                  Avbryt
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail modal */}
      <AnimatePresence>
        {detailGroup && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setDetailGroup(null)} />
            <motion.div
              className="relative bg-surface-container-lowest border border-outline-variant/30 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl p-6"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-on-surface">{detailGroup.name}</h2>
                  <Badge className={cn("mt-1 text-[10px] uppercase", PERIOD_COLORS[detailGroup.periodType])}>
                    {PERIOD_LABELS[detailGroup.periodType]}
                  </Badge>
                </div>
                <button
                  onClick={() => handleDelete(detailGroup.id)}
                  className="p-2 rounded-lg hover:bg-error/10 text-error transition-colors"
                  title="Slett gruppe"
                >
                  <Icon name="delete" className="w-4 h-4" />
                </button>
              </div>

              {detailGroup.description && (
                <p className="text-sm text-on-surface-variant mt-3">{detailGroup.description}</p>
              )}

              {/* Add member */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-on-surface mb-2">Legg til spiller</h3>
                <div className="flex gap-2">
                  <select
                    value={selectedPlayerId}
                    onChange={(e) => setSelectedPlayerId(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-surface border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Velg spiller...</option>
                    {availableForDetail.map((p) => (
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
                    <Icon name="person_add" className="w-4 h-4 mr-1" />
                    Legg til
                  </Button>
                </div>
              </div>

              {/* Members list */}
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
                        <Icon name="person" className="w-4 h-4 text-on-surface-variant" />
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
                        <Icon name="close" className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {members.length === 0 && (
                  <p className="text-sm text-on-surface-variant">Ingen medlemmer ennå.</p>
                )}
              </div>

              <div className="mt-6">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setDetailGroup(null)}
                >
                  Lukk
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
