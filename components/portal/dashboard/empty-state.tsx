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
    gradient: "from-gold/20 to-gold/5",
    iconColor: "text-gold",
  },
  training: {
    icon: Target,
    title: "Ingen treningsplan aktiv",
    description: "Fa en personlig treningsplan basert pa dine mal",
    cta: "Opprett plan",
    href: "/portal/treningsplan",
    gradient: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
  },
  stats: {
    icon: BookOpen,
    title: "Ingen statistikk enna",
    description: "Registrer din forste runde for a spore fremgangen",
    cta: "Legg til runde",
    href: "/portal/statistikk/ny-runde",
    gradient: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400",
  },
  achievements: {
    icon: Target,
    title: "Las opp achievements",
    description: "Fullfør daglige oppgaver for a tjene dine forste badges",
    cta: "Se alle achievements",
    href: "/portal/profil#achievements",
    gradient: "from-yellow-500/20 to-yellow-500/5",
    iconColor: "text-yellow-500",
  },
};

export function EmptyState({ type, compact = false }: EmptyStateProps) {
  const config = emptyStates[type];
  const Icon = config.icon;

  if (compact) {
    return (
      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[var(--portal-surface-sunken)] to-transparent border border-[var(--portal-card-border)] border-dashed">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--portal-text-primary)]">{config.title}</p>
            <p className="text-xs text-[var(--portal-text-muted)]">{config.description}</p>
          </div>
        </div>
        <Link
          href={config.href}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gold/10 text-gold hover:bg-gold/20 transition-colors"
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
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      {/* Animated icon with pulse ring */}
      <div className="relative mb-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${config.gradient} blur-xl opacity-50`}
        />
        <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
          <Icon className={`w-8 h-8 ${config.iconColor}`} />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-[var(--portal-text-primary)] mb-2">
        {config.title}
      </h3>
      <p className="text-sm text-[var(--portal-text-muted)] max-w-xs mb-6">
        {config.description}
      </p>

      <Link
        href={config.href}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gold text-white hover:bg-gold/90 transition-colors shadow-lg shadow-gold/20"
      >
        <Plus className="w-4 h-4" />
        {config.cta}
      </Link>
    </motion.div>
  );
}
