// AK Golf Academy — Trackman Test Data Seed
// Genererer 100 Trackman-tester fordelt på spillerkategorier A-K
// Run: npx tsx scripts/seed-trackman-tests.ts

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Sett SUPABASE_URL og SUPABASE_SERVICE_KEY først.');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// ════════════════════════════════════════════════════════════
// BENCHMARK DATA — basert på Masterdokument §16
// ════════════════════════════════════════════════════════════

type PlayerCategory = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K';

interface CategoryBenchmark {
  driver_cs: [number, number];       // [min, max] club speed
  iron7_cs: [number, number];
  wedge_cs: [number, number];
  ball_speed_driver: [number, number];
  ball_speed_7iron: [number, number];
  smash_factor: [number, number];
  carry_driver: [number, number];
  carry_7iron: [number, number];
  launch_angle_driver: [number, number];
  launch_angle_7iron: [number, number];
  spin_rate_driver: [number, number];
  spin_rate_7iron: [number, number];
  face_angle: [number, number];      // spredning fra target
  club_path: [number, number];
}

const BENCHMARKS: Record<PlayerCategory, CategoryBenchmark> = {
  // Elite (Tour-nivå)
  A: {
    driver_cs: [115, 125],
    iron7_cs: [88, 95],
    wedge_cs: [78, 85],
    ball_speed_driver: [165, 180],
    ball_speed_7iron: [125, 135],
    smash_factor: [1.48, 1.52],
    carry_driver: [270, 300],
    carry_7iron: [165, 180],
    launch_angle_driver: [10, 14],
    launch_angle_7iron: [16, 20],
    spin_rate_driver: [2200, 2800],
    spin_rate_7iron: [6500, 7500],
    face_angle: [-2, 2],
    club_path: [-3, 3],
  },
  // Nasjonal
  B: {
    driver_cs: [110, 118],
    iron7_cs: [84, 90],
    wedge_cs: [75, 82],
    ball_speed_driver: [158, 172],
    ball_speed_7iron: [120, 130],
    smash_factor: [1.46, 1.50],
    carry_driver: [255, 280],
    carry_7iron: [155, 170],
    launch_angle_driver: [11, 15],
    launch_angle_7iron: [17, 21],
    spin_rate_driver: [2400, 3000],
    spin_rate_7iron: [6800, 7800],
    face_angle: [-3, 3],
    club_path: [-4, 4],
  },
  // Regional+
  C: {
    driver_cs: [105, 112],
    iron7_cs: [80, 86],
    wedge_cs: [72, 78],
    ball_speed_driver: [150, 165],
    ball_speed_7iron: [115, 125],
    smash_factor: [1.44, 1.48],
    carry_driver: [240, 265],
    carry_7iron: [145, 160],
    launch_angle_driver: [12, 16],
    launch_angle_7iron: [18, 22],
    spin_rate_driver: [2600, 3200],
    spin_rate_7iron: [7000, 8000],
    face_angle: [-4, 4],
    club_path: [-5, 5],
  },
  // Regional
  D: {
    driver_cs: [100, 108],
    iron7_cs: [76, 82],
    wedge_cs: [68, 75],
    ball_speed_driver: [142, 158],
    ball_speed_7iron: [108, 120],
    smash_factor: [1.42, 1.47],
    carry_driver: [225, 250],
    carry_7iron: [135, 150],
    launch_angle_driver: [13, 17],
    launch_angle_7iron: [19, 23],
    spin_rate_driver: [2800, 3400],
    spin_rate_7iron: [7200, 8200],
    face_angle: [-5, 5],
    club_path: [-6, 6],
  },
  // Klubb+
  E: {
    driver_cs: [95, 103],
    iron7_cs: [72, 78],
    wedge_cs: [65, 72],
    ball_speed_driver: [135, 150],
    ball_speed_7iron: [102, 114],
    smash_factor: [1.40, 1.46],
    carry_driver: [210, 235],
    carry_7iron: [125, 142],
    launch_angle_driver: [13, 18],
    launch_angle_7iron: [20, 24],
    spin_rate_driver: [3000, 3600],
    spin_rate_7iron: [7500, 8500],
    face_angle: [-6, 6],
    club_path: [-7, 7],
  },
  // Klubb
  F: {
    driver_cs: [90, 98],
    iron7_cs: [68, 75],
    wedge_cs: [62, 68],
    ball_speed_driver: [128, 143],
    ball_speed_7iron: [96, 108],
    smash_factor: [1.38, 1.44],
    carry_driver: [195, 220],
    carry_7iron: [115, 132],
    launch_angle_driver: [14, 19],
    launch_angle_7iron: [21, 25],
    spin_rate_driver: [3200, 3800],
    spin_rate_7iron: [7800, 8800],
    face_angle: [-7, 7],
    club_path: [-8, 8],
  },
  // Rekrutt+
  G: {
    driver_cs: [85, 92],
    iron7_cs: [64, 70],
    wedge_cs: [58, 65],
    ball_speed_driver: [120, 135],
    ball_speed_7iron: [90, 102],
    smash_factor: [1.36, 1.42],
    carry_driver: [180, 205],
    carry_7iron: [105, 122],
    launch_angle_driver: [14, 20],
    launch_angle_7iron: [22, 26],
    spin_rate_driver: [3400, 4000],
    spin_rate_7iron: [8000, 9000],
    face_angle: [-8, 8],
    club_path: [-9, 9],
  },
  // Rekrutt
  H: {
    driver_cs: [78, 87],
    iron7_cs: [60, 67],
    wedge_cs: [54, 62],
    ball_speed_driver: [110, 128],
    ball_speed_7iron: [84, 96],
    smash_factor: [1.34, 1.40],
    carry_driver: [165, 190],
    carry_7iron: [95, 112],
    launch_angle_driver: [15, 21],
    launch_angle_7iron: [23, 27],
    spin_rate_driver: [3600, 4200],
    spin_rate_7iron: [8200, 9200],
    face_angle: [-10, 10],
    club_path: [-10, 10],
  },
  // Nybegynner+
  I: {
    driver_cs: [70, 80],
    iron7_cs: [55, 62],
    wedge_cs: [50, 57],
    ball_speed_driver: [98, 118],
    ball_speed_7iron: [76, 90],
    smash_factor: [1.30, 1.38],
    carry_driver: [145, 175],
    carry_7iron: [82, 102],
    launch_angle_driver: [16, 23],
    launch_angle_7iron: [24, 28],
    spin_rate_driver: [3800, 4500],
    spin_rate_7iron: [8500, 9500],
    face_angle: [-12, 12],
    club_path: [-12, 12],
  },
  // Nybegynner
  J: {
    driver_cs: [62, 72],
    iron7_cs: [50, 58],
    wedge_cs: [45, 53],
    ball_speed_driver: [85, 105],
    ball_speed_7iron: [68, 82],
    smash_factor: [1.26, 1.36],
    carry_driver: [125, 155],
    carry_7iron: [70, 90],
    launch_angle_driver: [17, 25],
    launch_angle_7iron: [25, 30],
    spin_rate_driver: [4000, 4800],
    spin_rate_7iron: [8800, 10000],
    face_angle: [-15, 15],
    club_path: [-14, 14],
  },
  // Knøtt
  K: {
    driver_cs: [50, 65],
    iron7_cs: [42, 52],
    wedge_cs: [38, 48],
    ball_speed_driver: [68, 95],
    ball_speed_7iron: [55, 72],
    smash_factor: [1.20, 1.34],
    carry_driver: [95, 130],
    carry_7iron: [55, 78],
    launch_angle_driver: [18, 28],
    launch_angle_7iron: [26, 32],
    spin_rate_driver: [4200, 5200],
    spin_rate_7iron: [9000, 10500],
    face_angle: [-18, 18],
    club_path: [-16, 16],
  },
};

// ════════════════════════════════════════════════════════════
// TEST SPILLERE — én per kategori
// ════════════════════════════════════════════════════════════

const TEST_PLAYERS: Array<{
  name: string;
  email: string;
  category: PlayerCategory;
  birth_date: string;
  handicap: number;
  avg_score: number;
}> = [
  { name: 'Erik Tour', email: 'erik.tour@test.no', category: 'A', birth_date: '1995-03-15', handicap: -2, avg_score: 68 },
  { name: 'Marius Nasjonal', email: 'marius.nasjonal@test.no', category: 'B', birth_date: '1998-07-22', handicap: 2, avg_score: 72 },
  { name: 'Kristian Regional', email: 'kristian.regional@test.no', category: 'C', birth_date: '2001-11-08', handicap: 6, avg_score: 76 },
  { name: 'Thomas Klubb', email: 'thomas.klubb@test.no', category: 'D', birth_date: '2004-02-14', handicap: 10, avg_score: 80 },
  { name: 'Jonas Junior', email: 'jonas.junior@test.no', category: 'E', birth_date: '2007-05-30', handicap: 14, avg_score: 84 },
  { name: 'Oliver Rekrutt', email: 'oliver.rekrutt@test.no', category: 'F', birth_date: '2009-09-12', handicap: 18, avg_score: 88 },
  { name: 'Emil Utvikler', email: 'emil.utvikler@test.no', category: 'G', birth_date: '2011-01-25', handicap: 24, avg_score: 94 },
  { name: 'Magnus Starter', email: 'magnus.starter@test.no', category: 'H', birth_date: '2013-06-18', handicap: 30, avg_score: 100 },
  { name: 'Noah Nybegynner', email: 'noah.nybegynner@test.no', category: 'I', birth_date: '2015-04-05', handicap: 36, avg_score: 108 },
  { name: 'William Knøtt', email: 'william.knott@test.no', category: 'J', birth_date: '2017-08-20', handicap: 45, avg_score: 118 },
  { name: 'Liam Mini', email: 'liam.mini@test.no', category: 'K', birth_date: '2019-12-01', handicap: 54, avg_score: 130 },
];

// ════════════════════════════════════════════════════════════
// HJELPEFUNKSJONER
// ════════════════════════════════════════════════════════════

function rand(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randInt(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}

function generateDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

// Genererer Trackman-slag for en spiller basert på kategori
function generateShots(category: PlayerCategory, clubType: 'driver' | '7iron' | 'wedge', count: number) {
  const b = BENCHMARKS[category];
  const shots = [];

  for (let i = 0; i < count; i++) {
    const clubSpeed = clubType === 'driver'
      ? rand(b.driver_cs[0], b.driver_cs[1])
      : clubType === '7iron'
        ? rand(b.iron7_cs[0], b.iron7_cs[1])
        : rand(b.wedge_cs[0], b.wedge_cs[1]);

    const smashFactor = rand(b.smash_factor[0], b.smash_factor[1]);
    const ballSpeed = Math.round(clubSpeed * smashFactor * 10) / 10;

    const carry = clubType === 'driver'
      ? rand(b.carry_driver[0], b.carry_driver[1])
      : clubType === '7iron'
        ? rand(b.carry_7iron[0], b.carry_7iron[1])
        : rand(b.carry_7iron[0] * 0.55, b.carry_7iron[1] * 0.6); // Wedge ~55-60% of 7iron

    const launchAngle = clubType === 'driver'
      ? rand(b.launch_angle_driver[0], b.launch_angle_driver[1])
      : clubType === '7iron'
        ? rand(b.launch_angle_7iron[0], b.launch_angle_7iron[1])
        : rand(b.launch_angle_7iron[0] + 8, b.launch_angle_7iron[1] + 10); // Wedge higher loft

    const spinRate = clubType === 'driver'
      ? randInt(b.spin_rate_driver[0], b.spin_rate_driver[1])
      : clubType === '7iron'
        ? randInt(b.spin_rate_7iron[0], b.spin_rate_7iron[1])
        : randInt(b.spin_rate_7iron[0] + 1500, b.spin_rate_7iron[1] + 2000); // Wedge more spin

    shots.push({
      club: clubType === 'driver' ? 'Driver' : clubType === '7iron' ? '7-Iron' : 'PW',
      club_speed: clubSpeed,
      ball_speed: ballSpeed,
      smash_factor: smashFactor,
      launch_angle: launchAngle,
      spin_rate: spinRate,
      carry_distance: carry,
      total_distance: Math.round(carry * (clubType === 'driver' ? 1.08 : 1.03) * 10) / 10,
      face_angle: rand(b.face_angle[0], b.face_angle[1]),
      club_path: rand(b.club_path[0], b.club_path[1]),
      attack_angle: clubType === 'driver'
        ? rand(-3, 5)
        : clubType === '7iron'
          ? rand(-6, -2)
          : rand(-8, -4),
      apex_height: clubType === 'driver'
        ? rand(25, 38)
        : clubType === '7iron'
          ? rand(22, 32)
          : rand(18, 28),
      landing_angle: clubType === 'driver'
        ? rand(35, 45)
        : clubType === '7iron'
          ? rand(45, 52)
          : rand(50, 58),
      lateral_landing: rand(b.face_angle[0] * 2, b.face_angle[1] * 2), // Meters off center
    });
  }

  return shots;
}

// ════════════════════════════════════════════════════════════
// SEED-FUNKSJON
// ════════════════════════════════════════════════════════════

async function seed() {
  console.log('🏌️ AK Golf — Seeder Trackman-tester\n');

  // 1. Opprett eller finn spillere
  console.log('1. Oppretter testspillere...');
  const playerIds: Record<string, string> = {};

  for (const p of TEST_PLAYERS) {
    // Sjekk om spiller allerede finnes
    const { data: existing } = await sb
      .from('players')
      .select('id')
      .eq('email', p.email)
      .single();

    if (existing) {
      playerIds[p.category] = existing.id;
      console.log(`   ✓ ${p.name} (${p.category}) — finnes`);
    } else {
      const { data: newPlayer, error } = await sb
        .from('players')
        .insert({
          name: p.name,
          email: p.email,
          category: p.category,
          birth_date: p.birth_date,
          handicap: p.handicap,
          avg_score: p.avg_score,
          current_period: 'GRUNN',
          facilities: ['M0', 'M1', 'M2', 'M3'],
        })
        .select('id')
        .single();

      if (error) {
        console.error(`   ✗ Feil ved opprettelse av ${p.name}:`, error.message);
        continue;
      }
      playerIds[p.category] = newPlayer.id;
      console.log(`   ✓ ${p.name} (${p.category}) — opprettet`);
    }
  }

  // 2. Generer Trackman-økter og slag
  console.log('\n2. Genererer Trackman-økter...');

  const categories = Object.keys(playerIds) as PlayerCategory[];
  const sessionsPerPlayer = Math.ceil(100 / categories.length); // ~9-10 økter per spiller
  let totalSessions = 0;
  let totalShots = 0;

  for (const cat of categories) {
    const playerId = playerIds[cat];
    if (!playerId) continue;

    for (let i = 0; i < sessionsPerPlayer && totalSessions < 100; i++) {
      const daysAgo = randInt(1, 180); // Siste 6 måneder
      const sessionDate = generateDate(daysAgo);

      // Opprett Trackman-økt
      const { data: session, error: sessErr } = await sb
        .from('trackman_sessions')
        .insert({
          player_id: playerId,
          date: sessionDate,
          source: ['screenshot', 'csv', 'manual'][randInt(0, 2)],
          raw_data: {
            session_type: ['range_session', 'club_fitting', 'lesson', 'practice'][randInt(0, 3)],
            location: ['Trackman Range', 'Indoor Simulator', 'Driving Range'][randInt(0, 2)],
          },
        })
        .select('id')
        .single();

      if (sessErr) {
        console.error(`   ✗ Feil ved økt for ${cat}:`, sessErr.message);
        continue;
      }

      // Generer slag for økten
      const driverShots = generateShots(cat, 'driver', randInt(5, 10));
      const ironShots = generateShots(cat, '7iron', randInt(5, 10));
      const wedgeShots = generateShots(cat, 'wedge', randInt(3, 6));
      const allShots = [...driverShots, ...ironShots, ...wedgeShots];

      const shotsToInsert = allShots.map((s, idx) => ({
        trackman_session_id: session.id,
        shot_number: idx + 1,
        ...s,
      }));

      const { error: shotErr } = await sb.from('trackman_shots').insert(shotsToInsert);

      if (shotErr) {
        console.error(`   ✗ Feil ved slag for økt ${session.id}:`, shotErr.message);
        continue;
      }

      totalSessions++;
      totalShots += allShots.length;
    }

    console.log(`   ✓ Kategori ${cat}: ${sessionsPerPlayer} økter`);
  }

  // 3. Generer også test_results for hver spiller
  console.log('\n3. Genererer testresultater...');

  for (const cat of categories) {
    const playerId = playerIds[cat];
    if (!playerId) continue;

    const b = BENCHMARKS[cat];
    const testsPerPlayer = 3; // 3 tester per spiller

    for (let i = 0; i < testsPerPlayer; i++) {
      const daysAgo = randInt(30, 365);
      const testDate = generateDate(daysAgo);

      const testResult = {
        player_id: playerId,
        test_date: testDate,
        driver_cs: rand(b.driver_cs[0], b.driver_cs[1]),
        iron7_cs: rand(b.iron7_cs[0], b.iron7_cs[1]),
        wedge_cs: rand(b.wedge_cs[0], b.wedge_cs[1]),
        driver_pei: rand(60, 85), // Streuning som prosent
        iron7_pei: rand(55, 80),
        wedge_pei: rand(50, 75),
        putt_3ft_pct: cat <= 'D' ? rand(85, 98) : cat <= 'G' ? rand(70, 88) : rand(55, 75),
        putt_6ft_pct: cat <= 'D' ? rand(65, 82) : cat <= 'G' ? rand(50, 68) : rand(35, 55),
        stableford_9: cat <= 'D' ? randInt(17, 24) : cat <= 'G' ? randInt(12, 18) : randInt(6, 13),
        scramble_pct: cat <= 'D' ? rand(40, 65) : cat <= 'G' ? rand(25, 45) : rand(10, 30),
        flexibility_score: cat <= 'F' ? randInt(4, 6) : randInt(2, 4),
        plank_seconds: cat <= 'F' ? randInt(60, 120) : randInt(30, 70),
        balance_seconds: cat <= 'F' ? randInt(20, 45) : randInt(10, 25),
        preshot_score: cat <= 'G' ? randInt(6, 10) : null,
        notes: `Standardisert test - kategori ${cat}`,
        tested_by: 'AK Golf Academy',
      };

      const { error: testErr } = await sb.from('test_results').insert(testResult);

      if (testErr) {
        console.error(`   ✗ Feil ved testresultat for ${cat}:`, testErr.message);
      }
    }
    console.log(`   ✓ Kategori ${cat}: ${testsPerPlayer} tester`);
  }

  // Oppsummering
  console.log('\n════════════════════════════════════════════════');
  console.log('OPPSUMMERING');
  console.log('════════════════════════════════════════════════');
  console.log(`✓ Spillere: ${categories.length}`);
  console.log(`✓ Trackman-økter: ${totalSessions}`);
  console.log(`✓ Trackman-slag: ${totalShots}`);
  console.log(`✓ Testresultater: ${categories.length * 3}`);
  console.log('\nKjør disse MCP-verktøyene for å verifisere:');
  console.log('  • ak_player_list');
  console.log('  • ak_trackman_analyze { player_id, days: 180 }');
  console.log('  • ak_test_compare { player_id }');
}

seed().catch(console.error);
