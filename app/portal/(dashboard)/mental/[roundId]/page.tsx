"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Save, ChevronLeft, Flag, Loader2 } from "lucide-react";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const EASE_APPLE: [number, number, number, number] = [0.4, 0, 0.2, 1];

interface HoleInfo {
  holeNumber: number;
  par: number;
}

interface HoleData {
  plan: string;
  target: string;
  focus: number;
  confidence: number;
  routineDone: boolean;
  visualization: number;
  result: string;
  processScore: number;
  feeling: string;
  accepted: boolean;
  doubt: boolean;
}

export default function RoundDetailPage() {
  const { roundId } = useParams<{ roundId: string }>();
  const [selectedHole, setSelectedHole] = useState(1);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [holes, setHoles] = useState<HoleInfo[]>([]);
  const [loadingHoles, setLoadingHoles] = useState(true);
  const [holeData, setHoleData] = useState<Record<number, HoleData>>({});

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/portal/ai/mental/rounds/${roundId}`);
        if (res.ok) {
          const data = await res.json();
          const entries = data.entries as Array<{
            hole: number;
            plannedShot: string | null;
            targetDescription: string | null;
            focusLevel: number | null;
            confidence: number | null;
            routineCompleted: boolean;
            visualizationQuality: number | null;
            outcome: string | null;
            processScore: number | null;
            emotion: string | null;
            acceptedResult: boolean;
            lastMinuteDoubt: boolean;
          }>;

          // Build initial hole data for all 18 holes
          const initial: Record<number, HoleData> = {};
          for (let i = 1; i <= 18; i++) {
            initial[i] = {
              plan: "",
              target: "",
              focus: 7,
              confidence: 7,
              routineDone: false,
              visualization: 7,
              result: "",
              processScore: 7,
              feeling: "",
              accepted: false,
              doubt: false,
            };
          }
          for (const e of entries) {
            initial[e.hole] = {
              plan: e.plannedShot ?? "",
              target: e.targetDescription ?? "",
              focus: e.focusLevel ?? 7,
              confidence: e.confidence ?? 7,
              routineDone: e.routineCompleted,
              visualization: e.visualizationQuality ?? 7,
              result: e.outcome ?? "",
              processScore: e.processScore ?? 7,
              feeling: e.emotion ?? "",
              accepted: e.acceptedResult,
              doubt: e.lastMinuteDoubt,
            };
          }
          setHoleData(initial);

          // Load course holes if courseId exists
          if (data.courseId) {
            const holesRes = await fetch(`/api/portal/courses/${data.courseId}/holes`);
            if (holesRes.ok) {
              const holesData = await holesRes.json();
              const courseHoles: HoleInfo[] = (holesData.holes || [])
                .sort((a: { holeNumber: number }, b: { holeNumber: number }) => a.holeNumber - b.holeNumber)
                .map((h: { holeNumber: number; par: number }) => ({ holeNumber: h.holeNumber, par: h.par }));
              setHoles(courseHoles);
            }
          }
        }
      } finally {
        setLoading(false);
        setLoadingHoles(false);
      }
    }
    load();
  }, [roundId]);

  const current = holeData[selectedHole];

  function updateField<K extends keyof HoleData>(field: K, value: HoleData[K]) {
    setHoleData((prev) => ({
      ...prev,
      [selectedHole]: { ...prev[selectedHole], [field]: value },
    }));
  }

  async function handleSave() {
    if (!current) return;
    setSaving(true);
    try {
      const payload = {
        roundId,
        hole: selectedHole,
        shotNumber: 1,
        plannedShot: current.plan || null,
        targetDescription: current.target || null,
        focusLevel: current.focus,
        confidence: current.confidence,
        routineCompleted: current.routineDone,
        visualizationQuality: current.visualization,
        outcome: current.result || null,
        processScore: current.processScore,
        emotion: current.feeling || null,
        acceptedResult: current.accepted,
        lastMinuteDoubt: current.doubt,
      };

      await fetch("/api/portal/ai/mental/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } finally {
      setSaving(false);
    }
  }

  const displayHoles = holes.length > 0 ? holes : Array.from({ length: 18 }, (_, i) => ({ holeNumber: i + 1, par: 4 }));
  const currentPar = displayHoles.find((h) => h.holeNumber === selectedHole)?.par ?? 4;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-black animate-spin" />
        <span className="ml-3 text-sm text-grey-400">Laster runde...</span>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="text-center py-20 text-sm text-grey-400">
        Kunne ikke laste rundedata.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_APPLE }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/portal/mental"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white border border-grey-200 text-black hover:bg-grey-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-black">Rundedetaljer</h1>
            <p className="text-grey-400 mt-1">Runde-ID: {roundId}</p>
          </div>
        </div>
        <Button variant="primary" onClick={handleSave} isLoading={saving}>
          <Save className="w-4 h-4 mr-2" />
          Lagre
        </Button>
      </motion.div>

      {/* Hole navigator */}
      <PremiumCard padding="sm" radius="large" noHover>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayHoles.map((h) => {
            const isActive = selectedHole === h.holeNumber;
            return (
              <button
                key={h.holeNumber}
                onClick={() => setSelectedHole(h.holeNumber)}
                className={`flex-shrink-0 w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-black text-white"
                    : "bg-[#F5F8F7] text-black hover:bg-[#ECF0EF]"
                }`}
              >
                {h.holeNumber}
              </button>
            );
          })}
        </div>
      </PremiumCard>

      {/* Hole info */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-grey-400">
          Hull <span className="font-semibold text-black">{selectedHole}</span>
        </div>
        <div className="text-sm text-grey-400">
          Par <span className="font-semibold text-black">{currentPar}</span>
        </div>
        {loadingHoles && (
          <div className="text-sm text-grey-400 flex items-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            Laster baneinfo...
          </div>
        )}
      </div>

      {/* Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pre-shot */}
        <PremiumCard delay={0.1} padding="md" radius="large">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Flag className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="text-base font-semibold text-black">Pre-shot</h3>
          </div>
          <div className="space-y-4">
            <FormField label="Plan">
              <input
                type="text"
                value={current.plan}
                onChange={(e) => updateField("plan", e.target.value)}
                placeholder="F.eks. Treff fairway høyre side"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white border border-grey-200 text-black placeholder:text-grey-300 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
              />
            </FormField>
            <FormField label="Target">
              <input
                type="text"
                value={current.target}
                onChange={(e) => updateField("target", e.target.value)}
                placeholder="F.eks. Høyre kant av fairwaybunker"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white border border-grey-200 text-black placeholder:text-grey-300 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
              />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <SliderField
                label="Fokus"
                value={current.focus}
                onChange={(v) => updateField("focus", v)}
                min={1}
                max={10}
              />
              <SliderField
                label="Selvtillit"
                value={current.confidence}
                onChange={(v) => updateField("confidence", v)}
                min={1}
                max={10}
              />
            </div>
            <SliderField
              label="Visualisering"
              value={current.visualization}
              onChange={(v) => updateField("visualization", v)}
              min={1}
              max={10}
            />
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={current.routineDone}
                onChange={(e) => updateField("routineDone", e.target.checked)}
                className="w-5 h-5 rounded border-grey-200 text-black focus:ring-black"
              />
              <span className="text-sm text-black">Rutine fullført</span>
            </label>
          </div>
        </PremiumCard>

        {/* Post-shot */}
        <PremiumCard delay={0.15} padding="md" radius="large">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <Flag className="w-4 h-4 text-purple-500" />
            </div>
            <h3 className="text-base font-semibold text-black">Post-shot</h3>
          </div>
          <div className="space-y-4">
            <FormField label="Resultat">
              <input
                type="text"
                value={current.result}
                onChange={(e) => updateField("result", e.target.value)}
                placeholder="F.eks. Fairway, 145m til flagg"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white border border-grey-200 text-black placeholder:text-grey-300 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
              />
            </FormField>
            <SliderField
              label="Prosesscore"
              value={current.processScore}
              onChange={(v) => updateField("processScore", v)}
              min={1}
              max={10}
            />
            <FormField label="Følelse">
              <input
                type="text"
                value={current.feeling}
                onChange={(e) => updateField("feeling", e.target.value)}
                placeholder="F.eks. Rolig og kontrollert"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white border border-grey-200 text-black placeholder:text-grey-300 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
              />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={current.accepted}
                  onChange={(e) => updateField("accepted", e.target.checked)}
                  className="w-5 h-5 rounded border-grey-200 text-black focus:ring-black"
                />
                <span className="text-sm text-black">Akseptert</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={current.doubt}
                  onChange={(e) => updateField("doubt", e.target.checked)}
                  className="w-5 h-5 rounded border-grey-200 text-black focus:ring-black"
                />
                <span className="text-sm text-black">Tvil</span>
              </label>
            </div>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-grey-400 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function SliderField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-grey-400">
          {label}
        </label>
        <span className="text-sm font-semibold text-black tabular-nums">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full accent-black"
      />
    </div>
  );
}
