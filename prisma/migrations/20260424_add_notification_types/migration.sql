-- Add new NotificationType enum values for coaching summary draft flow
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'COACHING_SUMMARY_DRAFT';
