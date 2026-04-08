"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Target, TrendingUp, ChevronRight } from "lucide-react";
import { QuickAction } from "@/components/portal/heritage/quick-action";

// Mock bag data
const mockClubs = [
  { id: "1", type: "Driver", brand: "TaylorMade", model: "Stealth 2", loft: "10.5°", avgCarry: 245, avgTotal: 265, consistency: 82 },
  { id: "2", type: "3-wood", brand: "Titleist", model: "TSR2", loft: "15°", avgCarry: 220, avgTotal: 235, consistency: 78 },
  { id: "3", type: "5-wood", brand: "Titleist", model: "TSR2", loft: "18°", avgCarry: 205, avgTotal: 218, consistency: 75 },
  { id: "4", type: "4-jern", brand: "Callaway", model: "Paradym", loft: "21°", avgCarry: 185, avgTotal: 195, consistency: 85 },
  { id: "5", type: "5-jern", brand: "Callaway", model: "Paradym", loft: "24°", avgCarry: 175, avgTotal: 185, consistency: 88 },
  { id: "6", type: "6-jern", brand: "Callaway", model: "Paradym", loft: "27°", avgCarry: 165, avgTotal: 175, consistency: 87 },
  { id: "7", type: "7-jern", brand: "Callaway", model: "Paradym", loft: "30°", avgCarry: 155, avgTotal: 165, consistency: 90 },
  { id: "8", type: "8-jern", brand: "Callaway", model: "Paradym", loft: "34°", avgCarry: 145, avgTotal: 155, consistency: 89 },
  { id: "9", type: "9-jern", brand: "Callaway", model: "Paradym", loft: "38°", avgCarry: 135, avgTotal: 145, consistency: 91 },
  { id: "10", type: "PW", brand: "Callaway", model: "Paradym", loft: "42°", avgCarry: 125, avgTotal: 132, consistency: 92 },
  { id: "11", type: "GW", brand: "Callaway", model: "Jaws", loft: "50°", avgCarry: 105, avgTotal: 110, consistency: 88 },
  { id: "12", type: "SW", brand: "Callaway", model: "Jaws", loft: "54°", avgCarry: 90, avgTotal: 95, consistency: 85 },
  { id: "13", type: "LW", brand: "Callaway", model: "Jaws", loft: "58°", avgCarry: 75, avgTotal: 80, consistency: 82 },
  { id: "14", type: "Putter", brand: "Scotty Cameron", model: "Newport 2", loft: "3°", avgCarry: 0, avgTotal: 0, consistency: 95 },
];

const gapAnalysis = [
  { between: "Driver - 3-wood", gap: 25, recommended: "Justert loft" },
  { between: "PW - GW", gap: 20, recommended: "Legg til klubb" },
  { between: "GW - SW", gap: 15, recommended: "OK" },
];

export default function BagPage() {
  const [selectedClub, setSelectedClub] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1c16]">Min bag</h1>
          <p className="text-[#6b7366] mt-1">{mockClubs.length} klubber registrert</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#154212] text-white text-sm font-medium hover:bg-[#0d2e0c] transition-colors">
          <Plus className="w-4 h-4" />
          Legg til klubb
        </button>
      </div>

      {/* Bag Visualization */}
      <div className="bg-gradient-to-br from-[#154212] to-[#0d2e0c] rounded-3xl p-6 lg:p-8">
        <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-14 gap-2">
          {mockClubs.map((club, index) => (
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
              <span className="text-[10px] uppercase tracking-wider opacity-70">{club.type}</span>
              <span className="text-lg font-bold">{club.loft.replace("°", "")}°</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected Club Detail */}
      {selectedClub && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-[#c2c9bb]/50"
        >
          {(() => {
            const club = mockClubs.find((c) => c.id === selectedClub)!;
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#f7f3ea] flex items-center justify-center">
                      <Target className="w-8 h-8 text-[#154212]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#1c1c16]">{club.type}</h3>
                      <p className="text-[#6b7366]">
                        {club.brand} {club.model}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#f7f3ea] text-sm text-[#6b7366] hover:bg-[#e8e4db] transition-colors">
                      <Edit2 className="w-3 h-3" />
                      Rediger
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#fef2f2] text-sm text-[#ef4444] hover:bg-[#fee2e2] transition-colors">
                      <Trash2 className="w-3 h-3" />
                      Fjern
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#f7f3ea]">
                    <p className="text-xs text-[#8a9385] uppercase tracking-wider">Carry</p>
                    <p className="text-2xl font-bold text-[#1c1c16]">{club.avgCarry}m</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#f7f3ea]">
                    <p className="text-xs text-[#8a9385] uppercase tracking-wider">Total</p>
                    <p className="text-2xl font-bold text-[#1c1c16]">{club.avgTotal}m</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#f7f3ea]">
                    <p className="text-xs text-[#8a9385] uppercase tracking-wider">Konsistens</p>
                    <p className="text-2xl font-bold text-[#154212]">{club.consistency}%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#f7f3ea]">
                    <p className="text-xs text-[#8a9385] uppercase tracking-wider">Loft</p>
                    <p className="text-2xl font-bold text-[#1c1c16]">{club.loft}</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* Distance Chart */}
      <div className="bg-white rounded-2xl p-6 border border-[#c2c9bb]/50">
        <h3 className="font-semibold text-[#1c1c16] mb-4">Avstandsoversikt</h3>
        <div className="space-y-3">
          {mockClubs
            .filter((c) => c.avgCarry > 0)
            .map((club) => (
              <div key={club.id} className="flex items-center gap-4">
                <span className="w-16 text-sm font-medium text-[#1c1c16]">{club.type}</span>
                <div className="flex-1 h-6 bg-[#f7f3ea] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#154212] rounded-full transition-all duration-500"
                    style={{ width: `${(club.avgCarry / 250) * 100}%` }}
                  />
                </div>
                <span className="w-16 text-sm text-right text-[#6b7366]">{club.avgCarry}m</span>
              </div>
            ))}
        </div>
      </div>

      {/* Gap Analysis */}
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
              <p className="text-xs text-[#6b7366] mt-1">{gap.recommended}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <QuickAction href="#" icon={Target} label="Mål avstander" description="Kalibrer dine klubber" />
        <QuickAction href="#" icon={TrendingUp} label="Se trend" description="Avstandsutvikling" />
        <QuickAction href="#" icon={ChevronRight} label="Anbefalinger" description="Optimaliser bagen" />
      </div>
    </div>
  );
}
