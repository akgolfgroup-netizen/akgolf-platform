// =============================================================================
// AK Golf Booking - Seed Konfigurasjon
// =============================================================================
// Oppdatert: 2026-03-26 — AK Golf Academy 2026 konsept
//
// ENDRE KUN VERDIENE I DENNE FILEN
// Etter endring: kjør `npx prisma db seed`
// =============================================================================

// -----------------------------------------------------------------------------
// 1. TRENERE
// -----------------------------------------------------------------------------

export const COACHES = {
  anders: {
    name: "Anders Kristiansen",
    email: "anders@akgolf.no",
    phone: "+47 918 16 456",
    title: "Head Coach",
    bio: "PGA-sertifisert trener med fokus på helhetlig spillerutvikling. Spesialist på The Foundation Method — en strukturert tilnærming til golf som bygger solide ferdigheter fra bunnen.",
  },
  markus: {
    name: "Markus Hatlelid",
    email: "markus@akgolf.no",
    phone: "+47 000 00 000",
    title: "Assistant Coach & Junior Coordinator",
    bio: "Spesialist på juniorutvikling og breddearbeid. Ansvarlig for GFGK juniorprogram og treningsgrupper.",
  },
};

// -----------------------------------------------------------------------------
// 2. TJENESTER & PRISER (i kroner)
// -----------------------------------------------------------------------------
// Fra AK Golf Academy 2026 konsept

export const SERVICES = {
  // ─── Onboarding ───
  start: {
    name: "Start",
    description: "3 × 20-minutters økter over 3 uker + 30 dagers portal. Kartlegging og utviklingsplan.",
    duration: 20, // per økt
    price: 3000, // 3 000 kr
    maxStudents: 1,
    color: "#B07D4F",
    coachId: "anders",
    active: true,
  },
  foundationTest: {
    name: "Foundation Test",
    description: "50 min introduksjonstime. Full kartlegging. Refunderbar ved abo-kjøp innen 14 dager.",
    duration: 50,
    price: 995, // 995 kr
    maxStudents: 1,
    color: "#B07D4F",
    coachId: "anders",
    active: true,
  },

  // ─── Drop-in / Flex (48t booking-vindu) ───
  flex50Solo: {
    name: "Flex 50 Solo",
    description: "50 min intensiv én-til-én coaching med videoanalyse.",
    duration: 50,
    price: 1500, // 1 500 kr
    maxStudents: 1,
    color: "#B07D4F",
    coachId: "anders",
    active: true,
  },
  flex50Duo: {
    name: "Flex 50 Duo",
    description: "50 min coaching for to spillere. 850 kr per person.",
    duration: 50,
    price: 1700, // 1 700 kr totalt (850 × 2)
    maxStudents: 2,
    color: "#1565C0",
    coachId: "anders",
    active: true,
  },
  flex90Solo: {
    name: "Flex 90 Solo",
    description: "90 min dybdecoaching én-til-én. Flere fokusområder + on-range praksis.",
    duration: 90,
    price: 2500, // 2 500 kr
    maxStudents: 1,
    color: "#B07D4F",
    coachId: "anders",
    active: true,
  },
  flex90Duo: {
    name: "Flex 90 Duo",
    description: "90 min dybdecoaching for to spillere. 1 400 kr per person.",
    duration: 90,
    price: 2800, // 2 800 kr totalt (1400 × 2)
    maxStudents: 2,
    color: "#1565C0",
    coachId: "anders",
    active: true,
  },

  // ─── Banecoaching ───
  onCourse9: {
    name: "On-Course 9",
    description: "Banecoaching 9 hull med Anders. Live kursmanagement med DECADE-prinsipper. Maks 2 spillere.",
    duration: 150, // ~2.5 timer
    price: 3000, // 3 000 kr/spiller
    maxStudents: 2, // Maks 2 spillere
    color: "#2E7D32",
    coachId: "anders",
    active: true,
  },
  onCoursePar3: {
    name: "On-Course Par 3",
    description: "9 hull på korthullsbanen med Markus. Grunnleggende banemanagement. Grupper à 4.",
    duration: 90, // ~90 min
    price: 500, // 500 kr/spiller
    maxStudents: 4,
    color: "#2E7D32",
    coachId: "markus",
    active: true,
  },

  // ─── Markus individuell ───
  markus20: {
    name: "Markus 20 min",
    description: "Kort treningsøkt med Markus. Raske justeringer eller oppfølging.",
    duration: 20,
    price: 300, // 300 kr
    maxStudents: 1,
    color: "#E65100",
    coachId: "markus",
    active: true,
  },

  // ─── Junior (Markus) ───
  juniorGroup: {
    name: "Junior Gruppetrening",
    description: "GFGK junior treningsgrupper. Treningsavgift TBD.",
    duration: 60,
    price: 0, // TBD
    maxStudents: 8,
    color: "#1565C0",
    coachId: "markus",
    active: false, // Aktiveres når pris er satt
  },
};

// -----------------------------------------------------------------------------
// 3. STEDER / LOKASJONER
// -----------------------------------------------------------------------------

export const LOCATIONS = {
  gfgk: {
    name: "Gamle Fredrikstad Golfklubb",
    address: "Golfveien 1, 1605 Fredrikstad",
    description: "Hovedlokasjon for AK Golf Academy. Driving range, short game area og 18-hulls bane.",
  },
  miklagard: {
    name: "Miklagard Golf",
    address: "Miklagardveien 1, 2004 Lillestrøm",
    description: "Sekundærlokasjon. Anders tilgjengelig annenhver fredag 13:00-19:00.",
  },
  mulligan: {
    name: "Mulligan Indoor Golf",
    address: "Mosseveien 50, 1619 Fredrikstad",
    description: "Innendørs simulatorfasiliteter med TrackMan. Vintertrening.",
  },
  wang: {
    name: "AK Golf Academy - Wang",
    address: "Wang Toppidrett, 2320 Ridabu",
    description: "Wang Toppidrett Fredrikstad samarbeid.",
  },
};

// -----------------------------------------------------------------------------
// 4. ÅPNINGSTIDER - Anders
// -----------------------------------------------------------------------------
// Fra AK Golf Academy 2026 konsept:
// - Pause 14:00–15:00 hver dag (henting)
// - Miklagard: annenhver fredag 13:00–19:00
// - Lørdag: varierer med turnus

export const AVAILABILITY = {
  anders: {
    // Mandag: 12:00–20:00 (annenhver), pause 14:00–15:00
    mon: [
      { start: "12:00", end: "14:00", location: "gfgk" },
      { start: "15:00", end: "20:00", location: "gfgk" },
    ],
    // Tirsdag: 13:00–20:00 (fast), pause 14:00–15:00
    tue: [
      { start: "13:00", end: "14:00", location: "gfgk" },
      { start: "15:00", end: "20:00", location: "gfgk" },
    ],
    // Onsdag: 12:00–16:00, pause 14:00–15:00 (GFGK juniortrening fra 16:00)
    wed: [
      { start: "12:00", end: "14:00", location: "gfgk" },
      { start: "15:00", end: "16:00", location: "gfgk" },
    ],
    // Torsdag: 13:00–20:00 (fast), pause 14:00–15:00
    thu: [
      { start: "13:00", end: "14:00", location: "gfgk" },
      { start: "15:00", end: "20:00", location: "gfgk" },
    ],
    // Fredag: 10:00–14:00 på GFGK (annenhver: 13:00–19:00 på Miklagard)
    fri: [{ start: "10:00", end: "14:00", location: "gfgk" }],
    // Lørdag: Varierer basert på turnus — håndteres manuelt
    sat: null,
    // Søndag: Stengt
    sun: null,
  },
  markus: {
    // Markus jobber KUN på GFGK
    // Timer TBD basert på juniortrening og gruppetimer
    mon: null,
    tue: [{ start: "14:00", end: "20:00", location: "gfgk" }],
    wed: [{ start: "16:00", end: "20:00", location: "gfgk" }], // Juniortrening
    thu: [{ start: "14:00", end: "20:00", location: "gfgk" }],
    fri: [{ start: "14:00", end: "18:00", location: "gfgk" }],
    sat: [{ start: "10:00", end: "16:00", location: "gfgk" }],
    sun: null,
  },
};

// -----------------------------------------------------------------------------
// 5. ABONNEMENTSPAKKER
// -----------------------------------------------------------------------------
// Fra AK Golf Academy 2026 konsept

export const PACKAGES = {
  performance: {
    name: "Performance",
    description: "2 × 20 min/mnd. 7 dagers booking-vindu. Maks 1/uke.",
    monthlyPrice: 1600, // 1 600 kr/mnd
    sessionsPerMonth: 2,
    sessionDurationMin: 20,
    bookingWindowDays: 7,
    maxPerWeek: 1,
    active: true,
  },
  performancePro: {
    name: "Performance Pro",
    description: "4 × 20 min/mnd. 14 dagers booking-vindu. Maks 2/uke. Prioritert tilgang.",
    monthlyPrice: 2000, // 2 000 kr/mnd
    sessionsPerMonth: 4,
    sessionDurationMin: 20,
    bookingWindowDays: 14,
    maxPerWeek: 2,
    active: true,
  },
};

// -----------------------------------------------------------------------------
// 6. BOOKING-REGLER
// -----------------------------------------------------------------------------

export const BOOKING_RULES = {
  // Avbestilling
  cancellation: {
    fullRefundHours: 24, // >24t før: 100% refusjon
    partialRefundHours: 2, // 2-24t før: 50% refusjon
    noRefundHours: 0, // <2t før: ingen refusjon
  },

  // Drop-in / Flex
  dropIn: {
    bookingWindowHours: 48, // Kun 48t frem i tid
    minNoticeHours: 2, // Minimum 2t før
  },

  // Abonnement
  subscription: {
    sessionReleaseHours: 24, // Frigjør sesjon ved avbestilling >24t før
  },

  // Generelt
  general: {
    slotDurationMin: 20, // Standard slot-varighet
    slotGapMin: 5, // Pause mellom slots
    totalSlotMin: 25, // 20 + 5 = 25 min mellom hver start
  },
};

// -----------------------------------------------------------------------------
// 7. GFGK JUNIOR TRENINGSGRUPPER (pris TBD)
// -----------------------------------------------------------------------------

export const GFGK_JUNIOR_GROUPS = {
  nybegynnere: {
    name: "Nybegynnere",
    coach: "markus",
    frequency: "Helårstilbud",
    price: 0, // TBD
    active: false,
  },
  juniorGolfskole: {
    name: "Junior og golfskole",
    coach: "markus",
    frequency: "10 t/uke, helår m/vinteraktivitet",
    price: 0, // TBD
    active: false,
  },
  hcp30Plus: {
    name: "Hcp 30+",
    coach: "markus",
    frequency: "1 × 60 min/uke",
    price: 0, // TBD
    active: false,
  },
  hcp16_29: {
    name: "Hcp 16–29",
    coach: "markus",
    frequency: "1 × 60 min/uke",
    price: 0, // TBD
    active: false,
  },
  hcp0_15: {
    name: "Hcp 0–15",
    coach: "anders",
    frequency: "1 × 60 min/uke",
    price: 0, // TBD
    active: false,
  },
  konkurranseSatsing: {
    name: "Konkurranse/satsing",
    coach: "markus",
    frequency: "Inkl. i junior 10 t/uke",
    price: 0, // TBD
    active: false,
  },
};

// -----------------------------------------------------------------------------
// 8. AK GOLF JUNIOR ACADEMY (kommersiell elite)
// -----------------------------------------------------------------------------

export const JUNIOR_ACADEMY = {
  academy: {
    name: "Academy",
    price: 2500, // 2 500 kr/mnd
    maxPlayers: 8,
    coach: "anders",
    description: "Elite-program for utvalgte juniorer. 8 spillere.",
    active: true,
  },
  prospect: {
    name: "Prospect",
    price: 2000, // 2 000 kr/mnd
    maxPlayers: 4,
    coach: "anders",
    description: "Utviklingsprogram for talentfulle juniorer. 4 spillere.",
    active: true,
  },
  camp: {
    name: "Junior Camp",
    price: 4500, // 4 500 kr/deltaker
    maxPlayers: 12,
    coach: "anders",
    description: "Intensiv camp for juniorer. Flere ganger per år.",
    active: true,
  },
};

// -----------------------------------------------------------------------------
// 9. FASILITETER (GFGK)
// -----------------------------------------------------------------------------

export const FACILITIES = [
  {
    slug: "driving-range-1",
    name: "Driving Range 1. etg",
    locationSlug: "gfgk",
    description: "Nedre etasje driving range med 10 utslagsplasser",
    capacity: 10,
    sortOrder: 1,
  },
  {
    slug: "driving-range-2",
    name: "Driving Range 2. etg",
    locationSlug: "gfgk",
    description: "Øvre etasje driving range med 10 utslagsplasser",
    capacity: 10,
    sortOrder: 2,
  },
  {
    slug: "short-game",
    name: "Nærspillsområde",
    locationSlug: "gfgk",
    description: "Chipping og pitching area med bunkere",
    capacity: 8,
    sortOrder: 3,
  },
  {
    slug: "putting-green",
    name: "Putting green",
    locationSlug: "gfgk",
    description: "Stor putting green",
    capacity: 12,
    sortOrder: 4,
  },
  {
    slug: "par3-course",
    name: "Korthullsbane",
    locationSlug: "gfgk",
    description: "9 hull par 3 bane",
    capacity: 16,
    sortOrder: 5,
  },
  {
    slug: "back-range",
    name: "Bakside range",
    locationSlug: "gfgk",
    description: "Utendørs range bak klubbhuset",
    capacity: 6,
    sortOrder: 6,
  },
  {
    slug: "performance-studio",
    name: "Performance Studio",
    locationSlug: "gfgk",
    description: "TrackMan studio med videoanalyse",
    capacity: 2,
    sortOrder: 7,
  },
  {
    slug: "outdoor-range",
    name: "Uteplass driving range",
    locationSlug: "gfgk",
    description: "Utendørs utslagsplasser foran driving range",
    capacity: 20,
    sortOrder: 8,
  },
];

// -----------------------------------------------------------------------------
// 10. INSTRUKTØR-FASILITET DEFAULTS
// -----------------------------------------------------------------------------

export const INSTRUCTOR_FACILITY_DEFAULTS = [
  {
    instructorSlug: "anders",
    facilitySlug: "performance-studio",
    priority: 10,
  },
  {
    instructorSlug: "markus",
    facilitySlug: "driving-range-1",
    serviceTypeSlug: "markus20",
    priority: 10,
  },
  {
    instructorSlug: "markus",
    facilitySlug: "performance-studio",
    priority: 5,
  },
];

// -----------------------------------------------------------------------------
// INSTRUKSJONER
// -----------------------------------------------------------------------------
//
// 1. ENDRE verdiene over (priser i KRONER)
// 2. Sett `active: true` for tjenester som tilbys
// 3. Sett `active: false` for tjenester som IKKE tilbys
// 4. Lagre filen
// 5. Kjør: npx prisma db seed
//
// MERK:
// - Miklagard-fredager (annenhver) må legges til manuelt i CoachingAvailability
// - Lørdager (varierer) må legges til manuelt
// - GFGK Junior treningsgrupper aktiveres når pris er satt
//
// =============================================================================
