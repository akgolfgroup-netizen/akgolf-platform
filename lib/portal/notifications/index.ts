/**
 * Notifikasjons-system for Spillerportal og CoachHQ
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
  // Spillerportal → CoachHQ
  notifyNewBooking,
  notifyBookingCancelled,
  notifyVideoUploaded,
  notifyDiaryEntry,
  notifyPlayerQuestion,
  
  // CoachHQ → Spillerportal
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
