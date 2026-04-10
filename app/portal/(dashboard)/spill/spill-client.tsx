"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  MapPin,
  Users,
  Play,
  Plus,
  Search,
  ChevronRight,
  Clock,
  X,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { QuickAction } from "@/components/portal/heritage/quick-action";
import {
  type GameSessionData,
  type CourseData,
  type ChallengeData,
  createGameSession,
  joinGameSession,
  searchCourses,
} from "./actions";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";

// ─── Hjelpefunksjoner ───────────────────────────────────

function formatDate(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: nb });
  } catch {
    return dateStr;
  }
}

function getDifficultyLabel(type: string): { label: string; level: "Easy" | "Medium" | "Hard" } {
  switch (type) {
    case "STREAK":
    case "CUSTOM":
    case "SG":
      return { label: "Krevende", level: "Hard" };
    case "HANDICAP":
    case "DECADE":
    case "ROUNDS":
      return { label: "Middels", level: "Medium" };
    case "PUTTING":
    default:
      return { label: "Enkel", level: "Easy" };
  }
}

const FORMAT_LABELS: Record<string, string> = {
  STROKEPLAY: "Slagspill",
  MATCHPLAY: "Matchplay",
  STABLEFORD: "Stableford",
  SCRAMBLE: "Scramble",
};

// ─── Props ──────────────────────────────────────────────

interface SpillClientProps {
  initialSessions: GameSessionData[];
  initialCourses: CourseData[];
  initialChallenges: ChallengeData[];
}

// ─── Komponent ──────────────────────────────────────────

export default function SpillClient({
  initialSessions,
  initialCourses,
  initialChallenges,
}: SpillClientProps) {
  const [showNewGame, setShowNewGame] = useState(false);
  const [showJoinGame, setShowJoinGame] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState<string | null>(null);

  // Nytt spill-state
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [courseSearch, setCourseSearch] = useState("");
  const [searchResults, setSearchResults] = useState<CourseData[]>(initialCourses);
  const [isSearching, setIsSearching] = useState(false);
  const [newGameName, setNewGameName] = useState("");
  const [newGameFormat, setNewGameFormat] = useState("STROKEPLAY");
  const [createError, setCreateError] = useState<string | null>(null);
  const [createdSession, setCreatedSession] = useState<{
    sessionId: string;
    joinCode: string;
  } | null>(null);

  const activeSession = initialSessions.find((s) => s.isActive);
  const recentSessions = initialSessions.filter((s) => !s.isActive).slice(0, 5);

  // ─── Handlinger ─────────────────────────────────────────

  function handleCourseSearch(query: string) {
    setCourseSearch(query);
    if (query.length < 2) {
      setSearchResults(initialCourses);
      return;
    }
    setIsSearching(true);
    startTransition(async () => {
      const results = await searchCourses(query);
      setSearchResults(results);
      setIsSearching(false);
    });
  }

  function handleCreateGame() {
    if (!selectedCourse) {
      setCreateError("Velg en bane");
      return;
    }
    setCreateError(null);
    startTransition(async () => {
      const result = await createGameSession({
        courseId: selectedCourse.id,
        name: newGameName || undefined,
        format: newGameFormat,
      });
      if (result.success && result.sessionId && result.joinCode) {
        setCreatedSession({ sessionId: result.sessionId, joinCode: result.joinCode });
      } else {
        setCreateError(result.error ?? "Noe gikk galt");
      }
    });
  }

  function handleJoinGame() {
    if (!joinCode.trim()) {
      setJoinError("Skriv inn en kode");
      return;
    }
    setJoinError(null);
    startTransition(async () => {
      const result = await joinGameSession(joinCode.trim());
      if (result.success) {
        setShowJoinGame(false);
        setJoinCode("");
      } else {
        setJoinError(result.error ?? "Noe gikk galt");
      }
    });
  }

  function resetNewGameDialog() {
    setShowNewGame(false);
    setSelectedCourse(null);
    setCourseSearch("");
    setSearchResults(initialCourses);
    setNewGameName("");
    setNewGameFormat("STROKEPLAY");
    setCreateError(null);
    setCreatedSession(null);
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  // ─── Render ─────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">Spill</h1>
          <p className="text-[var(--color-muted)] mt-1">
            Start en runde, bli med i spill eller utforsk utfordringer
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowJoinGame(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-grey-300)] text-[var(--color-text)] text-sm font-medium hover:bg-[var(--color-surface)] transition-colors"
          >
            <Users className="w-4 h-4" />
            Bli med
          </button>
          <button
            onClick={() => setShowNewGame(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Nytt spill
          </button>
        </div>
      </div>

      {/* Aktivt spill */}
      {activeSession && (
        <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-grey-900)] rounded-3xl p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--color-accent-cta)] text-[var(--color-grey-900)] text-xs font-bold">
                <Clock className="w-3 h-3" />
                Aktiv
              </span>
              <h2 className="text-xl font-bold mt-3">
                {activeSession.name ?? "Aktiv runde"}
              </h2>
              <p className="text-white/70 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                {activeSession.Course?.name ?? "Ukjent bane"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-[var(--color-accent-cta)]" />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex -space-x-2">
              {activeSession.Players.map((player, i) => (
                <div
                  key={player.userId}
                  className="w-8 h-8 rounded-full bg-white/20 border-2 border-[var(--color-primary)] flex items-center justify-center text-xs font-bold"
                >
                  {player.User?.name?.[0]?.toUpperCase() ?? `S${i + 1}`}
                </div>
              ))}
            </div>
            <span className="text-sm text-white/70">
              {activeSession.Players.length} spillere
            </span>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => copyCode(activeSession.joinCode)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-sm text-white/80 hover:bg-white/20 transition-colors"
            >
              {copied === activeSession.joinCode ? (
                <Check className="w-3 h-3 text-[var(--color-accent-cta)]" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              Kode: {activeSession.joinCode}
            </button>
          </div>

          <button className="w-full py-3 rounded-xl bg-[var(--color-accent-cta)] text-[var(--color-grey-900)] font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Play className="w-4 h-4" />
            Fortsett spill
          </button>
        </div>
      )}

      {/* Ingen spill */}
      {initialSessions.length === 0 && (
        <div className="bg-[var(--color-surface)] rounded-3xl p-8 text-center">
          <Trophy className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            Ingen spill enna
          </h2>
          <p className="text-[var(--color-muted)] mt-1 text-sm">
            Start ditt forste spill eller bli med via en kode
          </p>
        </div>
      )}

      {/* Nylige spill */}
      {recentSessions.length > 0 && (
        <div>
          <h3 className="font-semibold text-[var(--color-text)] mb-4">Nylige spill</h3>
          <div className="space-y-3">
            {recentSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-4 border border-[var(--color-grey-300)]/50 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
              >
                <div>
                  <h4 className="font-medium text-[var(--color-text)]">
                    {session.name ?? "Runde"}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-[var(--color-muted)]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {session.Course?.name ?? "Ukjent bane"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {session.Players.length} spillere
                    </span>
                    <span className="text-xs">
                      {FORMAT_LABELS[session.format] ?? session.format}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[var(--color-muted)]">
                    {formatDate(session.date)}
                  </span>
                  <ChevronRight className="w-5 h-5 text-[var(--color-grey-300)] ml-auto" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Utforsk baner */}
      {initialCourses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[var(--color-text)]">Utforsk baner</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {initialCourses.slice(0, 4).map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-4 border border-[var(--color-grey-300)]/50 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-[var(--color-text)]">{course.name}</h4>
                    <p className="text-sm text-[var(--color-muted)] flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {course.location ?? "Norge"}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-[var(--color-surface)] text-xs font-medium text-[var(--color-muted)]">
                    Par {course.par}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Utfordringer */}
      {initialChallenges.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-[var(--color-grey-300)]/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[var(--color-warning)]" />
              <h3 className="font-semibold text-[var(--color-text)]">Utfordringer</h3>
            </div>
            <span className="text-xs text-[var(--color-muted)]">
              {initialChallenges.length} aktive
            </span>
          </div>
          <div className="space-y-3">
            {initialChallenges.map((challenge) => {
              const { label, level } = getDifficultyLabel(challenge.type);
              return (
                <div
                  key={challenge.id}
                  className="p-4 rounded-xl bg-[var(--color-surface)] flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-[var(--color-text)]">
                        {challenge.title}
                      </h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          level === "Easy"
                            ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                            : level === "Medium"
                              ? "bg-[var(--color-warning)]/10 text-[var(--color-warning)]"
                              : "bg-[var(--color-error)]/10 text-[var(--color-error)]"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-muted)] mt-1">
                      {challenge.metric}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-[var(--color-primary)]">
                      {challenge._participantCount} deltakere
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <QuickAction href="#" icon={Search} label="Finn spillere" description="Sok etter venner" />
        <QuickAction href="#" icon={MapPin} label="Bane-database" description="Se alle baner" />
        <QuickAction href="#" icon={Trophy} label="Leaderboard" description="Se topplisten" />
      </div>

      {/* ─── Nytt spill-dialog ─────────────────────────────── */}
      {showNewGame && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            {createdSession ? (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-[var(--color-success)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
                  Spill opprettet
                </h3>
                <p className="text-[var(--color-muted)] mb-4">
                  Del koden med andre for aa bli med
                </p>
                <div className="bg-[var(--color-surface)] rounded-xl p-4 mb-6">
                  <p className="text-xs text-[var(--color-muted)] mb-1">Delekode</p>
                  <p className="text-3xl font-bold tracking-widest text-[var(--color-primary)]">
                    {createdSession.joinCode}
                  </p>
                </div>
                <button
                  onClick={resetNewGameDialog}
                  className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Ferdig
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[var(--color-text)]">
                    Start nytt spill
                  </h3>
                  <button
                    onClick={resetNewGameDialog}
                    className="p-1 rounded-lg hover:bg-[var(--color-surface)]"
                  >
                    <X className="w-5 h-5 text-[var(--color-muted)]" />
                  </button>
                </div>

                {/* Banesok */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                    Velg bane
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
                    <input
                      type="text"
                      placeholder="Sok etter bane..."
                      value={courseSearch}
                      onChange={(e) => handleCourseSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-grey-300)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)] animate-spin" />
                    )}
                  </div>
                  {selectedCourse && (
                    <div className="mt-2 flex items-center gap-2 bg-[var(--color-surface)] rounded-lg px-3 py-2">
                      <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                      <span className="text-sm font-medium text-[var(--color-text)]">
                        {selectedCourse.name}
                      </span>
                      <button
                        onClick={() => setSelectedCourse(null)}
                        className="ml-auto"
                      >
                        <X className="w-4 h-4 text-[var(--color-muted)]" />
                      </button>
                    </div>
                  )}
                  {!selectedCourse && searchResults.length > 0 && (
                    <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-[var(--color-grey-300)] divide-y divide-[var(--color-grey-300)]/50">
                      {searchResults.map((course) => (
                        <button
                          key={course.id}
                          onClick={() => {
                            setSelectedCourse(course);
                            setCourseSearch("");
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-[var(--color-surface)] transition-colors text-sm"
                        >
                          <span className="font-medium text-[var(--color-text)]">
                            {course.name}
                          </span>
                          <span className="text-[var(--color-muted)] ml-2">
                            Par {course.par}
                            {course.location ? ` — ${course.location}` : ""}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Spillnavn */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                    Navn (valgfritt)
                  </label>
                  <input
                    type="text"
                    placeholder="F.eks. Lordagsrunde"
                    value={newGameName}
                    onChange={(e) => setNewGameName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-grey-300)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                  />
                </div>

                {/* Format */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Format
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(FORMAT_LABELS).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => setNewGameFormat(value)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          newGameFormat === value
                            ? "bg-[var(--color-primary)] text-white"
                            : "bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-grey-300)]/50"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {createError && (
                  <p className="text-sm text-[var(--color-error)] mb-4">{createError}</p>
                )}

                <button
                  onClick={handleCreateGame}
                  disabled={isPending || !selectedCourse}
                  className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  Opprett spill
                </button>
                <button
                  onClick={resetNewGameDialog}
                  className="w-full mt-3 py-3 rounded-xl border border-[var(--color-grey-300)] text-[var(--color-muted)] hover:bg-[var(--color-surface)] transition-colors"
                >
                  Avbryt
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}

      {/* ─── Bli med-dialog ────────────────────────────────── */}
      {showJoinGame && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 w-full max-w-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[var(--color-text)]">Bli med i spill</h3>
              <button
                onClick={() => {
                  setShowJoinGame(false);
                  setJoinCode("");
                  setJoinError(null);
                }}
                className="p-1 rounded-lg hover:bg-[var(--color-surface)]"
              >
                <X className="w-5 h-5 text-[var(--color-muted)]" />
              </button>
            </div>

            <p className="text-sm text-[var(--color-muted)] mb-4">
              Skriv inn den 6-sifrede koden fra spilleren som opprettet spillet.
            </p>

            <input
              type="text"
              placeholder="F.eks. ABC123"
              value={joinCode}
              onChange={(e) => {
                setJoinCode(e.target.value.toUpperCase().slice(0, 6));
                setJoinError(null);
              }}
              maxLength={6}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-grey-300)] text-center text-2xl font-bold tracking-[0.3em] uppercase focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
            />

            {joinError && (
              <p className="text-sm text-[var(--color-error)] mt-2">{joinError}</p>
            )}

            <button
              onClick={handleJoinGame}
              disabled={isPending || joinCode.length < 4}
              className="w-full mt-4 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Users className="w-4 h-4" />
              )}
              Bli med
            </button>
            <button
              onClick={() => {
                setShowJoinGame(false);
                setJoinCode("");
                setJoinError(null);
              }}
              className="w-full mt-3 py-3 rounded-xl border border-[var(--color-grey-300)] text-[var(--color-muted)] hover:bg-[var(--color-surface)] transition-colors"
            >
              Avbryt
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
