"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Plus, BookOpen, Target, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  type: "bookings" | "training" | "stats" | "achievements";
  compact?: boolean;
}

const emptyStates = {
  bookings: {
    icon: Calendar,
    title: "Ingen kommende timer",
    description: "Book din neste coaching-sesjon for a fortsette utviklingen",
    cta: "Book time",
    href: "/portal/bookinger/ny",
    preview: ["Man 09:00 -- Anders K.", "Ons 14:00 -- TrackMan-okt", "Fre 10:00 -- Banecoaching"],
  },
  training: {
    icon: Target,
    title: "Ingen treningsplan aktiv",
    description: "Fa en personlig treningsplan basert pa dine mal og data",
    cta: "Opprett plan",
    href: "/portal/treningsplan",
    preview: ["Driving range -- 30 min", "Putting drill -- 20 min", "Bunker-ovelse -- 15 min"],
  },
  stats: {
    icon: BookOpen,
    title: "Ingen statistikk enna",
    description: "Registrer din forste runde for a spore Strokes Gained",
    cta: "Legg til runde",
    href: "/portal/statistikk/ny-runde",
    preview: ["OTT: +0.3", "APP: -0.5", "ATG: +0.1"],
  },
  achievements: {
    icon: Target,
    title: "Ingen achievements enna",
    description: "Fullfar daglige oppgaver for a tjene dine forste badges",
    cta: "Se alle achievements",
    href: "/portal/profil#achievements",
    preview: ["Forste okt", "Forste runde", "7-dagers streak"],
  },
};

export function EmptyState({ type, compact = false }: EmptyStateProps) {
  const config = emptyStates[type];
  const Icon = config.icon;

  if (compact) {
    return (
      <div className="flex items-center justify-between p-4 rounded-[14px] bg-grey-50 border border-grey-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
            <Icon className="w-5 h-5 text-grey-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-black">{config.title}</p>
            <p className="text-xs text-grey-400">{config.description}</p>
          </div>
        </div>
        <Link
          href={config.href}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-dark)] transition-colors"
        >
          {config.cta}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[14px] border border-grey-200 bg-white p-6"
    >
      {/* Preview rows -- faded mock data */}
      <div className="mb-6 space-y-2 opacity-30">
        {config.preview.map((row) => (
          <div key={row} className="flex items-center gap-3 px-3 py-2 bg-grey-50 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-grey-300" />
            <span className="text-xs text-grey-400">{row}</span>
          </div>
        ))}
      </div>

      <div className="text-center">
        <h3 className="text-base font-semibold text-black mb-1">
          {config.title}
        </h3>
        <p className="text-sm text-grey-400 max-w-xs mx-auto mb-4">
          {config.description}
        </p>

        <Link
          href={config.href}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[980px] text-sm font-semibold bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-dark)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          {config.cta}
        </Link>
      </div>
    </motion.div>
  );
}
