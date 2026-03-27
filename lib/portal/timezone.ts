/**
 * App-wide timezone for Norway.
 * All InstructorAvailability times are interpreted in this timezone.
 */
export const APP_TIMEZONE = "Europe/Oslo";

/**
 * Convert a HH:MM string to a Date object for a given date in APP_TIMEZONE.
 */
export function parseTimeInTimezone(timeStr: string, date: Date): Date {
  const [hours, minutes] = timeStr.split(":").map(Number);

  // Create a date string in ISO format
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hoursStr = String(hours).padStart(2, "0");
  const minutesStr = String(minutes).padStart(2, "0");
  const isoStr = `${year}-${month}-${day}T${hoursStr}:${minutesStr}:00`;

  // Parse in local timezone (server should be set to Europe/Oslo)
  return new Date(isoStr);
}

/**
 * Format a Date to HH:MM in APP_TIMEZONE.
 */
export function formatTimeInTimezone(date: Date): string {
  return new Intl.DateTimeFormat("nb-NO", {
    timeZone: APP_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * Get current date in APP_TIMEZONE.
 */
export function nowInTimezone(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: APP_TIMEZONE })
  );
}

/**
 * Get day of week (0=Sunday, 1=Monday, etc.) in APP_TIMEZONE.
 */
export function getDayOfWeekInTimezone(date: Date): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIMEZONE,
    weekday: "short",
  });
  const dayStr = formatter.format(date);
  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return dayMap[dayStr] ?? date.getDay();
}
