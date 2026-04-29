/**
 * Seed for de 20 fastsatte AK-golftestene.
 *
 * Kilde: docs/specs/SPILLERKARTLEGGING_SPEC.md (Versjon 1.0, 2026-04-18)
 *
 * Idempotent — kjor flere ganger uten duplikater. Bruker testNumber som unique key.
 *
 * Kjor med:
 *   DATABASE_URL="$(grep '^DIRECT_URL=' .env | cut -d= -f2- | tr -d '"')" npx tsx prisma/seed-tests.ts
 */

import "dotenv/config";
import { prisma } from "../lib/portal/prisma";

interface TestSeed {
  testNumber: number;
  name: string;
  category: "TRACKMAN" | "SHORT_GAME" | "PUTTING" | "PHYSICAL" | "MENTAL";
  unit: string;
  formula: string;
  inputCount: number;
  comparison: "higher_is_better" | "lower_is_better" | "exact_match";
}

const TESTS: TestSeed[] = [
  // ── TRACKMAN (1-7) ─────────────────────────────────────
  {
    testNumber: 1,
    name: "Driver ballhastighet",
    category: "TRACKMAN",
    unit: "mph",
    formula: "max(ballSpeed)",
    inputCount: 5,
    comparison: "higher_is_better",
  },
  {
    testNumber: 2,
    name: "Driver carry",
    category: "TRACKMAN",
    unit: "meter",
    formula: "avg(carry)",
    inputCount: 10,
    comparison: "higher_is_better",
  },
  {
    testNumber: 3,
    name: "Driver spredning",
    category: "TRACKMAN",
    unit: "meter",
    formula: "stddev(lateral)",
    inputCount: 10,
    comparison: "lower_is_better",
  },
  {
    testNumber: 4,
    name: "7-jern carry",
    category: "TRACKMAN",
    unit: "meter",
    formula: "avg(carry)",
    inputCount: 10,
    comparison: "higher_is_better",
  },
  {
    testNumber: 5,
    name: "7-jern spredning",
    category: "TRACKMAN",
    unit: "meter",
    formula: "stddev(lateral)",
    inputCount: 10,
    comparison: "lower_is_better",
  },
  {
    testNumber: 6,
    name: "Wedge avstandskontroll",
    category: "TRACKMAN",
    unit: "prosent",
    formula: "pct_within_tolerance(target=50m, tolerance=±3m)",
    inputCount: 10,
    comparison: "higher_is_better",
  },
  {
    testNumber: 7,
    name: "Smash factor",
    category: "TRACKMAN",
    unit: "ratio",
    formula: "avg(ballSpeed/clubSpeed)",
    inputCount: 5,
    comparison: "higher_is_better",
  },
  // ── SHORT GAME (8-11) ──────────────────────────────────
  {
    testNumber: 8,
    name: "Up-and-down 10-punkt",
    category: "SHORT_GAME",
    unit: "poeng/20",
    formula: "sum(scores) where each shot scored 0-2",
    inputCount: 10,
    comparison: "higher_is_better",
  },
  {
    testNumber: 9,
    name: "Bunkertest 5-punkt",
    category: "SHORT_GAME",
    unit: "meter",
    formula: "avg(distance_to_pin)",
    inputCount: 5,
    comparison: "lower_is_better",
  },
  {
    testNumber: 10,
    name: "Pitch presisjon",
    category: "SHORT_GAME",
    unit: "meter",
    formula: "avg(distance_to_pin) over 20-50m pitches",
    inputCount: 10,
    comparison: "lower_is_better",
  },
  {
    testNumber: 11,
    name: "Flop/lob kontroll",
    category: "SHORT_GAME",
    unit: "antall/5",
    formula: "count(landing_in_zone)",
    inputCount: 5,
    comparison: "higher_is_better",
  },
  // ── PUTTING (12-16) ────────────────────────────────────
  {
    testNumber: 12,
    name: "Putting 1m",
    category: "PUTTING",
    unit: "prosent",
    formula: "(holed / 10) * 100",
    inputCount: 10,
    comparison: "higher_is_better",
  },
  {
    testNumber: 13,
    name: "Putting 3m",
    category: "PUTTING",
    unit: "prosent",
    formula: "(holed / 10) * 100",
    inputCount: 10,
    comparison: "higher_is_better",
  },
  {
    testNumber: 14,
    name: "Putting 6m",
    category: "PUTTING",
    unit: "prosent",
    formula: "(holed / 10) * 100",
    inputCount: 10,
    comparison: "higher_is_better",
  },
  {
    testNumber: 15,
    name: "Fartskontroll 10m",
    category: "PUTTING",
    unit: "cm",
    formula: "avg(|distance_past_hole|)",
    inputCount: 10,
    comparison: "lower_is_better",
  },
  {
    testNumber: 16,
    name: "Gronlesing",
    category: "PUTTING",
    unit: "poeng/5",
    formula: "count(read_correctly)",
    inputCount: 5,
    comparison: "higher_is_better",
  },
  // ── PHYSICAL (17-19) ───────────────────────────────────
  {
    testNumber: 17,
    name: "Rotasjonsmobilitet",
    category: "PHYSICAL",
    unit: "grader",
    formula: "shoulder_rotation_max",
    inputCount: 1,
    comparison: "higher_is_better",
  },
  {
    testNumber: 18,
    name: "Balanse",
    category: "PHYSICAL",
    unit: "sekunder",
    formula: "single_leg_stand_eyes_closed",
    inputCount: 1,
    comparison: "higher_is_better",
  },
  {
    testNumber: 19,
    name: "Eksplosivitet",
    category: "PHYSICAL",
    unit: "meter",
    formula: "broad_jump_distance",
    inputCount: 3,
    comparison: "higher_is_better",
  },
  // ── MENTAL (20) ────────────────────────────────────────
  {
    testNumber: 20,
    name: "Kognitivt under press",
    category: "MENTAL",
    unit: "poeng",
    formula: "stroop_test_score under heart_rate > 130",
    inputCount: 1,
    comparison: "higher_is_better",
  },

  // ═════════════════════════════════════════════════════════
  //  TEAM NORWAY — GOLFSLAG-TESTER (Scorekort GolfslagTester)
  // ═════════════════════════════════════════════════════════

  // ── SHORT GAME: Chip ────────────────────────────────────
  {
    testNumber: 21,
    name: "Chip 10m",
    category: "SHORT_GAME",
    unit: "meter",
    formula: "avg(proximity_to_pin)",
    inputCount: 24,
    comparison: "lower_is_better",
  },
  {
    testNumber: 22,
    name: "Chip 30m",
    category: "SHORT_GAME",
    unit: "meter",
    formula: "avg(proximity_to_pin)",
    inputCount: 24,
    comparison: "lower_is_better",
  },

  // ── SHORT GAME: Wedge ───────────────────────────────────
  {
    testNumber: 23,
    name: "Wedge 20m",
    category: "SHORT_GAME",
    unit: "meter",
    formula: "avg(proximity_to_pin)",
    inputCount: 24,
    comparison: "lower_is_better",
  },
  {
    testNumber: 24,
    name: "Wedge 40m",
    category: "SHORT_GAME",
    unit: "meter",
    formula: "avg(proximity_to_pin)",
    inputCount: 24,
    comparison: "lower_is_better",
  },

  // ── SHORT GAME: Lobb ────────────────────────────────────
  {
    testNumber: 25,
    name: "Lobb 15m",
    category: "SHORT_GAME",
    unit: "meter",
    formula: "avg(proximity_to_pin)",
    inputCount: 24,
    comparison: "lower_is_better",
  },
  {
    testNumber: 26,
    name: "Lobb 25m",
    category: "SHORT_GAME",
    unit: "meter",
    formula: "avg(proximity_to_pin)",
    inputCount: 24,
    comparison: "lower_is_better",
  },

  // ── SHORT GAME: Bunker ──────────────────────────────────
  {
    testNumber: 27,
    name: "Bunker 10m",
    category: "SHORT_GAME",
    unit: "meter",
    formula: "avg(proximity_to_pin)",
    inputCount: 24,
    comparison: "lower_is_better",
  },
  {
    testNumber: 28,
    name: "Bunker 20m",
    category: "SHORT_GAME",
    unit: "meter",
    formula: "avg(proximity_to_pin)",
    inputCount: 24,
    comparison: "lower_is_better",
  },

  // ═════════════════════════════════════════════════════════
  //  TEAM NORWAY — PEI-TESTER
  // ═════════════════════════════════════════════════════════

  {
    testNumber: 29,
    name: "PEI Slagtest 27",
    category: "SHORT_GAME",
    unit: "PEI",
    formula: "avg(pei) where pei = result_distance / target_distance",
    inputCount: 27,
    comparison: "lower_is_better",
  },
  {
    testNumber: 30,
    name: "PEI Wedgetest",
    category: "SHORT_GAME",
    unit: "PEI",
    formula: "avg(pei) where pei = result_distance / target_distance",
    inputCount: 9,
    comparison: "lower_is_better",
  },
  {
    testNumber: 31,
    name: "PEI Test Bane",
    category: "SHORT_GAME",
    unit: "PEI",
    formula: "avg(pei) where pei = result_distance / target_distance",
    inputCount: 18,
    comparison: "lower_is_better",
  },

  // ═════════════════════════════════════════════════════════
  //  TEAM NORWAY — TEKNIKK-TESTER
  // ═════════════════════════════════════════════════════════

  // ── TRACKMAN: Teknikktest Utslag ────────────────────────
  {
    testNumber: 32,
    name: "Teknikktest Utslag — Carry",
    category: "TRACKMAN",
    unit: "meter",
    formula: "median(carry)",
    inputCount: 5,
    comparison: "higher_is_better",
  },
  {
    testNumber: 33,
    name: "Teknikktest Utslag — Spredning",
    category: "TRACKMAN",
    unit: "meter",
    formula: "stddev(lateral_deviation)",
    inputCount: 5,
    comparison: "lower_is_better",
  },

  // ── TRACKMAN: Teknikktest Inspill ───────────────────────
  {
    testNumber: 34,
    name: "Teknikktest Inspill — Carry",
    category: "TRACKMAN",
    unit: "meter",
    formula: "median(carry)",
    inputCount: 10,
    comparison: "higher_is_better",
  },
  {
    testNumber: 35,
    name: "Teknikktest Inspill — Spredning",
    category: "TRACKMAN",
    unit: "meter",
    formula: "stddev(lateral_deviation)",
    inputCount: 10,
    comparison: "lower_is_better",
  },

  // ── SHORT GAME: Gate-tester ─────────────────────────────
  {
    testNumber: 36,
    name: "Nærspill Gate",
    category: "SHORT_GAME",
    unit: "poeng/9",
    formula: "count(landing_in_zone)",
    inputCount: 9,
    comparison: "higher_is_better",
  },
  {
    testNumber: 37,
    name: "VISA Express",
    category: "SHORT_GAME",
    unit: "poeng/9",
    formula: "count(landing_in_zone)",
    inputCount: 9,
    comparison: "higher_is_better",
  },

  // ═════════════════════════════════════════════════════════
  //  TEAM NORWAY — BESLUTNINGSprotokoll
  // ═════════════════════════════════════════════════════════

  {
    testNumber: 38,
    name: "Beslutningsprotokoll",
    category: "MENTAL",
    unit: "meter",
    formula: "avg(|carry_target - actual_carry|)",
    inputCount: 18,
    comparison: "lower_is_better",
  },
];

async function main() {
  console.log(`Seeder ${TESTS.length} TestDefinitions...\n`);

  let created = 0;
  let updated = 0;

  for (const test of TESTS) {
    const existing = await prisma.testDefinition.findUnique({
      where: { testNumber: test.testNumber },
    });

    if (existing) {
      await prisma.testDefinition.update({
        where: { testNumber: test.testNumber },
        data: {
          name: test.name,
          category: test.category,
          unit: test.unit,
          formula: test.formula,
          inputCount: test.inputCount,
          comparison: test.comparison,
        },
      });
      updated += 1;
      console.log(`  [updated] #${test.testNumber} ${test.name}`);
    } else {
      await prisma.testDefinition.create({
        data: {
          testNumber: test.testNumber,
          name: test.name,
          category: test.category,
          unit: test.unit,
          formula: test.formula,
          inputCount: test.inputCount,
          comparison: test.comparison,
        },
      });
      created += 1;
      console.log(`  [created] #${test.testNumber} ${test.name}`);
    }
  }

  console.log(
    `\nFerdig: ${created} opprettet, ${updated} oppdatert. Totalt ${TESTS.length}.`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
