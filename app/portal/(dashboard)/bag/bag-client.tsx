"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  Save,
  X,
  Edit2,
  Target,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { addClub, deleteClub } from "./actions";
import { useRouter } from "next/navigation";
import { QuickAction } from "@/components/portal/heritage/quick-action";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import type { PlayerClubData, GapAnalysisItem } from "./actions";

const DEFAULT_CLUBS = [
  "Driver",
  "3 Wood",
  "5 Wood",
  "4 Hybrid",
  "5 Iron",
  "6 Iron",
  "7 Iron",
  "8 Iron",
  "9 Iron",
  "PW",
  "GW",
  "SW",
  "LW",
  "Putter",
];

interface BagClientProps {
  clubs: PlayerClubData[];
  gapAnalysis: GapAnalysisItem[];
}

export function BagClient({ clubs: initialClubs, gapAnalysis }: BagClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [clubs, setClubs] = useState(initialClubs);
  const [selectedClub, setSelectedClub] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newClub, setNewClub] = useState({ name: "", brand: "", avgCarry: "" });

  function handleAdd() {
    if (!newClub.name) return;
    startTransition(async () => {
      const club = await addClub({
        name: newClub.name,
        brand: newClub.brand || undefined,
        avgCarry: newClub.avgCarry ? parseFloat(newClub.avgCarry) : undefined,
      });
      if (club) {
        setClubs((prev) => [
          ...prev,
          {
            ...club,
            model: club.model ?? null,
            loft: club.loft ?? null,
            avgTotal: club.avgTotal ?? null,
            avgOffline: club.avgOffline ?? null,
            shotCount: club.shotCount ?? 0,
            sortOrder: club.sortOrder ?? prev.length,
          } as PlayerClubData,
        ]);
      }
      setNewClub({ name: "", brand: "", avgCarry: "" });
      setShowAdd(false);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteClub(id);
      setClubs((prev) => prev.filter((c) => c.id !== id));
      if (selectedClub === id) setSelectedClub(null);
    });
  }

  const maxCarry = Math.max(...clubs.map((c) => c.avgCarry ?? 0), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F18]">Min bag</h1>
          <p className="text-[#324D45] mt-1">
            {clubs.length > 0
              ? `${clubs.length} klubber registrert`
              : "Ingen klubber registrert enda"}
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A1F18] text-white text-sm font-medium hover:bg-[#1A3529] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Legg til klubb
        </button>
      </div>

      {/* Empty State */}
      {clubs.length === 0 && !showAdd && (
        <PremiumCard>
          <div className="p-6 text-center">
            <Target className="w-12 h-12 text-[#7A8C85] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#0A1F18] mb-2">
              Ingen klubber i bagen
            </h3>
            <p className="text-[#324D45] max-w-md mx-auto">
              Legg til klubbene dine for a fa oversikt over avstander, gap-analyse
              og anbefalinger.
            </p>
          </div>
        </PremiumCard>
      )}

      {/* Bag Visualization */}
      {clubs.length > 0 && (
        <PremiumCard className="p-6 lg:p-8">
          <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-14 gap-2">
            {clubs.map((club, index) => (
              <motion.button
                key={club.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => setSelectedClub(club.id)}
                className={`aspect-[3/4] rounded-xl flex flex-col items-center justify-center p-2 transition-all ${
                  selectedClub === club.id
                    ? "bg-[#D1F843] text-[#0A1F18]"
                    : "bg-[#F5F8F7] text-[#324D45] hover:bg-[#D5DFDB]"
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider opacity-70">
                  {club.name}
                </span>
                <span className="text-lg font-bold tabular-nums tracking-tight">
                  {club.loft != null ? `${club.loft}` : "--"}
                </span>
              </motion.button>
            ))}
          </div>
        </PremiumCard>
      )}

      {/* Selected Club Detail */}
      {selectedClub &&
        (() => {
          const club = clubs.find((c) => c.id === selectedClub);
          if (!club) return null;
          return (
            <PremiumCard key={selectedClub}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#F5F8F7] flex items-center justify-center">
                      <Target className="w-8 h-8 text-[#0A1F18]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#0A1F18]">
                        {club.name}
                      </h3>
                      <p className="text-[#324D45]">
                        {[club.brand, club.model].filter(Boolean).join(" ") ||
                          "Ikke spesifisert"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F5F8F7] text-sm text-[#324D45] hover:bg-[#D5DFDB] transition-colors">
                      <Edit2 className="w-3 h-3" />
                      Rediger
                    </button>
                    <button
                      onClick={() => handleDelete(club.id)}
                      disabled={isPending}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#EF4444]/10 text-sm text-[#EF4444] hover:bg-[#EF4444]/20 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      Fjern
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#F5F8F7]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7A8C85]">
                      Carry
                    </p>
                    <p className="text-2xl font-bold text-[#0A1F18] tabular-nums tracking-tight">
                      {club.avgCarry != null ? `${club.avgCarry}m` : "--"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F5F8F7]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7A8C85]">
                      Total
                    </p>
                    <p className="text-2xl font-bold text-[#0A1F18] tabular-nums tracking-tight">
                      {club.avgTotal != null ? `${club.avgTotal}m` : "--"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F5F8F7]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7A8C85]">
                      Slag
                    </p>
                    <p className="text-2xl font-bold text-[#0A1F18] tabular-nums tracking-tight">
                      {club.shotCount}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F5F8F7]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7A8C85]">
                      Loft
                    </p>
                    <p className="text-2xl font-bold text-[#0A1F18] tabular-nums tracking-tight">
                      {club.loft != null ? `${club.loft}` : "--"}
                    </p>
                  </div>
                </div>
              </div>
            </PremiumCard>
          );
        })()}

      {/* Distance Chart */}
      {clubs.some((c) => (c.avgCarry ?? 0) > 0) && (
        <PremiumCard>
          <h3 className="font-semibold text-[#0A1F18] mb-4">
            Avstandsoversikt
          </h3>
          <div className="space-y-3">
            {clubs
              .filter((c) => (c.avgCarry ?? 0) > 0)
              .sort((a, b) => (b.avgCarry ?? 0) - (a.avgCarry ?? 0))
              .map((club) => (
                <div key={club.id} className="flex items-center gap-4">
                  <span className="w-16 text-sm font-medium text-[#0A1F18]">
                    {club.name}
                  </span>
                  <div className="flex-1 h-6 bg-[#F5F8F7] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0A1F18] rounded-full transition-all duration-500"
                      style={{
                        width: `${((club.avgCarry ?? 0) / maxCarry) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-16 text-sm text-right text-[#324D45] tabular-nums tracking-tight">
                    {club.avgCarry}m
                  </span>
                </div>
              ))}
          </div>
        </PremiumCard>
      )}

      {/* Gap Analysis */}
      {gapAnalysis.length > 0 && (
        <div className="bg-[#D1F843]/10 rounded-2xl p-6 border border-[#D1F843]/40">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#0A1F18]" />
            <h3 className="font-semibold text-[#0A1F18]">Gap-analyse</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {gapAnalysis.map((gap) => (
              <div key={gap.between} className="p-4 rounded-xl bg-white/50">
                <p className="text-xs text-[#7A8C85] mb-1">{gap.between}</p>
                <p className="text-2xl font-bold text-[#0A1F18] tabular-nums tracking-tight">{gap.gap}m</p>
                <p className="text-xs text-[#324D45] mt-1">
                  {gap.recommended}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Club Form */}
      {showAdd && (
        <PremiumCard>
          <div className="space-y-3">
            <select
              value={newClub.name}
              onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-[#D5DFDB] text-[#0A1F18] bg-[#F5F8F7] outline-none focus:border-[#0A1F18]"
            >
              <option value="">Velg klubb...</option>
              {DEFAULT_CLUBS.filter(
                (c) => !clubs.some((ec) => ec.name === c)
              ).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newClub.brand}
              onChange={(e) => setNewClub({ ...newClub, brand: e.target.value })}
              placeholder="Merke (valgfritt)"
              className="w-full px-3 py-2.5 rounded-xl border border-[#D5DFDB] text-[#0A1F18] bg-[#F5F8F7] outline-none focus:border-[#0A1F18]"
            />
            <input
              type="number"
              value={newClub.avgCarry}
              onChange={(e) =>
                setNewClub({ ...newClub, avgCarry: e.target.value })
              }
              placeholder="Gjennomsnittlig carry (meter)"
              className="w-full px-3 py-2.5 rounded-xl border border-[#D5DFDB] text-[#0A1F18] bg-[#F5F8F7] outline-none focus:border-[#0A1F18]"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                disabled={!newClub.name || isPending}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#0A1F18] text-white font-medium disabled:opacity-50 hover:bg-[#1A3529] transition-colors"
              >
                <Save className="h-4 w-4" />
                {isPending ? "Lagrer..." : "Legg til"}
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2.5 rounded-full border border-[#D5DFDB] text-[#324D45] hover:bg-[#F5F8F7] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </PremiumCard>
      )}

      {/* TrackMan import hint */}
      {clubs.length > 0 && clubs.every((c) => !c.avgCarry) && (
        <div className="bg-[#F5F8F7] rounded-xl p-4 text-sm text-[#324D45]">
          <p className="font-medium text-[#0A1F18]">Visste du?</p>
          <p className="mt-1">
            Last opp TrackMan-data for a fa presise gjennomsnitt og spredning
            per klubb automatisk.
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <QuickAction
          href="#"
          icon={Target}
          label="Mal avstander"
          description="Kalibrer dine klubber"
        />
        <QuickAction
          href="#"
          icon={TrendingUp}
          label="Se trend"
          description="Avstandsutvikling"
        />
        <QuickAction
          href="#"
          icon={ChevronRight}
          label="Anbefalinger"
          description="Optimaliser bagen"
        />
      </div>
    </div>
  );
}
