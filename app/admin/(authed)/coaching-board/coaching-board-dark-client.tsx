"use client";

import { useRouter } from "next/navigation";
import {
  CoachHQDarkShell,
  PageHead,
  Button,
} from "@/components/admin/coachhq-dark";
import {
  ClipboardList,
  Zap,
  Edit3,
  CheckCircle2,
  Plus,
  Filter,
  Layers,
  Paperclip,
  MessageSquare,
  AlertTriangle,
  Mail,
  Clock,
  CircleDot,
  CheckCircle,
  Users,
  User,
  FileText,
  Sparkles,
  Check,
  Archive,
  type LucideIcon,
} from "lucide-react";

interface CoachingBoardDarkClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
  };
  weekSessionCount: number;
}

type ColumnTone = "preparation" | "active" | "followup" | "done";

interface KanbanCard {
  id: string;
  initials: string;
  avatarColor: string;
  name: string;
  when: string;
  focus: string;
  progress?: number; // 0-1
  footerLeft: string;
  iconRight: { name: keyof typeof FOOTER_ICONS; count?: number }[];
  variant?: "default" | "live" | "urgent" | "faded";
}

interface KanbanColumn {
  tone: ColumnTone;
  title: string;
  icon: LucideIcon;
  count: number;
  cards: KanbanCard[];
}

const FOOTER_ICONS = {
  paperclip: Paperclip,
  message: MessageSquare,
  alert: AlertTriangle,
  mail: Mail,
  clock: Clock,
  "circle-dot": CircleDot,
  "check-circle": CheckCircle,
  users: Users,
  user: User,
  file: FileText,
  sparkles: Sparkles,
  check: Check,
  archive: Archive,
} as const;

const COLUMN_PILL: Record<ColumnTone, { bg: string; color: string }> = {
  preparation: { bg: "rgba(0,122,255,0.12)", color: "#6FB3FF" },
  active: { bg: "rgba(209,248,67,0.18)", color: "#D1F843" },
  followup: { bg: "rgba(196,138,50,0.18)", color: "#E8B967" },
  done: { bg: "rgba(42,125,90,0.16)", color: "#6FCBA1" },
};

export function CoachingBoardDarkClient({
  user,
  weekSessionCount,
}: CoachingBoardDarkClientProps) {
  const router = useRouter();
  const columns: KanbanColumn[] = [
    {
      tone: "preparation",
      title: "Forberedelse",
      icon: ClipboardList,
      count: 6,
      cards: PREP_CARDS,
    },
    {
      tone: "active",
      title: "Pågår",
      icon: Zap,
      count: 1,
      cards: ACTIVE_CARDS,
    },
    {
      tone: "followup",
      title: "Etterarbeid",
      icon: Edit3,
      count: 5,
      cards: FOLLOWUP_CARDS,
    },
    {
      tone: "done",
      title: "Ferdig",
      icon: CheckCircle2,
      count: 12,
      cards: DONE_CARDS,
    },
  ];

  return (
    <CoachHQDarkShell
      user={user}
      title="Coaching Board"
      meta={`${weekSessionCount} økter denne uken`}
    >
      <PageHead
        eyebrow="Workflow · Drag og slipp"
        title="Coaching Board"
        description="Hver økt går gjennom 4 faser. Dra kort mellom kolonner for å oppdatere status."
        actions={
          <>
            <Button
              variant="ghost"
              icon={<Filter className="w-3.5 h-3.5" />}
              onClick={() => router.push("/admin/team")}
            >
              Anders + Markus
            </Button>
            <Button
              variant="ghost"
              icon={<Layers className="w-3.5 h-3.5" />}
              onClick={() => router.push("/admin/denne-uken")}
            >
              Denne uken
            </Button>
            <Button
              variant="primary"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => router.push("/admin/bookinger/ny")}
            >
              Ny økt
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-4 gap-3.5 items-start">
        {columns.map((col) => (
          <KanbanColumnView
            key={col.tone}
            column={col}
            onAdd={() => router.push("/admin/bookinger/ny")}
            onCardClick={(id) => router.push(`/admin/okter?id=${id}`)}
          />
        ))}
      </div>
    </CoachHQDarkShell>
  );
}

function KanbanColumnView({
  column,
  onAdd,
  onCardClick,
}: {
  column: KanbanColumn;
  onAdd: () => void;
  onCardClick: (id: string) => void;
}) {
  const Icon = column.icon;
  const pill = COLUMN_PILL[column.tone];

  return (
    <div
      className="p-3 min-h-[600px]"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid #1a4a3a",
        borderRadius: 14,
      }}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div
          className="text-[12px] font-semibold flex items-center gap-1.5"
          style={{ color: "#FFFFFF" }}
        >
          <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
          {column.title}
          <span
            className="px-1.5 rounded-[9px] font-mono"
            style={{
              fontSize: 9,
              padding: "1px 6px",
              background: pill.bg,
              color: pill.color,
              letterSpacing: "0.06em",
            }}
          >
            {column.count}
          </span>
        </div>
        <button
          type="button"
          onClick={onAdd}
          aria-label="Legg til"
          style={{ color: "rgba(255,255,255,0.5)" }}
          className="hover:text-white transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.8} />
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {column.cards.map((card) => (
          <KanbanCardView
            key={card.id}
            card={card}
            onClick={() => onCardClick(card.id)}
          />
        ))}
      </div>
    </div>
  );
}

function KanbanCardView({
  card,
  onClick,
}: {
  card: KanbanCard;
  onClick: () => void;
}) {
  const isLive = card.variant === "live";
  const isUrgent = card.variant === "urgent";
  const isFaded = card.variant === "faded";

  return (
    <button
      type="button"
      onClick={onClick}
      className="p-3 cursor-pointer transition-all text-left w-full"
      style={{
        background: "#0D2E23",
        border: isLive
          ? "1px solid rgba(209,248,67,0.4)"
          : "1px solid #1a4a3a",
        borderLeft: isUrgent ? "3px solid #B84233" : undefined,
        borderRadius: 10,
        opacity: isFaded ? 0.7 : 1,
        boxShadow: isLive
          ? "0 0 0 3px rgba(209,248,67,0.10), 0 4px 12px rgba(255,255,255,0.06)"
          : "0 1px 2px rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-[26px] h-[26px] rounded-full grid place-items-center text-[10px] font-bold"
            style={{ background: card.avatarColor, color: "#0A1F18" }}
          >
            {card.initials}
          </div>
          <div className="text-[12px] font-semibold" style={{ color: "#FFFFFF" }}>
            {card.name}
          </div>
        </div>
        <div
          className="text-[10px]"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.06em",
          }}
        >
          {card.when}
        </div>
      </div>

      <div
        className="text-[12px]"
        style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}
      >
        {card.focus}
      </div>

      {card.progress !== undefined && (
        <div
          className="mt-2.5 h-[3px] rounded-sm overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-sm"
            style={{
              width: `${Math.round(card.progress * 100)}%`,
              background: "#D1F843",
            }}
          />
        </div>
      )}

      <div
        className="mt-2.5 flex items-center justify-between"
        style={{
          fontSize: 10,
          color: "rgba(255,255,255,0.45)",
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.06em",
        }}
      >
        <span>{card.footerLeft}</span>
        <div className="flex gap-2 items-center">
          {card.iconRight.map((ico, idx) => {
            const Icon = FOOTER_ICONS[ico.name];
            return (
              <span key={idx} className="inline-flex items-center gap-0.5">
                <Icon className="w-[11px] h-[11px]" strokeWidth={1.8} />
                {ico.count !== undefined && <span>{ico.count}</span>}
              </span>
            );
          })}
        </div>
      </div>
    </button>
  );
}

/* ============================================================
 * Mock-data — speiler mockupen 1:1
 * ========================================================== */

const PREP_CARDS: KanbanCard[] = [
  {
    id: "p1",
    initials: "SH",
    avatarColor: "#6FCBA1",
    name: "Sofie Holm",
    when: "TIR 14:00",
    focus:
      "Driver-tempo · forberede TrackMan-protokoll basert på siste 3 runder",
    progress: 0.6,
    footerLeft: "3/5 steg",
    iconRight: [
      { name: "paperclip", count: 2 },
      { name: "message", count: 1 },
    ],
  },
  {
    id: "p2",
    initials: "EL",
    avatarColor: "#E8B967",
    name: "Emma Lien",
    when: "TIR 17:00",
    focus:
      "Fullswing-eval · ikke logget runder på 14d. Trenger re-engagement-plan først",
    progress: 0.2,
    footerLeft: "1/5 · Forfaller 16:30",
    iconRight: [{ name: "alert" }],
    variant: "urgent",
  },
  {
    id: "p3",
    initials: "LB",
    avatarColor: "#6FB3FF",
    name: "Lars Berg",
    when: "ONS 09:00",
    focus: "Iron-tempo · etter forrige økt. Klubbe-distance review",
    progress: 0.4,
    footerLeft: "2/5 steg",
    iconRight: [{ name: "paperclip", count: 1 }],
  },
  {
    id: "p4",
    initials: "CR",
    avatarColor: "#C896E8",
    name: "Camilla R.",
    when: "ONS 13:00",
    focus: "Putting-stroke · drift høyre — rotasjons-test før økt",
    progress: 0.8,
    footerLeft: "4/5 steg",
    iconRight: [
      { name: "paperclip", count: 3 },
      { name: "message", count: 2 },
    ],
  },
  {
    id: "p5",
    initials: "HV",
    avatarColor: "#F49283",
    name: "Henrik Vold",
    when: "MAN 15:30",
    focus: "Banecoaching · 9 hull · course management og strategi",
    progress: 1,
    footerLeft: "5/5 ✓ Klar",
    iconRight: [{ name: "check-circle" }],
  },
  {
    id: "p6",
    initials: "JG",
    avatarColor: "#D1F843",
    name: "Junior Group A",
    when: "MAN 18:30",
    focus: "Kveldstrening · 8 stk · ferdighetsrotasjon 4 stasjoner",
    progress: 0.7,
    footerLeft: "Markus assist",
    iconRight: [{ name: "users", count: 8 }],
  },
];

const ACTIVE_CARDS: KanbanCard[] = [
  {
    id: "a1",
    initials: "ME",
    avatarColor: "#D1F843",
    name: "Markus Eide",
    when: "14:00 NÅ",
    focus: "Putting · lag-styring · TrackMan logger live · 32 min igjen",
    progress: 0.47,
    footerLeft: "Putting Green · Live",
    iconRight: [{ name: "circle-dot" }],
    variant: "live",
  },
];

const FOLLOWUP_CARDS: KanbanCard[] = [
  {
    id: "f1",
    initials: "EL",
    avatarColor: "#6FCBA1",
    name: "Erik Lund",
    when: "MAN 09:30",
    focus: "Iron consistency · skrive opp-summering, sende kveldsplan",
    progress: 0.5,
    footerLeft: "2/4 oppgaver",
    iconRight: [{ name: "file" }],
  },
  {
    id: "f2",
    initials: "SH",
    avatarColor: "#6FCBA1",
    name: "Sofie Holm",
    when: "MAN 07:00",
    focus: "Driver · TrackMan eksportert · skrive AI-narrative + dele",
    progress: 0.75,
    footerLeft: "3/4 oppgaver",
    iconRight: [{ name: "sparkles" }],
  },
  {
    id: "f3",
    initials: "MD",
    avatarColor: "#E8B967",
    name: "Mia Dahl",
    when: "FRE 25 apr",
    focus: "Range-økt · venter på spiller-svar på hjemmeoppgave",
    progress: 0.85,
    footerLeft: "Venter spiller",
    iconRight: [{ name: "clock" }],
  },
  {
    id: "f4",
    initials: "JG",
    avatarColor: "#C896E8",
    name: "Junior B",
    when: "FRE 25 apr",
    focus: "8 stk · sende foreldre-rapport via e-post",
    progress: 0.3,
    footerLeft: "Mal ikke ferdig",
    iconRight: [{ name: "mail" }],
  },
  {
    id: "f5",
    initials: "KN",
    avatarColor: "#6FB3FF",
    name: "Kari Nord",
    when: "TOR 24 apr",
    focus: "Studio-økt · oppdater spillerprofil + neste mål",
    progress: 0.6,
    footerLeft: "3/5 oppgaver",
    iconRight: [{ name: "user" }],
  },
];

const DONE_CARDS: KanbanCard[] = [
  {
    id: "d1",
    initials: "PK",
    avatarColor: "#6FCBA1",
    name: "Pelle K.",
    when: "FRE 25",
    focus: "Studio · Iron-tempo · plan sendt + faktura",
    footerLeft: "Lukket fre 18:24",
    iconRight: [{ name: "check" }],
    variant: "faded",
  },
  {
    id: "d2",
    initials: "AM",
    avatarColor: "#6FCBA1",
    name: "Anne M.",
    when: "TOR 24",
    focus: "Studio · Fullswing · alle aksjoner ferdig",
    footerLeft: "Lukket tor 20:11",
    iconRight: [{ name: "check" }],
    variant: "faded",
  },
  {
    id: "d3",
    initials: "TS",
    avatarColor: "#6FCBA1",
    name: "Tor Solberg",
    when: "TOR 24",
    focus: "Bane 9 hull · narrativ + neste plan ferdig",
    footerLeft: "Lukket tor 17:55",
    iconRight: [{ name: "check" }],
    variant: "faded",
  },
  {
    id: "d4",
    initials: "+9",
    avatarColor: "#7A8C85",
    name: "9 flere lukket",
    when: "UKE 17",
    focus: "Vis arkiv →",
    footerLeft: "Vis arkiv →",
    iconRight: [{ name: "archive" }],
    variant: "faded",
  },
];
