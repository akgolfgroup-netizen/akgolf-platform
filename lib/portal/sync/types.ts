/**
 * TypeScript types for Real-time Sync System
 * Spillerportal <-> Mission Control
 */

// SyncEventType and SyncEventStatus are not in Prisma schema — define locally
type SyncEventType = string;
 
type SyncEventStatus = string;

// ════════════════════════════════════════════════════════════
// Core Event Types
// ════════════════════════════════════════════════════════════

export interface SyncEventPayload {
  type: SyncEventType;
  payload: unknown;
  timestamp: string;
  eventId: string;
  sourceSystem: 'PORTAL' | 'MISSION_CONTROL' | 'CRON' | 'WEBHOOK';
  sourceUserId?: string;
}

export interface SyncEventWithMetadata extends SyncEventPayload {
  deliveredTo: string[];
  failedFor: string[];
  targetUserIds: string[];
  targetRoles: string[];
}

// ════════════════════════════════════════════════════════════
// Booking Events
// ════════════════════════════════════════════════════════════

export interface BookingCreatedPayload {
  bookingId: string;
  studentId: string;
  instructorId: string;
  serviceTypeId: string;
  startTime: string;
  endTime: string;
  status: string;
  studentName?: string;
  serviceName?: string;
  locationName?: string;
}

export interface BookingUpdatedPayload {
  bookingId: string;
  studentId: string;
  instructorId: string;
  changes: {
    startTime?: string;
    endTime?: string;
    status?: string;
    locationId?: string;
    adminNotes?: string;
  };
  previousValues?: Partial<BookingCreatedPayload>;
}

export interface BookingCancelledPayload {
  bookingId: string;
  studentId: string;
  instructorId: string;
  cancelledAt: string;
  cancelReason?: string;
  refundStatus?: string;
}

export interface BookingRescheduledPayload {
  bookingId: string;
  studentId: string;
  instructorId: string;
  oldStartTime: string;
  oldEndTime: string;
  newStartTime: string;
  newEndTime: string;
  rescheduledBy: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
}

export interface BookingCompletedPayload {
  bookingId: string;
  studentId: string;
  instructorId: string;
  completedAt: string;
  coachingSessionId?: string;
}

// ════════════════════════════════════════════════════════════
// Availability Events
// ════════════════════════════════════════════════════════════

export interface AvailabilityChangedPayload {
  instructorId: string;
  date: string;
  changes: Array<{
    type: 'ADDED' | 'REMOVED' | 'MODIFIED';
    startTime: string;
    endTime: string;
  }>;
  source: 'MANUAL' | 'GOOGLE_CALENDAR' | 'RECURRING';
}

export interface BlockedTimeCreatedPayload {
  blockedTimeId: string;
  instructorId: string;
  startTime: string;
  endTime: string;
  reason?: string;
  source: 'MANUAL' | 'GOOGLE_CALENDAR' | 'FACILITY_BOOKING';
}

export interface BlockedTimeDeletedPayload {
  blockedTimeId: string;
  instructorId: string;
  deletedAt: string;
}

// ════════════════════════════════════════════════════════════
// Coaching Events
// ════════════════════════════════════════════════════════════

export interface CoachingNotesAddedPayload {
  coachingSessionId: string;
  bookingId: string;
  studentId: string;
  instructorId: string;
  hasNotes: boolean;
  hasAiSummary: boolean;
  notesPreview?: string;
}

export interface CoachingNotesUpdatedPayload {
  coachingSessionId: string;
  bookingId: string;
  studentId: string;
  instructorId: string;
  updatedFields: string[];
  aiSummaryUpdated: boolean;
}

// ════════════════════════════════════════════════════════════
// Notification Events
// ════════════════════════════════════════════════════════════

export interface NotificationCreatedPayload {
  notificationId: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  linkUrl?: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH';
}

// ════════════════════════════════════════════════════════════
// User Presence Events
// ════════════════════════════════════════════════════════════

export interface UserPresenceChangedPayload {
  userId: string;
  status: 'ONLINE' | 'AWAY' | 'OFFLINE';
  lastActivityAt?: string;
  currentPage?: string;
}

// ════════════════════════════════════════════════════════════
// Union Type for All Payloads
// ════════════════════════════════════════════════════════════

export type SyncPayload =
  | BookingCreatedPayload
  | BookingUpdatedPayload
  | BookingCancelledPayload
  | BookingRescheduledPayload
  | BookingCompletedPayload
  | AvailabilityChangedPayload
  | BlockedTimeCreatedPayload
  | BlockedTimeDeletedPayload
  | CoachingNotesAddedPayload
  | CoachingNotesUpdatedPayload
  | NotificationCreatedPayload
  | UserPresenceChangedPayload;

// ════════════════════════════════════════════════════════════
// Optimistic Update Types
// ════════════════════════════════════════════════════════════

export interface OptimisticUpdateContext<T = unknown> {
  queryKey: readonly unknown[];
  previousData: T | undefined;
  optimisticData: T;
  rollback: () => void;
}

export interface OptimisticUpdateOptions<T = unknown> {
  queryKey: readonly unknown[];
  updateFn: (oldData: T | undefined) => T;
  onError?: (error: Error, context: OptimisticUpdateContext<T>) => void;
  onSuccess?: (data: T, context: OptimisticUpdateContext<T>) => void;
}

// ════════════════════════════════════════════════════════════
// SSE Connection Types
// ════════════════════════════════════════════════════════════

export interface SSEConnectionState {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastEventAt: string | null;
  reconnectAttempts: number;
  sessionId: string | null;
}

export interface SSEConnectionOptions {
  userId: string;
  userRole: string;
  eventTypes?: SyncEventType[];
  onEvent?: (event: SyncEventPayload) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
}

// ════════════════════════════════════════════════════════════
// Sync State Types
// ════════════════════════════════════════════════════════════

export interface SyncState {
  // Connection state
  isConnected: boolean;
  lastSyncAt: string | null;
  pendingEvents: number;
  
  // UI state
  isSyncing: boolean;
  lastError: string | null;
  
  // Stats
  eventsReceived: number;
  eventsProcessed: number;
}

export interface SyncActions {
  setConnected: (connected: boolean) => void;
  setLastSyncAt: (timestamp: string) => void;
  incrementPending: () => void;
  decrementPending: () => void;
  markEventProcessed: () => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// ════════════════════════════════════════════════════════════
// Event Handler Types
// ════════════════════════════════════════════════════════════

export type EventHandler<T = unknown> = (payload: T, event: SyncEventPayload) => void | Promise<void>;

export interface EventHandlerRegistry {
  [key: string]: EventHandler<unknown>[];
}

// ════════════════════════════════════════════════════════════
// Audit Log Types
// ════════════════════════════════════════════════════════════

export interface AuditLogEntry {
  id: string;
  tableName: string;
  recordId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  before: unknown | null;
  after: unknown | null;
  changedFields: string[];
  userId: string | null;
  userRole: string | null;
  sourceSystem: string;
  correlationId: string | null;
  createdAt: string;
}

// ════════════════════════════════════════════════════════════
// API Response Types
// ════════════════════════════════════════════════════════════

export interface SyncEventsResponse {
  events: SyncEventPayload[];
  hasMore: boolean;
  cursor?: string;
}

export interface SyncStatusResponse {
  isConnected: boolean;
  lastEventAt: string | null;
  pendingEvents: number;
  connections: number;
}
