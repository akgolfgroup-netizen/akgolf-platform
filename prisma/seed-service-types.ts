import "dotenv/config";
import { randomUUID } from "crypto";
import { prisma } from "../lib/portal/prisma";
import { ServiceCategory } from "@prisma/client";

/**
 * Oppdaterer ServiceType-tabellen med produkter fra AK Golf Academy 2026.
 *
 * Oppdatert: 2026-04-10 — Konsistent tjenestenavn
 *
 * TJENESTER:
 *
 * Onboarding (Anders):
 * - Start: 3 000 kr, 3×20 min + 30d portal
 * - Foundation Test: 995 kr, 50 min intro (refunderbar ved abo-kjøp)
 *
 * Flex — enkeltbetaling (Anders):
 * - Flex 50: 1 500 kr, 50 min (1 mnd portal)
 * - Flex 50 Duo: 1 700 kr (850×2), 50 min (1 mnd portal)
 * - Flex 90: 2 500 kr, 90 min (1 mnd portal)
 * - Flex 90 Duo: 2 800 kr (1 400×2), 90 min (1 mnd portal)
 *
 * Flex — enkeltbetaling (Markus):
 * - Flex 20: 300 kr, 20 min (1 mnd portal)
 *
 * Banecoaching (Anders):
 * - Banecoaching 9 hull: 3 000 kr/spiller, ~2.5 timer (1 mnd portal)
 *
 * Gruppecoaching (Anders):
 * - Gruppecoaching: 500 kr/person, 60 min, maks 5 (portal via abo)
 *
 * Digital:
 * - Spillerportal: 299 kr/mnd (kun portaltilgang)
 */

const NEW_SERVICE_TYPES = [
  // ─── Onboarding (Anders) ───
  {
    name: "Start",
    description:
      "Din inngangsport til strukturert coaching. 3 × 20-minutters økter over 3 uker + 30 dagers tilgang til spillerportalen. Kartlegging, spillerprofilbygging og personlig utviklingsplan.",
    category: ServiceCategory.INDIVIDUAL,
    duration: 20,
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

  // ─── Flex — enkeltbetaling, Anders (1 mnd portal) ───
  {
    name: "Flex 50",
    description:
      "50 minutters intensiv coaching en-til-en. Full gjennomgang av et fokusomrade med videoanalyse. Ingen binding. 1 mnd portaltilgang inkludert.",
    category: ServiceCategory.INDIVIDUAL,
    duration: 50,
    price: 1500,
    maxStudents: 1,
    isActive: true,
    isPublic: true,
    sortOrder: 10,
    vatRate: 0,
    minNoticeHours: 48,
    maxAdvanceDays: 14,
  },
  {
    name: "Flex 50 Duo",
    description:
      "50 minutters coaching for to spillere. 850 kr per person. Ingen binding. 1 mnd portaltilgang inkludert.",
    category: ServiceCategory.GROUP,
    duration: 50,
    price: 1700,
    maxStudents: 2,
    isActive: true,
    isPublic: true,
    sortOrder: 11,
    vatRate: 0,
    minNoticeHours: 48,
    maxAdvanceDays: 14,
  },
  {
    name: "Flex 90",
    description:
      "90 minutters dybdecoaching en-til-en. Tid til a jobbe grundig med flere omrader, inkludert on-range praksis. Ingen binding. 1 mnd portaltilgang inkludert.",
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
      "90 minutters dybdecoaching for to spillere. 1 400 kr per person. Ingen binding. 1 mnd portaltilgang inkludert.",
    category: ServiceCategory.GROUP,
    duration: 90,
    price: 2800,
    maxStudents: 2,
    isActive: true,
    isPublic: true,
    sortOrder: 13,
    vatRate: 0,
    minNoticeHours: 48,
    maxAdvanceDays: 14,
  },

  // ─── Flex — enkeltbetaling, Markus (1 mnd portal) ───
  {
    name: "Flex 20",
    description:
      "20 minutters kort treningsokt med Markus. Raske justeringer eller oppfolging. Ingen binding. 1 mnd portaltilgang inkludert.",
    category: ServiceCategory.INDIVIDUAL,
    duration: 20,
    price: 300,
    maxStudents: 1,
    isActive: true,
    isPublic: true,
    sortOrder: 14,
    vatRate: 0,
    minNoticeHours: 12,
    maxAdvanceDays: 30,
  },

  // ─── Banecoaching (Anders, 1 mnd portal) ───
  {
    name: "Banecoaching 9 hull",
    description:
      "Banecoaching over 9 hull med Anders. Live kursmanagement med DECADE-prinsipper. Maks 2 spillere. 1 mnd portaltilgang inkludert.",
    category: ServiceCategory.PLAYING_LESSON,
    duration: 150,
    price: 3000,
    maxStudents: 2,
    isActive: true,
    isPublic: true,
    sortOrder: 20,
    vatRate: 0,
    minNoticeHours: 48,
    maxAdvanceDays: 30,
  },

  // ─── Gruppecoaching (Anders) ───
  {
    name: "Gruppecoaching",
    description:
      "60 minutters gruppecoaching med Anders. Maks 5 deltakere. Del av Gruppe-abonnement eller enkeltbetaling.",
    category: ServiceCategory.GROUP,
    duration: 60,
    price: 500,
    maxStudents: 5,
    isActive: true,
    isPublic: true,
    sortOrder: 25,
    vatRate: 0,
    minNoticeHours: 24,
    maxAdvanceDays: 30,
  },

  // ─── Spillerportal (digital tilgang) ───
  {
    name: "Spillerportal",
    description:
      "Manedlig tilgang til spillerportalen. Se din spillerprofil, TrackMan-statistikk, svingvideoer, utviklingsplan og kommunikasjon med coach. Ingen coaching inkludert.",
    category: ServiceCategory.DIGITAL,
    duration: 0,
    price: 299,
    maxStudents: 1,
    isActive: true,
    isPublic: true,
    sortOrder: 60,
    vatRate: 0,
    minNoticeHours: 0,
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
