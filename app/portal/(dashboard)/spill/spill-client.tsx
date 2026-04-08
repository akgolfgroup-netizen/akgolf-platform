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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1c16]">Spill</h1>
          <p className="text-[#6b7366] mt-1">Start en runde, bli med i spill eller utforsk utfordringer</p>
        </div>
      </div>

      {/* Handlinger */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => { setShowCreate(true); setShowJoin(false); }}
          className="flex flex-col items-center gap-2 p-6 rounded-2xl border-2 border-dashed border-[#c2c9bb]/50 hover:border-[#154212] hover:bg-[#154212]/5 transition-all bg-white"
        >
          <Play className="h-8 w-8 text-[#154212]" />
          <span className="text-sm font-semibold text-[#1c1c16]">
            Opprett runde
          </span>
        </button>
        <button
          onClick={() => { setShowJoin(true); setShowCreate(false); }}
          className="flex flex-col items-center gap-2 p-6 rounded-2xl border-2 border-dashed border-[#c2c9bb]/50 hover:border-[#154212] hover:bg-[#154212]/5 transition-all bg-white"
        >
          <QrCode className="h-8 w-8 text-[#154212]" />
          <span className="text-sm font-semibold text-[#1c1c16]">
            Bli med (kode)
          </span>
        </button>
      </div>

      {/* Opprett */}
      {showCreate && (
        <div className="bg-white rounded-2xl border border-[#c2c9bb]/50 p-6 space-y-4 shadow-sm">
          <h2 className="font-semibold text-[#1c1c16]">Ny gruppe-runde</h2>
          <input
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="Navn (valgfritt)"
            className="w-full px-4 py-2.5 rounded-xl border border-[#c2c9bb]/50 text-sm bg-[#f7f3ea] outline-none focus:border-[#154212]"
          />
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[#c2c9bb]/50 text-sm bg-white outline-none focus:border-[#154212]"
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
                    ? "bg-[#154212] text-white"
                    : "bg-[#f7f3ea] text-[#6b7366]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={handleCreate}
            disabled={!selectedCourse || isPending}
            className="w-full py-3 rounded-xl bg-[#d2f000] text-[#154212] font-semibold disabled:opacity-50 hover:bg-[#b8d600] transition-colors"
          >
            {isPending ? "Oppretter..." : "Opprett runde"}
          </button>
        </div>
      )}

      {/* Bli med */}
      {showJoin && (
        <div className="bg-white rounded-2xl border border-[#c2c9bb]/50 p-6 space-y-4 shadow-sm">
          <h2 className="font-semibold text-[#1c1c16]">Bli med via kode</h2>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Skriv inn 6-tegn kode"
            maxLength={6}
            className="w-full px-4 py-3 rounded-xl border border-[#c2c9bb]/50 text-center text-2xl font-mono tracking-widest uppercase bg-[#f7f3ea] outline-none focus:border-[#154212]"
          />
          <button
            onClick={handleJoin}
            disabled={joinCode.length < 4 || isPending}
            className="w-full py-3 rounded-xl bg-[#d2f000] text-[#154212] font-semibold disabled:opacity-50 hover:bg-[#b8d600] transition-colors"
          >
            {isPending ? "Kobler til..." : "Bli med"}
          </button>
        </div>
      )}

      {error && (
        <div className="text-sm text-[#ef4444] bg-[#ef4444]/10 rounded-xl p-3">
          {error}
        </div>
      )}

      {/* Aktive spillokter */}
      {activeSessions.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[#154212] mb-3">
            Aktive runder
          </h2>
          <div className="space-y-3">
            {activeSessions.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-xl border border-[#154212]/30 p-4 cursor-pointer hover:bg-[#154212]/5 transition-colors shadow-sm"
                onClick={() => router.push(`/portal/runde/${s.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#1c1c16]">
                      {s.name ?? s.courseName}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#6b7366] mt-1">
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
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#f7f3ea] text-xs font-mono text-[#42493e]"
                  >
                    {copied === s.joinCode ? (
                      <Check className="h-3 w-3 text-[#22c55e]" />
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
                          ? "bg-[#154212]/10 text-[#154212]"
                          : "bg-[#f7f3ea] text-[#6b7366]"
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
          <h2 className="text-sm font-semibold text-[#154212] mb-3">
            Tidligere runder
          </h2>
          <div className="space-y-2">
            {pastSessions.map((s) => (
              <div key={s.id} className="bg-white rounded-xl border border-[#c2c9bb]/50 p-3 flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-sm font-medium text-[#1c1c16]">
                    {s.name ?? s.courseName}
                  </div>
                  <div className="text-xs text-[#8a9385]">
                    {new Date(s.date).toLocaleDateString("nb-NO")} — {s.playerCount} spillere — {FORMAT_LABELS[s.format]}
                  </div>
                </div>
                <Trophy className="h-4 w-4 text-[#d2f000]" />
              </div>
            ))}
          </div>
        </div>
      )}

      {sessions.length === 0 && !showCreate && !showJoin && (
        <div className="text-center py-12 text-[#8a9385]">
          <Users className="h-12 w-12 mx-auto mb-4 text-[#c2c9bb]" />
          <p className="text-sm">Ingen spillokter enna</p>
          <p className="text-xs mt-1">Opprett en runde eller bli med via kode</p>
        </div>
      )}
    </div>
  );
}
