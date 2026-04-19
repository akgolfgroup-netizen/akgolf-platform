/**
 * Server-side Sync Helpers
 * 
 * Funksjoner for å sende sync events fra serveren.
 */

import { createServiceClient } from '@/lib/supabase/server';
// SyncEventType and SyncEventStatus are not in Prisma schema — define locally
type SyncEventType = string;
type SyncEventStatus = string;

// ════════════════════════════════════════════════════════════
// Types
// ════════════════════════════════════════════════════════════

interface EmitSyncEventOptions {
  type: SyncEventType;
  payload: unknown;
  targetUserIds?: string[];
  targetRoles?: string[];
  sourceUserId?: string;
  sourceSystem: 'PORTAL' | 'MISSION_CONTROL' | 'CRON' | 'WEBHOOK';
  dedupKey?: string;
  expiresInMinutes?: number;
}

interface BroadcastOptions extends Omit<EmitSyncEventOptions, 'targetUserIds'> {
  excludeUserIds?: string[];
}

// ════════════════════════════════════════════════════════════
// Event Creation
// ════════════════════════════════════════════════════════════

/**
 * Oppretter og lagrer et sync event i databasen
 */
export async function createSyncEvent({
  type,
  payload,
  targetUserIds = [],
  targetRoles = [],
  sourceUserId,
  sourceSystem,
  dedupKey,
  expiresInMinutes = 60,
}: EmitSyncEventOptions) {
  const supabase = createServiceClient();

  try {
    // Sjekk for duplikat hvis dedupKey er satt
    if (dedupKey) {
      const { data: existing } = await supabase
        .from("SyncEvent")
        .select("id")
        .eq("dedupKey", dedupKey)
        .single();
      
      if (existing) {
        return { success: false, reason: 'duplicate', eventId: existing.id };
      }
    }
    
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
    const id = crypto.randomUUID();
    
    const { data: event, error } = await supabase
      .from("SyncEvent")
      .insert({
        id,
        type,
        payload: payload as Record<string, unknown>,
        targetUserIds,
        targetRoles,
        sourceUserId,
        sourceSystem,
        dedupKey,
        expiresAt: expiresAt.toISOString(),
        status: "PENDING" as SyncEventStatus,
        deliveredTo: [],
        failedFor: [],
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, eventId: event.id };
  } catch (error) {
    console.error('Failed to create sync event:', error);
    return { success: false, reason: 'error', error };
  }
}

/**
 * Sender et sync event til spesifikke brukere
 */
export async function emitSyncEvent(options: EmitSyncEventOptions) {
  return createSyncEvent(options);
}

/**
 * Broadcaster et event til alle brukere
 */
export async function broadcastSyncEvent({
   
  excludeUserIds: _excludeUserIds = [],
  ...options
}: BroadcastOptions) {
  return createSyncEvent({
    ...options,
    targetUserIds: [],
  });
}

// ════════════════════════════════════════════════════════════
// Event Retrieval (for SSE endpoint)
// ════════════════════════════════════════════════════════════

/**
 * Henter pending events for en spesifikk bruker
 */
export async function getPendingEventsForUser(
  userId: string,
  userRole: string,
  options: {
    limit?: number;
    after?: Date;
  } = {}
) {
  const supabase = createServiceClient();
  const { limit = 100, after } = options;
  
  // Build the query with proper filters
  const { data: events, error } = await supabase
    .from("SyncEvent")
    .select("*")
    .in("status", ["PENDING", "FAILED"] as SyncEventStatus[])
    .gt("expiresAt", new Date().toISOString())
    .or(`targetUserIds.cs.{${userId}},targetRoles.cs.{${userRole}},and(targetUserIds.eq.[],targetRoles.eq.[])`)
    .not("deliveredTo", "cs", `{${userId}}`)
    .gt("createdAt", after ? after.toISOString() : new Date(0).toISOString())
    .order("createdAt", { ascending: true })
    .limit(limit);
  
  if (error) {
    console.error('Failed to get pending events:', error);
    return [];
  }
  
  return events || [];
}

/**
 * Marker events som levert til en bruker
 */
export async function markEventsAsDelivered(
  eventIds: string[],
  userId: string
) {
  if (eventIds.length === 0) return;
  
  const supabase = createServiceClient();
  
  // Update each event individually since we need to append to an array
  for (const id of eventIds) {
    const { data: event } = await supabase
      .from("SyncEvent")
      .select("deliveredTo")
      .eq("id", id)
      .single();
    
    if (event) {
      const deliveredTo = [...(event.deliveredTo || []), userId];
      
      await supabase
        .from("SyncEvent")
        .update({
          deliveredTo,
          status: "DELIVERED" as SyncEventStatus,
          deliveredAt: new Date().toISOString(),
        })
        .eq("id", id);
    }
  }
}

/**
 * Marker events som feilet for en bruker
 */
export async function markEventsAsFailed(
  eventIds: string[],
  userId: string
) {
  if (eventIds.length === 0) return;
  
  const supabase = createServiceClient();
  
  // Update each event individually since we need to append to an array
  for (const id of eventIds) {
    const { data: event } = await supabase
      .from("SyncEvent")
      .select("failedFor")
      .eq("id", id)
      .single();
    
    if (event) {
      const failedFor = [...(event.failedFor || []), userId];
      
      await supabase
        .from("SyncEvent")
        .update({
          failedFor,
          status: "FAILED" as SyncEventStatus,
        })
        .eq("id", id);
    }
  }
}

// ════════════════════════════════════════════════════════════
// Audit Logging
// ════════════════════════════════════════════════════════════

interface AuditLogOptions {
  tableName: string;
  recordId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  before?: unknown;
  after?: unknown;
  changedFields?: string[];
  userId?: string;
  userRole?: string;
  ipAddress?: string;
  userAgent?: string;
  sourceSystem: string;
  correlationId?: string;
}

/**
 * Logger en audit event for data-endringer
 */
export async function logAuditEvent(options: AuditLogOptions) {
  const supabase = createServiceClient();
  
  try {
    await supabase
      .from("SyncAuditLog")
      .insert({
        tableName: options.tableName,
        recordId: options.recordId,
        action: options.action,
        before: (options.before ?? null) as Record<string, unknown> | null,
        after: (options.after ?? null) as Record<string, unknown> | null,
        changedFields: options.changedFields ?? [],
        userId: options.userId ?? null,
        userRole: options.userRole ?? null,
        ipAddress: options.ipAddress ?? null,
        userAgent: options.userAgent ?? null,
        sourceSystem: options.sourceSystem,
        correlationId: options.correlationId ?? null,
      });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}

// ════════════════════════════════════════════════════════════
// Connection Management
// ════════════════════════════════════════════════════════════

/**
 * Registrerer en ny SSE connection
 */
export async function registerConnection(
  userId: string,
  sessionId: string,
  metadata: {
    userAgent?: string;
    ipAddress?: string;
    eventTypes?: string[];
  } = {}
) {
  const supabase = createServiceClient();
  
  try {
    await supabase
      .from("SyncConnection")
      .insert({
        userId,
        sessionId,
        userAgent: metadata.userAgent ?? null,
        ipAddress: metadata.ipAddress ?? null,
        eventTypes: metadata.eventTypes ?? [],
        connectedAt: new Date().toISOString(),
        lastPingAt: new Date().toISOString(),
      });
  } catch (error) {
    console.error('Failed to register connection:', error);
  }
}

/**
 * Oppdaterer lastPingAt for en connection
 */
export async function updateConnectionPing(sessionId: string) {
  const supabase = createServiceClient();
  
  try {
    await supabase
      .from("SyncConnection")
      .update({ lastPingAt: new Date().toISOString() })
      .eq("sessionId", sessionId);
  } catch {
    // Ignorer - connection kan være slettet
  }
}

/**
 * Markerer en connection som disconnected
 */
export async function unregisterConnection(sessionId: string) {
  const supabase = createServiceClient();
  
  try {
    await supabase
      .from("SyncConnection")
      .update({ disconnectedAt: new Date().toISOString() })
      .eq("sessionId", sessionId);
  } catch {
    // Ignorer
  }
}

/**
 * Rydder opp gamle connections
 */
export async function cleanupStaleConnections(staleThresholdMinutes: number = 5) {
  const supabase = createServiceClient();
  const cutoff = new Date(Date.now() - staleThresholdMinutes * 60 * 1000);
  
  const { data, error } = await supabase
    .from("SyncConnection")
    .update({ disconnectedAt: new Date().toISOString() })
    .is("disconnectedAt", null)
    .lt("lastPingAt", cutoff.toISOString())
    .select();
  
  if (error) {
    console.error('Failed to cleanup stale connections:', error);
    return 0;
  }
  
  return data?.length || 0;
}

// ════════════════════════════════════════════════════════════
// Event Cleanup
// ════════════════════════════════════════════════════════════

/**
 * Rydder opp utløpte events
 */
export async function cleanupExpiredEvents() {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from("SyncEvent")
    .delete()
    .lt("expiresAt", new Date().toISOString())
    .in("status", ["DELIVERED", "EXPIRED"] as SyncEventStatus[])
    .select();
  
  if (error) {
    console.error('Failed to cleanup expired events:', error);
    return 0;
  }
  
  return data?.length || 0;
}

/**
 * Rydder opp gamle audit logs
 */
export async function cleanupOldAuditLogs(retentionDays: number = 90) {
  const supabase = createServiceClient();
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
  
  const { data, error } = await supabase
    .from("SyncAuditLog")
    .delete()
    .lt("createdAt", cutoff.toISOString())
    .select();
  
  if (error) {
    console.error('Failed to cleanup old audit logs:', error);
    return 0;
  }
  
  return data?.length || 0;
}

// ════════════════════════════════════════════════════════════
// Convenience Helpers for Common Scenarios
// ════════════════════════════════════════════════════════════

interface BookingLike {
  id: string;
  studentId: string;
  instructorId: string;
  startTime: Date;
  endTime: Date;
  status: string;
}

/**
 * Hjelper for å sende booking-relaterte events
 */
export async function emitBookingEvent(
  type: 'BOOKING_CREATED' | 'BOOKING_UPDATED' | 'BOOKING_CANCELLED' | 'BOOKING_RESCHEDULED',
  booking: BookingLike,
  sourceUserId: string,
  sourceSystem: 'PORTAL' | 'MISSION_CONTROL'
) {
  return emitSyncEvent({
    type: type as SyncEventType,
    payload: {
      bookingId: booking.id,
      studentId: booking.studentId,
      instructorId: booking.instructorId,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      status: booking.status,
    },
    targetUserIds: [booking.studentId, booking.instructorId],
    sourceUserId,
    sourceSystem,
    dedupKey: `${type}:${booking.id}:${Date.now()}`,
  });
}

/**
 * Hjelper for å sende availability events
 */
export async function emitAvailabilityEvent(
  instructorId: string,
  changes: Array<{ type: 'ADDED' | 'REMOVED' | 'MODIFIED'; startTime: string; endTime: string }>,
  sourceUserId: string,
  sourceSystem: 'PORTAL' | 'MISSION_CONTROL'
) {
  return emitSyncEvent({
    type: 'AVAILABILITY_CHANGED' as SyncEventType,
    payload: {
      instructorId,
      date: new Date().toISOString().split('T')[0],
      changes,
      source: sourceSystem === 'PORTAL' ? 'MANUAL' : 'MANUAL',
    },
    targetUserIds: [instructorId],
    sourceUserId,
    sourceSystem,
  });
}

/**
 * Hjelper for å sende coaching notes events
 */
export async function emitCoachingNotesEvent(
  coachingSession: {
    id: string;
    bookingId: string;
    studentId: string;
    instructorId: string;
  },
  sourceUserId: string
) {
  return emitSyncEvent({
    type: 'COACHING_NOTES_ADDED' as SyncEventType,
    payload: {
      coachingSessionId: coachingSession.id,
      bookingId: coachingSession.bookingId,
      studentId: coachingSession.studentId,
      instructorId: coachingSession.instructorId,
      hasNotes: true,
      hasAiSummary: true,
    },
    targetUserIds: [coachingSession.studentId],
    sourceUserId,
    sourceSystem: 'MISSION_CONTROL',
  });
}
