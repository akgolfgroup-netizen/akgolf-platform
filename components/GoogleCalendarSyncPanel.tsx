"use client";

import { useGoogleCalendarSync } from "@/hooks/useGoogleCalendarSync";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

interface GoogleCalendarSyncPanelProps {
  className?: string;
}

/**
 * Admin-panel for Google Calendar synkronisering
 * 
 * Viser:
 * - Koblingsstatus
 * - Siste synkronisering
 * - Antall importerte events
 * - Manuel synkronisering
 * - Frakobling
 */
export function GoogleCalendarSyncPanel({ className }: GoogleCalendarSyncPanelProps) {
  const {
    status,
    events,
    isLoading,
    isSyncing,
    error,
    syncNow,
    disconnect,
  } = useGoogleCalendarSync();

  if (isLoading) {
    return (
      <div className={`p-6 bg-white rounded-lg shadow ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  // Ikke tilkoblet
  if (!status) {
    return (
      <div className={`p-6 bg-white rounded-lg shadow ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Google Calendar
        </h3>
        <p className="text-gray-600 mb-4">
          Koble til Google Calendar for automatisk å blokkere tider når du har
          møter i din personlige kalender.
        </p>
        <a
          href="/api/portal/calendar/google/auth"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Koble til Google Calendar
        </a>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-white rounded-lg shadow ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Google Calendar
        </h3>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status.syncEnabled
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status.syncEnabled ? "Aktiv" : "Pauset"}
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Kalender:</span>
          <span className="font-medium">
            {status.calendarId === "primary" ? "Primærkalender" : status.calendarId}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Sist synkronisert:</span>
          <span className="font-medium">
            {status.lastSyncAt
              ? format(new Date(status.lastSyncAt), "dd.MM.yyyy HH:mm", { locale: nb })
              : "Aldri"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Importerte events:</span>
          <span className="font-medium">{status.blockedCount}</span>
        </div>

        {status.lastError && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">
            <p className="font-medium">Siste feil:</p>
            <p className="text-sm">{status.lastError}</p>
            {status.lastErrorAt && (
              <p className="text-xs mt-1">
                {format(new Date(status.lastErrorAt), "dd.MM.yyyy HH:mm", { locale: nb })}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Siste importerte events */}
      {events.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Siste importerte events
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="p-3 bg-gray-50 rounded-md text-sm"
              >
                <div className="font-medium text-gray-900">{event.reason}</div>
                <div className="text-gray-600">
                  {format(new Date(event.startTime), "dd.MM.yyyy HH:mm", { locale: nb })} -{" "}
                  {format(new Date(event.endTime), "HH:mm", { locale: nb })}
                </div>
                {event.isRecurring && (
                  <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Gjentakende
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Handlinger */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={syncNow}
          disabled={isSyncing}
          className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSyncing ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Synkroniserer...
            </>
          ) : (
            "Synkroniser nå"
          )}
        </button>

        <button
          onClick={disconnect}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Koble fra
        </button>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Synkronisering kjører automatisk hver time. Private events og
        events markert som &quot;ledig&quot; synkroniseres ikke.
      </p>
    </div>
  );
}
