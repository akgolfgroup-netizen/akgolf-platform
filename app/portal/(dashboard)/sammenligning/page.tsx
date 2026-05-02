import { requirePortalUser } from "@/lib/portal/auth";
import { TierGate } from "@/components/portal/ui/tier-gate";
import { getPeerComparisonData } from "./actions";
import {
  getNationalBenchmark,
  getNationalPercentages,
  getPyramidLevels,
  pyramidLevelCodeForHcp,
} from "@/lib/portal/sammenligning/actions";
import { SubscriptionTier } from "@prisma/client";
import { SammenligningShell } from "@/components/portal/sammenligning/v2/sammenligning-shell";
import { SammenligningPageHeader } from "@/components/portal/sammenligning/v2/sammenligning-page-header";
import { PercentileHero } from "@/components/portal/sammenligning/v2/percentile-hero";
import { FocusCallout } from "@/components/portal/sammenligning/v2/focus-callout";
import { SectionHeading } from "@/components/portal/sammenligning/v2/section-heading";
import {
  ComparisonCard,
  type ComparisonRow,
} from "@/components/portal/sammenligning/v2/comparison-card";
import { EmptyState } from "@/components/portal/sammenligning/v2/empty-state";
import {
  PyramidCard,
  type PyramidLevel,
} from "@/components/portal/sammenligning/v2/pyramid-card";
import { ComparisonFilterBar } from "@/components/portal/sammenligning/v2/comparison-filter-bar";

function fmtSG(value: number): string {
  const sign = value >= 0 ? "+" : "−";
  return `${sign}${Math.abs(value).toFixed(2)}`;
}

function pctToFill(value: number, min: number, max: number): number {
  if (max === min) return 50;
  return Math.max(8, Math.min(96, ((value - min) / (max - min)) * 100));
}

export default async function SammenligningPage() {
  const user = await requirePortalUser();
  const userTier = (user?.subscriptionTier ?? "VISITOR") as SubscriptionTier;

  // Hent peer-data + nasjonalt benchmark + AK-pyramide parallelt.
  const [data, nationalSG, nationalPct, pyramidLevels] = await Promise.all([
    getPeerComparisonData(),
    getNationalBenchmark(),
    getNationalPercentages(),
    getPyramidLevels(),
  ]);

  return (
    <SammenligningShell>
      <SammenligningPageHeader />

      <TierGate userTier={userTier} required={SubscriptionTier.PRO}>
        {!data || "error" in data ? (
          <EmptyState
            message={
              data && "error" in data && typeof data.error === "string"
                ? data.error
                : "Registrer handicap og noen runder for å se sammenligning."
            }
          />
        ) : (
          <SammenligningContent
            data={data}
            nationalSG={nationalSG}
            nationalPct={nationalPct}
            pyramidLevels={pyramidLevels}
          />
        )}
      </TierGate>
    </SammenligningShell>
  );
}

type ContentData = Exclude<
  Awaited<ReturnType<typeof getPeerComparisonData>>,
  null | { error: string }
>;

function SammenligningContent({
  data,
  nationalSG,
  nationalPct,
  pyramidLevels,
}: {
  data: ContentData;
  nationalSG: Awaited<ReturnType<typeof getNationalBenchmark>>;
  nationalPct: Awaited<ReturnType<typeof getNationalPercentages>>;
  pyramidLevels: Awaited<ReturnType<typeof getPyramidLevels>>;
}) {
  const percentile = Math.round(
    (data.aboveAverageCount / Math.max(1, data.totalSGCategories)) * 100
  );

  // Bruk skillLevel-koden fra peer-data (ikke en uavhengig HCP-mapping).
  // Pyramide-kortet kollapser H-K til ett band.
  const yourLevelCode = pyramidLevelCodeForHcp(data.handicap);
  const yourLevel = pyramidLevels.find((l) => l.level === yourLevelCode);
  const levels: PyramidLevel[] = pyramidLevels.map((l) => ({
    ...l,
    isYou: l.level === yourLevelCode,
  }));

  // Identify weakest SG area for focus callout
  const sgKeys = [
    { key: "sgOffTheTee", label: "SG Off-the-tee", nat: nationalSG.sgOffTheTee },
    { key: "sgApproach", label: "SG Approach", nat: nationalSG.sgApproach },
    {
      key: "sgAroundTheGreen",
      label: "SG Around the green",
      nat: nationalSG.sgAroundTheGreen,
    },
    { key: "sgPutting", label: "SG Putting", nat: nationalSG.sgPutting },
  ] as const;

  const weakest = sgKeys
    .map((k) => ({
      ...k,
      delta: data.myStats[k.key] - data.peerStats[k.key],
    }))
    .sort((a, b) => a.delta - b.delta)[0];

  return (
    <>
      <ComparisonFilterBar
        period="90d"
        peerLabel={`Peer (${data.skillLevel.labelNO})`}
        dataTypeLabel="Alle stats"
      />

      <PercentileHero
        percentile={percentile}
        strongest={data.skillLevel.labelNO.toLowerCase()}
        opportunity={
          weakest
            ? `${weakest.label} ligger ${fmtSG(weakest.delta)} bak peer`
            : undefined
        }
        peerLabel={`peer-gruppen (n = ${data.peerCount})`}
      />

      {weakest && weakest.delta < 0 ? (
        <FocusCallout
          title={`Største mulighet: ${weakest.label}`}
          tag={`${fmtSG(weakest.delta)} stroke / runde`}
          description={`Du ligger ${Math.abs(weakest.delta).toFixed(2)} strokes bak peer i ${weakest.label.toLowerCase()}. Diskuter med treneren din — riktig fokus her gir størst poenggevinst.`}
        />
      ) : null}

      <SectionHeading
        title="Detaljert sammenligning"
        sub={
          <>
            <span style={{ color: "#D1F843" }}>●</span> Du
            &nbsp;&nbsp;<span style={{ color: "#6BB1FF" }}>●</span> Peer (
            {data.skillLevel.labelNO})
            &nbsp;&nbsp;<span style={{ color: "rgba(255,255,255,0.45)" }}>●</span>{" "}
            PGA Tour-snitt
          </>
        }
      />
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        {sgKeys.map(({ key, label, nat }) => {
          const mine = data.myStats[key];
          const peer = data.peerStats[key];
          const allValues = [mine, peer, nat];
          const min = Math.min(...allValues) - 0.5;
          const max = Math.max(...allValues) + 0.5;
          const delta = mine - peer;
          const myPerc = mine > peer ? 65 : mine === peer ? 50 : 30;
          const rows: ComparisonRow[] = [
            { label: "Du", value: fmtSG(mine), pct: pctToFill(mine, min, max) },
            { label: "Peer", value: fmtSG(peer), pct: pctToFill(peer, min, max) },
            {
              label: "Pyramide",
              value: fmtSG(nat),
              pct: pctToFill(nat, min, max),
            },
          ];
          return (
            <ComparisonCard
              key={key}
              title={label}
              subtitle="Strokes Gained per runde"
              percentile={myPerc}
              rows={rows}
              deltaLabel="vs peer"
              deltaValue={`${fmtSG(delta)} strokes`}
              deltaPositive={delta >= 0}
            />
          );
        })}

        <ComparisonCard
          title="GIR-prosent"
          subtitle="Greens in Regulation"
          percentile={data.myStats.girPct >= data.peerStats.girPct ? 65 : 35}
          rows={[
            {
              label: "Du",
              value: `${data.myStats.girPct} %`,
              pct: data.myStats.girPct,
            },
            {
              label: "Peer",
              value: `${data.peerStats.girPct} %`,
              pct: data.peerStats.girPct,
            },
            {
              label: "Pyramide",
              value: `${nationalPct.girPct} %`,
              pct: nationalPct.girPct,
            },
          ]}
          deltaLabel="vs peer"
          deltaValue={`${data.myStats.girPct - data.peerStats.girPct >= 0 ? "+" : ""}${data.myStats.girPct - data.peerStats.girPct} %-poeng`}
          deltaPositive={data.myStats.girPct >= data.peerStats.girPct}
        />

        <ComparisonCard
          title="Fairway-prosent"
          subtitle="Treff på fairway fra tee"
          percentile={data.myStats.fairwayPct >= data.peerStats.fairwayPct ? 65 : 35}
          rows={[
            {
              label: "Du",
              value: `${data.myStats.fairwayPct} %`,
              pct: data.myStats.fairwayPct,
            },
            {
              label: "Peer",
              value: `${data.peerStats.fairwayPct} %`,
              pct: data.peerStats.fairwayPct,
            },
            {
              label: "Pyramide",
              value: `${nationalPct.fairwayPct} %`,
              pct: nationalPct.fairwayPct,
            },
          ]}
          deltaLabel="vs peer"
          deltaValue={`${data.myStats.fairwayPct - data.peerStats.fairwayPct >= 0 ? "+" : ""}${data.myStats.fairwayPct - data.peerStats.fairwayPct} %-poeng`}
          deltaPositive={data.myStats.fairwayPct >= data.peerStats.fairwayPct}
        />
      </div>

      <SectionHeading
        title="Plassering i AK-pyramiden"
        sub="A–K · talentutviklingsmodell"
      />
      <PyramidCard
        levels={levels}
        yourLevelLabel={`nivå ${yourLevelCode}`}
        description={`${yourLevel?.name ?? "Spiller"} — basert på din HCP ${data.handicap.toFixed(1)} og snittscore. ${data.peerCount} andre spillere er i samme gruppe. Trenden de siste 90 dagene styrer fremgangen din.`}
        stats={[
          { label: "Din HCP", value: data.handicap.toFixed(1) },
          {
            label: "Runder analysert",
            value: String(data.myRoundCount),
          },
          {
            label: "Områder over snitt",
            value: `${data.aboveAverageCount}/${data.totalSGCategories}`,
            accent: true,
          },
          {
            label: "Peer-utvalg",
            value: String(data.peerCount),
            smallSuffix: "spillere",
          },
        ]}
      />
    </>
  );
}
