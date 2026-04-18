#!/usr/bin/env tsx
/**
 * Hjelper: List alle GolfBox schedule-kategorier for en gitt customer + år.
 *
 * Usage:
 *   npx tsx scripts/list-golfbox-schedules.ts [customerId] [year]
 *
 * Eksempler:
 *   npx tsx scripts/list-golfbox-schedules.ts 895 2026    # Olyo/Østland/Junior
 *   npx tsx scripts/list-golfbox-schedules.ts 18 2026     # Garmin NC / Srixon / NM
 *
 * Brukes til å finne scheduleIds som må legges inn i
 * modules/tournament-planner/golfbox.ts → GOLFBOX_CATEGORIES.
 */

import { fetchGolfBoxSchedule } from "../modules/tournament-planner/golfbox";

async function main() {
  const customerId = parseInt(process.argv[2] || "895", 10);
  const year = parseInt(process.argv[3] || String(new Date().getFullYear()), 10);

  console.log(`\nHenter alle schedules for customer=${customerId}, year=${year}...\n`);

  // Hent ALLE konkurranser uten scheduleId-filter
  const competitions = await fetchGolfBoxSchedule(customerId, year);

  if (competitions.length === 0) {
    console.log("Ingen konkurranser funnet. Dobbelsjekk customerId og year.");
    return;
  }

  // Grupper på Category.ID
  const categories = new Map<number, { name: string; count: number; sample: string[] }>();

  for (const comp of competitions) {
    if (!comp.Category) continue;
    const key = comp.Category.ID;
    if (!categories.has(key)) {
      categories.set(key, {
        name: comp.Category.Name,
        count: 0,
        sample: [],
      });
    }
    const cat = categories.get(key)!;
    cat.count += 1;
    if (cat.sample.length < 3) cat.sample.push(comp.Name);
  }

  // Sorter etter antall konkurranser
  const sorted = Array.from(categories.entries()).sort((a, b) => b[1].count - a[1].count);

  console.log(`Fant ${competitions.length} konkurranser fordelt på ${sorted.length} kategorier:\n`);
  console.log("scheduleId | count | Category Name");
  console.log("-----------+-------+----------------------------");
  for (const [id, data] of sorted) {
    console.log(
      `${String(id).padStart(10)} | ${String(data.count).padStart(5)} | ${data.name}`,
    );
    for (const sample of data.sample) {
      console.log(`           |       |   └─ ${sample}`);
    }
  }

  console.log("\nKopier scheduleIds som er relevante (f.eks. Olyo Tour, Østland Tour)");
  console.log("inn i modules/tournament-planner/golfbox.ts → GOLFBOX_CATEGORIES.\n");
}

main().catch((err) => {
  console.error("Feil:", err);
  process.exit(1);
});
