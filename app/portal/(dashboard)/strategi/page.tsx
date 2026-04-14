"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Flag,
  Target,
  AlertTriangle,
  Wind,
} from "lucide-react";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { Button } from "@/components/ui/button";

const EASE_APPLE: [number, number, number, number] = [0.4, 0, 0.2, 1];

const COURSES = [
  { id: "c1", name: "Losby GK", location: "Lørenskog" },
  { id: "c2", name: "Miklagard GK", location: "Akershus" },
  { id: "c3", name: "Oslo GK", location: "Oslo" },
];

const HOLES = Array.from({ length: 18 }, (_, i) => ({
  number: i + 1,
  par: [4, 5, 3, 4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 4, 3, 4, 5, 4][i],
  length: [380, 520, 165, 410, 355, 145, 485, 390, 375, 340, 175, 510, 420, 360, 155, 400, 530, 385][i],
  hcpIndex: [7, 3, 15, 1, 11, 17, 5, 9, 13, 8, 18, 2, 4, 10, 16, 6, 12, 14][i],
  strategy: {
    recommendedClub: i % 3 === 0 ? "Driver" : i % 3 === 1 ? "3W" : "7I",
    aimPoint: i % 2 === 0 ? "Høyre kant fairway" : "Midt fairway",
    targetZone: i % 2 === 0 ? "260-280m sone" : "150-170m sone",
    dangerAreas: ["Venstre rough", "Bunker høyre"],
  },
}));

export default function StrategiPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(COURSES[0].id);
  const [selectedHole, setSelectedHole] = useState(1);

  const hole = HOLES[selectedHole - 1];
  const course = COURSES.find((c) => c.id === selectedCourseId) ?? COURSES[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_APPLE }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F18]">DECADE Strategi</h1>
          <p className="text-[#7A8C85] mt-1">Hull-for-hull strategi og pre-shot rutine</p>
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8C85]" />
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="pl-10 pr-10 py-2.5 rounded-lg text-sm bg-white border border-[#D5DFDB] text-[#0A1F18] focus:outline-none focus:ring-2 focus:ring-[#0A1F18]/10 focus:border-[#0A1F18] appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%237A8C85' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
            }}
          >
            {COURSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Hole navigator */}
      <PremiumCard padding="sm" radius="large" noHover>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setSelectedHole((h) => Math.max(1, h - 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F5F8F7] text-sm font-medium text-[#0A1F18] hover:bg-[#ECF0EF] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Forrige
          </button>
          <span className="text-sm font-semibold text-[#0A1F18]">
            Hull {selectedHole} / 18
          </span>
          <button
            onClick={() => setSelectedHole((h) => Math.min(18, h + 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F5F8F7] text-sm font-medium text-[#0A1F18] hover:bg-[#ECF0EF] transition-colors"
          >
            Neste
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {HOLES.map((h) => {
            const isActive = selectedHole === h.number;
            return (
              <button
                key={h.number}
                onClick={() => setSelectedHole(h.number)}
                className={`flex-shrink-0 w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-[#0A1F18] text-white"
                    : "bg-[#F5F8F7] text-[#0A1F18] hover:bg-[#ECF0EF]"
                }`}
              >
                {h.number}
              </button>
            );
          })}
        </div>
      </PremiumCard>

      {/* Hole info + strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hole info */}
        <PremiumCard delay={0.05} padding="md" radius="large">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#0A1F18] text-white flex items-center justify-center text-base font-bold">
              {hole.number}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0A1F18]">{course.name}</p>
              <p className="text-xs text-[#7A8C85]">{course.location}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-[#D5DFDB]/50">
              <span className="text-sm text-[#7A8C85]">Par</span>
              <span className="text-sm font-semibold text-[#0A1F18]">{hole.par}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#D5DFDB]/50">
              <span className="text-sm text-[#7A8C85]">Lengde</span>
              <span className="text-sm font-semibold text-[#0A1F18]">{hole.length}m</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-[#7A8C85]">Hcp-indeks</span>
              <span className="text-sm font-semibold text-[#0A1F18]">{hole.hcpIndex}</span>
            </div>
          </div>
        </PremiumCard>

        {/* DECADE strategy */}
        <PremiumCard delay={0.1} padding="md" radius="large" className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#E8F5EF] flex items-center justify-center">
              <Target className="w-4 h-4 text-[#1A4D36]" />
            </div>
            <h3 className="text-base font-semibold text-[#0A1F18]">DECADE Strategi</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8C85]">
                  Anbefalt klubb
                </p>
                <p className="text-lg font-semibold text-[#0A1F18]">{hole.strategy.recommendedClub}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8C85]">
                  Aimpoint
                </p>
                <p className="text-sm text-[#0A1F18]">{hole.strategy.aimPoint}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8C85]">
                  Mål-sone
                </p>
                <p className="text-sm text-[#0A1F18]">{hole.strategy.targetZone}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8C85] mb-2">
                Fare-områder
              </p>
              <div className="space-y-2">
                {hole.strategy.dangerAreas.map((danger, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FCEAE8] text-[#B84233] text-sm"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {danger}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PremiumCard>
      </div>

      {/* Pre-shot routine + dispersion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PremiumCard delay={0.15} padding="md" radius="large">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#FAF5FF] flex items-center justify-center">
              <Wind className="w-4 h-4 text-[#AF52DE]" />
            </div>
            <h3 className="text-base font-semibold text-[#0A1F18]">Pre-shot rutine</h3>
          </div>
          <ol className="space-y-3 text-sm text-[#0A1F18]">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F5F8F7] text-[#0A1F18] flex items-center justify-center text-xs font-semibold">
                1
              </span>
              <span>Visualiser ball-flight bak ballen</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F5F8F7] text-[#0A1F18] flex items-center justify-center text-xs font-semibold">
                2
              </span>
              <span>Velg target og commit til klubbvalg</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F5F8F7] text-[#0A1F18] flex items-center justify-center text-xs font-semibold">
                3
              </span>
              <span>Gjennomfør pust og trigger</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F5F8F7] text-[#0A1F18] flex items-center justify-center text-xs font-semibold">
                4
              </span>
              <span>Sving fritt — aksepter resultatet</span>
            </li>
          </ol>
        </PremiumCard>

        <PremiumCard delay={0.2} padding="md" radius="large">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
              <Flag className="w-4 h-4 text-[#007AFF]" />
            </div>
            <h3 className="text-base font-semibold text-[#0A1F18]">Dispersion-visualisering</h3>
          </div>
          <div className="relative h-48 bg-[#F5F8F7] rounded-xl overflow-hidden">
            {/* Fairway */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-16 bg-[#E8F5EF] border-x border-[#D5DFDB]" />
            {/* Target line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-[#0A1F18]/20" />
            {/* Dispersion ellipse */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0A1F18]/10 border border-[#0A1F18]/30"
              style={{
                width: 120,
                height: 64,
                borderRadius: "50%",
              }}
            />
            {/* Aimpoint dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#0A1F18]" />
            {/* Labels */}
            <span className="absolute top-2 left-2 text-[10px] text-[#7A8C85]">Venstre rough</span>
            <span className="absolute top-2 right-2 text-[10px] text-[#7A8C85]">Høyre rough</span>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-[#7A8C85]">
              Fairway
            </span>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
