// TODO: koble til ekte data
// - prisma.coachingGroup.findUnique({ where: { id }, include: { members, sessions, notes }})
// - HCP, attendance, badge avledes fra Booking-historikk siste kohort
// - Notater hentes fra CoachingNote-relasjon

export type RosterBadge = "TOPP" | "PA_MAL" | "PUTT" | "FRAVAER";

export type RosterMember = {
  id: string;
  initials: string;
  color: string;
  name: string;
  meta: string;
  hcp: string;
  attendance: string;
  badge: RosterBadge;
};

export type ScheduleRow = {
  id: string;
  day: string;
  weekday: string;
  title: string;
  meta: string;
  attendance: string;
};

export type ProgressRow = {
  label: string;
  fillPercent: number;
  ratio: string;
};

export type NoteEntry = {
  id: string;
  who: string;
  when: string;
  body: string;
};

export type GroupDetail = {
  id: string;
  name: string;
  topMeta: string;
  pageSubtitle: string;
  heroEyebrow: string;
  heroTitle: string;
  heroLede: string;
  heroStats: { label: string; value: string }[];
  roster: RosterMember[];
  schedule: ScheduleRow[];
  progress: ProgressRow[];
  notes: NoteEntry[];
};

export const GROUP_DETAIL_FALLBACK: GroupDetail = {
  id: "junior-elite-oslo",
  name: "Junior Elite Oslo",
  topMeta: "14 SPILLERE · KOHORT MAI–JUL 2025 · BOGSTAD",
  pageSubtitle:
    "14 spillere · HCP snitt 8.2 · 12-ukers kohort. Belegg 93 %. Neste fellesøkt torsdag 16:00 på Bogstad.",
  heroEyebrow: "Kohort-status",
  heroTitle: "Uke 6 av 12 · sterk fremgang.",
  heroLede:
    "10 av 14 spillere har redusert HCP siden kohortstart. Markus, Sofie og Anders er topp-3. To spillere flagget for ekstra coaching denne uken (Lars og Erik H — putting under target).",
  heroStats: [
    { label: "Roster", value: "14" },
    { label: "HCP snitt", value: "8.2" },
    { label: "Belegg uke 6", value: "93%" },
    { label: "Mål nådd", value: "10/14" },
  ],
  roster: [
    { id: "mn", initials: "MN", color: "#6BB1FF", name: "Markus Nordby", meta: "17 år · medlem siden 2022", hcp: "7.4", attendance: "5/6 økt", badge: "TOPP" },
    { id: "sa", initials: "SA", color: "#C99CF3", name: "Sofie Aas", meta: "16 år · medlem siden 2023", hcp: "7.7", attendance: "6/6 økt", badge: "TOPP" },
    { id: "ak", initials: "AK", color: "#D1F843", name: "Anders Kristiansen", meta: "15 år · medlem siden 2023", hcp: "8.4", attendance: "5/6 økt", badge: "PA_MAL" },
    { id: "jt", initials: "JT", color: "#E8B967", name: "Jonas Tvedt", meta: "16 år", hcp: "8.0", attendance: "6/6 økt", badge: "PA_MAL" },
    { id: "hj", initials: "HJ", color: "#6FCBA1", name: "Hannah Johansen", meta: "17 år", hcp: "8.6", attendance: "4/6 økt", badge: "PA_MAL" },
    { id: "eh", initials: "EH", color: "#6BB1FF", name: "Erik Hansen", meta: "14 år", hcp: "9.2", attendance: "5/6 økt", badge: "PUTT" },
    { id: "lk", initials: "LK", color: "#C99CF3", name: "Lars Kvam", meta: "15 år", hcp: "9.1", attendance: "3/6 økt", badge: "FRAVAER" },
    { id: "ta", initials: "TA", color: "#E8B967", name: "Tobias Aune", meta: "16 år", hcp: "8.8", attendance: "6/6 økt", badge: "PA_MAL" },
  ],
  schedule: [
    { id: "s1", day: "02 mai", weekday: "TOR", title: "Fellesøkt · driver-fokus", meta: "BOGSTAD BAY 4–8 · 16:00–18:00", attendance: "14/14" },
    { id: "s2", day: "06 mai", weekday: "MAN", title: "Treningsrunde · medlemskap", meta: "BOGSTAD BANEN · 17:00–20:00", attendance: "12/14" },
    { id: "s3", day: "09 mai", weekday: "TOR", title: "Fellesøkt · putting", meta: "SKULLERUD STUDIO · 16:00–18:00", attendance: "14/14" },
    { id: "s4", day: "16 mai", weekday: "TOR", title: "Trackman re-test", meta: "SKULLERUD · 14:00–18:00", attendance: "11/14" },
    { id: "s5", day: "23 mai", weekday: "TOR", title: "On-course · short-game", meta: "BOGSTAD HULL 1–6 · 16:00–18:00", attendance: "14/14" },
  ],
  progress: [
    { label: "Driver carry", fillPercent: 71, ratio: "10/14" },
    { label: "GIR%", fillPercent: 57, ratio: "8/14" },
    { label: "Putt/runde", fillPercent: 64, ratio: "9/14" },
    { label: "HCP −0.5+", fillPercent: 43, ratio: "6/14" },
  ],
  notes: [
    {
      id: "n1",
      who: "Roster-justering · 28. apr",
      when: "SISTE · ESN",
      body:
        "«Lars trenger 1:1-økt før 16. mai — fraværsmønster siste 2 uker, sannsynligvis skole. Send foreldre-melding.»",
    },
    {
      id: "n2",
      who: "Putting-rapport gruppe · 25. apr",
      when: "3 DAGER SIDEN",
      body:
        "«Hele gruppa er ned 0.12 putt/hull siden mars. Quintic-økten 9. mai vil forsterke. Erik H får ekstra fokus.»",
    },
  ],
};
