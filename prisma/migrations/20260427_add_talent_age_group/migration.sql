-- NGF-kompatible aldersgrupper. Spillerens alder = aaret de fyller, ikke
-- faktisk dato. Standard runde for alle klasser er 18 hull.
CREATE TYPE "TalentAgeGroup" AS ENUM (
  'M5','M8','M10','M12',
  'G15','G19',
  'J12','J15','J19',
  'HERR','DAME',
  'HERR_SENIOR','DAME_SENIOR',
  'MIX','UKJENT'
);

ALTER TABLE "TalentTournamentResult"
  ADD COLUMN "ageGroup" "TalentAgeGroup" NOT NULL DEFAULT 'UKJENT';

CREATE INDEX "TalentTournamentResult_ageGroup_idx"
  ON "TalentTournamentResult"("ageGroup");
