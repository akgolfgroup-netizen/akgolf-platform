"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Cloud, Wind, MapPin, Search, Play, ChevronLeft, Sun } from "lucide-react";
import { startRound } from "../actions";

interface Course {
  id: string;
  name: string;
  location: string | null;
  par: number;
  courseRating: number | null;
  slopeRating: number | null;
}

export function StartRoundClient({ courses }: { courses: Course[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [teeColor, setTeeColor] = useState("yellow");
  const [weather, setWeather] = useState("");
  const [error, setError] = useState("");

  const filtered = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.location?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  function handleStart() {
    if (!selectedCourse) return;
    setError("");
    startTransition(async () => {
      try {
        const result = await startRound(selectedCourse.id, teeColor, weather || undefined);
        router.push(`/portal/runde/${result.roundId}/live`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Feil ved oppstart av runde");
      }
    });
  }

  const teeColors = [
    { value: "yellow", label: "Gul", color: "#EAB308" },
    { value: "white", label: "Hvit", color: "#FFFFFF" },
    { value: "blue", label: "Blå", color: "#3B82F6" },
    { value: "red", label: "Rød", color: "#EF4444" },
  ];

  return (
    <div className="bg-card border border-line rounded-2xl p-5 lg:p-6 shadow-card">
      <div className="space-y-6">
        {!selectedCourse ? (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Søk etter bane..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-line bg-surface text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                autoFocus
              />
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {filtered.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className="w-full text-left p-4 rounded-xl border border-line bg-surface hover:border-primary hover:bg-surface-soft transition-all min-h-[44px]"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-ink mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-ink">{course.name}</div>
                      <div className="text-sm text-ink-muted tabular-nums">
                        {course.location} — Par <span className="tabular-nums">{course.par}</span>
                        {course.courseRating && ` — CR ${course.courseRating}`}
                        {course.slopeRating && ` / Slope ${course.slopeRating}`}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-ink-subtle py-8">Ingen baner funnet</p>
              )}
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => setSelectedCourse(null)}
              className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Tilbake til baner
            </button>

            <div className="p-4 rounded-xl border border-line bg-surface">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-ink" />
                <div>
                  <div className="font-semibold text-ink">{selectedCourse.name}</div>
                  <div className="text-sm text-ink-muted tabular-nums">
                    Par <span className="tabular-nums">{selectedCourse.par}</span> — {selectedCourse.location}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-ink mb-2 block">Tee</label>
              <div className="flex flex-wrap gap-2">
                {teeColors.map((tee) => (
                  <button
                    key={tee.value}
                    onClick={() => setTeeColor(tee.value)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all min-h-[44px] ${
                      teeColor === tee.value
                        ? "border-ink bg-card ring-1 ring-ink"
                        : "border-line bg-surface hover:border-line-soft"
                    }`}
                  >
                    <div
                      className="h-4 w-4 rounded-full border border-line"
                      style={{ backgroundColor: tee.color }}
                    />
                    <span className="text-sm font-medium text-ink">{tee.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-ink mb-2 block">Vær (valgfritt)</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "sol", icon: Sun, label: "Sol" },
                  { value: "overskyet", icon: Cloud, label: "Overskyet" },
                  { value: "regn", icon: Cloud, label: "Regn" },
                  { value: "vind", icon: Wind, label: "Vind" },
                ].map((w) => (
                  <button
                    key={w.value}
                    onClick={() => setWeather(weather === w.value ? "" : w.value)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all min-h-[44px] ${
                      weather === w.value
                        ? "border-ink bg-card"
                        : "border-line bg-surface hover:border-line-soft"
                    }`}
                  >
                    <w.icon className="h-4 w-4 text-ink-subtle" />
                    <span className="text-sm text-ink">{w.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="text-sm text-error bg-error-light rounded-xl p-3">
                {error}
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-full bg-accent text-ink font-semibold text-lg hover:bg-accent-deep active:scale-[0.98] transition-all duration-300 disabled:opacity-50 min-h-[44px]"
            >
              <Play className="h-5 w-5" />
              {isPending ? "Starter..." : "Start runde"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
