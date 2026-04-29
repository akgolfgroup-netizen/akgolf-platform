"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import type {
  ArbeidsflateStudent,
  ArbeidsflateStudentList,
  ArbeidsflateActiveSession,
} from "@/app/admin/(authed)/elever/arbeidsflate-actions";

interface StudentsListPanelProps {
  data: ArbeidsflateStudentList;
  activeSession: ArbeidsflateActiveSession;
  selectedStudentId: string | null;
}

const AVATAR_TONE_STYLES: Record<
  ArbeidsflateStudent["avatarTone"],
  { bg: string; color: string }
> = {
  accent: { bg: "linear-gradient(135deg, #D1F843, #A6C734)", color: "#0F1F18" },
  primary: { bg: "#005840", color: "#FFFFFF" },
  warning: { bg: "#C48A32", color: "#FFFFFF" },
  danger: { bg: "#B84233", color: "#FFFFFF" },
  success: { bg: "#2A7D5A", color: "#FFFFFF" },
  muted: { bg: "#1F3329", color: "rgba(255,255,255,0.6)" },
};

const STATUS_DOT_COLORS: Record<
  NonNullable<ArbeidsflateStudent["statusDot"]>,
  string
> = {
  active: "#2A7D5A",
  warning: "#C48A32",
  muted: "#A4B1AA",
};

export function StudentsListPanel({
  data,
  activeSession,
  selectedStudentId,
}: StudentsListPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"alle" | "i_dag" | "mine">("alle");

  const filterStudents = (students: ArbeidsflateStudent[]) => {
    if (!searchQuery) return students;
    const q = searchQuery.toLowerCase();
    return students.filter((s) => s.name.toLowerCase().includes(q));
  };

  return (
    <aside
      className="w-[200px] shrink-0 flex flex-col py-5 border-r"
      style={{
        background: "#0F1F18",
        color: "#FFFFFF",
        borderColor: "#1F3329",
      }}
    >
      {/* Header */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-1">
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#A4B1AA",
            }}
          >
            Aktive spillere
          </div>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              color: "#D1F843",
            }}
          >
            {data.totalActive}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="text-sm font-semibold tracking-tight">Spillere</div>
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded uppercase"
            style={{
              background: "rgba(209,248,67,0.15)",
              color: "#D1F843",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.14em",
            }}
          >
            aktiv
          </span>
        </div>
      </div>

      {/* Search + filter */}
      <div className="px-3 mb-3 space-y-2">
        <div className="relative">
          <Search
            className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2"
            style={{ color: "#A4B1AA" }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Søk spiller..."
            className="pl-8 pr-2 py-1.5 w-full text-[12px] rounded-md focus:outline-none transition-colors"
            style={{
              background: "#172B22",
              border: "1px solid #1F3329",
              color: "#FFFFFF",
            }}
          />
        </div>
        <div className="flex items-center gap-1">
          {(["alle", "i_dag", "mine"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="flex-1 px-2 py-1 rounded uppercase font-bold transition-colors"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.14em",
                background: filter === f ? "#D1F843" : "transparent",
                color: filter === f ? "#0F1F18" : "#A4B1AA",
              }}
            >
              {f === "i_dag" ? "I dag" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Sections — i dag, denne uken, oppfølging */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-0.5">
        <Section
          label={`I dag · ${data.todayStudents.length}`}
          tone="muted"
        />
        {filterStudents(data.todayStudents).map((s) => (
          <StudentRow
            key={s.id}
            student={s}
            isSelected={s.id === selectedStudentId}
          />
        ))}

        <Section
          label={`Denne uken · ${data.thisWeekStudents.length}`}
          tone="muted"
        />
        {filterStudents(data.thisWeekStudents).map((s) => (
          <StudentRow
            key={s.id}
            student={s}
            isSelected={s.id === selectedStudentId}
          />
        ))}

        {data.followupStudents.length > 0 ? (
          <>
            <Section
              label={`Oppfølging · ${data.followupStudents.length}`}
              tone="warning"
            />
            {filterStudents(data.followupStudents).map((s) => (
              <StudentRow
                key={s.id}
                student={s}
                isSelected={s.id === selectedStudentId}
              />
            ))}
          </>
        ) : null}
      </nav>

      {/* Live status footer */}
      {activeSession ? (
        <div
          className="mt-3 mx-3 p-3 rounded-xl"
          style={{
            background: "#172B22",
            border: "1px solid #1F3329",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-1.5 h-1.5 rounded-full pulse-dot"
              style={{ background: "#2A7D5A" }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#A4B1AA",
              }}
            >
              Aktiv nå
            </span>
          </div>
          <div className="font-bold text-[20px] leading-none tracking-tight">
            <span style={{ color: "#D1F843" }}>{activeSession.studentName}</span>
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              color: "#A4B1AA",
              marginTop: "8px",
            }}
          >
            {activeSession.elapsedMinutes} / {activeSession.durationMinutes} min
          </div>
        </div>
      ) : null}
    </aside>
  );
}

function Section({
  label,
  tone,
}: {
  label: string;
  tone: "muted" | "warning";
}) {
  return (
    <div className="px-2 pt-4 pb-1 flex items-center justify-between">
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: tone === "warning" ? "#C48A32" : "#A4B1AA",
          fontWeight: 700,
        }}
      >
        {label}
      </span>
      <ChevronDown className="w-3 h-3" style={{ color: "#A4B1AA" }} />
    </div>
  );
}

function StudentRow({
  student,
  isSelected,
}: {
  student: ArbeidsflateStudent;
  isSelected: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tone = AVATAR_TONE_STYLES[student.avatarTone];

  function handleClick() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("id", student.id);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <button
      onClick={handleClick}
      className="w-full text-left flex items-center gap-2.5 pl-2 pr-2 py-2 rounded-md transition-colors"
      style={{
        background: isSelected
          ? "linear-gradient(90deg, rgba(209,248,67,0.18), rgba(209,248,67,0.04) 60%, transparent)"
          : "transparent",
        borderLeft: isSelected ? "3px solid #D1F843" : "3px solid transparent",
      }}
    >
      <div className="relative shrink-0">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center font-bold"
          style={{
            background: tone.bg,
            color: tone.color,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
          }}
        >
          {student.initials}
        </div>
        {student.statusDot ? (
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
            style={{
              background: STATUS_DOT_COLORS[student.statusDot],
              border: "2px solid #0F1F18",
            }}
          />
        ) : null}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-semibold truncate">{student.name}</div>
        <div
          className="truncate"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            color: student.followupReason ? "#C48A32" : "#A4B1AA",
          }}
        >
          {student.followupReason ??
            (student.handicap !== null
              ? `HCP ${student.handicap.toFixed(1)} · ${student.timeLabel}`
              : student.timeLabel || "Ingen okter planlagt")}
        </div>
      </div>
    </button>
  );
}
