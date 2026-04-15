"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, Play, Cloud, Wind } from "lucide-react";
import { startRound } from "../actions";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";

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
        router.push(`/portal/runde/${result.roundId}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Feil ved oppstart av runde");
      }
    });
  }

  const teeColors = [
    { value: "yellow", label: "Gul", color: "#EAB308" },
    { value: "white", label: "Hvit", color: "#FFFFFF" },
    { value: "blue", label: "Bla", color: "#3B82F6" },
    { value: "red", label: "Rod", color: "#EF4444" },
  ];

  return (
    <PremiumCard>
      <div className="space-y-6">
        {/* Bane-valg */}
        {!selectedCourse ? (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Sok etter bane..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-grey-200 bg-white text-black placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                autoFocus
              />
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {filtered.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className="w-full text-left p-4 rounded-xl border border-grey-200 bg-white hover:border-primary hover:bg-grey-50 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-black mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-black">
                        {course.name}
                      </div>
                      <div className="text-sm text-grey-400 tabular-nums">
                        {course.location} — Par <span className="tabular-nums">{course.par}</span>
                        {course.courseRating && ` — CR ${course.courseRating}`}
                        {course.slopeRating && ` / Slope ${course.slopeRating}`}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-grey-400 py-8">
                  Ingen baner funnet
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Valgt bane */}
            <div className="p-4 rounded-xl border border-grey-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-black" />
                  <div>
                    <div className="font-semibold text-black">
                      {selectedCourse.name}
                    </div>
                    <div className="text-sm text-grey-400 tabular-nums">
                      Par <span className="tabular-nums">{selectedCourse.par}</span> — {selectedCourse.location}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="text-sm text-black hover:underline"
                >
                  Endre
                </button>
              </div>
            </div>

            {/* Tee-valg */}
            <div>
              <label className="text-sm font-medium text-black mb-2 block">
                Tee
              </label>
              <div className="flex gap-2">
                {teeColors.map((tee) => (
                  <button
                    key={tee.value}
                    onClick={() => setTeeColor(tee.value)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                      teeColor === tee.value
                        ? "border-black bg-grey-50 ring-1 ring-black"
                        : "border-grey-200 bg-white hover:border-grey-200"
                    }`}
                  >
                    <div
                      className="h-4 w-4 rounded-full border border-grey-200"
                      style={{ backgroundColor: tee.color }}
                    />
                    <span className="text-sm font-medium text-black">
                      {tee.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Vaer */}
            <div>
              <label className="text-sm font-medium text-black mb-2 block">
                Vaer (valgfritt)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "sol", icon: Cloud, label: "Sol" },
                  { value: "overskyet", icon: Cloud, label: "Overskyet" },
                  { value: "regn", icon: Cloud, label: "Regn" },
                  { value: "vind", icon: Wind, label: "Vind" },
                ].map((w) => (
                  <button
                    key={w.value}
                    onClick={() => setWeather(weather === w.value ? "" : w.value)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                      weather === w.value
                        ? "border-black bg-grey-50"
                        : "border-grey-200 bg-white hover:border-grey-200"
                    }`}
                  >
                    <w.icon className="h-4 w-4 text-grey-400" />
                    <span className="text-sm text-black">{w.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="text-sm text-black bg-[accent-cta]/10 rounded-xl p-3">
                {error}
              </div>
            )}

            {/* Start */}
            <button
              onClick={handleStart}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-full bg-[accent-cta] text-black font-semibold text-lg hover:opacity-85 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50"
            >
              <Play className="h-5 w-5" />
              {isPending ? "Starter..." : "Start runde"}
            </button>
          </>
        )}
      </div>
    </PremiumCard>
  );
}
