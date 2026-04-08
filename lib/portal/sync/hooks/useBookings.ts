/**
 * useBookings Hook
 * 
 * Eksempel på data fetching hook med TanStack Query og sync-integrasjon.
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/portal/sync';

// ════════════════════════════════════════════════════════════
// Types
// ════════════════════════════════════════════════════════════

interface Booking {
  id: string;
  studentId: string;
  instructorId: string;
  serviceTypeId: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  locationId?: string;
  adminNotes?: string;
  studentNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateBookingInput {
  studentId: string;
  instructorId: string;
  serviceTypeId: string;
  startTime: string;
  endTime: string;
  locationId?: string;
  studentNotes?: string;
}

interface UpdateBookingInput {
  bookingId: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  locationId?: string;
  adminNotes?: string;
}

// ════════════════════════════════════════════════════════════
// API Functions
// ════════════════════════════════════════════════════════════

async function fetchBookingsByStudent(studentId: string): Promise<Booking[]> {
  const res = await fetch(`/api/portal/bookings?studentId=${studentId}`);
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}

async function fetchBookingsByInstructor(instructorId: string): Promise<Booking[]> {
  const res = await fetch(`/api/portal/admin/bookings?instructorId=${instructorId}`);
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}

async function fetchBookingById(bookingId: string): Promise<Booking> {
  const res = await fetch(`/api/portal/bookings/${bookingId}`);
  if (!res.ok) throw new Error('Failed to fetch booking');
  return res.json();
}

async function createBookingAPI(input: CreateBookingInput): Promise<Booking> {
  const res = await fetch('/api/portal/bookings/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to create booking');
  return res.json();
}

async function updateBookingAPI(input: UpdateBookingInput): Promise<Booking> {
  const res = await fetch('/api/portal/bookings/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to update booking');
  return res.json();
}

async function cancelBookingAPI(bookingId: string, reason?: string): Promise<Booking> {
  const res = await fetch('/api/portal/bookings/cancel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId, reason }),
  });
  if (!res.ok) throw new Error('Failed to cancel booking');
  return res.json();
}

// ════════════════════════════════════════════════════════════
// Hooks
// ════════════════════════════════════════════════════════════

export function useStudentBookings(studentId: string) {
  return useQuery({
    queryKey: queryKeys.bookings.byStudent(studentId),
    queryFn: () => fetchBookingsByStudent(studentId),
    enabled: !!studentId,
    staleTime: 30 * 1000, // 30 sekunder
  });
}

export function useInstructorBookings(instructorId: string) {
  return useQuery({
    queryKey: queryKeys.bookings.byInstructor(instructorId),
    queryFn: () => fetchBookingsByInstructor(instructorId),
    enabled: !!instructorId,
    staleTime: 30 * 1000,
  });
}

export function useBooking(bookingId: string) {
  return useQuery({
    queryKey: queryKeys.bookings.byId(bookingId),
    queryFn: () => fetchBookingById(bookingId),
    enabled: !!bookingId,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createBookingAPI,
    
    onMutate: async (newBooking) => {
      const queryKey = queryKeys.bookings.byStudent(newBooking.studentId);
      
      await queryClient.cancelQueries({ queryKey });
      
      const previousBookings = queryClient.getQueryData<Booking[]>(queryKey);
      
      const optimisticBooking: Booking = {
        ...newBooking,
        id: `temp-${Date.now()}`,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      queryClient.setQueryData<Booking[]>(queryKey, (old) => {
        if (!old) return [optimisticBooking];
        return [...old, optimisticBooking].sort(
          (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
      });
      
      return { previousBookings, queryKey };
    },
    
    onError: (err, newBooking, context) => {
      if (context?.queryKey && context?.previousBookings) {
        queryClient.setQueryData(context.queryKey, context.previousBookings);
      }
    },
    
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.byStudent(variables.studentId),
      });
    },
  });
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateBookingAPI,
    
    onMutate: async (updates) => {
      const queryKey = queryKeys.bookings.byId(updates.bookingId);
      
      await queryClient.cancelQueries({ queryKey });
      
      const previousBooking = queryClient.getQueryData<Booking>(queryKey);
      
      queryClient.setQueryData<Booking>(queryKey, (old) => {
        if (!old) return old;
        return { ...old, ...updates } as Booking;
      });
      
      return { previousBooking, queryKey };
    },
    
    onError: (err, updates, context) => {
      if (context?.queryKey && context?.previousBooking) {
        queryClient.setQueryData(context.queryKey, context.previousBooking);
      }
    },
    
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.bookings.byStudent(data.studentId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.bookings.byInstructor(data.instructorId),
        });
      }
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason?: string }) =>
      cancelBookingAPI(bookingId, reason),
    
    onMutate: async ({ bookingId }) => {
      const queryKey = queryKeys.bookings.byId(bookingId);
      
      await queryClient.cancelQueries({ queryKey });
      
      const previousBooking = queryClient.getQueryData<Booking>(queryKey);
      
      queryClient.setQueryData<Booking>(queryKey, (old) => {
        if (!old) return old;
        return { ...old, status: 'CANCELLED' as const };
      });
      
      return { previousBooking, queryKey, studentId: previousBooking?.studentId };
    },
    
    onError: (err, variables, context) => {
      if (context?.queryKey && context?.previousBooking) {
        queryClient.setQueryData(context.queryKey, context.previousBooking);
      }
    },
    
    onSettled: (data, error, variables, context) => {
      if (context?.studentId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.bookings.byStudent(context.studentId),
        });
      }
    },
  });
}

// ════════════════════════════════════════════════════════════
// Combined Hook for Dashboard
// ════════════════════════════════════════════════════════════

export function useBookings(userId: string, role: 'STUDENT' | 'INSTRUCTOR') {
  const bookingsQuery = role === 'STUDENT'
    ? useStudentBookings(userId)
    : useInstructorBookings(userId);
  
  const createMutation = useCreateBooking();
  const updateMutation = useUpdateBooking();
  const cancelMutation = useCancelBooking();
  
  return {
    bookings: bookingsQuery.data ?? [],
    isLoading: bookingsQuery.isLoading,
    isError: bookingsQuery.isError,
    error: bookingsQuery.error,
    refetch: bookingsQuery.refetch,
    
    createBooking: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    
    updateBooking: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    
    cancelBooking: cancelMutation.mutateAsync,
    isCancelling: cancelMutation.isPending,
  };
}
