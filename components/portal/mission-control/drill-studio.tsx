"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DrillStudioProps {
  studentId: string;
  studentName: string;
  /** Pre-seed focus areas from latest CoachingSession.aiFocusAreas */
  suggestedFocusAreas?: string[];
}

interface GeneratedDrill {
  id: string;
  name: string;
  description: string;
  instructions: string;
  duration_minutes: number;
  pyramid_level: string;
  training_area: string;
  sg_area: string;
  difficulty: string;
  tags: string[];
  equipment: string[];
  success_criteria: string;
}

const FOCUS_OPTIONS = [
  { value: "putting", label: "Putting" },
  { value: "short_game", label: "Kort spill" },
  { value: "approach", label: "Inn-spill" },
  { value: "tee", label: "Utslag" },
];

const DIFFICULTY_OPTIONS = [
  { value: "nybegynner", label: "Nybegynner" },
  { value: "rekrutt", label: "Rekrutt" },
  { value: "klubb", label: "Klubb" },
  { value: "regional", label: "Regional" },
  { value: "nasjonal", label: "Nasjonal" },
  { value: "elite", label: "Elite" },
];

function normalizeFocus(value: string): string {
  const v = value.toLowerCase();
  if (v.includes("putt")) return "putting";
  if (v.includes("kort") || v.includes("short") || v.includes("chip")) return "short_game";
  if (v.includes("approach") || v.includes("jern") || v.includes("iron")) return "approach";
  if (v.includes("tee") || v.includes("driver") || v.includes("slag")) return "tee";
  return "putting";
}

export function DrillStudio({ studentId, studentName, suggestedFocusAreas = [] }: DrillStudioProps) {
  const router = useRouter();
  const suggested = suggestedFocusAreas.map(normalizeFocus);
  const initialFocus = Array.from(new Set(suggested)).slice(0, 2);
  const [selectedAreas, setSelectedAreas] = useState<string[]>(
    initialFocus.length > 0 ? initialFocus : ["putting"]
  );
  const [difficulty, setDifficulty] = useState("klubb");
  const [count, setCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [drills, setDrills] = useState<GeneratedDrill[]>([]);
  const [assigned, setAssigned] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  function toggleArea(v: string) {
    setSelectedAreas((prev) =>
      prev.includes(v) ? prev.filter((a) => a !== v) : [...prev, v]
    );
  }

  async function generate() {
    if (selectedAreas.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/portal/ai/drill-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          focusAreas: selectedAreas,
          count,
          difficulty,
          persist: false, // kun preview — persisterer ved "Legg til elev"
        }),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error ?? `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      setDrills(data.drills);
      setAssigned(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generering feilet");
    } finally {
      setLoading(false);
    }
  }

  async function assignToStudent(drill: GeneratedDrill) {
    try {
      const resp = await fetch("/api/portal/ai/drill-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          focusAreas: [drill.sg_area],
          count: 1,
          difficulty,
          studentId,
          persist: true,
        }),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error ?? `HTTP ${resp.status}`);
      }
      setAssigned((prev) => new Set(prev).add(drill.name));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke legge til");
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6">
        <h3 className="text-lg font-bold text-on-surface tracking-tight mb-1">Drill Studio</h3>
        <p className="text-sm text-on-surface-variant mb-4">
          Generer øvelser for {studentName}.
        </p>

        {/* Focus areas */}
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant mb-2">
            Fokusområder
          </div>
          <div className="flex flex-wrap gap-2">
            {FOCUS_OPTIONS.map((opt) => {
              const active = selectedAreas.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleArea(opt.value)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container",
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty */}
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant mb-2">
            Vanskelighetsgrad
          </div>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDifficulty(opt.value)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  difficulty === opt.value
                    ? "bg-on-surface text-surface"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="mb-6">
          <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant mb-2">
            Antall per område
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="text-xs text-on-surface-variant mt-1">{count} drills per fokusområde</div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={generate}
            isLoading={loading}
            disabled={loading || selectedAreas.length === 0}
          >
            <Icon name="auto_awesome" size={16} className="mr-2" />
            Generer drills
          </Button>
        </div>

        {error && (
          <div className="mt-3 rounded-xl bg-error/10 border border-error/20 p-3 text-sm text-error">
            {error}
          </div>
        )}
      </div>

      {drills.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {drills.map((drill, idx) => (
            <DrillCard
              key={`${drill.name}-${idx}`}
              drill={drill}
              assigned={assigned.has(drill.name)}
              onAssign={() => assignToStudent(drill)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DrillCard({
  drill,
  assigned,
  onAssign,
}: {
  drill: GeneratedDrill;
  assigned: boolean;
  onAssign: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-5 shadow-card">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="font-bold text-on-surface tracking-tight">{drill.name}</h4>
        <div className="shrink-0 text-[10px] uppercase tracking-[0.1em] rounded-full bg-secondary-fixed/20 text-on-surface px-2 py-0.5">
          {drill.pyramid_level}
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-on-surface-variant mb-3">
        <span>{drill.duration_minutes} min</span>
        <span>•</span>
        <span className="capitalize">{drill.sg_area.replace("_", " ")}</span>
        <span>•</span>
        <span className="capitalize">{drill.difficulty}</span>
      </div>
      <p className="text-sm text-on-surface-variant line-clamp-2">{drill.description}</p>

      {expanded && (
        <div className="mt-3 space-y-3 text-sm">
          <div>
            <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant mb-1">
              Instruksjoner
            </div>
            <p className="text-on-surface whitespace-pre-wrap">{drill.instructions}</p>
          </div>
          {drill.equipment?.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant mb-1">
                Utstyr
              </div>
              <div className="flex flex-wrap gap-1">
                {drill.equipment.map((e) => (
                  <span
                    key={e}
                    className="rounded-full bg-surface-container-low px-2 py-0.5 text-xs text-on-surface-variant"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}
          {drill.success_criteria && (
            <div>
              <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant mb-1">
                Suksesskriterier
              </div>
              <p className="text-on-surface">{drill.success_criteria}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-xs font-semibold text-primary hover:underline"
        >
          {expanded ? "Skjul" : "Vis detaljer"}
        </button>
        <Button
          size="sm"
          variant={assigned ? "ghost" : "primary"}
          onClick={onAssign}
          disabled={assigned}
        >
          {assigned ? (
            <>
              <Icon name="check" size={14} className="mr-1" />
              Lagt til
            </>
          ) : (
            <>
              <Icon name="add" size={14} className="mr-1" />
              Legg til elev
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
