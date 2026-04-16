/**
 * Pro Player Configurations
 * 6 utfordrere: 5 verdensstjerner + Kristoffer Reitan
 * 
 * Hver spiller har unik profil:
 * - Rory: Allrounder, lengst driver
 * - Scottie: Best på approach
 * - Viktor: Sterk iron-spiller
 * - Ludvig: Ung talent, god driver
 * - Tiger (2000): Historisk legende
 * - Kristoffer: Norsk inspirasjon, Challenge Tour nivå
 */

export interface ProPlayerConfig {
  id: string;
  name: string;
  displayName: string;     // Kort navn for UI
  nickname?: string;
  country: string;
  flag: string;            // Emoji flag
  dgId?: number;           // DataGolf ID (null for historiske/ikke-fullt registrert)
  
  // Profil info
  currentRank?: number;
  worldRanking?: number;
  age: number;
  bio: string;
  
  // Spiller-type (for match-making og tips)
  playStyle: 'POWER' | 'ACCURACY' | 'ALLROUND' | 'SHORTGAME' | 'LEGEND';
  
  // Styrker (for AI-analyse)
  strengths: string[];
  weaknesses: string[];
  
  // Scenarioer spilleren støtter
  supportedScenarios: string[];
  
  // Bilde/avatar
  imageUrl?: string;
  color: string;           // Brand color for UI
}

export interface ProPlayerStats {
  proId: string;
  scenarioId: string;
  
  // Core metrics
  proximity: number;       // meter gj.snitt
  makes: number;          // forventet av 10 innenfor target
  makeRate: number;       // prosent
  
  // Fordeling (for visualisering)
  distribution: {
    inside3m: number;      // prosent
    inside6m: number;      // prosent  
    inside10m: number;     // prosent
    outside10m: number;    // prosent
  };
  
  // Metadata
  sampleSize?: string;     // f.eks "2025 sesong"
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'ESTIMATED';
}

// ═══════════════════════════════════════════════════════════════
// SPILLERKONFIGURASJONER
// ═══════════════════════════════════════════════════════════════

export const PRO_PLAYERS: ProPlayerConfig[] = [
  {
    id: 'rory-mcilroy',
    name: 'Rory McIlroy',
    displayName: 'Rory',
    nickname: 'Rors',
    country: 'Northern Ireland',
    flag: '🇬🇧',
    dgId: 10091,
    currentRank: 1,
    worldRanking: 1,
    age: 36,
    bio: 'Fire ganger Major-vinner. Verdens beste driver. Kraftfull men kontrollert.',
    playStyle: 'ALLROUND',
    strengths: ['Driving distance', 'Fairway woods', 'Power', 'Experience'],
    weaknesses: ['Occasional putting struggles under pressure'],
    supportedScenarios: [
      'approach-30m', 'approach-50m', 'approach-80m', 
      'approach-100m', 'approach-135m', 'approach-165m',
      'driver-60m'
    ],
    color: '#10b981', // Emerald green
  },
  
  {
    id: 'scottie-scheffler',
    name: 'Scottie Scheffler',
    displayName: 'Scottie',
    country: 'USA',
    flag: '🇺🇸',
    dgId: 10001,
    currentRank: 2,
    worldRanking: 2,
    age: 28,
    bio: 'Verdens beste approach-spiller. Konsistens-maskin. 2x Masters vinner.',
    playStyle: 'ACCURACY',
    strengths: ['Approach shots', 'Consistency', 'Scrambling', 'Mental game'],
    weaknesses: ['Driving accuracy (til tider)'],
    supportedScenarios: [
      'approach-30m', 'approach-50m', 'approach-80m',
      'approach-100m', 'approach-135m', 'approach-165m',
      'driver-60m'
    ],
    color: '#3b82f6', // Blue
  },
  
  {
    id: 'viktor-hovland',
    name: 'Viktor Hovland',
    displayName: 'Viktor',
    country: 'Norway',
    flag: '🇳🇴',
    dgId: 10023,
    currentRank: 5,
    worldRanking: 5,
    age: 27,
    bio: 'Norges golf-stjerne. Elite iron-spiller. Uslåelig når han er i form.',
    playStyle: 'ACCURACY',
    strengths: ['Iron play', 'Ball striking', 'Driving accuracy', 'Work ethic'],
    weaknesses: ['Short game under pressure', 'Occasional putting struggles'],
    supportedScenarios: [
      'approach-30m', 'approach-50m', 'approach-80m',
      'approach-100m', 'approach-135m', 'approach-165m',
      'driver-60m'
    ],
    color: '#ef4444', // Red (norsk farge)
  },
  
  {
    id: 'ludvig-aberg',
    name: 'Ludvig Åberg',
    displayName: 'Ludvig',
    country: 'Sweden',
    flag: '🇸🇪',
    dgId: 10125,
    currentRank: 8,
    worldRanking: 8,
    age: 25,
    bio: 'Svensk stjerneskudd. Kombinerer lengde og presisjon. Fremtidens stjerne.',
    playStyle: 'POWER',
    strengths: ['Driving distance', 'Youth/athleticism', 'Modern technique', 'Iron play'],
    weaknesses: ['Experience in Majors', 'Short game consistency'],
    supportedScenarios: [
      'approach-50m', 'approach-80m',
      'approach-100m', 'approach-135m',
      'driver-60m'
    ],
    color: '#f59e0b', // Amber/Yellow (svensk farge)
  },
  
  {
    id: 'tiger-woods-prime',
    name: 'Tiger Woods',
    displayName: 'Tiger (2000)',
    nickname: 'GOAT',
    country: 'USA',
    flag: '🇺🇸',
    // Ingen dgId - historisk spiller
    age: 24, // I 2000
    bio: 'Den ultimate konkurrenten. 2000-sesongen: US Open med 15 slag margin. Uslåelig.',
    playStyle: 'LEGEND',
    strengths: ['Everything at peak', 'Mental toughness', 'Clutch putting', 'Distance + accuracy'],
    weaknesses: ['None in 2000'],
    supportedScenarios: [
      'approach-30m', 'approach-50m', 'approach-80m',
      'approach-100m', 'approach-135m', 'approach-165m',
      'driver-60m'
    ],
    color: '#dc2626', // Red (Tiger's Sunday red)
  },
  
  {
    id: 'kristoffer-reitan',
    name: 'Kristoffer Reitan',
    displayName: 'Kristoffer',
    country: 'Norway',
    flag: '🇳🇴',
    // Ingen dgId - ikke full PGA Tour, men norsk relatable
    currentRank: 250, // Estimert Challenge Tour nivå
    age: 28,
    bio: 'Norsk profesjonell på Challenge Tour. Realistisk mål for norske spillere.',
    playStyle: 'ALLROUND',
    strengths: ['Consistency', 'Course management', 'Experience', 'Mental game'],
    weaknesses: ['Driving distance vs Tour elite', 'Short game under pressure'],
    supportedScenarios: [
      'approach-30m', 'approach-50m', 'approach-80m',
      'approach-100m', 'approach-135m',
      'driver-60m'
    ],
    color: '#6366f1', // Indigo (norsk blå)
  },
];

// ═══════════════════════════════════════════════════════════════
// STATISTIKK FOR HVER SPILLER/SCENARIO KOMBINASJON
// ═══════════════════════════════════════════════════════════════

export const PRO_STATS: Record<string, Record<string, ProPlayerStats>> = {
  // RORY MCILROY
  'rory-mcilroy': {
    'approach-30m': {
      proId: 'rory-mcilroy',
      scenarioId: 'approach-30m',
      proximity: 2.5,        // 2.5m = 8.2 feet
      makes: 8.0,           // 8/10 innenfor 3m
      makeRate: 80,
      distribution: { inside3m: 80, inside6m: 15, inside10m: 4, outside10m: 1 },
      sampleSize: '2025 sesong',
      confidence: 'HIGH',
    },
    'approach-50m': {
      proId: 'rory-mcilroy',
      scenarioId: 'approach-50m',
      proximity: 3.8,        // ~12.5 feet
      makes: 7.5,
      makeRate: 75,
      distribution: { inside3m: 45, inside6m: 45, inside10m: 8, outside10m: 2 },
      confidence: 'HIGH',
    },
    'approach-80m': {
      proId: 'rory-mcilroy',
      scenarioId: 'approach-80m',
      proximity: 4.9,
      makes: 7.0,
      makeRate: 70,
      distribution: { inside3m: 35, inside6m: 40, inside10m: 20, outside10m: 5 },
      confidence: 'HIGH',
    },
    'approach-100m': {
      proId: 'rory-mcilroy',
      scenarioId: 'approach-100m',
      proximity: 5.4,        // 100-125y: 18.4 feet = 5.6m
      makes: 6.5,
      makeRate: 65,
      distribution: { inside3m: 30, inside6m: 40, inside10m: 22, outside10m: 8 },
      sampleSize: '2025 sesong',
      confidence: 'HIGH',
    },
    'approach-135m': {
      proId: 'rory-mcilroy',
      scenarioId: 'approach-135m',
      proximity: 6.7,        // 125-150y
      makes: 5.5,
      makeRate: 55,
      distribution: { inside3m: 20, inside6m: 35, inside10m: 32, outside10m: 13 },
      confidence: 'HIGH',
    },
    'approach-165m': {
      proId: 'rory-mcilroy',
      scenarioId: 'approach-165m',
      proximity: 8.2,        // 150-175y
      makes: 4.2,
      makeRate: 42,
      distribution: { inside3m: 12, inside6m: 25, inside10m: 40, outside10m: 23 },
      confidence: 'HIGH',
    },
    'driver-60m': {
      proId: 'rory-mcilroy',
      scenarioId: 'driver-60m',
      proximity: 0,          // Ikke relevant for driver
      makes: 5.4,           // Fairways: 5.4/10
      makeRate: 54,
      distribution: { inside3m: 54, inside6m: 0, inside10m: 0, outside10m: 46 },
      sampleSize: '2025 sesong',
      confidence: 'HIGH',
    },
  },
  
  // SCOTTIE SCHEFFLER
  'scottie-scheffler': {
    'approach-30m': {
      proId: 'scottie-scheffler',
      scenarioId: 'approach-30m',
      proximity: 2.3,        // BEST på korte approacher
      makes: 8.2,
      makeRate: 82,
      distribution: { inside3m: 82, inside6m: 14, inside10m: 3, outside10m: 1 },
      confidence: 'HIGH',
    },
    'approach-50m': {
      proId: 'scottie-scheffler',
      scenarioId: 'approach-50m',
      proximity: 3.5,
      makes: 7.8,
      makeRate: 78,
      distribution: { inside3m: 48, inside6m: 48, inside10m: 3, outside10m: 1 },
      confidence: 'HIGH',
    },
    'approach-80m': {
      proId: 'scottie-scheffler',
      scenarioId: 'approach-80m',
      proximity: 4.6,
      makes: 7.3,
      makeRate: 73,
      distribution: { inside3m: 38, inside6m: 42, inside10m: 17, outside10m: 3 },
      confidence: 'HIGH',
    },
    'approach-100m': {
      proId: 'scottie-scheffler',
      scenarioId: 'approach-100m',
      proximity: 5.1,        // BEST på 100m!
      makes: 6.8,
      makeRate: 68,
      distribution: { inside3m: 32, inside6m: 42, inside10m: 20, outside10m: 6 },
      confidence: 'HIGH',
    },
    'approach-135m': {
      proId: 'scottie-scheffler',
      scenarioId: 'approach-135m',
      proximity: 6.4,
      makes: 5.8,
      makeRate: 58,
      distribution: { inside3m: 22, inside6m: 36, inside10m: 33, outside10m: 9 },
      confidence: 'HIGH',
    },
    'approach-165m': {
      proId: 'scottie-scheffler',
      scenarioId: 'approach-165m',
      proximity: 7.9,
      makes: 4.5,
      makeRate: 45,
      distribution: { inside3m: 15, inside6m: 28, inside10m: 42, outside10m: 15 },
      confidence: 'HIGH',
    },
    'driver-60m': {
      proId: 'scottie-scheffler',
      scenarioId: 'driver-60m',
      proximity: 0,
      makes: 5.8,           // Litt bedre enn Rory på accuracy
      makeRate: 58,
      distribution: { inside3m: 58, inside6m: 0, inside10m: 0, outside10m: 42 },
      confidence: 'HIGH',
    },
  },
  
  // VIKTOR HOVLAND
  'viktor-hovland': {
    'approach-30m': {
      proId: 'viktor-hovland',
      scenarioId: 'approach-30m',
      proximity: 2.6,
      makes: 7.8,
      makeRate: 78,
      distribution: { inside3m: 78, inside6m: 16, inside10m: 5, outside10m: 1 },
      confidence: 'HIGH',
    },
    'approach-50m': {
      proId: 'viktor-hovland',
      scenarioId: 'approach-50m',
      proximity: 3.9,
      makes: 7.2,
      makeRate: 72,
      distribution: { inside3m: 42, inside6m: 46, inside10m: 10, outside10m: 2 },
      confidence: 'HIGH',
    },
    'approach-80m': {
      proId: 'viktor-hovland',
      scenarioId: 'approach-80m',
      proximity: 4.8,
      makes: 7.0,
      makeRate: 70,
      distribution: { inside3m: 36, inside6m: 41, inside10m: 19, outside10m: 4 },
      confidence: 'HIGH',
    },
    'approach-100m': {
      proId: 'viktor-hovland',
      scenarioId: 'approach-100m',
      proximity: 5.6,
      makes: 6.3,
      makeRate: 63,
      distribution: { inside3m: 28, inside6m: 38, inside10m: 25, outside10m: 9 },
      confidence: 'HIGH',
    },
    'approach-135m': {
      proId: 'viktor-hovland',
      scenarioId: 'approach-135m',
      proximity: 6.9,
      makes: 5.2,
      makeRate: 52,
      distribution: { inside3m: 18, inside6m: 32, inside10m: 35, outside10m: 15 },
      confidence: 'HIGH',
    },
    'approach-165m': {
      proId: 'viktor-hovland',
      scenarioId: 'approach-165m',
      proximity: 8.5,
      makes: 3.8,
      makeRate: 38,
      distribution: { inside3m: 10, inside6m: 22, inside10m: 42, outside10m: 26 },
      confidence: 'MEDIUM',
    },
    'driver-60m': {
      proId: 'viktor-hovland',
      scenarioId: 'driver-60m',
      proximity: 0,
      makes: 6.2,           // BEST på driver accuracy!
      makeRate: 62,
      distribution: { inside3m: 62, inside6m: 0, inside10m: 0, outside10m: 38 },
      confidence: 'HIGH',
    },
  },
  
  // LUDVIG ÅBERG
  'ludvig-aberg': {
    'approach-50m': {
      proId: 'ludvig-aberg',
      scenarioId: 'approach-50m',
      proximity: 4.1,
      makes: 6.8,
      makeRate: 68,
      distribution: { inside3m: 38, inside6m: 44, inside10m: 15, outside10m: 3 },
      confidence: 'MEDIUM', // Ny på Tour, mindre data
    },
    'approach-80m': {
      proId: 'ludvig-aberg',
      scenarioId: 'approach-80m',
      proximity: 5.0,
      makes: 6.5,
      makeRate: 65,
      distribution: { inside3m: 32, inside6m: 40, inside10m: 22, outside10m: 6 },
      confidence: 'MEDIUM',
    },
    'approach-100m': {
      proId: 'ludvig-aberg',
      scenarioId: 'approach-100m',
      proximity: 5.8,
      makes: 5.8,
      makeRate: 58,
      distribution: { inside3m: 26, inside6m: 36, inside10m: 27, outside10m: 11 },
      confidence: 'MEDIUM',
    },
    'approach-135m': {
      proId: 'ludvig-aberg',
      scenarioId: 'approach-135m',
      proximity: 7.2,
      makes: 4.8,
      makeRate: 48,
      distribution: { inside3m: 16, inside6m: 30, inside10m: 38, outside10m: 16 },
      confidence: 'MEDIUM',
    },
    'driver-60m': {
      proId: 'ludvig-aberg',
      scenarioId: 'driver-60m',
      proximity: 0,
      makes: 5.2,           // Ung, ennå ikke konsistent
      makeRate: 52,
      distribution: { inside3m: 52, inside6m: 0, inside10m: 0, outside10m: 48 },
      confidence: 'MEDIUM',
    },
  },
  
  // TIGER WOODS (2000 PRIME)
  'tiger-woods-prime': {
    'approach-30m': {
      proId: 'tiger-woods-prime',
      scenarioId: 'approach-30m',
      proximity: 2.1,        // LEGENDARISK
      makes: 8.5,
      makeRate: 85,
      distribution: { inside3m: 85, inside6m: 12, inside10m: 2, outside10m: 1 },
      sampleSize: '2000 sesong',
      confidence: 'ESTIMATED', // Historisk data
    },
    'approach-50m': {
      proId: 'tiger-woods-prime',
      scenarioId: 'approach-50m',
      proximity: 3.2,
      makes: 8.2,
      makeRate: 82,
      distribution: { inside3m: 52, inside6m: 46, inside10m: 1, outside10m: 1 },
      confidence: 'ESTIMATED',
    },
    'approach-80m': {
      proId: 'tiger-woods-prime',
      scenarioId: 'approach-80m',
      proximity: 4.2,
      makes: 7.8,
      makeRate: 78,
      distribution: { inside3m: 42, inside6m: 44, inside10m: 12, outside10m: 2 },
      confidence: 'ESTIMATED',
    },
    'approach-100m': {
      proId: 'tiger-woods-prime',
      scenarioId: 'approach-100m',
      proximity: 4.8,        // BEST noensinne på 100m
      makes: 7.2,
      makeRate: 72,
      distribution: { inside3m: 35, inside6m: 44, inside10m: 18, outside10m: 3 },
      confidence: 'ESTIMATED',
    },
    'approach-135m': {
      proId: 'tiger-woods-prime',
      scenarioId: 'approach-135m',
      proximity: 6.0,
      makes: 6.2,
      makeRate: 62,
      distribution: { inside3m: 24, inside6m: 40, inside10m: 30, outside10m: 6 },
      confidence: 'ESTIMATED',
    },
    'approach-165m': {
      proId: 'tiger-woods-prime',
      scenarioId: 'approach-165m',
      proximity: 7.4,
      makes: 5.0,
      makeRate: 50,
      distribution: { inside3m: 18, inside6m: 32, inside10m: 40, outside10m: 10 },
      confidence: 'ESTIMATED',
    },
    'driver-60m': {
      proId: 'tiger-woods-prime',
      scenarioId: 'driver-60m',
      proximity: 0,
      makes: 6.0,           // Kombinerte lengde OG accuracy
      makeRate: 60,
      distribution: { inside3m: 60, inside6m: 0, inside10m: 0, outside10m: 40 },
      sampleSize: '2000 sesong',
      confidence: 'ESTIMATED',
    },
  },
  
  // KRISTOFFER REITAN (Norsk inspirasjon)
  'kristoffer-reitan': {
    'approach-30m': {
      proId: 'kristoffer-reitan',
      scenarioId: 'approach-30m',
      proximity: 3.5,        // Challenge Tour nivå
      makes: 6.5,
      makeRate: 65,
      distribution: { inside3m: 65, inside6m: 25, inside10m: 8, outside10m: 2 },
      sampleSize: 'Challenge Tour 2024',
      confidence: 'ESTIMATED',
    },
    'approach-50m': {
      proId: 'kristoffer-reitan',
      scenarioId: 'approach-50m',
      proximity: 5.2,
      makes: 5.8,
      makeRate: 58,
      distribution: { inside3m: 32, inside6m: 44, inside10m: 20, outside10m: 4 },
      confidence: 'ESTIMATED',
    },
    'approach-80m': {
      proId: 'kristoffer-reitan',
      scenarioId: 'approach-80m',
      proximity: 6.5,
      makes: 5.0,
      makeRate: 50,
      distribution: { inside3m: 22, inside6m: 36, inside10m: 30, outside10m: 12 },
      confidence: 'ESTIMATED',
    },
    'approach-100m': {
      proId: 'kristoffer-reitan',
      scenarioId: 'approach-100m',
      proximity: 7.8,        // God amatør/pro nivå
      makes: 4.2,
      makeRate: 42,
      distribution: { inside3m: 15, inside6m: 30, inside10m: 35, outside10m: 20 },
      confidence: 'ESTIMATED',
    },
    'approach-135m': {
      proId: 'kristoffer-reitan',
      scenarioId: 'approach-135m',
      proximity: 9.5,
      makes: 3.2,
      makeRate: 32,
      distribution: { inside3m: 8, inside6m: 18, inside10m: 42, outside10m: 32 },
      confidence: 'ESTIMATED',
    },
    'driver-60m': {
      proId: 'kristoffer-reitan',
      scenarioId: 'driver-60m',
      proximity: 0,
      makes: 5.0,           // Solid, ikke spektakulær
      makeRate: 50,
      distribution: { inside3m: 50, inside6m: 0, inside10m: 0, outside10m: 50 },
      confidence: 'ESTIMATED',
    },
  },
};

// ═══════════════════════════════════════════════════════════════
// HJELPEFUNKSJONER
// ═══════════════════════════════════════════════════════════════

export function getProPlayer(proId: string): ProPlayerConfig | undefined {
  return PRO_PLAYERS.find(p => p.id === proId);
}

export function getProStats(proId: string, scenarioId: string): ProPlayerStats | undefined {
  return PRO_STATS[proId]?.[scenarioId];
}

export function getSupportedScenarios(proId: string): string[] {
  const player = getProPlayer(proId);
  return player?.supportedScenarios || [];
}

export function getAllPros(): ProPlayerConfig[] {
  return PRO_PLAYERS;
}

export function getProsByCountry(country: string): ProPlayerConfig[] {
  return PRO_PLAYERS.filter(p => p.country === country);
}

export function getProsByPlayStyle(style: ProPlayerConfig['playStyle']): ProPlayerConfig[] {
  return PRO_PLAYERS.filter(p => p.playStyle === style);
}

// ═══════════════════════════════════════════════════════════════
// SAMMENLIGNINGSFUNKJSON
// ═══════════════════════════════════════════════════════════════

export interface ComparisonResult {
  proId: string;
  proName: string;
  proDisplayName: string;
  proFlag: string;
  proColor: string;
  proStats: ProPlayerStats;
  
  // Brukerens resultat
  userProximity: number;
  userMakes: number;
  
  // Beregning
  percentage: number;      // 73% = 73% av proffens nivå
  difference: number;      // +2.1m = bruker er 2.1m dårligere
  
  // Kategori
  level: 'ELITE' | 'GREAT' | 'GOOD' | 'DEVELOPING' | 'BEGINNER';
  levelEmoji: string;
  message: string;
}

export function compareToPro(
  proId: string,
  scenarioId: string,
  userProximity: number,
  userMakes: number
): ComparisonResult | null {
  const pro = getProPlayer(proId);
  const proStats = getProStats(proId, scenarioId);
  
  if (!pro || !proStats) return null;
  
  const percentage = (proStats.proximity / userProximity) * 100;
  const difference = userProximity - proStats.proximity;
  
  let level: ComparisonResult['level'] = 'BEGINNER';
  let levelEmoji = '🌱';
  let message = '';
  
  if (percentage >= 100) {
    level = 'ELITE';
    levelEmoji = '🏆';
    message = `Utrolig! Du slo ${pro.displayName}!`;
  } else if (percentage >= 85) {
    level = 'GREAT';
    levelEmoji = '🔥';
    message = `Meget bra! Du er på ${Math.round(percentage)}% av ${pro.displayName}.`;
  } else if (percentage >= 70) {
    level = 'GOOD';
    levelEmoji = '💪';
    message = `Godt jobbet! Du er på ${Math.round(percentage)}% av Tour-nivå.`;
  } else if (percentage >= 50) {
    level = 'DEVELOPING';
    levelEmoji = '📈';
    message = `På vei! Du er på ${Math.round(percentage)}%. Fortsett å øve.`;
  } else {
    level = 'BEGINNER';
    levelEmoji = '🌱';
    message = `Alle starter et sted! ${pro.displayName} har trent i årevis.`;
  }
  
  return {
    proId,
    proName: pro.name,
    proDisplayName: pro.displayName,
    proFlag: pro.flag,
    proColor: pro.color,
    proStats,
    userProximity,
    userMakes,
    percentage,
    difference,
    level,
    levelEmoji,
    message,
  };
}

// ═══════════════════════════════════════════════════════════════
// SCENARIO-KONFIGURASJON
// ═══════════════════════════════════════════════════════════════

export interface ChallengeScenario {
  id: string;
  name: string;
  category: 'APPROACH' | 'DRIVER' | 'SHORT_GAME' | 'PUTTING';
  distance: number;        // meter
  lie: 'TEE' | 'FAIRWAY' | 'ROUGH' | 'SAND';
  targetRadius: number;    // meter
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export const CHALLENGE_SCENARIOS: ChallengeScenario[] = [
  {
    id: 'approach-30m',
    name: '30m Approach',
    category: 'APPROACH',
    distance: 30,
    lie: 'FAIRWAY',
    targetRadius: 3,
    description: 'Kort pitch fra fairway',
    difficulty: 1,
  },
  {
    id: 'approach-50m',
    name: '50m Approach',
    category: 'APPROACH',
    distance: 50,
    lie: 'FAIRWAY',
    targetRadius: 4,
    description: 'Mellomdistanse wedge',
    difficulty: 2,
  },
  {
    id: 'approach-80m',
    name: '80m Approach',
    category: 'APPROACH',
    distance: 80,
    lie: 'FAIRWAY',
    targetRadius: 5,
    description: 'Lang wedge / kort jern',
    difficulty: 2,
  },
  {
    id: 'approach-100m',
    name: '100m Approach',
    category: 'APPROACH',
    distance: 100,
    lie: 'FAIRWAY',
    targetRadius: 6,
    description: 'Standard wedge-innspill',
    difficulty: 3,
  },
  {
    id: 'approach-135m',
    name: '135m Approach',
    category: 'APPROACH',
    distance: 135,
    lie: 'FAIRWAY',
    targetRadius: 8,
    description: '9-jern / PW avstand',
    difficulty: 3,
  },
  {
    id: 'approach-165m',
    name: '165m Approach',
    category: 'APPROACH',
    distance: 165,
    lie: 'FAIRWAY',
    targetRadius: 10,
    description: 'Langt jern / hybrid',
    difficulty: 4,
  },
  {
    id: 'driver-60m',
    name: 'Driver Challenge',
    category: 'DRIVER',
    distance: 270,
    lie: 'TEE',
    targetRadius: 30,
    description: 'Treff 30m fairway (Augusta standard)',
    difficulty: 3,
  },
];

export function getScenario(scenarioId: string): ChallengeScenario | undefined {
  return CHALLENGE_SCENARIOS.find(s => s.id === scenarioId);
}

export function getAllScenarios(): ChallengeScenario[] {
  return CHALLENGE_SCENARIOS;
}

export function getScenariosForPro(proId: string): ChallengeScenario[] {
  const player = getProPlayer(proId);
  if (!player) return [];
  return CHALLENGE_SCENARIOS.filter(s => player.supportedScenarios.includes(s.id));
}
