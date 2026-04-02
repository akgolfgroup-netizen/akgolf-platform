"use client";

import { useState } from "react";
import { SubscriptionTier } from "@prisma/client";
import { TierGate } from "@/components/portal/ui/tier-gate";
import { UpgradeModal } from "@/components/portal/ui/upgrade-modal";
import { UsageIndicator } from "@/components/portal/ui/usage-indicator";
import { OnboardingWizard } from "@/components/portal/onboarding/onboarding-wizard";
import { BarChart3, Brain, FileText, Video } from "lucide-react";

export default function DemoPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [demoTier, setDemoTier] = useState<SubscriptionTier>(
    SubscriptionTier.VISITOR
  );
  const [logCount, setLogCount] = useState(3);
  const [aiCount, setAiCount] = useState(1);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--color-grey-900)] mb-2">
          Portal Freemium Demo
        </h1>
        <p className="text-[var(--color-grey-500)] mb-8">
          Test de nye komponentene for freemium-modellen
        </p>

        {/* Tier selector */}
        <div className="mb-8 p-4 rounded-xl bg-[var(--color-grey-50)] border border-[var(--color-grey-200)]">
          <p className="text-sm font-medium text-[var(--color-grey-700)] mb-3">
            Simuler tier:
          </p>
          <div className="flex gap-2 flex-wrap">
            {Object.values(SubscriptionTier).map((tier) => (
              <button
                key={tier}
                onClick={() => setDemoTier(tier)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  demoTier === tier
                    ? "bg-[var(--color-grey-900)] text-white"
                    : "bg-white border border-[var(--color-grey-200)] text-[var(--color-grey-700)]"
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Usage controls */}
        <div className="mb-8 p-4 rounded-xl bg-[var(--color-grey-50)] border border-[var(--color-grey-200)]">
          <p className="text-sm font-medium text-[var(--color-grey-700)] mb-3">
            Simuler bruk:
          </p>
          <div className="flex gap-6">
            <div>
              <label className="text-xs text-[var(--color-grey-500)]">
                Logger ({logCount}/4)
              </label>
              <input
                type="range"
                min="0"
                max="4"
                value={logCount}
                onChange={(e) => setLogCount(Number(e.target.value))}
                className="w-32"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--color-grey-500)]">
                AI-analyser ({aiCount}/1)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                value={aiCount}
                onChange={(e) => setAiCount(Number(e.target.value))}
                className="w-32"
              />
            </div>
          </div>
        </div>

        {/* Demo buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-[#16a34a] text-white"
          >
            Vis Upgrade Modal
          </button>
          <button
            onClick={() => setShowOnboarding(true)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-[var(--color-grey-900)] text-white"
          >
            Vis Onboarding
          </button>
        </div>

        {/* Usage Indicator */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[var(--color-grey-900)] mb-4">
            1. Usage Indicator
          </h2>
          <div className="max-w-sm">
            <UsageIndicator
              tier={demoTier}
              logCount={logCount}
              logLimit={4}
              aiCount={aiCount}
              aiLimit={1}
              onUpgradeClick={() => setShowUpgradeModal(true)}
            />
          </div>
        </div>

        {/* Tier Gate examples */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[var(--color-grey-900)] mb-4">
            2. Tier Gate (låste features)
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* AI Treningsplan - requires PRO */}
            <div>
              <p className="text-xs text-[var(--color-grey-500)] mb-2">
                Krever PRO:
              </p>
              <TierGate
                userTier={demoTier}
                required={SubscriptionTier.PRO}
                featureName="AI Treningsplan"
              >
                <div className="p-6 rounded-xl bg-[var(--color-grey-50)] border border-[var(--color-grey-200)]">
                  <div className="flex items-center gap-3 mb-3">
                    <Brain className="w-5 h-5 text-[#16a34a]" />
                    <h3 className="font-semibold">AI Treningsplan</h3>
                  </div>
                  <p className="text-sm text-[var(--color-grey-600)]">
                    Få en personlig treningsplan basert på dine mål og
                    treningshistorikk.
                  </p>
                </div>
              </TierGate>
            </div>

            {/* TrackMan Import - requires ELITE */}
            <div>
              <p className="text-xs text-[var(--color-grey-500)] mb-2">
                Krever ELITE (Pro+):
              </p>
              <TierGate
                userTier={demoTier}
                required={SubscriptionTier.ELITE}
                featureName="TrackMan-import"
              >
                <div className="p-6 rounded-xl bg-[var(--color-grey-50)] border border-[var(--color-grey-200)]">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="w-5 h-5 text-[#16a34a]" />
                    <h3 className="font-semibold">TrackMan-import</h3>
                  </div>
                  <p className="text-sm text-[var(--color-grey-600)]">
                    Importer data direkte fra TrackMan for detaljert analyse.
                  </p>
                </div>
              </TierGate>
            </div>

            {/* Video Analysis - requires ELITE */}
            <div>
              <p className="text-xs text-[var(--color-grey-500)] mb-2">
                Krever ELITE (Pro+):
              </p>
              <TierGate
                userTier={demoTier}
                required={SubscriptionTier.ELITE}
                featureName="Videoanalyse"
              >
                <div className="p-6 rounded-xl bg-[var(--color-grey-50)] border border-[var(--color-grey-200)]">
                  <div className="flex items-center gap-3 mb-3">
                    <Video className="w-5 h-5 text-[#16a34a]" />
                    <h3 className="font-semibold">Videoanalyse</h3>
                  </div>
                  <p className="text-sm text-[var(--color-grey-600)]">
                    Last opp svingvideoer og få AI-analyse av teknikken din.
                  </p>
                </div>
              </TierGate>
            </div>

            {/* Export - requires PRO */}
            <div>
              <p className="text-xs text-[var(--color-grey-500)] mb-2">
                Krever PRO:
              </p>
              <TierGate
                userTier={demoTier}
                required={SubscriptionTier.PRO}
                featureName="Eksport"
              >
                <div className="p-6 rounded-xl bg-[var(--color-grey-50)] border border-[var(--color-grey-200)]">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-5 h-5 text-[#16a34a]" />
                    <h3 className="font-semibold">Eksport til PDF/CSV</h3>
                  </div>
                  <p className="text-sm text-[var(--color-grey-600)]">
                    Eksporter treningshistorikk og statistikk.
                  </p>
                </div>
              </TierGate>
            </div>
          </div>
        </div>

        {/* Upgrade Modal */}
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentTier={demoTier}
          trigger={logCount >= 4 ? "log_limit" : aiCount >= 1 ? "ai_limit" : "general"}
          currentUsage={{ logCount, aiCount }}
        />

        {/* Onboarding Wizard */}
        {showOnboarding && (
          <OnboardingWizard
            onComplete={(data) => {
              console.log("Onboarding completed:", data);
              setShowOnboarding(false);
              alert(
                `Onboarding fullført!\nMål: ${data.goals.join(", ")}\nFrekvens: ${data.trainingFrequency}`
              );
            }}
            onSkip={() => setShowOnboarding(false)}
          />
        )}
      </div>
    </div>
  );
}
