"use client";

import { useState } from "react";
import { SubscriptionTier } from "@prisma/client";
import { TierGate } from "@/components/portal/ui/tier-gate";
import { UpgradeModal } from "@/components/portal/ui/upgrade-modal";
import { UsageIndicator } from "@/components/portal/ui/usage-indicator";
import { TrialBanner } from "@/components/portal/ui/trial-banner";
import { AchievementToast } from "@/components/portal/ui/achievement-toast";
import { StreakMilestone } from "@/components/portal/gamification/streak-milestone";
import { SGRadarChart } from "@/components/portal/statistikk/sg-radar-chart";
import { ScoreTrendChart } from "@/components/portal/statistikk/score-trend-chart";
import { PeerBenchmarkCard } from "@/components/portal/sammenligning/peer-benchmark-card";
import { OnboardingWizard } from "@/components/portal/onboarding/onboarding-wizard";
import { addDays, subDays } from "date-fns";
import {
  BarChart3,
  Brain,
  FileText,
  Video,
  Trophy,
  Flame,
  Mail,
} from "lucide-react";

// Mock data for charts
const mockRounds = [
  { date: subDays(new Date(), 60), score: 92, scoreToPar: 20 },
  { date: subDays(new Date(), 50), score: 89, scoreToPar: 17 },
  { date: subDays(new Date(), 40), score: 91, scoreToPar: 19 },
  { date: subDays(new Date(), 30), score: 87, scoreToPar: 15 },
  { date: subDays(new Date(), 20), score: 85, scoreToPar: 13 },
  { date: subDays(new Date(), 14), score: 88, scoreToPar: 16 },
  { date: subDays(new Date(), 7), score: 84, scoreToPar: 12 },
  { date: new Date(), score: 82, scoreToPar: 10 },
];

const mockPlayerSG = {
  total: -2.1,
  offTheTee: -0.5,
  approach: -0.8,
  aroundTheGreen: -0.4,
  putting: -0.4,
};

const mockAchievements = [
  { key: "first_training", title: "Forste trening", description: "Logg din forste treningsokt", icon: "dumbbell" },
  { key: "week_streak", title: "Uke-streak", description: "Tren 7 dager pa rad", icon: "calendar" },
  { key: "training_10", title: "10 treningsdager", description: "Logg 10 treningsokter", icon: "flame" },
];

export default function DemoPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<typeof mockAchievements[0] | null>(null);
  const [demoTier, setDemoTier] = useState<SubscriptionTier>(SubscriptionTier.VISITOR);
  const [logCount, setLogCount] = useState(3);
  const [aiCount, setAiCount] = useState(1);
  const [streak, setStreak] = useState(12);
  const [handicap, setHandicap] = useState(15);

  const trialEndsAt = addDays(new Date(), 5);

  return (
    <div className="min-h-screen bg-[var(--color-grey-100)] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--color-grey-900)] mb-2">
          Portal Forbedringer Demo
        </h1>
        <p className="text-[var(--color-grey-500)] mb-8">
          Test alle nye komponenter fra implementeringen
        </p>

        {/* Controls */}
        <div className="mb-8 p-4 rounded-xl bg-white border border-[var(--color-grey-200)]">
          <p className="text-sm font-semibold text-[var(--color-grey-900)] mb-4">
            Kontroller
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-[var(--color-grey-500)] block mb-1">Tier</label>
              <select
                value={demoTier}
                onChange={(e) => setDemoTier(e.target.value as SubscriptionTier)}
                className="w-full p-2 rounded-lg border border-[var(--color-grey-200)] text-sm"
              >
                {Object.values(SubscriptionTier).map((tier) => (
                  <option key={tier} value={tier}>{tier}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--color-grey-500)] block mb-1">Streak ({streak} dager)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={streak}
                onChange={(e) => setStreak(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--color-grey-500)] block mb-1">Handicap ({handicap})</label>
              <input
                type="range"
                min="0"
                max="54"
                value={handicap}
                onChange={(e) => setHandicap(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--color-grey-500)] block mb-1">Logger ({logCount}/4)</label>
              <input
                type="range"
                min="0"
                max="4"
                value={logCount}
                onChange={(e) => setLogCount(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Section: Fase 1 - Konvertering */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[var(--color-grey-900)] mb-1">
            Fase 1: Konvertering
          </h2>
          <p className="text-sm text-[var(--color-grey-500)] mb-6">
            Funksjoner for a oke Free → Pro konvertering
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 1.1 Trial Banner */}
            <div className="bg-white p-6 rounded-xl border border-[var(--color-grey-200)]">
              <h3 className="text-sm font-semibold text-[var(--color-grey-900)] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--color-grey-900)] text-white text-xs flex items-center justify-center">1</span>
                Trial-banner med nedtelling
              </h3>
              <TrialBanner
                trialEndsAt={trialEndsAt}
                onUpgradeClick={() => setShowUpgradeModal(true)}
              />
            </div>

            {/* 1.2 Upgrade Modal */}
            <div className="bg-white p-6 rounded-xl border border-[var(--color-grey-200)]">
              <h3 className="text-sm font-semibold text-[var(--color-grey-900)] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--color-grey-900)] text-white text-xs flex items-center justify-center">2</span>
                Upgrade Modal (med sosial proof)
              </h3>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-[#16a34a] text-white hover:bg-[#15803d] transition-colors"
              >
                Apne Upgrade Modal
              </button>
              <p className="text-xs text-[var(--color-grey-500)] mt-2">
                Viser &quot;127 spillere oppgraderte&quot; og &quot;2.3 HCP forbedring&quot;
              </p>
            </div>

            {/* 1.3 Usage Indicator */}
            <div className="bg-white p-6 rounded-xl border border-[var(--color-grey-200)]">
              <h3 className="text-sm font-semibold text-[var(--color-grey-900)] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--color-grey-900)] text-white text-xs flex items-center justify-center">3</span>
                Usage Indicator
              </h3>
              <UsageIndicator
                tier={demoTier}
                logCount={logCount}
                logLimit={4}
                aiCount={aiCount}
                aiLimit={1}
                onUpgradeClick={() => setShowUpgradeModal(true)}
              />
            </div>

            {/* 1.4 Tier Gate */}
            <div className="bg-white p-6 rounded-xl border border-[var(--color-grey-200)]">
              <h3 className="text-sm font-semibold text-[var(--color-grey-900)] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--color-grey-900)] text-white text-xs flex items-center justify-center">4</span>
                Tier Gate (last feature)
              </h3>
              <TierGate
                userTier={demoTier}
                required={SubscriptionTier.PRO}
                featureName="AI Treningsplan"
              >
                <div className="p-4 rounded-xl bg-[var(--color-grey-50)] border border-[var(--color-grey-200)]">
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-[#16a34a]" />
                    <span className="font-medium">AI Treningsplan</span>
                  </div>
                </div>
              </TierGate>
            </div>
          </div>
        </div>

        {/* Section: Fase 2 - Engagement */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[var(--color-grey-900)] mb-1">
            Fase 2: Engagement
          </h2>
          <p className="text-sm text-[var(--color-grey-500)] mb-6">
            Funksjoner for a oke daglig bruk og motivasjon
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 2.1 Achievement Toast */}
            <div className="bg-white p-6 rounded-xl border border-[var(--color-grey-200)]">
              <h3 className="text-sm font-semibold text-[var(--color-grey-900)] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--color-grey-900)] text-white text-xs flex items-center justify-center">5</span>
                Achievement Toast (med confetti)
              </h3>
              <div className="flex flex-wrap gap-2">
                {mockAchievements.map((achievement) => (
                  <button
                    key={achievement.key}
                    onClick={() => setCurrentAchievement(achievement)}
                    className="px-3 py-2 rounded-lg text-xs font-medium bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors flex items-center gap-2"
                  >
                    <Trophy className="w-3 h-3" />
                    {achievement.title}
                  </button>
                ))}
              </div>
            </div>

            {/* 2.2 Streak Milestones */}
            <div className="bg-white p-6 rounded-xl border border-[var(--color-grey-200)]">
              <h3 className="text-sm font-semibold text-[var(--color-grey-900)] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--color-grey-900)] text-white text-xs flex items-center justify-center">6</span>
                Streak Milestones
              </h3>
              <StreakMilestone currentStreak={streak} />
            </div>

            {/* 2.3 Quick-log */}
            <div className="bg-white p-6 rounded-xl border border-[var(--color-grey-200)] md:col-span-2">
              <h3 className="text-sm font-semibold text-[var(--color-grey-900)] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--color-grey-900)] text-white text-xs flex items-center justify-center">7</span>
                Quick-log &quot;Gjenta siste okt&quot;
              </h3>
              <div className="flex items-center gap-4">
                <button className="px-4 py-2 rounded-xl text-sm font-medium bg-[var(--color-grey-100)] text-[var(--color-grey-900)] border border-[var(--color-grey-200)] flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  Gjenta siste
                </button>
                <span className="text-sm text-[var(--color-grey-500)]">
                  Kopierer focusArea, duration og exercises fra siste logg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Fase 3 - Retention */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[var(--color-grey-900)] mb-1">
            Fase 3: Retention
          </h2>
          <p className="text-sm text-[var(--color-grey-500)] mb-6">
            E-postsekvenser for a beholde brukere
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* 3.1 Weekly Summary */}
            <div className="bg-white p-6 rounded-xl border border-[var(--color-grey-200)]">
              <h3 className="text-sm font-semibold text-[var(--color-grey-900)] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--color-grey-900)] text-white text-xs flex items-center justify-center">8</span>
                Ukessammendrag e-post
              </h3>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <Mail className="w-5 h-5 text-blue-600 mb-2" />
                <p className="text-xs font-medium text-blue-900">Sendes sondag kl 18:00</p>
                <p className="text-xs text-blue-700 mt-1">Okter denne uke, streak-status, CTA</p>
              </div>
            </div>

            {/* 3.2 Win-back Day 3 */}
            <div className="bg-white p-6 rounded-xl border border-[var(--color-grey-200)]">
              <h3 className="text-sm font-semibold text-[var(--color-grey-900)] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--color-grey-900)] text-white text-xs flex items-center justify-center">9</span>
                Win-back Dag 3
              </h3>
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <Mail className="w-5 h-5 text-amber-600 mb-2" />
                <p className="text-xs font-medium text-amber-900">&quot;Vi savner deg&quot;</p>
                <p className="text-xs text-amber-700 mt-1">Streak-paminelse, motivasjon</p>
              </div>
            </div>

            {/* 3.3 Win-back Day 7 */}
            <div className="bg-white p-6 rounded-xl border border-[var(--color-grey-200)]">
              <h3 className="text-sm font-semibold text-[var(--color-grey-900)] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--color-grey-900)] text-white text-xs flex items-center justify-center">10</span>
                Win-back Dag 7
              </h3>
              <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                <Mail className="w-5 h-5 text-orange-600 mb-2" />
                <p className="text-xs font-medium text-orange-900">&quot;Din streak venter&quot;</p>
                <p className="text-xs text-orange-700 mt-1">Treningshistorikk, tips</p>
              </div>
            </div>

            {/* 3.4 Win-back Day 14 */}
            <div className="bg-white p-6 rounded-xl border border-[var(--color-grey-200)] md:col-span-3">
              <h3 className="text-sm font-semibold text-[var(--color-grey-900)] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--color-grey-900)] text-white text-xs flex items-center justify-center">11</span>
                Win-back Dag 14 (med rabattkode)
              </h3>
              <div className="p-4 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
                <Mail className="w-5 h-5 mb-2" />
                <p className="text-sm font-bold">20% rabatt pa Pro!</p>
                <p className="text-xs mt-1 opacity-90">Kode: WINBACK-XXXXXXXX • Gyldig 7 dager</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Fase 4 - Data/Innsikt */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[var(--color-grey-900)] mb-1">
            Fase 4: Data/Innsikt
          </h2>
          <p className="text-sm text-[var(--color-grey-500)] mb-6">
            Grafer og sammenligning for bedre innsikt
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 4.1 SG Radar */}
            <div className="bg-white p-6 rounded-xl border border-[var(--color-grey-200)]">
              <h3 className="text-sm font-semibold text-[var(--color-grey-900)] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--color-grey-900)] text-white text-xs flex items-center justify-center">12</span>
                SG-radar (fullstendig)
              </h3>
              <SGRadarChart
                playerSG={mockPlayerSG}
                benchmark={{
                  category: "F",
                  label: "Kompetent",
                  handicapRange: [15, 19],
                  averageScore: 93,
                  sg: { total: -2.5, offTheTee: -0.7, approach: -1.1, aroundTheGreen: -0.5, putting: -0.2 },
                }}
              />
            </div>

            {/* 4.2 Score Trend */}
            <div className="bg-white p-6 rounded-xl border border-[var(--color-grey-200)]">
              <h3 className="text-sm font-semibold text-[var(--color-grey-900)] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--color-grey-900)] text-white text-xs flex items-center justify-center">13</span>
                Score-trend graf
              </h3>
              <ScoreTrendChart
                rounds={mockRounds}
                handicap={handicap}
                showMovingAverage={true}
              />
            </div>

            {/* 4.3 Peer Benchmark */}
            <div className="bg-white p-6 rounded-xl border border-[var(--color-grey-200)] md:col-span-2">
              <h3 className="text-sm font-semibold text-[var(--color-grey-900)] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--color-grey-900)] text-white text-xs flex items-center justify-center">14</span>
                Peer Benchmark (A-K kategorier)
              </h3>
              <PeerBenchmarkCard
                handicap={handicap}
                playerSG={mockPlayerSG}
                avgScore={87}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentTier={demoTier}
          trigger={logCount >= 4 ? "log_limit" : aiCount >= 1 ? "ai_limit" : "general"}
          currentUsage={{ logCount, aiCount }}
        />

        <AchievementToast
          achievement={currentAchievement}
          onClose={() => setCurrentAchievement(null)}
        />

        {showOnboarding && (
          <OnboardingWizard
            onComplete={(data) => {
              console.log("Onboarding completed:", data);
              setShowOnboarding(false);
            }}
            onSkip={() => setShowOnboarding(false)}
          />
        )}
      </div>
    </div>
  );
}
