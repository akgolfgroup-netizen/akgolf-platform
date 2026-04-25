-- Add guest fields to Booking table for guest checkout
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "guestEmail" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "guestName" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "guestPhone" TEXT;
