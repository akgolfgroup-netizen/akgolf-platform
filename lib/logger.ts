/**
 * Strukturert logging for produksjon
 * - I development: Logger til konsollen
 * - I produksjon: Logger kun errors (bør kobles til Sentry/LogDrain)
 */

const isDev = process.env.NODE_ENV === "development";

export const logger = {
  /**
   * Informasjonslogging - kun synlig i development
   */
  info: (message: string, data?: Record<string, unknown>) => {
    if (isDev) {
      console.log(`[INFO] ${message}`, data ?? "");
    }
  },

  /**
   * Advarsler - kun synlig i development
   */
  warn: (message: string, data?: Record<string, unknown>) => {
    if (isDev) {
      console.warn(`[WARN] ${message}`, data ?? "");
    }
  },

  /**
   * Feillogging - alltid synlig
   * I produksjon bør dette sendes til Sentry/LogDrain
   */
  error: (message: string, error?: unknown) => {
    const errorMessage = error instanceof Error ? error.message : String(error ?? "");
    console.error(`[ERROR] ${message}`, errorMessage);
  },

  /**
   * Debug-logging - kun synlig i development
   */
  debug: (message: string, data?: unknown) => {
    if (isDev) {
      console.log(`[DEBUG] ${message}`, data ?? "");
    }
  },
};
