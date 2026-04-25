/**
 * Sync Cleanup Cron Job
 * 
 * Renser utløpte sync events og stale connections.
 * Kjøres hver 6. time.
 * 
 * Cron schedule: 0 0/6 * * *
 */

import { NextRequest } from 'next/server';

export const dynamic = "force-dynamic";
import { 
  cleanupExpiredEvents, 
  cleanupStaleConnections,
  cleanupOldAuditLogs,
} from '@/lib/portal/sync/server';
import { verifyCronAuth } from '@/lib/cron-auth';

export async function GET(request: NextRequest) {
  // Validate cron auth
  const isAuthorized = verifyCronAuth(request);
  if (!isAuthorized) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const [eventsCleaned, connectionsCleaned, auditLogsCleaned] = await Promise.all([
      cleanupExpiredEvents(),
      cleanupStaleConnections(5), // 5 minutter timeout
      cleanupOldAuditLogs(90),    // Beholder 90 dager
    ]);

    return Response.json({
      success: true,
      cleaned: {
        events: eventsCleaned,
        connections: connectionsCleaned,
        auditLogs: auditLogsCleaned,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Sync cleanup error:', error);
    return Response.json(
      { success: false, error: 'Cleanup failed' },
      { status: 500 }
    );
  }
}
