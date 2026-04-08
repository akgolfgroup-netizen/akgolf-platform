/**
 * Notifikasjons-system for Spillerportal og Mission Control
 * 
 * Eksporterer alle typer, funksjoner og triggere for notifikasjoner
 */

// Typer
export * from "./types";

// Opprettelse og håndtering
export {
  createNotification,
  createBulkNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getNotifications,
  getUnreadCount,
  cleanupOldNotifications,
} from "./create";

// Triggere for spesifikke hendelser
export {
  // Spillerportal → Mission Control
  notifyNewBooking,
  notifyBookingCancelled,
  notifyVideoUploaded,
  notifyDiaryEntry,
  notifyPlayerQuestion,
  
  // Mission Control → Spillerportal
  notifyBookingConfirmed,
  notifyBookingRescheduled,
  notifyCoachingNotesAdded,
  notifyTrainingPlanReady,
  notifyBookingReminder,
  notifyGoalAchieved,
  
  // Batch/Cron operasjoner
  sendBookingReminders,
  sendAdminDailySummary,
} from "./triggers";
