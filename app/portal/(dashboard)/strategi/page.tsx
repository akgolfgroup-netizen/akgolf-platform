"use client";

import { Icon } from "@/components/ui/icon";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { MonoLabel, BentoCard } from "@/components/portal/patterns";

const EASE_APPLE: [number, number, number, number] = [0.4, 0, 0.2, 1];

interface Course {
  id: string;
  name: string;
  location: string;
  par?: number;
  courseRating?: number;
  slopeRating?: number;
  totalLength?: number;
}

interface Strategy {
  recommendedClub: string;
  aimPoint: string;
  targetZone: string;
  dangerAreas: string[];
}

interface Hole {
  id: string;
  holeNumber: number;
  par: number;
  handicap: number;
  lengthMeter: number;
  teeColor?: string;
  strategy?: Strategy | null;
}

// Heuristisk forslag når ingen persistert strategi finnes — returnerer
// både strategien og en flagg som forteller om det er et auto-forslag,
// slik at UI kan markere det tydelig.
function getFallbackStrategy(hole: Hole): {
  strategy: Strategy;
  isAutoSuggestion: boolean;
} {
  if (hole.strategy) {
    return { strategy: hole.strategy, isAutoSuggestion: false };
  }

  const recommendedClub =
    hole.lengthMeter > 400
      ? "Driver"
      : hole.lengthMeter > 300
      ? "3W"
      : hole.lengthMeter > 200
      ? "7I"
      : "Wedge";
  const aimPoint = hole.handicap <= 5 ? "Sikkert senter fairway" : "Midt fairway";
  const targetZone =
    hole.par === 5
      ? "Green i 2 / opp-ned"
      : hole.par === 3
      ? "Midt green"
      : "Fairway -> green";
  const dangerAreas = hole.handicap <= 5 ? ["Bunkere", "Rough"] : ["Venstre rough"];

  return {
    strategy: { recommendedClub, aimPoint, targetZone, dangerAreas },
    isAutoSuggestion: true,
  };
}

export default function StrategiPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedHole, setSelectedHole] = useState(1);
  const [holes, setHoles] = useState<Hole[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingHoles, setLoadingHoles] = useState(false);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch("/api/portal/courses");
        if (res.ok) {
          const data = await res.json();
          const list: Course[] = Array.isArray(data) ? data : data.courses || [];
          setCourses(list);
          if (list.length > 0 && !selectedCourseId) {
            setSelectedCourseId(list[0].id);
          }
        }
      } finally {
        setLoadingCourses(false);
      }
    }
    loadCourses();
  }, [selectedCourseId]);

  useEffect(() => {
    if (!selectedCourseId) return;

    async function loadHoles() {
      setLoadingHoles(true);
      try {
        const res = await fetch(`/api/portal/courses/${selectedCourseId}/holes`);
        if (res.ok) {
          const data = await res.json();
          setHoles(data.holes || []);
          setSelectedHole(1);
        }
      } finally {
        setLoadingHoles(false);
      }
    }
    loadHoles();
  }, [selectedCourseId]);

  const course = courses.find((c) => c.id === selectedCourseId);
  const hole = holes.find((h) => h.holeNumber === selectedHole) || holes[0];
  const strategyResult = hole ? getFallbackStrategy(hole) : null;
  const strategy = strategyResult?.strategy ?? null;
  const isAutoSuggestion = strategyResult?.isAutoSuggestion ?? false;

  return (
    <section className="space-y-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_APPLE }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <MonoLabel size="xs" uppercase className="text-on-surface-variant block mb-2">
            Banestrategi
          </MonoLabel>
          <h1 className="text-2xl font-bold text-primary">DECADE Strategi</h1>
          <p className="text-on-surface-variant mt-1">Hull-for-hull strategi og pre-shot rutine</p>
        </div>
        <div className="relative">
          <Icon name="location_on" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            disabled={loadingCourses || courses.length === 0}
            className="pl-10 pr-10 py-2.5 rounded-xl text-sm bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary appearance-none disabled:opacity-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%237A8C85' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
            }}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </motion.header>

      {loadingCourses || loadingHoles ? (
        <div className="flex items-center justify-center py-20">
          <Icon name="progress_activity" className="w-8 h-8 text-on-surface animate-spin" />
          <span className="ml-3 text-sm text-on-surface-variant">
            {loadingCourses ? "Laster baner..." : "Laster hull..."}
          </span>
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
            <Icon name="location_on" className="w-6 h-6 text-on-surface-variant" />
          </div>
          <h3 className="text-lg font-semibold text-on-surface mb-2">Ingen baner funnet</h3>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-6">
            Det finnes ingen golfbaner i databasen ennå. Kontakt administrator for å legge til baner,
            eller kjør seed-scriptet <code className="bg-surface-container px-1 rounded">prisma/seed-courses.ts</code>.
          </p>
        </div>
      ) : holes.length === 0 ? (
        <div className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
            <Icon name="flag" className="w-6 h-6 text-on-surface-variant" />
          </div>
          <h3 className="text-lg font-semibold text-on-surface mb-2">Ingen hull funnet</h3>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto">
            Banen <strong>{course?.name}</strong> har ingen registrerte hull ennå.
          </p>
        </div>
      ) : (
        <>
          {/* Hole navigator */}
          <BentoCard variant="light" padding="md">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setSelectedHole((h) => Math.max(1, h - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container text-sm font-medium text-on-surface hover:bg-surface-container-high transition-colors"
              >
                <Icon name="chevron_left" className="w-4 h-4" />
                Forrige
              </button>
              <span className="text-sm font-semibold text-on-surface">
                Hull {selectedHole} / {holes.length}
              </span>
              <button
                onClick={() => setSelectedHole((h) => Math.min(holes.length, h + 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container text-sm font-medium text-on-surface hover:bg-surface-container-high transition-colors"
              >
                Neste
                <Icon name="chevron_right" className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {holes.map((h) => {
                const isActive = selectedHole === h.holeNumber;
                return (
                  <button
                    key={h.holeNumber}
                    onClick={() => setSelectedHole(h.holeNumber)}
                    className={`flex-shrink-0 w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-on-surface text-surface"
                        : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    {h.holeNumber}
                  </button>
                );
              })}
            </div>
          </BentoCard>

          {/* Hole info + strategy */}
          <div className="grid grid-cols-12 gap-6">
            {/* Hole info */}
            <div className="col-span-12 lg:col-span-4">
              <BentoCard variant="light" padding="md" className="h-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-on-surface text-surface flex items-center justify-center text-base font-bold">
                    {hole.holeNumber}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{course?.name}</p>
                    <p className="text-xs text-on-surface-variant">{course?.location}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-outline-variant/10">
                    <span className="text-sm text-on-surface-variant">Par</span>
                    <span className="text-sm font-semibold text-on-surface">{hole.par}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-outline-variant/10">
                    <span className="text-sm text-on-surface-variant">Lengde</span>
                    <span className="text-sm font-semibold text-on-surface">{hole.lengthMeter}m</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-on-surface-variant">Hcp-indeks</span>
                    <span className="text-sm font-semibold text-on-surface">{hole.handicap}</span>
                  </div>
                </div>
              </BentoCard>
            </div>

            {/* DECADE strategy */}
            <div className="col-span-12 lg:col-span-8">
              <BentoCard variant="light" padding="md" className="h-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <Icon name="my_location" className="w-4 h-4 text-success" />
                  </div>
                  <h3 className="text-base font-semibold text-on-surface">DECADE Strategi</h3>
                  {isAutoSuggestion && (
                    <span className="ml-auto rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warning">
                      Auto-forslag
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <MonoLabel size="xs" uppercase className="text-on-surface-variant block">Anbefalt klubb</MonoLabel>
                      <p className="text-lg font-semibold text-on-surface">{strategy?.recommendedClub}</p>
                    </div>
                    <div>
                      <MonoLabel size="xs" uppercase className="text-on-surface-variant block">Aimpoint</MonoLabel>
                      <p className="text-sm text-on-surface">{strategy?.aimPoint}</p>
                    </div>
                    <div>
                      <MonoLabel size="xs" uppercase className="text-on-surface-variant block">Mål-sone</MonoLabel>
                      <p className="text-sm text-on-surface">{strategy?.targetZone}</p>
                    </div>
                  </div>
                  <div>
                    <MonoLabel size="xs" uppercase className="text-on-surface-variant block mb-2">Fare-områder</MonoLabel>
                    <div className="space-y-2">
                      {strategy?.dangerAreas.map((danger, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-error/5 text-error text-sm"
                        >
                          <Icon name="warning" className="w-4 h-4" />
                          {danger}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </BentoCard>
            </div>
          </div>

          {/* Pre-shot routine + dispersion */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-6">
              <BentoCard variant="light" padding="md" className="h-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-data-violet/10 flex items-center justify-center">
                    <Icon name="air" className="w-4 h-4 text-data-violet" />
                  </div>
                  <h3 className="text-base font-semibold text-on-surface">Pre-shot rutine</h3>
                </div>
                <ol className="space-y-3 text-sm text-on-surface">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-surface-container text-on-surface flex items-center justify-center text-xs font-semibold">
                      1
                    </span>
                    <span>Visualiser ball-flight bak ballen</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-surface-container text-on-surface flex items-center justify-center text-xs font-semibold">
                      2
                    </span>
                    <span>Velg target og commit til klubbvalg</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-surface-container text-on-surface flex items-center justify-center text-xs font-semibold">
                      3
                    </span>
                    <span>Gjennomfør pust og trigger</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-surface-container text-on-surface flex items-center justify-center text-xs font-semibold">
                      4
                    </span>
                    <span>Sving fritt — aksepter resultatet</span>
                  </li>
                </ol>
              </BentoCard>
            </div>

            <div className="col-span-12 lg:col-span-6">
              <BentoCard variant="light" padding="md" className="h-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-data-blue/10 flex items-center justify-center">
                    <Icon name="flag" className="w-4 h-4 text-data-blue" />
                  </div>
                  <h3 className="text-base font-semibold text-on-surface">Dispersion-visualisering</h3>
                </div>
                <div className="relative h-48 bg-surface-container rounded-xl overflow-hidden">
                  {/* Fairway */}
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-16 bg-success/10 border-x border-outline-variant/30" />
                  {/* Target line */}
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-on-surface/20" />
                  {/* Dispersion ellipse */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-on-surface/10 border border-on-surface/30"
                    style={{
                      width: 120,
                      height: 64,
                      borderRadius: "50%",
                    }}
                  />
                  {/* Aimpoint dot */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-on-surface" />
                  {/* Labels */}
                  <span className="absolute top-2 left-2 text-[10px] text-on-surface-variant">Venstre rough</span>
                  <span className="absolute top-2 right-2 text-[10px] text-on-surface-variant">Høyre rough</span>
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-on-surface-variant">
                    Fairway
                  </span>
                </div>
              </BentoCard>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
