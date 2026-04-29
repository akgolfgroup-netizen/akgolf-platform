"use client";

import { useState, useCallback, useTransition } from "react";
import { useParams } from "next/navigation";
import { HoleMap } from "@/components/portal/round/hole-map";
import { importCourseGeoJson } from "@/lib/portal/courses/geojson-actions";
import { Upload, CheckCircle, AlertCircle, Save } from "lucide-react";

interface GeoJsonFeature {
  type: "Feature";
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
  properties?: {
    holeNumber?: number;
    type?: "fairway" | "rough" | "bunker" | "green" | "hazard" | "tee";
    name?: string;
  };
}

interface GeoJsonFeatureCollection {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
}

export default function ImportGeoJsonPage() {
  const params = useParams<{ id: string }>();
  const courseId = params.id;

  const [geojson, setGeojson] = useState<GeoJsonFeatureCollection | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<{ holesUpdated: number } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setError("");
    const file = e.dataTransfer.files[0];
    if (!file) return;
    parseFile(file);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;
    parseFile(file);
  }, []);

  const parseFile = (file: File) => {
    if (!file.name.endsWith(".geojson") && !file.name.endsWith(".json")) {
      setError("Kun .geojson- eller .json-filer støttes");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string) as GeoJsonFeatureCollection;
        if (parsed.type !== "FeatureCollection") {
          setError("Ugyldig GeoJSON: må være FeatureCollection");
          return;
        }
        setGeojson(parsed);
        setResult(null);
      } catch {
        setError("Kunne ikke parse JSON. Sjekk filformatet.");
      }
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    if (!geojson) return;
    startTransition(async () => {
      try {
        const res = await importCourseGeoJson(courseId, geojson);
        setResult(res);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lagring feilet");
      }
    });
  };

  // Vis første hull med polygoner som forhåndsvisning
  const previewHole = (() => {
    if (!geojson) return null;
    const firstFeature = geojson.features.find((f) => f.properties?.holeNumber != null);
    const holeNumber = firstFeature?.properties?.holeNumber ?? 1;
    // Bruk midtpunkt av første polygon som senter
    const firstPoly = firstFeature?.geometry;
    if (!firstPoly) return null;
    const coords =
      firstPoly.type === "MultiPolygon"
        ? (firstPoly.coordinates as number[][][][])[0][0]
        : (firstPoly.coordinates as number[][][])[0];
    const lats = coords.map((c) => c[1]);
    const lngs = coords.map((c) => c[0]);
    const lat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const lng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

    return {
      holeNumber,
      lat,
      lng,
      overlay: {
        fairway: geojson.features.filter((f) => f.properties?.type === "fairway" && f.properties?.holeNumber === holeNumber),
        rough: geojson.features.filter((f) => f.properties?.type === "rough" && f.properties?.holeNumber === holeNumber),
        greens: geojson.features.filter((f) => f.properties?.type === "green" && f.properties?.holeNumber === holeNumber),
        bunkers: geojson.features
          .filter((f) => f.properties?.type === "bunker" && f.properties?.holeNumber === holeNumber)
          .map((f) => ({ polygon: f })),
        hazards: geojson.features.filter((f) => f.properties?.type === "hazard" && f.properties?.holeNumber === holeNumber),
      } as Record<string, unknown>,
    };
  })();

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-ink">Importer bane-GeoJSON</h1>

      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-line rounded-2xl p-8 text-center bg-surface hover:border-primary transition-colors cursor-pointer"
        onClick={() => document.getElementById("geojson-input")?.click()}
      >
        <Upload className="w-8 h-8 text-ink-muted mx-auto mb-3" />
        <p className="text-sm font-medium text-ink">
          Dra GeoJSON-fil hit, eller klikk for å velge
        </p>
        <p className="text-xs text-ink-muted mt-1">.geojson eller .json</p>
        <input
          id="geojson-input"
          type="file"
          accept=".geojson,.json"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {fileName && (
        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <CheckCircle className="w-4 h-4 text-success" />
          {fileName} — {geojson?.features.length ?? 0} features
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-danger bg-danger-soft px-4 py-3 rounded-xl">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {result && (
        <div className="flex items-center gap-2 text-sm text-success bg-success-soft px-4 py-3 rounded-xl">
          <CheckCircle className="w-4 h-4" />
          {result.holesUpdated} hull oppdatert
        </div>
      )}

      {/* Forhåndsvisning */}
      {previewHole && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-ink-muted">Forhåndsvisning — Hull {previewHole.holeNumber}</p>
          <div className="h-80 rounded-xl overflow-hidden">
            <HoleMap
              latitude={previewHole.lat}
              longitude={previewHole.lng}
              zoom={16}
              strategyOverlay={previewHole.overlay}
              interactive={false}
            />
          </div>
        </div>
      )}

      {/* Lagre-knapp */}
      {geojson && (
        <button
          onClick={handleSave}
          disabled={isPending}
          className="w-full py-3 rounded-xl bg-primary text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <Save className="w-4 h-4" />
          {isPending ? "Lagrer..." : "Lagre bane-data"}
        </button>
      )}
    </div>
  );
}
