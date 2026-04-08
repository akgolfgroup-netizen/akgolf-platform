import "dotenv/config";
import { randomUUID } from "crypto";
import { prisma } from "../lib/portal/prisma";
import { ServiceCategory } from "@prisma/client";

/**
 * Oppdaterer ServiceType-tabellen med produkter fra AK Golf Academy 2026 konsept.
 *
 * Oppdatert: 2026-04-07
 *
 * KJERNETJENESTER (7 stk + onboarding + portal):
 * 
 * Onboarding:
 * - AK Start: 3 000 kr, 3×20 min over 3 uker + 30d portal
 * - Foundation Test: 995 kr, 50 min intro (refunderbar ved abo-kjøp)
 *
 * Abonnement (Stripe):
 * - Performance Pro: 2 000 kr/mnd, 4×20 min
 * - Performance: 1 600 kr/mnd, 2×20 min
 * - Spillerportal: 299 kr/mnd (kun tilgang til portalen, ingen coaching)
 *
 * Drop-in/Flex (48t booking-vindu):
 * - Flex 50 Solo: 1 500 kr, 50 min
 * - Flex 50 Duo: 1 700 kr (850×2), 50 min
 * - Flex 90 Solo: 2 500 kr, 90 min
 * - Flex 90 Duo: 2 800 kr (1 400×2), 90 min
 * - Markus 20 min: 300 kr, 20 min
 *
 * Playing Lessons:
 * - On-Course 9: 3 000 kr/spiller, 9 hull (~2.5 timer) — Anders
 * - On-Course Par 3: 500 kr/spiller — Markus
 *
 * NOTE: Gruppe- og juniortjenester er midlertidig deaktivert.
 */

const NEW_SERVICE_TYPES = [
  // ─── Onboarding ───
  {
    name: "Start",
    description:
      "Din inngangsport til strukturert coaching. 3 × 20-minutters økter over 3 uker + 30 dagers tilgang til spillerportalen. Kartlegging, spillerprofilbygging og personlig utviklingsplan.",
    category: ServiceCategory.INDIVIDUAL,
    duration: 20, // Per økt
    price: 3000,
    maxStudents: 1,
    isActive: true,
    isPublic: true,
    sortOrder: 1,
    vatRate: 0,
    minNoticeHours: 24,
    maxAdvanceDays: 60,
  },
  {
    name: "Foundation Test",
    description:
      "50 minutters introduksjonstime for nye spillere. Full kartlegging av spillet ditt og anbefaling om veien videre. Refunderbar ved kjøp av abonnement innen 14 dager.",
    category: ServiceCategory.INDIVIDUAL,
    duration: 50,
    price: 995,
    maxStudents: 1,
    isActive: true,
    isPublic: true,
    sortOrder: 2,
    vatRate: 0,
    minNoticeHours: 24,
    maxAdvanceDays: 30,
  },
  // ─── Drop-in / Flex (48t booking-vindu) ───
  {
    name: "Flex 50 Solo",
    description:
      "50 minutters intensiv coaching én-til-én. Full gjennomgang av et fokusområde med videoanalyse og øvelser.",
    category: ServiceCategory.INDIVIDUAL,
    duration: 50,
    price: 1500,
    maxStudents: 1,
    isActive: true,
    isPublic: true,
    sortOrder: 10,
    vatRate: 0,
    minNoticeHours: 48, // Drop-in: 48t vindu
    maxAdvanceDays: 14,
  },
  {
    name: "Flex 50 Duo",
    description:
      "50 minutters coaching for to spillere. Del på opplevelsen og kostnaden. 850 kr per person.",
    category: ServiceCategory.GROUP,
    duration: 50,
    price: 1700, // Totalpris: 850 × 2
    maxStudents: 2,
    isActive: true,
    isPublic: true,
    sortOrder: 11,
    vatRate: 0,
    minNoticeHours: 48,
    maxAdvanceDays: 14,
  },
  {
    name: "Flex 90 Solo",
    description:
      "90 minutters dybdecoaching én-til-én. Tid til å jobbe grundig med flere områder, inkludert on-range praksis.",
    category: ServiceCategory.INDIVIDUAL,
    duration: 90,
    price: 2500,
    maxStudents: 1,
    isActive: true,
    isPublic: true,
    sortOrder: 12,
    vatRate: 0,
    minNoticeHours: 48,
    maxAdvanceDays: 14,
  },
  {
    name: "Flex 90 Duo",
    description:
      "90 minutters dybdecoaching for to spillere. 1 400 kr per person.",
    category: ServiceCategory.GROUP,
    duration: 90,
    price: 2800, // Totalpris: 1400 × 2
    maxStudents: 2,
    isActive: true,
    isPublic: true,
    sortOrder: 13,
    vatRate: 0,
    minNoticeHours: 48,
    maxAdvanceDays: 14,
  },
  // ─── Banecoaching ───
  {
    name: "On-Course 9",
    description:
      "Banecoaching over 9 hull med Anders. Live kursmanagement med DECADE-prinsipper. Strategisk gjennomgang basert på spredningsdata. Maks 2 spillere.",
    category: ServiceCategory.PLAYING_LESSON,
    duration: 150, // ~2.5 timer
    price: 3000,
    maxStudents: 2, // Maks 2 spillere
    isActive: true,
    isPublic: true,
    sortOrder: 20,
    vatRate: 0,
    minNoticeHours: 48,
    maxAdvanceDays: 30,
  },
  {
    name: "On-Course Par 3",
    description:
      "9 hull på korthullsbanen med Markus. Grunnleggende banemanagement for nybegynnere. Score logges i appen. Grupper à 4 spillere.",
    category: ServiceCategory.PLAYING_LESSON,
    duration: 90, // ~90 min
    price: 500,
    maxStudents: 4,
    isActive: true,
    isPublic: true,
    sortOrder: 21,
    vatRate: 0,
    minNoticeHours: 24,
    maxAdvanceDays: 14,
  },
  // ─── Markus individuell ───
  {
    name: "Markus 20 min",
    description:
      "Kort treningsøkt med Markus Hatlelid. Perfekt for raske justeringer eller oppfølging mellom hovedøktene.",
    category: ServiceCategory.INDIVIDUAL,
    duration: 20,
    price: 300,
    maxStudents: 1,
    isActive: true,
    isPublic: true,
    sortOrder: 30,
    vatRate: 0,
    minNoticeHours: 12,
    maxAdvanceDays: 30,
  },

  // ─── Spillerportal (digital tilgang) ───
  {
    name: "Spillerportal",
    description:
      "Månedlig tilgang til spillerportalen. Se din spillerprofil, TrackMan-statistikk, svingvideoer, utviklingsplan og kommunikasjon med coach. Ingen coaching inkludert.",
    category: ServiceCategory.DIGITAL,
    duration: 0, // Ingen fysisk tid
    price: 299, // Per måned
    maxStudents: 1,
    isActive: true,
    isPublic: true,
    sortOrder: 60,
    vatRate: 0,
    minNoticeHours: 0, // Umiddelbar tilgang
    maxAdvanceDays: 0,
  },
];

async function main() {
  console.log("🔄 Oppdaterer ServiceType-tabellen...\n");

  // Deaktiver gamle tjenester
  const deactivated = await prisma.serviceType.updateMany({
    where: {
      isActive: true,
      name: {
        notIn: NEW_SERVICE_TYPES.map((s) => s.name),
      },
    },
    data: {
      isActive: false,
      isPublic: false,
    },
  });
  console.log(`⏸️  Deaktiverte ${deactivated.count} gamle tjenester`);

  // Opprett eller oppdater nye tjenester
  for (const service of NEW_SERVICE_TYPES) {
    const existing = await prisma.serviceType.findFirst({
      where: { name: service.name },
    });

    if (existing) {
      await prisma.serviceType.update({
        where: { id: existing.id },
        data: service,
      });
      console.log(`✏️  Oppdatert: ${service.name} → ${service.price} kr`);
    } else {
      await prisma.serviceType.create({
        data: { ...service, id: randomUUID(), updatedAt: new Date() },
      });
      console.log(`➕ Opprettet: ${service.name} → ${service.price} kr`);
    }
  }

  // Vis oppsummering
  const activeServices = await prisma.serviceType.findMany({
    where: { isActive: true, isPublic: true },
    orderBy: { sortOrder: "asc" },
    select: { name: true, price: true, duration: true, category: true },
  });

  console.log("\n📋 Aktive tjenester i booking-systemet:");
  console.log("─".repeat(60));
  for (const s of activeServices) {
    console.log(
      `  ${s.name.padEnd(25)} ${String(s.price).padStart(5)} kr  ${String(s.duration).padStart(3)} min  ${s.category}`
    );
  }
  console.log("─".repeat(60));
  console.log(`✅ Totalt ${activeServices.length} aktive tjenester\n`);
}

main()
  .catch((e) => {
    console.error("❌ Feil:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
