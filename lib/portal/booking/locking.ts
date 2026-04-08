/**
 * Booking Locking System
 * 
 * Re-eksport fra conflict-check.ts for bakoverkompatibilitet.
 * 
 * @deprecated Bruk funksjoner fra @/lib/portal/booking/conflict-check direkte
 */

export {
  // Konfliktsjekk
  checkDoubleBookingConflict,
  checkBlockedTimeConflict,
  checkAllConflicts,
  validateInstructorAvailability,
  createBookingWithConflictCheck,
  
  // Typer
  type ConflictCheckOptions,
  type ConflictResult,
} from "./conflict-check";
