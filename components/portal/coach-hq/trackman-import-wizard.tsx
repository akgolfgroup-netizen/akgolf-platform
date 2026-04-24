"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Phase = "idle" | "parsing" | "preview" | "saving" | "done" | "error";

interface Shot {
  club: string;
  carryDistance?: number | null;
  totalDistance?: number | null;
  ballSpeed?: number | null;
  clubSpeed?: number | null;
  launchAngle?: number | null;
  spinRate?: number | null;
  offlineDistance?: number | null;
}

interface ClubSummary {
  club: string;
  count: number;
  avgCarry: number | null;
  avgTotal: number;
  avgBallSpeed: number | null;
  lateralStdDev: number | null;
}

interface TrackmanImportWizardProps {
  studentId?: string;
  coachingSessionId?: string;
  sessionDate?: string;
  onComplete?: () => void;
}

export function TrackmanImportWizard({
  studentId,
  coachingSessionId,
  sessionDate,
  onComplete,
}: TrackmanImportWizardProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [shots, setShots] = useState<Shot[]>([]);
  const [clubSummary, setClubSummary] = useState<ClubSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function parsePreview() {
    if (!image) return;
    setError(null);
    setPhase("parsing");
    try {
      const base64 = await fileToBase64(image);
      const resp = await fetch("/api/portal/trackman/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, preview: true }),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error ?? `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      setShots(data.shots ?? []);
      setClubSummary(data.clubSummary ?? []);
      setPhase("preview");
    } catch (err) {
      setPhase("error");
      setError(err instanceof Error ? err.message : "Parsing feilet");
    }
  }

  async function save() {
    if (!image) return;
    setError(null);
    setPhase("saving");
    try {
      const base64 = await fileToBase64(image);
      const resp = await fetch("/api/portal/trackman/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          sessionDate: sessionDate ?? new Date().toISOString(),
          studentId,
          coachingSessionId,
        }),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error ?? `HTTP ${resp.status}`);
      }
      setPhase("done");
      onComplete?.();
      router.refresh();
    } catch (err) {
      setPhase("error");
      setError(err instanceof Error ? err.message : "Lagring feilet");
    }
  }

  function reset() {
    setImage(null);
    setShots([]);
    setClubSummary([]);
    setPhase("idle");
    setError(null);
  }

  return (
    <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-on-surface tracking-tight">
            TrackMan-import
          </h3>
          <p className="text-sm text-on-surface-variant mt-1">
            Last opp et skjermbilde fra TrackMan-skjermen (Combine, Range eller Performance Studio). Claude Vision leser dataene.
          </p>
        </div>
        {phase === "preview" && (
          <div className="text-xs text-on-surface-variant">
            {shots.length} slag, {clubSummary.length} klubber
          </div>
        )}
      </div>

      {phase === "idle" && (
        <>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className={cn(
              "w-full rounded-xl border-2 border-dashed p-8 transition-colors",
              image
                ? "border-primary bg-primary/5"
                : "border-outline-variant/50 hover:border-primary/50 hover:bg-surface-container-low",
            )}
          >
            <Icon
              name={image ? "check_circle" : "add_a_photo"}
              size={32}
              className={cn("mx-auto mb-2", image ? "text-primary" : "text-on-surface-variant")}
              filled
            />
            <div className="text-sm font-semibold text-on-surface">
              {image ? image.name : "Velg eller ta bilde"}
            </div>
            <div className="text-xs text-on-surface-variant mt-1">
              {image ? `${(image.size / 1024).toFixed(0)} KB` : "Fra iPhone-kamera eller biblioteket"}
            </div>
          </button>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="primary" onClick={parsePreview} disabled={!image}>
              Les ut data
            </Button>
          </div>
        </>
      )}

      {(phase === "parsing" || phase === "saving") && (
        <div className="py-8 text-center">
          <div className="mx-auto h-3 w-3 rounded-full bg-primary animate-pulse" />
          <div className="mt-3 text-sm text-on-surface-variant">
            {phase === "parsing" ? "Claude Vision leser bildet..." : "Lagrer..."}
          </div>
        </div>
      )}

      {phase === "preview" && (
        <>
          <ClubSummaryTable summary={clubSummary} />
          <ShotTable shots={shots} />
          <div className="mt-4 flex items-center justify-between gap-3">
            <Button variant="ghost" onClick={reset}>
              Start på nytt
            </Button>
            <Button variant="primary" onClick={save}>
              Bekreft og lagre
            </Button>
          </div>
        </>
      )}

      {phase === "done" && (
        <div className="py-8 text-center">
          <Icon name="check_circle" size={40} className="text-primary mx-auto mb-3" filled />
          <div className="text-sm font-semibold text-on-surface">
            Lagret {shots.length} slag
          </div>
          <Button variant="ghost" onClick={reset} size="sm" className="mt-4">
            Last opp nytt bilde
          </Button>
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-xl bg-error/10 border border-error/20 p-3 text-sm text-error">
          {error}
        </div>
      )}
    </div>
  );
}

function ClubSummaryTable({ summary }: { summary: ClubSummary[] }) {
  if (summary.length === 0) return null;
  return (
    <div className="mb-4 rounded-xl bg-surface-container-low p-3">
      <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant mb-2">
        Per klubb
      </div>
      <div className="space-y-1">
        {summary.map((s) => (
          <div
            key={s.club}
            className="flex items-center justify-between text-sm border-b border-outline-variant/20 last:border-b-0 py-1.5"
          >
            <div className="font-semibold text-on-surface">{s.club}</div>
            <div className="flex gap-4 text-xs text-on-surface-variant font-mono tabular-nums">
              <span>{s.count} slag</span>
              <span>Carry: {s.avgCarry?.toFixed(0) ?? "—"}m</span>
              <span>Total: {s.avgTotal.toFixed(0)}m</span>
              <span>
                BS: {s.avgBallSpeed?.toFixed(0) ?? "—"} mph
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShotTable({ shots }: { shots: Shot[] }) {
  return (
    <div className="rounded-xl bg-surface-container-low overflow-x-auto">
      <table className="w-full text-xs">
        <thead className="text-[10px] uppercase tracking-[0.12em] text-on-surface-variant">
          <tr>
            <th className="text-left px-3 py-2">#</th>
            <th className="text-left px-3 py-2">Klubb</th>
            <th className="text-right px-3 py-2">Carry</th>
            <th className="text-right px-3 py-2">Total</th>
            <th className="text-right px-3 py-2">BS</th>
            <th className="text-right px-3 py-2">CS</th>
            <th className="text-right px-3 py-2">Offline</th>
          </tr>
        </thead>
        <tbody className="font-mono tabular-nums">
          {shots.map((s, i) => (
            <tr key={i} className="border-t border-outline-variant/20">
              <td className="px-3 py-1.5 text-on-surface-variant">{i + 1}</td>
              <td className="px-3 py-1.5 text-on-surface font-semibold">{s.club}</td>
              <td className="px-3 py-1.5 text-right text-on-surface">
                {s.carryDistance?.toFixed(0) ?? "—"}m
              </td>
              <td className="px-3 py-1.5 text-right text-on-surface">
                {s.totalDistance?.toFixed(0) ?? "—"}m
              </td>
              <td className="px-3 py-1.5 text-right text-on-surface-variant">
                {s.ballSpeed?.toFixed(0) ?? "—"}
              </td>
              <td className="px-3 py-1.5 text-right text-on-surface-variant">
                {s.clubSpeed?.toFixed(0) ?? "—"}
              </td>
              <td className="px-3 py-1.5 text-right text-on-surface-variant">
                {s.offlineDistance?.toFixed(1) ?? "—"}m
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
