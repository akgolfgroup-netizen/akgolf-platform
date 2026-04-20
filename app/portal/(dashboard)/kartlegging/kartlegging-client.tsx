"use client";

/**
 * KartleggingClient — spillerens samlede profil.
 * Layout justert mot Heritage coach_player_view: header + seksjonert innhold.
 */

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PlayerLevelHero } from "./components/player-level-hero";
import { DimensionGrid } from "./components/dimension-grid";
import { GapAnalysisCard } from "./components/gap-analysis-card";
import { TrainingPyramid } from "./components/training-pyramid";
import { RoiCard } from "./components/roi-card";
import { ForecastCard } from "./components/forecast-card";
import { MilestonesCard } from "./components/milestones-card";
import { TrainingIndexCard } from "./components/training-index-card";
import { TestResultsCard } from "./components/test-results-card";
import { DataConsentDialog } from "./components/data-consent-dialog";
import type { KartleggingData } from "./actions";

interface KartleggingClientProps {
  data: KartleggingData;
}

export function KartleggingClient({ data }: KartleggingClientProps) {
  const [consentOpen, setConsentOpen] = useState(data.consentRequired);

  if (!data.profile) {
    return (
      <section className="space-y-6">
        <KartleggingHeader />
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-outline-variant/40 bg-surface-container-lowest p-12 text-center">
          <Icon name="insights" size={48} className="text-primary/30" />
          <div>
            <h2 className="text-xl font-bold text-primary">
              Din kartlegging kommer her
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-on-surface-variant">
              Vi trenger mer data for å bygge profilen. Registrer minst én
              runde eller TrackMan-økt, så beregnes USI-score og kategori
              automatisk.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/portal/runde/ny"
              className="rounded-lg bg-secondary-fixed px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-primary hover:opacity-90"
            >
              Ny runde
            </Link>
            <Link
              href="/portal/trackman/ny"
              className="rounded-lg border border-outline-variant px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-primary hover:bg-surface-container"
            >
              TrackMan-økt
            </Link>
          </div>
        </div>
        <DataConsentDialog
          open={consentOpen}
          onClose={() => setConsentOpen(false)}
        />
      </section>
    );
  }

  const {
    profile,
    gap,
    trainingIndex,
    testHistory,
    roi,
    forecast,
    milestones,
  } = data;

  return (
    <section className="space-y-6">
      <KartleggingHeader />

      <PlayerLevelHero profile={profile} />

      <DimensionGrid dimensions={profile.dimensions} />

      {gap && <GapAnalysisCard gap={gap} />}

      {trainingIndex && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TrainingPyramid
            index={trainingIndex}
            categoryLabel={profile.categoryLabel}
          />
          <RoiCard rows={roi} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <ForecastCard points={forecast} />
        <MilestonesCard milestones={milestones} />
      </div>

      {(trainingIndex || testHistory) && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {trainingIndex && <TrainingIndexCard index={trainingIndex} />}
          {testHistory && <TestResultsCard history={testHistory} />}
        </div>
      )}

      <DataConsentDialog
        open={consentOpen}
        onClose={() => setConsentOpen(false)}
      />
    </section>
  );
}

function KartleggingHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 pb-2">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Spillerprofil
        </h1>
        <div className="hidden h-4 w-px bg-outline-variant sm:block" />
        <div className="hidden items-center gap-2 rounded-full bg-surface-container px-3 py-1 sm:flex">
          <div className="h-2 w-2 rounded-full bg-secondary-fixed" />
          <span className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
            USI · Kategori · Gap
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/portal/treningsplan"
          className="flex items-center gap-2 rounded-lg border border-outline-variant px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-primary hover:bg-surface-container"
        >
          <Icon name="list_alt" size={14} />
          Treningsplan
        </Link>
        <Link
          href="/portal/bookinger/ny"
          className="flex items-center gap-2 rounded-lg bg-secondary-fixed px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-primary hover:opacity-90 active:scale-95"
        >
          <Icon name="event" size={14} />
          Book time
        </Link>
      </div>
    </header>
  );
}
