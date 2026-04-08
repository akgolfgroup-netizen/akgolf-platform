/**
 * Server-side Sync Helpers
 * 
 * Funksjoner for å sende sync events fra serveren.
 */

import { prisma } from '@/lib/portal/prisma';
import { SyncEventType, SyncEventStatus } from '@prisma/client';

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
  try {
    // Sjekk for duplikat hvis dedupKey er satt
    if (dedupKey) {
      const existing = await prisma.syncEvent.findUnique({
        where: { dedupKey },
      });
      
      if (existing) {
        return { success: false, reason: 'duplicate', eventId: existing.id };
      }
    }
    
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
    
    const event = await prisma.syncEvent.create({
      data: {
        type,
        payload: payload as never,
        targetUserIds,
        targetRoles,
        sourceUserId,
        sourceSystem,
        dedupKey,
        expiresAt,
        status: SyncEventStatus.PENDING,
        deliveredTo: [],
        failedFor: [],
      },
    });
    
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
  excludeUserIds = [],
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
  const { limit = 100, after } = options;
  
  const events = await prisma.syncEvent.findMany({
    where: {
      status: { in: [SyncEventStatus.PENDING, SyncEventStatus.FAILED] },
      expiresAt: { gt: new Date() },
      OR: [
        { targetUserIds: { has: userId } },
        { targetRoles: { has: userRole } },
        { targetUserIds: { isEmpty: true }, targetRoles: { isEmpty: true } },
      ],
      NOT: { deliveredTo: { has: userId } },
      ...(after && { createdAt: { gt: after } }),
    },
    orderBy: { createdAt: 'asc' },
    take: limit,
  });
  
  return events;
}

/**
 * Marker events som levert til en bruker
 */
export async function markEventsAsDelivered(
  eventIds: string[],
  userId: string
) {
  if (eventIds.length === 0) return;
  
  await prisma.$transaction(
    eventIds.map(id =>
      prisma.syncEvent.update({
        where: { id },
        data: {
          deliveredTo: { push: userId },
          status: SyncEventStatus.DELIVERED,
          deliveredAt: new Date(),
        },
      })
    )
  );
}

/**
 * Marker events som feilet for en bruker
 */
export async function markEventsAsFailed(
  eventIds: string[],
  userId: string
) {
  if (eventIds.length === 0) return;
  
  await prisma.$transaction(
    eventIds.map(id =>
      prisma.syncEvent.update({
        where: { id },
        data: {
          failedFor: { push: userId },
          status: SyncEventStatus.FAILED,
        },
      })
    )
  );
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
  try {
    await prisma.syncAuditLog.create({
      data: {
        tableName: options.tableName,
        recordId: options.recordId,
        action: options.action,
        before: (options.before ?? null) as any,
        after: (options.after ?? null) as any,
        changedFields: options.changedFields ?? [],
        userId: options.userId ?? null,
        userRole: options.userRole ?? null,
        ipAddress: options.ipAddress ?? null,
        userAgent: options.userAgent ?? null,
        sourceSystem: options.sourceSystem,
        correlationId: options.correlationId ?? null,
      },
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
  try {
    await prisma.syncConnection.create({
      data: {
        userId,
        sessionId,
        userAgent: metadata.userAgent ?? null,
        ipAddress: metadata.ipAddress ?? null,
        eventTypes: metadata.eventTypes ?? [],
        connectedAt: new Date(),
        lastPingAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to register connection:', error);
  }
}

/**
 * Oppdaterer lastPingAt for en connection
 */
export async function updateConnectionPing(sessionId: string) {
  try {
    await prisma.syncConnection.update({
      where: { sessionId },
      data: { lastPingAt: new Date() },
    });
  } catch (error) {
    // Ignorer - connection kan være slettet
  }
}

/**
 * Markerer en connection som disconnected
 */
export async function unregisterConnection(sessionId: string) {
  try {
    await prisma.syncConnection.update({
      where: { sessionId },
      data: { disconnectedAt: new Date() },
    });
  } catch (error) {
    // Ignorer
  }
}

/**
 * Rydder opp gamle connections
 */
export async function cleanupStaleConnections(staleThresholdMinutes: number = 5) {
  const cutoff = new Date(Date.now() - staleThresholdMinutes * 60 * 1000);
  
  const result = await prisma.syncConnection.updateMany({
    where: {
      disconnectedAt: null,
      lastPingAt: { lt: cutoff },
    },
    data: {
      disconnectedAt: new Date(),
    },
  });
  
  return result.count;
}

// ════════════════════════════════════════════════════════════
// Event Cleanup
// ════════════════════════════════════════════════════════════

/**
 * Rydder opp utløpte events
 */
export async function cleanupExpiredEvents() {
  const result = await prisma.syncEvent.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
      status: { in: [SyncEventStatus.DELIVERED, SyncEventStatus.EXPIRED] },
    },
  });
  
  return result.count;
}

/**
 * Rydder opp gamle audit logs
 */
export async function cleanupOldAuditLogs(retentionDays: number = 90) {
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
  
  const result = await prisma.syncAuditLog.deleteMany({
    where: {
      createdAt: { lt: cutoff },
    },
  });
  
  return result.count;
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
    type: SyncEventType[type],
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
    type: SyncEventType.AVAILABILITY_CHANGED,
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
    type: SyncEventType.COACHING_NOTES_ADDED,
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
