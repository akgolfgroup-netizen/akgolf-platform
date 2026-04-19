"use client";

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
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">
        <SubNavTabs tabs={SUB_NAV_TABS} activeTab="/portal/kartlegging" />
        <div className="bg-portal-card rounded-2xl p-8 text-center shadow-portal-card border border-portal-border-subtle">
          <h1 className="text-2xl font-bold text-portal-text">
            Din kartlegging
          </h1>
          <p className="mt-3 text-sm text-portal-secondary max-w-md mx-auto">
            Vi trenger mer data for å bygge din profil. Registrer minst én runde
            eller TrackMan-økt, så beregnes USI-score og kategori automatisk.
          </p>
        </div>

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
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">
      <SubNavTabs tabs={SUB_NAV_TABS} activeTab="/portal/kartlegging" />
      <PlayerLevelHero profile={profile} />

      <DimensionGrid dimensions={profile.dimensions} />

      {gap && <GapAnalysisCard gap={gap} />}

      {trainingIndex && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TrainingPyramid
            index={trainingIndex}
            categoryLabel={profile.categoryLabel}
          />
          <RoiCard rows={roi} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ForecastCard points={forecast} />
        <MilestonesCard milestones={milestones} />
      </div>

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
