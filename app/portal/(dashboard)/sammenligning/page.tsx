import { requirePortalUser } from "@/lib/portal/auth";
import { TierGate } from "@/components/portal/ui/tier-gate";
import { getPeerComparisonData } from "./actions";
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

const PYRAMID_LEVELS: Omit<PyramidLevel, "isYou">[] = [
  { level: "A", name: "Tour-spiller", desc: "Hovedtour · topp 0,1 %", hcpRange: "+5.0 ↓", population: 12 },
  { level: "B", name: "Challenge-tour", desc: "Scratch · topp 1 %", hcpRange: "+2.0 ↓", population: 38 },
  { level: "C", name: "Elite amatør", desc: "Nord · topp 5 %", hcpRange: "0–4.0", population: 94 },
  { level: "D", name: "Klubbelite", desc: "Topp klubb-amatører", hcpRange: "4.1–7.5", population: 218 },
  { level: "E", name: "Kompetent klubbspiller", desc: "Hovedtyngde lavt HCP", hcpRange: "7.6–11.0", population: 412 },
  { level: "F", name: "Erfaren spiller", desc: "Hovedtyngde", hcpRange: "11.1–15.0", population: 684 },
  { level: "G", name: "Bogey-spiller", desc: "Jevn utvikling", hcpRange: "15.1–20.0", population: 540 },
  { level: "H–K", name: "Mosjonist · ny spiller", desc: "Opplæring & klubbliv", hcpRange: "20.1+", population: 820 },
];

function pyramidLevelForHcp(hcp: number): string {
  if (hcp <= -5) return "A";
  if (hcp <= 2) return "B";
  if (hcp <= 4) return "C";
  if (hcp <= 7.5) return "D";
  if (hcp <= 11) return "E";
  if (hcp <= 15) return "F";
  if (hcp <= 20) return "G";
  return "H–K";
}

export default async function SammenligningPage() {
  const user = await requirePortalUser();
  const userTier = (user?.subscriptionTier ?? "VISITOR") as SubscriptionTier;

  const data = await getPeerComparisonData();

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
          <SammenligningContent data={data} />
        )}
      </TierGate>
    </SammenligningShell>
  );
}

type ContentData = Exclude<
  Awaited<ReturnType<typeof getPeerComparisonData>>,
  null | { error: string }
>;

function SammenligningContent({ data }: { data: ContentData }) {
  const percentile = Math.round(
    (data.aboveAverageCount / Math.max(1, data.totalSGCategories)) * 100
  );

  const yourLevelCode = pyramidLevelForHcp(data.handicap);
  const yourLevel = PYRAMID_LEVELS.find((l) => l.level === yourLevelCode);
  const levels: PyramidLevel[] = PYRAMID_LEVELS.map((l) => ({
    ...l,
    isYou: l.level === yourLevelCode,
  }));

  // Identify weakest SG area for focus callout
  const sgKeys = [
    { key: "sgOffTheTee", label: "SG Off-the-tee" },
    { key: "sgApproach", label: "SG Approach" },
    { key: "sgAroundTheGreen", label: "SG Around the green" },
    { key: "sgPutting", label: "SG Putting" },
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
            AK-pyramide
          </>
        }
      />
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        {sgKeys.map(({ key, label }) => {
          const mine = data.myStats[key];
          const peer = data.peerStats[key];
          const allValues = [mine, peer, 0];
          const min = Math.min(...allValues) - 0.5;
          const max = Math.max(...allValues) + 0.5;
          const delta = mine - peer;
          const myPerc = mine > peer ? 65 : mine === peer ? 50 : 30;
          const rows: ComparisonRow[] = [
            { label: "Du", value: fmtSG(mine), pct: pctToFill(mine, min, max) },
            { label: "Peer", value: fmtSG(peer), pct: pctToFill(peer, min, max) },
            { label: "Pyramide", value: "+0.00", pct: pctToFill(0, min, max) },
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
            { label: "Pyramide", value: "48 %", pct: 48 },
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
            { label: "Pyramide", value: "55 %", pct: 55 },
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
