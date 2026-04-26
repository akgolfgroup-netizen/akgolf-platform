-- Tillatt UI-filtrering av spesifikke turneringsformater (f.eks. lokale
-- Elitematch-serier som ikke hører hjemme i nasjonal-scouting-visningen).
ALTER TABLE "TalentTournamentResult"
  ADD COLUMN "excludeFromUi" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "TalentTournamentResult_excludeFromUi_idx"
  ON "TalentTournamentResult"("excludeFromUi");
