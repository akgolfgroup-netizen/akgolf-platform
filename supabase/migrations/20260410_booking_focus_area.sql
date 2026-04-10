-- Add FocusArea enum and booking fields for session planning
CREATE TYPE "FocusArea" AS ENUM ('TEE_TOTAL', 'APPROACH', 'SHORT_GAME', 'PUTTING');

ALTER TABLE "Booking" ADD COLUMN "focusArea" "FocusArea";
ALTER TABLE "Booking" ADD COLUMN "playerNotes" TEXT;
