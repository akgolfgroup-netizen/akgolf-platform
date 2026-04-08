/**
 * Sync Status API
 * 
 * Returns current sync status for the authenticated user.
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/portal/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return Response.json({ error: 'Missing userId' }, { status: 400 });
  }
  
  try {
    // Get pending events count
    const pendingEvents = await prisma.syncEvent.count({
      where: {
        targetUserIds: { has: userId },
        status: { in: ['PENDING', 'FAILED'] },
        expiresAt: { gt: new Date() },
        NOT: { deliveredTo: { has: userId } },
      },
    });
    
    // Get active connection
    const connection = await prisma.syncConnection.findFirst({
      where: {
        userId,
        disconnectedAt: null,
      },
      orderBy: { lastPingAt: 'desc' },
    });
    
    // Get recent events
    const recentEvents = await prisma.syncEvent.findMany({
      where: {
        targetUserIds: { has: userId },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        type: true,
        status: true,
        createdAt: true,
        sourceSystem: true,
      },
    });
    
    return Response.json({
      isConnected: !!connection,
      lastPingAt: connection?.lastPingAt?.toISOString() ?? null,
      pendingEvents,
      recentEvents,
    });
  } catch (error) {
    console.error('Sync status error:', error);
    return Response.json(
      { error: 'Failed to get sync status' },
      { status: 500 }
    );
  }
}
