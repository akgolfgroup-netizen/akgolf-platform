"use client";

import { useMemo, useCallback } from "react";
import Map, {
  Marker,
  Source,
  Layer,
  type MapMouseEvent,
  type ViewState,
} from "react-map-gl/mapbox";
import type {
  Feature,
  FeatureCollection,
  LineString,
  Polygon,
  MultiPolygon,
} from "geojson";
import { Flag, MapPin, Navigation } from "lucide-react";
import { MapOverlayLayers } from "./map-overlay-layers";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface HoleMapProps {
  latitude: number;
  longitude: number;
  greenLat?: number | null;
  greenLon?: number | null;
  zoom?: number;
  gpsPosition?: { lat: number; lng: number } | null;
  fromPosition?: { lat: number; lng: number } | null;
  toPosition?: { lat: number; lng: number } | null;
  strategyOverlay?: Record<string, unknown> | null;
  shots?: { fromLat: number; fromLng: number; toLat: number; toLng: number }[];
  onMapClick?: (lat: number, lng: number) => void;
  interactive?: boolean;
}

function extractOverlays(overlay: Record<string, unknown> | null | undefined) {
  if (!overlay) return null;
  const so = overlay as {
    fairway?: Feature<Polygon | MultiPolygon>[];
    rough?: Feature<Polygon | MultiPolygon>[];
    greens?: Feature<Polygon | MultiPolygon>[];
    bunkers?: { polygon: Feature<Polygon | MultiPolygon> }[];
    hazards?: Feature<Polygon | MultiPolygon>[];
  };
  return {
    fairway: so.fairway ?? null,
    rough: so.rough ?? null,
    greens: so.greens ?? null,
    bunkers: so.bunkers ? so.bunkers.map((b) => b.polygon) : null,
    hazards: so.hazards ?? null,
  };
}

export function HoleMap({
  latitude,
  longitude,
  greenLat,
  greenLon,
  zoom = 16,
  gpsPosition,
  fromPosition,
  toPosition,
  strategyOverlay,
  shots,
  onMapClick,
  interactive = true,
}: HoleMapProps) {
  const initialViewState: Partial<ViewState> = {
    latitude,
    longitude,
    zoom,
    bearing: 0,
    pitch: 0,
  };

  const handleClick = useCallback(
    (e: MapMouseEvent) => {
      if (!interactive || !onMapClick) return;
      onMapClick(e.lngLat.lat, e.lngLat.lng);
    },
    [interactive, onMapClick]
  );

  const overlays = useMemo(() => extractOverlays(strategyOverlay), [strategyOverlay]);

  const shotLines = useMemo((): FeatureCollection<LineString> | null => {
    const lines: Feature<LineString>[] = [];
    if (fromPosition && toPosition) {
      lines.push({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [fromPosition.lng, fromPosition.lat],
            [toPosition.lng, toPosition.lat],
          ],
        },
      });
    }
    if (shots) {
      for (const shot of shots) {
        lines.push({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [
              [shot.fromLng, shot.fromLat],
              [shot.toLng, shot.toLat],
            ],
          },
        });
      }
    }
    return lines.length > 0 ? { type: "FeatureCollection", features: lines } : null;
  }, [fromPosition, toPosition, shots]);

  if (!MAPBOX_TOKEN) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center text-center px-6 rounded-xl"
        style={{
          background: "var(--color-surface-soft, #EDF1EE)",
          border: "1px dashed var(--color-line, #E4EAE6)",
        }}
      >
        <MapPin
          className="w-10 h-10 mb-3"
          style={{ color: "var(--color-ink-subtle, #8A958E)" }}
        />
        <p
          className="text-sm font-bold mb-1"
          style={{
            color: "var(--color-ink, #0A1F18)",
            fontFamily: "var(--font-inter-tight), Inter, sans-serif",
          }}
        >
          Kart-modus er ikke aktivert
        </p>
        <p
          className="text-xs max-w-sm"
          style={{ color: "var(--color-ink-muted, #5C6B62)" }}
        >
          Mapbox-token mangler. Be om at kart-funksjonen aktiveres ved å
          kontakte AK Golf-support.
        </p>
      </div>
    );
  }

  return (
    <Map
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={initialViewState}
      style={{ width: "100%", height: "100%", borderRadius: "12px" }}
      mapStyle="mapbox://styles/mapbox/satellite-v9"
      onClick={handleClick}
      attributionControl={false}
      touchZoomRotate
    >
      {overlays && <MapOverlayLayers overlays={overlays} />}

      {shotLines && (
        <Source id="shots" type="geojson" data={shotLines}>
          <Layer
            id="shot-line"
            type="line"
            paint={{
              "line-color": "#D1F843",
              "line-width": 3,
              "line-opacity": 0.9,
            }}
          />
        </Source>
      )}

      <Marker latitude={latitude} longitude={longitude} anchor="bottom">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <span className="text-[10px] font-bold text-white bg-primary px-1.5 rounded mt-0.5 shadow">
            Tee
          </span>
        </div>
      </Marker>

      {greenLat != null && greenLon != null && (
        <Marker latitude={greenLat} longitude={greenLon} anchor="bottom">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-lg">
              <Flag className="w-4 h-4 text-ink" />
            </div>
            <span className="text-[10px] font-bold text-ink bg-accent px-1.5 rounded mt-0.5 shadow">
              Hull
            </span>
          </div>
        </Marker>
      )}

      {gpsPosition && (
        <Marker latitude={gpsPosition.lat} longitude={gpsPosition.lng}>
          <div className="relative">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-md" />
            <div className="absolute inset-0 w-4 h-4 rounded-full bg-blue-500 animate-ping opacity-50" />
          </div>
        </Marker>
      )}

      {fromPosition && (
        <Marker latitude={fromPosition.lat} longitude={fromPosition.lng}>
          <div className="w-5 h-5 rounded-full bg-white border-[3px] border-primary shadow-lg flex items-center justify-center">
            <Navigation className="w-3 h-3 text-primary" />
          </div>
        </Marker>
      )}

      {toPosition && (
        <Marker latitude={toPosition.lat} longitude={toPosition.lng}>
          <div className="w-5 h-5 rounded-full bg-accent border-[3px] border-ink shadow-lg" />
        </Marker>
      )}
    </Map>
  );
}
