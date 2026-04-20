"use client";


import { Icon } from "@/components/ui/icon";
import { motion } from "framer-motion";
import { Target, Disc, Flame } from "lucide-react";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const EASE_APPLE: [number, number, number, number] = [0.4, 0, 0.2, 1];

const GAMES = [
  {
    id: "naerspill",
    title: "Nærspill",
    description: "Chip, pitch og bunker-utfordringer med målrettet trening.",
    icon: Target,
    color: "#007AFF",
    bg: "#EFF6FF",
  },
  {
    id: "putting",
    title: "Putting",
    description: "Lags-putting, distance-kontroll og green-reading.",
    icon: Disc,
    color: "#1A4D36",
    bg: "#E8F5EF",
  },
  {
    id: "press",
    title: "Press",
    description: "Simuler press-situasjoner med PR1–PR5 nivåer.",
    icon: Flame,
    color: "#C48A32",
    bg: "#FDF4E4",
  },
];

export default function SpillModulPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_APPLE }}
      >
        <h1 className="text-2xl font-bold text-on-surface">Spill-modul</h1>
        <p className="text-on-surface-variant mt-1">Treningspill for nærspill, putting og press</p>
      </motion.div>

      {/* Game cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GAMES.map((game, idx) => (
          <PremiumCard
            key={game.id}
            delay={idx * 0.1}
            padding="lg"
            radius="large"
            hover="scale"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: game.bg }}
            >
              <game.icon className="w-6 h-6" style={{ color: game.color }} />
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-1">{game.title}</h3>
            <p className="text-sm text-on-surface-variant mb-6">{game.description}</p>
            <Button variant="primary" className="w-full" asChild>
              <Link href={`/portal/spill/${game.id}`}>
                Start spill
                <Icon name="arrow_forward" className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </PremiumCard>
        ))}
      </div>

      {/* Recent sessions summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: EASE_APPLE }}
      >
        <h3 className="text-sm font-semibold text-on-surface mb-4">Siste økter</h3>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30/50 overflow-hidden">
          <div className="p-4 text-sm text-on-surface-variant">Ingen spilløkter registrert ennå.</div>
        </div>
      </motion.div>
    </div>
  );
}
