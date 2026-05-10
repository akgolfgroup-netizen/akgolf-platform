/**
 * Signal Cache — AK Golf HQ
 * 1-times TTL cache for beregnede signaler.
 * Sprint 0: Kun stub.
 */

import type { Signal } from "./registry";

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 time

interface CacheEntry {
  signals: Signal[];
  cachedAt: number;
}

const cache = new Map<string, CacheEntry>();

export function getCachedSignals(playerId: string): Signal[] | null {
  const entry = cache.get(playerId);
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    cache.delete(playerId);
    return null;
  }
  return entry.signals;
}

export function setCachedSignals(playerId: string, signals: Signal[]): void {
  cache.set(playerId, { signals, cachedAt: Date.now() });
}

export function invalidateCache(playerId?: string): void {
  if (playerId) {
    cache.delete(playerId);
  } else {
    cache.clear();
  }
}
