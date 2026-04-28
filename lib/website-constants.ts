// ─── Navigation ───
export const NAV_LINKS = [
  { label: "Coaching", href: "/academy" },
] as const;

// ─── Hero ───
export const HERO = {
  eyebrow: "TRENINGSABONNEMENT FOR GOLF",
  heading: "Tren golf med system.",
  greenWord: "system.",
  subheading: "AK Golf Academy er et treningsabonnement der du møter trener 2 eller 4 ganger i måneden. Hver sesjon er 20 minutter — fokusert, målt med TrackMan og filmet for analyse. Mellom sesjonene vet du nøyaktig hva du skal trene på.",
  ctaPrimary: "Se treningsabonnement",
  ctaSecondary: "Prøv en enkeltsesjon",
  statusBadge: "Sesong 2026 — begrenset kapasitet",
  trustItems: [
    { label: "TrackMan-analyse hver sesjon" },
    { label: "Personlig treningsplan" },
  ],
} as const;

// ─── The Foundation Method ───
export const FOUNDATION_METHOD = {
  eyebrow: "Vår metodikk",
  heading: "Varig endring. Ikke quick fixes.",
  description: "Vår tilnærming bygger på The Foundation Method.",
  phases: [
    {
      id: "ANALYSE",
      name: "01",
      title: "Analyse",
      description: "Vi kartlegger teknikken din med TrackMan-data og videoanalyse. Du ser nøyaktig hva vi jobber med – ingen gjetning.",
    },
    {
      id: "PLAN",
      name: "02",
      title: "Plan",
      description: "Du får en personlig treningsplan i appen, skreddersydd for ditt unike svingmønster.",
    },
    {
      id: "OPPFOLGING",
      name: "03",
      title: "Oppfølging",
      description: "Jevnlige 1-til-1 økter sikrer at du holder rett kurs. Planen justeres løpende basert på din utvikling.",
    },
  ],
} as const;

// ─── Team ───
export const TEAM = [
  {
    name: "Anders Kristiansen",
    role: "Hovedcoach",
    division: "AK Golf Academy",
    image: "/images/team/anders-kristiansen.jpg",
    bio: "Hovedcoach i AK Golf Academy og utvikler av coaching-systemet og PlayersHQ. Jobber med spillere som vil ha individuell teknisk veiledning og langsiktig utvikling.",
    prices: [
      { name: "Performance", price: "1 200", unit: "kr/mnd", detail: "2x20 min" },
      { name: "Performance Pro", price: "2 200", unit: "kr/mnd", detail: "4x20 min" },
      { name: "Enkeltsesjon 50 min", price: "1 500", unit: "kr" },
      { name: "Banecoaching 9 hull", price: "3 000", unit: "kr/spiller" },
    ],
    contact: { email: "anders@akgolf.no", phone: "+47 909 67 995" },
  },
  {
    name: "Markus R. Pedersen",
    role: "Coach",
    division: "AK Golf Academy",
    image: null,
    bio: "College-golf fra USA. Ansvarlig for VTG-kurs, gruppetreninger og juniorer. Sikrer at du lærer riktige grunnprinsipper fra starten.",
    prices: [
      { name: "Performance", price: "1 000", unit: "kr/mnd", detail: "2x20 min" },
      { name: "Enkeltsesjon 50 min", price: "800", unit: "kr" },
      { name: "Drop-in 20 min", price: "300", unit: "kr" },
      { name: "Korthullsbane-økt", price: "TBD", unit: "", detail: "4 spillere" },
    ],
    contact: { email: "markus@akgolf.no", phone: "+47 905 86 097" },
  },
] as const;

// ─── Divisions / Services ───
export const DIVISIONS = [
  {
    id: "academy",
    title: "Academy",
    description: "Treningsabonnement for voksne golfspillere. 1-til-1 coaching med TrackMan, PlayersHQ og personlig treningsplan.",
    features: ["20-min fokuserte sesjoner", "TrackMan-analyse", "Personlig treningsplan", "PlayersHQ"],
    href: "/academy",
    ctaLabel: "Se treningsabonnement",
    accent: "academy" as const,
  },
  {
    id: "junior",
    title: "Junior Academy",
    description: "Treningsprogram for unge spillere fra første turnering til elite-nivå. Gruppetrening, individuell oppfølging og sesongplanlegging.",
    features: ["Nivåtilpasset trening", "Konkurranseveiledning", "Periodisering", "Foreldresamarbeid"],
    href: "/junior-academy",
    ctaLabel: "Se juniorprogrammet",
    accent: "junior" as const,
  },
  {
    id: "utvikling",
    title: "Utvikling & Teknologi",
    description: "PlayersHQ, treningsverktøy og sportslig rådgiving for golfklubber og trenere.",
    features: ["Sportsplaner", "QR-treningsskilt", "IUP-plattform", "Trenerutvikling"],
    href: "/utvikling",
    ctaLabel: "Se løsninger for klubber",
    accent: "utvikling" as const,
  },
] as const;

// ─── How It Works ───
export const HOW_IT_WORKS = {
  eyebrow: "Slik fungerer det",
  heading: "Coaching som faktisk følger deg mellom sesjonene.",
  description: "De fleste tar en golftime i ny og ne. Etterpå trener de på egenhånd uten plan. Vi gjør det annerledes.",
  steps: [
    { number: "01", title: "Du booker en sesjon i appen", description: "Velg tid som passer deg. 20 minutter med trener — ingen fyllminutter." },
    { number: "02", title: "Treneren måler, filmer og veileder", description: "TrackMan registrerer data. Video fanger teknikken. Du jobber med én ting om gangen." },
    { number: "03", title: "Treningsplanen din oppdateres", description: "Etter sesjonen legger treneren inn øvelser, notater og fokusområder i PlayersHQ. Du ser det med én gang." },
    { number: "04", title: "Du trener mellom sesjonene", description: "Treningsplanleggeren viser hva du skal gjøre, dag for dag. Du logger øktene dine og ser progresjonen over tid." },
    { number: "05", title: "Neste sesjon bygger videre", description: "Treneren ser hva du har trent på. Dere plukker opp der dere slapp. Ingen repetisjon, bare fremgang." },
  ],
} as const;

// ─── Coaching Packages (Abonnement) ───
export const COACHING_PACKAGES = [
  {
    name: "Performance",
    coach: "Anders",
    price: "1 200",
    period: "kr/mnd",
    tagline: "For deg som ønsker struktur og jevnlig oppfølging.",
    description: "2 x 20 min 1-til-1 coaching per måned. TrackMan og videoanalyse. Full portaltilgang og treningsplan.",
    whoIsItFor: "For deg som ønsker struktur og jevnlig oppfølging.",
    features: [
      "2 x 20 min 1-til-1 coaching per måned",
      "TrackMan og videoanalyse",
      "Full portaltilgang og treningsplan",
    ],
    highlighted: false,
    badge: null,
    stripeMetadata: {
      type: "subscription",
      sessions_per_month: 2,
      session_duration: 20,
      booking_window_days: 28,
      max_per_week: 1,
      max_capacity: 24,
    },
  },
  {
    name: "Performance Pro",
    coach: "Anders",
    price: "2 200",
    period: "kr/mnd",
    tagline: "For den ambisiøse som vil ha raskere fremgang.",
    description: "4 x 20 min 1-til-1 coaching per måned. TrackMan og videoanalyse. Full portaltilgang og treningsplan.",
    whoIsItFor: "For den ambisiøse som vil ha raskere fremgang.",
    features: [
      "4 x 20 min 1-til-1 coaching per måned",
      "TrackMan og videoanalyse",
      "Full portaltilgang og treningsplan",
    ],
    highlighted: true,
    badge: "Mest populær",
    stripeMetadata: {
      type: "subscription",
      sessions_per_month: 4,
      session_duration: 20,
      booking_window_days: 28,
      max_per_week: 2,
      max_capacity: 10,
    },
  },
  {
    name: "Performance",
    coach: "Markus",
    price: "1 000",
    period: "kr/mnd",
    tagline: "Klubbcoaching med Markus.",
    description: "2 x 20 min 1-til-1 coaching per måned med Markus. Full portaltilgang og treningsplan.",
    whoIsItFor: "For deg som ønsker struktur med Markus.",
    features: [
      "2 x 20 min 1-til-1 coaching per måned",
      "Full portaltilgang og treningsplan",
    ],
    highlighted: false,
    badge: null,
    stripeMetadata: {
      type: "subscription",
      sessions_per_month: 2,
      session_duration: 20,
      booking_window_days: 28,
      max_per_week: 1,
      max_capacity: 24,
    },
  },
  {
    name: "Performance Pro",
    coach: "Markus",
    price: "1 400",
    period: "kr/mnd",
    tagline: "Høyere frekvens med Markus.",
    description: "4 x 20 min 1-til-1 coaching per måned med Markus. Full portaltilgang og treningsplan.",
    whoIsItFor: "Høyere frekvens med Markus.",
    features: [
      "4 x 20 min 1-til-1 coaching per måned",
      "Full portaltilgang og treningsplan",
    ],
    highlighted: false,
    badge: null,
    stripeMetadata: {
      type: "subscription",
      sessions_per_month: 4,
      session_duration: 20,
      booking_window_days: 28,
      max_per_week: 2,
      max_capacity: 10,
    },
  },
] as const;

// ─── Product Descriptions for Booking System / Stripe ───
export const PRODUCT_DESCRIPTIONS = {
  subscription: {
    performance: "Månedlig coaching-abonnement. Inkluderer 2x20 minutter 1-til-1 veiledning med TrackMan/video, pluss oppdatert treningsplan i app. Ingen bindingstid.",
    performancePro: "Vårt mest populære abonnement. Inkluderer 4x20 minutter 1-til-1 veiledning med TrackMan/video, oppdatert treningsplan i app, og 14 dagers prioritert booking. Ingen bindingstid.",
  },
  flex: {
    flex50Solo: "50 minutters 1-til-1 coaching med Anders. Dypdykk i teknikken din med TrackMan og videoanalyse. Inkluderer 30 dagers tilgang til treningsportalen.",
    flex50Duo: "50 minutters coaching for 2 personer. Del økten og prisen med en venn. TrackMan, videoanalyse og 30 dagers portaltilgang for begge.",
    flex90Solo: "90 minutters intensiv 1-til-1 coaching. Perfekt for total gjennomgang av bagen. Inkluderer 30 dagers portaltilgang.",
  },
  bane: {
    onCourse9: "Ca. 2,5 timer strategisk veiledning på banen for opptil 2 spillere. Vi fokuserer på course management, rutiner og valg av slag. Greenfee kommer i tillegg om du ikke er medlem i GFGK.",
    onCoursePar3: "90 minutter effektiv nærspills- og banetrening på korthullsbanen. Maks 4 spillere. Ledet av Markus.",
    gameday: "En hel dag (09:00 - 16:00) dedikert til din utvikling. Maks 12 spillere. Formiddagen brukes på teknikk og analyse, ettermiddagen på bane med coaching. Lunsj inkludert.",
  },
} as const;

// ─── Service Types (enkelttimer-kategorier) ───
export const SERVICE_TYPES = [
  { id: "individual", name: "1-til-1 Coaching", description: "Fra 1 500 kr / 60 min", icon: "user" },
  { id: "tee-total", name: "Tee Total", description: "Driver og langspill", icon: "target" },
  { id: "short-game", name: "Nærspill", description: "Chipping og bunker", icon: "flag" },
  { id: "putting", name: "Putting", description: "Greenferdigheter", icon: "circle-dot" },
  { id: "playing-lesson", name: "Playing Lesson", description: "Coaching på banen", icon: "map" },
] as const;

// ─── Enkelttimer ───
export const SINGLE_SESSIONS = {
  anders: {
    name: "Anders Kristiansen",
    role: "Head Coach",
    sessions: [
      { name: "Privat 1:1", duration: "50 min", price: "1 500", priceLabel: "kr", maxParticipants: 1 },
      { name: "Duo 2:1", duration: "50 min", price: "850", priceLabel: "kr/pers", maxParticipants: 2 },
      { name: "Gruppetrening", duration: "60 min", price: "500", priceLabel: "kr/pers", maxParticipants: 4 },
      { name: "Playing lesson", duration: "2 timer", price: "2 500", priceLabel: "kr", maxParticipants: 1 }
    ]
  },
  markus: {
    name: "Markus Røinås Pedersen",
    role: "Coach",
    sessions: [
      { name: "Privat 1:1", duration: "50 min", price: "750", priceLabel: "kr", maxParticipants: 1 },
      { name: "Duo 2:1", duration: "50 min", price: "500", priceLabel: "kr/pers", maxParticipants: 2 },
      { name: "Gruppetrening", duration: "60 min", price: "350", priceLabel: "kr/pers", maxParticipants: 4 }
    ]
  }
} as const;

// ─── Drop-in / Flex ───
export const FLEX_PACKAGES = [
  {
    name: "Enkeltsesjon Anders",
    price: "1 500",
    period: "kr",
    duration: "50 min",
    coach: "Anders",
    tagline: "50 min 1-til-1 coaching med Anders.",
    description: "50 min 1-til-1 coaching. TrackMan og videoanalyse. 30 dagers portaltilgang inkludert.",
    includes: [
      "50 min 1-til-1 coaching",
      "TrackMan og videoanalyse",
      "30 dagers portaltilgang inkludert",
    ],
    notIncluded: ["Prioritert booking"],
    stripeMetadata: {
      type: "drop_in",
      session_duration: 50,
      booking_window_hours: 48,
      slots_required: 2,
      includes_portal: true,
      includes_coaching_notes: true,
    },
  },
  {
    name: "Enkeltsesjon Markus",
    price: "800",
    period: "kr",
    duration: "50 min",
    coach: "Markus",
    tagline: "50 min 1-til-1 coaching med Markus.",
    description: "50 min 1-til-1 coaching med Markus. 30 dagers portaltilgang inkludert.",
    includes: [
      "50 min 1-til-1 coaching",
      "30 dagers portaltilgang inkludert",
    ],
    notIncluded: ["Prioritert booking"],
    stripeMetadata: {
      type: "drop_in",
      session_duration: 50,
      booking_window_hours: 48,
      slots_required: 2,
      includes_portal: true,
      includes_coaching_notes: true,
    },
  },
  {
    name: "Drop-in 20 min",
    price: "300",
    period: "kr",
    duration: "20 min",
    coach: "Markus",
    tagline: "Kort økt for raske justeringer.",
    description: "20 minutters coaching med Markus. Korte, effektive økter for raske justeringer eller oppfølging.",
    includes: [
      "20 min coaching med Markus",
      "1 mnd portaltilgang inkludert",
    ],
    notIncluded: [],
    stripeMetadata: {
      type: "drop_in",
      session_duration: 20,
      booking_window_hours: 48,
      slots_required: 1,
      includes_portal: true,
      includes_coaching_notes: true,
    },
  },
] as const;

// ─── Banecoaching ───
export const BANECOACHING = [
  {
    name: "Banecoaching 9 hull",
    price: "3 000",
    period: "kr/spiller",
    coach: "Anders",
    description: "9 hull på 18-hullsbanen med Anders. Strategi i praksis — du lærer å velge riktig slag basert på din faktiske spredning.",
    details: "Maks 2 spillere. Varighet ca. 2,5 timer. 1 mnd portaltilgang inkludert.",
    stripeMetadata: {
      type: "playing_lesson",
      holes: 9,
      course: "18-hull",
      max_participants: 2,
      portalAccessDays: 30,
    },
  },
  {
    name: "Korthullsbane-økt",
    price: "TBD",
    period: "",
    coach: "Markus",
    description: "Banecoaching på korthullsbanen med Markus. Nærspill og banemanagement i praksis.",
    details: "Maks 4 spillere. Pris kommer.",
    stripeMetadata: {
      type: "playing_lesson",
      holes: 9,
      course: "par3",
      max_participants: 4,
      portalAccessDays: 30,
    },
  },
] as const;

// ─── Flex 20 (Markus) ───
export const MARKUS_SESSIONS = {
  name: "Flex 20",
  price: "300",
  period: "kr",
  description: "20 minutters coaching med Markus. Korte, effektive okter for raske justeringer eller oppfolging. 1 mnd portaltilgang inkludert.",
  bookingNote: "Book via appen.",
} as const;

// ─── Gruppekonsepter ───
export const GROUP_CONCEPTS = [
  {
    id: "gameday",
    name: "Gameday",
    price: "2 500",
    period: "kr/person",
    category: "helg",
    description: "En hel dag golf med strategi og TrackMan-analyse. 12 spillere, 1 TrackMan, 3 stasjoner som roterer. Starter med felles briefing, deretter 4 timer med teknikk, kort spill og banemanagement. Avslutter med 9 hull under press.",
    details: "Lørdag/søndag, 09:00–16:00. Lunsj inkludert. ~9 helger per sesong.",
    includes: ["Komplett spillerrapport i appen"],
    stripeMetadata: {
      type: "group_event",
      format: "full_day",
      participants: 12,
      includes_lunch: true,
    },
  },
  {
    id: "forste-sesong",
    name: "Første Sesong",
    price: "4 500",
    period: "kr",
    category: "nybegynner",
    description: "8-ukers program for deg som aldri har spilt golf — eller nettopp tatt VTG-kurs. Du lærer det du faktisk trenger for å komme deg ut på banen: grip, sving, kort spill, putting, regler og baneoppførsel.",
    details: "Alt på korthullsbanen — 9 hull par 3 som er perfekt for nybegynnere. Maks 8 deltakere per kull, 3 kull per sesong.",
    includes: [
      "8 gruppetreninger à 90 min",
      "3 guidede runder på korthullsbanen",
      "Utstyrslån",
      "30 dagers portaltilgang"
    ],
    stripeMetadata: {
      type: "group_program",
      weeks: 8,
      sessions: 11,
      max_participants: 8,
    },
  },
  {
    id: "9-hull-kveld",
    name: "9 Hull",
    price: "250",
    period: "kr/kveld",
    seasonPass: "3 500",
    category: "ukentlig",
    description: "Ukentlig 9 hull på korthullsbanen med Markus.",
    variants: [
      { name: "9 Hull Social", description: "Alle nivåer. Scramble-format, sosialt fokus. Perfekt for deg som vil spille mer uten press." },
      { name: "9 Hull Challenge", description: "Hcp under 36. Individuell stableford. For deg som vil trene på scoring." }
    ],
    stripeMetadata: {
      type: "recurring_group",
      frequency: "weekly",
    },
  },
  {
    id: "after-work",
    name: "After Work",
    price: "500",
    period: "kr/person",
    category: "bedrift",
    description: "Fredagskveld 17–20 på korthullsbanen. Markus kjører alt — introduksjon, instruksjon på range, 9 hull i grupper og premieutdeling.",
    details: "Ingen golferfaring nødvendig. Utstyr inkludert. Maks 24 deltakere.",
    stripeMetadata: {
      type: "corporate_event",
      max_participants: 24,
      includes_equipment: true,
    },
  },
  {
    id: "bedriftsgolf",
    name: "Bedriftsgolf",
    price: "2 500",
    period: "kr/person",
    category: "bedrift",
    description: "Premium halvdagsevent med Anders på 18-hullsbanen. TrackMan-stasjon, instruksjon, 9 hull scramble, lunsj og premieutdeling.",
    details: "For bedrifter som vil gi teamet en eksklusiv opplevelse. Maks 16 deltakere.",
    stripeMetadata: {
      type: "corporate_event",
      max_participants: 16,
      includes_lunch: true,
      includes_trackman: true,
    },
  },
  {
    id: "vintertrening",
    name: "Vintertrening",
    price: "3 500",
    period: "kr",
    category: "sesong",
    description: "6-ukers simulatorprogram fra november til mars. Ukentlige økter med TrackMan-data, teknisk gjennomgang og strukturerte øvelser.",
    details: "Hold utviklingen gående gjennom vinteren. Maks 6 spillere per kull.",
    stripeMetadata: {
      type: "seasonal_program",
      weeks: 6,
      max_participants: 6,
    },
  },
] as const;

// ─── Digital Platform (for hele Norge) ───
export const DIGITAL_PLATFORM = {
  intro: {
    heading: "Tren strukturert uansett hvor du bor",
    description: "Bor du utenfor Fredrikstad? AK Golf-plattformen gir deg tilgang til det samme systemet som våre fysiske spillere bruker — uten å møte opp.",
  },
  tiers: [
    {
      name: "Free",
      price: "0",
      period: "kr",
      description: "Prøv plattformen uten risiko.",
      features: [
        "Treningsdagbok (maks 3 runder/mnd)",
        "10 øvelser fra øvelsesbanken",
        "Basisstatistikk"
      ],
      stripeMetadata: { type: "digital_subscription", tier: "free" },
    },
    {
      name: "Pro",
      price: "300",
      period: "kr/mnd",
      description: "Alt du trenger for å trene strukturert på egen hånd.",
      features: [
        "Full treningsdagbok",
        "Komplett øvelsesbank",
        "Statistikk Pro",
        "Treningsplanlegger med periodisering",
        "AI-analyse med benchmarking"
      ],
      highlighted: true,
      stripeMetadata: {
        type: "digital_subscription",
        tier: "pro",
        portal_access: "full",
        ai_analysis: true,
        benchmarking: true,
      },
    },
    {
      name: "Pro + Coaching",
      price: "800",
      period: "kr/mnd",
      description: "Alt i Pro, pluss personlig oppfølging.",
      features: [
        "Alt i Pro",
        "2 swing-videoer per uke med AI-assistert feedback",
        "1 × 20 min videosamtale i måneden",
        "Personlig treningsplan justert månedlig",
        "Responstid: 48 timer"
      ],
      stripeMetadata: {
        type: "digital_subscription",
        tier: "pro_coaching",
        swing_videos_per_week: 2,
        video_calls_per_month: 1,
        response_hours: 48,
      },
    },
    {
      name: "Elite",
      price: "1 500",
      period: "kr/mnd",
      description: "Alt i Pro + Coaching, pluss prioritert oppfølging.",
      features: [
        "Alt i Pro + Coaching",
        "3 × 20 min live videosesjon per måned",
        "Ubegrenset swing-video",
        "Prioritert responstid (12 timer)",
        "Turneringsplanlegging"
      ],
      note: "Maks 50 spillere.",
      stripeMetadata: {
        type: "digital_subscription",
        tier: "elite",
        live_sessions_per_month: 3,
        swing_videos: "unlimited",
        response_hours: 12,
        max_capacity: 50,
      },
    },
  ],
  juniorDigital: {
    name: "Junior Digital",
    price: "200",
    period: "kr/mnd",
    description: "Treningsplan tilpasset alder, øvelsesvideoer og progresjonslogging synlig for foreldre.",
    note: "For juniorer utenfor Fredrikstad som vil trene strukturert. Fra Q3 2026.",
    available: false,
  },
} as const;

// ─── Portal Features ───
export const PORTAL_FEATURES = [
  { title: "Treningsplan", description: "Oppdateres etter hver sesjon med konkrete øvelser og fokusområder." },
  { title: "Øvelsesbank", description: "HD-videoer med instruksjoner for alle deler av spillet. Filtrert på tema og nivå." },
  { title: "Treningsdagbok", description: "Logg runder, treningsøkter og score. Se utviklingen over tid." },
  { title: "Statistikk Pro", description: "Detaljert analyse av styrker og svakheter. Fairway, GIR, putting, scrambling." },
  { title: "AI-analyse", description: "Automatiserte anbefalinger basert på dine data. Hva bør du prioritere nå?" },
  { title: "TrackMan-data", description: "Data fra coaching-sesjonene logget i profilen din. Trender over tid." },
  { title: "Benchmarking", description: "Sammenlign deg med spillere på ditt nivå. Se hvor du ligger." },
] as const;

// ─── Portal Preview Screens ───
export const PORTAL_PREVIEW_SCREENS = [
  {
    id: "dashboard",
    title: "Dashboard",
    image: "/images/portal-preview/dashboard.png",
    features: [
      "Se neste booking og kommende økter",
      "Følg handicap-utvikling over tid",
      "Få personlige coach-anbefalinger",
    ],
  },
  {
    id: "treningsplan",
    title: "Treningsplan",
    image: "/images/portal-preview/treningsplan.png",
    features: [
      "AI-generert ukeplan tilpasset deg",
      "Konkrete øvelser med instruksjoner",
      "Marker økter som fullført",
    ],
  },
  {
    id: "statistikk",
    title: "Statistikk",
    image: "/images/portal-preview/statistikk.png",
    features: [
      "Strokes Gained-analyse",
      "Score-utvikling over tid",
      "Identifiser styrker og svakheter",
    ],
  },
  {
    id: "coaching",
    title: "Coaching-historikk",
    image: "/images/portal-preview/coaching-historikk.png",
    features: [
      "AI-oppsummering av hver økt",
      "Full historikk med notater",
      "TrackMan-data fra sesjonene",
    ],
  },
] as const;

// ─── Drop-in vs Abonnement ───
export const DROPIN_VS_SUBSCRIPTION = {
  heading: "Trenger du binding? Nei. Men det lønner seg.",
  description: "Flex gir deg coaching uten forpliktelser. Men du får kun coaching-notater — ikke PlayersHQ. Ingen treningsplan mellom sesjonene, ingen statistikk, ingen progresjon.",
  conclusion: "Performance gir deg coaching OG systemet som gjør at treningen mellom sesjonene faktisk fungerer. Det er forskjellen mellom å ta en time og å utvikle seg.",
} as const;

// ─── Coaching FAQ ───
export const COACHING_FAQ = [
  { q: "Hva er et treningsabonnement?", a: "Du betaler en fast månedspris og booker 20-minutters coaching-sesjoner i appen. Mellom sesjonene har du tilgang til PlayersHQ med treningsplan, øvelser og progresjon. Tenk på det som et treningsstudio-abonnement — men for golftrening med personlig trener." },
  { q: "Hvorfor 20 minutter?", a: "Fordi det er nok tid til å jobbe fokusert med én ting og bekrefte at endringen sitter. Korte sesjoner gjør at du kan trene oftere med trener — og frekvens gir raskere utvikling enn lange timer med lang tid mellom." },
  { q: "Hva er forskjellen på Anders og Markus?", a: "Anders jobber med spillere som vil ha individuell teknisk utvikling og langsiktig oppfølging. Markus spesialiserer seg på nye golfere, grunnprinsipper og gruppetreninger. Begge bruker samme system og PlayersHQ." },
  { q: "Trenger jeg et visst nivå for å starte?", a: "Nei. Systemet er bygget for alle nivåer. Er du helt ny, starter du hos Markus med grunnprinsippene. Har du spilt lenge, jobber du med Anders på teknikk og strategi." },
  { q: "Er det bindingstid?", a: "Nei. Abonnementet løper månedlig og kan sies opp når som helst." },
  { q: "Hva er PlayersHQ?", a: "En treningsapp der du ser treningsplanen din, logger økter, følger progresjonen din og har tilgang til øvelsesbank med video. Treneren oppdaterer planen din etter hver coaching-sesjon." },
  { q: "Hvor foregår treningen?", a: "Gamle Fredrikstad Golfklubb (GFGK). Vi bruker utendørsanlegget og TrackMan-simulator innendørs, avhengig av sesong." },
] as const;

// ─── Final CTA ───
export const FINAL_CTA = {
  eyebrow: "Kom i gang",
  heading: "Velg coach og start i dag.",
  description: "Ingen bindingstid. Abonnementet løper månedlig og kan sies opp når som helst.",
  ctaPrimary: "Se treningsabonnement",
  ctaSecondary: "Ta kontakt først",
  trustItems: [
    { label: "Ingen binding", icon: "shield-check" },
    { label: "Svar innen 24 timer", icon: "clock" },
    { label: "TrackMan inkludert", icon: "target" },
  ],
} as const;

// ─── Method Pillars ───
export const METHOD_PILLARS = [
  {
    number: "01",
    title: "AK-Formelen",
    subtitle: "Teknikk + Strategi + Mental styrke",
    description: "Vår unike treningsmetodikk kombinerer fysisk teknikk, strategisk kursmanagement og mental robusthet i ett integrert system. Hver elev får en skreddersydd plan basert på grundig analyse.",
    image: "/images/branding/ak-golf-academy-05.jpg",
  },
  {
    number: "02",
    title: "Individuell utviklingsplan (IUP)",
    subtitle: "Din personlige vei til resultater",
    description: "Hver spiller får en detaljert, målstyrt utviklingsplan med klare milepæler, ukentlige fokusområder og kontinuerlig justering basert på fremgang og data.",
    image: "/images/branding/ak-golf-academy-02.jpg",
  },
  {
    number: "03",
    title: "Mentalt spill",
    subtitle: "Prestasjon under press",
    description: "Vi integrerer mental trening i hver økt. Visualisering, rutiner, fokusteknikker og stressmestring — fordi de beste slagene skjer når hodet er klart.",
    image: "/images/branding/ak-golf-academy-08.jpg",
  },
] as const;

// ─── Founder ───
export const FOUNDER = {
  name: "Anders Kristiansen",
  title: "Grunnlegger og hovedcoach",
  bio: [
    "Anders er grunnlegger og hovedcoach i AK Golf Group. Han jobber med spillere fra nybegynnere til ambisiøse voksne, og bygger personlige planer som henger sammen mellom hver coaching-økt.",
    "AK Golf-metoden er bygget for å gi spillere på alle nivåer et bunnsolid fundament og målbar fremgang over tid.",
  ],
} as const;

// ─── Testimonials ───
// Ingen aktive testimonials for tiden — legges tilbake når vi har skriftlig samtykke fra kunder.
export const TESTIMONIALS = [] as ReadonlyArray<{
  quote: string;
  name: string;
  fullName: string;
  role: string;
  club: string;
  program: string;
  featured: boolean;
}>;

// ─── Target Profiles (Forside) ───
export const TARGET_PROFILES = {
  eyebrow: "For alle nivåer",
  heading: "Enten du starter i dag eller jakter lavere handicap.",
  profiles: [
    {
      id: "ny",
      title: "Du er ny i golf",
      description: "Du har tatt VTG-kurs eller spilt noen runder. Nå vil du lære riktig fra starten. Markus tar deg gjennom grunnprinsippene og hjelper deg i gang med struktur fra dag én.",
    },
    {
      id: "planlos",
      title: "Du spiller, men trener uten plan",
      description: "Du har spilt i flere år, men trener tilfeldig. Du vet ikke helt hva du bør jobbe med. Et treningsabonnement gir deg retning, oppfølging og målbar fremgang.",
    },
    {
      id: "ambisios",
      title: "Du vil ha raskere resultater",
      description: "Du er ambisiøs og vil ned i handicap. Høyere treningsfrekvens med trener, TrackMan-data og detaljert analyse gir deg systemet som mangler.",
    },
  ],
} as const;

// ─── Portal Section (Forside) ───
export const PORTAL_SECTION = {
  eyebrow: "Inkludert i alle abonnement",
  heading: "Din treningsplan mellom sesjonene.",
  description: "PlayersHQ er det som gjør at 20 minutter med trener gir effekt hele uken. Alt du trenger for å trene med retning — samlet på ett sted.",
  features: [
    { title: "Treningsplanlegger", description: "Visuell ukesplan der du ser hva du skal trene og når. Dra inn økter, legg til øvelser, tilpass uken din." },
    { title: "Treningsanalyse", description: "Strokes Gained, handicap-utvikling, score-trender og treningsvolum. Du ser nøyaktig hvor du vinner og taper slag." },
    { title: "Øvelsesbank", description: "Videobaserte øvelser sortert etter fokusområde. Treneren velger øvelser til din plan — du kan også utforske selv." },
    { title: "Progresjonslogging", description: "Logg hver økt med score, treffrate og notater. Se utvikling over uker og måneder." },
    { title: "Coaching-notater", description: "Etter hver sesjon skriver treneren hva dere jobbet med og hva du bør fokusere på videre." },
  ],
  cta: "Også tilgjengelig som eget abonnement — 299 kr/mnd",
  ctaPrice: "299",
} as const;

// ─── Junior Intake Criteria ───
export const JUNIOR_INTAKE = {
  heading: "Retningslinjer for opptak",
  description: "Junior Academy er åpent for unge spillere med motivasjon og treningsvilje. Her er hva vi ser etter:",
  criteria: [
    { title: "Grønt kort", description: "Spilleren må ha grønt kort eller tilsvarende grunnopplæring." },
    { title: "Motivasjon", description: "Vi ser etter spillere som vil utvikle seg, uavhengig av nåværende nivå." },
    { title: "Treningsvilje", description: "Vilje til å følge treningsprogram og delta jevnlig på økter." },
  ],
  process: [
    { step: "01", title: "Ta kontakt", description: "Send oss en melding eller ring — vi setter opp et uforpliktende møte." },
    { step: "02", title: "Møte", description: "Vi møtes for en uforpliktende prat om juniorens mål, nivå og ambisjoner." },
    { step: "03", title: "Vurdering", description: "Vi ser på hvordan junioren passer inn i gruppen og anbefaler riktig program." },
    { step: "04", title: "Oppstart", description: "Junioren starter i riktig nivågruppe med en individuell plan." },
  ],
} as const;

// ─── Application Steps ───
export const APPLICATION_STEPS = [
  { step: "01", title: "Ta kontakt", description: "Send oss en melding med dine mål og nåværende nivå." },
  { step: "02", title: "Uforpliktende samtale", description: "Vi tar en prat for å bli kjent og forstå dine ambisjoner." },
  { step: "03", title: "Vurdering", description: "En grundig analyse av spillet ditt — på banen, på rangen og med data." },
  { step: "04", title: "Din plan", description: "Du får en skreddersydd utviklingsplan og vi starter reisen sammen." },
] as const;

// ─── Academy Page ───
export const ACADEMY_FEATURES = [
  { title: "1:1 Coaching", description: "Dedikert tid med din trener — fokusert, intensiv og tilpasset dine behov." },
  { title: "Videoanalyse", description: "Avansert videoanalyse av sving, teknikk og bevegelsesmønster med AI-støttet feedback." },
  { title: "IUP-plan", description: "Din personlige utviklingsplan med ukentlige mål, øvelsesprogram og kontinuerlig oppfølging." },
  { title: "Mental trening", description: "Integrert mental coaching med fokus på prestasjon under press og turneringsmestring." },
  { title: "Kursmanagement", description: "Strategisk spill — les banen, velg riktig slag, og optimaliser scoren din." },
  { title: "Fysisk trening", description: "Golfspesifikk styrke, mobilitet og skadeforebygging i samarbeid med fysioterapeut." },
] as const;

export const ACADEMY_FAQ = [
  { q: "Hva er et treningsabonnement?", a: "Du betaler en fast månedspris og booker 20-minutters coaching-sesjoner i appen. Mellom sesjonene har du tilgang til PlayersHQ med treningsplan, øvelser og progresjon." },
  { q: "Hvorfor 20 minutter?", a: "Fordi det er nok tid til å jobbe fokusert med én ting og bekrefte at endringen sitter. Korte sesjoner gjør at du kan trene oftere med trener — og frekvens gir raskere utvikling enn lange timer med lang tid mellom." },
  { q: "Hva er forskjellen på Anders og Markus?", a: "Anders jobber med spillere som vil ha individuell teknisk utvikling og langsiktig oppfølging. Markus spesialiserer seg på nye golfere, grunnprinsipper og gruppetreninger. Begge bruker samme system og PlayersHQ." },
  { q: "Trenger jeg et visst handicap for å starte?", a: "Nei. Systemet er bygget for alle nivåer. Er du helt ny, starter du hos Markus med grunnprinsippene. Har du spilt lenge, jobber du med Anders på teknikk og strategi." },
  { q: "Er det bindingstid?", a: "Nei. Abonnementet løper månedlig og kan sies opp når som helst." },
  { q: "Hva er PlayersHQ?", a: "En treningsapp der du ser treningsplanen din, logger økter, følger progresjonen din og har tilgang til øvelsesbank med video. Treneren oppdaterer planen din etter hver coaching-sesjon." },
  { q: "Hva er forskjellen på abonnement og flex?", a: "Abonnement gir deg faste sesjoner, PlayersHQ med treningsplan og løpende oppfølging. Flex er enkeltsesjon uten portal — du får coaching-notater, men ingen treningsplan mellom sesjonene." },
  { q: "Kan jeg bytte mellom Anders og Markus?", a: "Ja. Du velger coach når du booker. Abonnementet er knyttet til én coach, men du kan endre ved neste faktureringsperiode." },
  { q: "Hva skjer om jeg ikke får brukt øktene mine?", a: "Ubrukte økter forfaller ved månedslutt. Vi minner deg på å booke i god tid." },
  { q: "Hvor foregår treningen?", a: "Gamle Fredrikstad Golfklubb (GFGK). Vi bruker utendørsanlegget og TrackMan-simulator innendørs, avhengig av sesong." },
] as const;

// ─── Junior Page ───
export const JUNIOR_PROGRAMS = [
  {
    level: "Nivå 1",
    title: "Grunnlag",
    description: "Bygge solide tekniske ferdigheter, spilleforståelse og treningsvaner.",
    features: ["2 gruppeøkter/uke", "Individuell teknikk", "Introduksjon til konkurranse", "Sesongplan"],
  },
  {
    level: "Nivå 2",
    title: "Utvikling",
    description: "Spisse ferdigheter, konkurrere regelmessig og utvikle eget spill.",
    features: ["3 økter/uke", "Individuell IUP", "Turneringsplan", "Mental trening", "Videoanalyse"],
  },
  {
    level: "Nivå 3",
    title: "Pre-elite",
    description: "Forberedelse til elite- eller college-golf med full profesjonell støtte.",
    features: ["4-5 økter/uke", "Full IUP + mental", "Nasjonal/internasjonal konkurranse", "Fysisk trening", "Kursmanagement", "Stipend-veiledning"],
  },
] as const;

export const JUNIOR_FAQ = [
  { q: "Hva koster det?", a: "AK Golf Junior Academy koster 2 500 kr/mnd. GFGK Junior har egen treningsavgift gjennom klubben." },
  { q: "Hvor trener dere?", a: "På Gamle Fredrikstad Golfklubb." },
  { q: "Hvordan kommer jeg i gang?", a: "Ta kontakt så avtaler vi en samtale." },
] as const;

// ─── Utvikling Page ───
export const SOFTWARE_FEATURES = [
  { title: "QR-treningsskilt", description: "Digitale treningsskilt med QR-koder som gir spillerne tilgang til øvelser, videoer og instruksjoner direkte på rangen." },
  { title: "IUP-plattform", description: "Skybasert plattform for individuelle utviklingsplaner. Spillere og trenere samarbeider i sanntid om mål og fremgang." },
  { title: "Analyseverktøy", description: "Dataanalyse av treningsdata, runder og utvikling over tid. Visualiser fremgang og identifiser forbedringspotensial." },
  { title: "Rapportering", description: "Automatiserte rapporter for klubbledelse, trenere og foreldre. Dokumenter aktivitet, fremgang og resultater." },
] as const;

export const KLUBB_FEATURES = [
  { title: "Sportsplaner", description: "Helhetlige sportsplaner tilpasset klubbens størrelse, ambisjoner og ressurser. Fra junior til elite." },
  { title: "Programdesign", description: "Skreddersydde treningsprogrammer for alle nivåer. Strukturerte ukeplaner, periodisering og konkurransekalender." },
  { title: "Trenerutvikling", description: "Kurs, mentoring og nettverk for klubbtrenere. Hev kompetansen og behold de beste trenerne." },
  { title: "Organisasjonsrådgiving", description: "Strategisk rådgiving for golfklubber som vil profesjonalisere sportslig aktivitet og organisasjonsstruktur." },
] as const;

export const UTVIKLING_AUDIENCES = [
  { title: "Golfklubber", description: "Små og store klubber som vil løfte trenings- og utviklingstilbudet." },
  { title: "Golfforbund", description: "Regionale og nasjonale forbund som søker standardiserte løsninger." },
  { title: "Trenere", description: "Profesjonelle trenere som vil effektivisere og digitalisere arbeidet." },
  { title: "Golfskoler", description: "Etablerte golfskoler som vil integrere teknologi og moderne metoder." },
] as const;

// ─── Treningsplan Page ───
export const TRENINGSPLAN = {
  hero: {
    eyebrow: "AI-treningsplan",
    heading: "Din personlige treningsplan — generert på sekunder.",
    description: "Svar på fire enkle spørsmål, og vår AI lager en skreddersydd 12-ukers treningsplan basert på AK-formelen. Gratis forhåndsvisning før du bestemmer deg.",
  },
  howItWorks: [
    { number: "01", title: "Svar på 4 spørsmål", description: "Handicap, mål, tilgjengelig tid og fokusområde. Det tar under ett minutt." },
    { number: "02", title: "AI genererer planen", description: "Vår AI bygger en personalisert 12-ukers plan basert på AK-formelen og tusenvis av datapunkter." },
    { number: "03", title: "Se forhåndsvisning", description: "Du får se en gratis oppsummering av planen før du velger å låse opp hele." },
  ],
  pricing: [
    {
      name: "Basis",
      price: "299 kr",
      period: "engangs",
      description: "En komplett 12-ukers treningsplan som PDF.",
      features: ["12-ukers plan", "Tilpasset ditt nivå", "PDF-nedlasting", "AK-formelen"],
      highlighted: false,
    },
    {
      name: "Standard",
      price: "499 kr",
      period: "engangs",
      description: "Alt i Basis, pluss web-dashboard og ukentlig justering.",
      features: ["Alt i Basis", "Web-dashboard", "Ukentlig AI-justering", "Progressjonssporing", "Øvelsesvideoer"],
      highlighted: true,
    },
    {
      name: "Premium",
      price: "199 kr",
      period: "mnd",
      description: "Kontinuerlig AI-coaching med ubegrensede justeringer.",
      features: ["Alt i Standard", "Ubegrenset justering", "AI-coaching-chat", "Integrasjon med TrackMan", "Prioritert support"],
      highlighted: false,
    },
  ],
  faq: [
    { q: "Hvordan fungerer AI-treningsplanen?", a: "Du svarer på fire spørsmål om ditt nivå, mål, tid og fokus. Vår AI bruker AK-formelen til å generere en skreddersydd 12-ukers plan med økt-for-økt-detaljer." },
    { q: "Er planen virkelig personalisert?", a: "Ja. Planen tilpasses ditt handicap, tilgjengelige treningstid, fokusområder og mål. Ingen to planer er like." },
    { q: "Kan jeg se planen før jeg kjøper?", a: "Absolutt. Du får en gratis forhåndsvisning med oppsummering av ukeplanen før du bestemmer deg." },
    { q: "Hva er forskjellen på PDF og web-dashboard?", a: "PDF-planen er en komplett nedlastbar plan. Web-dashboardet gir deg i tillegg progressjonssporing, ukentlige justeringer og øvelsesvideoer." },
    { q: "Erstatter dette en trener?", a: "AI-planen er et supplement, ikke en erstatning. For spillere som ønsker personlig oppfølging anbefaler vi AK Golf Academy." },
  ],
} as const;

// ─── Merkevare Page ───
export const MERKEVARE_SOCIAL_PROOF = [
  { value: "24t", label: "leveringstid" },
  { value: "100%", label: "gratis analyse" },
  { value: "WCAG", label: "AA kontrastsjekk" },
  { value: "PDF", label: "komplett rapport" },
] as const;

export const MERKEVARE_PACKAGES = [
  {
    name: "Basis",
    price: "Gratis",
    description: "En komplett merkevare-analyse av logoen din med farger, typografi og logo-regler.",
    features: [
      "Fargeanalyse (HEX, RGB, CMYK)",
      "WCAG-kontrastsjekk",
      "Logo-regler og frisoner",
      "Typografianbefalinger",
      "PDF-rapport",
    ],
    highlighted: false,
  },
  {
    name: "Profesjonell",
    price: "4 900 kr",
    description: "Alt i Basis, pluss et komplett designsystem med CSS-tokens og Tailwind-konfigurasjon.",
    features: [
      "Alt i Basis",
      "CSS design tokens",
      "Tailwind-konfigurasjon",
      "Fargepalett (primær, sekundær, nøytral)",
      "Komponentbibliotek (Figma)",
      "Brandguide-dokument",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Kontakt oss",
    description: "Skreddersydd merkevarebygging for klubber som vil ha en helhetlig og konsistent profil på tvers av alle flater.",
    features: [
      "Alt i Profesjonell",
      "Nettside-redesign",
      "Trykksaker og maler",
      "Sosiale medier-pakke",
      "Dedikert designer",
      "Løpende støtte",
    ],
    highlighted: false,
  },
] as const;

export const MERKEVARE_FEATURES = [
  { icon: "🎨", title: "Fargesystem", description: "Primær-, sekundær- og nøytralpaletter med Pantone, CMYK og HEX-koder for konsistent bruk på tvers av alle flater." },
  { icon: "Aa", title: "Typografisystem", description: "Anbefalte skrifttyper for headings, brødtekst og akkompagnement — med størrelseskala og linjeavstand." },
  { icon: "⬜", title: "Logo-regler", description: "Klare regler for plassering, minstestørrelse, frisoner og tillatte varianter av logoen." },
  { icon: "✓", title: "WCAG-tilgjengelighet", description: "Automatisk kontrastsjekk mot WCAG 2.1 AA-standard for å sikre lesbarhet for alle brukere." },
  { icon: "{}", title: "CSS Design Tokens", description: "Klare variabler for farger, spacing og typografi — klare til bruk i Tailwind eller CSS Custom Properties." },
  { icon: "📐", title: "Figma Komponenter", description: "Basis-komponentbibliotek i Figma med knapper, skjemaelementer og typografistiler tilpasset merkevaren." },
] as const;

// ─── Footer ───
export const FOOTER_LINKS = {
  divisions: [
    { label: "Coaching", href: "/academy" },
    { label: "Junior Academy", href: "/junior-academy" },
    { label: "Utvikling", href: "/utvikling" },
  ],
  company: [
    { label: "Om oss", href: "/#story" },
    { label: "Vår metode", href: "/#method" },
    { label: "Teamet", href: "/#team" },
    { label: "Personvern", href: "/personvern" },
  ],
  contact: {
    email: "post@akgolf.no",
    location: "GFGK, Vinger",
  },
  social: [
    { label: "Instagram", href: "https://instagram.com/akgolfacademy", icon: "instagram" },
    { label: "Facebook", href: "https://facebook.com/akgolfacademy", icon: "facebook" },
    { label: "LinkedIn", href: "https://linkedin.com/company/akgolfgroup", icon: "linkedin" },
  ],
} as const;

// ─── Booking ───
export const BOOKING_URL = "/booking";

// ─── Portal ───
export const PORTAL_URL = "/portal";

// ─── Portal Empty States ───
export const PORTAL_EMPTY_STATES = {
  dashboard: {
    welcome: "Hei {name}, klar for dagens trening?",
    noBookings: "Ingen kommende bookinger. Book din neste sesjon for å fortsette utviklingen.",
    noPlan: "Ingen aktiv treningsplan. Generer din personlige 12-ukers treningsplan.",
  },
  treningsplan: {
    title: "Din treningsplan venter på deg",
    description: "Basert på dine mål og nivå lager AI-en en skreddersydd plan.",
    cta: "Generer min treningsplan",
  },
  statistikk: {
    title: "Ingen statistikk ennå",
    description: "Registrer din første runde for å se Strokes Gained-statistikk.",
    cta: "Logg runde",
  },
  dagbok: {
    title: "Treningsdagboken din er tom",
    description: "Start å logge økter for å se progresjon over tid.",
    cta: "Logg treningsøkt",
  },
  bookinger: {
    title: "Ingen bookinger",
    description: "Du har ingen kommende bookinger.",
    cta: "Book din neste sesjon",
  },
  profil: {
    levels: {
      VISITOR: { name: "Gratis", description: "Treningsdagbok (maks 3/mnd), 10 øvelser" },
      ACADEMY: { name: "Academy", description: "Full dagbok, øvelsesbank, statistikk" },
      PRO: { name: "Pro", description: "Alt i Academy + AI-analyse" },
      ELITE: { name: "Elite", description: "Alt + ubegrenset + prioritert support" },
    },
  },
} as const;

// ─── Academy Testimonials (voksne) ───
export const ACADEMY_TESTIMONIALS = [
  {
    quote: "Anders har fullstendig transformert spillet mitt. Fra 18 til 11 i handicap på ett år — med en metode som føles naturlig og bærekraftig.",
    name: "Thomas R.",
    role: "Academy-elev",
    handicapBefore: "18.4",
    handicapAfter: "11.2",
  },
  {
    quote: "Den individuelle tilnærmingen er det som skiller seg ut. Her er du ikke et nummer — du er et prosjekt de bryr seg om.",
    name: "Maria L.",
    role: "Academy-elev",
    handicapBefore: "24.0",
    handicapAfter: "16.5",
  },
  {
    quote: "Endelig en trener som forstår at voksne har begrenset tid. 20-minutters sesjoner med tydelig fokus gir resultater.",
    name: "Erik H.",
    role: "Academy-elev",
    handicapBefore: "14.8",
    handicapAfter: "9.3",
  },
] as const;

// ─── Academy Booking CTA ───
export const ACADEMY_CTA = {
  eyebrow: "Klar for å starte?",
  heading: "Velg abonnement og book din første sesjon.",
  description: "Ingen bindingstid. Personlig anbefaling basert på dine mål.",
  primaryCta: "Se treningsabonnement",
  secondaryCta: "Ta kontakt først",
  valueProps: [
    "Ingen bindingstid",
    "Personlig anbefaling",
  ],
} as const;

// ─── Academy Hero ───
export const ACADEMY_HERO = {
  eyebrow: "TRENINGSABONNEMENT FOR GOLF",
  heading: "Treningsabonnement for golf.",
  description: "Velg coach, velg frekvens. Alle abonnement inkluderer personlig treningsplan i app, TrackMan, videoanalyse og ingen bindingstid.",
} as const;

// ─── Academy Concept Section ───
export const ACADEMY_CONCEPT = {
  eyebrow: "Treningsabonnement",
  heading: "Coaching som faktisk følger deg mellom sesjonene.",
  paragraphs: [
    "De fleste tar en golftime i ny og ne. Etterpå trener de på egenhånd — uten plan, uten oppfølging, uten måling. Resultatet er at de gjør de samme feilene om igjen.",
    "Med et treningsabonnement møter du trener 2 eller 4 ganger i måneden. Hver sesjon er 20 minutter — fokusert, målt med TrackMan og filmet for analyse. Treneren oppdaterer treningsplanen din etter hver sesjon, slik at du alltid vet nøyaktig hva du skal jobbe med på rangen.",
    "I PlayersHQ har du alt samlet: treningsplan med øvelser og video, statistikk over utviklingen din, Strokes Gained-analyse og coaching-historikk. Det er dette som gjør at trening mellom sesjonene faktisk fungerer — og at du utvikler deg raskere enn med enkelttimer alene.",
  ],
} as const;

// ─── Abo vs Flex Comparison ───
export const ABO_VS_FLEX = {
  eyebrow: "Abonnement vs Flex",
  heading: "Hva får du egentlig?",
  description: "Flex gir deg coaching uten forpliktelser. Abonnement gir deg coaching OG systemet som gjør at treningen mellom sesjonene faktisk fungerer.",
  rows: [
    { feature: "1-til-1 coaching", abo: true, flex: true },
    { feature: "TrackMan-data", abo: true, flex: true },
    { feature: "Coaching-notater", abo: true, flex: true },
    { feature: "PlayersHQ", abo: true, flex: false },
    { feature: "Treningsplan mellom sesjoner", abo: true, flex: false },
    { feature: "Øvelsesbank med video", abo: true, flex: false },
    { feature: "Progresjonslogging", abo: true, flex: false },
    { feature: "Treningsanalyse (Strokes Gained)", abo: true, flex: false },
  ],
} as const;

// ─── Academy Philosophy Section ───
export const ACADEMY_APPROACH = {
  label: "Vår tilnærming",
  heading: "Ingen to spillere er like.",
  subheading: "Hvorfor skal treningen være det?",
  paragraphs: [
    "I AK Golf Academy starter alt med deg. Vi analyserer spillet ditt fra alle vinkler — teknikk, strategi, mentalt spill og fysikk — for å bygge en plan som er 100% tilpasset dine mål og ditt utgangspunkt.",
    "Vår evidensbaserte metode kombinerer det beste fra moderne golftreningsforskning med praktisk erfaring fra coaching på alle nivåer, fra nybegynner til tour-spiller.",
  ],
} as const;

// ─── Academy AK-Method Pillars ───
export const ACADEMY_METHOD_PILLARS = [
  {
    number: "01",
    title: "Teknisk analyse",
    description: "Grundig analyse av sving, kontakt og bevegelsesmønster med avansert videoteknologi. Klare, konkrete tilbakemeldinger du kan handle på.",
  },
  {
    number: "02",
    title: "Strategisk spill",
    description: "Kursmanagement, slagvalg og situasjonsanalyse. Lær deg å ta smartere beslutninger på banen — ikke bare slå hardere.",
  },
  {
    number: "03",
    title: "Mental styrke",
    description: "Rutiner, fokus og prestasjon under press. Det mentale spillet er det som skiller gode spillere fra de som virkelig leverer.",
  },
] as const;

// ─── Junior Hero ───
export const JUNIOR_HERO = {
  eyebrow: "Junior Academy",
  heading: "Neste generasjon golfere starter her.",
  description: "Ekstra satsning for juniorer som vil ta golfen til neste nivå.",
} as const;

// ─── Junior Philosophy Section ───
export const JUNIOR_PHILOSOPHY = {
  label: "Vår filosofi",
  heading: "Mer enn golf.",
  subheading: "Mestring for livet.",
  paragraphs: [
    "Junior Academy handler om mer enn å lage bedre golfere. Vi utvikler unge mennesker som lærer disiplin, målsetting, samarbeid og evnen til å håndtere både seirer og motgang.",
    "Vår aldersinndelte treningsstruktur sikrer at hver junior får utfordringer og støtte tilpasset sitt ståsted i utviklingen. Fra den første konkurranseopplevelsen til forberedelse for elite- og college-golf — med en naturlig overgang til vårt Academy-program for voksne.",
  ],
} as const;

// ─── Junior Training Week ───
export const JUNIOR_TRAINING_WEEK = [
  { day: "Mandag", focus: "Teknikk & sving", description: "Individuell og gruppebasert teknikktrening med videoanalyse." },
  { day: "Onsdag", focus: "Kort spill", description: "Putting, chipping og bunkerslag — ferdighetene som redder score." },
  { day: "Torsdag", focus: "Banespill", description: "Kursmanagement, strategisk spill og simulerte turneringssituasjoner." },
  { day: "Lørdag", focus: "Konkurranse", description: "Interne og eksterne turneringer, eller intensiv treningsøkt." },
] as const;

// ─── Junior CTA ───
export const JUNIOR_CTA = {
  heading: "Ta kontakt for en samtale.",
  description: "Vi forteller gjerne mer om programmet.",
  primaryCta: "Kontakt oss",
} as const;

// ─── GFGK Junior Grupper ───
export const GFGK_JUNIOR_GROUPS = [
  {
    ageGroup: "U10",
    ageRange: "6–10 år",
    title: "Junior Mini",
    description: "Introduksjon til golf gjennom lek, bevegelse og mestringsfølelse.",
    features: ["Lekbasert trening", "Grunnleggende motorikk", "Sosiale aktiviteter", "Korte økter"],
    sessionsPerWeek: 1,
    price: null, // Pris kommer
  },
  {
    ageGroup: "U13",
    ageRange: "11–13 år",
    title: "Junior Basis",
    description: "Bred motorisk utvikling, teknisk grunnlag og spilleglede.",
    features: ["Teknikkfokus", "Introduksjon til regler", "Første turneringer", "Treningsdagbok"],
    sessionsPerWeek: 1,
    price: null, // Pris kommer
  },
  {
    ageGroup: "U15",
    ageRange: "14–16 år",
    title: "Junior Utvikling",
    description: "Målrettet trening med vekt på spesialisering, konkurranseerfaring og mental styrke.",
    features: ["Periodisert trening", "Konkurranseprogram", "Mental trening", "Videoanalyse"],
    sessionsPerWeek: 2,
    price: null, // Pris kommer
  },
  {
    ageGroup: "U19",
    ageRange: "17–19 år",
    title: "Junior Elite",
    description: "Helhetlig satsing for spillere med ambisjoner om elite- og collegegolf.",
    features: ["Full treningsplan", "Nasjonal/internasjonal konkurranse", "Fysisk trening", "Stipend-veiledning"],
    sessionsPerWeek: 2,
    price: null, // Pris kommer
  },
] as const;

export const GFGK_JUNIOR_INFO = {
  heading: "GFGK Junior",
  description: "Treningsgrupper for alle juniorer i klubben. Årlig treningsavgift gjennom GFGK.",
  link: "https://gfgk-junior.vercel.app",
  linkText: "Se alle grupper og påmelding",
} as const;

// ─── Junior Season Program ───
export const JUNIOR_SEASON_PROGRAM = {
  heading: "Sesongprogram",
  description: "Trening hele året med tilpasset innhold for hver sesong.",
  seasons: [
    {
      name: "Vår",
      months: "Mars – Mai",
      focus: "Oppstart og grunnlag",
      activities: ["Teknikkgjennomgang", "Kursmanagement", "Sesongplanlegging", "Første turneringer"],
    },
    {
      name: "Sommer",
      months: "Juni – August",
      focus: "Konkurranser og camp",
      activities: ["Turneringssesongen", "Sommercamps", "Playing lessons", "Intensive ukessamlinger"],
    },
    {
      name: "Høst",
      months: "September – November",
      focus: "Evaluering og forbedring",
      activities: ["Sesongevaluering", "Teknikkjusteringer", "Mental trening", "Avsluttende turneringer"],
    },
    {
      name: "Vinter",
      months: "Desember – Februar",
      focus: "Innendørs og fysisk",
      activities: ["Simulator-trening", "Fysisk trening", "Videoanalyse", "Målsetting neste sesong"],
    },
  ],
} as const;

// ─── Junior Academy Packages ───
export const JUNIOR_PACKAGES = [
  {
    name: "Junior Elite",
    slug: "junior-elite",
    price: "2 500",
    period: "kr/mnd",
    tagline: "For ambisiøse juniorer som satser på konkurransegolf",
    description: "8 individuelle coaching-sesjoner per måned med faste tider. TrackMan-analyse, personlig treningsplan og progresjonslogging — for juniorer som vil nå neste nivå.",
    fullDescription: "Junior Elite er et treningsprogram for juniorer som tar golfen på alvor. Du trener med Anders to ganger i uken — tirsdager med fokus på teknikk og langt spill, torsdager med kort spill og spillsituasjoner. Hver sesjon er 20 minutter med fullt fokus og TrackMan. Ingen ventetid, ingen fyllminutter. Etter sesjonen oppdateres treningsplanen din i appen med øvelser du skal jobbe med til neste gang. Foreldre har full innsyn i progresjonsdata, treningsplaner og utviklingen over sesongen.",
    features: [
      "8 × 20 min individuell coaching/mnd (2/uke)",
      "Faste tider tirsdag og torsdag",
      "TrackMan-analyse integrert i hver sesjon",
      "Full tilgang til PlayersHQ",
      "Personlig treningsplan oppdatert etter hver sesjon",
      "Progresjonslogging synlig for junior og foreldre",
      "Øvelsesbank med video tilpasset juniorens nivå",
      "Treningsdagbok og statistikk",
      "Turneringskalender og sesongplanlegging",
    ],
    notIncluded: [
      "Asynkron videofeedback",
      "Gruppetimer",
    ],
    highlighted: true,
    badge: "Maks 5 plasser",
    stripeMetadata: {
      type: "subscription",
      sessions_per_month: 8,
      session_duration_minutes: 20,
      booking_type: "fixed",
      booking_days: "tue,thu",
      booking_time_range: "17:00-19:00",
      max_capacity: 5,
      includes_portal: true,
    },
  },
] as const;

// ─── Junior Camp ───
export const JUNIOR_CAMP = {
  name: "Junior Camp",
  price: "4 500",
  period: "kr/deltaker",
  description: "Intensive ukescamper i skoleferier. 5 dager × 3 timer med teknikk, TrackMan-baseline, kort spill, strategiprinsipper og banemanagement på korthullsbanen.",
  details: "Avslutningsrunde med individuell tilbakemelding i appen. Maks 12 deltakere. 3 camper per år.",
  stripeMetadata: {
    type: "camp",
    days: 5,
    hours_per_day: 3,
    max_participants: 12,
  },
} as const;

// ─── AK Golf Junior Academy (Premium satsningsprogram) ───
export const JUNIOR_ACADEMY_INFO = {
  heading: "AK Golf Junior Academy",
  intro: "Ekstra satsning for juniorer som vil ta golfen til neste nivå.",
  price: "2 500",
  priceUnit: "kr/mnd",
} as const;

// ─── Junior Parent Info ───
export const JUNIOR_PARENT_INFO = {
  heading: "Informasjon til foreldre",
  description: "Vi tror på tett samarbeid med foreldrene. Dere er en viktig del av utviklingsreisen.",
  expectations: [
    {
      title: "Hva forventes av foreldre",
      items: [
        "Sørg for at junioren kommer forberedt og i tide",
        "Støtt uten å legge press — la treneren lede",
        "Delta på foreldremøter og les fremgangsrapporter",
        "Kommuniser åpent med trenerteamet ved bekymringer",
      ],
    },
    {
      title: "Hvordan følge med på fremgang",
      items: [
        "PlayersHQ gir sanntidsoversikt over treningsplan og progresjon",
        "Månedlige fremgangsrapporter sendes på e-post",
        "Kvartalsvise foreldremøter med gjennomgang av mål og utvikling",
        "Direkte kontakt med trener ved behov",
      ],
    },
    {
      title: "Kommunikasjonskanaler",
      items: [
        "PlayersHQ — treningsplan, bookinger, fremgang",
        "E-post — rapporter og viktig informasjon",
        "Telefon/SMS — akutte endringer og påminnelser",
        "Foreldremøter — kvartalsvis gjennomgang",
      ],
    },
  ],
} as const;

// ─── Utvikling Hero ───
export const UTVIKLING_HERO = {
  eyebrow: "Utvikling & Teknologi",
  heading: "Teknologi og rådgiving for golfens fremtid.",
  description: "Digitale treningsverktøy og sportslig rådgiving for golfklubber, forbund og trenere som vil ligge i forkant.",
} as const;

// ─── Utvikling Software Section ───
export const UTVIKLING_SOFTWARE = {
  label: "AK Golf Software",
  heading: "Treningsverktøyet som gjør",
  subheading: "golftrening systematisk.",
  description: "Vår programvare er utviklet av trenere, for trenere. Vi forstår hverdagen på rangen og på banen — og har bygget verktøy som faktisk gjør en forskjell.",
} as const;

// ─── Utvikling Klubb Section ───
export const UTVIKLING_KLUBB = {
  label: "Klubbtrening & Rådgiving",
  heading: "En plan for klubbens",
  subheading: "treningsarbeid.",
  description: "Vi hjelper golfklubber med å bygge sportslige strukturer som tiltrekker medlemmer, utvikler spillere og skaper resultater. Fra sportsplan til trenernettverk.",
} as const;

// ─── Utvikling Intro (Two Services) ───
export const UTVIKLING_SERVICES = {
  eyebrow: "To hovedområder",
  heading: "Software og rådgiving — under samme tak.",
  description: "Vi kombinerer digitale verktøy med sportslig rådgiving. Resultatet er helhetlige løsninger som faktisk fungerer i hverdagen.",
  services: [
    {
      id: "software",
      title: "Software",
      subtitle: "Digitale treningsverktøy",
      description: "PlayersHQ, treningsplanlegger og statistikkverktøy som gir spillere og trenere full oversikt.",
      features: ["PlayersHQ med IUP", "AI-treningsplanlegger", "Strokes Gained-analyse", "QR-treningsskilt"],
      accent: "software" as const,
    },
    {
      id: "klubbutvikling",
      title: "Klubbutvikling",
      subtitle: "Sportslig rådgiving",
      description: "Sportsplaner, trenerveiledning og sertifiseringsprogrammer for golfklubber og forbund.",
      features: ["Sportsplaner", "Trenerveiledning", "Sertifiseringsprogram", "Organisasjonsutvikling"],
      accent: "utvikling" as const,
    },
  ],
} as const;

// ─── Utvikling Software Features (Detailed) ───
export const UTVIKLING_SOFTWARE_FEATURES = [
  {
    id: "PlayersHQ",
    title: "PlayersHQ",
    description: "Komplett digital plattform der spillere følger sin utvikling, ser treningsplaner og kommuniserer med trener.",
    details: ["Individuell utviklingsplan (IUP)", "Treningslogg og progresjon", "Coaching-notater", "Målsetting og oppfølging"],
  },
  {
    id: "treningsplanlegger",
    title: "AI-treningsplanlegger",
    description: "Automatisk genererte treningsplaner basert på spillerens mål, nivå og tilgjengelig tid.",
    details: ["Periodisert struktur", "Tilpasset nivå", "Dynamisk justering", "Øvelsesbank med video"],
  },
  {
    id: "statistikk",
    title: "Strokes Gained-analyse",
    description: "Avansert statistikk som viser nøyaktig hvor spilleren vinner og taper slag mot sammenlignbare spillere.",
    details: ["SG: Tee, Approach, Short Game, Putting", "Benchmarking mot nivå", "Trendanalyse", "Svakhetsidentifisering"],
  },
] as const;

// ─── Utvikling Klubb Features (Detailed) ───
export const UTVIKLING_KLUBB_FEATURES = [
  {
    id: "sportsplaner",
    title: "Sportsplaner",
    description: "Helhetlige sportsplaner tilpasset klubbens størrelse, ambisjoner og ressurser.",
    details: ["Årshjul med periodisering", "Treningsopplegg alle nivåer", "Konkurransekalender", "Måling og evaluering"],
  },
  {
    id: "trenerveiledning",
    title: "Trenerveiledning",
    description: "Strukturert veiledning og mentorskap for klubbtrenere som vil utvikle seg.",
    details: ["1:1 mentoring", "Metodikk-workshop", "Observasjon og feedback", "Nettverk med andre trenere"],
  },
  {
    id: "sertifisering",
    title: "Sertifiseringsprogram",
    description: "Formell sertifisering for trenere basert på dokumentert kompetanse og resultater.",
    details: ["Nivåinndelt sertifisering", "Praktisk og teoretisk test", "Årlig resertifisering", "Kvalitetssikring"],
  },
] as const;

// ─── Utvikling CTA ───
export const UTVIKLING_CTA = {
  label: "Interessert?",
  heading: "Book en samtale.",
  description: "Vi starter alltid med en uforpliktende samtale for å forstå deres behov og ambisjoner. Deretter lager vi et skreddersydd forslag.",
  primaryCta: "Book en samtale",
  secondaryCta: "Tilbake til forsiden",
} as const;

// ─── Utvikling Products ───
export const UTVIKLING_PRODUCTS = [
  {
    id: "PlayersHQ",
    title: "PlayersHQ",
    tagline: "Treningsplan, statistikk og coaching i én plattform",
    description: "Komplett digital plattform der spillere følger sin utvikling, ser treningsplaner og kommuniserer med trener. Brukes av alle våre spillere i dag.",
    features: [
      "Treningsplanlegger med ukesvisning",
      "Strokes Gained-analyse",
      "Øvelsesbank med video",
      "Progresjonslogging og coaching-notater",
    ],
    pricing: "299 kr/mnd (individuell) · 1 000 kr/mnd (klubblisens)",
    pricingNote: "Individuell eller klubblisens",
  },
  {
    id: "qr-skilt",
    title: "QR-treningsskilt",
    tagline: "Interaktiv øvelsesveiledning på range",
    description: "Digitale treningsskilt med QR-koder som gir spillerne tilgang til øvelser, videoer og instruksjoner direkte på mobilen. Perfekt for selvbetjent trening.",
    features: [
      "HD-videoer med instruksjoner",
      "Tilpasset ulike nivåer",
      "Enkelt å oppdatere innhold",
      "Merkevaretilpasset design",
    ],
    pricing: "15 000 kr",
    pricingNote: "Inkluderer 10 skilt og oppsett",
  },
  {
    id: "sportsplan",
    title: "Sportsplan for klubber",
    tagline: "Komplett årsplan for golfklubber",
    description: "Helhetlige sportsplaner tilpasset klubbens størrelse, ambisjoner og ressurser. Fra junior til elite, med periodisering og konkurransekalender.",
    features: [
      "Treningsopplegg alle nivåer",
      "Periodisering og årshjul",
      "Konkurransekalender",
      "Trenerutvikling",
    ],
    pricing: "Ta kontakt",
    pricingNote: "Tilbud basert på klubbstørrelse",
  },
] as const;

// ─── Detailed Product: PlayersHQ ───
export const PORTAL_PRODUCT = {
  eyebrow: "PlayersHQ",
  heading: "Treningsverktøyet som gjør golftrening systematisk.",
  description: "Alt spilleren trenger for å trene med retning — samlet på ett sted. Brukes av alle spillere i AK Golf Academy.",
  features: [
    { title: "Treningsplanlegger", description: "Visuell ukesplan der spilleren ser hva som skal trenes og når. Treneren legger inn øvelser etter coaching-sesjonen." },
    { title: "Treningsanalyse", description: "Strokes Gained, handicap-utvikling, score-trender og treningsvolum. Spilleren ser nøyaktig hvor de vinner og taper slag." },
    { title: "Øvelsesbank", description: "Videobaserte øvelser sortert etter fokusområde. Treneren velger øvelser til spillerens plan." },
    { title: "Progresjonslogging", description: "Spilleren logger hver økt med score, treffrate og notater. Utvikling over uker og måneder." },
    { title: "Coaching-notater", description: "Etter hver sesjon skriver treneren hva de jobbet med og hva spilleren bør fokusere på videre." },
  ],
  versions: [
    { name: "Individuell", price: "299", unit: "kr/mnd", description: "For enkeltspillere som vil trene strukturert." },
    { name: "Klubblisens", price: "1 000", unit: "kr/mnd", description: "For klubber og trenere med flere spillere." },
  ],
} as const;

// ─── Detailed Product: QR-treningsskilt ───
export const QR_PRODUCT = {
  eyebrow: "QR-treningsskilt",
  heading: "Gjør rangen til en treningsarena.",
  description: "Digitale treningsskilt med QR-koder som gir spillerne tilgang til øvelser, videoer og instruksjoner direkte på mobilen.",
  howItWorks: [
    { step: "01", title: "Spilleren scanner QR-koden", description: "Hvert skilt har en unik QR-kode knyttet til en øvelse." },
    { step: "02", title: "Video og instruksjoner vises", description: "Spilleren ser HD-video med forklaring, tips og varianter." },
    { step: "03", title: "Spilleren trener selvstendig", description: "Tydelige mål og kriterier gjør at spilleren vet om øvelsen sitter." },
  ],
  whatClubGets: [
    "10 fysiske skilt med QR-koder",
    "HD-videoer produsert for klubbens range",
    "Merkevaretilpasset design",
    "Digitalt dashboard for å oppdatere innhold",
    "Installasjon og opplæring",
  ],
  price: "15 000",
  priceNote: "Inkluderer 10 skilt og oppsett",
} as const;

// ─── Detailed Product: Sportsplan ───
export const SPORTSPLAN_PRODUCT = {
  eyebrow: "Sportsplan",
  heading: "En plan for klubbens treningsarbeid.",
  description: "Helhetlig sportsplan tilpasset klubbens størrelse, ambisjoner og ressurser. Vi bygger strukturen — klubben fyller den med aktivitet.",
  includes: [
    { title: "Treningsfilosofi", description: "Felles rammeverk for alle trenere i klubben." },
    { title: "Periodisering", description: "Årshjul med sesongfaser, treningsperioder og konkurransekalender." },
    { title: "Nivåtilpassede programmer", description: "Fra nybegynner til elite, med konkrete treningsplaner for hver gruppe." },
    { title: "Trenerveiledning", description: "Strukturert veiledning og mentorskap for klubbens trenere." },
    { title: "Evaluering og måling", description: "Verktøy for å måle fremgang og justere planen underveis." },
  ],
  process: [
    { step: "01", title: "Kartlegging", description: "Vi analyserer klubbens nåsituasjon, ressurser og ambisjoner." },
    { step: "02", title: "Utvikling", description: "Vi utarbeider sportsplanen i samarbeid med klubbens trenere og ledelse." },
    { step: "03", title: "Implementering", description: "Vi hjelper med oppstart og sikrer at planen blir levende." },
    { step: "04", title: "Oppfølging", description: "Kvartalsvis evaluering og justering basert på resultater." },
  ],
  price: "Ta kontakt",
  priceNote: "Tilbud basert på klubbstørrelse",
} as const;

// ─── Utvikling Case Studies ───
export const UTVIKLING_CASE_STUDIES = [
  {
    club: "Gamle Fredrikstad GK",
    logo: "/images/clubs/gfgk-logo.png",
    quote: "AK Golf hjalp oss med å implementere en komplett sportsplan. Resultatet var tydelig struktur og økt juniorrekruttering.",
    result: "40% økning i juniorrekruttering",
    year: "2025",
    products: ["Sportsplan", "IUP-plattform"],
  },
  {
    club: "Miklagard GK",
    logo: "/images/clubs/miklagard-logo.png",
    quote: "QR-skiltene på rangen har transformert selvtreningen. Medlemmene våre elsker det.",
    result: "Økt rangeaktivitet",
    year: "2025",
    products: ["QR-treningsskilt"],
  },
] as const;

// ─── Portal Content ───
export const PORTAL_CONTENT = {
  dashboard: {
    welcomeTemplate: "Hei {name}, klar for dagens trening?",
    emptyBookings: "Ingen kommende bookinger. Book din neste sesjon for å fortsette utviklingen.",
    emptyPlan: "Ingen aktiv treningsplan. Generer din personlige 12-ukers treningsplan.",
    onboardingHints: [
      { step: 1, title: "Fullfør profilen din", description: "Legg til handicap og mål for personlige anbefalinger" },
      { step: 2, title: "Book din første sesjon", description: "Start med en Foundation Test eller coaching-sesjon" },
      { step: 3, title: "Sett deg et mål", description: "Definer hva du vil oppnå denne sesongen" },
    ],
  },
  bookings: {
    emptyState: "Du har ingen aktive bookinger. Book en sesjon for å komme i gang!",
    cancellationRules: [
      { hours: "24+", rule: "Gratis kansellering", fee: "0%" },
      { hours: "2–24", rule: "Delvis gebyr", fee: "50%" },
      { hours: "<2", rule: "Ingen refusjon", fee: "100%" },
    ],
    confirmationMessage: "Booking bekreftet! Du mottar en påminnelse 24 timer før.",
  },
  treningsplan: {
    intro: "Din personlige treningsplan er generert av AI basert på dine mål, statistikk og tilgjengelig tid.",
    howToUse: [
      "Følg ukeplanen dag for dag",
      "Marker økter som fullført i dagboken",
      "Se progresjon over tid i statistikk-fanen",
    ],
    emptyState: "Generer din første treningsplan basert på dine mål og tilgjengelig tid.",
  },
  statistikk: {
    sgExplanation: {
      intro: "Strokes Gained måler hvor mange slag du vinner eller taper sammenlignet med en scratch-spiller på hver del av spillet.",
      categories: [
        { key: "SG: Tee", description: "Slag vunnet/tapt på utslagene (driver og lange fairway-slag)" },
        { key: "SG: Approach", description: "Slag vunnet/tapt på innspill til green" },
        { key: "SG: Short Game", description: "Slag vunnet/tapt rundt green (chipping, pitching, bunker)" },
        { key: "SG: Putting", description: "Slag vunnet/tapt på green" },
      ],
    },
    howToRegister: "Registrer din første runde for å se statistikk og identifisere svakheter.",
    emptyState: "Ingen runder registrert ennå. Klikk «Legg til runde» for å komme i gang.",
  },
  dagbok: {
    whyLog: "Å logge trening gir deg oversikt over hva du jobber med, og hjelper treneren å tilpasse coaching.",
    slagCategories: [
      { key: "S", name: "Sving", description: "Teknisk svingtrening — grip, setup, rotasjon" },
      { key: "L", name: "Langspill", description: "Driving og fairway — distanse og presisjon" },
      { key: "A", name: "Approach", description: "Innspill til green — avstander og banemanagement" },
      { key: "G", name: "Green", description: "Putting og chipping — kort spill og finish" },
    ],
    emptyState: "Start å logge treningsøkter for å se din progresjon over tid.",
  },
  kalender: {
    colorCodes: [
      { color: "gold", label: "Coaching-sesjon" },
      { color: "blue", label: "Planlagt trening" },
      { color: "green", label: "Turnering" },
      { color: "gray", label: "Ledig tid" },
    ],
    syncInfo: "Eksporter kalenderen til Google Calendar eller Apple Calendar for å få påminnelser på mobilen.",
  },
  profil: {
    goalSetting: {
      intro: "Sett deg konkrete, målbare mål for sesongen. Ditt mål vises på dashboardet og hjelper deg holde fokus.",
      examples: [
        { type: "Handicap", example: "Ned til 10.0 innen september" },
        { type: "Teknisk", example: "Forbedre SG: Putting med 0.5" },
        { type: "Aktivitet", example: "Trene 3 ganger i uken" },
      ],
    },
    achievements: [
      { id: "first-round", title: "Første runde registrert", description: "Registrer din første runde i statistikk" },
      { id: "10-sessions", title: "10 treningsøkter logget", description: "Logg 10 treningsøkter i dagboken" },
      { id: "hcp-improvement", title: "Handicap-forbedring", description: "Forbedre handicap med 2.0+ på én sesong" },
      { id: "plan-completed", title: "Treningsplan fullført", description: "Fullfør alle økter i en treningsplan" },
    ],
  },
  analyse: {
    aiIntro: "Basert på dine runder og treningslogger analyserer AI-en ditt spill og gir personlige anbefalinger.",
    weaknessExplanation: "Vi identifiserer hvor du taper flest slag sammenlignet med spillere på ditt nivå.",
    focusRecommendation: "Prioriter trening på områder der du har størst forbedringspotensial.",
  },
} as const;

// ─── Admin Content ───
export const ADMIN_CONTENT = {
  elever: {
    emptyState: "Ingen spillere registrert. Spillere opprettes automatisk ved første booking.",
    playerCategories: [
      { key: "A", description: "Elite-spiller (HCP < 5)" },
      { key: "B", description: "Konkurransespiller (HCP 5–10)" },
      { key: "C", description: "Aktiv hobbyspiller (HCP 10–18)" },
      { key: "D", description: "Hobbyspiller (HCP 18–27)" },
      { key: "E", description: "Nybegynner (HCP 27–36)" },
      { key: "J", description: "Junior (under 18 år)" },
      { key: "K", description: "Klubbspiller (sporadisk trening)" },
    ],
  },
  kalender: {
    setupGuide: {
      title: "Sett opp tilgjengelighet",
      description: "Sett opp din ukentlige tilgjengelighet. Spillere kan kun booke i tidsrom du har markert som ledige.",
      steps: [
        "Velg ukedag",
        "Marker tidsrom (f.eks. 09:00–17:00)",
        "Velg lokasjon",
        "Lagre",
      ],
    },
  },
} as const;

// ─── Foundation Method — Coaching-filosofi ───
export const FOUNDATION_METHOD_CONCEPT = {
  name: "The Foundation Method",
  tagline: "Varig endring. Ikke quick fixes.",
  principles: [
    { title: "Fundament først", description: "Pyramiden: FYS → TEK → SLAG → SPILL → TURN" },
    { title: "Systematisk progresjon", description: "L-faser: KROPP → ARM → KØLLE → BALL → AUTO" },
    { title: "Data erstatter følelser", description: "TrackMan + PlayersHQ" },
    { title: "Hele spilleren", description: "Teknikk + strategi + fysisk + mental + livsmestring" },
    { title: "Individuell plan, felles standard", description: "Skreddersydd for deg, basert på bevist metodikk" },
  ],
} as const;

// ─── Academy Philosophy — Fra sportsplan ───
export const ACADEMY_PHILOSOPHY = {
  vision: "AK Golf Academy tilbyr individuell coaching for voksne spillere som ønsker systematisk utvikling.",
  principles: [
    { key: "Evidensbasert", description: "Data og analyse, ikke magefølelse" },
    { key: "Individuelt tilpasset", description: "Ingen standardløsninger" },
    { key: "Langsiktig", description: "Utvikling tar tid, vi er her for hele reisen" },
    { key: "Helhetlig", description: "Teknikk, strategi, mental styrke og fysikk henger sammen" },
  ],
  targetAudience: "Voksne spillere (25–65 år) med handicap 5–36",
} as const;

// ─── Periodization — Sesongstruktur ───
export const PERIODIZATION = {
  periods: [
    { code: "E", name: "Evaluering", weeks: "Uke 43", description: "Testuke med full kartlegging" },
    { code: "G", name: "Grunnperiode", weeks: "Uke 44 – mars", description: "Bygge teknisk fundament" },
    { code: "S", name: "Spesialisering", weeks: "April – mai", description: "Overføring til bane" },
    { code: "T", name: "Turnering", weeks: "Mai – september", description: "Prestere og vedlikeholde" },
  ],
} as const;

// ─── Social Proof Stats ───
export const SOCIAL_PROOF_STATS = [
  { value: 500, suffix: "+", label: "Spillere utviklet" },
  { value: 15, suffix: "+", label: "Års erfaring" },
  { value: 92, suffix: "%", label: "Fornyer abonnement" },
  { value: 4.9, suffix: "", label: "Gjennomsnittlig vurdering" },
] as const;

// ─── Dark Stats ───
export const DARK_STATS = [
  { value: 3.2, suffix: "", label: "Gj.snitt HCP-forbedring første år" },
  { value: 120, suffix: "+", label: "TrackMan-økter per måned" },
  { value: 8, suffix: "", label: "Spillere på tour-nivå" },
] as const;

// ─── Testimonial ───
export const TESTIMONIAL = {
  quote: "Etter 6 måneder med Anders gikk jeg fra 18.4 til 12.1 i handicap. Strukturen i treningsplanen og de jevnlige TrackMan-øktene ga meg en retning jeg aldri hadde hatt før.",
  author: "Thomas H.",
  detail: "Handicap 12.1 — spiller siden 2019",
  image: "/images/branding/ak-golf-academy-10.jpg",
} as const;

// ─── Coach Bio ───
export const COACH_BIO = {
  name: "Anders Kristiansen",
  title: "Grunnlegger og hovedcoach",
  description: "15 års erfaring med spillerutvikling på alle nivåer. Har coachet spillere fra nybegynner til PGA Tour. Kombinerer TrackMan-data med individuell coaching for å gi hver spiller en tydelig utviklingsretning.",
  image: "/images/branding/ak-golf-academy-anders.jpg",
} as const;

// ─── Coaching Offers ───
export const COACHING_OFFERS = [
  {
    title: "Performance",
    description: "2 økter i måneden med TrackMan-analyse, treningsplan og full portaltilgang.",
    price: "1 600",
    period: "kr/mnd",
    image: "/images/branding/ak-golf-academy-40.jpg",
    href: "/#packages",
  },
  {
    title: "Performance Pro",
    description: "4 økter i måneden for deg som vil ha maksimal fremgang. Prioritert booking.",
    price: "2 000",
    period: "kr/mnd",
    image: "/images/branding/ak-golf-academy-29.jpg",
    href: "/#packages",
    highlighted: true,
  },
  {
    title: "Flex-sesjon",
    description: "Enkeltsesjon uten binding. Perfekt for å prøve coaching eller få en engangs-gjennomgang.",
    price: "fra 1 500",
    period: "kr",
    image: "/images/branding/ak-golf-academy-07.jpg",
    href: "/#packages",
  },
] as const;

// ─── Formspree (deprecated - bruker na /api/contact) ───
export const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ID
  ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`
  : "";

// ─── Academy Page v2 (dark hero rewrite) ───
export const ACADEMY_HERO_V2 = {
  label: "AK GOLF ACADEMY",
  heading: "Coaching som\ngir resultater.",
  description: "Individuell coaching med TrackMan-data, video-analyse og personlig treningsplan.",
  ctaPrimary: "Book coaching",
  ctaSecondary: "Se priser",
  heroImage: "/images/academy/AK-Golf-Academy-20.jpg",
} as const;

export const ACADEMY_METHOD_V2 = {
  label: "V\u00c5R TILN\u00c6RMING",
  heading: "Tre steg til bedre golf.",
  steps: [
    {
      number: "01",
      title: "Analyse",
      description: "Vi kartlegger spillet ditt med TrackMan og Strokes Gained. Ingen gjetning \u2014 bare data.",
    },
    {
      number: "02",
      title: "Plan",
      description: "Basert p\u00e5 analysen lager vi en treningsplan som fokuserer p\u00e5 dine svakeste omr\u00e5der.",
    },
    {
      number: "03",
      title: "Oppf\u00f8lging",
      description: "Ukentlig oppf\u00f8lging gjennom portalen. Vi justerer planen basert p\u00e5 fremgangen din.",
    },
  ],
} as const;

export const ACADEMY_PRICES_V2 = {
  label: "PRISER",
  heading: "Velg ditt format.",
  packages: [
    {
      name: "Individuell",
      price: "1 200",
      unit: "kr/time",
      features: [
        "TrackMan-data",
        "Video-analyse",
        "Personlig treningsplan",
        "Oppf\u00f8lging mellom timer",
      ],
      highlighted: false,
      badge: null as string | null,
    },
    {
      name: "5-pakke",
      price: "5 000",
      unit: "kr / 5 timer",
      perSession: "1 000 kr/t",
      savings: "Spar 1 000 kr",
      features: [
        "TrackMan-data",
        "Video-analyse",
        "Personlig treningsplan",
        "Oppf\u00f8lging mellom timer",
      ],
      highlighted: true,
      badge: "MEST POPUL\u00c6R" as string | null,
    },
    {
      name: "Gruppe",
      price: "500",
      unit: "kr/\u00f8kt",
      note: "Maks 6 per gruppe",
      features: [
        "TrackMan-data",
        "Gruppedynamikk",
        "Fokuserte \u00f8kter",
      ],
      highlighted: false,
      badge: null as string | null,
    },
  ],
} as const;

export const ACADEMY_CTA_V2 = {
  heading: "Klar for neste niv\u00e5?",
  description: "Book din f\u00f8rste time og f\u00e5 en komplett analyse.",
  ctaLabel: "Book coaching",
  heroImage: "/images/academy/AK-Golf-Academy-25.jpg",
} as const;

// ─── Junior Academy Page v2 (dark hero rewrite) ───
export const JUNIOR_HERO_V2 = {
  label: "AK GOLF JUNIOR ACADEMY",
  heading: "Morgendagens\ngolfspillere.",
  description: "Elite juniorcoaching med TrackMan, individuell oppfolging og turneringsplan. For ambisjose juniorer 10\u201318 ar.",
  ctaPrimary: "Sok opptak",
  ctaSecondary: "Se treningsgrupper",
  heroImage: "/images/academy/AK-Golf-Academy-29.jpg",
} as const;

export const JUNIOR_ACADEMY_PROGRAM = {
  label: "VART PROGRAM",
  heading: "AK Golf Junior Academy",
  description: "Individuelt tilpasset coaching for juniorer som vil satse. Personlig treningsplan, PlayersHQ og oppfolging.",
  price: "3 500 kr/mnd",
  capacity: "Maks 8 spillere",
  ctaLabel: "Sok opptak",
  images: [
    "/images/academy/AK-Golf-Academy-8.jpg",
    "/images/academy/AK-Golf-Academy-12.jpg",
    "/images/academy/AK-Golf-Academy-14.jpg",
  ],
} as const;

export const JUNIOR_AGE_GROUPS_V2 = {
  label: "GFGK JUNIOR",
  heading: "Treningsgrupper for alle nivaer",
  groups: [
    {
      ageRange: "6\u20139 \u00c5R",
      name: "Golflek",
      description: "Introduksjon gjennom lek og moro.",
      schedule: "Onsdager 16:00\u201317:00",
      maxParticipants: "Maks 12 barn",
      note: "I regi av GFGK Junior",
    },
    {
      ageRange: "10\u201314 \u00c5R",
      name: "Utviklingsgruppe",
      description: "Strukturert trening.",
      schedule: "Tirsdager og torsdager 16:00\u201317:30",
      maxParticipants: "Maks 8",
      note: "I regi av GFGK Junior",
    },
    {
      ageRange: "15\u201318 \u00c5R",
      name: "Prestasjonsgruppe",
      description: "TrackMan-data, mental trening.",
      schedule: "Mandager og onsdager 16:00\u201318:00",
      maxParticipants: "Maks 6",
      note: "I regi av GFGK Junior",
    },
  ],
} as const;

export const JUNIOR_WANG_V2 = {
  label: "TOPPIDRETT",
  heading: "WANG Toppidrett Fredrikstad",
  description: "Golf som toppidrettsfag p\u00e5 videreg\u00e5ende skole. Elevene f\u00e5r daglig trening med kvalifiserte trenere, tilgang til TrackMan og et helhetlig utviklingsmilj\u00f8. AK Golf Academy st\u00e5r for det sportslige innholdet i samarbeid med WANG Toppidrett.",
  ctaLabel: "Les mer om WANG",
} as const;

export const JUNIOR_GFGK_V2 = {
  label: "SAMARBEID",
  heading: "I samarbeid med Gamle Fredrikstad Golfklubb",
  description: "AK Golf Junior Academy leverer det sportslige innholdet i samarbeid med GFGK Junior. Junioravdelingen til GFGK organiserer treningsgrupper og arrangementer.\n\nAK Golf Junior Academy kommer pa toppen av klubbens eget juniorprogram (Junior Elite).",
} as const;

export const JUNIOR_CTA_V2 = {
  heading: "Vil barnet ditt prove golf?",
  description: "Kontakt oss for mer informasjon om AK Golf Junior Academy eller treningsgrupper gjennom GFGK Junior.",
  ctaPrimary: "Sok opptak til Junior Academy",
  ctaPrimaryHref: "/#apply",
  ctaSecondary: "Kontakt GFGK Junior",
  ctaSecondaryHref: "https://gfrg.no/junior",
} as const;

// ─── Utvikling Page v2 (Brand Guide V2.0 — handoff g14) ───
export const UTVIKLING_HERO_V2 = {
  label: "UTVIKLINGSMODELLEN",
  headingStart: "Slik bygger vi",
  headingEm: "varig framgang.",
  description:
    "Vår utviklingsmodell bygger på fire pillarer som flytter golfere fremover. Du får en plan som tilpasser seg deg, ikke omvendt.",
  bannerQuote: "«En god plan er en spillers største lojalitet.»",
  bannerLab: "AK GOLF · UTVIKLINGSMODELL",
} as const;

export const UTVIKLING_PILLARS_V2 = {
  label: "DE FIRE PILLARENE",
  headingStart: "Fire områder.",
  headingEm: "Alltid sammen.",
  intro:
    "De fleste jobber bare med teknikk. Vi har lært at det ikke holder. Mental, fysisk og strategi avgjør om teknikken faktisk overlever 18 hull i konkurranse.",
  items: [
    {
      num: "01 / TEKNIKK",
      titleStart: "Repeterbar",
      titleEm: "bevegelse.",
      description:
        "TrackMan og video. Vi måler hver økt og bygger på data — ikke magefølelse.",
      bullets: [
        "Spin-axis, attack-angle, club-path",
        "Videoanalyse av sving",
        "Skreddersydde drills per spiller",
      ],
    },
    {
      num: "02 / FYSISK",
      titleStart: "Kropp som",
      titleEm: "tåler.",
      description:
        "Mobilitet og styrke som beskytter mot skader og åpner for mer hastighet.",
      bullets: ["Bevegelsesscreening", "Personlig hjemme-program", "Skadefri-protokoll"],
    },
    {
      num: "03 / MENTAL",
      titleStart: "Hodet under",
      titleEm: "press.",
      description:
        "Pre-shot-rutiner, recovery, og identitet utenfor scorekortet.",
      bullets: [
        "Rutiner som tåler 18 hull",
        "Mental kartlegging",
        "Tilgang ved behov",
      ],
    },
    {
      num: "04 / STRATEGI",
      titleStart: "Smartere",
      titleEm: "beslutninger.",
      description:
        "Strokes Gained-data og course management. Hvor sparer du slag uten å treffe ballen bedre? Mye, viser det seg.",
      bullets: [
        "Strokes Gained per økt",
        "On-course coaching",
        "Klare mål for hver spiller",
      ],
    },
  ],
} as const;

export const UTVIKLING_STATS_V2: Array<{
  label: string;
  value: string;
  valueEm: string;
  sub: string;
}> = [];

export const UTVIKLING_READING_V2 = {
  label: "",
  headingStart: "",
  headingEm: "",
  headingEnd: "",
  paragraphs: [] as string[],
  pullquote: "",
  v3Heading: "",
  v3Intro: "",
  v3Bullets: [] as string[],
  forYouHeading: "",
  forYouParagraphs: [] as string[],
};

export const UTVIKLING_COMPARE_V2 = {
  label: "VS. TYPISK PRO-TIME",
  headingStart: "Hva skiller oss fra",
  headingEm: "en vanlig time?",
  rows: [
    {
      row: "Plan",
      them: "Ad-hoc · per økt",
      us: "Plan med tydelige mål",
      emphasized: false,
    },
    {
      row: "Måling",
      them: "Magefølelse + iPhone-video",
      us: "TrackMan + videoanalyse",
      emphasized: true,
    },
    {
      row: "Mellom økter",
      them: "Ingenting",
      us: "Drills og oppfølging i app",
      emphasized: false,
    },
    {
      row: "Strokes Gained",
      them: "Sjelden",
      us: "Innebygd · etter hver runde",
      emphasized: false,
    },
    {
      row: "Coach-tilgang",
      them: "Time-til-time",
      us: "Direkte chat ved behov",
      emphasized: false,
    },
  ],
} as const;

export const UTVIKLING_TESTIMONIALS_V2: Array<{
  quoteStart: string;
  quoteEm: string;
  quoteEnd: string;
  name: string;
  meta: string;
  avatar: "purple" | "green";
}> = [];

export const UTVIKLING_CTA_V2 = {
  headingStart: "Klar for å bygge din egen",
  headingEm: "plan?",
  description:
    "Ta kontakt for en uforpliktende prat. Vi diskuterer hvor du står, hvor du vil, og om akademiet er rett match.",
  ctaPrimary: "Ta kontakt",
  ctaPrimaryHref: "/kontakt",
  ctaSecondary: "Se priser",
  ctaSecondaryHref: "/pricing",
} as const;

// ─── Spillerreisen (Structure) ───
export const PLAYER_JOURNEY = [
  {
    id: "nybegynner",
    title: "Nybegynner",
    coach: "Markus",
    steps: ["After Work", "Veien til Golf", "Første Sesong", "9 Hull Social"]
  },
  {
    id: "mellom",
    title: "Mellomnivå & Oppfølging",
    coach: "Markus",
    steps: ["Flex 20", "Individuell coaching", "9 Hull Challenge", "On-Course Par 3"]
  },
  {
    id: "avansert",
    title: "Avansert & Systematisk",
    coach: "Anders",
    steps: ["Performance (Abonnement)", "Performance Pro (Abonnement)", "Gameday", "On-Course 9"]
  }
] as const;

export const PLAYER_JOURNEY_SECTION = {
  label: "DIN UTVIKLING",
  heading: "Spillerreisen: Veien til bedre golf.",
  description: "Vi har utviklet en systematisk sti fra dine aller første slag til avansert coaching. Finn ut hvor du er i dag, og se hva som kreves for å nå neste nivå.",
  ctaLabel: "Start reisen"
} as const;

// ─── Academy Abonnement (g6) — Brand Guide V2.0 ─────────────────────────────
// Layout/copy fra mockup g6-academy-pricing.html, men priser fra Stripe (sannhetskilde).
// Kilder: gotchas.md ("Anders-pakker"), pricing-page-client.tsx
export const ACADEMY_PRICING_V2 = {
  hero: {
    eyebrow: "Academy · Medlemskap",
    headingPrefix: "Coaching som",
    headingItalic: "varer",
    headingSuffix: "hele sesongen.",
    lede:
      "Tre veier inn i Academy. Start med Markus eller hopp rett på Anders — du kan oppgradere når som helst, ingen bindingstid.",
    stats: [
      { value: "32+", label: "Aktive Academy-spillere" },
      { value: "−4,2", label: "Snitt HCP-reduksjon · år 1" },
      { value: "94%", label: "Fornyer hvert år" },
    ],
  },
  plansHead: {
    headingPrefix: "Tre måter å være",
    headingItalic: "Academy-spiller",
    headingSuffix: ".",
    description:
      "Alle abonnement inkluderer PlayerHQ-app, treningsplan i app, TrackMan og videoanalyse. Forskjellen ligger i hvilken coach du møter og hvor mange økter per måned.",
  },
  plans: [
    {
      id: "performance-markus",
      name: "Performance · Markus",
      tagline: "Komme i gang med struktur",
      description:
        "Klubbcoaching med Markus to ganger i måneden. For deg som vil bygge fundament uten å forplikte deg til toppnivå.",
      priceMonthly: "1 000",
      period: "/ mnd",
      billed: "Ingen bindingstid · Avbestill når som helst",
      cta: "Velg Markus",
      href: "/booking-v2?serviceTypeId=performance-markus",
      features: [
        { text: "2 × 20 min coaching / måned", heavy: true },
        { text: "Klubbcoaching med Markus" },
        { text: "Selvbooking 7 dager frem" },
        { text: "PlayerHQ-app inkludert" },
        { text: "Treningsplan i app" },
        { text: "TrackMan + videoanalyse" },
      ],
      sectionTitle: "Inkludert",
    },
    {
      id: "performance-anders",
      name: "Performance · Anders",
      tagline: "Strukturert utvikling med Anders",
      description:
        "Individuell coaching med Anders to ganger i måneden. For deg som vil ha hovedcoachen vår, men holder volumet moderat.",
      priceMonthly: "1 200",
      period: "/ mnd",
      billed: "Ingen bindingstid · Avbestill når som helst",
      cta: "Velg Anders",
      href: "/booking-v2?serviceTypeId=performance-anders",
      featured: true,
      ribbon: "Mest valgte",
      features: [
        { text: "2 × 20 min coaching / måned", heavy: true },
        { text: "1-til-1 med Anders", heavy: true },
        { text: "TrackMan + videoanalyse" },
        { text: "Selvbooking 7 dager frem" },
        { text: "PlayerHQ-app inkludert" },
        { text: "Treningsplan i app" },
        { text: "Coach-notater etter hver økt" },
      ],
      sectionTitle: "Alt i Markus, pluss",
    },
    {
      id: "performance-pro-anders",
      name: "Performance Pro",
      tagline: "Det Anders gjør med tour-spillere",
      description:
        "Fire økter i måneden med Anders. Prioritert booking, AI-assistent og høyeste utviklingstempo for ambisiøse amatører.",
      priceMonthly: "2 200",
      period: "/ mnd",
      billed: "Ingen bindingstid · Prioritert booking",
      cta: "Velg Performance Pro",
      href: "/booking-v2?serviceTypeId=performance-pro-anders",
      features: [
        { text: "4 × 20 min coaching / måned", heavy: true },
        { text: "1-til-1 med Anders", heavy: true },
        { text: "Prioritert booking 14 dager frem" },
        { text: "TrackMan + videoanalyse" },
        { text: "PlayerHQ + AI-assistent" },
        { text: "Personlig treningsplan i app" },
        { text: "Coach-notater + ukentlig oppfølging" },
      ],
      sectionTitle: "Alt i Anders, pluss",
    },
  ],
  compare: {
    eyebrow: "Sammenlign nivåer",
    headingPrefix: "Alt du får, side om",
    headingItalic: "side.",
    rows: [
      { group: "Coaching" },
      { feature: "Coaching-økter / måned", values: ["2", "2", "4"] },
      { feature: "Coach", values: ["Markus", "Anders", "Anders"] },
      { feature: "Sesjonslengde", values: ["20 min", "20 min", "20 min"] },
      { feature: "TrackMan + videoanalyse", values: [true, true, true] },
      { feature: "Coach-notater i app", values: [true, true, true] },
      { group: "Booking & tilgang" },
      { feature: "Selvbooking", values: ["7 dager frem", "7 dager frem", "14 dager frem"] },
      { feature: "Prioritert booking", values: [false, false, true] },
      { feature: "Avbestilling", values: ["Når som helst", "Når som helst", "Når som helst"] },
      { group: "PlayerHQ-app" },
      { feature: "Treningsplan i app", values: [true, true, true] },
      { feature: "Øvelsesbank + statistikk", values: [true, true, true] },
      { feature: "AI-assistent", values: [false, false, true] },
    ],
  },
  included: {
    eyebrow: "Alle abonnement inkluderer",
    headingPrefix: "Et fundament",
    headingItalic: "som følger deg",
    headingSuffix: "hele året.",
    cards: [
      {
        icon: "BarChart3",
        title: "Strokes Gained-måling",
        description:
          "Vi måler hvor du taper og vinner slag mot ditt nivå. Du ser fremgangen i tall, ikke magefølelse.",
      },
      {
        icon: "Smartphone",
        title: "PlayerHQ i lomma",
        description:
          "Treningsplan, øvelsesbank og coach-notater. Bygd så du faktisk åpner den.",
      },
      {
        icon: "Video",
        title: "Videoanalyse",
        description:
          "Hver økt filmes. Du får tilbake klipp med markeringer og kommentarer fra coachen din.",
      },
      {
        icon: "Snowflake",
        title: "Året rundt",
        description:
          "Indoor TrackMan i vintermånedene, range og bane i sesong. Du mister ikke momentum.",
      },
      {
        icon: "RotateCcw",
        title: "Ingen bindingstid",
        description:
          "Avbestill når som helst. Vi vil at du blir fordi det funker — ikke fordi du er låst.",
      },
      {
        icon: "ShieldCheck",
        title: "Klar struktur",
        description:
          "Du vet alltid hva du skal trene på mellom sesjonene. Treningsplanen oppdateres etter hver økt.",
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    headingPrefix: "De spørsmålene",
    headingItalic: "folk faktisk",
    headingSuffix: "stiller.",
    description:
      "Står ikke svaret her? Send melding på kontakt — vi svarer samme dag.",
    items: [
      {
        q: "Hva er forskjellen på Markus og Anders?",
        a: "Markus er klubbcoach og fokuserer på golfere som bygger fundament. Anders er hovedcoach og jobber med ambisiøse amatører og tour-spillere. Begge bruker samme metode og samme PlayerHQ — forskjellen er pris og volum.",
      },
      {
        q: "Kan jeg pause abonnementet hvis jeg blir skadet?",
        a: "Ja. Vi pauser uten kostnad hvis du blir skadet eller skal lengre reise. Bare gi beskjed i appen.",
      },
      {
        q: "Hva skjer med ubrukte økter?",
        a: "Inntil to ubrukte økter rulles automatisk over til neste måned. Mer enn det og du må booke dem inn — vi vil at du faktisk bruker dem.",
      },
      {
        q: "Kan jeg oppgradere underveis?",
        a: "Når som helst. Forskjellen i pris faktureres pro rata fra dagen du oppgraderer. Du kan også nedgradere — det er ingen bindingstid.",
      },
      {
        q: "Er det en intro-time?",
        a: "Nye spillere starter med en Flex 20-økt eller en kort prat med coachen. Vi vil at du skal vite hva du går til før du forplikter deg.",
      },
      {
        q: "Hva med banecoaching?",
        a: "Banecoaching (On-Course 9 og On-Course Par 3) bookes som engangsøkter ved siden av abonnementet. Det er ikke inkludert — fordi vi vil at du skal velge når du tar det med ut på banen.",
      },
    ],
  },
  cta: {
    eyebrow: "Klar til å starte?",
    headingPrefix: "Book en gratis",
    headingItalic: "intro",
    headingSuffix: "— så finner vi rett nivå sammen.",
    description:
      "20 minutter, ingen forpliktelser. Vi snakker om hvor du står, hvor du vil, og hvilket abonnement som faktisk passer.",
    primaryCta: "Book gratis intro",
    primaryHref: "/booking-v2?v=2",
    secondaryCta: "Send spørsmål",
    secondaryHref: "/kontakt?v=2",
    quote:
      "Etter åtte måneder på Performance Pro gikk jeg fra HCP 12 til 7. Det største var ikke timene — det var planen mellom timene.",
    quoteAuthor: "Kristian B.",
    quoteContext: "Performance Pro · 14 mnd",
  },
} as const;

// ─── Junior Academy Page v3 (Brand Guide V2.0 — handoff 2026-04-27) ─────────
// Mockup: public/design-reference/handoff-2026-04-27/screens/g3-junior-academy.html
export const JUNIOR_HERO_V3 = {
  eyebrow: "Junior Academy · 6–17 år",
  headingLead: "Lekent,",
  headingItalic: "strukturert",
  headingTrail: ", og bygd for utvikling.",
  description:
    "Tre aldersgrupper med egne juniortrenere. Vi tar imot alle nivåer — fra første gang med kølle til ambisiøse tenåringer som vil konkurrere.",
  ctaPrimary: "Se aldersgrupper",
  ctaPrimaryHref: "#aldersgrupper",
  ctaSecondary: "Ta kontakt",
  ctaSecondaryHref: "/kontakt",
  photoDescription:
    "Gruppe juniorer 10–13 år i swing-positur, range, foreldrevennlig stemning",
  photoSrc: "/images/branding/ak-golf-academy-22.jpg",
} as const;

export const JUNIOR_AGE_GROUPS_V3 = {
  eyebrow: "Tre aldersgrupper",
  headingLead: "Lek, læring,",
  headingItalic: "og turnering",
  headingTrail: ".",
  groups: [
    {
      ageRange: "6–9 år",
      name: "Mini",
      tagline: "Lekbasert intro",
      description:
        "Motorikk, koordinasjon og gledesfylt første møte med golf. Plast-køller, fargerike mål, og masse løping.",
      features: [
        "Mini-baner og lek-stasjoner",
        "Foreldre kan delta gratis",
        "Kort tilpasset (avskåret)",
      ],
      groupSize: "8 stk",
      groupSizeLabel: "Pr. gruppe",
      ctaLabel: "Mer om Mini",
      ctaHref: "#apply",
      photoVariant: "default" as const,
      photoDescription: "Smilende 7-åring med plast-kølle, fargerik mini-bane",
      photoSrc: "/images/branding/ak-golf-academy-08.jpg",
    },
    {
      ageRange: "10–13 år",
      name: "Basis/Utvikling",
      tagline: "Teknikk + bane",
      description:
        "Strukturert teknikk-bygging og første møter med banespill i smågruppe.",
      features: [
        "Smågruppe-coaching",
        "Banespill",
        "Teknikk-fokus",
      ],
      groupSize: "6 stk",
      groupSizeLabel: "Pr. gruppe",
      ctaLabel: "Mer om Basis/Utvikling",
      ctaHref: "#apply",
      photoVariant: "lime" as const,
      photoDescription:
        "Junior 11 år i full sving, range, fokusert ansiktsuttrykk",
      photoSrc: "/images/branding/ak-golf-academy-09.jpg",
    },
    {
      ageRange: "14–17 år",
      name: "Elite",
      tagline: "Talent / turnering",
      description:
        "For ambisiøse tenåringer som vil utvikle seg mot turneringsspill. Personlig coach og treningsplan tilpasset spilleren.",
      features: [
        "Personlig coach",
        "Treningsplan",
        "Turnering-coaching",
      ],
      groupSize: "4 stk",
      groupSizeLabel: "Pr. gruppe",
      ctaLabel: "Mer om Elite",
      ctaHref: "#apply",
      photoVariant: "warm" as const,
      photoDescription:
        "Tenåring i ferdig follow-through på fairway, golden hour, fokus",
      photoSrc: "/images/branding/ak-golf-academy-18.jpg",
    },
  ],
} as const;

export const JUNIOR_PARENT_V3 = {
  eyebrow: "",
  headingLead: "",
  headingItalic: "",
  headingTrail: "",
  ctaLabel: "",
  ctaHref: "",
  benefits: [] as Array<{
    icon: "bell" | "lineChart" | "users" | "shield" | "calendar" | "message";
    title: string;
    description: string;
  }>,
};

export const JUNIOR_SEASON_V3 = {
  eyebrow: "",
  headingLead: "",
  headingItalic: "",
  headingTrail: "",
  programs: [] as Array<{
    label: string;
    title: string;
    description: string;
    stats: Array<{ v: string; l: string }>;
    ctaLabel: string;
    ctaHref: string;
    photoVariant: "lime" | "warm" | "default";
    photoDescription: string;
    photoSrc: string;
  }>,
};

export const JUNIOR_COACH_V3 = {
  eyebrow: "Hovedansvarlig junior",
  headingLead: "Markus Røinås Pedersen — ",
  headingItalic: "juniortrener.",
  quote: "",
  credits: [
    { v: "Hovedcoach", l: "Junior Academy" },
  ],
  portraitDescription:
    "Markus Røinås Pedersen (juniortrener) — portrettfoto kommer",
  portraitSrc: undefined as string | undefined,
};

export const JUNIOR_PRICEBAND_V3 = {
  title: "",
  description: "",
  prices: [] as Array<{ v: string; l: string }>,
};

export const JUNIOR_FAQ_V3 = {
  eyebrow: "",
  heading: "",
  items: [] as Array<{ q: string; a: string }>,
};

export const JUNIOR_CTA_V3 = {
  headingLead: "Vil dere",
  headingItalic: "vite mer",
  headingTrail: "?",
  description:
    "Ta kontakt for en uforpliktende prat. Vi forteller om aldersgruppene, hvordan en typisk uke ser ut, og hjelper dere finne riktig nivå for ungen.",
  ctaPrimary: "Ta kontakt",
  ctaPrimaryHref: "/kontakt",
  ctaSecondary: "",
  ctaSecondaryHref: "",
} as const;

// ─── Academy Page v3 (Brand Guide V2.0 — handoff 2026-04-27) ────────────────
// Mockup: public/design-reference/handoff-2026-04-27/screens/g2-academy.html
export const ACADEMY_HERO_V3 = {
  eyebrow: "Academy · Voksne 18+",
  headingLead: "Strukturert utvikling,",
  headingItalic: "målbar fremgang.",
  headingTrail: "",
  description:
    "AK Academy kobler coaching, treningsplan og oppfølging i samme system. Hver økt logges, hver plan oppdateres av din personlige coach.",
  ctaPrimary: "Book time",
  ctaPrimaryHref: "/booking",
  ctaSecondary: "Send e-post",
  ctaSecondaryHref: "mailto:post@akgolf.no",
  stats: [] as { v: string; l: string }[],
  photoDescription:
    "Anders i range-økt med voksen spiller, golfklubb i hånd, varm overcast lighting",
  photoSrc: undefined as string | undefined,
} as const;

export const ACADEMY_METHOD_V3 = {
  eyebrow: "AK-metoden",
  headingLead: "Fem nivåer,",
  headingItalic: "én plan",
  headingTrail: ".",
  description:
    "Hver Performance-spiller får en personlig fordeling per nivå. Vi måler hvor du står hver måned, og justerer planen — ikke gjettverk.",
  ctaLabel: "Les hele metoden",
  ctaHref: "/utvikling?v=2",
  levels: [
    { num: "L5", label: "Turnering & strategi" },
    { num: "L4", label: "Spill og banehåndtering" },
    { num: "L3", label: "Slagvalg & kortspill" },
    { num: "L2", label: "Teknikk & sving" },
    { num: "L1", label: "Fysikk & grunnform" },
  ],
} as const;

export const ACADEMY_COACH_V3 = {
  eyebrow: "Møt din hovedcoach",
  headingLead: "Anders Kristiansen — ",
  headingItalic: "din coach gjennom året.",
  description:
    "Anders er hovedcoach for voksne i Academy. Sesjonene foregår på Gamle Fredrikstad Golfklubb med TrackMan og videoanalyse, og han bygger en personlig plan som du jobber med mellom øktene.",
  credits: [] as { v: string; l: string }[],
  portraitDescription:
    "Anders Kristiansen i naturlig coaching-positur, range-bakgrunn, mid-shot",
  portraitSrc: undefined as string | undefined,
} as const;

export const ACADEMY_FAQ_V3 = {
  eyebrow: "Vanlige spørsmål",
  heading: "Det dere lurer på.",
  items: [
    {
      q: "Hva om jeg ikke har spilt før?",
      a: "Vi tar imot spillere på alle nivåer. Vi starter med en kartleggings-økt sammen med din coach, og bygger en plan fra ditt utgangspunkt.",
    },
    {
      q: "Kan jeg bytte mellom pakker?",
      a: "Ja — ta kontakt med oss på post@akgolf.no, så finner vi løsningen som passer.",
    },
    {
      q: "Hvor foregår øktene?",
      a: "Øktene foregår på Gamle Fredrikstad Golfklubb med TrackMan-bay, range og bane.",
    },
    {
      q: "Hvor mye fremgang er realistisk?",
      a: "Det varierer fra spiller til spiller. Vi måler underveis med TrackMan og runde-data, og justerer planen til det vi ser at faktisk gir deg fremgang.",
    },
    {
      q: "Hvordan kommer jeg i gang?",
      a: "Book en time direkte i booking-portalen, eller send oss en e-post på post@akgolf.no for å snakke om hva som passer for deg.",
    },
  ],
} as const;

export const ACADEMY_CTA_V3 = {
  headingLead: "Klar for å bli",
  headingItalic: "målbart bedre?",
  headingTrail: "",
  description:
    "Book time direkte i booking-portalen, eller send oss en e-post for å snakke om hva som passer deg.",
  ctaPrimary: "Book time",
  ctaPrimaryHref: "/booking",
  ctaSecondary: "Send e-post",
  ctaSecondaryHref: "mailto:post@akgolf.no",
} as const;
