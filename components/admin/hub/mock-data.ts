import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle,
  CheckSquare,
  CreditCard,
  DollarSign,
  FileDown,
  Layers,
  MessageCircle,
  Package,
  Plus,
  RotateCcw,
  Sparkles,
  Target,
  TrendingDown,
  UserPlus,
  Users,
} from "lucide-react";
import type { HubActivity, HubModule, HubShortcut, HubStat } from "./types";

// TODO: koble til ekte data — bruk eksisterende KPI-aggregater + ActivityLog.

export const MOCK_STATS: HubStat[] = [
  { label: "Spillere · aktive", value: "42" },
  { label: "Økter · denne uka", value: "28" },
  { label: "Belegg", value: "94", unit: "%" },
  { label: "Inntekt · mai", value: "142k" },
];

export const MOCK_MODULES: HubModule[] = [
  {
    id: "fokus",
    icon: Target,
    title: "Dagens fokus",
    subtitle: "3 prioriterte oppgaver + dagsplan",
    href: "/portal/admin",
    badge: { label: "4 I DAG", tone: "accent" },
  },
  {
    id: "godkjenninger",
    icon: CheckSquare,
    title: "Godkjenninger",
    subtitle: "Bookinger og refusjoner som krever deg",
    href: "/portal/admin/godkjenninger",
    badge: { label: "3 VENTER", tone: "warn" },
  },
  {
    id: "spillere",
    icon: Users,
    title: "Spillere",
    subtitle: "42 aktive · 5 nye denne måneden",
    href: "/portal/admin/spillere",
  },
  {
    id: "meldinger",
    icon: MessageCircle,
    title: "Meldinger",
    subtitle: "3 urgent · foreldre Hansen, Holtsmark, Markus",
    href: "/portal/admin/meldinger",
    badge: { label: "7 ULESTE", tone: "accent" },
  },
  {
    id: "kalender",
    icon: Calendar,
    title: "Kalender",
    subtitle: "Uke 18 · 28 økter · 94 % belegg",
    href: "/portal/admin/kalender",
  },
  {
    id: "tjenester",
    icon: Package,
    title: "Tjenester",
    subtitle: "12 aktive · pakker, abo, drop-in, camp",
    href: "/portal/admin/tjenester",
  },
  {
    id: "okonomi",
    icon: CreditCard,
    title: "Økonomi",
    subtitle: "142k mai · 4 fakturaer ute · P&L grønt",
    href: "/portal/admin/okonomi",
  },
  {
    id: "rapporter",
    icon: BarChart3,
    title: "Rapporter",
    subtitle: "Coach-effekt · 12-mnd snitt HCP −2.6",
    href: "/portal/admin/rapporter",
  },
];

export const MOCK_ACTIVITY: HubActivity[] = [
  {
    id: "act-1",
    icon: TrendingDown,
    tone: "green",
    emphasis: "Sofie Aas",
    body: "— HCP 8.1 → 7.7 etter helgen på Bogstad. Ny PB! Trening sitter.",
    when: "2 t SIDEN",
  },
  {
    id: "act-2",
    icon: AlertCircle,
    tone: "amber",
    emphasis: "Foreldre Hansen",
    body: "— ber om å flytte tor 9. mai til man 12. mai 16:30 (skoletur). Foreslått tid sendt — venter på bekreftelse.",
    when: "3 t SIDEN",
  },
  {
    id: "act-3",
    icon: CheckCircle,
    tone: "green",
    emphasis: "Anders Kristiansen",
    body: "· Trackman re-test fullført. Driver +2 mph club speed, spin-axis +12° → +8.4° — alignment-arbeidet sitter.",
    when: "I GÅR 14:30",
  },
  {
    id: "act-4",
    icon: RotateCcw,
    tone: "purple",
    emphasis: "Refusjon",
    body: "· Per Rasmussen, NOK 1 200 prosessert via Stripe (booking 25. apr). Kunden er notifisert.",
    when: "I GÅR 09:00",
  },
  {
    id: "act-5",
    icon: UserPlus,
    tone: "default",
    emphasis: "Ny spiller",
    body: "· Lina Holm registrert · Junior Mid · invitert til kohort onsdager 17:00.",
    when: "I GÅR 16:42",
  },
  {
    id: "act-6",
    icon: DollarSign,
    tone: "green",
    emphasis: "12 fakturaer for april",
    body: "sendt automatisk · 142 000 kr · 4 ute (forventet betaling innen 7 dager)",
    when: "2 D SIDEN",
  },
];

export const MOCK_SHORTCUTS: HubShortcut[] = [
  {
    id: "sc-1",
    icon: Plus,
    name: "Ny booking",
    meta: "CMD + B",
    href: "/portal/admin/bookinger",
  },
  {
    id: "sc-2",
    icon: UserPlus,
    name: "Ny spiller",
    meta: "+ INVITE",
    href: "/portal/admin/spillere",
  },
  {
    id: "sc-3",
    icon: Layers,
    name: "Bygg treningsplan",
    meta: "FOR EN SPILLER",
    href: "/portal/admin/treningsplan-bygger",
  },
  {
    id: "sc-4",
    icon: MessageCircle,
    name: "Send kringkast",
    meta: "TIL KOHORT",
    href: "/portal/admin/meldinger",
  },
  {
    id: "sc-5",
    icon: FileDown,
    name: "Eksport · måneds-PDF",
    meta: "TIL STYRET",
    href: "/portal/admin/rapporter",
  },
  {
    id: "sc-6",
    icon: Sparkles,
    name: "Spør AI-assistent",
    meta: "«HVEM TRENGER OPPFØLG?»",
    href: "/portal/admin/ai-assistent",
  },
];

export const SHORTCUT_ARROW = ArrowRight;
