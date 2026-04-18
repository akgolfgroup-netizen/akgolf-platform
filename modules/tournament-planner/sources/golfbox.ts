/**
 * GolfBox source adapter — converts GolfBox competitions to ImportableTournament.
 */
import type { ImportableTournament, TournamentLevel } from "../types";
import { fetchGolfBoxSchedule, GOLFBOX_CATEGORIES } from "../golfbox";

/**
 * Hver oppføring = én schedule som skal syncres.
 * customerId er GolfBox tour-eier; scheduleId filtrerer kategori innenfor customeren.
 */
interface GolfBoxScheduleSpec {
  customerId: number;
  scheduleId: number;
  level?: TournamentLevel;
}

/** Default schedules som syncres nattlig */
const DEFAULT_SCHEDULES: GolfBoxScheduleSpec[] = [
  // Landsdekkende (customer 18 / NGF)
  { customerId: 18, scheduleId: 1276, level: "nasjonal" }, // Garmin Norgescup
  { customerId: 18, scheduleId: 7671, level: "nasjonal" }, // Srixon Tour
  { customerId: 18, scheduleId: 9896, level: "nasjonal" }, // Norgesmesterskap
  // Regionalt
  { customerId: 895, scheduleId: 3863, level: "regional" }, // Østlandstour
  { customerId: 877, scheduleId: 16139, level: "regional" }, // Olyo Juniortour
];

function parseGolfBoxDate(raw: string): Date {
  const year = parseInt(raw.slice(0, 4), 10);
  const month = parseInt(raw.slice(4, 6), 10) - 1;
  const day = parseInt(raw.slice(6, 8), 10);
  return new Date(year, month, day);
}

export async function fetchGolfBoxTournaments(
  year: number,
  schedules: GolfBoxScheduleSpec[] = DEFAULT_SCHEDULES,
): Promise<ImportableTournament[]> {
  const results: ImportableTournament[] = [];

  for (const spec of schedules) {
    try {
      const competitions = await fetchGolfBoxSchedule(spec.customerId, year, spec.scheduleId);
      const series = GOLFBOX_CATEGORIES[spec.scheduleId] ?? `GolfBox ${spec.scheduleId}`;

      for (const comp of competitions) {
        results.push({
          source: "golfbox",
          sourceId: String(comp.ID),
          name: comp.Name,
          startDate: parseGolfBoxDate(comp.StartDate),
          endDate: comp.EndDate ? parseGolfBoxDate(comp.EndDate) : undefined,
          venue: comp.VenueName,
          series,
          level: spec.level ?? "nasjonal",
        });
      }
    } catch (err) {
      console.error(
        `[golfbox] Failed to fetch customer=${spec.customerId} schedule=${spec.scheduleId}:`,
        err,
      );
    }
  }

  return results;
}

export { DEFAULT_SCHEDULES };
export type { GolfBoxScheduleSpec };
