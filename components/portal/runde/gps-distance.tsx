"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useEffect, useCallback, useRef } from "react";

import { haversineDistance, playsAsDistance } from "@/lib/portal/golf/gps/distance-calculator";

interface GPSDistanceProps {
  greenLat: number | null;
  greenLon: number | null;
  /** Hoydeforskjell i meter (+ = oppover) */
  elevation?: number;
  /** Vindhastighet i m/s */
  windSpeed?: number;
  /** Vindretning relativt til slagretning (0=medvind, 180=motvind) */
  windDirection?: number;
}

type GPSState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "active"; distance: number; playsAs: number | null; accuracy: number }
  | { status: "denied" }
  | { status: "unavailable" };

export function GPSDistance({
  greenLat,
  greenLon,
  elevation,
  windSpeed,
  windDirection,
}: GPSDistanceProps) {
  const [state, setState] = useState<GPSState>({ status: "idle" });
  const watchIdRef = useRef<number | null>(null);

  const stopWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const startWatch = useCallback(() => {
    if (!greenLat || !greenLon) return;
    if (!navigator.geolocation) {
      setState({ status: "unavailable" });
      return;
    }

    setState({ status: "loading" });

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const dist = haversineDistance(latitude, longitude, greenLat, greenLon);

        const hasWind = windSpeed !== undefined && windDirection !== undefined;
        const hasAdjustment = elevation !== undefined || hasWind;

        const plays = hasAdjustment
          ? playsAsDistance(dist, elevation ?? 0, windSpeed ?? 0, windDirection ?? 0)
          : null;

        setState({
          status: "active",
          distance: dist,
          playsAs: plays !== null && plays !== dist ? plays : null,
          accuracy: Math.round(accuracy),
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setState({ status: "denied" });
        } else {
          setState({ status: "unavailable" });
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000,
      }
    );
  }, [greenLat, greenLon, elevation, windSpeed, windDirection]);

  useEffect(() => {
    return stopWatch;
  }, [stopWatch]);

  // Ingen green-koordinater tilgjengelig
  if (!greenLat || !greenLon) return null;

  // Ikke startet enna
  if (state.status === "idle") {
    return (
      <button
        onClick={startWatch}
        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-grey-100)] text-[var(--color-grey-600)] text-sm font-medium hover:bg-[var(--color-grey-200)] transition-colors mt-2"
      >
        <Icon name="navigation" className="h-4 w-4" />
        Aktiver GPS-avstand
      </button>
    );
  }

  if (state.status === "loading") {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-grey-100)] text-[var(--color-grey-500)] text-sm mt-2">
        <div className="h-4 w-4 border-2 border-[var(--color-grey-300)] border-t-[var(--color-brand)] rounded-full animate-spin" />
        Henter posisjon...
      </div>
    );
  }

  if (state.status === "denied") {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-error)]/5 text-[var(--color-error)] text-sm mt-2">
        <Icon name="location_off" className="h-4 w-4" />
        GPS-tilgang avslatt. Aktiver i nettleserinnstillinger.
      </div>
    );
  }

  if (state.status === "unavailable") {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-grey-100)] text-[var(--color-grey-500)] text-sm mt-2">
        <Icon name="location_off" className="h-4 w-4" />
        GPS ikke tilgjengelig.
      </div>
    );
  }

  // Aktiv visning
  return (
    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[var(--color-grey-100)] mt-2">
      <div className="flex items-center gap-2">
        <Icon name="navigation" className="h-4 w-4 text-[var(--color-brand)]" />
        <span className="text-sm font-bold text-[var(--color-grey-900)] tabular-nums">
          {state.distance}m
        </span>
        {state.playsAs !== null && (
          <span className="text-xs text-[var(--color-grey-500)]">
            (spiller som {state.playsAs}m)
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-[var(--color-grey-400)]">
          +/- {state.accuracy}m
        </span>
        <button
          onClick={stopWatch}
          className="text-xs text-[var(--color-grey-500)] hover:text-[var(--color-grey-700)] transition-colors"
        >
          Stopp
        </button>
      </div>
    </div>
  );
}
