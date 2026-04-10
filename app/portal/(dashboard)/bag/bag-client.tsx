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
          <h1 className="text-2xl font-bold text-[#1c1c16]">Min bag</h1>
          <p className="text-[#6b7366] mt-1">
            {clubs.length > 0
              ? `${clubs.length} klubber registrert`
              : "Ingen klubber registrert enda"}
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#154212] text-white text-sm font-medium hover:bg-[#0d2e0c] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Legg til klubb
        </button>
      </div>

      {/* Empty State */}
      {clubs.length === 0 && !showAdd && (
        <div className="bg-white rounded-2xl p-12 border border-[#c2c9bb]/50 text-center">
          <Target className="w-12 h-12 text-[#c2c9bb] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1c1c16] mb-2">
            Ingen klubber i bagen
          </h3>
          <p className="text-[#6b7366] max-w-md mx-auto">
            Legg til klubbene dine for a fa oversikt over avstander, gap-analyse
            og anbefalinger.
          </p>
        </div>
      )}

      {/* Bag Visualization */}
      {clubs.length > 0 && (
        <div className="bg-gradient-to-br from-[#154212] to-[#0d2e0c] rounded-3xl p-6 lg:p-8">
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
                    ? "bg-[#d2f000] text-[#1c1c16]"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider opacity-70">
                  {club.name}
                </span>
                <span className="text-lg font-bold">
                  {club.loft != null ? `${club.loft}` : "--"}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Club Detail */}
      {selectedClub &&
        (() => {
          const club = clubs.find((c) => c.id === selectedClub);
          if (!club) return null;
          return (
            <motion.div
              key={selectedClub}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-[#c2c9bb]/50"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#f7f3ea] flex items-center justify-center">
                      <Target className="w-8 h-8 text-[#154212]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#1c1c16]">
                        {club.name}
                      </h3>
                      <p className="text-[#6b7366]">
                        {[club.brand, club.model].filter(Boolean).join(" ") ||
                          "Ikke spesifisert"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#f7f3ea] text-sm text-[#6b7366] hover:bg-[#e8e4db] transition-colors">
                      <Edit2 className="w-3 h-3" />
                      Rediger
                    </button>
                    <button
                      onClick={() => handleDelete(club.id)}
                      disabled={isPending}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#fef2f2] text-sm text-[#ef4444] hover:bg-[#fee2e2] transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      Fjern
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#f7f3ea]">
                    <p className="text-xs text-[#8a9385] uppercase tracking-wider">
                      Carry
                    </p>
                    <p className="text-2xl font-bold text-[#1c1c16]">
                      {club.avgCarry != null ? `${club.avgCarry}m` : "--"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#f7f3ea]">
                    <p className="text-xs text-[#8a9385] uppercase tracking-wider">
                      Total
                    </p>
                    <p className="text-2xl font-bold text-[#1c1c16]">
                      {club.avgTotal != null ? `${club.avgTotal}m` : "--"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#f7f3ea]">
                    <p className="text-xs text-[#8a9385] uppercase tracking-wider">
                      Slag
                    </p>
                    <p className="text-2xl font-bold text-[#154212]">
                      {club.shotCount}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#f7f3ea]">
                    <p className="text-xs text-[#8a9385] uppercase tracking-wider">
                      Loft
                    </p>
                    <p className="text-2xl font-bold text-[#1c1c16]">
                      {club.loft != null ? `${club.loft}` : "--"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })()}

      {/* Distance Chart */}
      {clubs.some((c) => (c.avgCarry ?? 0) > 0) && (
        <div className="bg-white rounded-2xl p-6 border border-[#c2c9bb]/50">
          <h3 className="font-semibold text-[#1c1c16] mb-4">
            Avstandsoversikt
          </h3>
          <div className="space-y-3">
            {clubs
              .filter((c) => (c.avgCarry ?? 0) > 0)
              .sort((a, b) => (b.avgCarry ?? 0) - (a.avgCarry ?? 0))
              .map((club) => (
                <div key={club.id} className="flex items-center gap-4">
                  <span className="w-16 text-sm font-medium text-[#1c1c16]">
                    {club.name}
                  </span>
                  <div className="flex-1 h-6 bg-[#f7f3ea] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#154212] rounded-full transition-all duration-500"
                      style={{
                        width: `${((club.avgCarry ?? 0) / maxCarry) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-16 text-sm text-right text-[#6b7366]">
                    {club.avgCarry}m
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Gap Analysis */}
      {gapAnalysis.length > 0 && (
        <div className="bg-[#fefce8] rounded-2xl p-6 border border-[#d2f000]/30">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#854d0e]" />
            <h3 className="font-semibold text-[#854d0e]">Gap-analyse</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {gapAnalysis.map((gap) => (
              <div key={gap.between} className="p-4 rounded-xl bg-white/50">
                <p className="text-xs text-[#8a9385] mb-1">{gap.between}</p>
                <p className="text-2xl font-bold text-[#1c1c16]">{gap.gap}m</p>
                <p className="text-xs text-[#6b7366] mt-1">
                  {gap.recommended}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Club Form */}
      {showAdd && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-[#c2c9bb]/50 p-4 space-y-3 shadow-sm"
        >
          <select
            value={newClub.name}
            onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-[#c2c9bb]/50 text-[#1c1c16] bg-[#f7f3ea] outline-none focus:border-[#154212]"
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
            className="w-full px-3 py-2.5 rounded-xl border border-[#c2c9bb]/50 text-[#1c1c16] bg-[#f7f3ea] outline-none focus:border-[#154212]"
          />
          <input
            type="number"
            value={newClub.avgCarry}
            onChange={(e) =>
              setNewClub({ ...newClub, avgCarry: e.target.value })
            }
            placeholder="Gjennomsnittlig carry (meter)"
            className="w-full px-3 py-2.5 rounded-xl border border-[#c2c9bb]/50 text-[#1c1c16] bg-[#f7f3ea] outline-none focus:border-[#154212]"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!newClub.name || isPending}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#154212] text-white font-medium disabled:opacity-50 hover:bg-[#0d2e0c] transition-colors"
            >
              <Save className="h-4 w-4" />
              {isPending ? "Lagrer..." : "Legg til"}
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2.5 rounded-xl border border-[#c2c9bb]/50 text-[#6b7366] hover:bg-[#f7f3ea] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* TrackMan import hint */}
      {clubs.length > 0 && clubs.every((c) => !c.avgCarry) && (
        <div className="bg-[#f7f3ea] rounded-xl p-4 text-sm text-[#6b7366]">
          <p className="font-medium text-[#1c1c16]">Visste du?</p>
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
