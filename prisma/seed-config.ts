// =============================================================================
// AK Golf Booking - Seed Konfigurasjon
// =============================================================================
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
    phone: "+47 000 00 000", // ← ENDRE
    title: "Head Coach",
    bio: "PGA-sertifisert trener med fokus på helhetlig spillutvikling.", // ← ENDRE
  },
  markus: {
    name: "Markus Røinås Pedersen",
    email: "markus@akgolf.no",
    phone: "+47 000 00 000", // ← ENDRE
    title: "Junior Coach",
    bio: "Spesialist på juniorutvikling og talentarbeid.", // ← ENDRE
  },
};

// -----------------------------------------------------------------------------
// 2. TJENESTER & PRISER (i øre - 100 = 1 kr)
// -----------------------------------------------------------------------------

export const SERVICES = {
  // Anders - Voksne
  individual: {
    name: "Individuell coaching",
    description: "1-til-1 coachingtime med TrackMan-analyse og videogjennomgang.",
    duration: 60, // minutter
    price: 99500, // 995 kr ← ENDRE (i øre)
    maxStudents: 1,
    color: "#B07D4F",
    coachId: "anders",
    active: true, // ← ENDRE til false hvis ikke tilgjengelig
  },
  playing: {
    name: "Playing lesson",
    description: "Coaching ute på banen. 9 hull med fokus på kursmanagement og mental strategi.",
    duration: 120,
    price: 179500, // 1795 kr ← ENDRE
    maxStudents: 1,
    color: "#2E7D32",
    coachId: "anders",
    active: true,
  },
  group: {
    name: "Gruppetrening",
    description: "Trening i gruppe (maks 4). Fokus på kortspill og putting.",
    duration: 90,
    price: 49500, // 495 kr/pers ← ENDRE
    maxStudents: 4,
    color: "#1565C0",
    coachId: "anders",
    active: false, // ← ENDRE til true hvis tilgjengelig
  },
  simulator: {
    name: "Simulator-time",
    description: "TrackMan-sesjon i Mulligan Indoor Golf simulator.",
    duration: 60,
    price: 59500, // 595 kr ← ENDRE
    maxStudents: 2,
    color: "#6A1B9A",
    coachId: "anders",
    active: false, // ← ENDRE til true hvis tilgjengelig
  },

  // Markus - Junior
  juniorIndividual: {
    name: "Junior - Individuell coaching",
    description: "1-til-1 coaching for juniorer (13-19 år).",
    duration: 60,
    price: 79500, // 795 kr ← ENDRE
    maxStudents: 1,
    color: "#B07D4F",
    coachId: "markus",
    active: false, // ← ENDRE til true hvis tilgjengelig
  },
  junior21: {
    name: "Junior 2:1 coaching",
    description: "Coaching for 2 juniorer samtidig. 90 minutter.",
    duration: 90,
    price: 45000, // 450 kr/pers ← ENDRE
    maxStudents: 2,
    color: "#E65100",
    coachId: "markus",
    active: true, // ← ENDRE
  },
  juniorGroup: {
    name: "Junior gruppetrening",
    description: "Team-trening for juniorer.",
    duration: 90,
    price: 35000, // 350 kr ← ENDRE
    maxStudents: 6,
    color: "#1565C0",
    coachId: "markus",
    active: false, // ← ENDRE til true hvis tilgjengelig
  },
};

// -----------------------------------------------------------------------------
// 3. STEDER / LOKASJONER
// -----------------------------------------------------------------------------

export const LOCATIONS = {
  gfgk: {
    name: "Gamle Fredrikstad Golfklubb",
    address: "Golfveien 1, 1605 Fredrikstad", // ← ENDRE
  },
  mulligan: {
    name: "Mulligan Indoor Golf",
    address: "Mosseveien 50, 1619 Fredrikstad", // ← ENDRE
  },
  wang: {
    name: "AK Golf Academy - Wang",
    address: "Wang UH, Toneheim, 2320 Ridabu", // ← ENDRE
  },
};

// -----------------------------------------------------------------------------
// 4. ÅPNINGSTIDER
// Format: { dag: { start: "HH:MM", end: "HH:MM", location: "sted" } }
// Dager: mon, tue, wed, thu, fri, sat, sun
// -----------------------------------------------------------------------------

export const AVAILABILITY = {
  anders: {
    mon: { start: "09:00", end: "17:00", location: "gfgk" },
    tue: { start: "09:00", end: "17:00", location: "gfgk" },
    wed: { start: "09:00", end: "17:00", location: "mulligan" },
    thu: { start: "09:00", end: "17:00", location: "gfgk" },
    fri: null, // Stengt
    sat: { start: "10:00", end: "14:00", location: "gfgk" },
    sun: null, // Etter avtale
  },
  markus: {
    mon: null, // Stengt
    tue: { start: "14:00", end: "20:00", location: "gfgk" },
    wed: null, // Stengt
    thu: { start: "14:00", end: "20:00", location: "mulligan" },
    fri: { start: "14:00", end: "18:00", location: "gfgk" },
    sat: { start: "10:00", end: "16:00", location: "gfgk" },
    sun: null, // Stengt
  },
};

// -----------------------------------------------------------------------------
// 5. ABBONNEMENTSPAKKER (VALGFRITT)
// -----------------------------------------------------------------------------

export const PACKAGES = {
  basis: {
    name: "Grunnpakke",
    description: "2 coaching-økter/mnd, IUP-plan, videoanalyse, meldingsstøtte",
    monthlyPrice: 490000, // 4900 kr/mnd ← ENDRE
    sessionsPerMonth: 2,
    active: false, // ← ENDRE til true hvis tilgjengelig
  },
  elite: {
    name: "Elite",
    description: "4 coaching-økter/mnd, IUP-plan, ukentlig videoanalyse, mental trening, kursmanagement-økt, direkte trener-tilgang",
    monthlyPrice: 890000, // 8900 kr/mnd ← ENDRE
    sessionsPerMonth: 4,
    active: false, // ← ENDRE til true hvis tilgjengelig
  },
  elitePlus: {
    name: "Elite+",
    description: "Ubegrenset coaching, daglig oppfølging, turneringsstøtte, fysisk trening, full IUP + mentalt, reise-coaching",
    monthlyPrice: 0, // På forespørsel
    sessionsPerMonth: 999,
    active: false,
  },
};

// -----------------------------------------------------------------------------
// INSTRUKSJONER
// -----------------------------------------------------------------------------
//
// 1. ENDRE kun verdiene over (priser i ØRE - 100 = 1 kr)
// 2. Sett `active: true` for tjenester som tilbys
// 3. Sett `active: false` for tjenester som IKKE tilbys
// 4. Endre åpningstider i AVAILABILITY
// 5. Lagre filen
// 6. Kjør: npx prisma db seed
//
// =============================================================================
