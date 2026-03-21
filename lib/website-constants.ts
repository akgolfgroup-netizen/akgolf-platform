// ─── Navigation ───
export const NAV_LINKS = [
  { label: "Coaching", href: "/academy" },
  { label: "Junior Academy", href: "/junior" },
  { label: "Utvikling", href: "/utvikling" },
] as const;

// ─── Hero ───
export const HERO = {
  eyebrow: "AK Golf Academy",
  heading: "Coaching som endrer spillet.",
  subheading: "Individuell coaching på høyeste nivå for ambisiøse golfere som krever resultater.",
  urgencyBadge: "Sesong 2026 — begrenset kapasitet",
  ctaPrimary: "Book coaching",
  ctaSecondary: "Se vår metode",
  trustItems: ["AK-Formelen", "Individuell utviklingsplan", "Mentalt spill"],
} as const;

// ─── Team ───
export const TEAM = [
  {
    name: "Anders Kristiansen",
    role: "Hovedtrener",
    division: "AK Golf Junior Academy",
    bio: "Med over 10 års erfaring som golftrener på høyeste nivå har Anders viet karrieren sin til å hjelpe ambisiøse spillere med å nå sitt fulle potensial. Hans filosofi er enkel: teknikk alene er ikke nok — de beste resultatene kommer når vi jobber med hele spilleren.",
    certifications: ["PGA Professional", "TPI Certified", "Mental Coach", "Trackman Certified"],
    contact: { email: "anders@akgolf.no", phone: "+47 909 67 995" },
  },
  {
    name: "Markus Røinås Pedersen",
    role: "Coach · Hovedtrener GFGK Junior",
    division: "AK Golf Academy",
    bio: "Markus er coach i AK Golf Academy og hovedtrener for junioravdelingen på GFGK. Med bakgrunn i juniorutvikling og konkurransegolf skaper han et trygt og motiverende miljø der unge spillere kan vokse — både som golfere og mennesker.",
    certifications: ["PGA Professional"],
    contact: { email: "markus@akgolf.no", phone: "+47 905 86 097" },
  },
] as const;

// ─── Divisions / Services ───
export const DIVISIONS = [
  {
    id: "academy",
    title: "Coaching",
    description: "1:1 coaching og skreddersydde utviklingsplaner for voksne spillere som vil ta spillet til neste nivå.",
    features: ["Individuell coaching", "Videoanalyse", "IUP-plan", "Mental trening"],
    href: "/academy",
    accent: "academy" as const,
  },
  {
    id: "junior",
    title: "Junior Academy",
    description: "Strukturert talentutvikling for unge spillere med ambisjon om å konkurrere på høyeste nivå.",
    features: ["Aldersinndelt trening", "Konkurranseprogram", "Periodisering", "Foreldresamarbeid"],
    href: "/junior",
    accent: "junior" as const,
  },
  {
    id: "utvikling",
    title: "Utvikling & Teknologi",
    description: "Digitale verktøy, sportsplaner og rådgiving for golfklubber, forbund og trenere.",
    features: ["Sportsplaner", "QR-treningsskilt", "IUP-plattform", "Trenerutvikling"],
    href: "/utvikling",
    accent: "utvikling" as const,
  },
] as const;

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
  title: "Grunnlegger & Head Pro",
  bio: [
    "Med over 10 års erfaring som golftrenere på høyeste nivå har jeg viet karrieren min til å hjelpe ambisiøse spillere med å nå sitt fulle potensial. Fra juniorer med drøm om college-golf til voksne som jakter personlige mål — tilnærmingen er alltid individuell, evidensbasert og resultatorientert.",
    "Jeg grunnla AK Golf Group fordi jeg så et gap i markedet: spillere som ønsket mer enn generelle tips og gruppeundervisning, men en ekte partner i utviklingen. En trener som kjenner spillet ditt, følger opp mellom øktene, og justerer planen basert på data — ikke magefølelse.",
    "Min filosofi er enkel: teknikk alene er ikke nok. De beste resultatene kommer når vi jobber med hele spilleren — teknikk, strategi, mentalt spill og fysikk — i et integrert system tilpasset akkurat deg.",
  ],
  certifications: ["PGA Professional", "TPI Certified", "Mental Coach", "Trackman Certified"],
  experience: "10+",
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
    { title: "Alder", description: "13–19 år ved oppstart." },
    { title: "Grønt kort", description: "Spilleren må ha grønt kort eller tilsvarende grunnopplæring." },
    { title: "Motivasjon", description: "Vi ser etter spillere som vil utvikle seg, uavhengig av nåværende nivå." },
    { title: "Treningsvilje", description: "Vilje til å følge treningsprogram og delta jevnlig på økter." },
  ],
  process: [
    { step: "01", title: "Ta kontakt", description: "Send oss en melding eller ring — vi setter opp et uforpliktende møte." },
    { step: "02", title: "Møte", description: "Vi møtes for en uforpliktende prat om juniorens mål, nivå og ambisjoner." },
    { step: "03", title: "Vurdering", description: "Vi ser på hvordan junioren passer inn i gruppen og anbefaler riktig program." },
    { step: "04", title: "Oppstart", description: "Junioren starter i riktig aldersgruppe med en individuell plan." },
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

export const ACADEMY_PROGRAMS = [
  {
    name: "Grunnpakke",
    price: "Fra 4 900,-/mnd",
    description: "For spillere som vil ha en solid struktur og jevnlig oppfølging.",
    features: ["2 coaching-økter/mnd", "IUP-plan", "Videoanalyse", "Meldingsstøtte"],
    highlighted: false,
  },
  {
    name: "Utviklingspakke",
    price: "Fra 8 900,-/mnd",
    description: "For ambisiøse spillere med klare mål og dedikasjon til forbedring.",
    features: ["4 coaching-økter/mnd", "IUP-plan", "Ukentlig videoanalyse", "Mental trening", "Kursmanagement-økt", "Direkte trener-tilgang"],
    highlighted: true,
  },
  {
    name: "Elite",
    price: "På forespørsel",
    description: "For de som krever det aller beste — uten kompromisser.",
    features: ["Ubegrenset coaching", "Daglig oppfølging", "Turneringsstøtte", "Fysisk trening", "Full IUP + mentalt", "Reise-coaching"],
    highlighted: false,
  },
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
    ageGroup: "13–15 år",
    title: "Grunnlag",
    description: "Bygge solide tekniske ferdigheter, spilleforståelse og treningsvaner.",
    features: ["2 gruppeøkter/uke", "Individuell teknikk", "Introduksjon til konkurranse", "Sesongplan"],
  },
  {
    ageGroup: "16–17 år",
    title: "Utvikling",
    description: "Spisse ferdigheter, konkurrere regelmessig og utvikle eget spill.",
    features: ["3 økter/uke", "Individuell IUP", "Turneringsplan", "Mental trening", "Videoanalyse"],
  },
  {
    ageGroup: "18–19 år",
    title: "Pre-elite",
    description: "Forberedelse til elite- eller college-golf med full profesjonell støtte.",
    features: ["4-5 økter/uke", "Full IUP + mental", "Nasjonal/internasjonal konkurranse", "Fysisk trening", "Kursmanagement", "Stipend-veiledning"],
  },
] as const;

export const JUNIOR_FAQ = [
  { q: "Hva er minimumsnivå for å delta?", a: "Vi tar imot juniorer fra nybegynnernivå, men de må ha grønt kort eller tilsvarende grunnopplæring. Det viktigste er motivasjon og treningsvilje." },
  { q: "Hvor mange juniorer er det i hver gruppe?", a: "Maksimalt 6 juniorer per gruppe for å sikre individuell oppfølging. Noen økter er 1:1 eller i enda mindre grupper." },
  { q: "Hva koster juniorprogrammet?", a: "Prisene varierer etter aldersgruppe og program. Kontakt oss for en detaljert oversikt og muligheter for stønad/stipend." },
  { q: "Hvordan følger dere opp foreldrene?", a: "Vi har kvartalsvise foreldremøter, månedlige fremgangsrapporter og en åpen kommunikasjonskanal. Foreldreinvolvering er viktig for oss." },
  { q: "Tilbyr dere sommercamps?", a: "Ja, vi arrangerer intensive sommercamps i juni og juli med fokus på konkurranse, teknikk og det sosiale." },
  { q: "Hjelper dere med college-golf i USA?", a: "Absolutt. For 18-19-årsprogrammet tilbyr vi veiledning om college-prosessen, inkludert kontakt med universiteter og stipendsøknad." },
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
    heading: "Din personlige treningsplan — generert pa sekunder.",
    description: "Svar pa fire enkle sporsmal, og var AI lager en skreddersydd 12-ukers treningsplan basert pa AK-formelen. Gratis forhandsvisning for du bestemmer deg.",
  },
  howItWorks: [
    { number: "01", title: "Svar pa 4 sporsmal", description: "Handicap, mal, tilgjengelig tid og fokusomrade. Det tar under ett minutt." },
    { number: "02", title: "AI genererer planen", description: "Var AI bygger en personalisert 12-ukers plan basert pa AK-formelen og tusenvis av datapunkter." },
    { number: "03", title: "Se forhandsvisning", description: "Du far se en gratis oppsummering av planen for du velger a lase opp hele." },
  ],
  pricing: [
    {
      name: "Basis",
      price: "299 kr",
      period: "engangs",
      description: "En komplett 12-ukers treningsplan som PDF.",
      features: ["12-ukers plan", "Tilpasset ditt niva", "PDF-nedlasting", "AK-formelen"],
      highlighted: false,
    },
    {
      name: "Standard",
      price: "499 kr",
      period: "engangs",
      description: "Alt i Basis, pluss web-dashboard og ukentlig justering.",
      features: ["Alt i Basis", "Web-dashboard", "Ukentlig AI-justering", "Progressjonssporing", "Ovelsesvideoer"],
      highlighted: true,
    },
    {
      name: "Premium",
      price: "199 kr",
      period: "mnd",
      description: "Kontinuerlig AI-coaching med ubegrensede justeringer.",
      features: ["Alt i Standard", "Ubegrenset justering", "AI-coaching-chat", "Integrasjon med Trackman", "Prioritert support"],
      highlighted: false,
    },
  ],
  faq: [
    { q: "Hvordan fungerer AI-treningsplanen?", a: "Du svarer pa fire sporsmal om ditt niva, mal, tid og fokus. Var AI bruker AK-formelen til a generere en skreddersydd 12-ukers plan med okt-for-okt-detaljer." },
    { q: "Er planen virkelig personalisert?", a: "Ja. Planen tilpasses ditt handicap, tilgjengelige treningstid, fokusomrader og mal. Ingen to planer er like." },
    { q: "Kan jeg se planen for jeg kjoper?", a: "Absolutt. Du far en gratis forhandsvisning med oppsummering av ukeplanen for du bestemmer deg." },
    { q: "Hva er forskjellen pa PDF og web-dashboard?", a: "PDF-planen er en komplett nedlastbar plan. Web-dashboardet gir deg i tillegg progressjonssporing, ukentlige justeringer og ovelsesvideoer." },
    { q: "Erstatter dette en ekte trener?", a: "AI-planen er et supplement, ikke en erstatning. For spillere som onsker personlig oppfolging anbefaler vi AK Golf Academy." },
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

// ─── Credentials ───
export const CREDENTIALS = [
  { label: "PGA Professional" },
  { label: "TPI Certified" },
  { label: "Mental Coach" },
  { label: "Trackman Certified" },
] as const;

// ─── Footer ───
export const FOOTER_LINKS = {
  divisions: [
    { label: "Coaching", href: "/academy" },
    { label: "Junior Academy", href: "/junior" },
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
    phone: "+47 909 67 995",
    location: "GFGK, Vinger",
  },
} as const;

// ─── Booking ───
export const BOOKING_URL = "https://book.akgolf.no";

// ─── Portal ───
export const PORTAL_URL = "https://portal.akgolf.no";

// ─── Formspree (deprecated - bruker nå /api/contact) ───
export const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ID
  ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`
  : "";
