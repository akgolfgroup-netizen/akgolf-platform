/**
 * Centraliserte Query Keys for TanStack Query
 * 
 * Disse sikrer konsistent cache-invalidasjon på tvers av applikasjonen.
 * Alle query keys er hierarkiske for presis invalidasjon.
 * 
 * @example
 * // Invalidere alle bookings
 * queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all })
 * 
 * // Invalidere bookings for spesifikk elev
 * queryClient.invalidateQueries({ queryKey: queryKeys.bookings.byStudent(studentId) })
 */

export const queryKeys = {
  // Bookings
  bookings: {
    all: ['bookings'] as const,
    lists: () => [...queryKeys.bookings.all, 'list'] as const,
    list: (filters: { status?: string; dateFrom?: string; dateTo?: string; instructorId?: string }) => 
      [...queryKeys.bookings.lists(), filters] as const,
    byStudent: (studentId: string) => [...queryKeys.bookings.all, 'student', studentId] as const,
    byInstructor: (instructorId: string) => [...queryKeys.bookings.all, 'instructor', instructorId] as const,
    byDate: (date: string) => [...queryKeys.bookings.all, 'date', date] as const,
    byDateRange: (from: string, to: string) => [...queryKeys.bookings.all, 'range', from, to] as const,
    byId: (id: string) => [...queryKeys.bookings.all, 'detail', id] as const,
    today: (userId: string, role: string) => [...queryKeys.bookings.all, 'today', userId, role] as const,
    upcoming: (userId: string, limit?: number) => [...queryKeys.bookings.all, 'upcoming', userId, limit] as const,
  },

  // Coaching Sessions
  coachingSessions: {
    all: ['coachingSessions'] as const,
    byStudent: (studentId: string) => [...queryKeys.coachingSessions.all, 'student', studentId] as const,
    byInstructor: (instructorId: string) => [...queryKeys.coachingSessions.all, 'instructor', instructorId] as const,
    byBooking: (bookingId: string) => [...queryKeys.coachingSessions.all, 'booking', bookingId] as const,
    byId: (id: string) => [...queryKeys.coachingSessions.all, 'detail', id] as const,
    notes: (sessionId: string) => [...queryKeys.coachingSessions.all, 'notes', sessionId] as const,
  },

  // Availability
  availability: {
    all: ['availability'] as const,
    byInstructor: (instructorId: string) => [...queryKeys.availability.all, 'instructor', instructorId] as const,
    byDate: (instructorId: string, date: string) => 
      [...queryKeys.availability.all, 'instructor', instructorId, 'date', date] as const,
    byRange: (instructorId: string, from: string, to: string) => 
      [...queryKeys.availability.all, 'instructor', instructorId, 'range', from, to] as const,
    slots: (instructorId: string, date: string, duration?: number) => 
      [...queryKeys.availability.all, 'slots', instructorId, date, duration] as const,
  },

  // Blocked Time
  blockedTime: {
    all: ['blockedTime'] as const,
    byInstructor: (instructorId: string) => [...queryKeys.blockedTime.all, 'instructor', instructorId] as const,
    byDate: (instructorId: string, date: string) => 
      [...queryKeys.blockedTime.all, 'instructor', instructorId, 'date', date] as const,
    byRange: (instructorId: string, from: string, to: string) => 
      [...queryKeys.blockedTime.all, 'instructor', instructorId, 'range', from, to] as const,
  },

  // Notifications
  notifications: {
    all: ['notifications'] as const,
    byUser: (userId: string) => [...queryKeys.notifications.all, 'user', userId] as const,
    unread: (userId: string) => [...queryKeys.notifications.all, 'unread', userId] as const,
    count: (userId: string) => [...queryKeys.notifications.all, 'count', userId] as const,
  },

  // User/Profile
  user: {
    all: ['user'] as const,
    byId: (id: string) => [...queryKeys.user.all, 'detail', id] as const,
    profile: (id: string) => [...queryKeys.user.all, 'profile', id] as const,
    stats: (id: string) => [...queryKeys.user.all, 'stats', id] as const,
    subscription: (id: string) => [...queryKeys.user.all, 'subscription', id] as const,
  },

  // Students (admin view)
  students: {
    all: ['students'] as const,
    lists: () => [...queryKeys.students.all, 'list'] as const,
    list: (filters: { search?: string; tier?: string; status?: string }) => 
      [...queryKeys.students.lists(), filters] as const,
    byId: (id: string) => [...queryKeys.students.all, 'detail', id] as const,
    progress: (id: string) => [...queryKeys.students.all, 'progress', id] as const,
    bookings: (id: string) => [...queryKeys.students.all, 'bookings', id] as const,
  },

  // Calendar
  calendar: {
    all: ['calendar'] as const,
    events: (userId: string, from: string, to: string) => 
      [...queryKeys.calendar.all, 'events', userId, from, to] as const,
  },

  // Training
  training: {
    all: ['training'] as const,
    plans: (userId: string) => [...queryKeys.training.all, 'plans', userId] as const,
    planById: (id: string) => [...queryKeys.training.all, 'plan', id] as const,
    logs: (userId: string) => [...queryKeys.training.all, 'logs', userId] as const,
    logById: (id: string) => [...queryKeys.training.all, 'log', id] as const,
  },

  // Service Types
  serviceTypes: {
    all: ['serviceTypes'] as const,
    lists: () => [...queryKeys.serviceTypes.all, 'list'] as const,
    byId: (id: string) => [...queryKeys.serviceTypes.all, 'detail', id] as const,
    byInstructor: (instructorId: string) => [...queryKeys.serviceTypes.all, 'instructor', instructorId] as const,
  },

  // Locations & Facilities
  locations: {
    all: ['locations'] as const,
    byId: (id: string) => [...queryKeys.locations.all, 'detail', id] as const,
  },

  facilities: {
    all: ['facilities'] as const,
    byId: (id: string) => [...queryKeys.facilities.all, 'detail', id] as const,
    byLocation: (locationId: string) => [...queryKeys.facilities.all, 'location', locationId] as const,
    activities: (facilityId: string, from: string, to: string) => 
      [...queryKeys.facilities.all, 'activities', facilityId, from, to] as const,
  },

  // Sync Events (for admin/debug)
  sync: {
    all: ['sync'] as const,
    events: (filters?: { status?: string; type?: string }) => 
      [...queryKeys.sync.all, 'events', filters] as const,
    connections: () => [...queryKeys.sync.all, 'connections'] as const,
    auditLog: (tableName?: string, recordId?: string) => 
      [...queryKeys.sync.all, 'audit', tableName, recordId] as const,
  },
} as const;

/**
 * Hjelpefunksjon for å matche query keys med wildcards
 * Brukes i sync-listeners for å vite hvilke queries som skal invalidates
 */
export function matchQueryKey(
  key: readonly unknown[],
  pattern: readonly (string | symbol)[]
): boolean {
  if (key.length < pattern.length) return false;
  
  for (let i = 0; i < pattern.length; i++) {
    const patternPart = pattern[i];
    if (patternPart === '*') continue; // Wildcard matcher alt
    if (key[i] !== patternPart) return false;
  }
  
  return true;
}

/**
 * Mapping fra SyncEventType til query keys som skal invalidates
 */
export const syncEventToQueryKeys: Array<{ type: string; pattern: readonly string[] }> = [
  // Bookings
  { type: 'BOOKING_CREATED', pattern: ['bookings'] },
  { type: 'BOOKING_UPDATED', pattern: ['bookings'] },
  { type: 'BOOKING_CANCELLED', pattern: ['bookings'] },
  { type: 'BOOKING_RESCHEDULED', pattern: ['bookings'] },
  { type: 'BOOKING_COMPLETED', pattern: ['bookings', 'coachingSessions'] },
  
  // Availability
  { type: 'AVAILABILITY_CHANGED', pattern: ['availability'] },
  { type: 'BLOCKED_TIME_CREATED', pattern: ['blockedTime', 'availability'] },
  { type: 'BLOCKED_TIME_DELETED', pattern: ['blockedTime', 'availability'] },
  
  // Coaching
  { type: 'COACHING_NOTES_ADDED', pattern: ['coachingSessions'] },
  { type: 'COACHING_NOTES_UPDATED', pattern: ['coachingSessions'] },
  
  // Notifications
  { type: 'NOTIFICATION_CREATED', pattern: ['notifications'] },
];

export type QueryKeys = typeof queryKeys;
