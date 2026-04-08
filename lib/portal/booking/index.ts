/**
 * Booking Module
 * 
 * Hovedeksport for booking-systemet.
 */

// Konfliktsjekk og validering
export {
  checkDoubleBookingConflict,
  checkBlockedTimeConflict,
  checkAllConflicts,
  validateInstructorAvailability,
  createBookingWithConflictCheck,
  type ConflictCheckOptions,
  type ConflictResult,
} from "./conflict-check";

// Caching og sanntid
export {
  getCachedSlots,
  invalidateSlotsCache,
  invalidateBookingsCache,
  realtimeCache,
  CACHE_TTL,
  CACHE_TAGS,
} from "./cache";

// Abonnement-kvote
export {
  checkUserQuota,
  checkBookingWindow,
  consumeSession,
  releaseSession,
  type QuotaCheckResult,
  type BookingWindowResult,
} from "./subscription-quota";

// Auto-opprett bruker
export { autoCreateUser } from "./auto-create-user";

// Annullering og refusjon (eksisterende)
export * from "./refund";
export * from "./cancellation-policy";
export * from "./waitlist";
export * from "./reschedule";
