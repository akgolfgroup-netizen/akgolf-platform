/**
 * Sammenligning - server-side data-aksess.
 *
 * Henter ekte tall fra:
 *   - DataGolfCache (PGA top 200 PGA-snitt) for nasjonalt/elite-benchmark
 *   - HandicapEntry (alle aktive spillere) for AK-pyramide-populasjon
 *   - RoundStats (alle peers) for snitt GIR/Fairway pa pyramide-radene
 *
 * Brukes av `app/portal/(dashboard)/sammenligning/page.tsx`.
 */

import { prisma } from "@/lib/portal/prisma";
import { SKILL_LEVELS, type SkillLevel } from "@/lib/portal/golf/skill-levels";

/** Pyramide-rad slik UI-en vil ha den (8 rader; H-K kollapses til ett band). */
export interface PyramidLevelRow {
  level: string;
  name: string;
  desc: string;
  hcpRange: string;
  population: number;
}

/** Snitt-SG fra DataGolf top 200 PGA. Brukes som "verdens-elite"-benchmark. */
export interface NationalBenchmark {
  sgOffTheTee: number;
  sgApproach: number;
  sgAroundTheGreen: number;
  sgPutting: number;
  sgTotal: number;
  sampleSize: number;
}

/**
 * Hent gjennomsnitts-SG fra DataGolfCache. Ignorerer rader uten ranking.
 * Returnerer 0 for alle felter hvis cache er tom (fallback for design-fasit).
 */
export async function getNationalBenchmark(): Promise<NationalBenchmark> {
  const rows = await prisma.dataGolfCache.findMany({
    where: { dgRank: { not: null } },
    select: { sgTotal: true, sgOtt: true, sgApp: true, sgArg: true, sgPutt: true },
    orderBy: { dgRank: "asc" },
    take: 200,
  });

  if (rows.length === 0) {
    return {
      sgOffTheTee: 0,
      sgApproach: 0,
      sgAroundTheGreen: 0,
      sgPutting: 0,
      sgTotal: 0,
      sampleSize: 0,
    };
  }

  const sum = rows.reduce(
    (acc, r) => ({
      sgTotal: acc.sgTotal + r.sgTotal,
      sgOtt: acc.sgOtt + r.sgOtt,
      sgApp: acc.sgApp + r.sgApp,
      sgArg: acc.sgArg + r.sgArg,
      sgPutt: acc.sgPutt + r.sgPutt,
    }),
    { sgTotal: 0, sgOtt: 0, sgApp: 0, sgArg: 0, sgPutt: 0 },
  );
  const n = rows.length;
  return {
    sgOffTheTee: sum.sgOtt / n,
    sgApproach: sum.sgApp / n,
    sgAroundTheGreen: sum.sgArg / n,
    sgPutting: sum.sgPutt / n,
    sgTotal: sum.sgTotal / n,
    sampleSize: n,
  };
}

/** GIR-/fairway-snitt fra siste registrerte runder for "Pyramide"-radene. */
export async function getNationalPercentages(): Promise<{
  girPct: number;
  fairwayPct: number;
  sampleRounds: number;
}> {
  // Vi har ikke fairway/GIR-tall i DataGolfCache, sa vi tar et glidende snitt
  // av alle registrerte RoundStats i plattformen som proxy for "AK-pyramiden"
  // (alle aktive AK-spillere). Hvis tomt: bruk konservative defaults fra design-fasit.
  const rounds = await prisma.roundStats.findMany({
    select: {
      fairwaysHit: true,
      fairwaysTotal: true,
      gir: true,
      girTotal: true,
    },
    orderBy: { date: "desc" },
    take: 500,
  });

  if (rounds.length === 0) {
    return { girPct: 48, fairwayPct: 55, sampleRounds: 0 };
  }

  let fwHit = 0,
    fwTot = 0,
    girHit = 0,
    girTot = 0;
  for (const r of rounds) {
    fwHit += r.fairwaysHit ?? 0;
    fwTot += r.fairwaysTotal ?? 0;
    girHit += r.gir ?? 0;
    girTot += r.girTotal ?? 0;
  }
  return {
    girPct: girTot > 0 ? Math.round((girHit / girTot) * 100) : 48,
    fairwayPct: fwTot > 0 ? Math.round((fwHit / fwTot) * 100) : 55,
    sampleRounds: rounds.length,
  };
}

/**
 * Bygg AK-pyramide med ekte populasjon per nivå basert pa siste HandicapEntry
 * per bruker. H-K kollapses til ett band (matcher design-fasit).
 */
export async function getPyramidLevels(): Promise<PyramidLevelRow[]> {
  // Hent siste handicap-entry per bruker via raw Prisma (groupBy + max date).
  // Enkel tilnaerming: hent alle entries, behold siste per userId in-memory.
  // Ved store volum: bytt til SQL DISTINCT ON. For naa er datasettet lite.
  const entries = await prisma.handicapEntry.findMany({
    select: { userId: true, handicapIndex: true, date: true },
    orderBy: { date: "desc" },
  });

  const latestByUser = new Map<string, number>();
  for (const e of entries) {
    if (!latestByUser.has(e.userId)) {
      latestByUser.set(e.userId, e.handicapIndex);
    }
  }

  const counts: Record<string, number> = {};
  for (const hcp of latestByUser.values()) {
    const lvl = SKILL_LEVELS.find(
      (l) => hcp >= l.handicapRange[0] && hcp <= l.handicapRange[1],
    );
    if (!lvl) continue;
    counts[lvl.code] = (counts[lvl.code] ?? 0) + 1;
  }

  // Visualisering kollapser H, I, J, K til ett "H-K"-band.
  const popHK =
    (counts["H"] ?? 0) +
    (counts["I"] ?? 0) +
    (counts["J"] ?? 0) +
    (counts["K"] ?? 0);

  const labelFor = (lvl: SkillLevel) => {
    switch (lvl.code) {
      case "A":
        return { name: "Tour-spiller", desc: "Hovedtour - topp 0,1 %" };
      case "B":
        return { name: "Challenge-tour", desc: "Scratch - topp 1 %" };
      case "C":
        return { name: "Elite amator", desc: "Nord - topp 5 %" };
      case "D":
        return { name: "Klubbelite", desc: "Topp klubb-amatorer" };
      case "E":
        return { name: "Kompetent klubbspiller", desc: "Hovedtyngde lavt HCP" };
      case "F":
        return { name: "Erfaren spiller", desc: "Hovedtyngde" };
      case "G":
        return { name: "Bogey-spiller", desc: "Jevn utvikling" };
      default:
        return { name: lvl.labelNO, desc: lvl.description };
    }
  };

  const formatRange = (lvl: SkillLevel) => {
    const [min, max] = lvl.handicapRange;
    if (lvl.code === "A") return `+5.0 ↓`;
    if (lvl.code === "B") return `+2.0 ↓`;
    return `${min}-${max}`;
  };

  const rows: PyramidLevelRow[] = [];
  for (const code of ["A", "B", "C", "D", "E", "F", "G"]) {
    const lvl = SKILL_LEVELS.find((l) => l.code === code);
    if (!lvl) continue;
    const labels = labelFor(lvl);
    rows.push({
      level: code,
      name: labels.name,
      desc: labels.desc,
      hcpRange: formatRange(lvl),
      population: counts[code] ?? 0,
    });
  }

  rows.push({
    level: "H-K",
    name: "Mosjonist - ny spiller",
    desc: "Opplaering & klubbliv",
    hcpRange: "20.1+",
    population: popHK,
  });

  return rows;
}

/** Mapper bruker-HCP til pyramidens label-kode (H-K kollapset). */
export function pyramidLevelCodeForHcp(hcp: number): string {
  const lvl = SKILL_LEVELS.find(
    (l) => hcp >= l.handicapRange[0] && hcp <= l.handicapRange[1],
  );
  if (!lvl) return "H-K";
  if (["H", "I", "J", "K"].includes(lvl.code)) return "H-K";
  return lvl.code;
}
