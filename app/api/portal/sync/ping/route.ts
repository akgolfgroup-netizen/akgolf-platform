/**
 * Ping Endpoint for SSE Connections
 * 
 * Brukes til å holde SSE connections alive og oppdatere lastPingAt.
 */

import { NextRequest } from 'next/server';
import { updateConnectionPing } from '@/lib/portal/sync/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;
    
    if (!sessionId) {
      return Response.json(
        { error: 'Missing sessionId' },
        { status: 400 }
      );
    }
    
    await updateConnectionPing(sessionId);
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Ping error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
