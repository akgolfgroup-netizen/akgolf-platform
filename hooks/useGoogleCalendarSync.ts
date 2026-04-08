"use client";

import { useState, useCallback, useEffect } from "react";

interface SyncStatus {
  id: string;
  calendarId: string;
  syncEnabled: boolean;
  lastSyncAt: string | null;
  lastError: string | null;
  lastErrorAt: string | null;
  createdAt: string;
  updatedAt: string;
  blockedCount: number;
}

interface ImportedEvent {
  id: string;
  startTime: string;
  endTime: string;
  reason: string;
  externalId: string | null;
  isRecurring: boolean;
  createdAt: string;
}

interface SyncResult {
  synced: number;
  errors: number;
  message: string;
}

interface UseGoogleCalendarSyncReturn {
  status: SyncStatus | null;
  events: ImportedEvent[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  fetchStatus: () => Promise<void>;
  syncNow: () => Promise<SyncResult>;
  disconnect: () => Promise<void>;
}

/**
 * React hook for å håndtere Google Calendar synkronisering
 * 
 * @example
 * ```tsx
 * function CalendarSettings() {
 *   const { status, isLoading, syncNow, disconnect } = useGoogleCalendarSync();
 *   
 *   if (isLoading) return <Spinner />;
 *   
 *   if (!status) {
 *     return <a href="/api/portal/calendar/google/auth">Koble til Google Calendar</a>;
 *   }
 *   
 *   return (
 *     <div>
 *       <p>Sist synkronisert: {status.lastSyncAt}</p>
 *       <button onClick={syncNow}>Synkroniser nå</button>
 *       <button onClick={disconnect}>Koble fra</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useGoogleCalendarSync(): UseGoogleCalendarSyncReturn {
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [events, setEvents] = useState<ImportedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/portal/calendar/google/sync?includeEvents=true");
      
      if (!response.ok) {
        if (response.status === 404) {
          // Ingen synkronisering konfigurert
          setStatus(null);
          setEvents([]);
          return;
        }
        throw new Error("Kunne ikke hente synkroniseringsstatus");
      }

      const data = await response.json();
      setStatus(data.status);
      setEvents(data.events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukjent feil");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const syncNow = useCallback(async (): Promise<SyncResult> => {
    setIsSyncing(true);
    setError(null);

    try {
      const response = await fetch("/api/portal/calendar/google/sync", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Synkronisering feilet");
      }

      const result: SyncResult = await response.json();
      
      // Oppdater status etter synkronisering
      await fetchStatus();
      
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ukjent feil";
      setError(message);
      return { synced: 0, errors: 1, message };
    } finally {
      setIsSyncing(false);
    }
  }, [fetchStatus]);

  const disconnect = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/portal/calendar/google/sync", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Kunne ikke koble fra");
      }

      setStatus(null);
      setEvents([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukjent feil");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    events,
    isLoading,
    isSyncing,
    error,
    fetchStatus,
    syncNow,
    disconnect,
  };
}

export type { SyncStatus, ImportedEvent, SyncResult };
