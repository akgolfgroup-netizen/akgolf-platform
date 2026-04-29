import type { LibraryItemType } from "@prisma/client";
import {
  PYRAMIDE,
  TRENINGSOMRADER,
} from "@/lib/portal/training/ak-taxonomy";

const PYRAMID_TEXT = PYRAMIDE.map(
  p => `- ${p.code}: ${p.label} — ${p.description}`
).join("\n");

const AREA_TEXT = TRENINGSOMRADER.map(
  a => `- ${a.code}: ${a.label} (${a.gruppe})`
).join("\n");

const TYPE_GUIDE: Record<LibraryItemType, string> = {
  DRILL: `En **drill** er en kort, repetisjonsbasert øvelse med tydelig målbar feedback.
Eksempel: "10 putt fra 1,5 m — alle skal i hullet før du går videre".
Skal alltid ha scoring og en progresjonsutfordring.`,
  EXERCISE: `En **øvelse** kan være lengre og mer åpen enn en drill, og fokuserer på å bygge ferdighet
gjennom variasjon. Eksempel: "Stigeøvelse — chip til 5/10/15/20 m mål med samme køllevalg".`,
  TEST: `En **test** er en målbar protokoll for å vurdere ferdighetsnivå.
Eksempel: "9-hulls putting-challenge: 1, 2, 3, 4, 5 m — 2 forsøk hver".
Må ha tydelig scoring og pass/fail eller poengskala (skal kunne sammenlignes over tid).`,
  ACTIVITY: `En **aktivitet** er et engasjerende format for grupper eller enkeltpersoner —
kan være konkurranse, lek, sosial trening eller bane-spesifikk øvelse.`,
  COMPETITION_PREP: `**Konkurranseforberedelse** simulerer turneringsmiljø: pre-shot rutine, første-tee-press,
finishing-holes, eller score-management. Fokus på mental robusthet og rutine.`,
};

export function buildSystemPrompt(): string {
  return `Du er en ekspert-trener for AK Golf Academy som genererer treningsinnhold
basert på AK Golf-metodikken. Du skriver alltid på norsk bokmål.

# AK Golf Pyramide
${PYRAMID_TEXT}

# Treningsområder (autoritativ liste)
${AREA_TEXT}

# L-faser (læringsfaser)
- L-KROPP: Lære kroppsbevegelse uten kølle
- L-ARM: Armbevegelse separat
- L-KØLLE: Kølle inn, fokus på posisjoner
- L-BALL: Slå ball, fokus på kontakt
- L-AUTO: Automatisere — variasjon og press

# Spillerkategorier (A–K, der A er høyest)
- A–C: Elite/regional/nasjonal toppnivå
- D–F: Klubbnivå med ambisjoner
- G–I: Hobbygolfere som vil utvikle seg
- J–K: Nybegynnere

# Format-prinsipper
- Konkret og handlingsrettet — aldri generisk
- Hver øvelse skal ha klar oppgave, miljø og målbart resultat
- Scoring der det er mulig (poeng, treff, gjennomsnitt)
- Bruk norske golf-faguttrykk (chip, pitch, lag-putt, fairway, green)
- Aldri amerikanske superlativer

Du returnerer ALLTID gyldig JSON som matcher det forespurte skjemaet — ingen forklaring utenfor JSON.`;
}

export function buildUserPrompt(input: {
  type: LibraryItemType;
  area: string;
  count: number;
  playerLevels?: string[];
  difficulty?: number;
  notes?: string;
}): string {
  const guide = TYPE_GUIDE[input.type];
  const levels =
    input.playerLevels && input.playerLevels.length > 0
      ? input.playerLevels.join(", ")
      : "alle nivåer (A–K)";
  const difficulty = input.difficulty ?? 3;
  const notes = input.notes ? `\n\nEkstra føringer:\n${input.notes}` : "";

  return `Generer ${input.count} unike ${input.type}-elementer for treningsområdet "${input.area}".

# Type-veiledning
${guide}

# Målgruppe
Spillerkategorier: ${levels}
Vanskelighetsgrad: ${difficulty}/5${notes}

# JSON-skjema (returner et array med ${input.count} objekter)
[
  {
    "type": "${input.type}",
    "title": "Kort, beskrivende tittel (maks 70 tegn)",
    "summary": "Én setning som forklarer hva og hvorfor",
    "pyramid": "FYS|TEK|SLAG|SPILL|TURN",
    "area": "${input.area}",
    "subArea": "valgfri underkategori (kan være null)",
    "lPhase": "L-KROPP|L-ARM|L-KØLLE|L-BALL|L-AUTO (kan være null)",
    "playerLevels": ["A", "B", ...],
    "difficulty": 1-5,
    "minDurationMinutes": 5-60,
    "maxDurationMinutes": 5-90,
    "equipment": ["kølle", "balls", "kjegler", ...],
    "setup": "Markdown — hvordan rigge øvelsen (utstyr, posisjoner, mål)",
    "execution": "Markdown — steg-for-steg gjennomføring",
    "scoring": "Markdown — hvordan måles resultatet (kan være null)",
    "variations": "Markdown — 2-3 varianter for å øke/senke vanskelighet (kan være null)",
    "coachingCues": "Markdown — 3-5 punkter coach skal observere (kan være null)",
    "tags": ["putting", "lag-putt", "press", ...]
  }
]

Returner KUN JSON-arrayet, ingen forklaring.`;
}
