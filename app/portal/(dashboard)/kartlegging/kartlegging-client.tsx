"use client";

/**
 * KartleggingClient — spiller-profil følger portal-profil wireframe (Option 1 Dashboard).
 * Profile-header → KPI-seksjon → grid med AKPyramide + RoiCard + Forecast + Milepæler + index + tester.
 */

import { useState } from "react";
import { SubNavTabs } from "@/components/portal/layout/sub-nav-tabs";
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

const SUB_NAV_TABS = [
  { label: "Oversikt", href: "/portal/statistikk" },
  { label: "Kartlegging", href: "/portal/kartlegging" },
  { label: "Runder", href: "/portal/runde" },
  { label: "Trening", href: "/portal/dagbok" },
];

export function KartleggingClient({ data }: KartleggingClientProps) {
  const [consentOpen, setConsentOpen] = useState(data.consentRequired);

  if (!data.profile) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6">
        <SubNavTabs tabs={SUB_NAV_TABS} activeTab="/portal/kartlegging" />
        <section className="rounded-xl bg-white shadow-card p-8 text-center">
          <h1 className="text-2xl font-bold text-grey-900 tracking-tight">
            Din kartlegging
          </h1>
          <p className="mt-3 text-sm text-grey-500 max-w-md mx-auto">
            Vi trenger mer data for å bygge din profil. Registrer minst én runde
            eller TrackMan-økt, så beregnes USI-score og kategori automatisk.
          </p>
        </section>

        <DataConsentDialog
          open={consentOpen}
          onClose={() => setConsentOpen(false)}
        />
      </div>
    );
  }

  const { profile, gap, trainingIndex, testHistory, roi, forecast, milestones } =
    data;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6">
      <SubNavTabs tabs={SUB_NAV_TABS} activeTab="/portal/kartlegging" />

      <PlayerLevelHero profile={profile} />

      <DimensionGrid dimensions={profile.dimensions} />

      {gap && <GapAnalysisCard gap={gap} />}

      {/* Pedagogisk lag: pyramide + ROI side-om-side */}
      {trainingIndex && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TrainingPyramid
            index={trainingIndex}
            categoryLabel={profile.categoryLabel}
          />
          <RoiCard rows={roi} />
        </div>
      )}

      {/* Prognose + milepæler */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
        <ForecastCard points={forecast} />
        <MilestonesCard milestones={milestones} />
      </div>

      {/* Treningsindeks + tester */}
      {(trainingIndex || testHistory) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trainingIndex && <TrainingIndexCard index={trainingIndex} />}
          {testHistory && <TestResultsCard history={testHistory} />}
        </div>
      )}

      <DataConsentDialog
        open={consentOpen}
        onClose={() => setConsentOpen(false)}
      />
    </div>
  );
}
