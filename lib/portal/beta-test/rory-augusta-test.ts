/**
 * Beta Test: "Beat Rory at Augusta"
 * Manual testing with comparison to TWO benchmarks:
 * 1. Rory McIlroy (World #1) - The Dream Target
 * 2. PGA Tour Average - The Realistic Target
 * 
 * Based on actual DataGolf and PGA Tour data (2025)
 */

export interface Shot100m {
  shot: number;
  proximity: number; // Distance from target in meters
}

export interface DriveResult {
  drive: number;
  fairwayHit: boolean;
  missSide?: 'LEFT' | 'RIGHT';
  missDistance?: number; // meters from fairway edge
}

export interface Test100mAugusta {
  playerName: string;
  date: string;
  shots: Shot100m[];
  lie: 'MAT' | 'FAIRWAY_GRASS';
  wind: 'NONE' | 'LIGHT' | 'MODERATE';
  clubUsed: string;
}

export interface DriverTestAugusta {
  playerName: string;
  date: string;
  fairwayWidth: 60; // fixed for Augusta benchmark
  drives: DriveResult[];
  wind: 'NONE' | 'LIGHT' | 'MODERATE' | 'STRONG';
  notes?: string;
}

// BENCHMARK LEVELS
type BenchmarkLevel = 'ELITE' | 'TOUR_AVG' | 'GOOD_AMATEUR' | 'DEVELOPING' | 'BEGINNER';

export interface TestResult100m {
  // Player stats
  averageProximity: number;
  makes: number; // shots within 6m
  makeRate: number; // percentage
  bestShot: number;
  worstShot: number;
  
  // Comparison to RORY (Elite benchmark)
  roryAverage: number;
  roryMakes: number;
  roryMakeRate: number;
  proximityDiffRory: number;
  makesDiffRory: number;
  percentageOfRory: number;
  
  // Comparison to TOUR AVERAGE (Realistic benchmark)
  tourAverage: number;
  tourMakes: number;
  tourMakeRate: number;
  proximityDiffTour: number;
  makesDiffTour: number;
  percentageOfTourAvg: number;
  
  // Dual scoring
  vsRory: {
    category: BenchmarkLevel;
    label: string;
    emoji: string;
  };
  vsTourAvg: {
    category: BenchmarkLevel;
    label: string;
    emoji: string;
  };
  
  // Primary recommendation
  recommendation: string;
  nextMilestone: string;
}

export interface TestResultDriver {
  // Player stats
  fairwaysHit: number;
  fairwayRate: number; // percentage
  leftMisses: number;
  rightMisses: number;
  averageMissDistance: number | null;
  bigMisses: number; // >40m from centerline
  
  // Comparison to RORY
  roryFairways: number;
  roryFairwayRate: number;
  roryAverageMiss: number;
  fairwaysDiffRory: number;
  percentageOfRory: number;
  
  // Comparison to TOUR AVERAGE
  tourFairways: number;
  tourFairwayRate: number;
  tourAverageMiss: number;
  fairwaysDiffTour: number;
  percentageOfTourAvg: number;
  
  // Dual scoring
  vsRory: {
    category: BenchmarkLevel;
    label: string;
    emoji: string;
  };
  vsTourAvg: {
    category: BenchmarkLevel;
    label: string;
    emoji: string;
  };
  
  recommendation: string;
  nextMilestone: string;
}

// ============================================================================
// DUAL BENCHMARKS: RORY vs TOUR AVERAGE
// ============================================================================

export const BENCHMARKS = {
  // RORY McILROY - World #1, Masters 2025 Winner (The Dream)
  rory: {
    approach100m: {
      averageProximity: 6.2, // meters (Augusta-adjusted)
      makes: 6.5, // shots within 6m
      makeRate: 65, // percentage
      targetRadius: 6,
    },
    driver: {
      fairways: 5.4, // out of 10
      fairwayRate: 54, // percentage
      averageMiss: 18, // meters from edge
      fairwayWidth: 60,
    },
  },
  
  // PGA TOUR AVERAGE - Realistic benchmark (2025 stats)
  tourAverage: {
    approach100m: {
      averageProximity: 6.4, // meters (~21 feet)
      makes: 6.0, // shots within 6m
      makeRate: 60, // percentage
      targetRadius: 6,
    },
    driver: {
      fairways: 6.0, // out of 10 (60% avg)
      fairwayRate: 60, // percentage
      averageMiss: 16, // meters from edge (better than Rory - more conservative)
      fairwayWidth: 60,
    },
  },
};

// ============================================================================
// CATEGORY DEFINITIONS
// ============================================================================

const APPROACH_CATEGORIES_VS_RORY: Record<BenchmarkLevel, { maxProximity: number; minMakes: number; label: string; emoji: string }> = {
  ELITE: { maxProximity: 6.2, minMakes: 6, label: 'Du slo Rory!', emoji: '🏆' },
  TOUR_AVG: { maxProximity: 6.4, minMakes: 5, label: 'Tour nivå', emoji: '🥇' },
  GOOD_AMATEUR: { maxProximity: 8.5, minMakes: 4, label: 'God amatør', emoji: '🥈' },
  DEVELOPING: { maxProximity: 12, minMakes: 2, label: 'Utvikling', emoji: '🥉' },
  BEGINNER: { maxProximity: Infinity, minMakes: 0, label: 'Nybegynner', emoji: '📚' },
};

const APPROACH_CATEGORIES_VS_TOUR: Record<BenchmarkLevel, { maxProximity: number; minMakes: number; label: string; emoji: string }> = {
  ELITE: { maxProximity: 6.4, minMakes: 6, label: 'Tour Pro!', emoji: '🥇' },
  TOUR_AVG: { maxProximity: 7.5, minMakes: 5, label: 'Nesten Tour', emoji: '⛳' },
  GOOD_AMATEUR: { maxProximity: 9.5, minMakes: 4, label: 'God amatør', emoji: '🥈' },
  DEVELOPING: { maxProximity: 13, minMakes: 2, label: 'Utvikling', emoji: '🥉' },
  BEGINNER: { maxProximity: Infinity, minMakes: 0, label: 'Nybegynner', emoji: '📚' },
};

const DRIVER_CATEGORIES_VS_RORY: Record<BenchmarkLevel, { minFairways: number; maxMiss: number; label: string; emoji: string }> = {
  ELITE: { minFairways: 6, maxMiss: 18, label: 'Du slo Rory!', emoji: '🏆' },
  TOUR_AVG: { minFairways: 5, maxMiss: 20, label: 'Tour nivå', emoji: '🥇' },
  GOOD_AMATEUR: { minFairways: 4, maxMiss: 30, label: 'God amatør', emoji: '🥈' },
  DEVELOPING: { minFairways: 3, maxMiss: 40, label: 'Utvikling', emoji: '🥉' },
  BEGINNER: { minFairways: 0, maxMiss: Infinity, label: 'Trenger trening', emoji: '📚' },
};

const DRIVER_CATEGORIES_VS_TOUR: Record<BenchmarkLevel, { minFairways: number; maxMiss: number; label: string; emoji: string }> = {
  ELITE: { minFairways: 6, maxMiss: 16, label: 'Tour nivå!', emoji: '🥇' },
  TOUR_AVG: { minFairways: 5, maxMiss: 25, label: 'Nesten Tour', emoji: '⛳' },
  GOOD_AMATEUR: { minFairways: 4, maxMiss: 35, label: 'God amatør', emoji: '🥈' },
  DEVELOPING: { minFairways: 3, maxMiss: 45, label: 'Utvikling', emoji: '🥉' },
  BEGINNER: { minFairways: 0, maxMiss: Infinity, label: 'Trenger trening', emoji: '📚' },
};

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

function determineApproachCategory(
  avgProximity: number,
  makes: number,
  categories: typeof APPROACH_CATEGORIES_VS_RORY
): { category: BenchmarkLevel; label: string; emoji: string } {
  for (const [key, data] of Object.entries(categories)) {
    if (avgProximity <= data.maxProximity && makes >= data.minMakes) {
      return {
        category: key as BenchmarkLevel,
        label: data.label,
        emoji: data.emoji,
      };
    }
  }
  return { category: 'BEGINNER', label: categories.BEGINNER.label, emoji: categories.BEGINNER.emoji };
}

function determineDriverCategory(
  fairwaysHit: number,
  avgMiss: number | null,
  categories: typeof DRIVER_CATEGORIES_VS_RORY
): { category: BenchmarkLevel; label: string; emoji: string } {
  for (const [key, data] of Object.entries(categories)) {
    if (fairwaysHit >= data.minFairways && (avgMiss === null || avgMiss <= data.maxMiss)) {
      return {
        category: key as BenchmarkLevel,
        label: data.label,
        emoji: data.emoji,
      };
    }
  }
  return { category: 'BEGINNER', label: categories.BEGINNER.label, emoji: categories.BEGINNER.emoji };
}

function generateApproachRecommendation(
  pctRory: number,
  pctTour: number,
  vsRory: BenchmarkLevel,
  vsTour: BenchmarkLevel
): { recommendation: string; nextMilestone: string } {
  void vsRory;
  void vsTour;
  // Beat both
  if (pctRory >= 100 && pctTour >= 100) {
    return {
      recommendation: 'Imponerende! Du slår både Rory og Tour-snittet. Fortsett å presse grensene!',
      nextMilestone: 'Sikte mot å slå Rory med 10% margin',
    };
  }
  
  // Beat Tour, not Rory
  if (pctTour >= 100 && pctRory < 100) {
    return {
      recommendation: 'Bra jobbet! Du er på Tour-nivå. Rory venter på neste utfordring.',
      nextMilestone: `Forbedre fra ${pctRory.toFixed(0)}% til 100% av Rory`,
    };
  }
  
  // Close to Tour
  if (pctTour >= 80) {
    return {
      recommendation: 'Du er nærme Tour-nivå! Konsistens er nøkkelen.',
      nextMilestone: `Nå Tour-snitt: forbedre ${(100 - pctTour).toFixed(0)}% til`,
    };
  }
  
  // Developing
  if (pctTour >= 60) {
    return {
      recommendation: 'God fremgang! Fokuser på teknikk og repetisjon.',
      nextMilestone: `Nå 80% av Tour-nivå først`,
    };
  }
  
  // Beginner
  return {
    recommendation: 'Alle starter et sted! Øv på grunnleggende teknikk.',
    nextMilestone: 'Fokuser på konsistent kontakt først',
  };
}

function generateDriverRecommendation(
  pctRory: number,
  pctTour: number,
  vsRory: BenchmarkLevel,
  vsTour: BenchmarkLevel
): { recommendation: string; nextMilestone: string } {
  void vsRory;
  void vsTour;
  if (pctRory >= 100 && pctTour >= 100) {
    return {
      recommendation: 'Elite-nivå! Du driver bedre enn verdens beste.',
      nextMilestone: 'Hold konsistens under press',
    };
  }
  
  if (pctTour >= 100 && pctRory < 100) {
    return {
      recommendation: 'Solid Tour-nivå! Driveren er en styrke.',
      nextMilestone: `Treff ${(BENCHMARKS.rory.driver.fairways - BENCHMARKS.tourAverage.driver.fairways).toFixed(1)} flere fairways for å slå Rory`,
    };
  }
  
  if (pctTour >= 80) {
    return {
      recommendation: 'På vei mot Tour-nivå! Jobb med spredningskontroll.',
      nextMilestone: 'Reduser miss-distansen med 3-5 meter',
    };
  }
  
  if (pctTour >= 60) {
    return {
      recommendation: 'God basis. Fokuser på konsistent svingbane.',
      nextMilestone: 'Øk fairway-treff fra 4 til 5 av 10',
    };
  }
  
  return {
    recommendation: 'Driveren trener mest. Øv på rytme og balanse.',
    nextMilestone: 'Få 3 av 10 i fairway som første mål',
  };
}

// ============================================================================
// MAIN CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate 100m approach test results with dual benchmarks
 */
export function calculate100mResult(test: Test100mAugusta): TestResult100m {
  const shots = test.shots.map(s => s.proximity);
  const averageProximity = shots.reduce((a, b) => a + b, 0) / shots.length;
  const makes = shots.filter(p => p <= BENCHMARKS.rory.approach100m.targetRadius).length;
  const makeRate = (makes / shots.length) * 100;
  const bestShot = Math.min(...shots);
  const worstShot = Math.max(...shots);
  
  // Vs Rory
  const rory = BENCHMARKS.rory.approach100m;
  const percentageOfRory = (rory.averageProximity / averageProximity) * 100;
  const vsRory = determineApproachCategory(averageProximity, makes, APPROACH_CATEGORIES_VS_RORY);
  
  // Vs Tour Average
  const tour = BENCHMARKS.tourAverage.approach100m;
  const percentageOfTourAvg = (tour.averageProximity / averageProximity) * 100;
  const vsTourAvg = determineApproachCategory(averageProximity, makes, APPROACH_CATEGORIES_VS_TOUR);
  
  // Recommendation
  const { recommendation, nextMilestone } = generateApproachRecommendation(
    percentageOfRory, percentageOfTourAvg, vsRory.category, vsTourAvg.category
  );
  
  return {
    // Player stats
    averageProximity,
    makes,
    makeRate,
    bestShot,
    worstShot,
    
    // Rory comparison
    roryAverage: rory.averageProximity,
    roryMakes: rory.makes,
    roryMakeRate: rory.makeRate,
    proximityDiffRory: averageProximity - rory.averageProximity,
    makesDiffRory: makes - rory.makes,
    percentageOfRory,
    
    // Tour average comparison
    tourAverage: tour.averageProximity,
    tourMakes: tour.makes,
    tourMakeRate: tour.makeRate,
    proximityDiffTour: averageProximity - tour.averageProximity,
    makesDiffTour: makes - tour.makes,
    percentageOfTourAvg,
    
    // Categories
    vsRory,
    vsTourAvg,
    
    // Recommendation
    recommendation,
    nextMilestone,
  };
}

/**
 * Calculate driver test results with dual benchmarks
 */
export function calculateDriverResult(test: DriverTestAugusta): TestResultDriver {
  const fairwaysHit = test.drives.filter(d => d.fairwayHit).length;
  const fairwayRate = (fairwaysHit / test.drives.length) * 100;
  
  const misses = test.drives.filter(d => !d.fairwayHit);
  const leftMisses = misses.filter(d => d.missSide === 'LEFT').length;
  const rightMisses = misses.filter(d => d.missSide === 'RIGHT').length;
  
  const missDistances = misses
    .map(d => d.missDistance)
    .filter((d): d is number => d !== undefined);
  
  const averageMissDistance = missDistances.length > 0
    ? missDistances.reduce((a, b) => a + b, 0) / missDistances.length
    : null;
  
  const bigMisses = missDistances.filter(d => d > 40).length;
  
  // Vs Rory
  const rory = BENCHMARKS.rory.driver;
  const percentageOfRory = (fairwaysHit / rory.fairways) * 100;
  const vsRory = determineDriverCategory(fairwaysHit, averageMissDistance, DRIVER_CATEGORIES_VS_RORY);
  
  // Vs Tour Average
  const tour = BENCHMARKS.tourAverage.driver;
  const percentageOfTourAvg = (fairwaysHit / tour.fairways) * 100;
  const vsTourAvg = determineDriverCategory(fairwaysHit, averageMissDistance, DRIVER_CATEGORIES_VS_TOUR);
  
  // Recommendation
  const { recommendation, nextMilestone } = generateDriverRecommendation(
    percentageOfRory, percentageOfTourAvg, vsRory.category, vsTourAvg.category
  );
  
  return {
    // Player stats
    fairwaysHit,
    fairwayRate,
    leftMisses,
    rightMisses,
    averageMissDistance,
    bigMisses,
    
    // Rory comparison
    roryFairways: rory.fairways,
    roryFairwayRate: rory.fairwayRate,
    roryAverageMiss: rory.averageMiss,
    fairwaysDiffRory: fairwaysHit - rory.fairways,
    percentageOfRory,
    
    // Tour average comparison
    tourFairways: tour.fairways,
    tourFairwayRate: tour.fairwayRate,
    tourAverageMiss: tour.averageMiss,
    fairwaysDiffTour: fairwaysHit - tour.fairways,
    percentageOfTourAvg,
    
    // Categories
    vsRory,
    vsTourAvg,
    
    // Recommendation
    recommendation,
    nextMilestone,
  };
}

// ============================================================================
// COMBINED SUMMARY
// ============================================================================

export interface CombinedSummary {
  // Percentages
  approachPctRory: number;
  approachPctTour: number;
  driverPctRory: number;
  driverPctTour: number;
  
  // Overall
  avgPctRory: number;
  avgPctTour: number;
  
  // Status
  beatRory: boolean;
  beatTourAvg: boolean;
  
  // Categories
  overallVsRory: { label: string; emoji: string };
  overallVsTour: { label: string; emoji: string };
  
  // Analysis
  strongerArea: 'approach' | 'driver';
  weakerArea: 'approach' | 'driver';
  
  // Goals
  primaryGoal: string;
  stretchGoal: string;
  
  // Weekly focus
  weeklyFocus: 'approach' | 'driver' | 'both';
}

/**
 * Generate combined summary for both tests
 */
export function generateCombinedSummary(
  approachResult: TestResult100m,
  driverResult: TestResultDriver
): CombinedSummary {
  const avgPctRory = (approachResult.percentageOfRory + driverResult.percentageOfRory) / 2;
  const avgPctTour = (approachResult.percentageOfTourAvg + driverResult.percentageOfTourAvg) / 2;
  
  const beatRory = avgPctRory >= 100;
  const beatTourAvg = avgPctTour >= 100;
  
  // Determine overall categories
  let overallVsRory = { label: 'Fortsatt læring', emoji: '📚' };
  if (avgPctRory >= 100) overallVsRory = { label: 'Du slo Rory!', emoji: '🏆' };
  else if (avgPctRory >= 80) overallVsRory = { label: 'Tour nivå', emoji: '🥇' };
  else if (avgPctRory >= 60) overallVsRory = { label: 'God amatør', emoji: '🥈' };
  else if (avgPctRory >= 40) overallVsRory = { label: 'Utvikling', emoji: '🥉' };
  
  let overallVsTour = { label: 'Fortsatt læring', emoji: '📚' };
  if (avgPctTour >= 100) overallVsTour = { label: 'Tour Pro!', emoji: '🥇' };
  else if (avgPctTour >= 80) overallVsTour = { label: 'Nesten Tour', emoji: '⛳' };
  else if (avgPctTour >= 60) overallVsTour = { label: 'God amatør', emoji: '🥈' };
  else if (avgPctTour >= 40) overallVsTour = { label: 'Utvikling', emoji: '🥉' };
  
  // Stronger/weaker area
  const approachAvg = (approachResult.percentageOfRory + approachResult.percentageOfTourAvg) / 2;
  const driverAvg = (driverResult.percentageOfRory + driverResult.percentageOfTourAvg) / 2;
  const strongerArea = approachAvg > driverAvg ? 'approach' : 'driver';
  const weakerArea = approachAvg > driverAvg ? 'driver' : 'approach';
  
  // Goals
  let primaryGoal = '';
  let stretchGoal = '';
  let weeklyFocus: 'approach' | 'driver' | 'both' = 'both';
  
  if (!beatTourAvg) {
    primaryGoal = 'Nå PGA Tour gjennomsnitt';
    stretchGoal = 'Slå Tour-snitt med 10%';
    weeklyFocus = weakerArea;
  } else if (!beatRory) {
    primaryGoal = 'Slå Rory McIlroy';
    stretchGoal = 'Slå Rory med 10% margin';
    weeklyFocus = approachAvg < 100 ? 'approach' : driverAvg < 100 ? 'driver' : 'both';
  } else {
    primaryGoal = 'Hold elite-nivået';
    stretchGoal = 'Bli topp 10 i verden';
    weeklyFocus = 'both';
  }
  
  return {
    approachPctRory: approachResult.percentageOfRory,
    approachPctTour: approachResult.percentageOfTourAvg,
    driverPctRory: driverResult.percentageOfRory,
    driverPctTour: driverResult.percentageOfTourAvg,
    avgPctRory,
    avgPctTour,
    beatRory,
    beatTourAvg,
    overallVsRory,
    overallVsTour,
    strongerArea,
    weakerArea,
    primaryGoal,
    stretchGoal,
    weeklyFocus,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================
