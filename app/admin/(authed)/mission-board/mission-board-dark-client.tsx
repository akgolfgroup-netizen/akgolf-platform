"use client";

import { useRouter } from "next/navigation";
import {
  CoachHQDarkShell,
  PageHead,
  Button,
} from "@/components/admin/coachhq-dark";
import {
  Filter,
  LayoutList,
  Plus,
  MessageCircle,
  Users,
} from "lucide-react";

interface MissionBoardDarkClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
  };
}

interface ProgressBar {
  label: string;
  range: string;
  pct: number;
  color: string;
}

interface Milestone {
  done: boolean;
  label: string;
  when: string;
}

interface MissionCard {
  id: string;
  initials: string;
  avatarColor: string;
  name: string;
  sub: string;
  deadline: string;
  deadlineTone: "default" | "near" | "passed";
  goal: string;
  goalSub: string;
  ringPct: number;
  ringStroke: string;
  bars: ProgressBar[];
  milestones: Milestone[];
  glow?: boolean;
  footer?: { primaryIcon: "message" | "users"; primaryLabel: string };
}

const DEADLINE_STYLES: Record<MissionCard["deadlineTone"], React.CSSProperties> =
  {
    default: {
      background: "rgba(255,255,255,0.025)",
      color: "rgba(255,255,255,0.6)",
    },
    near: { background: "rgba(196,138,50,0.18)", color: "#E8B967" },
    passed: { background: "rgba(184,66,51,0.16)", color: "#F49283" },
  };

export function MissionBoardDarkClient({ user }: MissionBoardDarkClientProps) {
  const router = useRouter();
  return (
    <CoachHQDarkShell
      user={user}
      title="Mission Board"
      meta="12 aktive oppdrag · 5 på vei mot deadline"
    >
      <PageHead
        eyebrow="Mission Board · Per spiller / team"
        title="Hva jobber vi mot, og hvor langt har vi kommet?"
        description="Hver spiller har 1–3 aktive oppdrag. Klikk for å se hele veien — fra første kartlegging til mål."
        actions={
          <>
            <Button
              variant="ghost"
              icon={<Filter className="w-3.5 h-3.5" />}
              onClick={() => router.push("/admin/elever")}
            >
              Alle oppdrag
            </Button>
            <Button
              variant="ghost"
              icon={<LayoutList className="w-3.5 h-3.5" />}
              onClick={() => router.push("/admin/elever/oversikt")}
            >
              Tabell-visning
            </Button>
            <Button
              variant="primary"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => router.push("/admin/treningsplan")}
            >
              Nytt oppdrag
            </Button>
          </>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3.5 mb-[22px]">
        <SummaryItem label="Aktive oppdrag" value="12" />
        <SummaryItem label="Snitt fremdrift" value="64%" valueColor="#D1F843" />
        <SummaryItem label="Innen frist (30d)" value="5" />
        <SummaryItem label="Lukket Q1 2026" value="8" />
      </div>

      {/* Mission grid */}
      <div className="grid grid-cols-3 gap-4">
        {MISSIONS.map((m) => (
          <MissionCardView
            key={m.id}
            card={m}
            onPrimary={() => router.push("/admin/meldinger")}
            onDetail={() => router.push("/admin/elever")}
          />
        ))}
      </div>
    </CoachHQDarkShell>
  );
}

function SummaryItem({
  label,
  value,
  valueColor = "#FFFFFF",
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div
      className="px-4 py-4"
      style={{
        background: "#0D2E23",
        border: "1px solid #1a4a3a",
        borderRadius: 14,
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        {label}
      </div>
      <div
        className="mt-1 text-[28px] font-bold tabular-nums"
        style={{ color: valueColor, letterSpacing: "-0.025em" }}
      >
        {value}
      </div>
    </div>
  );
}

function MissionCardView({
  card,
  onPrimary,
  onDetail,
}: {
  card: MissionCard;
  onPrimary: () => void;
  onDetail: () => void;
}) {
  const FooterIcon = card.footer?.primaryIcon === "users" ? Users : MessageCircle;

  return (
    <div
      className="relative p-[18px]"
      style={{
        background: "#0D2E23",
        border: card.glow
          ? "1px solid rgba(209,248,67,0.30)"
          : "1px solid #1a4a3a",
        borderRadius: 16,
        boxShadow: card.glow
          ? "0 0 0 3px rgba(209,248,67,0.10), 0 6px 20px rgba(255,255,255,0.06)"
          : "0 1px 2px rgba(10,31,24,0.03), 0 6px 20px rgba(255,255,255,0.04)",
      }}
    >
      {/* Head */}
      <div className="flex items-start justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full grid place-items-center text-[11px] font-bold"
            style={{ background: card.avatarColor, color: "#0A1F18" }}
          >
            {card.initials}
          </div>
          <div>
            <div className="text-[13px] font-semibold" style={{ color: "#FFFFFF" }}>
              {card.name}
            </div>
            <div
              className="mt-px"
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.45)",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.06em",
              }}
            >
              {card.sub}
            </div>
          </div>
        </div>
        <span
          className="px-2 py-0.5 rounded"
          style={{
            ...DEADLINE_STYLES[card.deadlineTone],
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.06em",
          }}
        >
          {card.deadline}
        </span>
      </div>

      <div
        className="text-[14px] font-semibold mb-1"
        style={{ color: "#FFFFFF", lineHeight: 1.35, letterSpacing: "-0.01em" }}
      >
        {card.goal}
      </div>
      <div
        className="text-[12px]"
        style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}
      >
        {card.goalSub}
      </div>

      {/* Ring + bars */}
      <div className="flex items-center gap-4 my-4">
        <ProgressRing pct={card.ringPct} stroke={card.ringStroke} />
        <div className="flex-1">
          {card.bars.map((bar, idx) => (
            <div key={idx} style={{ marginTop: idx === 0 ? 0 : 8 }}>
              <div
                className="flex justify-between"
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                <span>{bar.label}</span>
                <span>{bar.range}</span>
              </div>
              <div
                className="h-1 rounded-sm overflow-hidden"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <div
                  className="h-full rounded-sm"
                  style={{ width: `${bar.pct}%`, background: bar.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="flex flex-col gap-1.5 my-3">
        {card.milestones.map((ms, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 py-1.5"
            style={{
              fontSize: 11,
              color: ms.done ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.7)",
              borderBottom:
                idx === card.milestones.length - 1 ? "none" : "1px solid #1a4a3a",
              textDecoration: ms.done ? "line-through" : undefined,
            }}
          >
            <span
              className="shrink-0 grid place-items-center"
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: ms.done ? "#D1F843" : "transparent",
                border: ms.done
                  ? "1.5px solid #D1F843"
                  : "1.5px solid rgba(255,255,255,0.22)",
              }}
            >
              {ms.done && (
                <span
                  style={{
                    width: 4,
                    height: 2,
                    borderLeft: "1.5px solid #0A1F18",
                    borderBottom: "1.5px solid #0A1F18",
                    transform: "rotate(-45deg)",
                  }}
                />
              )}
            </span>
            <span className="flex-1">{ms.label}</span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {ms.when}
            </span>
          </div>
        ))}
      </div>

      <div
        className="flex gap-1.5 pt-3"
        style={{ borderTop: "1px solid #1a4a3a" }}
      >
        <Button
          size="sm"
          icon={<FooterIcon className="w-3 h-3" />}
          onClick={onPrimary}
        >
          {card.footer?.primaryLabel ?? "Notat"}
        </Button>
        <Button size="sm" variant="ghost" onClick={onDetail}>
          Detalj →
        </Button>
      </div>
    </div>
  );
}

function ProgressRing({ pct, stroke }: { pct: number; stroke: string }) {
  const circ = 2 * Math.PI * 32;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={76} height={76} viewBox="0 0 76 76" className="shrink-0">
      <circle
        cx="38"
        cy="38"
        r="32"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="6"
      />
      <circle
        cx="38"
        cy="38"
        r="32"
        fill="none"
        stroke={stroke}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 38 38)"
      />
      <text
        x="38"
        y="42"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="14"
        fontWeight="700"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {pct}%
      </text>
    </svg>
  );
}

const MISSIONS: MissionCard[] = [
  {
    id: "m1",
    initials: "SH",
    avatarColor: "#D1F843",
    name: "Sofie Holm",
    sub: "HCP 4.2 · Performance",
    deadline: "Deadline 12 mai",
    deadlineTone: "near",
    goal: "Kvalifisere til regions-turnering",
    goalSub: "Senke HCP til 3.5 og oppnå snitt SG +0.6 over 5 runder",
    ringPct: 75,
    ringStroke: "#005840",
    bars: [
      { label: "HCP", range: "4.2 → 3.5", pct: 78, color: "#D1F843" },
      { label: "SG", range: "+0.42 → +0.6", pct: 70, color: "#6FCBA1" },
    ],
    milestones: [
      { done: true, label: "Initial-kartlegging fullført", when: "22 mar" },
      { done: true, label: "Driver-protokoll iverksatt", when: "05 apr" },
      { done: true, label: "3 PR-runder", when: "25 apr" },
      { done: false, label: "Kvalifiseringsrunde", when: "10 mai" },
    ],
    glow: true,
  },
  {
    id: "m2",
    initials: "EL",
    avatarColor: "#6FB3FF",
    name: "Erik Lund",
    sub: "HCP 18.5 · Pro plan",
    deadline: "Deadline 30 jun",
    deadlineTone: "default",
    goal: "Bryte HCP 15 før sommer",
    goalSub: "Iron consistency + putting under 30 putts/runde",
    ringPct: 50,
    ringStroke: "#6FCBA1",
    bars: [
      { label: "HCP", range: "18.5 → 15.0", pct: 45, color: "#6FCBA1" },
      { label: "Putts/runde", range: "33.4 → 30", pct: 58, color: "#6FB3FF" },
    ],
    milestones: [
      { done: true, label: "12-ukers plan godkjent", when: "10 feb" },
      { done: true, label: "Iron-baseline TrackMan", when: "18 feb" },
      { done: false, label: "HCP under 17.0 (mid-check)", when: "15 mai" },
      { done: false, label: "Mål-runde 79 eller bedre", when: "25 jun" },
    ],
  },
  {
    id: "m3",
    initials: "JB",
    avatarColor: "#C896E8",
    name: "Junior Group B",
    sub: "8 spillere · 10–13 år",
    deadline: "Deadline 12 mai",
    deadlineTone: "near",
    goal: "Forberede til regions-turnering juniorer",
    goalSub: "Alle 8 skal ha 9-hulls-test fullført + putt-grunnferdighet",
    ringPct: 68,
    ringStroke: "#C896E8",
    bars: [
      { label: "9-hull-test", range: "6/8 fullført", pct: 75, color: "#C896E8" },
      {
        label: "Putt-grunnferdighet",
        range: "5/8 fullført",
        pct: 62,
        color: "#6FCBA1",
      },
    ],
    milestones: [
      { done: true, label: "Kick-off med foreldre", when: "15 mar" },
      { done: true, label: "Grunnferdigheter (4 stasjoner)", when: "10 apr" },
      { done: false, label: "Påmelding regions-turnering", when: "05 mai" },
      { done: false, label: "Turnering", when: "12 mai" },
    ],
    footer: { primaryIcon: "users", primaryLabel: "8 spillere" },
  },
  {
    id: "m4",
    initials: "HV",
    avatarColor: "#F49283",
    name: "Henrik Vold",
    sub: "HCP 24.0 · Re-engagement",
    deadline: "14 d inaktiv",
    deadlineTone: "passed",
    goal: "Komme tilbake i rytme",
    goalSub: "Logge 3 runder + 2 økter på 4 uker. Lavt-press oppstart.",
    ringPct: 20,
    ringStroke: "#F49283",
    bars: [
      { label: "Runder", range: "0/3", pct: 0, color: "#F49283" },
      { label: "Økter", range: "1/2", pct: 50, color: "#E8B967" },
    ],
    milestones: [
      { done: true, label: "Re-engagement-melding sendt", when: "22 apr" },
      { done: true, label: "Banecoaching booket man 28", when: "28 apr" },
      { done: false, label: "Første runde logget", when: "05 mai" },
      { done: false, label: "3-runder-mål", when: "25 mai" },
    ],
    footer: { primaryIcon: "message", primaryLabel: "Følg opp" },
  },
  {
    id: "m5",
    initials: "MD",
    avatarColor: "#6FCBA1",
    name: "Mia Dahl",
    sub: "HCP 9.8 · Performance",
    deadline: "Deadline 30 sep",
    deadlineTone: "default",
    goal: "Kvalifisere til klubbmesterskap",
    goalSub:
      "Holde HCP under 9 og spille 3 turneringsrunder før september",
    ringPct: 40,
    ringStroke: "#6FCBA1",
    bars: [
      { label: "HCP", range: "9.8 → 9.0", pct: 35, color: "#6FCBA1" },
      { label: "Turneringsrunder", range: "1/3", pct: 33, color: "#D1F843" },
    ],
    milestones: [
      { done: true, label: "Plan-mal valgt", when: "10 mar" },
      { done: true, label: "Første turneringsrunde", when: "12 apr" },
      { done: false, label: "HCP under 9.0", when: "15 jun" },
      { done: false, label: "Påmelding klubbmesterskap", when: "15 sep" },
    ],
  },
  {
    id: "m6",
    initials: "LB",
    avatarColor: "#E8B967",
    name: "Lars Berg",
    sub: "HCP 12.0 · Pro plan",
    deadline: "Deadline 15 aug",
    deadlineTone: "default",
    goal: "Iron-distance konsistens",
    goalSub: "Treffe 7-jern innenfor ±3 yards 70%+ på TrackMan",
    ringPct: 60,
    ringStroke: "#E8B967",
    bars: [
      { label: "Treffsone 7-jern", range: "52% → 70%", pct: 62, color: "#E8B967" },
      { label: "TrackMan-økter", range: "4/6", pct: 67, color: "#6FB3FF" },
    ],
    milestones: [
      { done: true, label: "Baseline 7-jern (52%)", when: "20 mar" },
      { done: true, label: "Tempo-protokoll iverksatt", when: "02 apr" },
      { done: false, label: "Mid-check (60%+)", when: "10 jun" },
      { done: false, label: "Mål 70% treffsone", when: "15 aug" },
    ],
  },
];
