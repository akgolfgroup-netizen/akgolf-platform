import type { HoleCardData, StrategyTone } from "./hole-card";

export interface Strategy {
  recommendedClub: string;
  aimPoint: string;
  targetZone: string;
  dangerAreas: string[];
}

export interface Hole {
  id: string;
  holeNumber: number;
  par: number;
  handicap: number;
  lengthMeter: number;
  teeColor?: string;
  strategy?: Strategy | null;
}

export function buildFallbackStrategy(hole: Hole): Strategy {
  const recommendedClub =
    hole.lengthMeter > 400
      ? "Driver"
      : hole.lengthMeter > 300
      ? "3-wood"
      : hole.lengthMeter > 200
      ? "7-jern"
      : "Wedge";
  const aimPoint = hole.handicap <= 5 ? "Sikkert senter fairway" : "Midt fairway";
  const targetZone =
    hole.par === 5
      ? "Green i 2 / opp-ned"
      : hole.par === 3
      ? "Midt green"
      : "Fairway → green";
  const dangerAreas =
    hole.handicap <= 5 ? ["Bunkere", "Rough"] : ["Venstre rough"];
  return { recommendedClub, aimPoint, targetZone, dangerAreas };
}

export function pickTone(hole: Hole, strategy: Strategy): StrategyTone {
  if (hole.par === 3 && hole.lengthMeter < 150) return "aggr";
  if (hole.par === 5 && hole.lengthMeter > 480) return "layup";
  if (strategy.recommendedClub === "Driver") return "aggr";
  return "safe";
}

export function buildHoleCardData(hole: Hole): HoleCardData {
  const strategy = hole.strategy ?? buildFallbackStrategy(hole);
  const tone: StrategyTone = pickTone(hole, strategy);
  const isAuto = !hole.strategy;

  const shots: HoleCardData["shots"] = [];
  shots.push({
    label: hole.par >= 5 ? "Tee" : hole.par === 3 ? "Klubb" : "Tee",
    value: strategy.recommendedClub,
    small:
      hole.par === 3
        ? `${hole.lengthMeter} m`
        : `${Math.round(hole.lengthMeter * 0.65)} m`,
  });
  if (hole.par >= 5) {
    shots.push({ label: "Layup", value: "7-jern", small: "140 m" });
    shots.push({ label: "Inn", value: "PW", small: "105 m" });
  } else if (hole.par === 4) {
    shots.push({
      label: "Inn",
      value: "8-jern",
      small: `${Math.max(80, hole.lengthMeter - 235)} m`,
    });
    shots.push({ label: "Mål", value: strategy.targetZone });
  } else {
    shots.push({ label: "Vind", value: "—" });
    shots.push({ label: "Mål", value: strategy.targetZone });
  }

  const danger = strategy.dangerAreas[0]?.toLowerCase() ?? "";
  const missDirection: HoleCardData["missDirection"] = danger.includes("venstre")
    ? "left"
    : danger.includes("høyre")
    ? "right"
    : "ok";

  return {
    holeNumber: hole.holeNumber,
    par: hole.par,
    lengthMeter: hole.lengthMeter,
    hcp: hole.handicap,
    name: hole.par === 5 ? "Par 5" : hole.par === 3 ? "Par 3" : "Par 4",
    subtitle: strategy.aimPoint,
    tone,
    isAutoSuggestion: isAuto,
    shots,
    missSide: strategy.dangerAreas[0],
    missDirection,
  };
}
