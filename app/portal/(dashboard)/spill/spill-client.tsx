"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Users,
  QrCode,
  Copy,
  Check,
  Trophy,
  Clock,
  MapPin,
} from "lucide-react";

interface GameSessionItem {
  id: string;
  name: string | null;
  courseName: string;
  coursePar: number;
  date: string;
  format: string;
  joinCode: string;
  isActive: boolean;
  playerCount: number;
  players: Array<{ id: string; name: string }>;
  roundCount: number;
  isCreator: boolean;
}

interface CourseOption {
  id: string;
  name: string;
  location: string | null;
  par: number;
}

interface Props {
  sessions: GameSessionItem[];
  courses: CourseOption[];
  currentUserId: string;
}

const FORMAT_LABELS: Record<string, string> = {
  STROKEPLAY: "Slagspill",
  STABLEFORD: "Stableford",
  MATCHPLAY: "Matchplay",
  BESTBALL: "Best Ball",
  SCRAMBLE: "Scramble",
};

export function SpillClient({ sessions, courses, currentUserId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Opprett ny spillokt
  const [selectedCourse, setSelectedCourse] = useState("");
  const [format, setFormat] = useState("STROKEPLAY");
  const [sessionName, setSessionName] = useState("");

  function handleCreate() {
    if (!selectedCourse) return;
    setError("");

    startTransition(async () => {
      const res = await fetch("/api/portal/game-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourse,
          format,
          name: sessionName || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.refresh();
        setShowCreate(false);
      } else {
        setError(data.error ?? "Feil ved opprettelse");
      }
    });
  }

  function handleJoin() {
    if (joinCode.length < 4) return;
    setError("");

    startTransition(async () => {
      const res = await fetch("/api/portal/game-session/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ joinCode }),
      });
      const data = await res.json();
      if (res.ok) {
        router.refresh();
        setShowJoin(false);
        setJoinCode("");
      } else {
        setError(data.error ?? "Feil ved tilkobling");
      }
    });
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  const activeSessions = sessions.filter((s) => s.isActive);
  const pastSessions = sessions.filter((s) => !s.isActive);

  return (
    <div className="space-y-6">
      {/* Handlinger */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => { setShowCreate(true); setShowJoin(false); }}
          className="flex flex-col items-center gap-2 p-6 rounded-2xl border-2 border-dashed border-[var(--color-grey-200)] hover:border-[var(--color-brand)] hover:bg-[var(--color-brand)]/5 transition-all"
        >
          <Play className="h-8 w-8 text-[var(--color-brand)]" />
          <span className="text-sm font-semibold text-[var(--color-grey-900)]">
            Opprett runde
          </span>
        </button>
        <button
          onClick={() => { setShowJoin(true); setShowCreate(false); }}
          className="flex flex-col items-center gap-2 p-6 rounded-2xl border-2 border-dashed border-[var(--color-grey-200)] hover:border-[var(--color-brand)] hover:bg-[var(--color-brand)]/5 transition-all"
        >
          <QrCode className="h-8 w-8 text-[var(--color-brand)]" />
          <span className="text-sm font-semibold text-[var(--color-grey-900)]">
            Bli med (kode)
          </span>
        </button>
      </div>

      {/* Opprett */}
      {showCreate && (
        <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-6 space-y-4">
          <h2 className="font-semibold text-[var(--color-grey-900)]">Ny gruppe-runde</h2>
          <input
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="Navn (valgfritt)"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-grey-200)] text-sm"
          />
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-grey-200)] text-sm bg-white"
          >
            <option value="">Velg bane...</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} (par {c.par})
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            {Object.entries(FORMAT_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFormat(key)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                  format === key
                    ? "bg-[var(--color-brand)] text-white"
                    : "bg-[var(--color-grey-100)] text-[var(--color-grey-600)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={handleCreate}
            disabled={!selectedCourse || isPending}
            className="w-full py-3 rounded-xl bg-[var(--color-brand)] text-white font-semibold disabled:opacity-50"
          >
            {isPending ? "Oppretter..." : "Opprett runde"}
          </button>
        </div>
      )}

      {/* Bli med */}
      {showJoin && (
        <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-6 space-y-4">
          <h2 className="font-semibold text-[var(--color-grey-900)]">Bli med via kode</h2>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Skriv inn 6-tegn kode"
            maxLength={6}
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-grey-200)] text-center text-2xl font-mono tracking-widest uppercase"
          />
          <button
            onClick={handleJoin}
            disabled={joinCode.length < 4 || isPending}
            className="w-full py-3 rounded-xl bg-[var(--color-brand)] text-white font-semibold disabled:opacity-50"
          >
            {isPending ? "Kobler til..." : "Bli med"}
          </button>
        </div>
      )}

      {error && (
        <div className="text-sm text-[var(--color-error)] bg-[var(--color-error)]/10 rounded-xl p-3">
          {error}
        </div>
      )}

      {/* Aktive spillokter */}
      {activeSessions.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[var(--color-grey-700)] mb-3">
            Aktive runder
          </h2>
          <div className="space-y-3">
            {activeSessions.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-xl border border-[var(--color-brand)] p-4 cursor-pointer hover:bg-[var(--color-brand)]/5 transition-colors"
                onClick={() => router.push(`/portal/runde/${s.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[var(--color-grey-900)]">
                      {s.name ?? s.courseName}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--color-grey-500)] mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {s.courseName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {s.playerCount} spillere
                      </span>
                      <span>{FORMAT_LABELS[s.format]}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); copyCode(s.joinCode); }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--color-grey-100)] text-xs font-mono"
                  >
                    {copied === s.joinCode ? (
                      <Check className="h-3 w-3 text-[var(--color-success)]" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {s.joinCode}
                  </button>
                </div>
                <div className="flex gap-2 mt-2">
                  {s.players.map((p) => (
                    <span
                      key={p.id}
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        p.id === currentUserId
                          ? "bg-[var(--color-brand)]/10 text-[var(--color-brand)]"
                          : "bg-[var(--color-grey-100)] text-[var(--color-grey-600)]"
                      }`}
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tidligere */}
      {pastSessions.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[var(--color-grey-700)] mb-3">
            Tidligere runder
          </h2>
          <div className="space-y-2">
            {pastSessions.map((s) => (
              <div key={s.id} className="bg-white rounded-xl border border-[var(--color-grey-200)] p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[var(--color-grey-900)]">
                    {s.name ?? s.courseName}
                  </div>
                  <div className="text-xs text-[var(--color-grey-400)]">
                    {new Date(s.date).toLocaleDateString("nb-NO")} — {s.playerCount} spillere — {FORMAT_LABELS[s.format]}
                  </div>
                </div>
                <Trophy className="h-4 w-4 text-[var(--color-grey-300)]" />
              </div>
            ))}
          </div>
        </div>
      )}

      {sessions.length === 0 && !showCreate && !showJoin && (
        <div className="text-center py-12 text-[var(--color-grey-400)]">
          <Users className="h-12 w-12 mx-auto mb-4 text-[var(--color-grey-300)]" />
          <p className="text-sm">Ingen spillokter enna</p>
          <p className="text-xs mt-1">Opprett en runde eller bli med via kode</p>
        </div>
      )}
    </div>
  );
}
