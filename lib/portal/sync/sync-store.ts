/**
 * Zustand store for sync state
 * 
 * Global state for sync-tilkobling som deles på tvers av komponenter.
 */

import { create } from 'zustand';
import type { SyncState, SyncActions } from './types';

type SyncStore = SyncState & SyncActions;

const initialState: SyncState = {
  isConnected: false,
  lastSyncAt: null,
  pendingEvents: 0,
  isSyncing: false,
  lastError: null,
  eventsReceived: 0,
  eventsProcessed: 0,
};

export const useSyncStore = create<SyncStore>((set) => ({
  ...initialState,
  
  setConnected: (connected: boolean) => 
    set({ isConnected: connected }),
  
  setLastSyncAt: (timestamp: string) => 
    set({ lastSyncAt: timestamp }),
  
  incrementPending: () => 
    set((state) => ({ 
      pendingEvents: state.pendingEvents + 1,
      eventsReceived: state.eventsReceived + 1,
      isSyncing: true,
    })),
  
  decrementPending: () => 
    set((state) => ({ 
      pendingEvents: Math.max(0, state.pendingEvents - 1),
      isSyncing: state.pendingEvents > 1,
    })),
  
  markEventProcessed: () => 
    set((state) => ({
      pendingEvents: Math.max(0, state.pendingEvents - 1),
      eventsProcessed: state.eventsProcessed + 1,
      isSyncing: state.pendingEvents > 1,
    })),
  
  setError: (error: string | null) => 
    set({ lastError: error }),
  
  reset: () => set(initialState),
}));
