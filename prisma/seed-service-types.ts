import "dotenv/config";
import { prisma } from "../lib/portal/prisma";
import { ServiceCategory } from "@prisma/client";

/**
 * Oppdaterer ServiceType-tabellen med nye produkter og priser
 * fra nettsidetekster.txt (mars 2026)
 *
 * Nye produkter:
 * - Start (onboarding): 3000 kr, 3×20 min
 * - Flex 50 Solo: 1500 kr, 50 min
 * - Flex 50 Duo: 850 kr/pers, 50 min
 * - Flex 90 Solo: 2500 kr, 90 min
 * - Flex 90 Duo: 1300 kr/pers, 90 min
 * - On-Course 9: 3000 kr, 9 hull (~2.5 timer)
 * - Markus 20: 300 kr, 20 min
 *
 * Abonnement (Performance Pro/Performance) håndteres av Stripe,
 * ikke ServiceType-tabellen.
 */

const NEW_SERVICE_TYPES = [
  {
    name: "Start — Onboarding",
    description:
      "Din inngangsport til strukturert coaching. 3 × 20-minutters økter over 30 dager. Kartlegging, spillerprofilbygging og personlig utviklingsplan.",
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
    name: "Flex 50 — Solo",
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
    minNoticeHours: 24,
    maxAdvanceDays: 60,
  },
  {
    name: "Flex 50 — Duo",
    description:
      "50 minutters coaching for to spillere. Del på opplevelsen og kostnaden. 850 kr per person.",
    category: ServiceCategory.GROUP,
    duration: 50,
    price: 1700, // Totalpris for 2 personer
    maxStudents: 2,
    isActive: true,
    isPublic: true,
    sortOrder: 11,
    vatRate: 0,
    minNoticeHours: 24,
    maxAdvanceDays: 60,
  },
  {
    name: "Flex 90 — Solo",
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
    minNoticeHours: 24,
    maxAdvanceDays: 60,
  },
  {
    name: "Flex 90 — Duo",
    description:
      "90 minutters dybdecoaching for to spillere. 1300 kr per person.",
    category: ServiceCategory.GROUP,
    duration: 90,
    price: 2600, // Totalpris for 2 personer
    maxStudents: 2,
    isActive: true,
    isPublic: true,
    sortOrder: 13,
    vatRate: 0,
    minNoticeHours: 24,
    maxAdvanceDays: 60,
  },
  {
    name: "On-Course 9 hull",
    description:
      "Banecoaching over 9 hull med Anders. Strategisk kursmanagement, situasjonsbasert trening og mental spillteknikk i reell spillsituasjon.",
    category: ServiceCategory.PLAYING_LESSON,
    duration: 150, // ~2.5 timer
    price: 3000,
    maxStudents: 1,
    isActive: true,
    isPublic: true,
    sortOrder: 20,
    vatRate: 0,
    minNoticeHours: 48,
    maxAdvanceDays: 60,
  },
  {
    name: "Markus — 20 min",
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
        data: service,
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
