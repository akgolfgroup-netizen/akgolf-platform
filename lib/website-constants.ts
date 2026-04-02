// ─── Navigation ───
export const NAV_LINKS = [
  { label: "Coaching", href: "/academy" },
  { label: "Junior Academy", href: "/junior-academy" },
  { label: "Utvikling", href: "/utvikling" },
] as const;

// ─── Hero ───
export const HERO = {
  eyebrow: "AK Golf Academy",
  heading: "Bli en bedre golfspiller — med system",
  subheading: "Fra 18 til singel-hcp på ett år. Individuell coaching med TrackMan, videoanalyse og personlig utviklingsplan som oppdateres etter hver sesjon.",
  statusBadge: "Sesong 2026 — begrenset kapasitet",
  ctaPrimary: "Se pakker og priser",
  ctaSecondary: "Book en Flex-sesjon",
  trustItems: [
    { label: "TrackMan-analyse hver sesjon" },
    { label: "Personlig utviklingsplan (IUP)" },
    { label: "Dokumentert handicap-forbedring" },
  ],
  stats: [
    { value: "500+", label: "Spillere utviklet" },
    { value: "15+", label: "Års erfaring" },
    { value: "Tour-nivå", label: "Metodikk" },
  ],
} as const;

// ─── The Foundation Method ───
export const FOUNDATION_METHOD = {
  eyebrow: "Vår metodikk",
  heading: "The Foundation Method",
  description: "Vår metodikk er bygget på 15 års erfaring og hundrevis av spillere. Fem faser som tar deg fra grunnmur til prestasjon.",
  phases: [
    {
      id: "BUILD",
      name: "BUILD",
      title: "Bygg grunnmuren",
      description: "Teknikk, grep, setup. De fundamentale bevegelsene som alt annet bygges på.",
    },
    {
      id: "STAB",
      name: "STAB",
      title: "Stabiliser under press",
      description: "Repetisjon og mestring. Gjør de riktige bevegelsene automatiske.",
    },
    {
      id: "TEST",
      name: "TEST",
      title: "Test under stressor",
      description: "Variasjon og utfordring. Simuler presset du møter på banen.",
    },
    {
      id: "TRANSFER",
      name: "TRANSFER",
      title: "Overfør til banen",
      description: "Fra range til spill. Bruk teknikkene i ekte spillsituasjoner.",
    },
    {
      id: "PERFORM",
      name: "PERFORM",
      title: "Prestér i konkurranse",
      description: "Når det gjelder. Fokus på mental styrke og strategisk spill.",
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
    bio: "Grunnlegger av AK Golf Group. Har coachet spillere på PGA Tour, DP World Tour og Ladies European Tour. Kombinerer teknisk veiledning etter plan med TrackMan-analyse. Hver spiller får en individuell utviklingsplan — ikke bare data, men konkret retning.",
    contact: { email: "anders@akgolf.no", phone: "+47 909 67 995" },
  },
  {
    name: "Markus",
    role: "Assistentcoach",
    division: "AK Golf Academy",
    image: null,
    bio: "College-golf fra USA. Spesialisert på gruppetrening, banecoaching og nybegynneropplæring. Kjører 9 Hull, After Work, Første Sesong og banecoaching på korthullsbanen. 20 min individuell coaching: 300 kr.",
    contact: { email: "markus@akgolf.no", phone: "+47 905 86 097" },
  },
] as const;

// ─── Divisions / Services ───
export const DIVISIONS = [
  {
    id: "academy",
    title: "Coaching",
    description: "Individuell coaching med TrackMan og personlig utviklingsplan for spillere som vil ha struktur og resultater.",
    features: ["20-min fokuserte sesjoner", "TrackMan-analyse", "Personlig treningsplan", "Spillerportal"],
    href: "/academy",
    accent: "academy" as const,
  },
  {
    id: "junior",
    title: "Junior Academy",
    description: "Strukturert golftrening for unge spillere — fra første turnering til nasjonalt nivå.",
    features: ["Nivåtilpasset trening", "Konkurranseveiledning", "Periodisering", "Foreldresamarbeid"],
    href: "/junior-academy",
    accent: "junior" as const,
  },
  {
    id: "utvikling",
    title: "Utvikling & Teknologi",
    description: "Digitale treningsverktøy og sportslig rådgiving for golfklubber, forbund og trenere.",
    features: ["Sportsplaner", "QR-treningsskilt", "IUP-plattform", "Trenerutvikling"],
    href: "/utvikling",
    accent: "utvikling" as const,
  },
] as const;

// ─── How It Works ───
export const HOW_IT_WORKS = {
  eyebrow: "Slik fungerer det",
  heading: "20 minutter som endrer spillet ditt",
  description: "Tradisjonell golfcoaching er én time, én gang i blant, uten oppfølging mellom sesjonene. Vi gjør det annerledes. Våre coaching-sesjoner er 20 minutter — fokuserte, målrettede og uten fyllminutter. Hver sesjon har ett mål. Etterpå oppdateres treningsplanen din i appen, slik at du vet nøyaktig hva du skal jobbe med til neste gang.",
  steps: [
    { number: "01", title: "Book selv i appen", description: "Velg tid som passer deg. Performance Pro-medlemmer ser tider 14 dager frem, Performance ser 7 dager." },
    { number: "02", title: "20 minutter med fokus", description: "Én ting per sesjon. Teknisk veiledning etter plan — ikke tilfeldig trening. TrackMan bekrefter at endringene sitter." },
    { number: "03", title: "Tren mellom sesjonene", description: "Treningsplanen oppdateres etter hver sesjon. Øvelsesbank, statistikk og progresjonslogging holder deg på sporet." },
  ],
} as const;

// ─── Foundation Test (Intro) ───
export const FOUNDATION_TEST = {
  name: "Foundation Test",
  tagline: "Start her",
  duration: "50 min",
  price: "995",
  description: "Din baseline. TrackMan-analyse, putting-test og konkret anbefaling.",
  includes: [
    "Kort samtale om mål og erfaring",
    "TrackMan-analyse (driver + jern)",
    "Kort spill og putting-test",
    "Personlig anbefaling og plan"
  ],
  refundNote: "Beløpet trekkes fra første faktura ved oppstart innen 14 dager."
} as const;

// ─── Coaching Packages (Abonnement) ───
export const COACHING_PACKAGES = [
  {
    name: "Performance Pro",
    price: "1 999",
    period: "kr/mnd",
    tagline: "Dobbel frekvens — raskere utvikling",
    description: "4 × 20 min individuell coaching per måned med prioritert booking. Full spillerportal. For deg som vil utvikle deg raskt.",
    whoIsItFor: "Passer for: Ambisiøse spillere som trener 3+ ganger i uken.",
    features: [
      "4 × 20 min individuell coaching/mnd",
      "Selvbooking 14 dager frem",
      "Prioritert booking foran Performance",
      "Maks 2 bookinger per uke",
      "TrackMan-data logget i profilen",
      "Full spillerportal med treningsplan",
      "Coaching-notater etter hver sesjon",
    ],
    highlighted: true,
    badge: "Mest populær",
    stripeMetadata: {
      type: "subscription",
      sessions_per_month: 4,
      session_duration: 20,
      booking_window_days: 14,
      max_per_week: 2,
      max_capacity: 10,
    },
  },
  {
    name: "Performance",
    price: "1 599",
    period: "kr/mnd",
    tagline: "Strukturert utvikling med jevnlig coaching",
    description: "2 × 20 min individuell coaching per måned med selvbooking. Full tilgang til spillerportalen med treningsplan, øvelsesbank og progresjonslogging.",
    whoIsItFor: "Passer for: Klubbspillere som spiller 1–2 ganger i uken.",
    features: [
      "2 × 20 min individuell coaching/mnd",
      "Selvbooking 7 dager frem",
      "TrackMan-data logget i profilen",
      "Full spillerportal med treningsplan",
      "Øvelsesbank med HD-video",
      "Treningsdagbok og statistikk",
      "AI-analyse og benchmarking",
    ],
    highlighted: false,
    stripeMetadata: {
      type: "subscription",
      sessions_per_month: 2,
      session_duration: 20,
      booking_window_days: 7,
      max_per_week: 1,
      max_capacity: 24,
    },
  },
] as const;

// ─── Onboarding Package ───
export const ONBOARDING_PACKAGE = {
  name: "Start",
  price: "3 000",
  period: "kr",
  tagline: "Din inngang til strukturert coaching",
  description: "3 × 20 min individuelle sesjoner over 30 dager. TrackMan spredningsanalyse med 7-jern og driver, personlig teknisk plan og 30 dagers tilgang til spillerportalen.",
  whoIsItFor: "Passer for: Alle som vil prøve AK Golf-metoden før de forplikter seg til abonnement.",
  features: [
    "3 × 20 min coaching over 30 dager",
    "TrackMan spredningsanalyse",
    "Personlig teknisk plan",
    "30 dagers portaltilgang"
  ],
  nextStep: "Etter Start anbefaler vi overgang til Performance eller Performance Pro.",
  stripeMetadata: {
    type: "onboarding",
    sessions: 3,
    session_duration: 20,
    portal_days: 30,
    includes_trackman_baseline: true,
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
      { name: "Duo 2:1", duration: "50 min", price: "899", priceLabel: "kr/pers", maxParticipants: 2 },
      { name: "Gruppetrening", duration: "60 min", price: "499", priceLabel: "kr/pers", maxParticipants: 4 },
      { name: "Playing lesson", duration: "2 timer", price: "2 500", priceLabel: "kr", maxParticipants: 1 }
    ]
  },
  markus: {
    name: "Markus Røinås Pedersen",
    role: "Coach",
    sessions: [
      { name: "Privat 1:1", duration: "50 min", price: "750", priceLabel: "kr", maxParticipants: 1 },
      { name: "Duo 2:1", duration: "50 min", price: "499", priceLabel: "kr/pers", maxParticipants: 2 },
      { name: "Gruppetrening", duration: "60 min", price: "349", priceLabel: "kr/pers", maxParticipants: 4 }
    ]
  }
} as const;

// ─── Drop-in / Flex ───
export const FLEX_PACKAGES = [
  {
    name: "Flex 50",
    price: "1 500",
    period: "kr",
    duration: "50 min",
    tagline: "50 minutter coaching — ingen binding",
    description: "Én coaching-sesjon på 50 minutter. Book ledige tider 48 timer i forveien. Betal per sesjon, ingen abonnement. Du får coaching-notater i appen etterpå.",
    includes: [
      "1 × 50 min individuell coaching",
      "TrackMan tilgjengelig i sesjonen",
      "Coaching-notater i appen etter sesjonen",
    ],
    notIncluded: [
      "Spillerportal (treningsplaner, øvelsesbank, statistikk)",
      "Booking mer enn 48 timer frem",
    ],
    stripeMetadata: {
      type: "drop_in",
      session_duration: 50,
      booking_window_hours: 48,
      slots_required: 2,
      includes_portal: false,
      includes_coaching_notes: true,
    },
  },
  {
    name: "Flex 90",
    price: "2 500",
    period: "kr",
    duration: "90 min",
    tagline: "90 minutter dypdykk — ingen binding",
    description: "Én coaching-sesjon på 90 minutter. Grundig gjennomgang av spillet ditt med full TrackMan-analyse. Book ledige tider 48 timer i forveien.",
    includes: [
      "1 × 90 min individuell coaching",
      "Full TrackMan-analyse med gjennomgang",
      "Coaching-notater i appen etter sesjonen",
    ],
    notIncluded: [
      "Spillerportal (treningsplaner, øvelsesbank, statistikk)",
      "Booking mer enn 48 timer frem",
    ],
    stripeMetadata: {
      type: "drop_in",
      session_duration: 90,
      booking_window_hours: 48,
      slots_required: 4,
      includes_portal: false,
      includes_coaching_notes: true,
    },
  },
] as const;

// ─── Banecoaching ───
export const BANECOACHING = [
  {
    name: "On-Course 9",
    price: "3 000",
    period: "kr/spiller",
    coach: "Anders",
    description: "9 hull på 18-hullsbanen med Anders. Strategi i praksis — du lærer å velge riktig slag basert på din faktiske spredning.",
    details: "Maks 2 spillere. Varighet ca. 2,5 timer. Inkluderer greenfee.",
    stripeMetadata: {
      type: "playing_lesson",
      holes: 9,
      course: "18-hull",
      max_participants: 2,
      includes_greenfee: true,
    },
  },
  {
    name: "On-Course Par 3",
    price: "500",
    period: "kr/spiller",
    coach: "Markus",
    description: "9 hull på korthullsbanen med Markus. Fokus på kort spill, banemanagement og scoring.",
    details: "Grupper à 4 spillere. Lav terskel, høyt læringsutbytte. Perfekt som neste steg etter Første Sesong.",
    stripeMetadata: {
      type: "playing_lesson",
      holes: 9,
      course: "par3",
      max_participants: 4,
    },
  },
] as const;

// ─── Markus Coaching ───
export const MARKUS_SESSIONS = {
  name: "Markus 20 min",
  price: "300",
  period: "kr",
  description: "Individuell coaching med Markus. Samme 20-minutters format som Anders, men til halv pris. Perfekt for spillere som vil ha hyppigere oppfølging uten å øke budsjettet.",
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
  description: "Flex gir deg coaching uten forpliktelser. Men du får kun coaching-notater — ikke spillerportalen. Ingen treningsplan mellom sesjonene, ingen statistikk, ingen progresjon.",
  conclusion: "Performance gir deg coaching OG systemet som gjør at treningen mellom sesjonene faktisk fungerer. Det er forskjellen mellom å ta en time og å utvikle seg.",
} as const;

// ─── Coaching FAQ ───
export const COACHING_FAQ = [
  { q: "Hvordan booker jeg tid?", a: "Logg inn i appen og gå til «Book sesjon». Du ser ledige tider basert på din pakke. Velg tid, bekreft, ferdig." },
  { q: "Hva skjer om jeg ikke bruker alle sesjonene mine?", a: "Ubrukte sesjoner forfaller ved månedslutt. Du får en påminnelse 10 dager før." },
  { q: "Kan jeg avbestille en booket tid?", a: "Ja, innen 24 timer før sesjonen. Etter det telles den som brukt." },
  { q: "Hva er forskjellen på Performance og Performance Pro?", a: "Dobbel frekvens (4 vs 2 sesjoner/mnd) og prioritert booking — du ser ledige tider 14 dager frem mot 7 dager." },
  { q: "Hva inkluderer Flex?", a: "En enkeltstående coaching-sesjon på 50 eller 90 minutter. Du får coaching-notater i appen etterpå, men ikke tilgang til spillerportalen." },
  { q: "Er det bindingstid?", a: "Nei. Alle abonnement er månedlige og kan sies opp når som helst." },
  { q: "Hva er Junior Elite?", a: "Et eliteprogram for maks 5 ambisiøse juniorer. 2 treninger per uke med faste tider. Begrenset plasser — ta kontakt for å søke." },
  { q: "Hvilken pakke passer for meg?", a: "Spiller du golf 1–2 ganger i uken og vil ha noe struktur? Performance. Trener du 3+ ganger i uken og vil utvikle deg raskt? Performance Pro. Vil du bare prøve først? Book en Flex-sesjon." },
  { q: "Hvor holder dere til?", a: "Vi holder til på Glåmdal Golf & Aktiv (GFGK) i Vinger. Vi har tilgang til driving range, nærspillsområde, putting green og full 18-hulls bane." },
] as const;

// ─── Final CTA ───
export const FINAL_CTA = {
  eyebrow: "Klar for å starte?",
  heading: "Ta det første steget mot ditt beste spill",
  description: "Book en uforpliktende samtale eller start direkte med din første coaching-time.",
  ctaPrimary: "Book coaching nå",
  ctaSecondary: "Ta kontakt først",
  trustItems: [
    { label: "Ingen binding", icon: "shield-check" },
    { label: "Svar innen 24 timer", icon: "clock" },
    { label: "Trygg betaling", icon: "credit-card" },
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
  title: "Grunnlegger & Head Coach",
  bio: [
    "Grunnlegger av AK Golf Group. Har coachet spillere på PGA Tour, DP World Tour og Ladies European Tour. Kombinerer teknisk veiledning etter plan med TrackMan-analyse.",
    "Hver spiller får en individuell utviklingsplan som oppdateres etter hver sesjon — ikke bare data fra TrackMan, men konkret retning og nøyaktig hva du skal jobbe med til neste gang.",
    "Min filosofi er enkel: coaching-sesjonen er kontaktpunktet, spillerportalen er motoren. Alt henger sammen — trening mellom sesjoner, statistikk, og progresjon over tid.",
  ],
} as const;

// ─── Testimonials ───
// TODO: Innhent tillatelse for fullt navn og bilder fra kundene
export const TESTIMONIALS = [
  {
    quote: "Anders har fullstendig transformert spillet mitt. Fra 18 til 11 i handicap på ett år — med en metode som føles naturlig og bærekraftig.",
    name: "Thomas R.",
    fullName: "Thomas Rasmussen", // Avventer samtykke
    role: "Academy-elev",
    club: "Gardermoen Golfklubb",
    program: "academy-utvikling",
    featured: true,
  },
  {
    quote: "Den individuelle tilnærmingen er det som skiller seg ut. Her er du ikke et nummer — du er et prosjekt de bryr seg om.",
    name: "Maria L.",
    fullName: "Maria Larsen", // Avventer samtykke
    role: "Academy-elev",
    club: "GFGK",
    program: "academy-grunn",
    featured: false,
  },
  {
    quote: "Junior-programmet ga datteren vår struktur, motivasjon og en ekte følelse av mestring. Anbefales på det sterkeste.",
    name: "Erik og Lise S.",
    fullName: "Erik og Lise Solberg", // Avventer samtykke
    role: "Juniorforeldre",
    club: "GFGK",
    program: "junior-16-17",
    featured: false,
  },
  {
    quote: "Vi implementerte AK Golf sin sportsplan i klubben. Resultatet var en 40% økning i juniorrekruttering første år.",
    name: "Knut A.",
    fullName: "Knut Andersen", // Avventer samtykke
    role: "Daglig leder",
    club: "Bogstad Golfklubb",
    program: "klubb",
    featured: false,
  },
] as const;

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
  { q: "Hva skiller AK Golf Academy fra andre golftrenere?", a: "Vi tilbyr en helhetlig, evidensbasert tilnærming der hver elev får en skreddersydd utviklingsplan. Kombinasjonen av 1:1 coaching, videoanalyse, mental trening og kontinuerlig oppfølging gir resultater langt over gjennomsnittet." },
  { q: "Hvor ofte bør jeg trene for å se resultater?", a: "De fleste av våre elever ser merkbar fremgang med 2-4 coaching-økter i måneden, kombinert med egentrening etter IUP-planen. Vi tilpasser opplegget etter ditt nivå og dine mål." },
  { q: "Trenger jeg et visst handicap for å starte?", a: "Nei, vi jobber med spillere på alle nivåer. Det viktigste er motivasjon og vilje til å investere i egen utvikling. Vi tilpasser metodikken etter ditt utgangspunkt." },
  { q: "Hvordan fungerer videoanalysen?", a: "Vi bruker avansert videoteknologi for å analysere svingen din fra flere vinkler. Du får detaljerte tilbakemeldinger og konkrete øvelser du kan jobbe med mellom øktene." },
  { q: "Kan jeg fryse medlemskapet?", a: "Ja, alle pakker kan fryses i opptil 2 måneder per år ved sykdom, skade eller andre spesielle omstendigheter." },
  { q: "Tilbyr dere trening utendørs hele året?", a: "Vi trener både innendørs og utendørs, avhengig av sesong og været. Om vinteren bruker vi innendørsanlegg med simulator og analyseverktøy." },
  { q: "Hva inkluderer den mentale treningen?", a: "Mental trening er integrert i alle økter og inkluderer teknikker for visualisering, prestasjonsrutiner, fokus og stressmestring. For Elite-pakken tilbyr vi også dedikerte mentaløkter." },
  { q: "Hvordan kommer jeg i gang?", a: "Ta kontakt via nettstedet eller ring oss. Vi setter opp en uforpliktende samtale der vi blir kjent med dine mål og ambisjoner, og anbefaler riktig program for deg." },
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
  { q: "Hva koster det?", a: "AK Golf Junior Academy koster 3 500 kr/mnd. GFGK Junior har egen treningsavgift gjennom klubben." },
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
  heading: "Book din Foundation Test.",
  description: "50 minutter. TrackMan-analyse, putting-test og personlig anbefaling. Du får en baseline og vet nøyaktig hvor du står.",
  primaryCta: "Book Foundation Test",
  secondaryCta: "Se priser",
  valueProps: [
    "Ingen bindingstid",
    "Pengene tilbake ved oppstart innen 14 dager",
    "Personlig anbefaling",
  ],
} as const;

// ─── Academy Hero ───
export const ACADEMY_HERO = {
  eyebrow: "AK Golf Academy",
  heading: "Ditt spill. Din plan. Dine resultater.",
  description: "Individuell coaching og skreddersydde utviklingsplaner for voksne spillere som vil ta spillet til neste nivå. Evidensbasert, personlig og med dokumenterte resultater.",
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
    price: "2 499",
    period: "kr/mnd",
    tagline: "For ambisiøse juniorer som satser på konkurransegolf",
    description: "8 individuelle coaching-sesjoner per måned med faste tider. TrackMan-analyse, personlig treningsplan og progresjonslogging — for juniorer som vil nå neste nivå.",
    fullDescription: "Junior Elite er et treningsprogram for juniorer som tar golfen på alvor. Du trener med Anders to ganger i uken — tirsdager med fokus på teknikk og langt spill, torsdager med kort spill og spillsituasjoner. Hver sesjon er 20 minutter med fullt fokus og TrackMan. Ingen ventetid, ingen fyllminutter. Etter sesjonen oppdateres treningsplanen din i appen med øvelser du skal jobbe med til neste gang. Foreldre har full innsyn i progresjonsdata, treningsplaner og utviklingen over sesongen.",
    features: [
      "8 × 20 min individuell coaching/mnd (2/uke)",
      "Faste tider tirsdag og torsdag",
      "TrackMan-analyse integrert i hver sesjon",
      "Full tilgang til spillerportalen",
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
  price: "3 500",
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
        "Spillerportalen gir sanntidsoversikt over treningsplan og progresjon",
        "Månedlige fremgangsrapporter sendes på e-post",
        "Kvartalsvise foreldremøter med gjennomgang av mål og utvikling",
        "Direkte kontakt med trener ved behov",
      ],
    },
    {
      title: "Kommunikasjonskanaler",
      items: [
        "Spillerportal — treningsplan, bookinger, fremgang",
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
  heading: "Digitale verktøy som",
  subheading: "forandrer treningshverdagen.",
  description: "Vår programvare er utviklet av trenere, for trenere. Vi forstår hverdagen på rangen og på banen — og har bygget verktøy som faktisk gjør en forskjell.",
} as const;

// ─── Utvikling Klubb Section ───
export const UTVIKLING_KLUBB = {
  label: "Klubbtrening & Rådgiving",
  heading: "Sportsplaner og rådgiving",
  subheading: "for ambisiøse klubber.",
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
      description: "Spillerportal, treningsplanlegger og statistikkverktøy som gir spillere og trenere full oversikt.",
      features: ["Spillerportal med IUP", "AI-treningsplanlegger", "Strokes Gained-analyse", "QR-treningsskilt"],
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
    id: "spillerportal",
    title: "Spillerportal",
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
    pricing: "Fra 15 000 kr",
    pricingNote: "Inkluderer 10 skilt og oppsett",
  },
  {
    id: "iup-system",
    title: "IUP-plattform",
    tagline: "Individuell utviklingsplan for juniorer",
    description: "Skybasert plattform for individuelle utviklingsplaner. Spillere og trenere samarbeider i sanntid om mål, fremgang og treningsinnhold.",
    features: [
      "Spillerprofiler med mål og statistikk",
      "Treningsplaner og øvelsesbank",
      "Fremgangsrapporter",
      "Foreldretilgang",
    ],
    pricing: "Fra 990 kr/mnd",
    pricingNote: "Per trener, ubegrenset spillere",
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
    pricing: "Kontakt oss",
    pricingNote: "Tilbud basert på klubbstørrelse",
  },
] as const;

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
    { title: "Data erstatter følelser", description: "TrackMan + spillerportal" },
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

// ─── Formspree (deprecated - bruker nå /api/contact) ───
export const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ID
  ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`
  : "";
