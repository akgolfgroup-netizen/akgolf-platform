"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import { addClub, deleteClub } from "./actions";
import { useRouter } from "next/navigation";

interface Club {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  loft: number | null;
  avgCarry: number | null;
  avgTotal: number | null;
  avgOffline: number | null;
  shotCount: number;
}

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

export function BagClient({ clubs: initialClubs }: { clubs: Club[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [clubs, setClubs] = useState(initialClubs);
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
      setClubs([...clubs, { ...club, model: null, loft: null, avgTotal: null, avgOffline: null }]);
      setNewClub({ name: "", brand: "", avgCarry: "" });
      setShowAdd(false);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteClub(id);
      setClubs(clubs.filter((c) => c.id !== id));
    });
  }

  // Klubb-gap diagram (enkel visuell)
  const maxCarry = Math.max(...clubs.map((c) => c.avgCarry ?? 0), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1c16]">Min bag</h1>
          <p className="text-[#6b7366] mt-1">{clubs.length} klubber registrert</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#154212] text-white text-sm font-medium hover:bg-[#0d2e0c] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Legg til klubb
        </button>
      </div>

      {/* Klubb-gap oversikt */}
      {clubs.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#c2c9bb]/50 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-[#154212] mb-4">
            Klubb-avstander
          </h2>
          <div className="space-y-2">
            {clubs
              .filter((c) => c.avgCarry)
              .sort((a, b) => (b.avgCarry ?? 0) - (a.avgCarry ?? 0))
              .map((club) => {
                const pct = ((club.avgCarry ?? 0) / maxCarry) * 100;
                return (
                  <div key={club.id} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-[#42493e] w-20 shrink-0 text-right">
                      {club.name}
                    </span>
                    <div className="flex-1 h-6 bg-[#f7f3ea] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#154212] rounded-full flex items-center justify-end pr-2 transition-all"
                        style={{ width: `${pct}%` }}
                      >
                        <span className="text-xs font-bold text-white">
                          {club.avgCarry}m
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Klubbliste */}
      <div className="space-y-3">
        {clubs.map((club) => (
          <div
            key={club.id}
            className="bg-white rounded-xl border border-[#c2c9bb]/50 p-4 flex items-center justify-between shadow-sm"
          >
            <div>
              <div className="font-semibold text-[#1c1c16]">{club.name}</div>
              <div className="text-sm text-[#6b7366]">
                {club.brand && `${club.brand} `}
                {club.model && `${club.model} `}
                {club.loft && `${club.loft}° `}
              </div>
              <div className="text-xs text-[#8a9385] mt-0.5">
                {club.avgCarry ? `${club.avgCarry}m carry` : "Ingen data"}
                {club.avgTotal ? ` / ${club.avgTotal}m total` : ""}
                {club.shotCount > 0 ? ` (${club.shotCount} slag)` : ""}
              </div>
            </div>
            <button
              onClick={() => handleDelete(club.id)}
              className="p-2 rounded-lg text-[#8a9385] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Legg til */}
      {showAdd ? (
        <div className="bg-white rounded-xl border border-[#c2c9bb]/50 p-4 space-y-3 shadow-sm">
          <select
            value={newClub.name}
            onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-[#c2c9bb]/50 text-[#1c1c16] bg-[#f7f3ea] outline-none focus:border-[#154212]"
          >
            <option value="">Velg klubb...</option>
            {DEFAULT_CLUBS.filter((c) => !clubs.some((ec) => ec.name === c)).map((c) => (
              <option key={c} value={c}>{c}</option>
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
            onChange={(e) => setNewClub({ ...newClub, avgCarry: e.target.value })}
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
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[#c2c9bb]/50 text-[#6b7366] hover:border-[#154212] hover:text-[#154212] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Legg til klubb
        </button>
      )}

      {/* TrackMan import hint */}
      {clubs.length > 0 && clubs.every((c) => !c.avgCarry) && (
        <div className="bg-[#f7f3ea] rounded-xl p-4 text-sm text-[#6b7366]">
          <p className="font-medium text-[#1c1c16]">Visste du?</p>
          <p className="mt-1">
            Last opp TrackMan-data for å få presise gjennomsnitt og spredning per klubb automatisk.
          </p>
        </div>
      )}
    </div>
  );
}
