"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  BookOpen,
  BarChart3,
  Trophy,
  Target,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Booking {
  id: string;
  date: Date;
  time: string;
  type: string;
  instructor: string;
  location: string;
}

interface License {
  slug: string;
  name: string;
  status: "active" | "trial" | "expired";
  expiresAt?: Date;
}

interface DashboardStats {
  sessionsThisMonth: number;
  sessionsLastMonth: number;
  handicap: number;
  handicapTrend: "up" | "down" | "stable";
  streakDays: number;
}

interface EliteDashboardHomeProps {
  userName: string;
  nextBooking: Booking | null;
  activeLicenses: License[];
  stats: DashboardStats;
}

export function EliteDashboardHome({
  userName,
  nextBooking,
  activeLicenses,
  stats,
}: EliteDashboardHomeProps) {
  const [expanded, setExpanded] = useState(false);

  const firstName = userName.split(" ")[0];
  const greeting = getGreeting();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-snow)]">
            {greeting}, {firstName}
          </h1>
          <p className="text-sm text-[var(--color-ink-40)] mt-1">
            Her er oversikten din for i dag
          </p>
        </div>

        <Link
          href="/portal/bookinger/ny"
          className="btn-action hidden sm:inline-flex"
        >
          <Sparkles className="w-4 h-4" />
          Book time
        </Link>
      </div>

      {/* Bento Grid */}
      <div className="bento-grid gap-4">
        {/* Next training - Large card */}
        <div className="bento-span-2 bento-row-span-2 bento-card-dark bento-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[var(--color-gold)]" />
            <h2 className="font-semibold text-[var(--color-snow)]">Neste trening</h2>
          </div>

          {nextBooking ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20">
                <p className="text-lg font-semibold text-[var(--color-snow)]">
                  {nextBooking.type}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-[var(--color-ink-40)]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {formatDate(nextBooking.date)} kl. {nextBooking.time}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-[var(--color-ink-40)]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {nextBooking.location}
                  </span>
                </div>
                <p className="mt-3 text-sm text-[var(--color-gold)]">
                  Med {nextBooking.instructor}
                </p>
              </div>

              <Link
                href={`/portal/bookinger/${nextBooking.id}`}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <span className="text-sm font-medium text-[var(--color-snow)]">
                  Se bookingdetaljer
                </span>
                <ChevronRight className="w-4 h-4 text-[var(--color-ink-40)] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--color-ink-70)]/50 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-[var(--color-ink-40)]" />
              </div>
              <p className="text-[var(--color-ink-40)] mb-4">
                Ingen kommende bookinger
              </p>
              <Link
                href="/portal/bookinger/ny"
                className="btn-action"
              >
                Book din første time
              </Link>
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="bento-card-dark bento-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-[var(--color-success)]" />
            <span className="text-xs font-medium text-[var(--color-ink-40)] uppercase tracking-wide">
              Denne måneden
            </span>
          </div>
          <p className="text-3xl font-bold text-[var(--color-snow)]">
            {stats.sessionsThisMonth}
          </p>
          <p className="text-sm text-[var(--color-ink-40)]">
            økter logget
          </p>
          {stats.sessionsThisMonth > stats.sessionsLastMonth && (
            <div className="flex items-center gap-1 mt-2 text-xs text-[var(--color-success)]">
              <TrendingUp className="w-3 h-3" />
              <span>+{stats.sessionsThisMonth - stats.sessionsLastMonth} fra forrige måned</span>
            </div>
          )}
        </div>

        {/* Handicap */}
        <div className="bento-card-dark bento-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-[var(--color-gold)]" />
            <span className="text-xs font-medium text-[var(--color-ink-40)] uppercase tracking-wide">
              Handicap
            </span>
          </div>
          <p className="text-3xl font-bold text-[var(--color-snow)]">
            {stats.handicap.toFixed(1)}
          </p>
          <p className="text-sm text-[var(--color-ink-40)]">
            hcp index
          </p>
          {stats.handicapTrend === "down" && (
            <div className="flex items-center gap-1 mt-2 text-xs text-[var(--color-success)]">
              <TrendingUp className="w-3 h-3 rotate-180" />
              <span>Går riktig vei</span>
            </div>
          )}
        </div>

        {/* Active licenses - Progressive disclosure */}
        <div className="bento-span-2 bento-card-dark bento-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--color-software)]" />
              <h2 className="font-semibold text-[var(--color-snow)]">Aktive lisenser</h2>
            </div>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-[var(--color-success)]/20 text-[var(--color-success)]">
              {activeLicenses.filter((l) => l.status === "active" || l.status === "trial").length} aktive
            </span>
          </div>

          {/* Show first 3 licenses */}
          <div className="space-y-2">
            {activeLicenses.slice(0, expanded ? undefined : 3).map((license) => (
              <div
                key={license.slug}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5"
              >
                <div className="flex items-center gap-3">
                  {license.status === "active" ? (
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
                  ) : license.status === "trial" ? (
                    <Clock className="w-4 h-4 text-[var(--color-warning)]" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-[var(--color-error)]" />
                  )}
                  <span className="text-sm font-medium text-[var(--color-snow)]">
                    {license.name}
                  </span>
                </div>

                {license.status === "trial" && license.expiresAt && (
                  <span className="text-xs text-[var(--color-warning)]">
                    Prøveperiode: {daysUntil(license.expiresAt)} dager igjen
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Progressive disclosure toggle */}
          {activeLicenses.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full mt-3 flex items-center justify-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 transition-colors cursor-pointer"
            >
              {expanded ? "Vis mindre" : `Vis alle (${activeLicenses.length})`}
              <ChevronRight
                className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`}
              />
            </button>
          )}

          {activeLicenses.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-[var(--color-ink-40)] mb-3">
                Du har ingen aktive apper
              </p>
              <Link
                href="/portal/apper"
                className="text-sm font-medium text-[var(--color-gold)] hover:underline cursor-pointer"
              >
                Utforsk apper
              </Link>
            </div>
          )}
        </div>

        {/* Training streak */}
        <div className="bento-card-dark bento-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-[var(--color-gold)]" />
            <span className="text-xs font-medium text-[var(--color-ink-40)] uppercase tracking-wide">
              Treningsstreak
            </span>
          </div>
          <p className="text-3xl font-bold text-[var(--color-snow)]">
            {stats.streakDays}
          </p>
          <p className="text-sm text-[var(--color-ink-40)]">
            dager på rad
          </p>
        </div>

        {/* Quick actions */}
        <div className="bento-card-dark bento-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-[var(--color-junior)]" />
            <span className="text-xs font-medium text-[var(--color-ink-40)] uppercase tracking-wide">
              Hurtigvalg
            </span>
          </div>

          <div className="space-y-2">
            <Link
              href="/portal/dagbok/ny"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-sm text-[var(--color-snow)]"
            >
              <Target className="w-4 h-4 text-[var(--color-success)]" />
              Logg økt
            </Link>
            <Link
              href="/portal/statistikk"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-sm text-[var(--color-snow)]"
            >
              <BarChart3 className="w-4 h-4 text-[var(--color-junior)]" />
              Se statistikk
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="sm:hidden">
        <Link
          href="/portal/bookinger/ny"
          className="btn-action w-full justify-center"
        >
          <Sparkles className="w-4 h-4" />
          Book time
        </Link>
      </div>
    </div>
  );
}

// Helpers
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "God morgen";
  if (hour < 17) return "God dag";
  return "God kveld";
}

function formatDate(date: Date): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "I dag";
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return "I morgen";
  }

  return date.toLocaleDateString("nb-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function daysUntil(date: Date): number {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
