"use client";

import { Source, Layer } from "react-map-gl/mapbox";
import type { Feature, Polygon, MultiPolygon } from "geojson";

interface OverlayData {
  fairway: Feature<Polygon | MultiPolygon>[] | null;
  rough: Feature<Polygon | MultiPolygon>[] | null;
  greens: Feature<Polygon | MultiPolygon>[] | null;
  bunkers: Feature<Polygon | MultiPolygon>[] | null;
  hazards: Feature<Polygon | MultiPolygon>[] | null;
}

export function MapOverlayLayers({ overlays }: { overlays: OverlayData }) {
  return (
    <>
      {overlays.fairway && (
        <Source id="fairway" type="geojson" data={{ type: "FeatureCollection", features: overlays.fairway }}>
          <Layer id="fairway-fill" type="fill" paint={{ "fill-color": "#4ade80", "fill-opacity": 0.25 }} />
          <Layer id="fairway-line" type="line" paint={{ "line-color": "#4ade80", "line-width": 1, "line-opacity": 0.6 }} />
        </Source>
      )}

      {overlays.rough && (
        <Source id="rough" type="geojson" data={{ type: "FeatureCollection", features: overlays.rough }}>
          <Layer id="rough-fill" type="fill" paint={{ "fill-color": "#a3e635", "fill-opacity": 0.15 }} />
        </Source>
      )}

      {overlays.bunkers && (
        <Source id="bunkers" type="geojson" data={{ type: "FeatureCollection", features: overlays.bunkers }}>
          <Layer id="bunker-fill" type="fill" paint={{ "fill-color": "#facc15", "fill-opacity": 0.35 }} />
          <Layer id="bunker-line" type="line" paint={{ "line-color": "#facc15", "line-width": 1, "line-opacity": 0.7 }} />
        </Source>
      )}

      {overlays.greens && (
        <Source id="greens" type="geojson" data={{ type: "FeatureCollection", features: overlays.greens }}>
          <Layer id="green-fill" type="fill" paint={{ "fill-color": "#34d399", "fill-opacity": 0.4 }} />
          <Layer id="green-line" type="line" paint={{ "line-color": "#34d399", "line-width": 1.5, "line-opacity": 0.8 }} />
        </Source>
      )}

      {overlays.hazards && (
        <Source id="hazards" type="geojson" data={{ type: "FeatureCollection", features: overlays.hazards }}>
          <Layer id="hazard-fill" type="fill" paint={{ "fill-color": "#60a5fa", "fill-opacity": 0.25 }} />
        </Source>
      )}
    </>
  );
}
