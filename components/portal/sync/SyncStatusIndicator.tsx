/**
 * SyncStatusIndicator
 * 
 * Visuell indikator for sync-status (tilkobling, pending events, etc.)
 * Kan plasseres i header eller som toast.
 */

'use client';

import { useSyncStatus } from '@/lib/portal/sync';
import { useEffect, useState } from 'react';

interface SyncStatusIndicatorProps {
  showLabel?: boolean;
  position?: 'inline' | 'fixed';
}

export function SyncStatusIndicator({
  showLabel = false,
  position = 'inline',
}: SyncStatusIndicatorProps) {
  const { isConnected, pendingEvents, lastError } = useSyncStatus();
  const [showPulse, setShowPulse] = useState(false);
  
  // Pulse animation når events prosesseres
  useEffect(() => {
    if (pendingEvents > 0) {
      setShowPulse(true);
      const timeout = setTimeout(() => setShowPulse(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [pendingEvents]);
  
  // Base classes
  const baseClasses = 'flex items-center gap-2 text-xs';
  const positionClasses = position === 'fixed' 
    ? 'fixed bottom-4 right-4 z-50 bg-white rounded-full px-3 py-1.5 shadow-lg border'
    : '';
  
  // Status color
  const statusColor = lastError 
    ? 'text-red-500' 
    : isConnected 
      ? 'text-green-500' 
      : 'text-yellow-500';
  
  // Dot with pulse
  const dotClasses = `w-2 h-2 rounded-full ${
    lastError 
      ? 'bg-red-500' 
      : isConnected 
        ? 'bg-green-500' 
        : 'bg-yellow-500'
  } ${showPulse ? 'animate-pulse' : ''}`;
  
  // Status text
  const statusText = lastError 
    ? 'Synk-feil' 
    : isConnected 
      ? 'Synkronisert' 
      : 'Kobler til...';
  
  return (
    <div className={`${baseClasses} ${positionClasses} ${statusColor}`}>
      <span className={dotClasses} />
      {showLabel && <span>{statusText}</span>}
      {pendingEvents > 0 && (
        <span className="bg-blue-500 text-white rounded-full px-1.5 py-0.5 text-[10px]">
          {pendingEvents}
        </span>
      )}
    </div>
  );
}

/**
 * Simplified version - bare en dot
 */
export function SyncDot() {
  const { isConnected, lastError } = useSyncStatus();
  
  const color = lastError 
    ? 'bg-red-500' 
    : isConnected 
      ? 'bg-green-500' 
      : 'bg-yellow-500';
  
  return (
    <span 
      className={`inline-block w-2 h-2 rounded-full ${color}`}
      title={lastError ? 'Synkroniseringsfeil' : isConnected ? 'Tilkoblet' : 'Kobler til...'}
    />
  );
}
