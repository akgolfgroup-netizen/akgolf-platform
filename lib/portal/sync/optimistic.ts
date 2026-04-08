/**
 * Optimistic Update Helpers
 * 
 * Disse funksjonene håndterer optimistic updates for umiddelbar UI-respons.
 * Ved feil rulles endringene tilbake automatisk.
 */

import { QueryClient, QueryKey } from '@tanstack/react-query';
import { OptimisticUpdateContext } from './types';

// ════════════════════════════════════════════════════════════
// Core Optimistic Update Function
// ════════════════════════════════════════════════════════════

/**
 * Utfører en optimistic update med automatisk rollback ved feil
 * 
 * @example
 * const result = await optimisticUpdate({
 *   queryClient,
 *   queryKey: queryKeys.bookings.byStudent(studentId),
 *   updateFn: (oldBookings) => [...oldBookings, newBooking],
 *   mutationFn: () => createBookingAPI(newBooking),
 * });
 */
export async function optimisticUpdate<TData, TResult>({
  queryClient,
  queryKey,
  updateFn,
  mutationFn,
  onError,
  onSuccess,
  onSettled,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  updateFn: (oldData: TData | undefined) => TData;
  mutationFn: () => Promise<TResult>;
  onError?: (error: Error, context: OptimisticUpdateContext<TData>) => void;
  onSuccess?: (result: TResult, context: OptimisticUpdateContext<TData>) => void;
  onSettled?: () => void;
}): Promise<TResult> {
  // 1. Cancel ongoing refetches
  await queryClient.cancelQueries({ queryKey });

  // 2. Snapshot previous value
  const previousData = queryClient.getQueryData<TData>(queryKey);

  // 3. Optimistically update
  const optimisticData = updateFn(previousData);
  queryClient.setQueryData<TData>(queryKey, optimisticData);

  // 4. Create context for callbacks
  const context: OptimisticUpdateContext<TData> = {
    queryKey,
    previousData,
    optimisticData,
    rollback: () => {
      queryClient.setQueryData<TData>(queryKey, previousData);
    },
  };

  try {
    // 5. Execute actual mutation
    const result = await mutationFn();
    
    // 6. On success - optionally update with server data
    onSuccess?.(result, context);
    
    return result;
  } catch (error) {
    // 7. On error - rollback
    context.rollback();
    onError?.(error as Error, context);
    throw error;
  } finally {
    onSettled?.();
  }
}

// ════════════════════════════════════════════════════════════
// Booking Optimistic Updates
// ════════════════════════════════════════════════════════════

interface Booking {
  id: string;
  status: string;
  startTime: string;
  endTime: string;
  [key: string]: unknown;
}

/**
 * Optimistisk oppdatering ved booking-opprettelse
 */
export function addBookingOptimistically<T extends Booking>(
  oldData: T[] | undefined,
  newBooking: T
): T[] {
  if (!oldData) return [newBooking];
  
  // Sorter etter starttid
  return [...oldData, newBooking].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
}

/**
 * Optimistisk oppdatering ved booking-kansellering
 */
export function cancelBookingOptimistically<T extends Booking>(
  oldData: T[] | undefined,
  bookingId: string,
  cancelledData: Partial<T> = {}
): T[] | undefined {
  if (!oldData) return oldData;
  
  return oldData.map(booking =>
    booking.id === bookingId
      ? { ...booking, status: 'CANCELLED', ...cancelledData }
      : booking
  );
}

/**
 * Optimistisk oppdatering ved booking-endring (reschedule)
 */
export function updateBookingOptimistically<T extends Booking>(
  oldData: T[] | undefined,
  bookingId: string,
  updates: Partial<T>
): T[] | undefined {
  if (!oldData) return oldData;
  
  const updated = oldData.map(booking =>
    booking.id === bookingId ? { ...booking, ...updates } : booking
  );
  
  // Re-sorter hvis startTime ble endret
  if ('startTime' in updates) {
    return updated.sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }
  
  return updated;
}

/**
 * Optimistisk fjerning av booking fra liste
 */
export function removeBookingOptimistically<T extends { id: string }>(
  oldData: T[] | undefined,
  bookingId: string
): T[] | undefined {
  if (!oldData) return oldData;
  return oldData.filter(booking => booking.id !== bookingId);
}

// ════════════════════════════════════════════════════════════
// Availability Optimistic Updates
// ════════════════════════════════════════════════════════════

interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

/**
 * Optimistisk blokkering av tidspunkt
 */
export function blockTimeOptimistically<T extends TimeSlot>(
  oldData: T[] | undefined,
  blockedSlot: { startTime: string; endTime: string }
): T[] | undefined {
  if (!oldData) return oldData;
  
  return oldData.map(slot => {
    // Sjekk om slot overlapper med blokkert tid
    const slotStart = new Date(slot.startTime).getTime();
    const slotEnd = new Date(slot.endTime).getTime();
    const blockedStart = new Date(blockedSlot.startTime).getTime();
    const blockedEnd = new Date(blockedSlot.endTime).getTime();
    
    const overlaps = slotStart < blockedEnd && slotEnd > blockedStart;
    
    if (overlaps) {
      return { ...slot, isAvailable: false } as T;
    }
    return slot;
  });
}

// ════════════════════════════════════════════════════════════
// Notification Optimistic Updates
// ════════════════════════════════════════════════════════════

interface Notification {
  id: string;
  read: boolean;
}

/**
 * Optimistisk markering av notifikasjon som lest
 */
export function markNotificationAsReadOptimistically<T extends Notification>(
  oldData: T[] | undefined,
  notificationId: string
): T[] | undefined {
  if (!oldData) return oldData;
  
  return oldData.map(notification =>
    notification.id === notificationId
      ? { ...notification, read: true }
      : notification
  );
}

/**
 * Optimistisk markering av alle notifikasjoner som lest
 */
export function markAllNotificationsAsReadOptimistically<T extends Notification>(
  oldData: T[] | undefined
): T[] | undefined {
  if (!oldData) return oldData;
  return oldData.map(notification => ({ ...notification, read: true }));
}

// ════════════════════════════════════════════════════════════
// Generic List Operations
// ════════════════════════════════════════════════════════════

/**
 * Legg til item i liste optimistisk
 */
export function addItemToListOptimistically<T extends { id: string; createdAt?: string | Date }>(
  oldData: T[] | undefined,
  newItem: T,
  sortBy: 'createdAt' | 'name' | 'custom' = 'createdAt',
  customSortFn?: (a: T, b: T) => number
): T[] {
  if (!oldData) return [newItem];
  
  const newList = [...oldData, newItem];
  
  if (sortBy === 'createdAt') {
    return newList.sort((a, b) => {
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bDate - aDate; // Nyeste først
    });
  }
  
  if (sortBy === 'custom' && customSortFn) {
    return newList.sort(customSortFn);
  }
  
  return newList;
}

/**
 * Oppdater item i liste optimistisk
 */
export function updateItemInListOptimistically<T extends { id: string }>(
  oldData: T[] | undefined,
  itemId: string,
  updates: Partial<T>
): T[] | undefined {
  if (!oldData) return oldData;
  
  return oldData.map(item =>
    item.id === itemId ? { ...item, ...updates } : item
  );
}

/**
 * Fjern item fra liste optimistisk
 */
export function removeItemFromListOptimistically<T extends { id: string }>(
  oldData: T[] | undefined,
  itemId: string
): T[] | undefined {
  if (!oldData) return oldData;
  return oldData.filter(item => item.id !== itemId);
}

// ════════════════════════════════════════════════════════════
// Utility Functions
// ════════════════════════════════════════════════════════════

/**
 * Debounced invalidation - unngå for mange refetches
 */
export function debouncedInvalidate(
  queryClient: QueryClient,
  queryKey: QueryKey,
  delay: number = 100
): () => void {
  let timeoutId: NodeJS.Timeout;
  
  const invalidate = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey });
    }, delay);
  };
  
  // Kall umiddelbart første gang
  invalidate();
  
  // Returner cleanup
  return () => clearTimeout(timeoutId);
}

/**
 * Batch invalidation - invalidere flere queries samtidig
 */
export function invalidateMultiple(
  queryClient: QueryClient,
  queryKeys: QueryKey[]
): Promise<void> {
  return Promise.all(
    queryKeys.map(key => queryClient.invalidateQueries({ queryKey: key }))
  ).then(() => undefined);
}

/**
 * Prefetch med prioritet
 */
export async function prefetchWithPriority<T>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  fetchFn: () => Promise<T>,
  priority: 'high' | 'normal' | 'low' = 'normal'
): Promise<void> {
  const staleTime = priority === 'high' ? 5 * 60 * 1000 : // 5 min
                    priority === 'normal' ? 60 * 1000 :    // 1 min
                    0;
  
  await queryClient.prefetchQuery({
    queryKey,
    queryFn: fetchFn,
    staleTime,
  });
}
