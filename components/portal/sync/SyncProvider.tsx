/**
 * SyncProvider
 * 
 * Context provider som håndterer real-time sync for hele portalen.
 * Setter opp SSE-tilkobling og TanStack Query client.
 * 
 * @example
 * // I layout.tsx:
 * <SyncProvider userId={user.id} userRole={user.role}>
 *   {children}
 * </SyncProvider>
 */

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useSync } from '@/lib/portal/sync';
import { createSyncQueryClient } from '@/lib/portal/sync/query-client';

// ════════════════════════════════════════════════════════════
// Types
// ════════════════════════════════════════════════════════════

interface SyncProviderProps {
  children: ReactNode;
  userId: string;
  userRole: string;
  enabled?: boolean;
  showDevtools?: boolean;
}

// ════════════════════════════════════════════════════════════
// Inner Component with Sync Hook
// ════════════════════════════════════════════════════════════

function SyncHandler({
  userId,
  userRole,
  enabled,
}: {
  userId: string;
  userRole: string;
  enabled: boolean;
}) {
  const { isConnected, lastError, pendingEvents } = useSync({
    userId,
    userRole,
    enabled,
    onConnect: () => {
      console.log('[Sync] Connected to real-time sync');
    },
    onDisconnect: () => {
      console.log('[Sync] Disconnected from real-time sync');
    },
    onError: (error) => {
      console.error('[Sync] Connection error:', error);
    },
  });

  // Debug logging i development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Sync] Status:', {
        isConnected,
        pendingEvents,
        lastError,
      });
    }
  }, [isConnected, pendingEvents, lastError]);

  return null;
}

// ════════════════════════════════════════════════════════════
// Main Provider
// ════════════════════════════════════════════════════════════

// Create a client singleton
let queryClientSingleton: ReturnType<typeof createSyncQueryClient> | undefined;

function getQueryClient() {
  if (!queryClientSingleton) {
    queryClientSingleton = createSyncQueryClient();
  }
  return queryClientSingleton;
}

export function SyncProvider({
  children,
  userId,
  userRole,
  enabled = true,
  showDevtools = process.env.NODE_ENV === 'development',
}: SyncProviderProps) {
  // Bruk useState for å unngå å lage ny client på hver render
  const [queryClient] = useState(() => getQueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <SyncHandler
        userId={userId}
        userRole={userRole}
        enabled={enabled}
      />
      {children}
      {showDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

// ════════════════════════════════════════════════════════════
// Re-export hooks for convenience
// ════════════════════════════════════════════════════════════

export { useSync, useSyncStatus } from '@/lib/portal/sync';
export { queryKeys } from '@/lib/portal/sync/query-keys';
