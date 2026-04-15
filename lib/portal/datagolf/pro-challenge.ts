/**
 * PRO CHALLENGE - Utfordre verdens beste på spesifikke situasjoner
 * 
 * Konsept: Spilleren ser hvor god f.eks. Scottie Scheffler er fra 30m fairway,
 * og kan deretter teste seg selv i samme situasjon.
 */

import { getApproachSkill } from "./client";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface ProChallengeScenario {
  id: string;
  name: string;
  category: 'APPROACH' | 'SHORT_GAME' | 'PUTTING';
  
  // Situasjon
  lie: 'TEE' | 'FAIRWAY' | 'ROUGH' | 'SAND' | 'GREEN';
  distance: number;        // Meter til pin
  distanceUnit: 'METERS' | 'YARDS' | 'FEET';
  
  // Test-parametere
  attempts: number;        // F.eks. 10 slag
  targetRadius: number;    // F.eks. 3 meter
  
  // DataGolf-referanse
  dgEndpoint: string;
  dgField?: string;
}

export interface ProPlayerStats {
  playerId: number;
  playerName: string;
  dgRank: number;
  
  // Statistikk for denne situasjonen
  proximity: number;       // Gj.sn. avstand fra hull (meter)
  makeRate: number;        // % innenfor targetRadius
  expectedMakes: number;   // Forventet antall av 10 forsøk
  
  // Fordeling (simulert)
  distribution: {
    inside3m: number;      // %
    inside5m: number;      // %
    inside10m: number;     // %
    outside10m: number;    // %
  };
  
  // Percentil
  tourPercentile: number;  // Hvor god er spilleren vs resten av touren?
}

export interface PlayerChallengeResult {
  scenarioId: string;
  playerId: string;
  
  // Spillerens resultat
  attempts: number;
  makes: number;           // Antall innenfor target
  makeRate: number;        // %
  
  // vs Pro
  vsPro: {
    proPlayerId: number;
    proExpected: number;
    playerActual: number;
    difference: number;    // +2 = spilleren var 2 bedre
    percentage: number;    // 80% = spilleren fikk 80% av proffens resultat
  };
  
  // Simulert "hvis du var proff"
  projectedMakes: number;  // Hvor mange ville du ha gjort med proff-nivå?
  
  // Analyse
  analysis: string;
  tips: string[];
}

// ═══════════════════════════════════════════════════════════════
// SCENARIOS - Pre-definerte utfordringer
// ═══════════════════════════════════════════════════════════════

export const PRO_CHALLENGE_SCENARIOS: ProChallengeScenario[] = [
  // APPROACH - Fairway
  {
    id: 'approach-30m-fairway',
    name: '30m Approach (Fairway)',
    category: 'APPROACH',
    lie: 'FAIRWAY',
    distance: 30,
    distanceUnit: 'METERS',
    attempts: 10,
    targetRadius: 3,
    dgEndpoint: '/preds/approach-skill',
    dgField: '75-100', // yards (30m ≈ 100ft ≈ 33 yards)
  },
  {
    id: 'approach-50m-fairway',
    name: '50m Approach (Fairway)',
    category: 'APPROACH',
    lie: 'FAIRWAY',
    distance: 50,
    distanceUnit: 'METERS',
    attempts: 10,
    targetRadius: 4,
    dgEndpoint: '/preds/approach-skill',
    dgField: '100-125',
  },
  {
    id: 'approach-80m-fairway',
    name: '80m Approach (Fairway)',
    category: 'APPROACH',
    lie: 'FAIRWAY',
    distance: 80,
    distanceUnit: 'METERS',
    attempts: 10,
    targetRadius: 5,
    dgEndpoint: '/preds/approach-skill',
    dgField: '100-125',
  },
  {
    id: 'approach-100m-fairway',
    name: '100m Approach (Fairway)',
    category: 'APPROACH',
    lie: 'FAIRWAY',
    distance: 100,
    distanceUnit: 'METERS',
    attempts: 10,
    targetRadius: 6,
    dgEndpoint: '/preds/approach-skill',
    dgField: '100-125',
  },
  {
    id: 'approach-135m-fairway',
    name: '135m Approach (Fairway)',
    category: 'APPROACH',
    lie: 'FAIRWAY',
    distance: 135,
    distanceUnit: 'METERS',
    attempts: 10,
    targetRadius: 8,
    dgEndpoint: '/preds/approach-skill',
    dgField: '125-150',
  },
  {
    id: 'approach-165m-fairway',
    name: '165m Approach (Fairway)',
    category: 'APPROACH',
    lie: 'FAIRWAY',
    distance: 165,
    distanceUnit: 'METERS',
    attempts: 10,
    targetRadius: 10,
    dgEndpoint: '/preds/approach-skill',
    dgField: '150-175',
  },
  
  // SHORT GAME
  {
    id: 'chip-10m-green',
    name: '10m Chip (Green)',
    category: 'SHORT_GAME',
    lie: 'ROUGH',
    distance: 10,
    distanceUnit: 'METERS',
    attempts: 10,
    targetRadius: 1.5,
    dgEndpoint: '/preds/player-decompositions',
    dgField: 'sg_arg',
  },
  {
    id: 'bunker-5m-greenside',
    name: '5m Bunker Shot',
    category: 'SHORT_GAME',
    lie: 'SAND',
    distance: 5,
    distanceUnit: 'METERS',
    attempts: 10,
    targetRadius: 2,
    dgEndpoint: '/preds/player-decompositions',
    dgField: 'sg_arg',
  },
  
  // PUTTING
  {
    id: 'putt-1m',
    name: '1m Putt',
    category: 'PUTTING',
    lie: 'GREEN',
    distance: 1,
    distanceUnit: 'METERS',
    attempts: 10,
    targetRadius: 0.108, // Hull-diameter (4.25 inches)
    dgEndpoint: '/preds/skill-ratings',
    dgField: 'sg_putt',
  },
  {
    id: 'putt-2m',
    name: '2m Putt',
    category: 'PUTTING',
    lie: 'GREEN',
    distance: 2,
    distanceUnit: 'METERS',
    attempts: 10,
    targetRadius: 0.108,
    dgEndpoint: '/preds/skill-ratings',
    dgField: 'sg_putt',
  },
  {
    id: 'putt-3m',
    name: '3m Putt',
    category: 'PUTTING',
    lie: 'GREEN',
    distance: 3,
    distanceUnit: 'METERS',
    attempts: 10,
    targetRadius: 0.108,
    dgEndpoint: '/preds/skill-ratings',
    dgField: 'sg_putt',
  },
  {
    id: 'putt-6m',
    name: '6m Putt',
    category: 'PUTTING',
    lie: 'GREEN',
    distance: 6,
    distanceUnit: 'METERS',
    attempts: 10,
    targetRadius: 0.108,
    dgEndpoint: '/preds/skill-ratings',
    dgField: 'sg_putt',
  },
];

// ═══════════════════════════════════════════════════════════════
// KALKULASJONER
// ═══════════════════════════════════════════════════════════════

/**
 * Konverter proximity (gj.sn. avstand) til make-rate innenfor radius
 * 
 * Formel: Bruker Rayleigh-fordeling for 2D-proximity
 * https://en.wikipedia.org/wiki/Rayleigh_distribution
 * 
 * Hvis gj.sn. proximity = μ, så er sannsynligheten for å være innenfor radius r:
 * P(dist ≤ r) = 1 - exp(-r²/(2σ²))
 * hvor σ ≈ μ/√(π/2) for Rayleigh-fordeling
 */
function proximityToMakeRate(proximity: number, targetRadius: number): number {
  // For Rayleigh: mean = σ × √(π/2)
  // Så σ = mean / √(π/2) ≈ mean / 1.253
  const sigma = proximity / 1.253;
  
  // P(dist ≤ r) = 1 - exp(-r²/(2σ²))
  const probability = 1 - Math.exp(-(targetRadius ** 2) / (2 * sigma ** 2));
  
  return Math.min(1, Math.max(0, probability));
}

/**
 * Simuler fordeling basert på proximity
 * Forventet fordeling av 10 slag
 */
function simulateDistribution(proximity: number): ProPlayerStats['distribution'] {
  const makeRate3m = proximityToMakeRate(proximity, 3);
  const makeRate5m = proximityToMakeRate(proximity, 5);
  const makeRate10m = proximityToMakeRate(proximity, 10);
  
  return {
    inside3m: Math.round(makeRate3m * 100),
    inside5m: Math.round((makeRate5m - makeRate3m) * 100),
    inside10m: Math.round((makeRate10m - makeRate5m) * 100),
    outside10m: Math.round((1 - makeRate10m) * 100),
  };
}

// ═══════════════════════════════════════════════════════════════
// HENT PROFF-DATA
// ═══════════════════════════════════════════════════════════════

/**
 * Hent statistikk for en spesifikk proff i en situasjon
 */
export async function getProPlayerStats(
  playerId: number,
  scenario: ProChallengeScenario
): Promise<ProPlayerStats | null> {
  try {
    // Hent approach-skill data
    const approachData = await getApproachSkill();
    const playerData = approachData.find(p => p.dg_id === playerId);
    
    if (!playerData) return null;
    
    // Hent proximity for riktig avstand
    let proximity: number | null = null;
    
    if (scenario.dgField === '75-100') proximity = playerData['75-100'];
    else if (scenario.dgField === '100-125') proximity = playerData['100-125'];
    else if (scenario.dgField === '125-150') proximity = playerData['125-150'];
    else if (scenario.dgField === '150-175') proximity = playerData['150-175'];
    else if (scenario.dgField === '175-200') proximity = playerData['175-200'];
    else if (scenario.dgField === '200-225') proximity = playerData['200-225'];
    
    if (!proximity) return null;
    
    // Konverter feet til meter (DataGolf bruker feet)
    const proximityMeters = proximity * 0.3048;
    
    // Beregn make-rate
    const makeRate = proximityToMakeRate(proximityMeters, scenario.targetRadius);
    const expectedMakes = makeRate * scenario.attempts;
    
    // Beregn percentil
    const allProximities = approachData
      .map(p => {
        let prox: number | null = null;
        if (scenario.dgField === '75-100') prox = p['75-100'];
        else if (scenario.dgField === '100-125') prox = p['100-125'];
        // ... etc
        return prox;
      })
      .filter((p): p is number => p !== null)
      .sort((a, b) => a - b); // Lavest proximity = best
    
    const rank = allProximities.findIndex(p => p >= proximity);
    const percentile = Math.round((1 - rank / allProximities.length) * 100);
    
    return {
      playerId: playerData.dg_id,
      playerName: playerData.player_name,
      dgRank: 0, // Hentes separat
      proximity: proximityMeters,
      makeRate: Math.round(makeRate * 100),
      expectedMakes: Math.round(expectedMakes * 10) / 10,
      distribution: simulateDistribution(proximityMeters),
      tourPercentile: percentile,
    };
  } catch (error) {
    console.error('Error fetching pro stats:', error);
    return null;
  }
}

/**
 * Hent top-proffer for et scenario
 */
export async function getTopPlayersForScenario(
  scenario: ProChallengeScenario,
  limit: number = 5
): Promise<ProPlayerStats[]> {
  try {
    const approachData = await getApproachSkill();
    
    // Filtrer og sorter etter proximity
    const sorted = approachData
      .map(player => {
        let proximity: number | null = null;
        if (scenario.dgField === '75-100') proximity = player['75-100'];
        else if (scenario.dgField === '100-125') proximity = player['100-125'];
        else if (scenario.dgField === '125-150') proximity = player['125-150'];
        else if (scenario.dgField === '150-175') proximity = player['150-175'];
        
        return { ...player, proximity };
      })
      .filter((p): p is typeof p & { proximity: number } => p.proximity !== null)
      .sort((a, b) => a.proximity - b.proximity) // Lavest proximity = best
      .slice(0, limit);
    
    return sorted.map((player, index) => {
      const proximityMeters = player.proximity * 0.3048;
      const makeRate = proximityToMakeRate(proximityMeters, scenario.targetRadius);
      const expectedMakes = makeRate * scenario.attempts;
      
      return {
        playerId: player.dg_id,
        playerName: player.player_name,
        dgRank: index + 1,
        proximity: proximityMeters,
        makeRate: Math.round(makeRate * 100),
        expectedMakes: Math.round(expectedMakes * 10) / 10,
        distribution: simulateDistribution(proximityMeters),
        tourPercentile: Math.round((1 - index / approachData.length) * 100),
      };
    });
  } catch (error) {
    console.error('Error fetching top players:', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════
// SPILLER-RESULTAT
// ═══════════════════════════════════════════════════════════════

/**
 * Beregn spillerens resultat vs proff
 */
export function calculatePlayerResult(
  scenario: ProChallengeScenario,
  proStats: ProPlayerStats,
  playerMakes: number
): PlayerChallengeResult {
  const playerMakeRate = (playerMakes / scenario.attempts) * 100;
  const proMakeRate = proStats.makeRate;
  
  // Hvor mange ville proff ha gjort?
  const proExpectedMakes = (proMakeRate / 100) * scenario.attempts;
  
  // Sammenligning
  const difference = playerMakes - proExpectedMakes;
  const percentage = (playerMakeRate / proMakeRate) * 100;
  
  // Generer analyse
  let analysis = '';
  let tips: string[] = [];
  
  if (percentage >= 100) {
    analysis = `Utrolig! Du var like god eller bedre enn ${proStats.playerName}! Dette er Tour-nivå.`;
    tips = [
      'Fortsett med samme teknikk - den fungerer!',
      'Test deg selv fra lenger avstand',
      'Din styrke er denne avstanden - bruk den strategisk på banen',
    ];
  } else if (percentage >= 80) {
    analysis = `Meget bra! Du er på ${Math.round(percentage)}% av ${proStats.playerName}s nivå.`;
    tips = [
      `Fokuser på konsistens - ${proStats.playerName} treffer ${proStats.distribution.inside3m}% innenfor 3m`,
      'Øv med fokus på avstandskontroll, ikke power',
      'Test igjen om en uke og se om du kan nå ${Math.ceil(proExpectedMakes)} av 10',
    ];
  } else if (percentage >= 50) {
    analysis = `Godt forsøk! Du er på ${Math.round(percentage)}% av Tour-nivå.`;
    tips = [
      'Øv mer på denne avstanden - det er ditt utviklingsområde',
      'Fokuser på kontakt og rytme, ikke hastighet',
      `Mål: Kom opp til ${Math.round(proExpectedMakes * 0.8)} av 10 i neste test`,
    ];
  } else {
    analysis = `Du har potensial! ${proStats.playerName} treffer ${proStats.makeRate}% - det kommer med trening.`;
    tips = [
      'Start med kortere avstander og bygg gradvis opp',
      'Fokuser på teknikk først, resultat kommer etter',
      'Øv med 20 slag per økt på denne avstanden',
    ];
  }
  
  return {
    scenarioId: scenario.id,
    playerId: 'current_user',
    attempts: scenario.attempts,
    makes: playerMakes,
    makeRate: Math.round(playerMakeRate),
    vsPro: {
      proPlayerId: proStats.playerId,
      proExpected: Math.round(proExpectedMakes * 10) / 10,
      playerActual: playerMakes,
      difference: Math.round(difference * 10) / 10,
      percentage: Math.round(percentage),
    },
    projectedMakes: Math.round(proExpectedMakes * 10) / 10,
    analysis,
    tips,
  };
}

// ═══════════════════════════════════════════════════════════════
// EKSEMPLER / DEMO-DATA
// ═══════════════════════════════════════════════════════════════

/**
 * Demo-data for når API ikke er tilgjengelig
 */
export const DEMO_PRO_STATS: Record<string, ProPlayerStats[]> = {
  'approach-30m-fairway': [
    {
      playerId: 1,
      playerName: 'Scottie Scheffler',
      dgRank: 1,
      proximity: 2.4,
      makeRate: 78,
      expectedMakes: 7.8,
      distribution: { inside3m: 78, inside5m: 18, inside10m: 3, outside10m: 1 },
      tourPercentile: 99,
    },
    {
      playerId: 2,
      playerName: 'Viktor Hovland',
      dgRank: 5,
      proximity: 2.6,
      makeRate: 72,
      expectedMakes: 7.2,
      distribution: { inside3m: 72, inside5m: 22, inside10m: 5, outside10m: 1 },
      tourPercentile: 95,
    },
    {
      playerId: 3,
      playerName: 'Rory McIlroy',
      dgRank: 3,
      proximity: 2.5,
      makeRate: 75,
      expectedMakes: 7.5,
      distribution: { inside3m: 75, inside5m: 20, inside10m: 4, outside10m: 1 },
      tourPercentile: 97,
    },
  ],
  'approach-100m-fairway': [
    {
      playerId: 1,
      playerName: 'Scottie Scheffler',
      dgRank: 1,
      proximity: 5.8,
      makeRate: 35,
      expectedMakes: 3.5,
      distribution: { inside3m: 35, inside5m: 28, inside10m: 25, outside10m: 12 },
      tourPercentile: 98,
    },
    {
      playerId: 2,
      playerName: 'Viktor Hovland',
      dgRank: 2,
      proximity: 5.5,
      makeRate: 38,
      expectedMakes: 3.8,
      distribution: { inside3m: 38, inside5m: 30, inside10m: 22, outside10m: 10 },
      tourPercentile: 99,
    },
  ],
  'putt-3m': [
    {
      playerId: 1,
      playerName: 'Scottie Scheffler',
      dgRank: 1,
      proximity: 0.108, // Hull-diameter
      makeRate: 96,
      expectedMakes: 9.6,
      distribution: { inside3m: 96, inside5m: 4, inside10m: 0, outside10m: 0 },
      tourPercentile: 95,
    },
    {
      playerId: 4,
      playerName: 'Tiger Woods (prime)',
      dgRank: 2,
      proximity: 0.108,
      makeRate: 98,
      expectedMakes: 9.8,
      distribution: { inside3m: 98, inside5m: 2, inside10m: 0, outside10m: 0 },
      tourPercentile: 99,
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// HJELPEFUNKSJONER
// ═══════════════════════════════════════════════════════════════

/**
 * Formater avstand for visning
 */
export function formatDistance(distance: number, unit: string): string {
  if (unit === 'METERS') return `${distance}m`;
  if (unit === 'YARDS') return `${Math.round(distance * 1.094)} yards`;
  if (unit === 'FEET') return `${Math.round(distance * 3.281)} ft`;
  return `${distance}`;
}

/**
 * Beskriv fordeling på en menneskelig måte
 */
export function describeDistribution(dist: ProPlayerStats['distribution']): string {
  const parts: string[] = [];
  
  if (dist.inside3m > 50) {
    parts.push(`${dist.inside3m}% innenfor 3m`);
  } else {
    parts.push(`${dist.inside3m}% innenfor 3m, ${dist.inside5m}% mellom 3-5m`);
  }
  
  if (dist.outside10m > 10) {
    parts.push(`${dist.outside10m}% bommer med mer enn 10m`);
  }
  
  return parts.join(', ');
}

/**
 * Få emoji basert på performance
 */
export function getPerformanceEmoji(percentage: number): string {
  if (percentage >= 100) return '🏆';
  if (percentage >= 80) return '🔥';
  if (percentage >= 60) return '💪';
  if (percentage >= 40) return '👍';
  return '🌱';
}
