-- Add refund idempotency fields to Booking table
-- This migration adds fields to prevent duplicate refunds

-- Add stripeRefundId column
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "stripeRefundId" TEXT;

-- Add refundIdempotencyKey column
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "refundIdempotencyKey" TEXT;

-- Create index for faster lookup by refund ID
CREATE INDEX IF NOT EXISTS "Booking_stripeRefundId_idx" ON "Booking"("stripeRefundId");

-- Create index for idempotency key lookups
CREATE INDEX IF NOT EXISTS "Booking_refundIdempotencyKey_idx" ON "Booking"("refundIdempotencyKey");
