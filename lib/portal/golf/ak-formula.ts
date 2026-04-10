/**
 * AK-formelen — Treningskategorisering fra AK Masterdokument v2.0
 *
 * Økt-ID format: [Pyramide]_[Område]_L-[fase]_CS[nivå]_M[miljø]_PR[press]_[P-posisjon]_[LIFE]
 * Eksempel: TEK_TEE_L-BALL_CS60_M2_PR3_P6.0-P7.0_LIFE-EMO
 */

// =============================================================================
// TRENINGSPYRAMIDEN — 5 nivåer fra fundament til topp
// =============================================================================

export const PYRAMID_LEVELS = {
  FYS: {
    id: "FYS",
    name: "Fysisk",
    description: "Fysisk trening — gym, kondisjon, mobilitet, styrke",
    order: 1,
    color: "#EF4444", // Red
  },
  TEK: {
    id: "TEK",
    name: "Teknikk",
    description: "Teknisk trening — bevegelsesmønster, posisjoner, sving",
    order: 2,
    color: "#F59E0B", // Amber
  },
  SLAG: {
    id: "SLAG",
    name: "Slagtrening",
    description: "Slagkvalitet — avstand, nøyaktighet, ballkontroll",
    order: 3,
    color: "#005840", // Green
  },
  SPILL: {
    id: "SPILL",
    name: "Spilltrening",
    description: "Banemanagement — strategi, beslutninger, simulert spill",
    order: 4,
    color: "#3B82F6", // Blue
  },
  TURN: {
    id: "TURN",
    name: "Turnering",
    description: "Konkurranseforberedelse — press, rutiner, mental forberedelse",
    order: 5,
    color: "#8B5CF6", // Purple
  },
} as const;

export type PyramidLevel = keyof typeof PYRAMID_LEVELS;

// =============================================================================
// TRENINGSOMRÅDER — 16 spesifikke områder
// =============================================================================

export const TRAINING_AREAS = {
  // Full Swing (5)
  TEE: {
    id: "TEE",
    name: "Tee Total",
    category: "FULL_SWING",
    description: "Driver og trejern fra tee",
    sgCategory: "OFF_THE_TEE",
    icon: "wind",
  },
  INN200: {
    id: "INN200",
    name: "Innspill 200+",
    category: "FULL_SWING",
    description: "Innspill over 200 meter",
    sgCategory: "APPROACH",
    icon: "target",
  },
  INN150: {
    id: "INN150",
    name: "Innspill 150-200",
    category: "FULL_SWING",
    description: "Innspill 150-200 meter",
    sgCategory: "APPROACH",
    icon: "target",
  },
  INN100: {
    id: "INN100",
    name: "Innspill 100-150",
    category: "FULL_SWING",
    description: "Innspill 100-150 meter",
    sgCategory: "APPROACH",
    icon: "target",
  },
  INN50: {
    id: "INN50",
    name: "Innspill 50-100",
    category: "FULL_SWING",
    description: "Innspill 50-100 meter",
    sgCategory: "APPROACH",
    icon: "target",
  },

  // Nærspill (4)
  CHIP: {
    id: "CHIP",
    name: "Chipping",
    category: "SHORT_GAME",
    description: "Lavt slag rundt green",
    sgCategory: "AROUND_THE_GREEN",
    icon: "flag",
  },
  PITCH: {
    id: "PITCH",
    name: "Pitching",
    category: "SHORT_GAME",
    description: "Høyt slag 20-50 meter",
    sgCategory: "AROUND_THE_GREEN",
    icon: "flag",
  },
  LOB: {
    id: "LOB",
    name: "Lob",
    category: "SHORT_GAME",
    description: "Høyt slag over hindringer",
    sgCategory: "AROUND_THE_GREEN",
    icon: "flag",
  },
  BUNKER: {
    id: "BUNKER",
    name: "Bunker",
    category: "SHORT_GAME",
    description: "Slag fra sand",
    sgCategory: "AROUND_THE_GREEN",
    icon: "sun",
  },

  // Putting (7 avstander)
  "PUTT0-3": {
    id: "PUTT0-3",
    name: "Putting 0-3 fot",
    category: "PUTTING",
    description: "Korte putts",
    sgCategory: "PUTTING",
    icon: "circle",
  },
  "PUTT3-6": {
    id: "PUTT3-6",
    name: "Putting 3-6 fot",
    category: "PUTTING",
    description: "Parputts",
    sgCategory: "PUTTING",
    icon: "circle",
  },
  "PUTT6-10": {
    id: "PUTT6-10",
    name: "Putting 6-10 fot",
    category: "PUTTING",
    description: "Middels putts",
    sgCategory: "PUTTING",
    icon: "circle",
  },
  "PUTT10-20": {
    id: "PUTT10-20",
    name: "Putting 10-20 fot",
    category: "PUTTING",
    description: "Lengre birdie-putts",
    sgCategory: "PUTTING",
    icon: "circle",
  },
  "PUTT20-40": {
    id: "PUTT20-40",
    name: "Putting 20-40 fot",
    category: "PUTTING",
    description: "Lange putts",
    sgCategory: "PUTTING",
    icon: "circle",
  },
  "PUTT40+": {
    id: "PUTT40+",
    name: "Putting 40+ fot",
    category: "PUTTING",
    description: "Fartskontroll",
    sgCategory: "PUTTING",
    icon: "circle",
  },
} as const;

export type TrainingArea = keyof typeof TRAINING_AREAS;

export const TRAINING_AREA_CATEGORIES = {
  FULL_SWING: { name: "Full Swing", color: "#3B82F6" },
  SHORT_GAME: { name: "Nærspill", color: "#005840" },
  PUTTING: { name: "Putting", color: "#8B5CF6" },
} as const;

// =============================================================================
// L-FASER — Læringsfaser fra bevegelse til automatisering
// =============================================================================

export const L_PHASES = {
  KROPP: {
    id: "KROPP",
    name: "Kropp",
    description: "Fokus på kroppens posisjon og bevegelse",
    order: 1,
  },
  ARM: {
    id: "ARM",
    name: "Arm",
    description: "Fokus på armer og hender",
    order: 2,
  },
  KØLLE: {
    id: "KØLLE",
    name: "Kølle",
    description: "Fokus på køllehodets bane og posisjon",
    order: 3,
  },
  BALL: {
    id: "BALL",
    name: "Ball",
    description: "Fokus på ballkontakt og ballflukt",
    order: 4,
  },
  AUTO: {
    id: "AUTO",
    name: "Auto",
    description: "Automatisert utførelse uten bevisst tanke",
    order: 5,
  },
} as const;

export type LPhase = keyof typeof L_PHASES;

// =============================================================================
// CS — Club Speed (Svinghastighet i % av maks)
// =============================================================================

export const CS_LEVELS = [
  { value: 20, label: "20%", description: "Bevegelsesmønster" },
  { value: 40, label: "40%", description: "Lav hastighet" },
  { value: 60, label: "60%", description: "Middels hastighet" },
  { value: 80, label: "80%", description: "Høy hastighet" },
  { value: 100, label: "100%", description: "Maks hastighet" },
] as const;

// =============================================================================
// M — Miljø (Treningskontekst 0-5)
// =============================================================================

export const M_ENVIRONMENTS = {
  0: {
    value: 0,
    name: "Isolert",
    description: "Alene, innendørs, ingen distraksjoner",
  },
  1: {
    value: 1,
    name: "Kontrollert",
    description: "Driving range, stille forhold",
  },
  2: {
    value: 2,
    name: "Semi-kontrollert",
    description: "Range med andre spillere",
  },
  3: {
    value: 3,
    name: "Bane-lignende",
    description: "Øvingshull, simulert spill",
  },
  4: {
    value: 4,
    name: "Bane",
    description: "Runde på banen, treningsrunde",
  },
  5: {
    value: 5,
    name: "Konkurranse",
    description: "Turnering, fullt konkurransepress",
  },
} as const;

export type MEnvironment = keyof typeof M_ENVIRONMENTS;

// =============================================================================
// PR — Press (Stressnivå 1-5)
// =============================================================================

export const PR_LEVELS = {
  1: {
    value: 1,
    name: "Ingen press",
    description: "Fri trening, ingen konsekvenser",
  },
  2: {
    value: 2,
    name: "Lavt press",
    description: "Personlige mål, selv-evaluering",
  },
  3: {
    value: 3,
    name: "Moderat press",
    description: "Konkurranse mot seg selv, tidsbegrensning",
  },
  4: {
    value: 4,
    name: "Høyt press",
    description: "Konkurranse mot andre, tilskuere",
  },
  5: {
    value: 5,
    name: "Maks press",
    description: "Turneringssituasjon, viktig resultat",
  },
} as const;

export type PRLevel = keyof typeof PR_LEVELS;

// =============================================================================
// P — Posisjon (Sving-posisjon i golfsvinget)
// =============================================================================

export const P_POSITIONS = {
  "P1": { id: "P1", name: "Address", description: "Startposisjon" },
  "P2": { id: "P2", name: "Takeaway", description: "Første bevegelse bak" },
  "P3": { id: "P3", name: "Armer parallelle", description: "Armer parallelle med bakken (baksving)" },
  "P4": { id: "P4", name: "Topp av baksving", description: "Høyeste punkt i baksvingen" },
  "P5": { id: "P5", name: "Armer parallelle", description: "Armer parallelle med bakken (nedsving)" },
  "P6": { id: "P6", name: "Levering", description: "Like før treff" },
  "P7": { id: "P7", name: "Treff", description: "Impact — ballkontakt" },
  "P8": { id: "P8", name: "Armer parallelle", description: "Armer parallelle med bakken (gjennomslag)" },
  "P9": { id: "P9", name: "Finish", description: "Sluttposisjon" },
} as const;

export type PPosition = keyof typeof P_POSITIONS;

// =============================================================================
// LIFE — Mental/livsstil-dimensjoner
// =============================================================================

export const LIFE_DIMENSIONS = {
  SELV: {
    id: "SELV",
    name: "Selvbilde",
    description: "Selvtillit, identitet som golfer",
    color: "#EF4444",
  },
  SOS: {
    id: "SOS",
    name: "Sosial",
    description: "Relasjoner, støtteapparat, coach-forhold",
    color: "#F59E0B",
  },
  EMO: {
    id: "EMO",
    name: "Emosjonell",
    description: "Følelsesregulering, håndtering av press",
    color: "#005840",
  },
  KAR: {
    id: "KAR",
    name: "Karriere",
    description: "Langsiktige mål, balanse golf/utdanning",
    color: "#3B82F6",
  },
  RES: {
    id: "RES",
    name: "Ressurser",
    description: "Tid, økonomi, utstyr, fasiliteter",
    color: "#8B5CF6",
  },
} as const;

export type LifeDimension = keyof typeof LIFE_DIMENSIONS;

// =============================================================================
// SPILLERKATEGORIER — A-K basert på gjennomsnittsscore
// =============================================================================

export const PLAYER_CATEGORIES = {
  A: { id: "A", name: "Verdenselite", minScore: 0, maxScore: 68 },
  B: { id: "B", name: "Nasjonal elite", minScore: 68, maxScore: 72 },
  C: { id: "C", name: "Nasjonal U21", minScore: 72, maxScore: 74 },
  D: { id: "D", name: "Regional elite", minScore: 74, maxScore: 76 },
  E: { id: "E", name: "Regional U18", minScore: 76, maxScore: 78 },
  F: { id: "F", name: "Klubbspiller sr.", minScore: 78, maxScore: 80 },
  G: { id: "G", name: "Klubbspiller jr.", minScore: 80, maxScore: 85 },
  H: { id: "H", name: "Rekrutt senior", minScore: 85, maxScore: 90 },
  I: { id: "I", name: "Rekrutt junior", minScore: 90, maxScore: 95 },
  J: { id: "J", name: "Nybegynner", minScore: 95, maxScore: 108 },
  K: { id: "K", name: "Introduksjon", minScore: 108, maxScore: 200 },
} as const;

export type PlayerCategory = keyof typeof PLAYER_CATEGORIES;

// =============================================================================
// SLAG-KATEGORIER — Strokes Gained-basert fordeling
// =============================================================================

export const SLAG_CATEGORIES = {
  TEE_TOTAL: {
    id: "TEE_TOTAL",
    name: "Tee Total",
    sgShare: 0.26,
    trainingShare: [0.30, 0.35],
    description: "Driver og trejern fra tee",
  },
  APPROACH: {
    id: "APPROACH",
    name: "Approach",
    sgShare: 0.17,
    trainingShare: [0.25, 0.30],
    description: "Innspill over 100 meter",
  },
  NAERSPILL: {
    id: "NAERSPILL",
    name: "Nærspill",
    sgShare: 0.17,
    trainingShare: [0.20, 0.25],
    description: "Slag under 100 meter (ikke putting)",
  },
  PUTTING: {
    id: "PUTTING",
    name: "Putting",
    sgShare: 0.40,
    trainingShare: [0.15, 0.20],
    description: "Alle putts",
  },
} as const;

export type SlagCategory = keyof typeof SLAG_CATEGORIES;

// =============================================================================
// PERIODISERING
// =============================================================================

export const PERIOD_TYPES = {
  GRUNNPERIODE: {
    id: "GRUNNPERIODE",
    name: "Grunnperiode",
    description: "Bygg fundament — fokus på FYS og TEK",
    primaryPyramid: ["FYS", "TEK"],
  },
  SPESIALISERING: {
    id: "SPESIALISERING",
    name: "Spesialiseringsperiode",
    description: "Overfør teknikk til slag — fokus på SLAG",
    primaryPyramid: ["TEK", "SLAG"],
  },
  TURNERING: {
    id: "TURNERING",
    name: "Turneringsperiode",
    description: "Konkurranseforberedelse — fokus på SPILL og TURN",
    primaryPyramid: ["SPILL", "TURN"],
  },
} as const;

export type PeriodType = keyof typeof PERIOD_TYPES;

// =============================================================================
// HJELPEFUNKSJONER
// =============================================================================

/**
 * Generer økt-ID fra kategorisering
 */
export function generateSessionId(params: {
  pyramid: PyramidLevel;
  area: TrainingArea;
  lPhase: LPhase;
  cs: number;
  environment: MEnvironment;
  press: PRLevel;
  pStart?: PPosition;
  pEnd?: PPosition;
  life?: LifeDimension;
}): string {
  const parts = [
    params.pyramid,
    params.area,
    `L-${params.lPhase}`,
    `CS${params.cs}`,
    `M${params.environment}`,
    `PR${params.press}`,
  ];

  if (params.pStart && params.pEnd) {
    parts.push(`${params.pStart}-${params.pEnd}`);
  }

  if (params.life) {
    parts.push(`LIFE-${params.life}`);
  }

  return parts.join("_");
}

/**
 * Parse økt-ID til komponenter
 */
export function parseSessionId(sessionId: string): {
  pyramid?: PyramidLevel;
  area?: TrainingArea;
  lPhase?: LPhase;
  cs?: number;
  environment?: MEnvironment;
  press?: PRLevel;
  pStart?: PPosition;
  pEnd?: PPosition;
  life?: LifeDimension;
} {
  const parts = sessionId.split("_");
  const result: ReturnType<typeof parseSessionId> = {};

  for (const part of parts) {
    if (part in PYRAMID_LEVELS) {
      result.pyramid = part as PyramidLevel;
    } else if (part in TRAINING_AREAS) {
      result.area = part as TrainingArea;
    } else if (part.startsWith("L-")) {
      const phase = part.slice(2);
      if (phase in L_PHASES) {
        result.lPhase = phase as LPhase;
      }
    } else if (part.startsWith("CS")) {
      result.cs = parseInt(part.slice(2), 10);
    } else if (part.startsWith("M") && !part.startsWith("M-")) {
      const env = parseInt(part.slice(1), 10);
      if (env >= 0 && env <= 5) {
        result.environment = env as MEnvironment;
      }
    } else if (part.startsWith("PR")) {
      const pr = parseInt(part.slice(2), 10);
      if (pr >= 1 && pr <= 5) {
        result.press = pr as PRLevel;
      }
    } else if (part.includes("-") && part.startsWith("P")) {
      const [start, end] = part.split("-");
      if (start in P_POSITIONS) result.pStart = start as PPosition;
      if (end in P_POSITIONS) result.pEnd = end as PPosition;
    } else if (part.startsWith("LIFE-")) {
      const dim = part.slice(5);
      if (dim in LIFE_DIMENSIONS) {
        result.life = dim as LifeDimension;
      }
    }
  }

  return result;
}

/**
 * Beregn spillerkategori fra gjennomsnittsscore
 */
export function getPlayerCategory(averageScore: number): PlayerCategory {
  const categories = Object.entries(PLAYER_CATEGORIES);
  for (const [key, cat] of categories) {
    if (averageScore >= cat.minScore && averageScore < cat.maxScore) {
      return key as PlayerCategory;
    }
  }
  return "K"; // Default til laveste kategori
}

/**
 * Hent anbefalt treningsfordeling for kategori
 */
export function getRecommendedTrainingDistribution(category: PlayerCategory): Record<SlagCategory, number> {
  // Justeres basert på spillernivå
  const eliteCategories: PlayerCategory[] = ["A", "B", "C"];
  const isElite = eliteCategories.includes(category);

  return {
    TEE_TOTAL: isElite ? 0.30 : 0.25,
    APPROACH: isElite ? 0.30 : 0.25,
    NAERSPILL: isElite ? 0.25 : 0.30,
    PUTTING: isElite ? 0.15 : 0.20,
  };
}
