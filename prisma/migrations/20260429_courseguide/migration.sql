-- Feature F3: Baneguide med Mapbox-integrasjon
-- Utvid Course og Hole med geo-data

ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "geojson" JSONB;
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "boundsLat" JSONB;
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "boundsLng" JSONB;

ALTER TABLE "Hole" ADD COLUMN IF NOT EXISTS "strategyOverlay" JSONB;
