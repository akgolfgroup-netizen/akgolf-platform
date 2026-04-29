/**
 * AK Golf Academy — Taxonomi
 *
 * Autoritativ kilde: ak-golf-masterdokument-v2_2026-04-12.docx
 *
 * All terminologi brukt i treningsplanlegger, øvelsesbank og økt-ID
 * skal refereres herfra. Ved konflikt med annen kode gjelder dette.
 *
 * Trygg for client-side import (ingen server-avhengigheter).
 */

// ─── PYRAMIDE (seksjon 3) ──────────────────────────────────────────

export interface PyramideNivaa {
  code: "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN";
  label: string;
  description: string;
  // Brand Guide V2.0 — gradient fra dyp skogsgrønn (basis: FYS) til lime (topp: TURN).
  // Følger pyramide-metafor visuelt: tyngst nederst, lettest på toppen.
  color: string;
}

export const PYRAMIDE: readonly PyramideNivaa[] = [
  { code: "FYS", label: "Fysisk", description: "Styrke, power, mobilitet, stabilitet", color: "#003B2A" },
  { code: "TEK", label: "Teknikk", description: "Bevegelsesmønster, posisjoner, sekvens", color: "#005840" },
  { code: "SLAG", label: "Golfslag", description: "Slagkvalitet, avstand, nøyaktighet", color: "#2A7D5A" },
  { code: "SPILL", label: "Spill", description: "Strategi, banehåndtering, scoring", color: "#B7C97D" },
  { code: "TURN", label: "Turnering", description: "Mental prestasjon, konkurransefokus", color: "#D1F843" },
] as const;

export type PyramideCode = (typeof PYRAMIDE)[number]["code"];

// ─── TRENINGSOMRÅDER (seksjon 10.1) ────────────────────────────────

export interface Treningsomraade {
  code: string;
  label: string;
  gruppe: "tee" | "innspill" | "narspill" | "putting";
  csRelevant: boolean;
  pSystem: boolean;
}

// Rekkefølge: Tee Total → Innspill → Nærspill → Putting
// Tee og Innspill er begge full swing, men splittet i to grupper for
// klarere navigasjon i UI. "fullSwing" som samlegruppe er fjernet.
export const TRENINGSOMRADER: readonly Treningsomraade[] = [
  // Tee
  { code: "TEE", label: "Tee Total", gruppe: "tee", csRelevant: true, pSystem: true },
  // Innspill (full swing fra ulik avstand)
  { code: "INN200", label: "Innspill 200+ m", gruppe: "innspill", csRelevant: true, pSystem: true },
  { code: "INN150", label: "Innspill 150–200 m", gruppe: "innspill", csRelevant: true, pSystem: true },
  { code: "INN100", label: "Innspill 100–150 m", gruppe: "innspill", csRelevant: true, pSystem: true },
  { code: "INN50", label: "Innspill 50–100 m", gruppe: "innspill", csRelevant: true, pSystem: true },
  // Nærspill
  { code: "CHIP", label: "Chip", gruppe: "narspill", csRelevant: false, pSystem: true },
  { code: "PITCH", label: "Pitch", gruppe: "narspill", csRelevant: false, pSystem: true },
  { code: "LOB", label: "Lob", gruppe: "narspill", csRelevant: false, pSystem: true },
  { code: "BUNKER", label: "Bunker", gruppe: "narspill", csRelevant: false, pSystem: true },
  // Putting
  { code: "PUTT0-3", label: "Putt 0–3 ft", gruppe: "putting", csRelevant: false, pSystem: false },
  { code: "PUTT3-5", label: "Putt 3–5 ft", gruppe: "putting", csRelevant: false, pSystem: false },
  { code: "PUTT5-10", label: "Putt 5–10 ft", gruppe: "putting", csRelevant: false, pSystem: false },
  { code: "PUTT10-15", label: "Putt 10–15 ft", gruppe: "putting", csRelevant: false, pSystem: false },
  { code: "PUTT15-25", label: "Putt 15–25 ft", gruppe: "putting", csRelevant: false, pSystem: false },
  { code: "PUTT25-40", label: "Putt 25–40 ft", gruppe: "putting", csRelevant: false, pSystem: false },
  { code: "PUTT40+", label: "Putt 40+ ft", gruppe: "putting", csRelevant: false, pSystem: false },
] as const;

export type TreningsomraadeCode = (typeof TRENINGSOMRADER)[number]["code"];

export const OMRADE_GRUPPER = [
  { code: "tee", label: "Tee Total" },
  { code: "innspill", label: "Innspill" },
  { code: "narspill", label: "Nærspill" },
  { code: "putting", label: "Putting" },
] as const;

// ─── L-FASER (seksjon 10.2) ────────────────────────────────────────

export interface LFase {
  code: "L-KROPP" | "L-ARM" | "L-KØLLE" | "L-BALL" | "L-AUTO";
  label: string;
  description: string;
  equipment: string;
  csAnbefalt: string;
}

export const L_FASER: readonly LFase[] = [
  { code: "L-KROPP", label: "Kropp", description: "Kun kroppsbevegelse", equipment: "Ingen", csAnbefalt: "—" },
  { code: "L-ARM", label: "Arm", description: "Kropp + armer", equipment: "Ingen kølle/ball", csAnbefalt: "—" },
  { code: "L-KØLLE", label: "Kølle", description: "Kropp + armer + kølle", equipment: "Ingen ball", csAnbefalt: "CS50" },
  { code: "L-BALL", label: "Ball", description: "Alt inkludert, lav hastighet", equipment: "Ball", csAnbefalt: "CS50–60" },
  { code: "L-AUTO", label: "Auto", description: "Full hastighet, automatisert", equipment: "Alt", csAnbefalt: "CS70–100" },
] as const;

export type LFaseCode = (typeof L_FASER)[number]["code"];

// ─── CS-NIVÅER (seksjon 10.3) ──────────────────────────────────────

export interface CSNivaa {
  code: string;
  percent: number;
  description: string;
}

// CS-skalaen starter på 50 % av maks innsats — CS-nivåer under 50
// brukes ikke i ny treningsplan. Eldre AI-pipeline (AGE_GROUP_TABLE
// for de yngste aldersgruppene) refererer fortsatt til CS20/CS40
// som historiske aldersbegrensninger; de oppdateres når AI-pipelinen
// reaktiveres.
export const CS_NIVAER: readonly CSNivaa[] = [
  { code: "CS50", percent: 50, description: "Minimum for balltrening" },
  { code: "CS60", percent: 60, description: "Konsistens" },
  { code: "CS70", percent: 70, description: "Konkurranselignende" },
  { code: "CS80", percent: 80, description: "Høy intensitet" },
  { code: "CS90", percent: 90, description: "Nær-maksimal" },
  { code: "CS100", percent: 100, description: "Maksimal innsats" },
] as const;

// ─── M-MILJØ (seksjon 10.4) ────────────────────────────────────────

export interface MMiljo {
  code: "M0" | "M1" | "M2" | "M3" | "M4" | "M5";
  label: string;
  description: string;
}

export const M_MILJO: readonly MMiljo[] = [
  { code: "M0", label: "Off-course", description: "Gym, hjemme, ikke golf-spesifikt" },
  { code: "M1", label: "Innendørs", description: "Nett, simulator, TrackMan" },
  { code: "M2", label: "Range", description: "Utendørs, matte eller gress" },
  { code: "M3", label: "Øvingsfelt", description: "Kortbane, chipping green, putting green" },
  { code: "M4", label: "Bane trening", description: "Treningsrunde på bane" },
  { code: "M5", label: "Bane turnering", description: "Turneringsrunde" },
] as const;

// ─── PR-PRESS (seksjon 10.5) ───────────────────────────────────────

export interface PRPress {
  code: "PR1" | "PR2" | "PR3" | "PR4" | "PR5";
  label: string;
  description: string;
}

export const PR_PRESS: readonly PRPress[] = [
  { code: "PR1", label: "Ingen", description: "Utforskende, ingen konsekvens" },
  { code: "PR2", label: "Selvmonitorering", description: "Måltall, tracking, ingen sosial" },
  { code: "PR3", label: "Sosial", description: "Med andre, observert" },
  { code: "PR4", label: "Konkurranse", description: "Innsats, spill mot andre" },
  { code: "PR5", label: "Turnering", description: "Resultat teller, ranking" },
] as const;

// ─── P-POSISJONER (seksjon 10.6) ───────────────────────────────────

export interface PPosisjon {
  code: string;
  label: string;
  description: string;
}

export const P_POSISJONER: readonly PPosisjon[] = [
  { code: "P1.0", label: "Address", description: "Statisk startposisjon" },
  { code: "P2.0", label: "Takeaway", description: "Skaft parallelt med bakken (backswing)" },
  { code: "P3.0", label: "Mid-Backswing", description: "Lead arm parallelt med bakken" },
  { code: "P4.0", label: "Topp", description: "Maksimal rotasjon, svingens apex" },
  { code: "P4.5", label: "Transition midt", description: "Kritisk desimalposisjon" },
  { code: "P5.0", label: "Transition", description: "Lead arm parallelt (downswing start)" },
  { code: "P5.5", label: "Shallowed", description: "Skaft til albueplan" },
  { code: "P6.0", label: "Delivery", description: "Skaft parallelt med bakken (downswing)" },
  { code: "P6.1", label: "Release-punkt", description: "Klubbhode krysser hendene" },
  { code: "P6.5", label: "Pre-impact", description: "Siste posisjon før impact" },
  { code: "P7.0", label: "Impact", description: "Treff, moment of truth" },
  { code: "P8.0", label: "Release", description: "Skaft parallelt post-impact" },
  { code: "P9.0", label: "Follow-through", description: "Trail arm parallelt" },
  { code: "P10.0", label: "Finish", description: "Fullført rotasjon, balanse" },
] as const;

// ─── LIFE (seksjon 4.1) ────────────────────────────────────────────

export interface LifeKode {
  code: "LIFE-SELV" | "LIFE-SOS" | "LIFE-EMO" | "LIFE-KAR" | "LIFE-RES";
  label: string;
  kategori: string;
  description: string;
}

export const LIFE_KODER: readonly LifeKode[] = [
  { code: "LIFE-SELV", label: "Selvledelse", kategori: "Selvledelse", description: "Målsetting, ansvar, selvrefleksjon" },
  { code: "LIFE-SOS", label: "Sosial", kategori: "Sosial", description: "Kommunikasjon, samarbeid, respekt" },
  { code: "LIFE-EMO", label: "Emosjonell", kategori: "Emosjonell", description: "Frustrasjonshåndtering, fokus, tålmodighet" },
  { code: "LIFE-KAR", label: "Karakter", kategori: "Karakter", description: "Sportsånd, ærlighet, integritet" },
  { code: "LIFE-RES", label: "Resiliens", kategori: "Resiliens", description: "Motgangshåndtering, utholdenhet" },
] as const;

// ─── PUTTING-SPESIFIKT (seksjon 10.7) ──────────────────────────────

export const PUTTING_FOKUS = [
  { code: "GREEN", label: "Greenlesning" },
  { code: "SIKTE", label: "Sikte / alignment" },
  { code: "TEKN", label: "Teknikk" },
  { code: "BALL", label: "Ballstart" },
  { code: "SPEED", label: "Speed / lengdekontroll" },
] as const;

export const PUTTING_FASER = [
  { code: "S", label: "Setup" },
  { code: "B", label: "Back swing" },
  { code: "I", label: "Impact" },
  { code: "F", label: "Follow through" },
] as const;

// ─── SPILLERKATEGORIER A–K (seksjon 2.1) ───────────────────────────

export interface Spillerkategori {
  code: string;
  nivaa: string;
  snittscore: string;
  alder: string;
}

export const SPILLERKATEGORIER: readonly Spillerkategori[] = [
  { code: "A", nivaa: "Verdenselite", snittscore: "< 68", alder: "18–22" },
  { code: "B", nivaa: "Nasjonal elite", snittscore: "68–72", alder: "17–20" },
  { code: "C", nivaa: "Nasjonal U21", snittscore: "72–74", alder: "16–19" },
  { code: "D", nivaa: "Regional elite", snittscore: "74–76", alder: "15–18" },
  { code: "E", nivaa: "Regional U18", snittscore: "76–78", alder: "14–17" },
  { code: "F", nivaa: "Klubbspiller sr.", snittscore: "78–80", alder: "15–17" },
  { code: "G", nivaa: "Klubbspiller jr.", snittscore: "80–85", alder: "14–16" },
  { code: "H", nivaa: "Rekrutt senior", snittscore: "85–90", alder: "13–15" },
  { code: "I", nivaa: "Rekrutt junior", snittscore: "90–95", alder: "12–14" },
  { code: "J", nivaa: "Nybegynner sr.", snittscore: "95–100", alder: "11–13" },
  { code: "K", nivaa: "Nybegynner jr.", snittscore: "100+", alder: "8–11" },
] as const;

// ─── HELPERS ───────────────────────────────────────────────────────

/**
 * Bygger økt-ID iht. AK-formelen (seksjon 9).
 * Full: [Pyramide]_[Område]_L-[fase]_CS[nivå]_M[miljø]_PR[press]_[P-posisjon]_[LIFE]
 */
export function byggOktId(parts: {
  pyramide: PyramideCode;
  omraade?: TreningsomraadeCode;
  lFase?: LFaseCode;
  cs?: string;
  miljo?: string;
  press?: string;
  pPosisjon?: string;
  life?: string;
}): string {
  const segments: string[] = [parts.pyramide];
  if (parts.omraade) segments.push(parts.omraade);
  if (parts.lFase) segments.push(parts.lFase);
  if (parts.cs) segments.push(parts.cs);
  if (parts.miljo) segments.push(parts.miljo);
  if (parts.press) segments.push(parts.press);
  if (parts.pPosisjon) segments.push(parts.pPosisjon);
  if (parts.life) segments.push(parts.life);
  return segments.join("_");
}

export function labelForPyramide(code: string): string {
  return PYRAMIDE.find((p) => p.code === code)?.label ?? code;
}

export function labelForOmraade(code: string): string {
  return TRENINGSOMRADER.find((o) => o.code === code)?.label ?? code;
}

export function labelForLFase(code: string): string {
  return L_FASER.find((f) => f.code === code)?.label ?? code;
}

// ─── TEMPLATE-FOKUS (alias for ak-taxonomy-koder brukt i standard-maler) ─
//
// `TrainingPlanSession.focusArea` lagres som fri tekst i DB (se Prisma).
// For maler bruker vi disse aliasene som faller direkte inn i AK-taxonomy:
// pyramide-koder (FYS, SPILL) og treningsområde-aliaser (PUTTING/CHIPPING/...).
// Single source of truth — alle nye maler skal bruke disse i stedet for å
// hardkode strings.
//
// Mapping mot ak-taxonomy:
//   PUTTING  → gruppe "putting" (PUTT0-3 ... PUTT40+)
//   CHIPPING → kode "CHIP"
//   PITCHING → kode "PITCH"
//   JERN     → kode "INN150" (default for jernspill 150–200 m)
//   DRIVE    → kode "TEE"
//   SPILL    → pyramide-kode "SPILL"
//   FYS      → pyramide-kode "FYS"

export const TEMPLATE_FOCUS = {
  PUTTING: "PUTTING",
  CHIPPING: "CHIPPING",
  PITCHING: "PITCHING",
  JERN: "JERN",
  DRIVE: "DRIVE",
  SPILL: "SPILL",
  FYS: "FYS",
} as const;

export type TemplateFocus = (typeof TEMPLATE_FOCUS)[keyof typeof TEMPLATE_FOCUS];
