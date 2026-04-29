/**
 * Delte SVG path-byggere for sparkline / area-charts pa server components.
 *
 * Disse funksjonene kjorer i RSC-fasen (ingen "use client"), genererer ren
 * SVG-streng og returnerer line + area + siste punkt for at kort skal kunne
 * tegne dot/marker uten ekstra beregning.
 */

export interface SvgPathResult {
  line: string;
  area: string;
  lastX: number;
  lastY: number;
}

interface BuildAreaPathOptions {
  width?: number;
  height?: number;
  /**
   * Hvis true: hoy verdi ligger oppe pa y-aksen (standard for line-chart der
   * "mer er bedre", f.eks. SG-total).
   *
   * Hvis false: lav verdi ligger oppe pa y-aksen (handicap der "lavere er
   * bedre" — vil at fallende serie peker oppover).
   */
  invertY?: boolean;
  /** Horisontal padding (offset fra venstre kant til forste punkt) */
  offsetX?: number;
  /** Vertikal padding (offset fra topp til hoyeste punkt) */
  offsetY?: number;
}

/**
 * Bygger SVG line- + area-path fra en serie tall. Returnerer tom path nar
 * input er tomt. Bruker `invertY: false` for handicap-grafer der lavere
 * skal vises hoyere pa y-aksen, og `invertY: true` (default) ellers.
 */
export function buildAreaPath(
  points: number[],
  options: BuildAreaPathOptions = {},
): SvgPathResult {
  const {
    width = 360,
    height = 130,
    invertY = true,
    offsetX = 30,
    offsetY = 30,
  } = options;

  if (points.length === 0) {
    return { line: "", area: "", lastX: 0, lastY: 0 };
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const stepX = points.length > 1 ? width / (points.length - 1) : width;

  // y-projeksjon: invertY=true → mer er bedre (peak oppe). false → mindre bedre.
  const yFor = (p: number) =>
    offsetY + (invertY ? (max - p) / range : (p - min) / range) * height;

  const line = points
    .map((p, i) => {
      const x = i * stepX + offsetX;
      const y = yFor(p);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const lastIdx = points.length - 1;
  const lastX = lastIdx * stepX + offsetX;
  const lastY = yFor(points[lastIdx]!);

  // Lukker fyll-omradet til bunnen av charten med 20px luft under
  const baseY = (offsetY + height + 20).toFixed(1);
  const firstX = offsetX;
  const area = `${line} L${lastX.toFixed(1)},${baseY} L${firstX.toFixed(1)},${baseY} Z`;

  return { line, area, lastX, lastY };
}

/**
 * Forenklet line-only-builder for sma sparklines (uten area-fyll).
 */
export function buildLinePath(
  points: number[],
  options: { width?: number; height?: number; invertY?: boolean } = {},
): string {
  const { width = 160, height = 40, invertY = true } = options;
  if (points.length === 0) return "";

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const stepX = points.length > 1 ? width / (points.length - 1) : width;

  return points
    .map((p, i) => {
      const x = i * stepX;
      const y = invertY ? ((max - p) / range) * height : ((p - min) / range) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}
