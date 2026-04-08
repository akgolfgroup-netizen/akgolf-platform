/**
 * Sync Status API
 * 
 * Returns current sync status for the authenticated user.
 */

import { NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return Response.json({ error: 'Missing userId' }, { status: 400 });
  }
  
  try {
    const supabase = createServiceClient();
    const now = new Date().toISOString();

    // Get pending events count
    const { count: pendingEvents } = await supabase
      .from('SyncEvent')
      .select('*', { count: 'exact', head: true })
      .contains('targetUserIds', [userId])
      .in('status', ['PENDING', 'FAILED'])
      .gt('expiresAt', now)
      .not('deliveredTo', 'cs', `{${userId}}`);
    
    // Get active connection
    const { data: connection } = await supabase
      .from('SyncConnection')
      .select('*')
      .eq('userId', userId)
      .is('disconnectedAt', null)
      .order('lastPingAt', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    // Get recent events
    const { data: recentEvents } = await supabase
      .from('SyncEvent')
      .select('id, type, status, createdAt, sourceSystem')
      .contains('targetUserIds', [userId])
      .order('createdAt', { ascending: false })
      .limit(10);
    
    return Response.json({
      isConnected: !!connection,
      lastPingAt: connection?.lastPingAt ?? null,
      pendingEvents: pendingEvents ?? 0,
      recentEvents: recentEvents ?? [],
    });
  } catch (error) {
    console.error('Sync status error:', error);
    return Response.json(
      { error: 'Failed to get sync status' },
      { status: 500 }
    );
  }
}
