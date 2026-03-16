/**
 * JMI Sweden source adapter.
 * Scrapes qualifying tournament table from jmi-sweden.se.
 */
import * as cheerio from "cheerio";
import type { ImportableTournament } from "../types";

/**
 * Parse Swedish date strings like "30 MAR - 31 MAR" or "1 MAJ"
 */
function parseSwedishDate(text: string, year: number): { start: Date; end?: Date } {
  const MONTHS: Record<string, number> = {
    JAN: 0, FEB: 1, MAR: 2, APR: 3, MAJ: 4, JUN: 5,
    JUL: 6, AUG: 7, SEP: 8, OKT: 9, NOV: 10, DEC: 11,
  };

  const parts = text.split(" - ").map((s) => s.trim());

  function parseSingle(s: string): Date {
    const tokens = s.split(/\s+/);
    const day = parseInt(tokens[0], 10);
    const monthStr = (tokens[1] ?? "").toUpperCase();
    const month = MONTHS[monthStr] ?? 0;
    return new Date(year, month, day);
  }

  const start = parseSingle(parts[0]);
  const end = parts.length > 1 ? parseSingle(parts[1]) : undefined;

  return { start, end };
}

export async function fetchJmiSchedule(
  year: number
): Promise<ImportableTournament[]> {
  const url = `https://www.jmi-sweden.se/web/kvaltavlingar-${year}/`;
  const res = await fetch(url, {
    headers: { "User-Agent": "AKGolf-Portal/1.0" },
  });

  if (!res.ok) {
    throw new Error(`JMI Sweden fetch error: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);
  const results: ImportableTournament[] = [];

  $("table.table tr.contentRow, table.sortable tr.contentRow").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length < 3) return;

    const dateText = $(cells[0]).text().trim();
    const name = $(cells[1]).text().trim();
    const venue = $(cells[2]).text().trim();

    // Extract link if present
    const link = $(cells[1]).find("a").attr("href") ?? undefined;

    if (!name || !dateText) return;

    const { start, end } = parseSwedishDate(dateText, year);
    const sourceId = link
      ? link.match(/\/(\d+)/)?.[1] ?? `jmi-${name}-${dateText}`
      : `jmi-${name}-${dateText}`;

    results.push({
      source: "jmi_sweden",
      sourceId,
      name,
      startDate: start,
      endDate: end,
      venue: venue || undefined,
      series: "JMI Sweden",
      level: "internasjonal",
      externalUrl: link?.startsWith("http")
        ? link
        : link
          ? `https://www.jmi-sweden.se${link}`
          : undefined,
    });
  });

  return results;
}
