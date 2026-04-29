-- Round/UpGame Pro Sprint A: Live shot-logging foundation
--
-- Folger UpGame Pro / Arccos-modellen for shot-by-shot logging med GPS:
--   1. GPS-koordinater pa hvert Shot (fra-til posisjon + elevasjon)
--   2. Tidsstempel per slag for tempo- og pace-analyse
--   3. Lie-detalj (semi-rough, fairway-bunker, etc.)
--   4. ClubInBag-modell for spilleren's valgte 14 koller (med distansetabell)
--
-- Senere sprints utvider med:
--   - Sprint B: Mapbox-kart UI for live-logging
--   - Sprint C: Auto-detect lie via GPS + course-overlay
--   - Sprint D: Real-time SG-beregning under runden
--   - Sprint E: Post-runde analyse + share-flow

-- ── 1. GPS pa Shot ──────────────────────────────────────
ALTER TABLE "Shot" ADD COLUMN IF NOT EXISTS "fromLat" DOUBLE PRECISION;
ALTER TABLE "Shot" ADD COLUMN IF NOT EXISTS "fromLng" DOUBLE PRECISION;
ALTER TABLE "Shot" ADD COLUMN IF NOT EXISTS "toLat" DOUBLE PRECISION;
ALTER TABLE "Shot" ADD COLUMN IF NOT EXISTS "toLng" DOUBLE PRECISION;
ALTER TABLE "Shot" ADD COLUMN IF NOT EXISTS "elevationDelta" INTEGER;
ALTER TABLE "Shot" ADD COLUMN IF NOT EXISTS "loggedAt" TIMESTAMP(3);

-- Detaljert lie (utvidelse av eksisterende fromLie/toLie streng-felt)
ALTER TABLE "Shot" ADD COLUMN IF NOT EXISTS "fromLieDetail" TEXT;
ALTER TABLE "Shot" ADD COLUMN IF NOT EXISTS "toLieDetail" TEXT;

-- Index for tids-baserte queries (siste runder, pace-analyse)
CREATE INDEX IF NOT EXISTS "Shot_loggedAt_idx" ON "Shot"("loggedAt");

-- ── 2. ClubInBag-modell ────────────────────────────────
CREATE TABLE IF NOT EXISTS "ClubInBag" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "userId" TEXT NOT NULL,
    "club" TEXT NOT NULL,
    "loft" DOUBLE PRECISION,
    "shaft" TEXT,
    "avgCarryMeters" DOUBLE PRECISION,
    "avgTotalMeters" DOUBLE PRECISION,
    "isInActiveBag" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ClubInBag_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ClubInBag_userId_club_key" UNIQUE ("userId", "club"),
    CONSTRAINT "ClubInBag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE INDEX IF NOT EXISTS "ClubInBag_userId_idx" ON "ClubInBag"("userId");
CREATE INDEX IF NOT EXISTS "ClubInBag_userId_isInActiveBag_idx" ON "ClubInBag"("userId", "isInActiveBag");

-- ── 3. RoundLiveState — for pause/resume av live-runder ──
-- En spiller kan kun ha en aktiv "live" runde av gangen.
CREATE TABLE IF NOT EXISTS "RoundLiveState" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "roundId" TEXT NOT NULL,
    "currentHoleNumber" INTEGER NOT NULL DEFAULT 1,
    "currentShotNumber" INTEGER NOT NULL DEFAULT 0,
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "pausedAt" TIMESTAMP(3),
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deviceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RoundLiveState_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "RoundLiveState_roundId_key" UNIQUE ("roundId"),
    CONSTRAINT "RoundLiveState_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE INDEX IF NOT EXISTS "RoundLiveState_roundId_idx" ON "RoundLiveState"("roundId");
