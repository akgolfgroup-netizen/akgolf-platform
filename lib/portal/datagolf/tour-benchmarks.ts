/**
 * PGA Tour Strokes Gained Percentiles
 * Based on historical tour data
 *
 * Positive SG = better than field average
 * Negative SG = worse than field average
 */

export interface TourPercentileData {
  sgTotal: number;
  sgPutt: number;
  sgApp: number;
  sgArg: number;
  sgOtt: number;
}

export const PGA_TOUR_PERCENTILES: Record<string, TourPercentileData> = {
  // Top 10% of PGA Tour
  p90: { sgTotal: 1.8, sgPutt: 0.4, sgApp: 0.6, sgArg: 0.4, sgOtt: 0.4 },
  // Top 25%
  p75: { sgTotal: 1.0, sgPutt: 0.25, sgApp: 0.35, sgArg: 0.2, sgOtt: 0.2 },
  // Median PGA Tour player
  p50: { sgTotal: 0, sgPutt: 0, sgApp: 0, sgArg: 0, sgOtt: 0 },
  // Bottom 25%
  p25: { sgTotal: -1.0, sgPutt: -0.25, sgApp: -0.35, sgArg: -0.2, sgOtt: -0.2 },
  // Bottom 10%
  p10: { sgTotal: -1.8, sgPutt: -0.4, sgApp: -0.6, sgArg: -0.4, sgOtt: -0.4 },
};

type SGCategory = "sgTotal" | "sgPutt" | "sgApp" | "sgArg" | "sgOtt";

/**
 * Calculate which PGA Tour percentile a given SG value falls into
 * @param sgValue - Strokes Gained value
 * @param category - SG category (sgTotal, sgPutt, etc.)
 * @returns Estimated percentile (0-100)
 */
export function calculateTourPercentile(
  sgValue: number,
  category: SGCategory
): number {
  const p90 = PGA_TOUR_PERCENTILES.p90[category];
  const p75 = PGA_TOUR_PERCENTILES.p75[category];
  const p50 = PGA_TOUR_PERCENTILES.p50[category];
  const p25 = PGA_TOUR_PERCENTILES.p25[category];
  const p10 = PGA_TOUR_PERCENTILES.p10[category];

  // Better than top 10%
  if (sgValue >= p90) {
    return Math.min(100, 90 + ((sgValue - p90) / (p90 - p75)) * 10);
  }

  // Between p75 and p90
  if (sgValue >= p75) {
    return 75 + ((sgValue - p75) / (p90 - p75)) * 15;
  }

  // Between p50 and p75
  if (sgValue >= p50) {
    return 50 + ((sgValue - p50) / (p75 - p50)) * 25;
  }

  // Between p25 and p50
  if (sgValue >= p25) {
    return 25 + ((sgValue - p25) / (p50 - p25)) * 25;
  }

  // Between p10 and p25
  if (sgValue >= p10) {
    return 10 + ((sgValue - p10) / (p25 - p10)) * 15;
  }

  // Below bottom 10%
  return Math.max(0, 10 - ((p10 - sgValue) / (p25 - p10)) * 10);
}

/**
 * Get percentile label for display
 */
export function getPercentileLabel(percentile: number): string {
  if (percentile >= 90) return "Topp 10%";
  if (percentile >= 75) return "Topp 25%";
  if (percentile >= 50) return "Over median";
  if (percentile >= 25) return "Under median";
  return "Bunn 25%";
}

/**
 * Get color for percentile display
 */
export function getPercentileColor(percentile: number): string {
  if (percentile >= 75) return "#2D6A4F"; // Green
  if (percentile >= 50) return "#3B82F6"; // Blue
  if (percentile >= 25) return "#F59E0B"; // Amber
  return "#EF4444"; // Red
}

/**
 * Category labels in Norwegian
 */
export const CATEGORY_LABELS: Record<SGCategory, string> = {
  sgTotal: "Total SG",
  sgPutt: "Putting",
  sgApp: "Innspill",
  sgArg: "Naerspill",
  sgOtt: "Utslag",
};
