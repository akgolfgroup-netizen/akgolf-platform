/**
 * Global Junior Golf Tour source adapter.
 * Scrapes tournament calendar from globaljuniorgolflive.com.
 */
import * as cheerio from "cheerio";
import type { ImportableTournament } from "../types";

const BASE_URL = "https://globaljuniorgolflive.com/tour-calendar/";

function parseDateRange(text: string): { start: Date; end?: Date } | null {
  // Format: "May 05 - May 08 2026" or "Jun 01 - Jun 04 2026"
  const match = text.match(
    /([A-Za-z]{3})\s+(\d{1,2})\s+-\s+([A-Za-z]{3})\s+(\d{1,2})\s+(\d{4})/
  );
  if (!match) {
    // Single-day fallback: "May 05 2026"
    const single = text.match(/([A-Za-z]{3})\s+(\d{1,2})\s+(\d{4})/);
    if (!single) return null;
    const monthNames: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    };
    const month = monthNames[single[1].toLowerCase()];
    if (month === undefined) return null;
    return {
      start: new Date(parseInt(single[3], 10), month, parseInt(single[2], 10)),
    };
  }

  const monthNames: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  };
  const year = parseInt(match[5], 10);
  const startMonth = monthNames[match[1].toLowerCase()];
  const endMonth = monthNames[match[3].toLowerCase()];
  if (startMonth === undefined || endMonth === undefined) return null;

  return {
    start: new Date(year, startMonth, parseInt(match[2], 10)),
    end: new Date(year, endMonth, parseInt(match[4], 10)),
  };
}

export async function fetchGlobalJuniorTourSchedule(): Promise<ImportableTournament[]> {
  const res = await fetch(BASE_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      Accept: "text/html",
    },
  });

  if (!res.ok) {
    throw new Error(`Global Junior Tour fetch error: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);
  const results: ImportableTournament[] = [];

  $("article.tribe-events-calendar-list__event").each((_, el) => {
    const $el = $(el);
    const name = $el.find(".tribe-events-calendar-list__event-title").text().trim();
    const dateText = $el.find(".tribe-events-calendar-list__event-datetime").text().trim();
    const venueRaw = $el.find(".tribe-events-calendar-list__event-venue").text().trim();
    const link = $el.find("a.tribe-events-calendar-list__event-title-link").attr("href");

    if (!name || !dateText) return;

    const dates = parseDateRange(dateText);
    if (!dates) return;

    // Clean up venue (remove duplicate country info)
    const venue = venueRaw
      .replace(/\t/g, " ")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const sourceId = link
      ? link.replace(/\/$/, "").split("/").pop() ?? `gjt-${name}`
      : `gjt-${name}-${dateText}`;

    results.push({
      source: "global_junior_tour",
      sourceId,
      name,
      startDate: dates.start,
      endDate: dates.end,
      venue: venue || undefined,
      series: "Global Junior Tour",
      level: "internasjonal",
      externalUrl: link?.startsWith("http") ? link : undefined,
    });
  });

  return results;
}
