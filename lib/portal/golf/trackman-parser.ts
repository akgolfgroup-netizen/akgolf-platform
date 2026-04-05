/**
 * TrackMan CSV Parser
 * Parser TrackMan Range-eksportert CSV og konverterer til strukturert data.
 */

export interface TrackManShot {
  club: string;
  clubSpeed: number | null;      // mph
  attackAngle: number | null;     // degrees
  clubPath: number | null;        // degrees (+ = in-to-out)
  faceAngle: number | null;       // degrees (+ = open)
  faceToPath: number | null;      // degrees
  ballSpeed: number | null;       // mph
  smashFactor: number | null;
  launchAngle: number | null;     // degrees
  launchDirection: number | null; // degrees (+ = right)
  spinRate: number | null;        // rpm
  spinAxis: number | null;        // degrees
  maxHeight: number | null;       // yards
  landAngle: number | null;       // degrees
  carry: number | null;           // yards
  totalDistance: number | null;    // yards
  offline: number | null;         // yards (+ = right)
}

export interface TrackManShotMetric {
  club: string;
  clubSpeed: number | null;
  attackAngle: number | null;
  clubPath: number | null;
  faceAngle: number | null;
  faceToPath: number | null;
  ballSpeed: number | null;
  smashFactor: number | null;
  launchAngle: number | null;
  launchDirection: number | null;
  spinRate: number | null;
  spinAxis: number | null;
  maxHeight: number | null;      // meter
  landAngle: number | null;
  carry: number | null;          // meter
  totalDistance: number | null;   // meter
  offline: number | null;        // meter
}

const YARDS_TO_METERS = 0.9144;

/**
 * Konverter yards til meter
 */
function yardsToMeters(yards: number | null): number | null {
  return yards !== null ? Math.round(yards * YARDS_TO_METERS * 10) / 10 : null;
}

/**
 * Pars en numerisk verdi fra CSV-celle, handterer tomme og ugyldige verdier
 */
function parseNum(value: string | undefined): number | null {
  if (!value || value.trim() === "" || value === "-" || value === "N/A") {
    return null;
  }
  const cleaned = value.replace(",", ".").trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Normaliser klubbnavn til standard format
 */
function normalizeClub(raw: string): string {
  const club = raw.trim();
  const lower = club.toLowerCase();

  if (lower === "dr" || lower === "driver" || lower === "1w") return "Driver";
  if (lower.match(/^3[ -]?w/)) return "3 Wood";
  if (lower.match(/^5[ -]?w/)) return "5 Wood";
  if (lower.match(/^7[ -]?w/)) return "7 Wood";
  if (lower.match(/^(\d+)[ -]?h/)) return `${lower.match(/^(\d+)/)?.[1]} Hybrid`;
  if (lower.match(/^(\d+)[ -]?i/)) return `${lower.match(/^(\d+)/)?.[1]} Iron`;
  if (lower === "pw" || lower === "pitching wedge") return "PW";
  if (lower === "gw" || lower === "gap wedge") return "GW";
  if (lower === "sw" || lower === "sand wedge") return "SW";
  if (lower === "lw" || lower === "lob wedge") return "LW";
  if (lower.match(/^\d{2}/)) return `${lower.match(/^(\d{2})/)?.[1]} Wedge`;

  return club;
}

/**
 * Detekter header-kolonner i CSV
 * TrackMan eksporterer med varierende kolonnenavn
 */
function detectColumns(headers: string[]): Record<string, number> {
  const map: Record<string, number> = {};
  const normalized = headers.map((h) => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ""));

  const patterns: Record<string, string[]> = {
    club: ["club", "clubtype", "clubname"],
    clubSpeed: ["clubspeed", "clubheadspeed", "speed"],
    attackAngle: ["attackangle", "aoa", "angleofattack"],
    clubPath: ["clubpath", "path", "swingpath"],
    faceAngle: ["faceangle", "face", "faceangletopath"],
    faceToPath: ["facetopath", "ftp"],
    ballSpeed: ["ballspeed"],
    smashFactor: ["smashfactor", "smash"],
    launchAngle: ["launchangle", "launch", "vla"],
    launchDirection: ["launchdirection", "hla", "launchdir"],
    spinRate: ["spinrate", "spin", "backspin"],
    spinAxis: ["spinaxis", "axis"],
    maxHeight: ["maxheight", "height", "apex"],
    landAngle: ["landangle", "landingangle", "descent"],
    carry: ["carry", "carrydistance", "carrydist"],
    totalDistance: ["total", "totaldistance", "totaldist"],
    offline: ["offline", "offlinedistance", "lateral", "side"],
  };

  for (const [field, aliases] of Object.entries(patterns)) {
    const idx = normalized.findIndex((h) => aliases.includes(h));
    if (idx !== -1) map[field] = idx;
  }

  return map;
}

/**
 * Pars TrackMan CSV-innhold til strukturert data
 */
export function parseTrackManCSV(csvContent: string): TrackManShot[] {
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    throw new Error("CSV-filen inneholder ikke nok data (trenger minst header + 1 rad)");
  }

  // Finn header-rad (kan vaere forste eller andre linje)
  let headerIdx = 0;
  if (
    lines[0].toLowerCase().startsWith("trackman") ||
    lines[0].toLowerCase().startsWith("session") ||
    !lines[0].includes(",")
  ) {
    headerIdx = 1;
  }

  const headers = lines[headerIdx].split(",");
  const cols = detectColumns(headers);

  if (!cols.club && !cols.carry) {
    throw new Error("Kunne ikke finne forventede kolonner i CSV-filen. Sjekk at dette er en TrackMan-eksport.");
  }

  const shots: TrackManShot[] = [];

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const cells = lines[i].split(",");
    if (cells.length < 3) continue;

    const clubRaw = cols.club !== undefined ? cells[cols.club] : "";
    if (!clubRaw || clubRaw.trim() === "") continue;

    shots.push({
      club: normalizeClub(clubRaw),
      clubSpeed: parseNum(cells[cols.clubSpeed]),
      attackAngle: parseNum(cells[cols.attackAngle]),
      clubPath: parseNum(cells[cols.clubPath]),
      faceAngle: parseNum(cells[cols.faceAngle]),
      faceToPath: parseNum(cells[cols.faceToPath]),
      ballSpeed: parseNum(cells[cols.ballSpeed]),
      smashFactor: parseNum(cells[cols.smashFactor]),
      launchAngle: parseNum(cells[cols.launchAngle]),
      launchDirection: parseNum(cells[cols.launchDirection]),
      spinRate: parseNum(cells[cols.spinRate]),
      spinAxis: parseNum(cells[cols.spinAxis]),
      maxHeight: parseNum(cells[cols.maxHeight]),
      landAngle: parseNum(cells[cols.landAngle]),
      carry: parseNum(cells[cols.carry]),
      totalDistance: parseNum(cells[cols.totalDistance]),
      offline: parseNum(cells[cols.offline]),
    });
  }

  return shots;
}

/**
 * Konverter TrackMan-slag fra yards til meter
 */
export function convertToMetric(shot: TrackManShot): TrackManShotMetric {
  return {
    ...shot,
    maxHeight: yardsToMeters(shot.maxHeight),
    carry: yardsToMeters(shot.carry),
    totalDistance: yardsToMeters(shot.totalDistance),
    offline: yardsToMeters(shot.offline),
  };
}

/**
 * Grupper slag per klubb og beregn gjennomsnitt
 */
export function aggregateByClub(
  shots: TrackManShotMetric[]
): Array<{
  club: string;
  count: number;
  avgCarry: number;
  avgTotal: number;
  avgOffline: number;
  avgClubSpeed: number | null;
  avgBallSpeed: number | null;
  avgSmashFactor: number | null;
  avgLaunchAngle: number | null;
  avgSpinRate: number | null;
  carryStdDev: number;
  lateralStdDev: number;
}> {
  const groups = new Map<string, TrackManShotMetric[]>();

  for (const shot of shots) {
    const existing = groups.get(shot.club) ?? [];
    existing.push(shot);
    groups.set(shot.club, existing);
  }

  return Array.from(groups.entries()).map(([club, clubShots]) => {
    const carries = clubShots.map((s) => s.carry).filter((v): v is number => v !== null);
    const totals = clubShots.map((s) => s.totalDistance).filter((v): v is number => v !== null);
    const offlines = clubShots.map((s) => s.offline).filter((v): v is number => v !== null);
    const speeds = clubShots.map((s) => s.clubSpeed).filter((v): v is number => v !== null);
    const ballSpeeds = clubShots.map((s) => s.ballSpeed).filter((v): v is number => v !== null);
    const smashFactors = clubShots.map((s) => s.smashFactor).filter((v): v is number => v !== null);
    const launchAngles = clubShots.map((s) => s.launchAngle).filter((v): v is number => v !== null);
    const spinRates = clubShots.map((s) => s.spinRate).filter((v): v is number => v !== null);

    const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    const stdDev = (arr: number[]) => {
      if (arr.length < 2) return 0;
      const mean = avg(arr);
      const variance = arr.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (arr.length - 1);
      return Math.sqrt(variance);
    };
    const avgOrNull = (arr: number[]) => arr.length > 0 ? Math.round(avg(arr) * 10) / 10 : null;

    return {
      club,
      count: clubShots.length,
      avgCarry: Math.round(avg(carries) * 10) / 10,
      avgTotal: Math.round(avg(totals) * 10) / 10,
      avgOffline: Math.round(avg(offlines.map(Math.abs)) * 10) / 10,
      avgClubSpeed: avgOrNull(speeds),
      avgBallSpeed: avgOrNull(ballSpeeds),
      avgSmashFactor: avgOrNull(smashFactors),
      avgLaunchAngle: avgOrNull(launchAngles),
      avgSpinRate: avgOrNull(spinRates),
      carryStdDev: Math.round(stdDev(carries) * 10) / 10,
      lateralStdDev: Math.round(stdDev(offlines) * 10) / 10,
    };
  });
}
