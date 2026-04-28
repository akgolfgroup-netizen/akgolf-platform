// TODO: koble til ekte data
// - threads: prisma.messageThread.findMany med deltakere og siste melding
// - messages: prisma.message.findMany ordered by createdAt
// - context: spillerprofil + bookinger neste 14 dager + foreldrekontakt

export type InboxTag = "FORELDRE" | "SPILLER" | "URGENT" | "SYSTEM";

export type InboxRow = {
  id: string;
  initials: string;
  avatarColor: string;
  name: string;
  preview: string;
  when: string;
  tag: InboxTag;
  unread: boolean;
  active: boolean;
};

export type ChatBubble = {
  id: string;
  direction: "in" | "out";
  text: string;
  emphasized?: string;
  timestamp: string;
  attachment?: string;
};

export type InfoCellEntry = {
  label: string;
  value: string;
  valueColor?: string;
};

export type InfoRowEntry = {
  icon: "calendar" | "user" | "phone" | "mail" | "message-circle";
  label: string;
  value: string;
};

export const MOCK_INBOX: InboxRow[] = [
  {
    id: "fh",
    initials: "FH",
    avatarColor: "#C99CF3",
    name: "Foreldre Hansen",
    when: "14:22",
    preview:
      "«Erik er ute hele neste uke pga skoletur. Kan vi flytte torsdag-økten til mandag etter?»",
    tag: "FORELDRE",
    unread: true,
    active: true,
  },
  {
    id: "mn",
    initials: "MN",
    avatarColor: "#6BB1FF",
    name: "Markus Nordby",
    when: "13:48",
    preview:
      "«Trackman-rapporten — kan du sjekke spin-axis på driver bilag 3? Ser litt rar ut.»",
    tag: "SPILLER",
    unread: true,
    active: false,
  },
  {
    id: "hgk",
    initials: "!",
    avatarColor: "#F49283",
    name: "Holtsmark GK · admin",
    when: "12:30",
    preview:
      "«Fasilitet-tilgang for Tour Camp 12.–14. juni: vi trenger formell deltakerliste innen 15. mai.»",
    tag: "URGENT",
    unread: true,
    active: false,
  },
  {
    id: "ak",
    initials: "AK",
    avatarColor: "#D1F843",
    name: "Anders Kristiansen",
    when: "11:05",
    preview:
      "«Takk for økt i går! Skal definitivt prøve gate-drillen daglig denne uken — kjentes så mye bedre.»",
    tag: "SPILLER",
    unread: false,
    active: false,
  },
  {
    id: "hj",
    initials: "HJ",
    avatarColor: "#6FCBA1",
    name: "Hannah Johansen",
    when: "09:14",
    preview:
      "«Booket video-økt fredag — fungerer 14:00 fortsatt? Sender deg slow-mo i forkant.»",
    tag: "SPILLER",
    unread: false,
    active: false,
  },
  {
    id: "stripe",
    initials: "SA",
    avatarColor: "#E8B967",
    name: "Stripe · refusjon",
    when: "09:00",
    preview:
      "«Refund processed for Per Rasmussen — booking 25. apr. Beløp NOK 1 200 returnert til kunde.»",
    tag: "SYSTEM",
    unread: false,
    active: false,
  },
  {
    id: "fa",
    initials: "FA",
    avatarColor: "#C99CF3",
    name: "Foreldre Aas",
    when: "I går",
    preview:
      "«Kjempegøy at Sofie nå er nede på 7.7! Er dere åpne for ekstra økt før NM kvalifisering?»",
    tag: "FORELDRE",
    unread: false,
    active: false,
  },
  {
    id: "jt",
    initials: "JT",
    avatarColor: "#6BB1FF",
    name: "Jonas Tvedt",
    when: "I går",
    preview:
      "«Kan jeg booke ekstra short-game neste uke? Følt det går litt feil.»",
    tag: "SPILLER",
    unread: false,
    active: false,
  },
];

export const MOCK_CONVERSATION: ChatBubble[] = [
  {
    id: "1",
    direction: "in",
    text:
      "Hei Erik! Vi har bare oppdaget at Erik blir med på skoletur i Sør-Tyskland uke 19. Han vil derfor gå glipp av torsdag-økten 9. mai.",
    timestamp: "11:42",
  },
  {
    id: "2",
    direction: "in",
    text:
      "Er det mulig å flytte den til mandag 12. mai etter skole? Eller ev. Trackman-test 16. mai kan vi flytte fram?",
    timestamp: "11:43",
  },
  {
    id: "3",
    direction: "out",
    text:
      "Hei Linn! Tusen takk for tidlig beskjed. Vi har mandag 12. kl 16:30 åpen — passer det?",
    timestamp: "14:18",
  },
  {
    id: "4",
    direction: "out",
    text:
      "Trackman 16. mai vil jeg gjerne beholde fordi det er hele kohorten samlet. Mandag 12. mai 16:30 setter jeg som ny tid — han får full 60-min individuell.",
    emphasized: "Mandag 12. mai 16:30",
    timestamp: "14:19",
    attachment: "Foreslått: Man 12. mai 16:30–17:30 · Bogstad bay 4",
  },
  {
    id: "5",
    direction: "in",
    text:
      "Strålende! Det fungerer perfekt. Vil dere fakturere på samme måte eller skal vi betale 1:1?",
    emphasized: "Strålende!",
    timestamp: "14:22",
  },
];

export const MOCK_PLAYER_CONTEXT = {
  name: "Erik Hansen",
  meta: "14 ÅR · JUNIOR ELITE · MEDLEM 2 ÅR",
  stats: [
    { label: "HCP", value: "9.2" },
    { label: "Trend 90d", value: "−1.4", valueColor: "#6FCBA1" },
    { label: "Økter / mnd", value: "5" },
    { label: "Neste økt", value: "2.MAI" },
  ] satisfies InfoCellEntry[],
};

export const MOCK_BOOKINGS: InfoRowEntry[] = [
  { icon: "calendar", label: "Tor 02. mai · Fellesøkt", value: "16:00" },
  { icon: "calendar", label: "Tor 09. mai · Fravær?", value: "16:00" },
  { icon: "calendar", label: "Man 12. mai · Foreslått", value: "16:30" },
  { icon: "calendar", label: "Tor 16. mai · Trackman", value: "14:00" },
];

export const MOCK_PARENT_CONTACT: InfoRowEntry[] = [
  { icon: "user", label: "Linn Hansen", value: "MOR" },
  { icon: "phone", label: "+47 90 12 34 56", value: "SMS" },
  { icon: "mail", label: "linn@hansen.no", value: "EMAIL" },
  { icon: "message-circle", label: "Foretrukket kanal", value: "CHAT" },
];

export const QUICK_TEMPLATES = [
  { label: "AI-svar: bekreft mandag 16:30", ai: true },
  { label: "Bekreft tid", ai: false },
  { label: "Send faktura", ai: false },
  { label: "Be om video", ai: false },
  { label: "Påmelding camp", ai: false },
];
