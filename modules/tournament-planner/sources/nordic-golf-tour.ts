/**
 * Nordic Golf Tour source adapter.
 * Extracts tournament data from __NEXT_DATA__ JSON embedded in the schedule page.
 */
import * as cheerio from "cheerio";
import type { ImportableTournament } from "../types";

const BASE_URL = "https://www.nordicgolftour.app/schedule";

interface NgtCompetition {
  id: number;
  name: string;
  venue: string | null;
  start: string;
  end: string;
  slug: string;
}

export async function fetchNordicGolfTourSchedule(
  year: number
): Promise<ImportableTournament[]> {
  const res = await fetch(`${BASE_URL}?year=${year}`, {
    headers: { "User-Agent": "AKGolf-Portal/1.0" },
  });

  if (!res.ok) {
    throw new Error(`Nordic Golf Tour fetch error: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);
  const nextDataScript = $("#__NEXT_DATA__").html();

  if (!nextDataScript) {
    console.warn("[nordic-golf-tour] No __NEXT_DATA__ found");
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any;
  try {
    data = JSON.parse(nextDataScript);
  } catch (err) {
    throw new Error(
      `Nordic Golf Tour: Kunne ikke parse __NEXT_DATA__ — nettsidens struktur kan ha endret seg. ` +
      `Detaljer: ${err instanceof Error ? err.message : String(err)}`
    );
  }
  const competitions: NgtCompetition[] =
    data?.props?.pageProps?.competitions ?? [];

  return competitions.map((comp) => ({
    source: "nordic_golf_tour" as const,
    sourceId: String(comp.id),
    name: comp.name,
    startDate: new Date(comp.start),
    endDate: comp.end ? new Date(comp.end) : undefined,
    venue: comp.venue ?? undefined,
    series: "Nordic Golf Tour",
    level: "internasjonal" as const,
    externalUrl: `https://www.nordicgolftour.app/competitions/${comp.slug}`,
  }));
}
