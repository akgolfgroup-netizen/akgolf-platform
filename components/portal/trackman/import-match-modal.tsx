"use client";

import { useState, useTransition } from "react";
import { X, Upload, Target, CheckCircle, AlertTriangle, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QualityBadge } from "./quality-badge";
import { SessionMatcher } from "./session-matcher";
import type { DataQualityLevel } from "@/lib/portal/training-research/constants";

interface ImportMatchModalProps {
  onClose: () => void;
  onImported: () => void;
}

interface MatchResult {
  phaseId: string | null;
  phaseTitle: string | null;
  matchScore: number;
  matchWarnings: string[];
  autoMatched: boolean;
  dataQuality: DataQualityLevel;
}

interface ImportResponse {
  sessionQuality: {
    quality: DataQualityLevel;
    score: number;
    confidence: number;
    warnings: string[];
  };
  matchResult: MatchResult;
  savedSession: unknown;
  planId: string;
  club: string;
  shotCount: number;
}

export function ImportMatchModal({ onClose, onImported }: ImportMatchModalProps) {
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(null);
      setError(null);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setError(null);

    startTransition(async () => {
      try {
        const text = await file.text();
        // Parse CSV — forventer TrackMan CSV med kolonner
        const lines = text.split("\n").filter((l) => l.trim());
        const headers = lines[0]?.split(",").map((h) => h.trim()) ?? [];
        const rows = lines.slice(1);

        // TrackMan CSV-kolonner vi bryr oss om
        const shots = rows
          .map((row) => {
            const cols = row.split(",");
            const get = (name: string) => {
              const idx = headers.indexOf(name);
              return idx >= 0 ? parseFloat(cols[idx]) : null;
            };
            const getStr = (name: string) => {
              const idx = headers.indexOf(name);
              return idx >= 0 ? cols[idx]?.trim() : null;
            };

            return {
              club: getStr("Club") ?? getStr("Club Type") ?? "Unknown",
              ballSpeed: get("Ball Speed"),
              carryDistance: get("Carry Distance"),
              smashFactor: get("Smash Factor"),
              offline: get("Offline"),
              spinRate: get("Spin Rate"),
              launchAngle: get("Launch Angle"),
              clubPath: get("Club Path"),
              faceToPath: get("Face to Path"),
            };
          })
          .filter((s) => s.club && s.club !== "Unknown");

        if (shots.length === 0) {
          setError("Fant ingen gyldige slag i CSV-filen");
          return;
        }

        const res = await fetch("/api/portal/trackman/import-and-match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            shots,
            sessionDate: new Date().toISOString(),
            fileName: file.name,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Ukjent feil");
          return;
        }

        setPreview(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Feil ved parsing av CSV");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <Card className="w-full max-w-lg bg-card rounded-2xl border border-line shadow-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-ink">TrackMan-import</h3>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {!preview ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-line rounded-xl p-8 text-center hover:border-primary/40 transition-colors">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="trackman-csv"
              />
              <label htmlFor="trackman-csv" className="cursor-pointer">
                <Upload className="w-8 h-8 text-ink-subtle mx-auto mb-3" />
                <p className="text-sm text-ink-muted">
                  {file ? file.name : "Klikk for å velge TrackMan CSV"}
                </p>
                <p className="text-xs text-ink-subtle mt-1">
                  TrackMan Session Report (.csv)
                </p>
              </label>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-danger/5 border border-danger/20">
                <AlertTriangle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                <p className="text-xs text-danger">{error}</p>
              </div>
            )}

            <Button
              className="w-full"
              disabled={!file || isPending}
              onClick={handleUpload}
            >
              {isPending ? "Analyserer..." : "Analyser og match"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Kvalitets-badge */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-soft/50 border border-line-soft">
              <div className="shrink-0">
                <QualityBadge
                  quality={preview.sessionQuality.quality}
                  score={preview.sessionQuality.score}
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-ink-muted">
                  {preview.shotCount} slag med {preview.club} ·{" "}
                  {Math.round(preview.sessionQuality.confidence * 100)}% confidence
                </p>
              </div>
            </div>

            {/* Match-resultat */}
            <div className="p-4 rounded-lg border border-line">
              <h4 className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-2">
                Automatisk matching
              </h4>
              <SessionMatcher result={preview.matchResult} />
              {preview.matchResult.matchScore < 40 && (
                <p className="text-xs text-ink-subtle mt-2">
                  Lav match-score. Vurder å logge manuelt.
                </p>
              )}
            </div>

            {/* Lagrings-status */}
            {preview.savedSession ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-success/5 border border-success/20">
                <CheckCircle className="w-4 h-4 text-success" />
                <p className="text-xs text-success">
                  Lagret som økt i {preview.matchResult.phaseTitle ?? "planen"}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/5 border border-warning/20">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <p className="text-xs text-warning">
                  Ikke lagret — match-score for lav (&lt; 40%)
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setPreview(null)}>
                Last opp ny
              </Button>
              <Button className="flex-1" onClick={() => { onImported(); onClose(); }}>
                Ferdig
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
