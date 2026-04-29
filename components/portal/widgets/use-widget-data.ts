"use client";

import { useEffect, useState } from "react";

/**
 * Felles hook for widget-data-loading. Kaller en server action ved mount,
 * cachet ikke (widgets er sjelden-rendret pa dashbord), men handterer
 * loading- og error-state likt overalt.
 */
export function useWidgetData<T>(
  loader: () => Promise<T>,
  initial: T,
): { data: T; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    loader()
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error };
}
