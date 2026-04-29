// TODO: koble til ekte data
// - team: prisma.user.findMany med role IN (INSTRUCTOR, ADMIN) og capabilities
// - pending invites: prisma.invitation.findMany med status PENDING
// - permissions: lib/portal/capabilities/check.ts -> rolle-baserte defaults

export type TeamMember = {
  id: string;
  initials: string;
  avatarColor: string;
  name: string;
  role: string;
  bio: string;
  credentials: string[];
  stats: { label: string; value: string }[];
  lead?: boolean;
};

export const MOCK_TEAM: TeamMember[] = [
  {
    id: "es",
    initials: "ES",
    avatarColor: "#D1F843",
    name: "Erik Solheim",
    role: "★ HOVED-COACH (LEAD)",
    bio:
      "PGA Pro siden 2014. Coacher tour-spillere og junior-elite. Fokus: full-swing, mental, on-course strategi.",
    credentials: ["PGA", "TPI L2", "TRACKMAN", "QUINTIC"],
    stats: [
      { label: "Spillere", value: "42" },
      { label: "Økter / uke", value: "28" },
      { label: "Belegg", value: "94%" },
    ],
    lead: true,
  },
  {
    id: "ar",
    initials: "AR",
    avatarColor: "#6BB1FF",
    name: "Anne Rud",
    role: "FYSIO · TPI",
    bio:
      "Fysioterapeut med TPI Level 2-sertifisering. Kommer inn på testdager og skader. Lagger måltider med Erik.",
    credentials: ["FYSIO MNFF", "TPI L2", "STYRKE"],
    stats: [
      { label: "Spillere", value: "12" },
      { label: "Test / mnd", value: "8" },
      { label: "Stilling", value: "20%" },
    ],
  },
  {
    id: "kh",
    initials: "KH",
    avatarColor: "#C99CF3",
    name: "Kristian Holm",
    role: "JUNIOR-COACH",
    bio:
      "PGA-aspirant. Holder Junior Mid og Kids Academy. Arbeider med Erik på utviklingsprogrammer og foreldre-kommunikasjon.",
    credentials: ["PGA-AS", "TPI L1", "JUNIOR-CERT"],
    stats: [
      { label: "Spillere", value: "28" },
      { label: "Økter / uke", value: "14" },
      { label: "Belegg", value: "88%" },
    ],
  },
  {
    id: "ms",
    initials: "MS",
    avatarColor: "#E8B967",
    name: "Marte Sørli",
    role: "MENTAL TRENER",
    bio:
      "Idrettspsykolog. Gir mental-økter til elite-spillere. På akademiet 1 dag per uke (onsdager) i Skullerud-studio.",
    credentials: ["PSYK", "OLYMPIATOPPEN", "NIH"],
    stats: [
      { label: "Spillere", value: "8" },
      { label: "Dager", value: "ONS" },
      { label: "Stilling", value: "10%" },
    ],
  },
  {
    id: "lh",
    initials: "LH",
    avatarColor: "#6FCBA1",
    name: "Linn Haug",
    role: "ADMIN & ØKONOMI",
    bio:
      "Akademiets administrator. Tar booking-forespørsler, fakturering, kommunikasjon med klubb og foreldre. Jobber 60 % stilling.",
    credentials: ["ØK-ANSV", "STRIPE", "FAKTURA"],
    stats: [
      { label: "Bookinger", value: "87/m" },
      { label: "Faktura", value: "42/m" },
      { label: "Stilling", value: "60%" },
    ],
  },
];

export type PermissionRow = {
  feature: string;
  meta: string;
  cells: boolean[]; // Lead, Junior-coach, Fysio/Mental, Admin, Partner
};

export const PERMISSION_HEADERS = [
  "Lead-coach",
  "Junior-coach",
  "Fysio / Mental",
  "Admin",
  "Partner",
];

export const PERMISSION_ROWS: PermissionRow[] = [
  {
    feature: "Se alle spillere",
    meta: "HELE ROSTER",
    cells: [true, false, true, true, false],
  },
  {
    feature: "Booking-administrasjon",
    meta: "OPPRETT, FLYTT, AVLYS",
    cells: [true, true, true, true, false],
  },
  {
    feature: "Faktura & refusjon",
    meta: "STRIPE-INTEGRERT",
    cells: [true, false, false, true, false],
  },
  {
    feature: "Endre tjenester & pris",
    meta: "SERVICE-CATALOG",
    cells: [true, false, false, true, false],
  },
  {
    feature: "Test-resultater (TPI, Quintic)",
    meta: "LOGGE OG SE",
    cells: [true, false, true, false, false],
  },
  {
    feature: "Spiller-meldinger",
    meta: "SAMTALER",
    cells: [true, true, true, true, false],
  },
  {
    feature: "Lokasjons-bookinger",
    meta: "F.EKS HOLTSMARK",
    cells: [true, false, false, true, true],
  },
];
