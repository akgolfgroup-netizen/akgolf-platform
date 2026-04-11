"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Trophy, ChevronRight, Play, CheckCircle2, Lock } from "lucide-react";
import { QuickAction } from "@/components/portal/heritage/quick-action";

// Mock data for DECADE tests
const mockTests = [
  { id: 1, name: " putting-lag test", description: "Test din evne til å plassere putter fra forskjellige avstander", unit: "prosent", comparison: "higher", bestResult: 78, target: 70, category: "Putting" },
  { id: 2, name: "Chip-presse", description: "Hvor mange chips kan du få innenfor 1 meter under press?", unit: "poeng", comparison: "higher", bestResult: 45, target: 40, category: "Nærspill" },
  { id: 3, name: "Driver-presisjon", description: "Treff fairway under ulike forhold", unit: "prosent", comparison: "higher", bestResult: 65, target: 60, category: "Tee" },
  { id: 4, name: "Approach-kontroll", description: "Nøyaktighet med jernslag til green", unit: "prosent", comparison: "higher", bestResult: 52, target: 50, category: "Approach" },
  { id: 5, name: "Bunker-redning", description: "Prosentandel opp-og-ned fra bunker", unit: "prosent", comparison: "higher", bestResult: 42, target: 35, category: "Bunker" },
  { id: 6, name: "Mental styrke", description: "Prestasjon under simulert press", unit: "poeng", comparison: "higher", bestResult: null, target: 80, category: "Mental", locked: true },
];

const leaderboard = [
  { rank: 1, name: "Thomas Petersen", score: 425, avatar: "TP" },
  { rank: 2, name: "Mari Olsen", score: 398, avatar: "MO" },
  { rank: 3, name: "Anders Kristiansen", score: 385, avatar: "AK" },
  { rank: 4, name: "Sofia Larsen", score: 372, avatar: "SL" },
  { rank: 5, name: "Erik Johansen", score: 365, avatar: "EJ" },
];

export default function TesterPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(mockTests.map((t) => t.category))];
  const filteredTests = selectedCategory
    ? mockTests.filter((t) => t.category === selectedCategory)
    : mockTests;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">DECADE Tester</h1>
        <p className="text-[var(--color-grey-500)] mt-1">Standardiserte tester for å måle fremgang</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[var(--color-grey-200)]/70">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-grey-500)]">Fullførte tester</p>
          <p className="text-3xl font-bold text-[var(--color-grey-900)] mt-1">5/6</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[var(--color-grey-200)]/70">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-grey-500)]">Total score</p>
          <p className="text-3xl font-bold text-[var(--color-grey-900)] mt-1">385</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[var(--color-grey-200)]/70">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-grey-500)]">Ranking</p>
          <p className="text-3xl font-bold text-[var(--color-grey-900)] mt-1">#3</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[var(--color-grey-200)]/70">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-grey-500)]">Beste test</p>
          <p className="text-3xl font-bold text-[var(--color-grey-900)] mt-1">Putting</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === null
              ? "bg-[var(--color-primary)] text-white"
              : "bg-white text-[var(--color-grey-500)] border border-[var(--color-grey-200)]/70 hover:bg-[var(--color-grey-100)]"
          }`}
        >
          Alle
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white text-[var(--color-grey-500)] border border-[var(--color-grey-200)]/70 hover:bg-[var(--color-grey-100)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTests.map((test, index) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-2xl p-5 border transition-all ${
              test.locked
                ? "border-[var(--color-grey-200)]/50 opacity-60"
                : "border-[var(--color-grey-200)]/70 hover:shadow-md cursor-pointer"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[var(--color-grey-400)] uppercase tracking-wider">
                    {test.category}
                  </span>
                  {test.locked && <Lock className="w-3 h-3 text-[var(--color-grey-400)]" />}
                </div>
                <h3 className="font-semibold text-[var(--color-grey-900)]">{test.name}</h3>
                <p className="text-sm text-[var(--color-grey-500)] mt-1">{test.description}</p>

                {test.bestResult && !test.locked && (
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-[var(--color-warning)]" />
                      <span className="text-sm font-semibold text-[var(--color-grey-900)]">
                        {test.bestResult} {test.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-[var(--color-primary)]" />
                      <span className="text-sm text-[var(--color-grey-500)]">Mål: {test.target}</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                disabled={test.locked}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  test.locked
                    ? "bg-[var(--color-grey-100)] text-[var(--color-grey-300)]"
                    : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-alt)]"
                }`}
              >
                {test.bestResult ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl p-6 border border-[var(--color-grey-200)]/70">
        <h3 className="font-semibold text-[var(--color-grey-900)] mb-4">Toppliste</h3>
        <div className="space-y-3">
          {leaderboard.map((player, index) => (
            <div
              key={player.name}
              className={`flex items-center gap-4 p-3 rounded-xl ${
                player.name === "Anders Kristiansen" ? "bg-[var(--color-accent-cta)]/15 border border-[var(--color-accent-cta)]/40" : "bg-[var(--color-grey-100)]"
              }`}
            >
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                  index === 0
                    ? "bg-[var(--color-warning)] text-white"
                    : index === 1
                    ? "bg-[var(--color-grey-400)] text-white"
                    : index === 2
                    ? "bg-[var(--color-grey-600)] text-white"
                    : "bg-white text-[var(--color-grey-500)]"
                }`}
              >
                {player.rank}
              </span>
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-sm font-bold">
                {player.avatar}
              </div>
              <div className="flex-1">
                <p className="font-medium text-[var(--color-grey-900)]">
                  {player.name}
                  {player.name === "Anders Kristiansen" && (
                    <span className="ml-2 text-xs text-[var(--color-primary)]">(Deg)</span>
                  )}
                </p>
              </div>
              <p className="font-bold text-[var(--color-grey-900)]">{player.score} poeng</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
