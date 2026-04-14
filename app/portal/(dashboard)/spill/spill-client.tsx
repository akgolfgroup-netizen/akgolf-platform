"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
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
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
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

function getDifficultyLabel(type: string): { label: string; color: string } {
  switch (type) {
    case "STREAK":
    case "CUSTOM":
    case "SG":
      return { label: "Krevende", color: "text-error" };
    case "HANDICAP":
    case "DECADE":
    case "ROUNDS":
      return { label: "Middels", color: "text-purple-500" };
    case "PUTTING":
    default:
      return { label: "Enkel", color: "text-success" };
  }
}

const FORMAT_LABELS: Record<string, string> = {
  STROKEPLAY: "Slagspill",
  MATCHPLAY: "Matchplay",
  STABLEFORD: "Stableford",
  BESTBALL: "Best Ball",
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
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-grey-400">Spillerportal</p>
          <h1 className="mt-1 text-[28px] font-bold tracking-tight text-black">Spill</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowJoinGame(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-grey-200 bg-white text-black text-sm font-medium hover:border-grey-300 transition-colors"
          >
            <Users className="w-4 h-4" />
            Bli med
          </button>
          <button
            onClick={() => setShowNewGame(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cta text-black text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Nytt spill
          </button>
        </div>
      </div>

      {/* Aktivt spill */}
      {activeSession && (
        <PremiumCard className="!p-6 bg-white border border-grey-200 rounded-xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent-cta text-black text-xs font-bold">
                <Clock className="w-3 h-3" />
                Aktiv
              </span>
              <h2 className="text-xl font-bold mt-3 text-black">
                {activeSession.name ?? "Aktiv runde"}
              </h2>
              <p className="text-grey-400 flex items-center gap-1 mt-1 text-sm">
                <MapPin className="w-4 h-4" />
                {activeSession.Course.name}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-black/10 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-black" />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex -space-x-2">
              {activeSession.Players.map((player, i) => (
                <div
                  key={player.userId}
                  className="w-8 h-8 rounded-full bg-[#F5F8F7] border-2 border-white flex items-center justify-center text-xs font-bold text-black"
                >
                  {player.User?.name?.[0]?.toUpperCase() ?? `S${i + 1}`}
                </div>
              ))}
            </div>
            <span className="text-sm text-grey-400">
              {activeSession.Players.length} spillere
            </span>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => copyCode(activeSession.joinCode)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F8F7] text-sm text-grey-400 hover:text-black transition-colors"
            >
              {copied === activeSession.joinCode ? (
                <Check className="w-3 h-3 text-success" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              Kode: {activeSession.joinCode}
            </button>
          </div>

          <button className="w-full py-3 rounded-full bg-accent-cta text-black font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Play className="w-4 h-4" />
            Fortsett spill
          </button>
        </PremiumCard>
      )}

      {/* Ingen spill */}
      {initialSessions.length === 0 && (
        <PremiumCard className="!p-8 text-center bg-white border border-grey-200 rounded-xl">
          <Trophy className="w-12 h-12 text-grey-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-black">
            Ingen spill ennå
          </h2>
          <p className="text-grey-400 mt-1 text-sm">
            Start ditt første spill eller bli med via en kode
          </p>
        </PremiumCard>
      )}

      {/* Nylige spill */}
      {recentSessions.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-grey-400 mb-4">
            Nylige spill
          </p>
          <div className="space-y-3">
            {recentSessions.map((session, index) => (
              <PremiumCard key={session.id} delay={index * 0.1} className="!p-4 bg-white border border-grey-200 rounded-xl hover:border-grey-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-black">
                      {session.name ?? "Runde"}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-sm text-grey-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {session.Course.name}
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
                  <div className="text-right flex items-center gap-2">
                    <span className="text-xs text-grey-400">
                      {formatDate(session.date)}
                    </span>
                    <ChevronRight className="w-5 h-5 text-grey-400" />
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>
        </div>
      )}

      {/* Utforsk baner */}
      {initialCourses.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-grey-400 mb-4">
            Utforsk baner
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {initialCourses.slice(0, 4).map((course, index) => (
              <PremiumCard key={course.id} delay={index * 0.1} className="!p-4 bg-white border border-grey-200 rounded-xl hover:border-grey-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-black">{course.name}</h4>
                    <p className="text-sm text-grey-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {course.location ?? "Norge"}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-[#F5F8F7] text-xs font-medium text-grey-400">
                    Par {course.par}
                  </span>
                </div>
              </PremiumCard>
            ))}
          </div>
        </div>
      )}

      {/* Utfordringer */}
      {initialChallenges.length > 0 && (
        <PremiumCard className="!p-6 bg-white border border-grey-200 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-purple-500" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-grey-400">
                Utfordringer
              </p>
            </div>
            <span className="text-xs text-grey-400">
              {initialChallenges.length} aktive
            </span>
          </div>
          <div className="space-y-3">
            {initialChallenges.map((challenge) => {
              const { label, color } = getDifficultyLabel(challenge.type);
              return (
                <div
                  key={challenge.id}
                  className="p-4 rounded-xl bg-[#F5F8F7] flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-black">
                        {challenge.title}
                      </h4>
                      <span className={`text-[10px] font-semibold uppercase tracking-[0.08em] ${color}`}>
                        {label}
                      </span>
                    </div>
                    <p className="text-xs text-grey-400 mt-1">
                      {challenge.metric}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-black">
                      {challenge._participantCount} deltakere
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </PremiumCard>
      )}

      {/* Hurtiglenker */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/portal/sosialt"
          className="flex items-center gap-3 rounded-xl bg-white border border-grey-200 p-4 text-sm font-medium text-black hover:border-grey-300 transition-colors shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F5F8F7] flex items-center justify-center flex-shrink-0">
            <Search className="w-5 h-5 text-grey-400" />
          </div>
          <div>
            <p className="font-semibold text-sm text-black">Finn spillere</p>
            <p className="text-xs text-grey-400 mt-0.5">Søk etter venner</p>
          </div>
        </Link>
        <Link
          href="/portal/spill"
          className="flex items-center gap-3 rounded-xl bg-white border border-grey-200 p-4 text-sm font-medium text-black hover:border-grey-300 transition-colors shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F5F8F7] flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-grey-400" />
          </div>
          <div>
            <p className="font-semibold text-sm text-black">Banedatabase</p>
            <p className="text-xs text-grey-400 mt-0.5">Se alle baner</p>
          </div>
        </Link>
        <Link
          href="/portal/spill"
          className="flex items-center gap-3 rounded-xl bg-white border border-grey-200 p-4 text-sm font-medium text-black hover:border-grey-300 transition-colors shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F5F8F7] flex items-center justify-center flex-shrink-0">
            <Trophy className="w-5 h-5 text-grey-400" />
          </div>
          <div>
            <p className="font-semibold text-sm text-black">Toppliste</p>
            <p className="text-xs text-grey-400 mt-0.5">Se topplisten</p>
          </div>
        </Link>
      </div>

      {/* ─── Nytt spill-dialog ─────────────────────────────── */}
      {showNewGame && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[70]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg border border-grey-200"
          >
            {createdSession ? (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#1A4D36]/10 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">
                  Spill opprettet
                </h3>
                <p className="text-grey-400 mb-4">
                  Del koden med andre for å bli med
                </p>
                <div className="bg-[#F5F8F7] rounded-xl p-4 mb-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-grey-400 mb-1">Delekode</p>
                  <p className="text-3xl font-bold tracking-widest text-black">
                    {createdSession.joinCode}
                  </p>
                </div>
                <button
                  onClick={resetNewGameDialog}
                  className="w-full py-3 rounded-full bg-accent-cta text-black font-semibold hover:opacity-90 transition-opacity"
                >
                  Ferdig
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-black">
                    Start nytt spill
                  </h3>
                  <button
                    onClick={resetNewGameDialog}
                    className="p-1 rounded-lg hover:bg-[#F5F8F7]"
                  >
                    <X className="w-5 h-5 text-grey-400" />
                  </button>
                </div>

                {/* Banesøk */}
                <div className="mb-4">
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-grey-400 mb-2">
                    Velg bane
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400" />
                    <input
                      type="text"
                      placeholder="Søk etter bane..."
                      value={courseSearch}
                      onChange={(e) => handleCourseSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-grey-200 bg-white text-sm text-black placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-[#0A1F18]/10 focus:border-[#A5B2AD]"
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400 animate-spin" />
                    )}
                  </div>
                  {selectedCourse && (
                    <div className="mt-2 flex items-center gap-2 bg-[#F5F8F7] rounded-lg px-3 py-2">
                      <MapPin className="w-4 h-4 text-black" />
                      <span className="text-sm font-medium text-black">
                        {selectedCourse.name}
                      </span>
                      <button
                        onClick={() => setSelectedCourse(null)}
                        className="ml-auto"
                      >
                        <X className="w-4 h-4 text-grey-400" />
                      </button>
                    </div>
                  )}
                  {!selectedCourse && searchResults.length > 0 && (
                    <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-grey-200 divide-y divide-[#D5DFDB]">
                      {searchResults.map((course) => (
                        <button
                          key={course.id}
                          onClick={() => {
                            setSelectedCourse(course);
                            setCourseSearch("");
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-[#F5F8F7] transition-colors text-sm"
                        >
                          <span className="font-medium text-black">
                            {course.name}
                          </span>
                          <span className="text-grey-400 ml-2">
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
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-grey-400 mb-2">
                    Navn (valgfritt)
                  </label>
                  <input
                    type="text"
                    placeholder="F.eks. Lørdagsrunde"
                    value={newGameName}
                    onChange={(e) => setNewGameName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-grey-200 bg-white text-sm text-black placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-[#0A1F18]/10 focus:border-[#A5B2AD]"
                  />
                </div>

                {/* Format */}
                <div className="mb-6">
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-grey-400 mb-2">
                    Format
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(FORMAT_LABELS).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => setNewGameFormat(value)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          newGameFormat === value
                            ? "bg-[#0A1F18] text-white"
                            : "bg-[#F5F8F7] text-black hover:bg-[#D5DFDB]/50"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {createError && (
                  <p className="text-sm text-error mb-4">{createError}</p>
                )}

                <button
                  onClick={handleCreateGame}
                  disabled={isPending || !selectedCourse}
                  className="w-full py-3 rounded-full bg-accent-cta text-black font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
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
                  className="w-full mt-3 py-3 rounded-full border border-grey-200 bg-white text-grey-400 hover:border-grey-300 hover:text-black transition-colors"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[70]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg border border-grey-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-black">Bli med i spill</h3>
              <button
                onClick={() => {
                  setShowJoinGame(false);
                  setJoinCode("");
                  setJoinError(null);
                }}
                className="p-1 rounded-lg hover:bg-[#F5F8F7]"
              >
                <X className="w-5 h-5 text-grey-400" />
              </button>
            </div>

            <p className="text-sm text-grey-400 mb-4">
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
              className="w-full px-4 py-3 rounded-xl border border-grey-200 bg-white text-center text-2xl font-bold tracking-[0.3em] uppercase text-black placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-[#0A1F18]/10 focus:border-[#A5B2AD]"
            />

            {joinError && (
              <p className="text-sm text-error mt-2">{joinError}</p>
            )}

            <button
              onClick={handleJoinGame}
              disabled={isPending || joinCode.length < 4}
              className="w-full mt-4 py-3 rounded-full bg-accent-cta text-black font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
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
              className="w-full mt-3 py-3 rounded-full border border-grey-200 bg-white text-grey-400 hover:border-grey-300 hover:text-black transition-colors"
            >
              Avbryt
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
