/**
 * Skill Level Definitions (A-K) — snittscore-basert (Masterdokument v2.0 §2.1)
 *
 * Kategorier er primært definert av snittscore, IKKE handicap. handicapRange
 * beholdes for bakoverkompatibilitet med eldre kode.
 */

export interface SkillLevel {
  code: string;
  label: string;
  labelNO: string;
  order: number;
  color: string;
  /** Snittscore-range [min, max]. Primærdefinisjon. */
  scoreRange: [number, number];
  /** HCP-range [min, max]. Bakoverkompatibilitet og estimering. */
  handicapRange: [number, number];
  description: string;
  tournamentContext: string;
  /** Anbefalte treningstimer per uke [min, max] sommer. */
  trainingVolumeSummer: [number, number];
  trainingVolumeWinter: [number, number];
  /** Anbefalte turneringsrunder per år [min, max]. */
  tournamentRoundsPerYear: [number, number];
}

export const SKILL_LEVELS: SkillLevel[] = [
  {
    code: "K",
    label: "Beginner Junior",
    labelNO: "Nybegynner jr.",
    order: 1,
    color: "#9CA3AF",
    scoreRange: [100, 150],
    handicapRange: [45, 54],
    description: "Snitt 100+ — Introduksjon til golf",
    tournamentContext: "Lekbaserte interne konkurranser",
    trainingVolumeSummer: [2, 3],
    trainingVolumeWinter: [1, 2],
    tournamentRoundsPerYear: [2, 4],
  },
  {
    code: "J",
    label: "Beginner Senior",
    labelNO: "Nybegynner sr.",
    order: 2,
    color: "#6B7280",
    scoreRange: [95, 100],
    handicapRange: [37, 44],
    description: "Snitt 95-100 — Starter golf aktivt",
    tournamentContext: "Noen klubbturneringer",
    trainingVolumeSummer: [3, 4],
    trainingVolumeWinter: [2, 3],
    tournamentRoundsPerYear: [4, 8],
  },
  {
    code: "I",
    label: "Recruit Junior",
    labelNO: "Rekrutt jr.",
    order: 3,
    color: "#8B5CF6",
    scoreRange: [90, 95],
    handicapRange: [30, 36],
    description: "Snitt 90-95 — Aktiv start",
    tournamentContext: "Introduksjon til turnering",
    trainingVolumeSummer: [4, 6],
    trainingVolumeWinter: [3, 4],
    tournamentRoundsPerYear: [6, 10],
  },
  {
    code: "H",
    label: "Recruit Senior",
    labelNO: "Rekrutt sr.",
    order: 4,
    color: "#A78BFA",
    scoreRange: [85, 90],
    handicapRange: [25, 29],
    description: "Snitt 85-90 — I utvikling",
    tournamentContext: "Klubbturneringer, lav terskel",
    trainingVolumeSummer: [6, 8],
    trainingVolumeWinter: [4, 6],
    tournamentRoundsPerYear: [8, 12],
  },
  {
    code: "G",
    label: "Club Junior",
    labelNO: "Klubbspiller jr.",
    order: 5,
    color: "#3B82F6",
    scoreRange: [80, 85],
    handicapRange: [20, 24],
    description: "Snitt 80-85 — Jevnt aktiv",
    tournamentContext: "Klubbturneringer, Olyo",
    trainingVolumeSummer: [8, 10],
    trainingVolumeWinter: [6, 8],
    tournamentRoundsPerYear: [10, 15],
  },
  {
    code: "F",
    label: "Club Senior",
    labelNO: "Klubbspiller sr.",
    order: 6,
    color: "#60A5FA",
    scoreRange: [78, 80],
    handicapRange: [15, 19],
    description: "Snitt 78-80 — Aktiv klubbspiller",
    tournamentContext: "Olyo, Østlandstour B/C",
    trainingVolumeSummer: [10, 12],
    trainingVolumeWinter: [8, 10],
    tournamentRoundsPerYear: [15, 20],
  },
  {
    code: "E",
    label: "Regional U18",
    labelNO: "Regional U18",
    order: 7,
    color: "#10B981",
    scoreRange: [76, 78],
    handicapRange: [12, 14],
    description: "Snitt 76-78 — VG1-VG2 satsende",
    tournamentContext: "Østlandstour, regionale mesterskap",
    trainingVolumeSummer: [12, 15],
    trainingVolumeWinter: [10, 12],
    tournamentRoundsPerYear: [20, 25],
  },
  {
    code: "D",
    label: "Regional Elite",
    labelNO: "Regional elite",
    order: 8,
    color: "#34D399",
    scoreRange: [74, 76],
    handicapRange: [9, 11],
    description: "Snitt 74-76 — VG2-VG3 sterke juniorer",
    tournamentContext: "Srixon Tour, Østlandstour A",
    trainingVolumeSummer: [15, 20],
    trainingVolumeWinter: [12, 15],
    tournamentRoundsPerYear: [25, 30],
  },
  {
    code: "C",
    label: "National U21",
    labelNO: "Nasjonal U21",
    order: 9,
    color: "#F59E0B",
    scoreRange: [72, 74],
    handicapRange: [6, 8],
    description: "Snitt 72-74 — Landslag U21, NTG",
    tournamentContext: "Srixon Tour, nasjonale mesterskap",
    trainingVolumeSummer: [20, 25],
    trainingVolumeWinter: [15, 18],
    tournamentRoundsPerYear: [30, 35],
  },
  {
    code: "B",
    label: "National Elite",
    labelNO: "Nasjonal elite",
    order: 10,
    color: "#FBBF24",
    scoreRange: [68, 72],
    handicapRange: [3, 5],
    description: "Snitt 68-72 — Team Norway, topp amatører",
    tournamentContext: "Norgescup, Srixon Elite",
    trainingVolumeSummer: [25, 30],
    trainingVolumeWinter: [18, 22],
    tournamentRoundsPerYear: [25, 30],
  },
  {
    code: "A",
    label: "World Elite",
    labelNO: "Verdenselite",
    order: 11,
    color: "#EF4444",
    scoreRange: [0, 68],
    handicapRange: [-5, 2],
    description: "Snitt <68 — OWGR Topp 150",
    tournamentContext: "PGA Tour, DP World Tour",
    trainingVolumeSummer: [30, 35],
    trainingVolumeWinter: [20, 25],
    tournamentRoundsPerYear: [25, 30],
  },
];

/**
 * PRIMÆR: Finn kategori basert på snittscore.
 */
export function getSkillLevelByScore(
  avgScore: number
): SkillLevel | undefined {
  return SKILL_LEVELS.find(
    (l) => avgScore >= l.scoreRange[0] && avgScore < l.scoreRange[1] + 0.0001
  );
}

/**
 * Bakoverkompatibilitet: Finn kategori basert på HCP.
 * Bruk heller getSkillLevelByScore når snittscore er tilgjengelig.
 */
export function getSkillLevelByHandicap(
  handicap: number
): SkillLevel | undefined {
  return SKILL_LEVELS.find(
    (l) =>
      handicap >= l.handicapRange[0] && handicap <= l.handicapRange[1]
  );
}

export function getSkillLevelByCode(code: string): SkillLevel | undefined {
  return SKILL_LEVELS.find((l) => l.code === code);
}

/**
 * Neste kategori opp (A er høyeste og har ingen neste).
 */
export function getNextLevel(code: string): SkillLevel | undefined {
  const current = getSkillLevelByCode(code);
  if (!current) return undefined;
  return SKILL_LEVELS.find((l) => l.order === current.order + 1);
}
