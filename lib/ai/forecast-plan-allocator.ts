import type {
  CoachingForecastOutput,
  CategoryAllocation,
  SgCategory,
} from "@/lib/portal/predictions/generate-coaching-forecast";
import type { TrainingPlanResult } from "@/lib/portal/ai/training-plan";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ForecastPlanSession {
  dayOfWeek: number; // 1 = Monday … 7 = Sunday
  title: string;
  description: string;
  durationMinutes: number;
  focusArea: string;
  exercises: string[];
  startH?: number;
  startM?: number;
}

// ---------------------------------------------------------------------------
// Mini exercise bank (MVP — deterministic drill selection)
// ---------------------------------------------------------------------------

const DRILL_BANK: Record<
  SgCategory | "TEK" | "SLAG" | "MENTAL" | "FYS",
  string[]
> = {
  OTT: [
    "Driver Accuracy Drill — 15 drivere mot fairway-mål",
    "Add-on Driver Drill — 14 baller, bom = +1 ball",
    "Flight control — 10 høyre-til-venstre, 10 venstre-til-høyre",
    "Target practice — 10 tee-slag mot spesifikt mål",
    "Low/High — 30 baller, veksle høye og lave tee-slag",
  ],
  APP: [
    "110 YARD DRILL — 5 baller 40-110 yard, mål: 24+ greens",
    "Wedge Pyramid — 50-100 yard, gå videre ved landing innen 3 yard",
    "On the 5s — 45/55/65/75+ yard til målgreen, score av 40",
    "Grip Downs — 120 og 150 yard, 1 kølle ekstra, grip ned",
    "88 Shot Challenge — full rutine på hvert slag med 7i-4i",
  ],
  ARG: [
    "9 Hole Up and Downs — 1 ball fra 9 steder, mål: 7/9",
    "6s — 18 hull up-and-down: 6 lette, 6 middels, 6 vanskelige",
    "Shafts — 4 skaft 2-3 ft fra hverandre, bom = start på nytt",
    "Up & Down Club Challenge — SW, PW, 9i, 8i, 7i, hybrid",
    "Houston We Have a Problem — 10 baller i alle ulike leier",
  ],
  PUTT: [
    "3 4 5 Drill — 6/4/2 baller fra 3/4/5 ft, bom = start på nytt",
    "Circle Drill — 6 baller i sirkel, alle 6 fra 2/4/6 ft, 18 på rad",
    "Clock Drill — tees kl 2/6/9/12 på 4 og 5 ft, 8 på rad",
    "Tornado Drill — 2-8 ft i spiral, 1 putt fra hver på rad",
    "Putt Until You Make — putt til innputt fra 15/20/25/30/35/40 ft",
  ],
  TEK: [
    "P-system øving — P1.0 adress til P10.0 finish, 5 repetisjoner",
    "Chalk Line — krittlinje for rett putt, rull ball langs linja",
    "Yard Stick — putt langs yardstick, ballen må holde seg på",
    "Tempo-trening — 3 sekund opptakt, metronom",
  ],
  SLAG: [
    "High/Low (Chipping) — spill høyt og lavt til samme pin, 20 ganger",
    "Landing spots — 3 baller fra utsiden av green, tee ved landingspunkt",
    "Speed Control — 4 baller midt på green, putt til fringe i 4 retninger",
    "Flagstick Drill — 20 baller rundt øvingsgreen, innen flaggstanglengde",
  ],
  MENTAL: [
    "Pre-shot rutine — 5-stegs: vurder → visualiser → føl → setup → utfør",
    "3 åndedrag reset — pust inn 4, hold 4, ut 4",
    "Mental runde — spill full runde i hodet, 1 hull av gangen",
    "Fokussoner — praktiser nideffer-modellen: bredt → smalt → bredt",
  ],
  FYS: [
    "Medisinball kast — 3 kg, 3 rotasjonskast, beste avstand",
    "Vertikalt hopp — 3 stående hopp, beste høyde",
    "Hofterotasjon — goniometer, intern rotasjon liggende",
    "Kjerne/stabilitet — planke 3×45 sek, sideplanke 2×30 sek",
  ],
};

const FOCUS_LABEL: Record<SgCategory | "TEK" | "SLAG" | "MENTAL" | "FYS", string> = {
  OTT: "Utslag",
  APP: "Approach",
  ARG: "Kort spill",
  PUTT: "Putting",
  TEK: "Teknikk",
  SLAG: "Slag",
  MENTAL: "Mental trening",
  FYS: "Fysisk",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pickDrills(
  key: keyof typeof DRILL_BANK,
  count: number,
  seed: number
): string[] {
  const pool = DRILL_BANK[key];
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = (seed + i) % pool.length;
    out.push(pool[idx]);
  }
  return out;
}

function findAllocation(
  forecast: CoachingForecastOutput,
  cat: SgCategory
): CategoryAllocation | undefined {
  return forecast.allocations.find((a) => a.category === cat);
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

// ---------------------------------------------------------------------------
// Main function
// ---------------------------------------------------------------------------

/**
 * Generate a weekly session proposal from a CoachingForecast.
 *
 * MVP logic:
 * 1. primaryFocusCategory → 2 dedicated sessions (60–90 min)
 * 2. General maintenance (TEK / SLAG) → 1–2 sessions (60 min)
 * 3. Mental / physical → 1 session (30–45 min) if mental > 0.2
 * 4. Total = clamp(3–5 sessions) matching requiredHoursPerWeek
 */
export function generateWeekFromForecast(
  forecast: CoachingForecastOutput,
  _existingPlan?: TrainingPlanResult
): ForecastPlanSession[] {
  const primary = forecast.primaryFocusCategory;
  const hoursPerWeek = forecast.requiredHoursPerWeek;
  const primaryAlloc = findAllocation(forecast, primary);

  // Default mental share if allocation missing
  const mentalShare = primaryAlloc?.techTactMentalPhys.mental ?? 0.25;

  // Determine session count based on available hours
  let sessionCount: number;
  if (hoursPerWeek < 3.5) sessionCount = 3;
  else if (hoursPerWeek < 6) sessionCount = 4;
  else sessionCount = 5;

  // Distribute sessions
  const primaryCount = 2;
  const mentalCount = mentalShare > 0.2 ? 1 : 0;
  const maintenanceCount = clamp(
    sessionCount - primaryCount - mentalCount,
    1,
    2
  );

  const totalSessions = primaryCount + maintenanceCount + mentalCount;

  // Spread days: Mon, Wed, Thu, Sat, Sun (skip Tue/Fri for rest)
  const dayPool = [1, 3, 4, 6, 7];
  const chosenDays = dayPool.slice(0, totalSessions);

  // Distribute minutes proportionally
  const baseMinutes = Math.round((hoursPerWeek / totalSessions) * 60);
  const primaryMinutes = clamp(baseMinutes + 15, 60, 90);
  const maintenanceMinutes = clamp(baseMinutes, 45, 75);
  const mentalMinutes = 40;

  const sessions: ForecastPlanSession[] = [];
  let dayIdx = 0;
  let seed = Math.floor(Math.random() * 100);

  // --- Primary focus sessions (2) ---
  for (let i = 0; i < primaryCount; i++) {
    const drills = pickDrills(primary, 2, seed + i);
    sessions.push({
      dayOfWeek: chosenDays[dayIdx++],
      title: `${FOCUS_LABEL[primary]} — fokusøkt ${i + 1}`,
      description: `Prioritert fokusområde fra forecast: ${primary}. Øvelser: ${drills.join("; ")}`,
      durationMinutes: primaryMinutes,
      focusArea: FOCUS_LABEL[primary],
      exercises: drills,
      startH: 17,
      startM: 0,
    });
  }

  // --- Maintenance sessions (1–2) ---
  const maintenanceKeys: Array<"TEK" | "SLAG"> = ["TEK", "SLAG"];
  for (let i = 0; i < maintenanceCount; i++) {
    const key = maintenanceKeys[i % maintenanceKeys.length];
    const drills = pickDrills(key, 2, seed + 10 + i);
    sessions.push({
      dayOfWeek: chosenDays[dayIdx++],
      title: `${FOCUS_LABEL[key]} — vedlikehold`,
      description: `Generell vedlikeholdstrening. Øvelser: ${drills.join("; ")}`,
      durationMinutes: maintenanceMinutes,
      focusArea: FOCUS_LABEL[key],
      exercises: drills,
      startH: 17,
      startM: 0,
    });
  }

  // --- Mental / physical session (0–1) ---
  if (mentalCount > 0) {
    const fysShare = primaryAlloc?.techTactMentalPhys.fys ?? 0.15;
    const isPhysical = fysShare > 0.3;
    const key: "MENTAL" | "FYS" = isPhysical ? "FYS" : "MENTAL";
    const drills = pickDrills(key, 2, seed + 20);
    sessions.push({
      dayOfWeek: chosenDays[dayIdx++],
      title: `${FOCUS_LABEL[key]} — støtteøkt`,
      description: `${isPhysical ? "Fysisk" : "Mental"} støttetrening basert på rotårsaksanalyse. Øvelser: ${drills.join("; ")}`,
      durationMinutes: mentalMinutes,
      focusArea: FOCUS_LABEL[key],
      exercises: drills,
      startH: 17,
      startM: 0,
    });
  }

  return sessions.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
}
