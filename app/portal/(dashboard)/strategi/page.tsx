"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Flag,
  Target,
  AlertTriangle,
  Wind,
  Loader2,
} from "lucide-react";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { Button } from "@/components/ui/button";

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

interface Hole {
  id: string;
  holeNumber: number;
  par: number;
  handicap: number;
  lengthMeter: number;
  teeColor?: string;
}

// Fallback strategy generator when no course strategy data exists yet
function getFallbackStrategy(hole: Hole) {
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

  return { recommendedClub, aimPoint, targetZone, dangerAreas };
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
  const strategy = hole ? getFallbackStrategy(hole) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_APPLE }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-black">DECADE Strategi</h1>
          <p className="text-grey-400 mt-1">Hull-for-hull strategi og pre-shot rutine</p>
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400" />
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            disabled={loadingCourses || courses.length === 0}
            className="pl-10 pr-10 py-2.5 rounded-lg text-sm bg-white border border-grey-200 text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black appearance-none disabled:opacity-50"
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
      </motion.div>

      {loadingCourses || loadingHoles ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-black animate-spin" />
          <span className="ml-3 text-sm text-grey-400">
            {loadingCourses ? "Laster baner..." : "Laster hull..."}
          </span>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-grey-200/50 p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-grey-50 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-6 h-6 text-grey-400" />
          </div>
          <h3 className="text-lg font-semibold text-black mb-2">Ingen baner funnet</h3>
          <p className="text-sm text-grey-400 max-w-md mx-auto mb-6">
            Det finnes ingen golfbaner i databasen ennå. Kontakt administrator for aa legge til baner,
            eller koer seed-scriptet <code className="bg-grey-50 px-1 rounded">prisma/seed-courses.ts</code>.
          </p>
        </div>
      ) : holes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-grey-200/50 p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-grey-50 flex items-center justify-center mx-auto mb-4">
            <Flag className="w-6 h-6 text-grey-400" />
          </div>
          <h3 className="text-lg font-semibold text-black mb-2">Ingen hull funnet</h3>
          <p className="text-sm text-grey-400 max-w-md mx-auto">
            Banen <strong>{course?.name}</strong> har ingen registrerte hull ennå.
          </p>
        </div>
      ) : (
        <>
          {/* Hole navigator */}
          <PremiumCard padding="sm" radius="large" noHover>
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setSelectedHole((h) => Math.max(1, h - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-grey-50 text-sm font-medium text-black hover:bg-grey-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Forrige
              </button>
              <span className="text-sm font-semibold text-black">
                Hull {selectedHole} / {holes.length}
              </span>
              <button
                onClick={() => setSelectedHole((h) => Math.min(holes.length, h + 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-grey-50 text-sm font-medium text-black hover:bg-grey-50 transition-colors"
              >
                Neste
                <ChevronRight className="w-4 h-4" />
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
                        ? "bg-black text-white"
                        : "bg-grey-50 text-black hover:bg-grey-50"
                    }`}
                  >
                    {h.holeNumber}
                  </button>
                );
              })}
            </div>
          </PremiumCard>

          {/* Hole info + strategy */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Hole info */}
            <PremiumCard delay={0.05} padding="md" radius="large">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center text-base font-bold">
                  {hole.holeNumber}
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">{course?.name}</p>
                  <p className="text-xs text-grey-400">{course?.location}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-grey-200/50">
                  <span className="text-sm text-grey-400">Par</span>
                  <span className="text-sm font-semibold text-black">{hole.par}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-grey-200/50">
                  <span className="text-sm text-grey-400">Lengde</span>
                  <span className="text-sm font-semibold text-black">{hole.lengthMeter}m</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-grey-400">Hcp-indeks</span>
                  <span className="text-sm font-semibold text-black">{hole.handicap}</span>
                </div>
              </div>
            </PremiumCard>

            {/* DECADE strategy */}
            <PremiumCard delay={0.1} padding="md" radius="large" className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <Target className="w-4 h-4 text-success" />
                </div>
                <h3 className="text-base font-semibold text-black">DECADE Strategi</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-grey-400">
                      Anbefalt klubb
                    </p>
                    <p className="text-lg font-semibold text-black">{strategy?.recommendedClub}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-grey-400">
                      Aimpoint
                    </p>
                    <p className="text-sm text-black">{strategy?.aimPoint}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-grey-400">
                      Mål-sone
                    </p>
                    <p className="text-sm text-black">{strategy?.targetZone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-grey-400 mb-2">
                    Fare-områder
                  </p>
                  <div className="space-y-2">
                    {strategy?.dangerAreas.map((danger, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-error-light text-error text-sm"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        {danger}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PremiumCard>
          </div>

          {/* Pre-shot routine + dispersion */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PremiumCard delay={0.15} padding="md" radius="large">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Wind className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-base font-semibold text-black">Pre-shot rutine</h3>
              </div>
              <ol className="space-y-3 text-sm text-black">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-grey-50 text-black flex items-center justify-center text-xs font-semibold">
                    1
                  </span>
                  <span>Visualiser ball-flight bak ballen</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-grey-50 text-black flex items-center justify-center text-xs font-semibold">
                    2
                  </span>
                  <span>Velg target og commit til klubbvalg</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-grey-50 text-black flex items-center justify-center text-xs font-semibold">
                    3
                  </span>
                  <span>Gjennomfør pust og trigger</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-grey-50 text-black flex items-center justify-center text-xs font-semibold">
                    4
                  </span>
                  <span>Sving fritt — aksepter resultatet</span>
                </li>
              </ol>
            </PremiumCard>

            <PremiumCard delay={0.2} padding="md" radius="large">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Flag className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-base font-semibold text-black">Dispersion-visualisering</h3>
              </div>
              <div className="relative h-48 bg-grey-50 rounded-xl overflow-hidden">
                {/* Fairway */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-16 bg-success/10 border-x border-grey-200" />
                {/* Target line */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-black/20" />
                {/* Dispersion ellipse */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/10 border border-black/30"
                  style={{
                    width: 120,
                    height: 64,
                    borderRadius: "50%",
                  }}
                />
                {/* Aimpoint dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black" />
                {/* Labels */}
                <span className="absolute top-2 left-2 text-[10px] text-grey-400">Venstre rough</span>
                <span className="absolute top-2 right-2 text-[10px] text-grey-400">Høyre rough</span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-grey-400">
                  Fairway
                </span>
              </div>
            </PremiumCard>
          </div>
        </>
      )}
    </div>
  );
}
