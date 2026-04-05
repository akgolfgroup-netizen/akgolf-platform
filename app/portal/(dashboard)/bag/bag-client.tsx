"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { addClub, updateClub, deleteClub } from "./actions";
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
  const [editingId, setEditingId] = useState<string | null>(null);
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
    <div className="space-y-4">
      {/* Klubb-gap oversikt */}
      {clubs.length > 0 && (
        <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-6">
          <h2 className="text-sm font-semibold text-[var(--color-grey-700)] mb-4">
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
                    <span className="text-xs font-medium text-[var(--color-grey-600)] w-20 shrink-0 text-right">
                      {club.name}
                    </span>
                    <div className="flex-1 h-6 bg-[var(--color-grey-100)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-brand)] rounded-full flex items-center justify-end pr-2 transition-all"
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
      <div className="space-y-2">
        {clubs.map((club) => (
          <div
            key={club.id}
            className="bg-white rounded-xl border border-[var(--color-grey-200)] p-4 flex items-center justify-between"
          >
            <div>
              <div className="font-semibold text-[var(--color-grey-900)]">{club.name}</div>
              <div className="text-sm text-[var(--color-grey-500)]">
                {club.brand && `${club.brand} `}
                {club.model && `${club.model} `}
                {club.loft && `${club.loft}° `}
              </div>
              <div className="text-xs text-[var(--color-grey-400)] mt-0.5">
                {club.avgCarry ? `${club.avgCarry}m carry` : "Ingen data"}
                {club.avgTotal ? ` / ${club.avgTotal}m total` : ""}
                {club.shotCount > 0 ? ` (${club.shotCount} slag)` : ""}
              </div>
            </div>
            <button
              onClick={() => handleDelete(club.id)}
              className="p-2 rounded-lg text-[var(--color-grey-400)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Legg til */}
      {showAdd ? (
        <div className="bg-white rounded-xl border border-[var(--color-grey-200)] p-4 space-y-3">
          <select
            value={newClub.name}
            onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-grey-200)] text-[var(--color-grey-900)] bg-white"
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
            className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-grey-200)] text-[var(--color-grey-900)]"
          />
          <input
            type="number"
            value={newClub.avgCarry}
            onChange={(e) => setNewClub({ ...newClub, avgCarry: e.target.value })}
            placeholder="Gjennomsnittlig carry (meter)"
            className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-grey-200)] text-[var(--color-grey-900)]"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!newClub.name || isPending}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--color-brand)] text-white font-medium disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isPending ? "Lagrer..." : "Legg til"}
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2.5 rounded-xl border border-[var(--color-grey-200)] text-[var(--color-grey-600)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[var(--color-grey-200)] text-[var(--color-grey-500)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Legg til klubb
        </button>
      )}

      {/* TrackMan import hint */}
      {clubs.length > 0 && clubs.every((c) => !c.avgCarry) && (
        <div className="bg-[var(--color-grey-100)] rounded-xl p-4 text-sm text-[var(--color-grey-600)]">
          <p className="font-medium">Visste du?</p>
          <p className="mt-1">
            Last opp TrackMan-data for a fa presise gjennomsnitt og spredning per klubb automatisk.
          </p>
        </div>
      )}
    </div>
  );
}
