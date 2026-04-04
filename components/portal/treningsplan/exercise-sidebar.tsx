"use client";

import { useState, useMemo } from "react";
import { Search, Sparkles, GripVertical } from "lucide-react";

/* ── Types ── */

type PyramidFilter = "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN";

interface Exercise {
  id: string;
  name: string;
  pyramid: PyramidFilter;
  area: string;
  mLevel: number;
  durationMinutes: number;
  meta?: string;
}

/* ── Pyramid config ── */

const PYRAMIDS: { id: PyramidFilter; label: string; areas: string[] }[] = [
  { id: "FYS", label: "FYS", areas: ["Styrke", "Kondisjon", "Mobilitet", "Eksplosivitet"] },
  { id: "TEK", label: "TEK", areas: ["L-KROPP", "L-ARM", "L-KOLLE", "L-BALL", "L-AUTO"] },
  { id: "SLAG", label: "SLAG", areas: ["Tee Total", "Approach", "Naerspill", "Putting"] },
  { id: "SPILL", label: "SPILL", areas: ["Banemanagement", "Strategi", "Mental"] },
  { id: "TURN", label: "TURN", areas: ["Turnering", "Test"] },
];

const M_LEVELS = [0, 1, 2, 3, 4];

const PYRAMID_COLORS: Record<PyramidFilter, { active: string; dot: string }> = {
  FYS: { active: "bg-[var(--pyramid-fys)] text-white", dot: "bg-[var(--pyramid-fys)]" },
  TEK: { active: "bg-[var(--pyramid-tek)] text-white", dot: "bg-[var(--pyramid-tek)]" },
  SLAG: { active: "bg-[var(--pyramid-slag)] text-white", dot: "bg-[var(--pyramid-slag)]" },
  SPILL: { active: "bg-[var(--pyramid-spill)] text-white", dot: "bg-[var(--pyramid-spill)]" },
  TURN: { active: "bg-[var(--pyramid-turn)] text-white", dot: "bg-[var(--pyramid-turn)]" },
};

/* ── Demo data ── */

const DEMO_EXERCISES: Exercise[] = [
  { id: "e1", name: "Gate drill", pyramid: "SLAG", area: "Putting", mLevel: 2, durationMinutes: 20, meta: "L-BALL" },
  { id: "e2", name: "Clock drill", pyramid: "SLAG", area: "Putting", mLevel: 2, durationMinutes: 15, meta: "Speed control" },
  { id: "e3", name: "Slow motion P4-P7", pyramid: "TEK", area: "L-ARM", mLevel: 0, durationMinutes: 10, meta: "CS40" },
  { id: "e4", name: "Mirror drill", pyramid: "TEK", area: "L-KROPP", mLevel: 0, durationMinutes: 10, meta: "P4 posisjon" },
  { id: "e5", name: "Ball hitting 7-jern", pyramid: "TEK", area: "L-BALL", mLevel: 2, durationMinutes: 25, meta: "CS60" },
  { id: "e6", name: "Pitch 30-50m", pyramid: "SLAG", area: "Naerspill", mLevel: 2, durationMinutes: 20, meta: "Avstandskontroll" },
  { id: "e7", name: "Bunker greenside", pyramid: "SLAG", area: "Naerspill", mLevel: 2, durationMinutes: 15, meta: "Sand" },
  { id: "e8", name: "Driver alignment", pyramid: "SLAG", area: "Tee Total", mLevel: 1, durationMinutes: 20, meta: "Fading" },
  { id: "e9", name: "Mobilitet hofte", pyramid: "FYS", area: "Mobilitet", mLevel: 0, durationMinutes: 15, meta: "Intern rotasjon" },
  { id: "e10", name: "9 hull scramble", pyramid: "SPILL", area: "Banemanagement", mLevel: 4, durationMinutes: 90, meta: "Simulert turnering" },
  { id: "e11", name: "Putting benchmark", pyramid: "TURN", area: "Test", mLevel: 3, durationMinutes: 25, meta: "10 slag scoring" },
];

/* ── Component ── */

export function ExerciseSidebar() {
  const [search, setSearch] = useState("");
  const [activePyramid, setActivePyramid] = useState<PyramidFilter>("SLAG");
  const [activeArea, setActiveArea] = useState<string | null>(null);
  const [activeM, setActiveM] = useState<number | null>(null);

  const currentPyramid = PYRAMIDS.find((p) => p.id === activePyramid);

  const filtered = useMemo(() => {
    return DEMO_EXERCISES.filter((ex) => {
      if (ex.pyramid !== activePyramid) return false;
      if (activeArea && ex.area !== activeArea) return false;
      if (activeM !== null && ex.mLevel !== activeM) return false;
      if (search && !ex.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [activePyramid, activeArea, activeM, search]);

  return (
    <div className="w-[300px] bg-white border-l border-[#E8E8ED] flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#E8E8ED]">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-3">
          Ovelsesbank
        </h3>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#86868B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sok ovelser..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F5F5F7] border border-[#E8E8ED] rounded-lg focus:outline-none focus:border-[#1D1D1F] focus:ring-1 focus:ring-[#1D1D1F]/10 transition-colors"
          />
        </div>

        {/* Pyramid tabs */}
        <div className="flex gap-1">
          {PYRAMIDS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setActivePyramid(p.id);
                setActiveArea(null);
                setActiveM(null);
              }}
              className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-colors ${
                activePyramid === p.id
                  ? PYRAMID_COLORS[p.id].active
                  : "text-[#86868B] hover:bg-[#F5F5F7]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Area filter */}
      <div className="px-4 py-3 border-b border-[#E8E8ED]">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setActiveArea(null)}
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition-colors ${
              !activeArea
                ? "bg-[#1D1D1F] text-white"
                : "text-[#86868B] hover:bg-[#F5F5F7]"
            }`}
          >
            Alle
          </button>
          {currentPyramid?.areas.map((area) => (
            <button
              key={area}
              onClick={() => setActiveArea(activeArea === area ? null : area)}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition-colors ${
                activeArea === area
                  ? "bg-[#1D1D1F] text-white"
                  : "text-[#86868B] hover:bg-[#F5F5F7]"
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        {/* M-level filter */}
        <div className="flex gap-1 mt-2">
          <button
            onClick={() => setActiveM(null)}
            className={`text-[10px] font-semibold px-2 py-1 rounded-full transition-colors ${
              activeM === null
                ? "bg-[#1D1D1F] text-white"
                : "text-[#86868B] hover:bg-[#F5F5F7]"
            }`}
          >
            Alle M
          </button>
          {M_LEVELS.map((m) => (
            <button
              key={m}
              onClick={() => setActiveM(activeM === m ? null : m)}
              className={`text-[10px] font-semibold px-2 py-1 rounded-full transition-colors ${
                activeM === m
                  ? "bg-[#1D1D1F] text-white"
                  : "text-[#86868B] hover:bg-[#F5F5F7]"
              }`}
            >
              M{m}
            </button>
          ))}
        </div>

        {/* Filter summary */}
        <p className="text-[10px] text-[#86868B] mt-2">
          {activePyramid}
          {activeArea ? ` \u2192 ${activeArea}` : ""}
          {activeM !== null ? ` \u00B7 M${activeM}` : " \u00B7 Alle M"}
          {" \u00B7 "}
          {filtered.length} treff
        </p>
      </div>

      {/* Exercise list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filtered.length === 0 ? (
          <p className="text-xs text-[#D2D2D7] text-center py-8">
            Ingen ovelser funnet
          </p>
        ) : (
          filtered.map((ex) => (
            <div
              key={ex.id}
              className="flex items-start gap-2 p-3 rounded-xl bg-[#F5F5F7] border border-transparent hover:border-[#E8E8ED] hover:bg-white cursor-grab active:cursor-grabbing transition-colors group"
            >
              <GripVertical className="w-3.5 h-3.5 text-[#D2D2D7] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${PYRAMID_COLORS[ex.pyramid].dot}`}
                  />
                  <span className="text-xs font-semibold text-[#1D1D1F] truncate">
                    {ex.name}
                  </span>
                </div>
                <p className="text-[10px] text-[#86868B] mt-0.5 ml-3.5">
                  {ex.area} {ex.meta ? `\u00B7 ${ex.meta}` : ""} {ex.mLevel > 0 ? `\u00B7 M${ex.mLevel}` : ""}
                </p>
              </div>
              <span className="text-[10px] font-semibold text-[#86868B] tabular-nums flex-shrink-0">
                {ex.durationMinutes} min
              </span>
            </div>
          ))
        )}
      </div>

      {/* AI suggestion */}
      <div className="p-4 border-t border-[#E8E8ED] bg-[var(--portal-ai-light)]">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#AF52DE]" />
          <span className="text-[10px] font-bold uppercase tracking-wide text-[#6B21A8]">
            AI-forslag
          </span>
        </div>
        <p className="text-[11px] text-[#6B21A8] leading-relaxed mb-3">
          Naerspill er ditt svakeste omrade. Legg til 2 okter denne uken.
        </p>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#AF52DE] text-white text-[10px] font-semibold hover:opacity-90 transition-opacity">
          <Sparkles className="w-3 h-3" />
          Generer ovelse med AI
        </button>
      </div>
    </div>
  );
}
