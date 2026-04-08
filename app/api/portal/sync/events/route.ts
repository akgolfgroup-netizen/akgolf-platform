/**
 * SSE (Server-Sent Events) Endpoint for Real-time Sync
 * 
 * Dette endpointet etablerer en SSE-forbindelse som pushe events
 * til tilkoblede klienter i sanntid.
 * 
 * URL: /api/portal/sync/events?userId=xxx&role=xxx&sessionId=xxx
 */

import { NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { 
  getPendingEventsForUser, 
  markEventsAsDelivered,
  registerConnection,
  unregisterConnection,
  updateConnectionPing,
} from '@/lib/portal/sync/server';

// ════════════════════════════════════════════════════════════
// Configuration
// ════════════════════════════════════════════════════════════

const HEARTBEAT_INTERVAL = 30000; // 30 sekunder
const MAX_CONNECTIONS_PER_USER = 5;

// ════════════════════════════════════════════════════════════
// SSE Stream Helper
// ════════════════════════════════════════════════════════════

/**
 * Oppretter en ReadableStream for SSE
 */
function createSSEStream(
  userId: string,
  userRole: string,
  sessionId: string,
  eventTypes: string[]
): ReadableStream {
  let heartbeatInterval: NodeJS.Timeout;
  let eventCheckInterval: NodeJS.Timeout;
  let lastEventId: string | null = null;
  let isClosed = false;
  
  return new ReadableStream({
    async start(controller) {
      // Send initial connection event
      const initEvent = {
        type: 'SYNC_ACK',
        payload: { sessionId, connectedAt: new Date().toISOString() },
        timestamp: new Date().toISOString(),
        eventId: `ack-${Date.now()}`,
        sourceSystem: 'PORTAL',
      };
      
      controller.enqueue(`data: ${JSON.stringify(initEvent)}\n\n`);
      
      // Register connection
      await registerConnection(userId, sessionId, { eventTypes });
      
      // Send any pending/missed events
      try {
        const pendingEvents = await getPendingEventsForUser(userId, userRole);
        
        for (const event of pendingEvents) {
          const eventData = {
            type: event.type,
            payload: event.payload,
            timestamp: event.createdAt.toISOString(),
            eventId: event.id,
            sourceSystem: event.sourceSystem,
            sourceUserId: event.sourceUserId ?? undefined,
          };
          
          controller.enqueue(`data: ${JSON.stringify(eventData)}\n\n`);
          lastEventId = event.id;
        }
        
        // Mark as delivered
        if (pendingEvents.length > 0) {
          await markEventsAsDelivered(
            pendingEvents.map((e: { id: string }) => e.id),
            userId
          );
        }
      } catch (error) {
        console.error('Error sending pending events:', error);
      }
      
      // Heartbeat - holder connection alive
      heartbeatInterval = setInterval(() => {
        if (isClosed) return;
        
        try {
          const heartbeat = {
            type: 'SYNC_PING',
            payload: { timestamp: new Date().toISOString() },
            timestamp: new Date().toISOString(),
            eventId: `ping-${Date.now()}`,
            sourceSystem: 'PORTAL',
          };
          
          controller.enqueue(`data: ${JSON.stringify(heartbeat)}\n\n`);
          
          // Update connection ping
          updateConnectionPing(sessionId).catch(() => {
            // Ignorer errors
          });
        } catch (error) {
          // Stream closed
          clearInterval(heartbeatInterval);
          clearInterval(eventCheckInterval);
        }
      }, HEARTBEAT_INTERVAL);
      
      // Sjekk for nye events hvert 2. sekund
      // I produksjon kan dette erstattes med Redis pub/sub eller lignende
      eventCheckInterval = setInterval(async () => {
        if (isClosed) return;
        
        try {
          const after = lastEventId ? undefined : new Date(Date.now() - 5000);
          const newEvents = await getPendingEventsForUser(userId, userRole, {
            limit: 10,
            after,
          });
          
          for (const event of newEvents) {
            // Filter by event types if specified
            if (eventTypes.length > 0 && !eventTypes.includes(event.type)) {
              continue;
            }
            
            const eventData = {
              type: event.type,
              payload: event.payload,
              timestamp: event.createdAt.toISOString(),
              eventId: event.id,
              sourceSystem: event.sourceSystem,
              sourceUserId: event.sourceUserId ?? undefined,
            };
            
            controller.enqueue(`data: ${JSON.stringify(eventData)}\n\n`);
            lastEventId = event.id;
          }
          
          // Mark as delivered
          if (newEvents.length > 0) {
            await markEventsAsDelivered(
              newEvents.map((event: { id: string }) => event.id),
              userId
            );
          }
        } catch (error) {
          console.error('Error checking for new events:', error);
        }
      }, 2000);
    },
    
    cancel() {
      isClosed = true;
      clearInterval(heartbeatInterval);
      clearInterval(eventCheckInterval);
      unregisterConnection(sessionId).catch(() => {
        // Ignorer errors
      });
    },
  });
}

// ════════════════════════════════════════════════════════════
// Route Handler
// ════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Extract parameters
  const userId = searchParams.get('userId');
  const userRole = searchParams.get('role') ?? 'STUDENT';
  const sessionId = searchParams.get('sessionId') ?? crypto.randomUUID();
  const eventTypesParam = searchParams.get('eventTypes');
  const eventTypes = eventTypesParam ? eventTypesParam.split(',') : [];
  
  // Validate required parameters
  if (!userId) {
    return new Response(
      JSON.stringify({ error: 'Missing required parameter: userId' }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  // Check connection limit per user
  try {
    const supabase = createServiceClient();
    const { count: activeConnections } = await supabase
      .from('SyncConnection')
      .select('*', { count: 'exact', head: true })
      .eq('userId', userId)
      .is('disconnectedAt', null);
    
    if ((activeConnections ?? 0) >= MAX_CONNECTIONS_PER_USER) {
      // Disconnect oldest connection
      const { data: oldestConnection } = await supabase
        .from('SyncConnection')
        .select('id')
        .eq('userId', userId)
        .is('disconnectedAt', null)
        .order('lastPingAt', { ascending: true })
        .limit(1)
        .single();
      
      if (oldestConnection) {
        await supabase
          .from('SyncConnection')
          .update({ disconnectedAt: new Date().toISOString() })
          .eq('id', oldestConnection.id);
      }
    }
  } catch (error) {
    console.error('Error checking connection limit:', error);
  }
  
  // Create SSE stream
  const stream = createSSEStream(userId, userRole, sessionId, eventTypes);
  
  // Return SSE response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  });
}

// ════════════════════════════════════════════════════════════
// CORS Headers
// ════════════════════════════════════════════════════════════

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
