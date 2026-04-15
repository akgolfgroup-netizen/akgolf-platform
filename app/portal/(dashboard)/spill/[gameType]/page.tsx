"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Save, ChevronLeft, Flame, Target, Disc, Trophy } from "lucide-react";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const EASE_APPLE: [number, number, number, number] = [0.4, 0, 0.2, 1];

const GAME_META: Record<
  string,
  { title: string; icon: React.ElementType; color: string; bg: string; apiType: string }
> = {
  naerspill: { title: "Nærspill", icon: Target, color: "#007AFF", bg: "#EFF6FF", apiType: "NEAR_GAME" },
  putting: { title: "Putting", icon: Disc, color: "#1A4D36", bg: "#E8F5EF", apiType: "PUTTING_GAME" },
  press: { title: "Press", icon: Flame, color: "#C48A32", bg: "#FDF4E4", apiType: "PRESSURE_GAME" },
};

export default function GameSessionPage() {
  const { gameType } = useParams<{ gameType: string }>();
  const meta = GAME_META[gameType] ?? GAME_META.naerspill;

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(0);
  const [distance, setDistance] = useState("");
  const [result, setResult] = useState("");
  const [notes, setNotes] = useState("");
  const [pressure, setPressure] = useState(1);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(true);

  useEffect(() => {
    async function createSession() {
      try {
        const res = await fetch("/api/portal/ai/games", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameType: meta.apiType,
            pressureLevel: pressure,
            displayName: meta.title,
          }),
        });
        const data = await res.json();
        if (res.ok && data.sessionId) {
          setSessionId(data.sessionId);
        }
      } finally {
        setCreating(false);
      }
    }
    createSession();
  }, [meta.apiType, meta.title, pressure]);

  async function handleLogShot() {
    if (!sessionId) return;
    const base = result.toLowerCase().includes("hit") || result.toLowerCase().includes("in")
      ? 10
      : 5;
    setScore((s) => s + base);
    setShots((s) => s + 1);

    await fetch("/api/portal/ai/games/shots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        club: meta.title,
        distance: distance ? parseFloat(distance) : null,
        result,
        notes,
        pressureLevel: pressure,
      }),
    });

    setDistance("");
    setResult("");
    setNotes("");
  }

  async function handleFinish() {
    setSaving(true);
    await new Promise((res) => setTimeout(res, 400));
    setSaving(false);
    setFinished(true);
  }

  if (finished) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <PremiumCard padding="lg" radius="large" variant="featured">
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: meta.bg }}
            >
              <Trophy className="w-8 h-8" style={{ color: meta.color }} />
            </div>
            <h2 className="text-xl font-bold text-black mb-1">Økt fullført</h2>
            <p className="text-sm text-grey-400">{meta.title}</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-grey-50 rounded-xl p-4">
                <p className="text-xs text-grey-400">Slag</p>
                <p className="text-2xl font-bold text-black">{shots}</p>
              </div>
              <div className="bg-grey-50 rounded-xl p-4">
                <p className="text-xs text-grey-400">Poeng</p>
                <p className="text-2xl font-bold text-black">{score}</p>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="primary" className="w-full" asChild>
                <Link href="/portal/spill">Tilbake til spill-modul</Link>
              </Button>
            </div>
          </div>
        </PremiumCard>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_APPLE }}
        className="flex items-center gap-3"
      >
        <Link
          href="/portal/spill"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white border border-grey-200 text-black hover:bg-grey-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: meta.bg }}
          >
            <meta.icon className="w-5 h-5" style={{ color: meta.color }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">{meta.title}</h1>
            <p className="text-grey-400 text-sm">Live økt</p>
          </div>
        </div>
      </motion.div>

      {creating && (
        <PremiumCard padding="md" radius="large">
          <p className="text-sm text-grey-400">Oppretter økt...</p>
        </PremiumCard>
      )}

      {/* Scoreboard */}
      <div className="grid grid-cols-2 gap-4">
        <PremiumCard padding="md" radius="large" noHover>
          <p className="text-xs text-grey-400">Slag logget</p>
          <p className="text-3xl font-bold text-black tabular-nums">{shots}</p>
        </PremiumCard>
        <PremiumCard padding="md" radius="large" noHover>
          <p className="text-xs text-grey-400">Poeng</p>
          <p className="text-3xl font-bold text-black tabular-nums">{score}</p>
        </PremiumCard>
      </div>

      {/* Shot input */}
      <PremiumCard delay={0.1} padding="md" radius="large">
        <h3 className="text-sm font-semibold text-black mb-4">Registrer slag</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-grey-400 mb-1.5">
                Avstand (m)
              </label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="F.eks. 12"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white border border-grey-200 text-black placeholder:text-grey-300 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-grey-400 mb-1.5">
                Resultat
              </label>
              <input
                type="text"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="F.eks. Inne 1m"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white border border-grey-200 text-black placeholder:text-grey-300 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-grey-400 mb-1.5">
              Notater
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="F.eks. Litt rask i nedswing"
              className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white border border-grey-200 text-black placeholder:text-grey-300 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-grey-400">
                Pressnivå
              </label>
              <span className="text-sm font-semibold text-black">PR{pressure}</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((pr) => (
                <button
                  key={pr}
                  onClick={() => setPressure(pr)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    pressure === pr
                      ? "bg-black text-white"
                      : "bg-grey-50 text-black hover:bg-grey-50"
                  }`}
                >
                  PR{pr}
                </button>
              ))}
            </div>
          </div>
          <Button
            variant="primary"
            className="w-full"
            onClick={handleLogShot}
            disabled={!distance && !result || creating || !sessionId}
          >
            Logg slag
          </Button>
        </div>
      </PremiumCard>

      {/* Finish */}
      <Button
        variant="secondary"
        className="w-full"
        onClick={handleFinish}
        isLoading={saving}
      >
        <Save className="w-4 h-4 mr-2" />
        Avslutt økt
      </Button>
    </div>
  );
}
