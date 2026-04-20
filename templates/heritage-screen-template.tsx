/**
 * Heritage Screen Template v1.0
 * Brukes som utgangspunkt for redesign av Sprint E–G skjermer.
 * Kopier denne filen, erstatt innhold, og tilpass til skjermens data.
 */

import { Icon } from "@/components/ui/icon";
import {
  MonoLabel,
  NightSurface,
  BentoGrid,
  BentoCard,
  BentoEyebrow,
  GlassPanel,
} from "@/components/portal/patterns";

// ─── Server-komponent (page.tsx) ───

import { requirePortalUser } from "@/lib/portal/auth";
// import { getScreenData } from "./actions";

export const metadata = {
  title: "SKJERMNAVN | AK Golf Portal",
  description: "BESKRIVELSE",
};

export default async function ScreenPage() {
  await requirePortalUser();

  // const data = await getScreenData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <MonoLabel size="xs" uppercase className="block text-outline">
          KATEGORI
        </MonoLabel>
        <h1 className="text-2xl font-bold tracking-tight text-on-surface">
          Skjermtittel
        </h1>
        <p className="text-sm text-outline">
          Beskrivelse av hva denne skjermen gjør.
        </p>
      </div>

      {/* Hovedinnhold i BentoGrid */}
      <BentoGrid>
        <BentoCard span={2}>
          <BentoEyebrow>Primært innhold</BentoEyebrow>
          <div className="mt-4 space-y-4">
            {/* Innhold her */}
          </div>
        </BentoCard>

        <BentoCard>
          <BentoEyebrow>Sekundært</BentoEyebrow>
          <div className="mt-4">
            {/* Innhold her */}
          </div>
        </BentoCard>
      </BentoGrid>

      {/* NightSurface for data-visualisering */}
      <NightSurface className="rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <MonoLabel size="xs" uppercase>Data-seksjon</MonoLabel>
          <Icon name="analytics" size={20} className="text-on-surface" />
        </div>
        {/* Charts, tabeller, eller annen data */}
      </NightSurface>

      {/* GlassPanel for handlinger */}
      <GlassPanel>
        <div className="flex items-center gap-4">
          <Icon name="check_circle" size={24} className="text-primary" />
          <div>
            <h3 className="font-semibold text-on-surface">Handling</h3>
            <p className="text-sm text-outline">Beskrivelse av handling</p>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}

// ─── Client-komponent (screen-client.tsx) — om interaktivitet trengs ───

"use client";

// import { useState } from "react";
// import { Icon } from "@/components/ui/icon";
// import { MonoLabel, BentoCard, BentoEyebrow } from "@/components/portal/patterns";

// interface ScreenClientProps {
//   data: any;
// }

// export function ScreenClient({ data }: ScreenClientProps) {
//   return (
//     <div className="space-y-8">
//       {/* Interaktivt innhold */}
//     </div>
//   );
// }
