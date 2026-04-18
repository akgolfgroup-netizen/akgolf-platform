/**
 * GolfBox Schedule API integration.
 * Fetches tournament schedules from scores.golfbox.dk
 * and parses norskgolf.no URLs.
 */

export interface GolfBoxCompetition {
  ID: number;
  Name: string;
  StartDate: string; // "20260615T000000"
  EndDate: string;
  VenueName?: string;
  Category?: { ID: number; Name: string };
}

interface ParsedGolfBoxUrl {
  customerId: number;
  year: number;
  scheduleId: number;
}

const GOLFBOX_SCHEDULE_URL =
  "https://scores.golfbox.dk/Handlers/ScheduleHandler/GetSchedule/CustomerId";

/**
 * Parse a norskgolf.no terminliste URL to extract GolfBox parameters.
 * Format: norskgolf.no/terminlister#/customer/{cid}/schedule/{year}/{scheduleId}
 */
export function parseGolfBoxUrl(url: string): ParsedGolfBoxUrl | null {
  const match = url.match(
    /[#/]customer\/(\d+)\/schedule\/(\d+)\/(\d+)/
  );
  if (!match) return null;
  return {
    customerId: parseInt(match[1], 10),
    year: parseInt(match[2], 10),
    scheduleId: parseInt(match[3], 10),
  };
}

/**
 * Parse GolfBox date format "20260615T000000" → Date
 */
function parseGolfBoxDate(raw: string): Date {
  // Format: "YYYYMMDDTHHmmss"
  const year = parseInt(raw.slice(0, 4), 10);
  const month = parseInt(raw.slice(4, 6), 10) - 1;
  const day = parseInt(raw.slice(6, 8), 10);
  return new Date(year, month, day);
}

/**
 * Fetch tournament schedule from GolfBox API.
 * The API returns JS-style booleans (!0 / !1) that must be fixed before JSON.parse.
 */
export async function fetchGolfBoxSchedule(
  customerId: number,
  year: number,
  scheduleId?: number
): Promise<GolfBoxCompetition[]> {
  const url = `${GOLFBOX_SCHEDULE_URL}/${customerId}/Year/${year}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`GolfBox API error: ${res.status} ${res.statusText}`);
  }

  let text = await res.text();
  // Fix JS booleans to JSON booleans
  text = text.replace(/!0/g, "true").replace(/!1/g, "false");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any;
  try {
    data = JSON.parse(text);
  } catch (err) {
    throw new Error(
      `GolfBox: Kunne ikke parse API-respons for customer ${customerId}, år ${year}. ` +
      `Start av respons: "${text.slice(0, 200)}". ` +
      `Detaljer: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  // Navigate: CompetitionData → S{year} → Months → M{n} → Competitions[]
  const seasonKey = `S${year}`;
  const season = data?.CompetitionData?.[seasonKey];
  if (!season?.Months) return [];

  const competitions: GolfBoxCompetition[] = [];
  const months = season.Months;

  // Top-level categories lookup (brukes av Entries-format hvor Categories er [id])
  const topCategories: Record<number, { ID: number; Name: string }> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const topCatList: any[] = data?.Categories ?? [];
  for (const c of topCatList) {
    if (c?.ID) topCategories[c.ID] = { ID: c.ID, Name: c.Name };
  }

  for (const monthKey of Object.keys(months)) {
    const month = months[monthKey];

    // Format A: customer 18-stil → month.Competitions: []
    if (Array.isArray(month?.Competitions)) {
      for (const comp of month.Competitions) {
        if (scheduleId && comp.Category?.ID !== scheduleId) continue;
        competitions.push({
          ID: comp.ID,
          Name: comp.Name,
          StartDate: comp.StartDate,
          EndDate: comp.EndDate,
          VenueName: comp.VenueName,
          Category: comp.Category,
        });
      }
      continue;
    }

    // Format B: customer 895-stil → month.Entries: { E<id>: comp }
    if (month?.Entries && typeof month.Entries === "object") {
      for (const entryKey of Object.keys(month.Entries)) {
        const comp = month.Entries[entryKey];
        // Categories er array av ID-er i dette formatet
        const categoryIds: number[] = Array.isArray(comp.Categories)
          ? comp.Categories
          : [];
        if (scheduleId && !categoryIds.includes(scheduleId)) continue;

        // Finn første matchende kategori for navn-lookup
        const catId = categoryIds[0];
        const category = catId && topCategories[catId] ? topCategories[catId] : undefined;

        competitions.push({
          ID: comp.ID,
          Name: comp.Name,
          StartDate: comp.StartDate,
          EndDate: comp.EndDate,
          VenueName: comp.VenueName,
          Category: category,
        });
      }
    }
  }

  return competitions;
}

/**
 * Convert a GolfBox competition to a format suitable for tournament creation.
 */
export function golfBoxCompetitionToTournament(comp: GolfBoxCompetition) {
  return {
    golfboxId: comp.ID,
    name: comp.Name,
    startDate: parseGolfBoxDate(comp.StartDate),
    endDate: comp.EndDate ? parseGolfBoxDate(comp.EndDate) : undefined,
    venue: comp.VenueName,
  };
}

/**
 * Known GolfBox schedule categories
 */
export const GOLFBOX_CATEGORIES: Record<number, string> = {
  1276: "Garmin Norgescup",
  7671: "Srixon Tour",
  9775: "Internasjonale turneringer",
  9896: "Norgesmesterskap",
  9897: "Lag-NM",
  3863: "Østlandstour",
  16139: "Olyo Juniortour",
};

/**
 * Known GolfBox customers (tour-eiere).
 *
 * NGF (18) hoster landsdekkende serier som Garmin NC, Srixon Tour, NM.
 * Regionale junior-tourer har egne customers:
 *   873 Midt, 874 Vestland, 875 Rogaland, 876 Sør, 877 Viken Vest, 878 Øst
 * Østlandstour har egen customer: 895
 */
export const GOLFBOX_CUSTOMERS: Record<number, string> = {
  18: "NGF (landsdekkende)",
  873: "Region Midt",
  874: "Region Vestland",
  875: "Region Rogaland",
  876: "Region Sør",
  877: "Region Viken Vest",
  878: "Region Øst",
  895: "Østlandstour",
};
