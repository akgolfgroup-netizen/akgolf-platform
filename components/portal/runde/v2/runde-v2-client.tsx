"use client";

import Link from "next/link";
import { Settings, Save, X } from "lucide-react";
import { CaddiePanel } from "./caddie-panel";
import { WeatherPanel } from "./weather-panel";
import { HoleNavBar } from "./hole-nav-bar";

interface Hole {
  id: string;
  holeNumber: number;
  par: number;
  lengthMeter: number;
}

interface HoleResult {
  holeNumber: number;
  score: number;
  putts: number;
}

interface RundeV2ClientProps {
  roundId: string;
  courseName: string;
  coursePar: number;
  holes: Hole[];
  existingResults: HoleResult[];
  currentHole: Hole | null;
  totalScore: number;
  relative: number;
  completedCount: number;
}

/**
 * Pixel-naer reskin av runde-v2.html (handoff 2026-04-27).
 *
 * Tar inn samme data som course-hero-client.tsx, ingen ny server-logikk.
 */
export function RundeV2Client({
  roundId,
  courseName,
  coursePar,
  holes,
  existingResults,
  currentHole,
  totalScore,
  relative,
}: RundeV2ClientProps) {
  const totalHoles = holes.length || 18;
  const par = currentHole?.par ?? 4;
  const lengthMeter = currentHole?.lengthMeter ?? 380;

  const prevHole =
    currentHole && currentHole.holeNumber > 1
      ? currentHole.holeNumber - 1
      : null;
  const nextHole =
    currentHole && currentHole.holeNumber < totalHoles
      ? currentHole.holeNumber + 1
      : null;

  return (
    <div
      className="-mx-6 lg:-mx-8 -mt-8 lg:-mt-10 relative h-[calc(100vh-4rem)] overflow-hidden"
      style={{ background: "#0A1F18" }}
    >
      {/* Course aerial bg (placeholder gradient until SVG asset wired) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 35% 60%, #2A7D5A 0%, #163A2D 45%, #0A1F18 90%)",
        }}
      />

      {/* Topbar */}
      <div className="absolute top-6 left-6 right-6 z-30 flex justify-between items-center">
        <div
          className="px-4 py-2 rounded-full text-white text-xs flex items-center gap-2.5 backdrop-blur-2xl border border-white/10"
          style={{ background: "rgba(12,22,17,0.62)" }}
        >
          <strong className="font-semibold">{courseName}</strong>
          <span className="opacity-30">·</span>
          <span>Hull {currentHole?.holeNumber ?? "—"}</span>
          <span className="opacity-30">·</span>
          <span className="text-white/60">
            Par {par} · {lengthMeter} m
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="px-3 py-2 rounded-full text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-2xl border border-white/10"
            style={{ background: "rgba(12,22,17,0.62)" }}
          >
            <Settings className="w-3 h-3" />
            Innstillinger
          </button>
          <button
            type="button"
            className="px-3 py-2 rounded-full bg-[#D1F843] text-[#0A1F18] text-xs font-semibold flex items-center gap-1.5"
          >
            <Save className="w-3 h-3" />
            Lagre slag
          </button>
          <Link
            href={`/portal/runde/${roundId}`}
            className="w-8 h-8 rounded-full grid place-items-center text-white backdrop-blur-2xl border border-white/10"
            style={{ background: "rgba(12,22,17,0.62)" }}
            aria-label="Lukk"
          >
            <X className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Shot trajectory SVG layer (placeholder) */}
      <svg
        className="absolute inset-0 z-10 pointer-events-none w-full h-full"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="none"
      >
        <path
          d="M 728 882 Q 680 780 710 680 Q 740 580 820 530"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="2"
          strokeDasharray="4 6"
          fill="none"
        />
        <path
          d="M 820 530 Q 920 500 1020 480"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="2"
          strokeDasharray="4 6"
          fill="none"
        />
        <path
          d="M 1020 480 Q 1080 475 1130 470"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="2"
          strokeDasharray="4 6"
          fill="none"
        />
        <path
          d="M 1020 480 Q 1090 450 1150 460"
          stroke="#D1F843"
          strokeWidth="2"
          strokeDasharray="2 5"
          fill="none"
        />
      </svg>

      {/* Distance pills */}
      <div
        className="absolute z-20 px-3 py-1.5 rounded-full bg-white/95 text-[#0A1F18] text-xs font-semibold"
        style={{ top: "47%", left: "70.6%", boxShadow: "0 4px 14px rgba(0,0,0,0.25)" }}
      >
        {lengthMeter} m
      </div>

      {/* Caddie panel */}
      <CaddiePanel
        recommendedClub="Callaway Apex · 7i"
        shotDistance={150}
        toGreen={154}
        shotsToFinish={{ fairway: 3.0, rough: 3.3, average: 3.1 }}
      />

      {/* Weather */}
      <WeatherPanel
        windDirection="Ost"
        windSpeed={5}
        windAngle={55}
        temperature={14}
        pressure={1013}
        conditions="Delvis sky"
      />

      {/* Bottom hole navigator */}
      <HoleNavBar
        currentHole={currentHole?.holeNumber ?? 1}
        totalHoles={totalHoles}
        totalScore={totalScore}
        relative={relative}
        elapsedLabel={`Par ${coursePar}`}
        prevHref={
          prevHole !== null
            ? `/portal/runde/${roundId}/hero?hole=${prevHole}`
            : undefined
        }
        nextHref={
          nextHole !== null
            ? `/portal/runde/${roundId}/hero?hole=${nextHole}`
            : undefined
        }
      />

      {/* Visit indicator: existingResults count */}
      <div
        className="absolute top-24 left-6 px-3 py-1.5 rounded-full text-white text-xs backdrop-blur-md border border-white/10 z-20"
        style={{ background: "rgba(12,22,17,0.62)" }}
      >
        {existingResults.length} av {totalHoles} hull spilt
      </div>
    </div>
  );
}
