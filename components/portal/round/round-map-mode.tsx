"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { distance } from "@turf/turf";
import { HoleMap } from "./hole-map";
import { ClubSuggester } from "./club-suggester";
import { detectLieFromGps } from "@/lib/portal/round/lie-detection";
import type { ShotData } from "@/lib/portal/round/shot-types";
import { ChevronLeft, ChevronRight, MapPin, Target, RotateCcw } from "lucide-react";

interface HoleData {
  id: string;
  holeNumber: number;
  par: number;
  lengthMeter: number;
  latitude: number | null;
  longitude: number | null;
  greenLat: number | null;
  greenLon: number | null;
  strategyOverlay: Record<string, unknown> | null;
}

export interface RoundMapModeProps {
  roundId: string;
  userId: string;
  courseName: string;
  holes: HoleData[];
  onLogShot: (data: ShotData) => Promise<{ shotId: string } | void>;
  initialHoleIndex?: number;
}

const LIE_LABELS: Record<string, string> = {
  tee: "Tee",
  fairway: "Fairway",
  rough: "Rough",
  bunker: "Bunker",
  green: "Green",
};

export type { ShotData };

export function RoundMapMode({
  roundId,
  userId,
  courseName,
  holes,
  onLogShot,
  initialHoleIndex = 0,
}: RoundMapModeProps) {
  const [currentIdx, setCurrentIdx] = useState(initialHoleIndex);
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [fromPos, setFromPos] = useState<{ lat: number; lng: number } | null>(null);
  const [toPos, setToPos] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedClub, setSelectedClub] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [justLogged, setJustLogged] = useState(false);
  const [shotCounts, setShotCounts] = useState<Record<number, number>>({});

  const hole = holes[currentIdx];

  // GPS-tracking
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setGps(null),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Sett from-posisjon til tee på hullskifte hvis ikke satt
  useEffect(() => {
    if (hole?.latitude != null && hole?.longitude != null) {
      setFromPos({ lat: hole.latitude, lng: hole.longitude });
    } else {
      setFromPos(null);
    }
    setToPos(null);
    setSelectedClub("");
    setJustLogged(false);
  }, [currentIdx, hole]);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setToPos({ lat, lng });
    setJustLogged(false);
  }, []);

  const handleUseGps = useCallback(() => {
    if (gps) {
      setFromPos({ lat: gps.lat, lng: gps.lng });
      setJustLogged(false);
    }
  }, [gps]);

  const distanceMeters = (() => {
    if (!fromPos || !toPos) return 0;
    return Math.round(distance([fromPos.lng, fromPos.lat], [toPos.lng, toPos.lat], { units: "meters" }));
  })();

  const fromLie = (() => {
    if (!fromPos || !hole?.strategyOverlay) return null;
    return detectLieFromGps([fromPos.lng, fromPos.lat], hole.strategyOverlay as Parameters<typeof detectLieFromGps>[1]);
  })();

  const toLie = (() => {
    if (!toPos || !hole?.strategyOverlay) return null;
    return detectLieFromGps([toPos.lng, toPos.lat], hole.strategyOverlay as Parameters<typeof detectLieFromGps>[1]);
  })();

  const toGreenDistance = (() => {
    if (!toPos || hole?.greenLat == null || hole?.greenLon == null) return 0;
    return Math.round(distance([toPos.lng, toPos.lat], [hole.greenLon, hole.greenLat], { units: "meters" }));
  })();

  const handleLogShot = () => {
    if (!hole || !fromPos || !toPos || !selectedClub) return;
    startTransition(async () => {
      const nextShotNumber = (shotCounts[hole.holeNumber] ?? 0) + 1;
      await onLogShot({
        roundId,
        holeId: hole.id,
        holeNumber: hole.holeNumber,
        par: hole.par,
        shotNumber: nextShotNumber,
        club: selectedClub,
        fromLie: fromLie ?? "fairway",
        fromDistance: distanceMeters,
        toLie: toLie ?? "fairway",
        toDistance: toGreenDistance,
        fromLat: fromPos.lat,
        fromLng: fromPos.lng,
        toLat: toPos.lat,
        toLng: toPos.lng,
      });
      setShotCounts((prev) => ({ ...prev, [hole.holeNumber]: nextShotNumber }));
      setJustLogged(true);
      // Flytt from-posisjon til landing for neste slag
      setFromPos({ lat: toPos.lat, lng: toPos.lng });
      setToPos(null);
      setSelectedClub("");
    });
  };

  if (!hole || hole.latitude == null || hole.longitude == null) {
    return (
      <div className="flex items-center justify-center h-64 text-ink-muted">
        Mangler GPS-data for dette hullet
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-surface">
      {/* Header */}
      <div className="shrink-0 px-4 pt-3 pb-2 bg-card border-b border-line">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-ink-muted uppercase tracking-wide">{courseName}</p>
            <h2 className="text-lg font-bold text-ink">
              Hull {hole.holeNumber} <span className="text-ink-muted font-normal">· Par {hole.par} · {hole.lengthMeter} m</span>
            </h2>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              disabled={currentIdx === 0}
              className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5 text-ink" />
            </button>
            <button
              onClick={() => setCurrentIdx((i) => Math.min(holes.length - 1, i + 1))}
              disabled={currentIdx === holes.length - 1}
              className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5 text-ink" />
            </button>
          </div>
        </div>
      </div>

      {/* Kart */}
      <div className="flex-1 min-h-0 relative">
        <HoleMap
          latitude={hole.latitude}
          longitude={hole.longitude}
          greenLat={hole.greenLat}
          greenLon={hole.greenLon}
          zoom={16}
          gpsPosition={gps}
          fromPosition={fromPos}
          toPosition={toPos}
          strategyOverlay={hole.strategyOverlay}
          onMapClick={handleMapClick}
        />

        {/* GPS-knapp */}
        <button
          onClick={handleUseGps}
          className="absolute top-3 right-3 w-11 h-11 rounded-full bg-card shadow-card flex items-center justify-center z-10"
        >
          <MapPin className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Kontrollpanel */}
      <div className="shrink-0 bg-card border-t border-line px-4 py-3 space-y-3">
        {/* Distanse + Lie */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-ink-muted">Distanse</p>
            <p className="text-2xl font-bold tabular-nums text-ink">
              {distanceMeters > 0 ? `${distanceMeters} m` : "—"}
            </p>
          </div>
          {fromLie && (
            <div className="text-right">
              <p className="text-xs text-ink-muted">Lie</p>
              <p className="text-sm font-semibold text-primary">{LIE_LABELS[fromLie] ?? fromLie}</p>
            </div>
          )}
          {toLie && (
            <div className="text-right">
              <p className="text-xs text-ink-muted">Landing</p>
              <p className="text-sm font-semibold text-accent-deep">{LIE_LABELS[toLie] ?? toLie}</p>
            </div>
          )}
        </div>

        {/* Kolleforslag */}
        {distanceMeters > 0 && (
          <ClubSuggester
            distanceMeters={distanceMeters}
            userId={userId}
            selectedClub={selectedClub}
            onSelectClub={setSelectedClub}
          />
        )}

        {/* Til grønn */}
        {toGreenDistance > 0 && (
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <Target className="w-3.5 h-3.5" />
            <span>{toGreenDistance} m til grønn etter landing</span>
          </div>
        )}

        {/* Handlinger */}
        <div className="flex gap-2">
          <button
            onClick={() => { setToPos(null); setSelectedClub(""); }}
            className="flex-1 py-3 rounded-xl border border-line text-sm font-medium text-ink-muted flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Nullstill
          </button>
          <button
            onClick={handleLogShot}
            disabled={!toPos || !selectedClub || isPending}
            className="flex-[2] py-3 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {isPending ? "Lagrer..." : justLogged ? "Slag logget ✓" : "Logg slag"}
          </button>
        </div>
      </div>
    </div>
  );
}
