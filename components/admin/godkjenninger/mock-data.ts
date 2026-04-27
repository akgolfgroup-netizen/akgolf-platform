// TODO: koble til ekte data
// - approvals: ny modell ApprovalRequest (type, requestedBy, status, payload)
// - automatiseringsregler: ApprovalRule
// - audit: hvem godkjente, naar
// - hovedregel: avgjor innen 24t — flagging/eskalering

export type ApprovalType = "video" | "refund" | "contract" | "discount" | "cancel";
export type Urgency = "high" | "med" | "low";

export interface ApprovalRow {
  id: string;
  initials: string;
  avatarColor: string;
  who: string;
  what: string;
  type: ApprovalType;
  urgency?: Urgency;
  when: string;
  status: "pending" | "approved" | "rejected";
  active?: boolean;
}

export interface InfoCell {
  label: string;
  value: string;
}

export interface CheckRow {
  text: string;
  state: "ok" | "warn";
}

export const APPROVAL_ROWS: ApprovalRow[] = [
  {
    id: "a-1",
    initials: "MT",
    avatarColor: "#C896E8",
    who: "Maria T. · video-feedback",
    what: "Sving-analyse for Camilla Ruud · 2:14",
    type: "video",
    urgency: "high",
    when: "FOR 18 MIN SIDEN",
    status: "pending",
    active: true,
  },
  {
    id: "a-2",
    initials: "JR",
    avatarColor: "#F49283",
    who: "Jonas R. · refusjon",
    what: "2.500 kr · avlyst Pro-plan måned 3 av 6",
    type: "refund",
    urgency: "med",
    when: "FOR 4 T SIDEN",
    status: "pending",
  },
  {
    id: "a-3",
    initials: "AR",
    avatarColor: "#E8B967",
    who: "Anna R. · rabatt-forespørsel",
    what: "15% på 6mnd-pakke · venn av eksisterende",
    type: "discount",
    urgency: "low",
    when: "I GÅR 16:42",
    status: "pending",
  },
  {
    id: "a-4",
    initials: "EL",
    avatarColor: "#6FCBA1",
    who: "Emma L. · re-onboarding",
    what: "Du godkjente Pro-plan i går",
    type: "contract",
    when: "✓ 28 APR",
    status: "approved",
  },
  {
    id: "a-5",
    initials: "PB",
    avatarColor: "#6FB3FF",
    who: "Per B. · kanselleringsfee",
    what: "Du frafalt 800 kr i forrige uke",
    type: "cancel",
    when: "✓ 24 APR",
    status: "approved",
  },
];

export const DETAIL_INFO_CELLS: InfoCell[] = [
  { label: "Spiller", value: "Camilla Ruud · HCP 15.3" },
  { label: "Plan", value: "Standard 12 mnd" },
  { label: "Coach", value: "Maria Tønnesen" },
  { label: "Lengde", value: "2 min 14 sek" },
  { label: "Knyttet til", value: "Mission #M-117 hofte-rotasjon" },
  { label: "Levering", value: "App + e-post når godkjent" },
];

export const DETAIL_CHECKLIST: CheckRow[] = [
  { text: "Video matcher spillerens nåværende fokusområde", state: "ok" },
  { text: "Drills er fra godkjent bibliotek (3/3)", state: "ok" },
  { text: "Bildekvalitet og lyd over terskel", state: "ok" },
  { text: "Tone-of-voice innenfor profil", state: "ok" },
  {
    text: "Manglende kobling til neste planlagte økt — vurder å legge til CTA før publisering",
    state: "warn",
  },
];

export const FEEDBACK_QUOTE =
  "«Hei Camilla! Vi gikk gjennom oppstillingen din i forrige økt — kjempebra fremgang. Det jeg vil du skal jobbe med før vi møtes igjen er hofte-rotasjonen i nedsving. Jeg har laget tre drills (se eget dokument). Spol til 01:10 for å se sammenligningen mellom forrige og denne uken — du ser at skuldrene er roligere allerede.»";

export const AI_FLAG_TEXT =
  "ingen merknader. Tonen er innenfor merkevareprofilen din, alle drills refererer til godkjent treningsbibliotek, video-kvaliteten oppfyller kravene (1080p, > 60 fps), og innholdet matcher Camillas plan.";

export const AUTOMATION_BLURB =
  "Refusjoner under 500 kr, video-feedback fra coacher med 12+ mnd erfaring som har lavere enn 0,3% rejection-rate, og rabatt-koder for eksisterende spillere — disse bypasser denne inboxen og logges direkte i Audit. Du har spart ~14 godkjenninger denne uken.";
