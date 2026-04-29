"use client";

/**
 * KartleggingClient — Brand Guide V2.0 dark "tre tester" baseline-flow.
 * Mockup: public/design-reference/handoff-2026-04-27/screens/a8-kartlegging.html
 */

import { useState } from "react";
import { KartleggingClientV2 } from "@/components/portal/kartlegging/v2/kartlegging-client-v2";
import { DataConsentDialog } from "./components/data-consent-dialog";
import type { KartleggingData } from "./actions";

interface KartleggingClientProps {
  data: KartleggingData;
}

export function KartleggingClient({ data }: KartleggingClientProps) {
  const [consentOpen, setConsentOpen] = useState(data.consentRequired);

  return (
    <>
      <KartleggingClientV2 data={data} />
      <DataConsentDialog
        open={consentOpen}
        onClose={() => setConsentOpen(false)}
      />
    </>
  );
}
