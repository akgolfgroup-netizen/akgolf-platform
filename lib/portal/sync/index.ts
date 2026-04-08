/**
 * Real-time Sync System
 * 
 * Eksport av alle sync-relaterte moduler.
 * 
 * @example
 * import { 
 *   useSync, 
 *   queryKeys, 
 *   optimisticUpdate,
 *   SyncProvider 
 * } from '@/lib/portal/sync';
 */

// Core
export { queryKeys, matchQueryKey, syncEventToQueryKeys } from './query-keys';
export { useSync, useSyncStatus } from './useSync';
export { useSyncStore } from './sync-store';

// Optimistic updates
export {
  optimisticUpdate,
  addBookingOptimistically,
  cancelBookingOptimistically,
  updateBookingOptimistically,
  removeBookingOptimistically,
  blockTimeOptimistically,
  markNotificationAsReadOptimistically,
  markAllNotificationsAsReadOptimistically,
  addItemToListOptimistically,
  updateItemInListOptimistically,
  removeItemFromListOptimistically,
  debouncedInvalidate,
  invalidateMultiple,
  prefetchWithPriority,
} from './optimistic';

// Server-side helpers
export {
  emitSyncEvent,
  broadcastSyncEvent,
  createSyncEvent,
  logAuditEvent,
} from './server';

// Types
export type {
  SyncEventPayload,
  SyncEventWithMetadata,
  BookingCreatedPayload,
  BookingUpdatedPayload,
  BookingCancelledPayload,
  BookingRescheduledPayload,
  BookingCompletedPayload,
  AvailabilityChangedPayload,
  BlockedTimeCreatedPayload,
  BlockedTimeDeletedPayload,
  CoachingNotesAddedPayload,
  CoachingNotesUpdatedPayload,
  NotificationCreatedPayload,
  UserPresenceChangedPayload,
  SyncPayload,
  OptimisticUpdateContext,
  SSEConnectionState,
  SSEConnectionOptions,
  SyncState,
  SyncActions,
  EventHandler,
  EventHandlerRegistry,
  AuditLogEntry,
  SyncEventsResponse,
  SyncStatusResponse,
} from './types';

// React Query client setup
export { createSyncQueryClient, syncQueryClientConfig } from './query-client';
