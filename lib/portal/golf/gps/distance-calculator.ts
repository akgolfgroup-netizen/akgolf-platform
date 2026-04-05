/**
 * GPS Distance Calculator
 *
 * Haversine-basert avstandsberegning for golf.
 * Brukes til live-avstand fra spiller til green under runde.
 */

const EARTH_RADIUS_METERS = 6_371_000;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Beregn avstand mellom to GPS-koordinater i meter (Haversine-formel).
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_METERS * c);
}

/**
 * Beregn avstand til green (front, senter, bak).
 * greenLat/greenLon antas a vaere senter av green.
 * Front/bak estimeres +/- 12m (gjennomsnittlig green-dybde ~24m).
 */
export function getDistanceToPin(
  playerLat: number,
  playerLon: number,
  greenLat: number,
  greenLon: number,
  greenDepthMeters = 24
): { front: number; center: number; back: number } {
  const center = haversineDistance(playerLat, playerLon, greenLat, greenLon);
  const halfDepth = Math.round(greenDepthMeters / 2);

  return {
    front: Math.max(0, center - halfDepth),
    center,
    back: center + halfDepth,
  };
}

/**
 * Juster avstand for hoydeforskjell og vind ("plays as"-avstand).
 *
 * Tommelregler:
 * - Hoyde: +/- 1 meter per 1 meter hoydeforskjell (for lengre slag)
 * - Medvind: -1% per 5 km/t
 * - Motvind: +2% per 5 km/t (motvind pavirker mer enn medvind)
 *
 * @param distance   — faktisk avstand i meter
 * @param elevation  — hoydeforskjell i meter (+ = oppover)
 * @param windSpeed  — vindhastighet i m/s
 * @param windDirection — vindens retning relativt til slagretning
 *                        0 = medvind, 180 = motvind, 90/270 = sidevind
 */
export function playsAsDistance(
  distance: number,
  elevation = 0,
  windSpeed = 0,
  windDirection = 0
): number {
  // Hoyde-justering: ~1m per 1m hoydeforskjell for 150m+ slag
  let adjusted = distance + elevation;

  // Vind-justering: beregn motvind-komponent (positiv = motvind)
  const headwindComponent = -Math.cos(toRadians(windDirection)) * windSpeed;

  // Konverter m/s til km/t for tommelregel
  const headwindKmh = headwindComponent * 3.6;

  if (headwindKmh > 0) {
    // Motvind: +2% per 5 km/t
    adjusted += distance * (headwindKmh / 5) * 0.02;
  } else {
    // Medvind: -1% per 5 km/t
    adjusted += distance * (headwindKmh / 5) * 0.01;
  }

  return Math.round(adjusted);
}
