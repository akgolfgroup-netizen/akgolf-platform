"use server";

/**
 * Hub-oversikt server actions.
 *
 * Henter aggregat-data for `/admin/hub`-siden:
 *  - 4 hub-stats (aktive spillere, ukens okter, belegg, MTD inntekt)
 *  - 8 modul-tellere (Dagens fokus i dag, godkjenninger ventende, etc.)
 *  - Aktivitet-feed siste 24 timer (siste hendelser)
 *
 * Alle queries bruker Supabase service-client der vi trenger a omga RLS,
 * eller Prisma der det er enklere.
 */

import { prisma } from "@/lib/portal/prisma";
import { startOfWeek, endOfWeek, startOfMonth } from "date-fns";

export interface HubStats {
  activeStudents: number;
  weeklySessionsCount: number;
  utilizationPct: number;
  mtdRevenueK: number;
}

export interface HubModuleCounts {
  todaysFocusCount: number;
  pendingApprovals: number;
  unreadMessages: number;
  activeStudents: number;
}

export interface HubActivityItem {
  id: string;
  icon:
    | "trending-down"
    | "alert-circle"
    | "check-circle"
    | "rotate-ccw"
    | "user-plus"
    | "dollar-sign";
  tone: "green" | "amber" | "purple" | "neutral";
  body: string;
  bodyHighlight?: string;
  when: string;
}

export async function getHubStats(): Promise<HubStats> {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);

  const [activeStudents, weeklyBookings, monthRevenue] = await Promise.all([
    prisma.user.count({
      where: { role: "STUDENT", isActive: true },
    }),
    prisma.booking.count({
      where: {
        startTime: { gte: weekStart, lte: weekEnd },
        status: { in: ["CONFIRMED", "COMPLETED"] },
      },
    }),
    prisma.paymentTransaction.aggregate({
      where: {
        createdAt: { gte: monthStart },
        status: "PAID",
      },
      _sum: { grossAmount: true },
    }),
  ]);

  // Belegg = aktive bookinger / kapasitet (estimert som 35 okter/uke som baseline)
  const weeklyCapacity = 35;
  const utilizationPct = Math.min(
    100,
    Math.round((weeklyBookings / weeklyCapacity) * 100),
  );

  return {
    activeStudents,
    weeklySessionsCount: weeklyBookings,
    utilizationPct,
    mtdRevenueK: Math.round((monthRevenue._sum.grossAmount ?? 0) / 1000),
  };
}

export async function getHubModuleCounts(): Promise<HubModuleCounts> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [todaysFocusCount, pendingApprovals, activeStudents] =
    await Promise.all([
      prisma.booking.count({
        where: {
          startTime: { gte: today, lt: tomorrow },
          status: { in: ["CONFIRMED", "PENDING"] },
        },
      }),
      prisma.booking.count({
        where: { status: "PENDING" },
      }),
      prisma.user.count({
        where: { role: "STUDENT", isActive: true },
      }),
    ]);

  // Uleste meldinger — bruk MessageThread/Notification om relevant.
  // Foreløpig 0 (kobles til Notification-system senere).
  const unreadMessages = 0;

  return {
    todaysFocusCount,
    pendingApprovals,
    unreadMessages,
    activeStudents,
  };
}

/**
 * Aktivitet siste 24 timer — aggregat fra flere kilder:
 * - AgentLog (ny PB, varsler, automatiske aksjoner)
 * - Booking-events (avbestillinger, refusjoner)
 * - PaymentTransaction (betalinger, refusjoner)
 * - User-opprettelser (nye spillere)
 *
 * Foreløpig: returnerer placeholder med 6 representative hendelser.
 * Wires til real data i senere sprint nar AgentLog-pipeline er ferdig.
 */
export async function getHubActivity(): Promise<HubActivityItem[]> {
  // Placeholder — strukturen matcher mockup'en. Reelle data kobles via
  // AgentLog + Booking-events i Sprint 4-rest.
  return [
    {
      id: "act-1",
      icon: "trending-down",
      tone: "green",
      bodyHighlight: "Sofie Aas",
      body: " — HCP 8.1 → 7.7 etter helgen pa Bogstad. Ny PB! Trening sitter.",
      when: "2 t SIDEN",
    },
    {
      id: "act-2",
      icon: "alert-circle",
      tone: "amber",
      bodyHighlight: "Foreldre Hansen",
      body: " — ber om a flytte tor 9. mai til man 12. mai 16:30 (skoletur). Foreslatt tid sendt — venter pa bekreftelse.",
      when: "3 t SIDEN",
    },
    {
      id: "act-3",
      icon: "check-circle",
      tone: "green",
      bodyHighlight: "Anders Kristiansen",
      body: " · Trackman re-test fullfort. Driver +2 mph club speed, spin-axis +12° → +8.4° — alignment-arbeidet sitter.",
      when: "I GAR 14:30",
    },
    {
      id: "act-4",
      icon: "rotate-ccw",
      tone: "purple",
      bodyHighlight: "Refusjon",
      body: " · Per Rasmussen, NOK 1 200 prosessert via Stripe (booking 25. apr). Kunden er notifisert.",
      when: "I GAR 09:00",
    },
    {
      id: "act-5",
      icon: "user-plus",
      tone: "neutral",
      bodyHighlight: "Ny spiller",
      body: " · Lina Holm registrert · Junior Mid · invitert til kohort onsdager 17:00.",
      when: "I GAR 16:42",
    },
    {
      id: "act-6",
      icon: "dollar-sign",
      tone: "green",
      bodyHighlight: "12 fakturaer",
      body: " for april sendt automatisk · 142 000 kr · 4 ute (forventet betaling innen 7 dager)",
      when: "2 D SIDEN",
    },
  ];
}
