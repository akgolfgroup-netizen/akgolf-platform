"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CoachHQDarkShell,
  Button,
} from "@/components/admin/coachhq-dark";
import {
  Sparkles,
  Send,
  FileText,
  Clock,
  Edit3,
  Mic,
  MessageCircle,
  Phone,
  ArrowRight,
  Check,
  type LucideIcon,
} from "lucide-react";
import type { FocusTask } from "./actions";

interface FocusDarkClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
  };
  initialTasks: FocusTask[];
}

interface FocusItem {
  num: string;
  tag: string;
  title: string;
  why: string;
  studentInitials: string;
  studentColor: string;
  studentName: string;
  studentRight: string;
  primary: { icon: LucideIcon; label: string };
  secondaryIcons: LucideIcon[];
}

const FOCUS_ITEMS: FocusItem[] = [
  {
    num: "01",
    tag: "★ Topp prioritet",
    title: "Send plan til Sofie H. før klubbmesterskap",
    why: "Hun er foran skjema og spiller søndag. Hvis hun går inn uten en konkret plan blir det rotete. 5 minutter nå er bedre enn 25 minutter etter.",
    studentInitials: "SH",
    studentColor: "#D1F843",
    studentName: "Sofie Holm",
    studentRight: "HCP 4.2",
    primary: { icon: Send, label: "Send" },
    secondaryIcons: [FileText, Clock],
  },
  {
    num: "02",
    tag: "⏱ Tidssensitiv",
    title: "Logg innsikt fra Pelle K. sin LIVE-økt",
    why: "Han er midt i økten nå. Du har 18 min før neste spiller. Skriv 3 setninger om hva som funket — det er gull i 6-måneders-rapporten hans.",
    studentInitials: "PK",
    studentColor: "#6FB3FF",
    studentName: "Pelle Kvist",
    studentRight: "● LIVE 17:24",
    primary: { icon: Edit3, label: "Logg" },
    secondaryIcons: [Mic, Clock],
  },
  {
    num: "03",
    tag: "⚠ Risiko",
    title: "Personlig melding til Kari S.",
    why: "14 dager siden siste booking. AI flagget henne som drop-out-risiko. En kort melding nå koster 2 min — å miste henne koster 14.000 kr/år.",
    studentInitials: "KS",
    studentColor: "#F49283",
    studentName: "Kari Solem",
    studentRight: "14 dager",
    primary: { icon: MessageCircle, label: "Skriv" },
    secondaryIcons: [Phone, Clock],
  },
];

export function FocusDarkClient({ user, initialTasks }: FocusDarkClientProps) {
  const router = useRouter();
  const [now, setNow] = useState<string>("");
  const [dateLabel, setDateLabel] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setNow(
        d.toLocaleTimeString("nb-NO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      const day = d.toLocaleDateString("nb-NO", { weekday: "long" });
      const dayNum = d.getDate();
      const monthLong = d.toLocaleDateString("nb-NO", { month: "long" });
      const week = Math.ceil(
        ((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) /
          86400000 +
          1) /
          7,
      );
      setDateLabel(`${day} · ${dayNum}. ${monthLong} · uke ${week}`);
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  // Done-tasks: bruk eksisterende DONE fra DB hvis finnes
  const doneTasks = initialTasks
    .filter((t) => t.status === "DONE")
    .slice(0, 4);

  return (
    <CoachHQDarkShell user={user} title="Dagens fokus" meta={dateLabel}>
      {/* Hero */}
      <div
        className="rounded-2xl px-7 py-7 mb-5 grid items-center"
        style={{
          gridTemplateColumns: "1fr auto",
          gap: 24,
          background:
            "linear-gradient(135deg, rgba(209,248,67,0.10), rgba(209,248,67,0.02) 60%)",
          border: "1px solid rgba(209,248,67,0.20)",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#D1F843",
            }}
          >
            Focus · Dagens 3
          </div>
          <h1
            className="m-0 mt-1.5 text-[32px] font-bold"
            style={{ color: "#FFFFFF", letterSpacing: "-0.025em", lineHeight: 1.15 }}
          >
            De tre tingene som flytter mest i dag
          </h1>
          <p
            className="m-0 mt-2 text-[14px]"
            style={{ color: "rgba(255,255,255,0.7)", maxWidth: 520 }}
          >
            Alt annet er støy. Klikk på en oppgave for å starte. Når dagens 3 er
            ferdig — gå hjem.
          </p>
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 48,
            color: "#D1F843",
            letterSpacing: "-0.04em",
            fontWeight: 300,
            lineHeight: 1,
          }}
        >
          {now || "—"}
          <small
            className="block mt-1.5"
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            i dag
          </small>
        </div>
      </div>

      {/* AI strip */}
      <div
        className="rounded-[14px] px-5 py-4 mb-5 flex gap-3.5 items-start"
        style={{
          background: "rgba(175,82,222,0.06)",
          border: "1px solid rgba(175,82,222,0.20)",
        }}
      >
        <div
          className="w-8 h-8 rounded-lg grid place-items-center shrink-0"
          style={{
            background: "rgba(175,82,222,0.20)",
            color: "#C896E8",
          }}
        >
          <Sparkles className="w-4 h-4" strokeWidth={1.8} />
        </div>
        <div>
          <h4
            className="m-0 mb-1 text-[13px] font-semibold"
            style={{ color: "#FFFFFF" }}
          >
            Coach AI har valgt dagens 3 basert på risiko, plan-momentum og din
            kalender.
          </h4>
          <p
            className="m-0 text-[12px]"
            style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.55 }}
          >
            Sofie H. er foran skjema og trenger en konkret «next-step» før
            klubbmesterskapet søndag. Pelle K. har en LIVE-økt nå — bruk de 18
            minuttene før neste til å sende en klar oppsummering. Kari S. har vist
            signaler på drop-out (ingen booking siste 14 dager) og bør få en
            personlig melding nå mens hun husker deg.
          </p>
        </div>
      </div>

      {/* Three-up */}
      <div className="grid grid-cols-3 gap-3.5 mb-5">
        {FOCUS_ITEMS.map((item) => (
          <FocusCard
            key={item.num}
            item={item}
            onPrimary={() => router.push("/admin/meldinger")}
            onSecondary={() => router.push("/admin/elever")}
          />
        ))}
      </div>

      {/* Completed strip */}
      <div
        className="rounded-[14px] px-5 py-4 mb-5"
        style={{
          background: "#0D2E23",
          border: "1px solid #1a4a3a",
        }}
      >
        <div className="flex justify-between items-center mb-2.5">
          <div>
            <h3
              className="m-0 text-[14px] font-semibold"
              style={{ color: "#FFFFFF" }}
            >
              Allerede ute av veien i dag
            </h3>
            <div
              className="mt-0.5"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.14em",
                color: "#6FCBA1",
                textTransform: "uppercase",
              }}
            >
              +{doneTasks.length || 4} fullført · god start
            </div>
          </div>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.06em",
            }}
          >
            SISTE 8T
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          {(doneTasks.length > 0 ? doneTasks : DEMO_DONE).map((task, idx) => (
            <CompletedRow
              key={"id" in task ? task.id : idx}
              label={task.title}
              when={
                "createdAt" in task
                  ? new Date(task.createdAt).toLocaleTimeString("nb-NO", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : (task as { when: string }).when
              }
            />
          ))}
        </div>
      </div>

      {/* Tomorrow preview */}
      <div
        className="rounded-[14px] px-5 py-4"
        style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
      >
        <div className="flex justify-between items-center mb-2.5">
          <div>
            <h3
              className="m-0 text-[13px] font-semibold"
              style={{ color: "#FFFFFF" }}
            >
              Forhåndsvisning · i morgen
            </h3>
            <div
              className="mt-0.5"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.14em",
                color: "rgba(255,255,255,0.45)",
                textTransform: "uppercase",
              }}
            >
              torsdag 1. mai · stille dag
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push("/admin/denne-uken")}
          >
            Se hele <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { time: "08:00 · 60 min", label: "Iron-økt med Alex Brandt" },
            { time: "10:00 · 60 min", label: "Sving-analyse — Kari S." },
            { time: "13:00 · 60 min", label: "Re-onboarding — Emma L." },
          ].map((item, idx) => (
            <div
              key={idx}
              className="px-3 py-2.5 rounded-lg text-[12px]"
              style={{
                background: "rgba(255,255,255,0.03)",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              <div
                className="mb-1"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {item.time}
              </div>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </CoachHQDarkShell>
  );
}

function FocusCard({
  item,
  onPrimary,
  onSecondary,
}: {
  item: FocusItem;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  const PrimaryIcon = item.primary.icon;
  return (
    <div
      className="relative overflow-hidden p-5"
      style={{
        background: "#0D2E23",
        border: "1px solid #1a4a3a",
        borderRadius: 14,
      }}
    >
      <div
        className="absolute top-4 right-4"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 48,
          color: "rgba(255,255,255,0.06)",
          fontWeight: 700,
          letterSpacing: "-0.04em",
        }}
      >
        {item.num}
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.14em",
          color: "#D1F843",
          textTransform: "uppercase",
        }}
      >
        {item.tag}
      </div>
      <h3
        className="my-1.5 text-[18px] font-bold"
        style={{ color: "#FFFFFF", letterSpacing: "-0.01em" }}
      >
        {item.title}
      </h3>
      <p
        className="m-0 mb-3.5 text-[12px]"
        style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}
      >
        {item.why}
      </p>

      <div
        className="flex items-center gap-2 px-2.5 py-2 rounded-lg mb-1.5 text-[12px]"
        style={{
          background: "rgba(255,255,255,0.03)",
          color: "#FFFFFF",
        }}
      >
        <div
          className="w-[22px] h-[22px] rounded-full grid place-items-center text-[9px] font-bold shrink-0"
          style={{ background: item.studentColor, color: "#0A1F18" }}
        >
          {item.studentInitials}
        </div>
        {item.studentName}
        <span
          className="ml-auto"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {item.studentRight}
        </span>
      </div>

      <div className="flex gap-2 mt-3">
        <Button
          variant="primary"
          size="sm"
          icon={<PrimaryIcon className="w-3 h-3" />}
          style={{ flex: 1 }}
          onClick={onPrimary}
        >
          {item.primary.label}
        </Button>
        {item.secondaryIcons.map((Icon, idx) => (
          <Button
            key={idx}
            variant="ghost"
            size="sm"
            onClick={onSecondary}
          >
            <Icon className="w-3 h-3" strokeWidth={1.8} />
          </Button>
        ))}
      </div>
    </div>
  );
}

function CompletedRow({ label, when }: { label: string; when: string }) {
  return (
    <div
      className="grid items-center py-2 px-2.5 rounded-lg"
      style={{
        gridTemplateColumns: "16px 1fr auto",
        gap: 12,
        background: "rgba(42,125,90,0.06)",
        opacity: 0.55,
        textDecoration: "line-through",
        fontSize: 12,
        color: "rgba(255,255,255,0.85)",
      }}
    >
      <div
        className="grid place-items-center"
        style={{ width: 14, height: 14, borderRadius: "50%", background: "#6FCBA1" }}
      >
        <Check className="w-[9px] h-[9px]" strokeWidth={3} style={{ color: "#0A1F18" }} />
      </div>
      <div>{label}</div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {when}
      </div>
    </div>
  );
}

const DEMO_DONE = [
  { title: "Sjekket SwingScore-data fra Erik L.", when: "07:42" },
  { title: "Godkjent video-feedback til Mona K.", when: "09:12" },
  {
    title: "Booking onsdag 14:00 flyttet til torsdag 09:00",
    when: "11:30",
  },
  { title: "Faktura sendt til Henrik V.", when: "15:18" },
];
