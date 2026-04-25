import "dotenv/config";
import { nanoid } from "nanoid";
import { prisma } from "../lib/portal/prisma";

const MODULES = [
  // Treningsdagbok - 3 tiers (hovedprodukt)
  { slug: "dagbok-free", name: "Treningsdagbok Free", description: "Logg økter manuelt, siste 14 dager historikk, enkle notater", icon: "notebook", monthlyPriceNok: 0, sortOrder: 1 },
  { slug: "dagbok-pro", name: "Treningsdagbok Pro", description: "Full historikk, trender og grafer, kategorisering, PDF-eksport", icon: "notebook-pen", monthlyPriceNok: 9900, sortOrder: 2 },
  { slug: "dagbok-premium", name: "Treningsdagbok Premium", description: "AI-analyse av treningsvaner, automatiske anbefalinger, periodiseringssporing, deling med trener", icon: "notebook-tabs", monthlyPriceNok: 19900, sortOrder: 3 },

  // Andre moduler
  { slug: "sammenligning", name: "Sammenligning", description: "Sammenlign deg med andre spillere på ditt nivå", icon: "users", monthlyPriceNok: 0, sortOrder: 4 },
  { slug: "statistikk", name: "Statistikk Pro", description: "Strokes Gained, SG radar, trender og analyse", icon: "bar-chart-3", monthlyPriceNok: 9900, sortOrder: 5 },
  { slug: "ovelsesbank", name: "Øvelsesbank", description: "Bibliotek med øvelser og drills for alle nivåer", icon: "dumbbell", monthlyPriceNok: 9900, sortOrder: 6 },
  { slug: "turneringsplan", name: "Turneringsplan", description: "Planlegg turneringer, forberedelser og strategi", icon: "trophy", monthlyPriceNok: 9900, sortOrder: 7 },

  // Premium AI-moduler (GULLGRUVEN)
  { slug: "treningsplan", name: "Treningsplanlegger", description: "AI-genererte skreddersydde treningsplaner basert på ditt nivå og mål", icon: "target", monthlyPriceNok: 14900, sortOrder: 8 },
  { slug: "spilleranalyse", name: "Spilleranalyse", description: "AI dybdeanalyse av svakheter og styrker med konkrete anbefalinger", icon: "scan-search", monthlyPriceNok: 19900, sortOrder: 9 },
];

const BUNDLES = [
  {
    slug: "pro-bundle",
    name: "Pro-pakken",
    description: "Dagbok Pro + Statistikk + Øvelsesbank. Perfekt for den dedikerte spilleren.",
    monthlyPriceNok: 24900, // Verdi: 99+99+99 = 297 kr, spar 48 kr
    sortOrder: 1,
    moduleSlugs: ["dagbok-pro", "statistikk", "ovelsesbank"],
  },
  {
    slug: "elite-bundle",
    name: "Elite-pakken",
    description: "Alt i Pro + Treningsplanlegger + Turneringsplan. For spillere med ambisjoner.",
    monthlyPriceNok: 39900, // Verdi: 249+149+99 = 497 kr, spar 98 kr
    sortOrder: 2,
    moduleSlugs: ["dagbok-pro", "statistikk", "ovelsesbank", "treningsplan", "turneringsplan"],
  },
  {
    slug: "premium-bundle",
    name: "Premium-pakken",
    description: "Full tilgang til ALT. Dagbok Premium + alle AI-verktøy. Spar over 40%.",
    monthlyPriceNok: 49900, // Verdi: 199+99+99+99+149+199 = 844 kr, spar 345 kr
    sortOrder: 3,
    moduleSlugs: ["dagbok-premium", "statistikk", "ovelsesbank", "turneringsplan", "treningsplan", "spilleranalyse"],
  },
];

async function main() {
  console.log("Seeding app modules and bundles...\n");

  // Upsert modules
  for (const mod of MODULES) {
    await prisma.appModule.upsert({
      where: { slug: mod.slug },
      update: { name: mod.name, description: mod.description, icon: mod.icon, monthlyPriceNok: mod.monthlyPriceNok, sortOrder: mod.sortOrder },
      create: { id: nanoid(), updatedAt: new Date(), ...mod },
    });
    console.log(`  Module: ${mod.name} (${mod.monthlyPriceNok / 100} kr/mnd)`);
  }

  // Upsert bundles
  for (const bundle of BUNDLES) {
    const { moduleSlugs, ...bundleData } = bundle;

    const created = await prisma.appBundle.upsert({
      where: { slug: bundle.slug },
      update: { name: bundleData.name, description: bundleData.description, monthlyPriceNok: bundleData.monthlyPriceNok, sortOrder: bundleData.sortOrder },
      create: { id: nanoid(), updatedAt: new Date(), ...bundleData },
    });

    // Link modules to bundle
    for (const moduleSlug of moduleSlugs) {
      const mod = await prisma.appModule.findUnique({ where: { slug: moduleSlug } });
      if (!mod) continue;

      await prisma.bundleItem.upsert({
        where: { bundleId_moduleId: { bundleId: created.id, moduleId: mod.id } },
        update: {},
        create: { id: nanoid(), bundleId: created.id, moduleId: mod.id },
      });
    }
    console.log(`  Bundle: ${bundle.name} (${bundle.monthlyPriceNok / 100} kr/mnd) → [${moduleSlugs.join(", ")}]`);
  }

  console.log("\nDone! Stripe Price IDs must be set manually eller via sync-script.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
