"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Minus, Plus, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";

const LIE_OPTIONS = [
  { value: "tee", label: "Tee" },
  { value: "fairway", label: "Fairway" },
  { value: "semi-rough", label: "Semi-rough" },
  { value: "rough", label: "Rough" },
  { value: "fairway-bunker", label: "Fairway-bunker" },
  { value: "greenside-bunker", label: "Greenside-bunker" },
  { value: "green", label: "Green" },
  { value: "recovery", label: "Recovery" },
];

interface ShotFormProps {
  clubs: string[];
  defaultFromLie: string;
  defaultFromDistance: number;
  onSubmit: (data: {
    club: string;
    fromLie: string;
    fromDistance: number;
    toLie: string;
    toDistance: number;
  }) => void;
  isPending: boolean;
}

export function ShotForm({
  clubs,
  defaultFromLie,
  defaultFromDistance,
  onSubmit,
  isPending,
}: ShotFormProps) {
  const [club, setClub] = useState(clubs[0] ?? "Driver");
  const [fromLie, setFromLie] = useState(defaultFromLie);
  const [fromDistance, setFromDistance] = useState(defaultFromDistance);
  const [toLie, setToLie] = useState("fairway");
  const [toDistance, setToDistance] = useState(120);

  const adjustedFromDistance = fromDistance === defaultFromDistance ? defaultFromDistance : fromDistance;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      club,
      fromLie,
      fromDistance: adjustedFromDistance,
      toLie,
      toDistance,
    });
    // Reset for neste slag — forrige "to" blir ny "from"
    setFromLie(toLie);
    setFromDistance(toDistance);
    setToLie("fairway");
    setToDistance(Math.round(toDistance * 0.6));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Kolle + Lie rad */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-on-surface-variant mb-1.5 block">
            Kolle
          </label>
          <div className="relative">
            <select
              value={club}
              onChange={(e) => setClub(e.target.value)}
              className="w-full appearance-none px-3 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {clubs.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-on-surface-variant mb-1.5 block">
            Lie
          </label>
          <div className="relative">
            <select
              value={fromLie}
              onChange={(e) => setFromLie(e.target.value)}
              className="w-full appearance-none px-3 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {LIE_OPTIONS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Distanse til hull */}
      <div>
        <label className="text-xs font-medium text-on-surface-variant mb-1.5 block">
          Distanse til hull
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFromDistance(Math.max(1, fromDistance - 5))}
            className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center hover:bg-surface-variant transition-colors"
            aria-label="Minsk distanse"
          >
            <Minus className="w-4 h-4 text-on-surface-variant" />
          </button>
          <div className="flex-1 relative">
            <input
              type="number"
              value={fromDistance}
              onChange={(e) => setFromDistance(Number(e.target.value))}
              min={1}
              max={600}
              className="w-full px-3 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-on-surface text-center text-lg font-semibold font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant">
              m
            </span>
          </div>
          <button
            type="button"
            onClick={() => setFromDistance(fromDistance + 5)}
            className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center hover:bg-surface-variant transition-colors"
            aria-label="Øk distanse"
          >
            <Plus className="w-4 h-4 text-on-surface-variant" />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-surface-variant" />

      {/* Etter slaget */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-on-surface-variant">
          Etter slaget
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-on-surface-variant/70 mb-1 block">
              Ny lie
            </label>
            <div className="relative">
              <select
                value={toLie}
                onChange={(e) => setToLie(e.target.value)}
                className="w-full appearance-none px-3 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {LIE_OPTIONS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs text-on-surface-variant/70 mb-1 block">
              Distanse til hull
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setToDistance(Math.max(0, toDistance - 5))}
                className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center hover:bg-surface-variant"
                aria-label="Minsk distanse"
              >
                <Minus className="w-3.5 h-3.5 text-on-surface-variant" />
              </button>
              <input
                type="number"
                value={toDistance}
                onChange={(e) => setToDistance(Number(e.target.value))}
                min={0}
                max={600}
                className="flex-1 px-2 py-2.5 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-on-surface text-center text-sm font-semibold font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setToDistance(toDistance + 5)}
                className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center hover:bg-surface-variant"
                aria-label="Øk distanse"
              >
                <Plus className="w-3.5 h-3.5 text-on-surface-variant" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logg slag */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={isPending}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg transition-all",
          "bg-accent text-ink shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <Crosshair className="w-5 h-5" />
        {isPending ? "Lagrer..." : "Logg slag"}
      </motion.button>
    </form>
  );
}
