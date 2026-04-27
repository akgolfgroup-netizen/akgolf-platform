"use client";

import { Plus, Save, X } from "lucide-react";
import { useState } from "react";
import { cardStyle } from "./styles";

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

interface Props {
  takenNames: string[];
  pending: boolean;
  onAdd: (data: { name: string; brand?: string; avgCarry?: number }) => void;
  onClose: () => void;
}

export function AddClubForm({ takenNames, pending, onAdd, onClose }: Props) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [avgCarry, setAvgCarry] = useState("");

  const available = DEFAULT_CLUBS.filter((d) => !takenNames.includes(d));

  return (
    <div style={cardStyle} className="mt-6 px-6 py-5 text-white">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-[15px] font-bold tracking-[-0.005em] text-white">
          Logg ny klubb
        </h4>
        <button
          type="button"
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded-lg text-white/65 transition-colors hover:bg-white/5"
          aria-label="Lukk"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2.5">
        <select
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border px-3 py-2.5 text-sm text-white outline-none focus:border-white/30"
          style={{
            background: "rgba(0,0,0,0.20)",
            borderColor: "rgba(255,255,255,0.10)",
          }}
        >
          <option value="">Velg klubb…</option>
          {available.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Merke (valgfritt)"
          className="w-full rounded-xl border px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/30"
          style={{
            background: "rgba(0,0,0,0.20)",
            borderColor: "rgba(255,255,255,0.10)",
          }}
        />
        <input
          type="number"
          value={avgCarry}
          onChange={(e) => setAvgCarry(e.target.value)}
          placeholder="Snitt-carry (m)"
          className="w-full rounded-xl border px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/30"
          style={{
            background: "rgba(0,0,0,0.20)",
            borderColor: "rgba(255,255,255,0.10)",
          }}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              if (!name) return;
              onAdd({
                name,
                brand: brand || undefined,
                avgCarry: avgCarry ? parseFloat(avgCarry) : undefined,
              });
            }}
            disabled={!name || pending}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "#D1F843", color: "#0A1F18" }}
          >
            {pending ? <Plus className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {pending ? "Lagrer…" : "Legg til"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border px-4 py-2.5 text-[13px] font-semibold text-white/75 transition-colors hover:bg-white/5"
            style={{ borderColor: "rgba(255,255,255,0.10)" }}
          >
            Avbryt
          </button>
        </div>
      </div>
    </div>
  );
}
