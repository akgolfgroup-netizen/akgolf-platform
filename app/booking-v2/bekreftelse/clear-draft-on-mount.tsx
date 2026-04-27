"use client";

import { useEffect } from "react";
import { abandonDraft } from "../actions";

/**
 * Kaller abandonDraft() én gang ved mount for å rydde signert cookie etter
 * fullført booking. Server-actions kan sette cookies — noe server-component
 * page-render ikke kan.
 */
export function ClearDraftOnMount() {
  useEffect(() => {
    abandonDraft().catch(() => {
      // Cookie har uansett 30 min TTL — silent fallback OK
    });
  }, []);

  return null;
}
