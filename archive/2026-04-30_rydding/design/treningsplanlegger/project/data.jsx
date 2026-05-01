/* Mock data — Magnus' uke (realistisk + onboarding state) */

const TODAY = new Date(2026, 3, 22); // ons 22. apr 2026

const STANDARD_OKTER = [
  { id: "s1", title: "Putting-drill", duration: 20, level: "TEK", exercises: ["Gate drill", "Clock drill"], icon: "target" },
  { id: "s2", title: "Short game", duration: 30, level: "SLAG", exercises: ["Chip-and-run", "Bunker"], icon: "flag" },
  { id: "s3", title: "Driving range", duration: 45, level: "SLAG", exercises: ["Fade/draw", "Distance"], icon: "zap" },
  { id: "s4", title: "Styrke-økt", duration: 50, level: "FYS", exercises: ["Kjerne", "Mobilitet"], icon: "dumbbell" },
  { id: "s5", title: "Spill 9 hull", duration: 120, level: "SPILL", exercises: ["On-course", "Scoring"], icon: "flag" },
  { id: "s6", title: "Svinganalyse", duration: 40, level: "TEK", exercises: ["Video", "Impact"], icon: "play" },
];

const OVELSER = [
  { id: "e1", name: "Gate drill 3 m", level: "TEK", duration: 8, fav: true },
  { id: "e2", name: "Clock drill", level: "TEK", duration: 12, fav: true },
  { id: "e3", name: "Wedge — 50 m", level: "SLAG", duration: 15, fav: false },
  { id: "e4", name: "Bunker — buet", level: "SLAG", duration: 20, fav: true },
  { id: "e5", name: "Driver — fade", level: "SLAG", duration: 15, fav: false },
  { id: "e6", name: "Kjerne sirkel", level: "FYS", duration: 25, fav: false },
  { id: "e7", name: "Hofte-mobilitet", level: "FYS", duration: 10, fav: true },
  { id: "e8", name: "9 hull — scoring", level: "SPILL", duration: 90, fav: false },
  { id: "e9", name: "Pre-shot rutine", level: "TURN", duration: 20, fav: true },
  { id: "e10", name: "Kald-start runde", level: "TURN", duration: 30, fav: false },
];

// Ukens økter — hver økt: dag (0=man, 6=søn), tid, varighet, tittel, nivå, øvelser, status
const UKE_OKTER = [
  { id: "w1", dag: 0, tid: "07:30", duration: 50, title: "Styrke — over kropp", level: "FYS", exercises: 3, status: "done" },
  { id: "w2", dag: 0, tid: "16:00", duration: 30, title: "Putting-drill", level: "TEK", exercises: 2, status: "done" },
  { id: "w3", dag: 1, tid: "08:00", duration: 45, title: "Driving range", level: "SLAG", exercises: 3, status: "done" },
  { id: "w4", dag: 1, tid: "17:30", duration: 20, title: "Mobilitet", level: "FYS", exercises: 2, status: "done" },
  { id: "w5", dag: 2, tid: "07:30", duration: 50, title: "Styrke — under kropp", level: "FYS", exercises: 4, status: "done" },
  { id: "w6", dag: 2, tid: "15:00", duration: 40, title: "Svinganalyse", level: "TEK", exercises: 2, status: "today" },
  { id: "w7", dag: 2, tid: "17:00", duration: 30, title: "Short game", level: "SLAG", exercises: 2, status: "planned" },
  { id: "w8", dag: 3, tid: "08:30", duration: 45, title: "Driving range", level: "SLAG", exercises: 3, status: "planned" },
  { id: "w9", dag: 3, tid: "16:00", duration: 20, title: "Putting-drill", level: "TEK", exercises: 2, status: "planned" },
  { id: "w10", dag: 4, tid: "07:30", duration: 50, title: "Styrke — kjerne", level: "FYS", exercises: 3, status: "planned" },
  { id: "w11", dag: 4, tid: "15:30", duration: 60, title: "Pre-turnering rutine", level: "TURN", exercises: 4, status: "planned" },
  { id: "w12", dag: 5, tid: "09:00", duration: 120, title: "Spill 9 hull — Gamle Fredrikstad", level: "SPILL", exercises: 1, status: "planned" },
  { id: "w13", dag: 6, tid: "10:00", duration: 30, title: "Restitusjon — gå", level: "FYS", exercises: 1, status: "planned" },
];

// Pyramide — uke-fordeling i prosent (faktisk vs mål)
const PYRAMIDE_DATA = [
  { level: "FYS",   actual: 28, target: 25 },
  { level: "TEK",   actual: 22, target: 20 },
  { level: "SLAG",  actual: 30, target: 30 },
  { level: "SPILL", actual: 15, target: 20 },
  { level: "TURN",  actual:  5, target:  5 },
];

// Coach meldinger
const COACH_MELDINGER = [
  { from: "Andreas K.", role: "Hovedcoach", text: "God økt på range i går — fokuser på impact-posisjonen i morgen.", time: "for 2 timer siden", unread: true },
  { from: "AI Coach", role: "Auto-analyse", text: "Du har lavt SPILL-volum denne uken. Foreslår 9 hull lørdag.", time: "i dag 09:14", unread: true, ai: true },
];

// Mål / progresjon
const MAAL = [
  { name: "HCP til 12.0", current: 13.4, target: 12.0, start: 15.9, unit: "" },
  { name: "Putts/runde", current: 31, target: 28, start: 34, unit: "" },
  { name: "GIR %", current: 58, target: 65, start: 49, unit: "%" },
];

// Nylige logger
const LOGG = [
  { date: "i går", title: "Driving range", duration: 45, level: "SLAG", note: "Solid kontakt på 7-jern. Litt åpent ansikt på driver." },
  { date: "man 20.04", title: "Styrke — over kropp", duration: 50, level: "FYS", note: "Tung økt — bra fremdrift på rad." },
  { date: "søn 19.04", title: "Spill 9 hull", duration: 115, level: "SPILL", note: "39 slag, 14 putts. To bogey på par 3." },
];

const UKEDAGER = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
const UKEDAGER_LANG = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

Object.assign(window, {
  TODAY, STANDARD_OKTER, OVELSER, UKE_OKTER, PYRAMIDE_DATA,
  COACH_MELDINGER, MAAL, LOGG, UKEDAGER, UKEDAGER_LANG,
});
