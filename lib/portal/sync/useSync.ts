/**
 * useSync Hook
 * 
 * Hoved-hook for å lytte på sync events via SSE og håndtere
 * automatisk cache-invalidasjon med TanStack Query.
 * 
 * @example
 * function Dashboard() {
 *   useSync({
 *     userId: user.id,
 *     userRole: user.role,
 *     onEvent: (event) => console.log('Sync event:', event),
 *   });
 *   return <div>...</div>;
 * }
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSyncStore } from './sync-store';
import { queryKeys } from './query-keys';
import type { 
  SyncEventPayload, 
  BookingCreatedPayload,
  BookingUpdatedPayload,
  BookingCancelledPayload,
  BookingRescheduledPayload,
  AvailabilityChangedPayload,
  CoachingNotesAddedPayload,
  NotificationCreatedPayload,
} from './types';

// ════════════════════════════════════════════════════════════
// Configuration
// ════════════════════════════════════════════════════════════

const DEFAULT_RECONNECT_DELAY = 3000; // 3 sekunder
const MAX_RECONNECT_ATTEMPTS = 10;
const HEARTBEAT_INTERVAL = 30000; // 30 sekunder

// ════════════════════════════════════════════════════════════
// Event Handlers
// ════════════════════════════════════════════════════════════

/**
 * Håndterer BOOKING_CREATED event
 */
function handleBookingCreated(
  queryClient: ReturnType<typeof useQueryClient>,
  payload: BookingCreatedPayload
) {
  // Invalidate elevens bookings
  queryClient.invalidateQueries({
    queryKey: queryKeys.bookings.byStudent(payload.studentId),
  });
  
  // Invalidate instruktørens bookings
  queryClient.invalidateQueries({
    queryKey: queryKeys.bookings.byInstructor(payload.instructorId),
  });
  
  // Invalidate dagsvisning hvis booking er i dag
  const today = new Date().toISOString().split('T')[0];
  const bookingDate = payload.startTime.split('T')[0];
  if (bookingDate === today) {
    queryClient.invalidateQueries({
      queryKey: queryKeys.bookings.byDate(today),
    });
  }
  
  // Invalidate "alle bookings" for admin
  queryClient.invalidateQueries({
    queryKey: queryKeys.bookings.all,
  });
}

/**
 * Håndterer BOOKING_UPDATED event
 */
function handleBookingUpdated(
  queryClient: ReturnType<typeof useQueryClient>,
  payload: BookingUpdatedPayload
) {
  // Invalidate spesifikk booking
  queryClient.invalidateQueries({
    queryKey: queryKeys.bookings.byId(payload.bookingId),
  });
  
  // Invalidate lister
  queryClient.invalidateQueries({
    queryKey: queryKeys.bookings.byStudent(payload.studentId),
  });
  queryClient.invalidateQueries({
    queryKey: queryKeys.bookings.byInstructor(payload.instructorId),
  });
}

/**
 * Håndterer BOOKING_CANCELLED event
 */
function handleBookingCancelled(
  queryClient: ReturnType<typeof useQueryClient>,
  payload: BookingCancelledPayload
) {
  queryClient.invalidateQueries({
    queryKey: queryKeys.bookings.byStudent(payload.studentId),
  });
  queryClient.invalidateQueries({
    queryKey: queryKeys.bookings.byInstructor(payload.instructorId),
  });
  queryClient.invalidateQueries({
    queryKey: queryKeys.bookings.byId(payload.bookingId),
  });
}

/**
 * Håndterer BOOKING_RESCHEDULED event
 */
function handleBookingRescheduled(
  queryClient: ReturnType<typeof useQueryClient>,
  payload: BookingRescheduledPayload
) {
  queryClient.invalidateQueries({
    queryKey: queryKeys.bookings.byStudent(payload.studentId),
  });
  queryClient.invalidateQueries({
    queryKey: queryKeys.bookings.byInstructor(payload.instructorId),
  });
  queryClient.invalidateQueries({
    queryKey: queryKeys.bookings.byId(payload.bookingId),
  });
  
  // Invalidate begge datoene (gammel og ny)
  const oldDate = payload.oldStartTime.split('T')[0];
  const newDate = payload.newStartTime.split('T')[0];
  queryClient.invalidateQueries({
    queryKey: queryKeys.bookings.byDate(oldDate),
  });
  if (newDate !== oldDate) {
    queryClient.invalidateQueries({
      queryKey: queryKeys.bookings.byDate(newDate),
    });
  }
}

/**
 * Håndterer AVAILABILITY_CHANGED event
 */
function handleAvailabilityChanged(
  queryClient: ReturnType<typeof useQueryClient>,
  payload: AvailabilityChangedPayload
) {
  queryClient.invalidateQueries({
    queryKey: queryKeys.availability.byInstructor(payload.instructorId),
  });
  queryClient.invalidateQueries({
    queryKey: queryKeys.availability.byDate(payload.instructorId, payload.date),
  });
  queryClient.invalidateQueries({
    queryKey: queryKeys.blockedTime.byInstructor(payload.instructorId),
  });
}

/**
 * Håndterer COACHING_NOTES_ADDED event
 */
function handleCoachingNotesAdded(
  queryClient: ReturnType<typeof useQueryClient>,
  payload: CoachingNotesAddedPayload
) {
  queryClient.invalidateQueries({
    queryKey: queryKeys.coachingSessions.byBooking(payload.bookingId),
  });
  queryClient.invalidateQueries({
    queryKey: queryKeys.coachingSessions.byStudent(payload.studentId),
  });
  
  // Trigger en toast/notification til studenten
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('coaching-notes-available', {
      detail: payload,
    }));
  }
}

/**
 * Håndterer NOTIFICATION_CREATED event
 */
function handleNotificationCreated(
  queryClient: ReturnType<typeof useQueryClient>,
  payload: NotificationCreatedPayload
) {
  queryClient.invalidateQueries({
    queryKey: queryKeys.notifications.byUser(payload.userId),
  });
  queryClient.invalidateQueries({
    queryKey: queryKeys.notifications.unread(payload.userId),
  });
  queryClient.invalidateQueries({
    queryKey: queryKeys.notifications.count(payload.userId),
  });
}

// ════════════════════════════════════════════════════════════
// Main Hook
// ════════════════════════════════════════════════════════════

export interface UseSyncOptions {
  userId: string;
  userRole: string;
  enabled?: boolean;
  onEvent?: (event: SyncEventPayload) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
}

export function useSync({
  userId,
  userRole,
  enabled = true,
  onEvent,
  onConnect,
  onError,
  reconnectDelay = DEFAULT_RECONNECT_DELAY,
  maxReconnectAttempts = MAX_RECONNECT_ATTEMPTS,
}: UseSyncOptions) {
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const connectRef = useRef<(() => void) | null>(null);
  const sessionIdRef = useRef<string>(
    typeof crypto !== 'undefined' 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2)
  );
  
  const { 
    setConnected, 
    setLastSyncAt, 
    incrementPending, 
    markEventProcessed, 
    setError,
    reset,
  } = useSyncStore();

  // Cleanup function
  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  // Process incoming event
  const processEvent = useCallback((event: SyncEventPayload) => {
    incrementPending();
    
    try {
      switch (event.type) {
        case 'BOOKING_CREATED':
          handleBookingCreated(queryClient, event.payload as BookingCreatedPayload);
          break;
        case 'BOOKING_UPDATED':
          handleBookingUpdated(queryClient, event.payload as BookingUpdatedPayload);
          break;
        case 'BOOKING_CANCELLED':
          handleBookingCancelled(queryClient, event.payload as BookingCancelledPayload);
          break;
        case 'BOOKING_RESCHEDULED':
          handleBookingRescheduled(queryClient, event.payload as BookingRescheduledPayload);
          break;
        case 'AVAILABILITY_CHANGED':
          handleAvailabilityChanged(queryClient, event.payload as AvailabilityChangedPayload);
          break;
        case 'BLOCKED_TIME_CREATED':
        case 'BLOCKED_TIME_DELETED':
          // Invalidate availability
          queryClient.invalidateQueries({ queryKey: queryKeys.availability.all });
          queryClient.invalidateQueries({ queryKey: queryKeys.blockedTime.all });
          break;
        case 'COACHING_NOTES_ADDED':
          handleCoachingNotesAdded(queryClient, event.payload as CoachingNotesAddedPayload);
          break;
        case 'COACHING_NOTES_UPDATED':
          queryClient.invalidateQueries({ queryKey: queryKeys.coachingSessions.all });
          break;
        case 'NOTIFICATION_CREATED':
          handleNotificationCreated(queryClient, event.payload as NotificationCreatedPayload);
          break;
        case 'SYNC_PING':
          // Heartbeat - oppdater lastSyncAt
          setLastSyncAt(new Date().toISOString());
          break;
        default:
          // Log unknown events
          console.warn('Unknown sync event type:', event.type);
      }
      
      // Call user-provided handler
      onEvent?.(event);
    } catch (error) {
      console.error('Error processing sync event:', error);
    } finally {
      markEventProcessed();
    }
  }, [queryClient, onEvent, incrementPending, markEventProcessed, setLastSyncAt]);

  // Connect to SSE
  const connect = useCallback(() => {
    if (!enabled || !userId) return;
    
    cleanup();
    
    try {
      // Bygg URL med query params
      const url = new URL('/api/portal/sync/events', window.location.origin);
      url.searchParams.set('userId', userId);
      url.searchParams.set('role', userRole);
      url.searchParams.set('sessionId', sessionIdRef.current);
      
      const eventSource = new EventSource(url.toString());
      eventSourceRef.current = eventSource;
      
      eventSource.onopen = () => {
        reconnectAttemptsRef.current = 0;
        setConnected(true);
        setError(null);
        onConnect?.();
        
        // Start heartbeat
        heartbeatIntervalRef.current = setInterval(() => {
          // Send ping via fetch (SSE er one-way)
          fetch('/api/portal/sync/ping', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: sessionIdRef.current }),
          }).catch(() => {
            // Ignorer errors
          });
        }, HEARTBEAT_INTERVAL);
      };
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as SyncEventPayload;
          processEvent(data);
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };
      
      eventSource.onerror = () => {
        setConnected(false);
        setError('Connection error');
        onError?.(new Error('SSE connection error'));
        
        cleanup();
        
        // Attempt reconnect with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(
            reconnectDelay * Math.pow(2, reconnectAttemptsRef.current),
            30000 // Max 30 sekunder
          );
          reconnectAttemptsRef.current++;
          
          reconnectTimeoutRef.current = setTimeout(() => {
            // connect kalles via ref for å unngå circular dependency
            connectRef.current?.();
          }, delay);
        } else {
          setError('Max reconnect attempts reached');
        }
      };
      
    } catch (error) {
      setError('Failed to create EventSource');
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
   
  }, [
    enabled, 
    userId, 
    userRole, 
    cleanup, 
    processEvent, 
    onConnect, 
    onError, 
    setConnected, 
    setError, 
    reconnectDelay, 
    maxReconnectAttempts,
  ]);

  // Update connectRef when connect changes
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  // Initial connection
  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      cleanup();
      reset();
    }
    
    return () => {
      cleanup();
      reset();
    };
  }, [enabled, userId, userRole, connect, cleanup, reset]);

  // Handle visibility change - reconnect when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabled) {
        // Sjekk om det er lenge siden sist sync
        const lastSync = useSyncStore.getState().lastSyncAt;
        if (lastSync) {
          const lastSyncTime = new Date(lastSync).getTime();
          const now = Date.now();
          const fiveMinutes = 5 * 60 * 1000;
          
          if (now - lastSyncTime > fiveMinutes) {
            // Force reconnect for å hente missed events
            connect();
          }
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [enabled, connect]);

  return {
    isConnected: useSyncStore(state => state.isConnected),
    lastSyncAt: useSyncStore(state => state.lastSyncAt),
    pendingEvents: useSyncStore(state => state.pendingEvents),
    lastError: useSyncStore(state => state.lastError),
    reconnect: connect,
    disconnect: cleanup,
  };
}

/**
 * Hook for å sjekke sync status (uten å starte connection)
 */
export function useSyncStatus() {
  return useSyncStore(state => ({
    isConnected: state.isConnected,
    lastSyncAt: state.lastSyncAt,
    pendingEvents: state.pendingEvents,
    isSyncing: state.isSyncing,
    lastError: state.lastError,
    eventsReceived: state.eventsReceived,
    eventsProcessed: state.eventsProcessed,
  }));
}
