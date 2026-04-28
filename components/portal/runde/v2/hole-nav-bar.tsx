"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HoleNavBarProps {
  currentHole: number;
  totalHoles: number;
  totalScore: number;
  relative: number;
  elapsedLabel?: string;
  prevHref?: string;
  nextHref?: string;
}

export function HoleNavBar({
  currentHole,
  totalHoles,
  totalScore,
  relative,
  elapsedLabel,
  prevHref,
  nextHref,
}: HoleNavBarProps) {
  const relLabel =
    relative === 0 ? "E" : relative > 0 ? `+${relative}` : `${relative}`;

  return (
    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-30">
      <div className="flex items-center gap-2.5">
        <div
          className="flex items-center gap-1.5 p-1.5 backdrop-blur-2xl border border-white/10 rounded-full text-white"
          style={{ background: "rgba(12,22,17,0.62)" }}
        >
          <Link
            href={prevHref ?? "#"}
            className="w-8 h-8 rounded-full grid place-items-center text-white/70 hover:bg-white/[0.08] hover:text-white"
            aria-label="Forrige hull"
          >
            <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
          </Link>
          <div className="px-4 py-1.5 rounded-full bg-[#D1F843] text-[#0A1F18] text-xs font-bold">
            Hull {currentHole}
          </div>
          <Link
            href={nextHref ?? "#"}
            className="w-8 h-8 rounded-full grid place-items-center text-white/70 hover:bg-white/[0.08] hover:text-white"
            aria-label="Neste hull"
          >
            <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </Link>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-[rgba(12,22,17,0.62)] backdrop-blur-2xl border border-white/10 text-white text-xs flex items-center gap-2">
          <strong className="text-[#D1F843]">
            {totalScore}
            <span className="ml-1 text-white/55">({relLabel})</span>
          </strong>
          {elapsedLabel ? (
            <>
              <span className="opacity-30">·</span>
              <span className="text-white/55">{elapsedLabel}</span>
            </>
          ) : null}
          <span className="opacity-30">·</span>
          <span className="text-white/55">
            Hull {currentHole}/{totalHoles}
          </span>
        </div>
      </div>
    </div>
  );
}
