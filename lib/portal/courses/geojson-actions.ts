"use server";

import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import type { Prisma } from "@prisma/client";

interface GeoJsonFeatureProperties {
  holeNumber?: number;
  type?: "fairway" | "rough" | "bunker" | "green" | "hazard" | "tee";
  name?: string;
}

interface GeoJsonFeature {
  type: "Feature";
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
  properties?: GeoJsonFeatureProperties;
}

interface GeoJsonFeatureCollection {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
}

interface Bounds {
  min: number;
  max: number;
}

function extractBounds(geojson: GeoJsonFeatureCollection): {
  lat: Bounds;
  lng: Bounds;
} {
  let minLat = 90;
  let maxLat = -90;
  let minLng = 180;
  let maxLng = -180;

  for (const feature of geojson.features) {
    const coords = feature.geometry.coordinates;
    const isMulti = feature.geometry.type === "MultiPolygon";
    const polygons = isMulti
      ? ((coords as unknown) as number[][][][]).flat()
      : ((coords as unknown) as number[][][]);

    for (const polygon of polygons) {
      for (const ring of polygon) {
        for (const point of ring as unknown as number[][]) {
          const lng = point[0];
          const lat = point[1];
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
          if (lng < minLng) minLng = lng;
          if (lng > maxLng) maxLng = lng;
        }
      }
    }
  }

  return {
    lat: { min: minLat, max: maxLat },
    lng: { min: minLng, max: maxLng },
  };
}

function extractHoleOverlays(
  geojson: GeoJsonFeatureCollection
): Map<number, Record<string, unknown>> {
  const holeMap = new Map<number, Record<string, unknown>>();

  for (const feature of geojson.features) {
    const holeNumber = feature.properties?.holeNumber;
    const type = feature.properties?.type;
    if (!holeNumber || !type) continue;

    if (!holeMap.has(holeNumber)) {
      holeMap.set(holeNumber, {
        fairway: [],
        rough: [],
        bunkers: [],
        greens: [],
        hazards: [],
      });
    }

    const overlay = holeMap.get(holeNumber)!;
    const geometry = feature.geometry;

    switch (type) {
      case "fairway":
        (overlay.fairway as GeoJsonFeature[]).push(feature);
        break;
      case "rough":
        (overlay.rough as GeoJsonFeature[]).push(feature);
        break;
      case "bunker":
        (overlay.bunkers as { name?: string; polygon: GeoJsonFeature }[]).push({
          name: feature.properties?.name,
          polygon: feature,
        });
        break;
      case "green":
        (overlay.greens as GeoJsonFeature[]).push(feature);
        break;
      case "hazard":
        (overlay.hazards as GeoJsonFeature[]).push(feature);
        break;
    }
  }

  return holeMap;
}

/**
 * Admin: importer GeoJSON for en bane og oppdater hull-overlay.
 */
export async function importCourseGeoJson(
  courseId: string,
  geojson: GeoJsonFeatureCollection
): Promise<{ holesUpdated: number }> {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    throw new Error("Kun admin og coach kan importere bane-data.");
  }

  const bounds = extractBounds(geojson);
  const holeOverlays = extractHoleOverlays(geojson);

  // Oppdater Course med geojson og bounds
  await prisma.course.update({
    where: { id: courseId },
    data: {
      geojson: geojson as unknown as Prisma.InputJsonValue,
      boundsLat: bounds.lat as unknown as Prisma.InputJsonValue,
      boundsLng: bounds.lng as unknown as Prisma.InputJsonValue,
    },
  });

  // Oppdater hvert hull med strategyOverlay
  let holesUpdated = 0;
  for (const [holeNumber, overlay] of holeOverlays) {
    const result = await prisma.hole.updateMany({
      where: { courseId, holeNumber },
      data: {
        strategyOverlay: overlay as unknown as Prisma.InputJsonValue,
      },
    });
    holesUpdated += result.count;
  }

  return { holesUpdated };
}

/**
 * Hent bane med geojson og hull-overlay (for kart-visning).
 */
export async function getCourseForMap(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      name: true,
      geojson: true,
      boundsLat: true,
      boundsLng: true,
      Hole: {
        select: {
          id: true,
          holeNumber: true,
          par: true,
          lengthMeter: true,
          latitude: true,
          longitude: true,
          greenLat: true,
          greenLon: true,
          strategyOverlay: true,
        },
        orderBy: { holeNumber: "asc" },
      },
    },
  });

  return course;
}
