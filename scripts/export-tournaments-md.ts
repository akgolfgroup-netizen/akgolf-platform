#!/usr/bin/env tsx
import { prisma } from "../lib/portal/prisma";
import { writeFileSync } from "fs";

async function main() {
  const tournaments = await prisma.tournament.findMany({
    orderBy: [{ startDate: "asc" }],
  });

  const byYear = new Map<number, typeof tournaments>();
  for (const t of tournaments) {
    const y = new Date(t.startDate).getFullYear();
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)!.push(t);
  }

  const lines: string[] = [];
  lines.push("# Turneringskalender — AK Golf Platform");
  lines.push("");
  lines.push(`Generert: ${new Date().toLocaleDateString("nb-NO")} · Totalt ${tournaments.length} turneringer`);
  lines.push("");

  const sourceLabel: Record<string, string> = {
    golfbox: "GolfBox",
    nordic_golf_tour: "Nordic Golf Tour",
    jmi_sweden: "JMI Sweden",
    global_junior_tour: "Global Junior Tour",
    manual: "Manuell",
  };

  for (const [year, list] of [...byYear.entries()].sort(([a], [b]) => a - b)) {
    lines.push(`## ${year}`);
    lines.push("");
    lines.push("| Dato | Turnering | Serie | Sted/Bane | Nivå | Hull | Kilde |");
    lines.push("|---|---|---|---|---|---|---|");
    for (const t of list) {
      const start = new Date(t.startDate).toLocaleDateString("nb-NO", { day: "2-digit", month: "short" });
      const end = t.endDate ? new Date(t.endDate).toLocaleDateString("nb-NO", { day: "2-digit", month: "short" }) : "";
      const dato = end && end !== start ? `${start}–${end}` : start;
      const venue = t.location || t.course || "—";
      const series = t.series || "—";
      const holes = t.numberOfHoles ? `${t.numberOfHoles}` : "—";
      const source = sourceLabel[t.source || "manual"] || t.source || "—";
      lines.push(`| ${dato} | ${t.name} | ${series} | ${venue} | ${t.level} | ${holes} | ${source} |`);
    }
    lines.push("");
  }

  writeFileSync("docs/TURNERINGSKALENDER.md", lines.join("\n"));
  console.log(`Skrevet ${tournaments.length} turneringer til docs/TURNERINGSKALENDER.md`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
