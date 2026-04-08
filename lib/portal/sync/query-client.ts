/**
 * TanStack Query Client Configuration
 * 
 * Konfigurasjon for optimal cache-håndtering med sync-systemet.
 */

import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';

// ════════════════════════════════════════════════════════════
// Default Configuration
// ════════════════════════════════════════════════════════════

export const syncQueryClientConfig = {
  defaultOptions: {
    queries: {
      // Data anses som friskt i 1 minutt
      staleTime: 60 * 1000,
      
      // Cache holdes i 5 minutter etter siste bruk
      gcTime: 5 * 60 * 1000,
      
      // Retry-logikk
      retry: 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch på window focus (men ikke for ofte)
      refetchOnWindowFocus: true,
      
      // Refetch på network reconnect
      refetchOnReconnect: true,
      
      // Refetch on mount hvis data er stale
      refetchOnMount: 'always' as const,
    },
    mutations: {
      // Retry mutations ikke automatisk (de kan ha side-effects)
      retry: false,
    },
  },
};

// ════════════════════════════════════════════════════════════
// Create Query Client
// ════════════════════════════════════════════════════════════

export function createSyncQueryClient(): QueryClient {
  return new QueryClient({
    ...syncQueryClientConfig,
    queryCache: new QueryCache({
      onError: (error, query) => {
        // Global error handler for queries
        console.error(`Query error for ${query.queryKey.join('/')}:`, error);
        
        // Kan sende til error tracking service her
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('query-error', {
            detail: { queryKey: query.queryKey, error },
          }));
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, variables, context, mutation) => {
        // Global error handler for mutations
        console.error(`Mutation error:`, error);
        
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('mutation-error', {
            detail: { mutationKey: mutation.options.mutationKey, error, variables },
          }));
        }
      },
      onSuccess: (data, variables, context, mutation) => {
        // Global success handler
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('mutation-success', {
            detail: { mutationKey: mutation.options.mutationKey, data, variables },
          }));
        }
      },
    }),
  });
}
