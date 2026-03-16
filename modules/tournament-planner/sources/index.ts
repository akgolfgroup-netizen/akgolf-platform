/**
 * Aggregated tournament source fetcher.
 * Calls all configured sources and returns combined results.
 */
import type { ImportableTournament } from "../types";
import { fetchGolfBoxTournaments } from "./golfbox";
import { fetchNordicGolfTourSchedule } from "./nordic-golf-tour";
import { fetchJmiSchedule } from "./jmi-sweden";
import { fetchGlobalJuniorTourSchedule } from "./global-junior-tour";

export { fetchGolfBoxTournaments } from "./golfbox";
export { fetchNordicGolfTourSchedule } from "./nordic-golf-tour";
export { fetchJmiSchedule } from "./jmi-sweden";
export { fetchGlobalJuniorTourSchedule } from "./global-junior-tour";

export async function fetchAllSources(
  year: number
): Promise<{ tournaments: ImportableTournament[]; sources: string[]; errors: string[] }> {
  const tournaments: ImportableTournament[] = [];
  const sources: string[] = [];
  const errors: string[] = [];

  const fetchers = [
    { name: "GolfBox", fn: () => fetchGolfBoxTournaments(year) },
    { name: "Nordic Golf Tour", fn: () => fetchNordicGolfTourSchedule(year) },
    { name: "JMI Sweden", fn: () => fetchJmiSchedule(year) },
    { name: "Global Junior Tour", fn: () => fetchGlobalJuniorTourSchedule(year) },
  ];

  const results = await Promise.allSettled(fetchers.map((f) => f.fn()));

  results.forEach((result, i) => {
    const { name } = fetchers[i];
    if (result.status === "fulfilled") {
      tournaments.push(...result.value);
      if (result.value.length > 0) sources.push(name);
    } else {
      console.error(`[sync] ${name} failed:`, result.reason);
      errors.push(`${name}: ${result.reason?.message ?? "Ukjent feil"}`);
    }
  });

  return { tournaments, sources, errors };
}
