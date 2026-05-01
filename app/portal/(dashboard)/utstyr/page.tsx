import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Radar } from "lucide-react";
import { requirePortalUser } from "@/lib/portal/auth";
import { getPlayerBag } from "../bag/actions";
import { getTrackManOverview } from "../trackman/actions";
import { BagClientV2 } from "@/components/portal/bag/v2/bag-client-v2";
import { TrackManLabClient } from "@/components/portal/trackman/v2/trackman-lab-client";

export const metadata: Metadata = {
  title: "Utstyr | PlayersHQ",
  description:
    "Din golfbag og TrackMan-data samlet pa ett sted. Klubber, distanser, spredning og analyser.",
};

export const dynamic = "force-dynamic";

interface UtstyrPageProps {
  searchParams: Promise<{ tab?: string }>;
}

type UtstyrTab = "bag" | "trackman";

const VALID_TABS: UtstyrTab[] = ["bag", "trackman"];

export default async function UtstyrPage({ searchParams }: UtstyrPageProps) {
  await requirePortalUser();

  const params = await searchParams;
  const tab: UtstyrTab = VALID_TABS.includes(params.tab as UtstyrTab)
    ? (params.tab as UtstyrTab)
    : "bag";

  return (
    <div>
      {/* Tab-bar */}
      <div className="mb-6 flex items-center gap-2 rounded-2xl bg-white border border-line p-1 shadow-card">
        <TabLink
          href="/portal/utstyr?tab=bag"
          active={tab === "bag"}
          icon={<Briefcase className="w-4 h-4" />}
          label="Bag"
          subtitle="14 koller"
        />
        <TabLink
          href="/portal/utstyr?tab=trackman"
          active={tab === "trackman"}
          icon={<Radar className="w-4 h-4" />}
          label="TrackMan"
          subtitle="Slag-data"
        />
      </div>

      {/* Tab-innhold */}
      {tab === "bag" ? <BagTabContent /> : <TrackManTabContent />}
    </div>
  );
}

function TabLink({
  href,
  active,
  icon,
  label,
  subtitle,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl transition-colors min-h-11"
      style={{
        background: active ? "var(--color-primary, #005840)" : "transparent",
        color: active ? "#FFFFFF" : "var(--color-ink-muted, #5C6B62)",
      }}
    >
      <span
        className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
        style={{
          background: active ? "rgba(255,255,255,0.15)" : "var(--color-line-soft, #EDF1EE)",
        }}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold leading-tight">{label}</div>
        <div
          className="text-[11px]"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            letterSpacing: "0.06em",
            opacity: 0.7,
          }}
        >
          {subtitle}
        </div>
      </div>
    </Link>
  );
}

async function BagTabContent() {
  const { clubs, gapAnalysis } = await getPlayerBag();
  return <BagClientV2 clubs={clubs} gapAnalysis={gapAnalysis} />;
}

async function TrackManTabContent() {
  const data = await getTrackManOverview();
  return <TrackManLabClient data={data} />;
}
