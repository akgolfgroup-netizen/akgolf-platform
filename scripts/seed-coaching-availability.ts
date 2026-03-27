import "dotenv/config";
import { prisma } from "../lib/portal/prisma";

// Ukedager: 0=søndag, 1=mandag, 2=tirsdag, 3=onsdag, 4=torsdag, 5=fredag, 6=lørdag

// Tidsrammer som skal brytes ned til 20-min slots (med 5 min buffer = 25 min intervaller)
const TIME_RANGES = [
  // Mandag - fredag: 08:00-18:00
  { dayOfWeek: 1, startHour: 8, endHour: 18, reservedFor: null },
  { dayOfWeek: 2, startHour: 8, endHour: 18, reservedFor: null },
  { dayOfWeek: 3, startHour: 8, endHour: 18, reservedFor: null },
  { dayOfWeek: 4, startHour: 8, endHour: 18, reservedFor: null },
  { dayOfWeek: 5, startHour: 8, endHour: 18, reservedFor: null },
  // Lørdag: 09:00-14:00
  { dayOfWeek: 6, startHour: 9, endHour: 14, reservedFor: null },
];

// Junior Elite reserverte tider (overskriver generell tilgjengelighet)
const JUNIOR_ELITE_RANGES = [
  { dayOfWeek: 2, startHour: 16, endHour: 18, reservedFor: "junior_elite" }, // Tirsdag 16-18
  { dayOfWeek: 4, startHour: 16, endHour: 18, reservedFor: "junior_elite" }, // Torsdag 16-18
];

interface Slot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  reservedFor: string | null;
}

function generateSlots(
  dayOfWeek: number,
  startHour: number,
  endHour: number,
  reservedFor: string | null
): Slot[] {
  const slots: Slot[] = [];
  const slotDuration = 20; // minutter
  const buffer = 5; // minutter mellom slots
  const interval = slotDuration + buffer; // 25 min

  let currentMinutes = startHour * 60;
  const endMinutes = endHour * 60;

  while (currentMinutes + slotDuration <= endMinutes) {
    const startH = Math.floor(currentMinutes / 60);
    const startM = currentMinutes % 60;
    const endM = currentMinutes + slotDuration;
    const endH = Math.floor(endM / 60);
    const endMin = endM % 60;

    slots.push({
      dayOfWeek,
      startTime: `${String(startH).padStart(2, "0")}:${String(startM).padStart(2, "0")}`,
      endTime: `${String(endH).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`,
      reservedFor,
    });

    currentMinutes += interval;
  }

  return slots;
}

async function main() {
  console.log("Seeding coaching availability...\n");

  // Slett eksisterende for å unngå duplikater
  await prisma.coachingAvailability.deleteMany({});
  console.log("  🗑️  Slettet eksisterende tilgjengelighet\n");

  const dayNames = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
  const allSlots: Slot[] = [];

  // Generer generelle slots
  for (const range of TIME_RANGES) {
    const slots = generateSlots(range.dayOfWeek, range.startHour, range.endHour, range.reservedFor);
    allSlots.push(...slots);
    console.log(`  📅 ${dayNames[range.dayOfWeek]} ${range.startHour}:00-${range.endHour}:00 → ${slots.length} slots`);
  }

  // Marker Junior Elite-reserverte slots
  for (const range of JUNIOR_ELITE_RANGES) {
    // Finn og oppdater eksisterende slots i dette tidsrommet
    for (const slot of allSlots) {
      if (slot.dayOfWeek !== range.dayOfWeek) continue;

      const [startH] = slot.startTime.split(":").map(Number);
      if (startH >= range.startHour && startH < range.endHour) {
        slot.reservedFor = "junior_elite";
      }
    }
    console.log(`  🎯 ${dayNames[range.dayOfWeek]} ${range.startHour}:00-${range.endHour}:00 → reservert for junior_elite`);
  }

  // Lagre alle slots
  await prisma.coachingAvailability.createMany({
    data: allSlots,
  });

  console.log(`\n  ✅ Totalt ${allSlots.length} slots opprettet`);

  // Oppsummering per dag
  console.log("\n  Fordeling:");
  for (let d = 1; d <= 6; d++) {
    const daySlots = allSlots.filter(s => s.dayOfWeek === d);
    const reserved = daySlots.filter(s => s.reservedFor).length;
    console.log(`    ${dayNames[d]}: ${daySlots.length} slots (${reserved} reservert)`);
  }

  console.log("\nFerdig!");
}

main()
  .catch((e) => {
    console.error("Feil:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
