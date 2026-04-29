-- Manuell treningsplanlegger: legg til Område og Reps på TrainingPlanSession
-- Område-kode fra TRENINGSOMRADER (PUTT, CHIP, IRON_50_100, etc.)
-- repsTotal er valgfri totalsum for hele økten
ALTER TABLE "TrainingPlanSession" ADD COLUMN "area" TEXT;
ALTER TABLE "TrainingPlanSession" ADD COLUMN "repsTotal" INTEGER;
