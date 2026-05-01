import { describe, it, expect } from "vitest";
import { computeDominantBuckets } from "@/lib/portal/golf/distance-buckets";

describe("computeDominantBuckets", () => {
  it("par-3 bane gir kun approach-buckets, ingen tee", () => {
    const holes = Array.from({ length: 9 }, (_, i) => ({
      hole: i + 1,
      par: 3,
      lengthMeters: 120 + i * 15,
    }));
    const result = computeDominantBuckets(holes, 220);
    expect(result.tee).toBe(0);
    expect(result["100-150"] + result["50-100"] + result["<50"] + result["150-200"]).toBeGreaterThan(50);
  });

  it("par-4 bane gir tee + approach", () => {
    const holes = Array.from({ length: 9 }, (_, i) => ({
      hole: i + 1,
      par: 4,
      lengthMeters: 350 + i * 20,
    }));
    const result = computeDominantBuckets(holes, 220);
    expect(result.tee).toBeGreaterThan(0);
    expect(result["50-100"] + result["100-150"]).toBeGreaterThan(0);
  });

  it("standard 18-hulls bane summerer til 100%", () => {
    const holes = [
      // Front 9
      { hole: 1, par: 4, lengthMeters: 380 },
      { hole: 2, par: 3, lengthMeters: 160 },
      { hole: 3, par: 5, lengthMeters: 490 },
      { hole: 4, par: 4, lengthMeters: 360 },
      { hole: 5, par: 4, lengthMeters: 410 },
      { hole: 6, par: 3, lengthMeters: 140 },
      { hole: 7, par: 4, lengthMeters: 390 },
      { hole: 8, par: 5, lengthMeters: 520 },
      { hole: 9, par: 4, lengthMeters: 370 },
      // Back 9
      { hole: 10, par: 4, lengthMeters: 400 },
      { hole: 11, par: 3, lengthMeters: 170 },
      { hole: 12, par: 4, lengthMeters: 380 },
      { hole: 13, par: 5, lengthMeters: 480 },
      { hole: 14, par: 4, lengthMeters: 350 },
      { hole: 15, par: 3, lengthMeters: 130 },
      { hole: 16, par: 4, lengthMeters: 420 },
      { hole: 17, par: 5, lengthMeters: 510 },
      { hole: 18, par: 4, lengthMeters: 390 },
    ];
    const result = computeDominantBuckets(holes, 230);
    const sum = Object.values(result).reduce((a, b) => a + b, 0);
    expect(sum).toBe(100);
  });

  it("lang driver gir kortere approach (mer 50-100/100-150)", () => {
    // 3 par-4 hull på ~380m
    const holes = [
      { hole: 1, par: 4, lengthMeters: 380 },
      { hole: 2, par: 4, lengthMeters: 360 },
      { hole: 3, par: 4, lengthMeters: 400 },
    ];
    const longDriver = computeDominantBuckets(holes, 260);
    const shortDriver = computeDominantBuckets(holes, 180);
    // Med lang driver (260m) er approach 100-120m -> 50-100/100-150
    // Med kort driver (180m) er approach 180-220m -> 150-200/200+
    expect(longDriver["50-100"] + longDriver["100-150"]).toBeGreaterThan(
      shortDriver["50-100"] + shortDriver["100-150"]
    );
  });

  it("par-5 gir tee + to approach-slag", () => {
    const holes = [
      { hole: 1, par: 5, lengthMeters: 480 },
    ];
    const result = computeDominantBuckets(holes, 230);
    expect(result.tee).toBeGreaterThan(0);
    // Driver 230m, rest 250m, 5-jern 200m, rest 50m -> <50
    expect(result["<50"] + result["50-100"]).toBeGreaterThan(0);
  });
});
