/**
 * GolfBox source adapter — converts GolfBox competitions to ImportableTournament.
 */
import type { ImportableTournament } from "../types";
import { fetchGolfBoxSchedule, GOLFBOX_CATEGORIES } from "../golfbox";

/** Default categories to sync */
const DEFAULT_SCHEDULE_IDS = [7671, 1276, 9896];

function parseGolfBoxDate(raw: string): Date {
  const year = parseInt(raw.slice(0, 4), 10);
  const month = parseInt(raw.slice(4, 6), 10) - 1;
  const day = parseInt(raw.slice(6, 8), 10);
  return new Date(year, month, day);
}

export async function fetchGolfBoxTournaments(
  year: number,
  scheduleIds: number[] = DEFAULT_SCHEDULE_IDS
): Promise<ImportableTournament[]> {
  const results: ImportableTournament[] = [];

  for (const scheduleId of scheduleIds) {
    try {
      const competitions = await fetchGolfBoxSchedule(18, year, scheduleId);
      const series = GOLFBOX_CATEGORIES[scheduleId] ?? `GolfBox ${scheduleId}`;

      for (const comp of competitions) {
        results.push({
          source: "golfbox",
          sourceId: String(comp.ID),
          name: comp.Name,
          startDate: parseGolfBoxDate(comp.StartDate),
          endDate: comp.EndDate ? parseGolfBoxDate(comp.EndDate) : undefined,
          venue: comp.VenueName,
          series,
          level: "nasjonal",
        });
      }
    } catch (err) {
      console.error(`[golfbox] Failed to fetch scheduleId ${scheduleId}:`, err);
    }
  }

  return results;
}
