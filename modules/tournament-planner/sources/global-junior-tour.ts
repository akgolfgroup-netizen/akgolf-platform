/**
 * Global Junior Golf Tour source adapter.
 * Scrapes tournament calendar from globaljuniorgolflive.com.
 */
import * as cheerio from "cheerio";
import type { ImportableTournament } from "../types";

const BASE_URL = "https://globaljuniorgolflive.com/tour-calendar/";

export async function fetchGlobalJuniorTourSchedule(
  _year?: number
): Promise<ImportableTournament[]> {
  const res = await fetch(BASE_URL, {
    headers: { "User-Agent": "AKGolf-Portal/1.0" },
  });

  if (!res.ok) {
    throw new Error(`Global Junior Tour fetch error: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);
  const results: ImportableTournament[] = [];

  // Try multiple selectors — the page structure may vary
  $("table tr, .event-row, .tournament-item, article").each((_, el) => {
    const $el = $(el);
    const text = $el.text().trim();
    if (!text || text.length < 5) return;

    // Look for date patterns and tournament names
    const cells = $el.find("td");
    if (cells.length >= 2) {
      const dateText = $(cells[0]).text().trim();
      const name = $(cells[1]).text().trim();
      const venue = cells.length >= 3 ? $(cells[2]).text().trim() : undefined;
      const link = $el.find("a").attr("href") ?? undefined;

      if (!name || !dateText) return;

      // Parse dates like "Feb 14-16" or "March 5, 2026"
      const dateMatch = dateText.match(
        /(\w+)\s+(\d{1,2})(?:\s*[-–]\s*(\d{1,2}))?,?\s*(\d{4})?/
      );
      if (!dateMatch) return;

      const monthNames: Record<string, number> = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
      };
      const monthStr = dateMatch[1].toLowerCase().slice(0, 3);
      const month = monthNames[monthStr];
      if (month === undefined) return;

      const year = dateMatch[4] ? parseInt(dateMatch[4], 10) : new Date().getFullYear();
      const startDay = parseInt(dateMatch[2], 10);
      const endDay = dateMatch[3] ? parseInt(dateMatch[3], 10) : undefined;

      const sourceId = link
        ? link.replace(/\/$/, "").split("/").pop() ?? `gjt-${name}`
        : `gjt-${name}-${dateText}`;

      results.push({
        source: "global_junior_tour",
        sourceId,
        name,
        startDate: new Date(year, month, startDay),
        endDate: endDay ? new Date(year, month, endDay) : undefined,
        venue: venue || undefined,
        series: "Global Junior Tour",
        level: "internasjonal",
        externalUrl: link?.startsWith("http") ? link : undefined,
      });
    }
  });

  return results;
}
