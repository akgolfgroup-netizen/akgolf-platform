import { Icon } from "@/components/ui/icon";
'use client';

import { 
  TestResult100m, 
  TestResultDriver,
  generateCombinedSummary,
  BENCHMARKS
} from '@/lib/portal/beta-test/rory-augusta-test';


interface RoryAugustaResultProps {
  approachResult?: TestResult100m;
  driverResult?: TestResultDriver;
  playerName: string;
}

export function RoryAugustaResult({ 
  approachResult, 
  driverResult, 
  playerName 
}: RoryAugustaResultProps) {
  
  const hasBoth = approachResult && driverResult;
  const summary = hasBoth 
    ? generateCombinedSummary(approachResult, driverResult) 
    : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-inverse-on-surface dark:text-surface">
          Beat the Pro 🏆
        </h1>
        <p className="text-inverse-on-surface/60 dark:text-inverse-on-surface/60">
          {playerName} vs PGA Tour benchmarks
        </p>
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Icon name="workspace_premium" className="w-4 h-4 text-amber-500" />
            <span className="text-inverse-on-surface/60 dark:text-inverse-on-surface/60">
              Rory McIlroy (World #1)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="person"s className="w-4 h-4 text-blue-500" />
            <span className="text-inverse-on-surface/60 dark:text-inverse-on-surface/60">
              PGA Tour Gjennomsnitt
            </span>
          </div>
        </div>
      </div>

      {/* Overall Result Cards */}
      {summary && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* vs Rory */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-surface">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="workspace_premium" className="w-5 h-5" />
              <span className="font-semibold">vs Rory McIlroy</span>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">{summary.overallVsRory.emoji}</div>
              <h2 className="text-xl font-bold mb-2">{summary.overallVsRory.label}</h2>
              <div className="text-3xl font-bold">
                {summary.avgPctRory.toFixed(0)}%
              </div>
              <p className="text-sm opacity-80 mt-1">av Rory&apos;s nivå</p>
            </div>
          </div>

          {/* vs Tour Average */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-surface">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="person"s className="w-5 h-5" />
              <span className="font-semibold">vs PGA Tour Snitt</span>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">{summary.overallVsTour.emoji}</div>
              <h2 className="text-xl font-bold mb-2">{summary.overallVsTour.label}</h2>
              <div className="text-3xl font-bold">
                {summary.avgPctTour.toFixed(0)}%
              </div>
              <p className="text-sm opacity-80 mt-1">av Tour gjennomsnitt</p>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Focus */}
      {summary && (
        <div className="bg-inverse-surface dark:bg-inverse-surface rounded-2xl p-5 text-surface">
          <div className="flex items-center gap-3 mb-3">
            <Icon name="my_location" className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold">Denne ukens fokus</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-inverse-on-surface/60 mb-1">Primært mål</p>
              <p className="font-medium">{summary.primaryGoal}</p>
            </div>
            <div>
              <p className="text-sm text-inverse-on-surface/60 mb-1">Strekmål</p>
              <p className="font-medium">{summary.stretchGoal}</p>
            </div>
          </div>
          {summary.weeklyFocus !== 'both' && (
            <div className="mt-4 pt-4 border-t border-inverse-on-surface/20">
              <p className="text-sm">
                <span className="text-green-400 font-medium">Fokuser på:</span>{' '}
                {summary.weeklyFocus === 'approach' 
                  ? '100m approach (størst forbedringspotensial)' 
                  : 'Driver (størst forbedringspotensial)'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Approach Test Result */}
      {approachResult && (
        <div className="bg-surface-container-lowest dark:bg-inverse-surface rounded-2xl p-6 shadow-lg border border-outline-variant/30 dark:border-inverse-on-surface/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Icon name="my_location" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-inverse-on-surface dark:text-surface">
                100m Approach
              </h3>
              <p className="text-sm text-inverse-on-surface/70 dark:text-inverse-on-surface/60">
                10 slag fra 100m på &quot;Augusta-green&quot;
              </p>
            </div>
          </div>

          {/* Dual Benchmark Comparison */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* vs Rory */}
            <BenchmarkCard
              icon={<Icon name="workspace_premium" className="w-4 h-4" />}
              title="vs Rory McIlroy"
              color="amber"
              playerValue={approachResult.averageProximity}
              playerLabel="din gj.snitt"
              unit="m"
              benchmarkValue={approachResult.roryAverage}
              benchmarkLabel="Rory's gj.snitt"
              percentage={approachResult.percentageOfRory}
              category={approachResult.vsRory}
              diff={approachResult.proximityDiffRory}
              diffLabel={approachResult.proximityDiffRory > 0 ? 'bak' : 'foran'}
              lowerIsBetter
            />
            
            {/* vs Tour Avg */}
            <BenchmarkCard
              icon={<Icon name="person"s className="w-4 h-4" />}
              title="vs PGA Tour Snitt"
              color="blue"
              playerValue={approachResult.averageProximity}
              playerLabel="din gj.snitt"
              unit="m"
              benchmarkValue={approachResult.tourAverage}
              benchmarkLabel="Tour gj.snitt"
              percentage={approachResult.percentageOfTourAvg}
              category={approachResult.vsTourAvg}
              diff={approachResult.proximityDiffTour}
              diffLabel={approachResult.proximityDiffTour > 0 ? 'bak' : 'foran'}
              lowerIsBetter
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <MiniStat label="Beste" value={`${approachResult.bestShot.toFixed(1)}m`} />
            <MiniStat label="Dårligste" value={`${approachResult.worstShot.toFixed(1)}m`} />
            <MiniStat 
              label="Innenfor 6m" 
              value={`${approachResult.makes}/10`}
              highlight={approachResult.makes >= 6}
            />
            <MiniStat 
              label="Innenfor 6m %" 
              value={`${approachResult.makeRate.toFixed(0)}%`}
              highlight={approachResult.makeRate >= 60}
            />
          </div>

          {/* Recommendation */}
          <div className="bg-surface dark:bg-inverse-surface/50 rounded-xl p-4">
            <p className="text-sm font-medium text-inverse-on-surface/70 dark:text-inverse-on-surface/50 mb-1">
              {approachResult.recommendation}
            </p>
            <p className="text-xs text-inverse-on-surface/70 dark:text-inverse-on-surface/60">
              Neste mål: {approachResult.nextMilestone}
            </p>
          </div>
        </div>
      )}

      {/* Driver Test Result */}
      {driverResult && (
        <div className="bg-surface-container-lowest dark:bg-inverse-surface rounded-2xl p-6 shadow-lg border border-outline-variant/30 dark:border-inverse-on-surface/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Icon name="navigation" className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-inverse-on-surface dark:text-surface">
                Driver Challenge
              </h3>
              <p className="text-sm text-inverse-on-surface/70 dark:text-inverse-on-surface/60">
                10 drivere til 60m &quot;Augusta fairway&quot;
              </p>
            </div>
          </div>

          {/* Dual Benchmark Comparison */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* vs Rory */}
            <BenchmarkCard
              icon={<Icon name="workspace_premium" className="w-4 h-4" />}
              title="vs Rory McIlroy"
              color="amber"
              playerValue={driverResult.fairwaysHit}
              playerLabel="fairways"
              unit="/10"
              benchmarkValue={driverResult.roryFairways}
              benchmarkLabel="Rory's fairways"
              percentage={driverResult.percentageOfRory}
              category={driverResult.vsRory}
              diff={driverResult.fairwaysDiffRory}
              diffLabel={driverResult.fairwaysDiffRory >= 0 ? 'flere' : 'færre'}
              lowerIsBetter={false}
            />
            
            {/* vs Tour Avg */}
            <BenchmarkCard
              icon={<Icon name="person"s className="w-4 h-4" />}
              title="vs PGA Tour Snitt"
              color="blue"
              playerValue={driverResult.fairwaysHit}
              playerLabel="fairways"
              unit="/10"
              benchmarkValue={driverResult.tourFairways}
              benchmarkLabel="Tour snitt"
              percentage={driverResult.percentageOfTourAvg}
              category={driverResult.vsTourAvg}
              diff={driverResult.fairwaysDiffTour}
              diffLabel={driverResult.fairwaysDiffTour >= 0 ? 'flere' : 'færre'}
              lowerIsBetter={false}
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <MiniStat 
              label="Accuracy" 
              value={`${driverResult.fairwayRate.toFixed(0)}%`}
              highlight={driverResult.fairwayRate >= 60}
            />
            <MiniStat label="Venstre miss" value={driverResult.leftMisses.toString()} />
            <MiniStat label="Høyre miss" value={driverResult.rightMisses.toString()} />
            <MiniStat 
              label="Gj.sn. miss" 
              value={driverResult.averageMissDistance ? `${driverResult.averageMissDistance.toFixed(0)}m` : '-'}
              highlight={driverResult.averageMissDistance !== null && driverResult.averageMissDistance <= 16}
            />
          </div>

          {/* Recommendation */}
          <div className="bg-surface dark:bg-inverse-surface/50 rounded-xl p-4">
            <p className="text-sm font-medium text-inverse-on-surface/70 dark:text-inverse-on-surface/50 mb-1">
              {driverResult.recommendation}
            </p>
            <p className="text-xs text-inverse-on-surface/70 dark:text-inverse-on-surface/60">
              Neste mål: {driverResult.nextMilestone}
            </p>
          </div>
        </div>
      )}

      {/* Benchmark Reference Table */}
      <div className="bg-surface-container dark:bg-inverse-surface/50 rounded-xl p-5">
        <h4 className="font-semibold text-inverse-on-surface dark:text-surface mb-4 flex items-center gap-2">
          <Icon name="bar_chart" className="w-4 h-4" />
          Benchmark Referanse
        </h4>
        <div className="grid md:grid-cols-2 gap-6">
          {/* 100m Benchmarks */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-inverse-on-surface/60 dark:text-inverse-on-surface/60 flex items-center gap-2">
              <Icon name="my_location" className="w-4 h-4" />
              100m Approach
            </h5>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-inverse-on-surface/70 dark:text-inverse-on-surface/60">
                  <th className="text-left py-1">Benchmark</th>
                  <th className="text-right py-1">Gj.snitt</th>
                  <th className="text-right py-1">Innenfor 6m</th>
                </tr>
              </thead>
              <tbody className="text-inverse-on-surface/70 dark:text-inverse-on-surface/50">
                <tr>
                  <td className="py-1 flex items-center gap-1">
                    <Icon name="workspace_premium" className="w-3 h-3 text-amber-500" />
                    Rory McIlroy
                  </td>
                  <td className="text-right font-medium">{BENCHMARKS.rory.approach100m.averageProximity}m</td>
                  <td className="text-right">{BENCHMARKS.rory.approach100m.makes}/10</td>
                </tr>
                <tr>
                  <td className="py-1 flex items-center gap-1">
                    <Icon name="person"s className="w-3 h-3 text-blue-500" />
                    PGA Tour Snitt
                  </td>
                  <td className="text-right font-medium">{BENCHMARKS.tourAverage.approach100m.averageProximity}m</td>
                  <td className="text-right">{BENCHMARKS.tourAverage.approach100m.makes}/10</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Driver Benchmarks */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-inverse-on-surface/60 dark:text-inverse-on-surface/60 flex items-center gap-2">
              <Icon name="navigation" className="w-4 h-4" />
              Driver (60m fairway)
            </h5>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-inverse-on-surface/70 dark:text-inverse-on-surface/60">
                  <th className="text-left py-1">Benchmark</th>
                  <th className="text-right py-1">Fairways</th>
                  <th className="text-right py-1">Miss-snitt</th>
                </tr>
              </thead>
              <tbody className="text-inverse-on-surface/70 dark:text-inverse-on-surface/50">
                <tr>
                  <td className="py-1 flex items-center gap-1">
                    <Icon name="workspace_premium" className="w-3 h-3 text-amber-500" />
                    Rory McIlroy
                  </td>
                  <td className="text-right font-medium">{BENCHMARKS.rory.driver.fairways}/10</td>
                  <td className="text-right">{BENCHMARKS.rory.driver.averageMiss}m</td>
                </tr>
                <tr>
                  <td className="py-1 flex items-center gap-1">
                    <Icon name="person"s className="w-3 h-3 text-blue-500" />
                    PGA Tour Snitt
                  </td>
                  <td className="text-right font-medium">{BENCHMARKS.tourAverage.driver.fairways}/10</td>
                  <td className="text-right">{BENCHMARKS.tourAverage.driver.averageMiss}m</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface BenchmarkCardProps {
  icon: React.ReactNode;
  title: string;
  color: 'amber' | 'blue';
  playerValue: number;
  playerLabel: string;
  unit: string;
  benchmarkValue: number;
  benchmarkLabel: string;
  percentage: number;
  category: { category: string; label: string; emoji: string };
  diff: number;
  diffLabel: string;
  lowerIsBetter: boolean;
}

function BenchmarkCard({
  icon,
  title,
  color,
  playerValue,
  playerLabel,
  unit,
  benchmarkValue,
  benchmarkLabel,
  percentage,
  category,
  diff,
  diffLabel,
  lowerIsBetter,
}: BenchmarkCardProps) {
  const isBetter = lowerIsBetter ? diff < 0 : diff > 0;
  const colorClasses = {
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-600 dark:text-amber-400',
      accent: 'bg-amber-500',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-600 dark:text-blue-400',
      accent: 'bg-blue-500',
    },
  };
  
  const c = colorClasses[color];

  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-4`}>
      <div className={`flex items-center gap-2 mb-3 ${c.text}`}>
        {icon}
        <span className="font-medium text-sm">{title}</span>
      </div>
      
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-2xl font-bold text-inverse-on-surface dark:text-surface">
            {playerValue.toFixed(1)}{unit}
          </div>
          <div className="text-xs text-inverse-on-surface/70 dark:text-inverse-on-surface/60">{playerLabel}</div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium ${isBetter ? 'text-green-600' : 'text-red-600'}`}>
            {isBetter ? '✓' : ''} {Math.abs(diff).toFixed(1)}{unit} {diffLabel}
          </div>
          <div className="text-xs text-inverse-on-surface/70 dark:text-inverse-on-surface/60">
            {benchmarkLabel}: {benchmarkValue}{unit}
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-inverse-surface/30 dark:bg-inverse-surface/80 rounded-full overflow-hidden mb-3">
        <div 
          className={`h-full ${c.accent} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      
      {/* Category */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-lg">{category.emoji}</span>
          <span className="text-sm font-medium text-inverse-on-surface/70 dark:text-inverse-on-surface/50">
            {category.label}
          </span>
        </div>
        <div className="text-lg font-bold text-inverse-on-surface dark:text-surface">
          {percentage.toFixed(0)}%
        </div>
      </div>
    </div>
  );
}

function MiniStat({ 
  label, 
  value, 
  highlight = false 
}: { 
  label: string; 
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg p-3 text-center ${
      highlight 
        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
        : 'bg-surface dark:bg-inverse-surface/50'
    }`}>
      <div className={`text-sm font-bold ${
        highlight ? 'text-green-700 dark:text-green-400' : 'text-inverse-on-surface dark:text-surface'
      }`}>
        {value}
      </div>
      <div className="text-xs text-inverse-on-surface/70 dark:text-inverse-on-surface/60 mt-1">{label}</div>
    </div>
  );
}
