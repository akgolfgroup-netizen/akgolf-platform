/* Calendar data + helpers — shared across views.
   Grounded in repo TrainingSession model (FYS/TEK/SLAG/SPILL/TURN). */

const CAL_FOCUS = {
  FYS:   { label: "Fysisk",      dot: "#6B9FF5", line: "#6B9FF5", bg: "rgba(107,159,245,0.14)", ink: "#A9C8F8", fg: "#A9C8F8", border: "rgba(107,159,245,0.28)" },
  TEK:   { label: "Teknikk",     dot: "#D1F843", line: "#D1F843", bg: "rgba(209,248,67,0.12)",  ink: "#D1F843", fg: "#D1F843", border: "rgba(209,248,67,0.32)" },
  SLAG:  { label: "Slag",        dot: "#F5C86B", line: "#F5C86B", bg: "rgba(245,200,107,0.14)", ink: "#F5D28F", fg: "#F5D28F", border: "rgba(245,200,107,0.28)" },
  SPILL: { label: "Spill",       dot: "#F59B6B", line: "#F59B6B", bg: "rgba(245,155,107,0.14)", ink: "#F7B896", fg: "#F7B896", border: "rgba(245,155,107,0.28)" },
  TURN:  { label: "Turnering",   dot: "#E05B4A", line: "#E05B4A", bg: "rgba(224,91,74,0.16)",   ink: "#F1A093", fg: "#F1A093", border: "rgba(224,91,74,0.32)" },
  COACH: { label: "Coaching",    dot: "#8AD3B7", line: "#8AD3B7", bg: "rgba(138,211,183,0.14)", ink: "#AFE3CC", fg: "#AFE3CC", border: "rgba(138,211,183,0.28)" },
  REST:  { label: "Restitusjon", dot: "#7a9a8e", line: "#7a9a8e", bg: "rgba(122,154,142,0.14)", ink: "#B6CCC2", fg: "#B6CCC2", border: "rgba(122,154,142,0.22)" },
};

/* Month we show: April 2026 (matches dashboard "uke 15"). 1. april 2026 = onsdag. */
const CAL_MONTH = { year: 2026, month: 3 }; // 0-indexed: 3 = april
const CAL_MONTH_NAME = "April 2026";
const CAL_TODAY = { year: 2026, month: 3, date: 23 }; // torsdag 23. april

const CAL_WEEKDAYS = ["M", "T", "O", "T", "F", "L", "S"];
const CAL_WEEKDAYS_LONG = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

/* Build calendar matrix for April 2026.
   Mon-first. April 1 = Wed (weekday idx 2). 30 days in April.
   Returns array of 6 weeks × 7 days of { date, inMonth, isToday, key }. */
function buildMonthMatrix() {
  // April 1 2026 = Wednesday (0=Mon). So leading blanks = 2 (Mon, Tue from March).
  const daysInApril = 30;
  const daysInMarch = 31;
  const leading = 2; // Mon 30 Mar, Tue 31 Mar
  const cells = [];

  // Leading (March 30, 31)
  for (let i = 0; i < leading; i++) {
    const date = daysInMarch - leading + 1 + i;
    cells.push({ date, month: 2, inMonth: false, isToday: false, key: `2-${date}` });
  }
  // April
  for (let d = 1; d <= daysInApril; d++) {
    cells.push({
      date: d, month: 3, inMonth: true,
      isToday: d === CAL_TODAY.date,
      key: `3-${d}`,
    });
  }
  // Trailing (May) to fill 6 rows = 42 cells
  let mayD = 1;
  while (cells.length < 42) {
    cells.push({ date: mayD, month: 4, inMonth: false, isToday: false, key: `4-${mayD}` });
    mayD++;
  }
  return cells;
}

/* Seed events — ~20 sessions across April, realistic training rhythm */
const CAL_SEED_EVENTS = [
  // Week of Mar 30 – Apr 5 (uke 14)
  { id: "e1", date: 31, month: 2, focus: "REST", title: "Aktiv hvile", duration: 45, startH: 8, startM: 0 },
  { id: "e2", date: 1,  month: 3, focus: "FYS", title: "Styrke · underkropp", duration: 60, startH: 7, startM: 30 },
  { id: "e3", date: 2,  month: 3, focus: "TEK", title: "Range · swing plane", duration: 75, startH: 16, startM: 0 },
  { id: "e4", date: 3,  month: 3, focus: "SPILL", title: "9 hull · Gamle", duration: 130, startH: 14, startM: 0 },
  { id: "e5", date: 4,  month: 3, focus: "TURN", title: "Klubbmesterskap R1", duration: 240, startH: 9, startM: 0 },
  { id: "e6", date: 5,  month: 3, focus: "TURN", title: "Klubbmesterskap R2", duration: 240, startH: 9, startM: 0 },

  // Week of Apr 6 – 12 (uke 15)
  { id: "e7",  date: 6,  month: 3, focus: "REST",  title: "Rolig gange + mobilitet", duration: 40, startH: 8, startM: 0 },
  { id: "e8",  date: 7,  month: 3, focus: "FYS",   title: "Rotasjon & kjerne", duration: 50, startH: 7, startM: 30 },
  { id: "e9",  date: 7,  month: 3, focus: "SLAG",  title: "Innspill 30–80m", duration: 60, startH: 17, startM: 0 },
  { id: "e10", date: 8,  month: 3, focus: "COACH", title: "Coaching — Andreas", duration: 60, startH: 10, startM: 0 },
  { id: "e11", date: 8,  month: 3, focus: "TEK",   title: "Trackman · carry-konsistens", duration: 90, startH: 14, startM: 0 },
  { id: "e12", date: 9,  month: 3, focus: "SPILL", title: "18 hull · scoring", duration: 240, startH: 13, startM: 0 },
  { id: "e13", date: 10, month: 3, focus: "FYS",   title: "Styrke · overkropp", duration: 55, startH: 8, startM: 0 },
  { id: "e14", date: 11, month: 3, focus: "SLAG",  title: "Putting · 2–4m", duration: 45, startH: 11, startM: 0 },
  { id: "e15", date: 12, month: 3, focus: "SPILL", title: "Søndagsrunde", duration: 260, startH: 10, startM: 0 },

  // Week of Apr 13 – 19 (uke 16)
  { id: "e16", date: 13, month: 3, focus: "REST",  title: "Hviledag", duration: 0, startH: 8, startM: 0 },
  { id: "e17", date: 14, month: 3, focus: "TEK",   title: "Range · jernslag", duration: 75, startH: 16, startM: 0 },
  { id: "e18", date: 15, month: 3, focus: "FYS",   title: "Intervaller · puls", duration: 45, startH: 7, startM: 30 },
  { id: "e19", date: 16, month: 3, focus: "COACH", title: "Coaching — videoanalyse", duration: 60, startH: 11, startM: 0 },
  { id: "e20", date: 17, month: 3, focus: "SLAG",  title: "Bunker · lang utslag", duration: 50, startH: 15, startM: 0 },
  { id: "e21", date: 18, month: 3, focus: "SPILL", title: "Parrunde · Onsøy", duration: 260, startH: 9, startM: 30 },
  { id: "e22", date: 19, month: 3, focus: "SPILL", title: "Foursome · Fredrikstad", duration: 220, startH: 10, startM: 0 },

  // Week of Apr 20 – 26 (uke 17 — current)
  { id: "e23", date: 20, month: 3, focus: "REST",  title: "Mobilitet · hofter", duration: 30, startH: 8, startM: 0 },
  { id: "e24", date: 21, month: 3, focus: "FYS",   title: "Styrke · helkropp", duration: 60, startH: 7, startM: 30 },
  { id: "e25", date: 21, month: 3, focus: "TEK",   title: "Range · driver-konsistens", duration: 75, startH: 17, startM: 0 },
  { id: "e26", date: 22, month: 3, focus: "SLAG",  title: "Chipping · kort spill", duration: 60, startH: 16, startM: 30 },
  { id: "e27", date: 23, month: 3, focus: "COACH", title: "Coaching — Andreas", duration: 60, startH: 10, startM: 0 },
  { id: "e28", date: 23, month: 3, focus: "SPILL", title: "9 hull · oppvarming", duration: 130, startH: 14, startM: 30 },
  { id: "e29", date: 24, month: 3, focus: "TEK",   title: "Trackman · spin", duration: 60, startH: 11, startM: 0 },
  { id: "e30", date: 25, month: 3, focus: "TURN",  title: "Onsøy Open R1", duration: 300, startH: 8, startM: 30 },
  { id: "e31", date: 26, month: 3, focus: "TURN",  title: "Onsøy Open R2", duration: 300, startH: 8, startM: 30 },

  // Week of Apr 27 – May 3
  { id: "e32", date: 27, month: 3, focus: "REST",  title: "Aktiv restitusjon", duration: 40, startH: 8, startM: 0 },
  { id: "e33", date: 28, month: 3, focus: "FYS",   title: "Kjerne & balanse", duration: 50, startH: 7, startM: 30 },
  { id: "e34", date: 29, month: 3, focus: "COACH", title: "Coaching — turneringsevaluering", duration: 60, startH: 10, startM: 0 },
  { id: "e35", date: 30, month: 3, focus: "SPILL", title: "18 hull · Gamle", duration: 240, startH: 13, startM: 0 },
];

/* Week containing CAL_TODAY: Apr 20–26 (Mon–Sun). */
const CAL_WEEK_DATES = [
  { date: 20, month: 3, isToday: false, dayName: "Mandag",   dayLong: "Mandag",   dayShort: "Man" },
  { date: 21, month: 3, isToday: false, dayName: "Tirsdag",  dayLong: "Tirsdag",  dayShort: "Tir" },
  { date: 22, month: 3, isToday: false, dayName: "Onsdag",   dayLong: "Onsdag",   dayShort: "Ons" },
  { date: 23, month: 3, isToday: true,  dayName: "Torsdag",  dayLong: "Torsdag",  dayShort: "Tor" },
  { date: 24, month: 3, isToday: false, dayName: "Fredag",   dayLong: "Fredag",   dayShort: "Fre" },
  { date: 25, month: 3, isToday: false, dayName: "Lørdag",   dayLong: "Lørdag",   dayShort: "Lør" },
  { date: 26, month: 3, isToday: false, dayName: "Søndag",   dayLong: "Søndag",   dayShort: "Søn" },
];

const CAL_TIME = { start: 7, end: 22, hourH: 56 }; // 56px per hour — compact Notion feel

function calFmtTime(h, m) {
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
}
function calEndTime(e) {
  const total = e.startH * 60 + e.startM + e.duration;
  return { h: Math.floor(total/60), m: total % 60 };
}
function calPosY(h, m) {
  return ((h - CAL_TIME.start) * 60 + m) / 60 * CAL_TIME.hourH;
}
function calHeightFor(mins) {
  return Math.max(22, mins / 60 * CAL_TIME.hourH);
}

// Alias for main composer
const SEED_EVENTS = CAL_SEED_EVENTS;

Object.assign(window, {
  CAL_FOCUS, CAL_SEED_EVENTS, SEED_EVENTS, CAL_WEEKDAYS, CAL_WEEKDAYS_LONG, CAL_WEEK_DATES,
  CAL_TIME, CAL_MONTH_NAME, CAL_MONTH, CAL_TODAY, buildMonthMatrix,
  calFmtTime, calEndTime, calPosY, calHeightFor,
});
