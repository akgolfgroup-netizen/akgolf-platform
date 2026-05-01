import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, MapPin } from "lucide-react";
import { requirePortalUser } from "@/lib/portal/auth";
import { canAccessMissionControl } from "@/lib/portal/rbac";
import { CoachHQDarkShell } from "@/components/admin/coachhq-dark";
import { getLocationsConfigData } from "../lokasjoner/actions";
import { getWeekBookings, getLiveStatus } from "../fasiliteter/actions";
import { LokasjonerClient } from "../lokasjoner/lokasjoner-client";
import FasiliteterClient from "../fasiliteter/fasiliteter-client";

export const metadata: Metadata = {
  title: "Anlegg | CoachHQ",
};

export const dynamic = "force-dynamic";

interface AnleggPageProps {
  searchParams: Promise<{ tab?: string }>;
}

type AnleggTab = "lokasjoner" | "fasiliteter";

const VALID_TABS: AnleggTab[] = ["lokasjoner", "fasiliteter"];

export default async function AnleggPage({ searchParams }: AnleggPageProps) {
  const user = await requirePortalUser();
  if (!canAccessMissionControl(user.role)) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const tab: AnleggTab = VALID_TABS.includes(params.tab as AnleggTab)
    ? (params.tab as AnleggTab)
    : "lokasjoner";

  return (
    <CoachHQDarkShell
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      }}
      title="Anlegg"
      meta="Lokasjoner og fasiliteter"
    >
      <div>
        {/* Tab-bar */}
        <div
          className="mb-6 flex items-center gap-2 rounded-2xl p-1"
          style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
        >
          <TabLink
            href="/admin/anlegg?tab=lokasjoner"
            active={tab === "lokasjoner"}
            icon={<MapPin className="w-4 h-4" />}
            label="Lokasjoner"
            subtitle="Steder + tjenester"
          />
          <TabLink
            href="/admin/anlegg?tab=fasiliteter"
            active={tab === "fasiliteter"}
            icon={<Building2 className="w-4 h-4" />}
            label="Fasiliteter"
            subtitle="Booking-kart + live"
          />
        </div>

        {/* Tab-innhold */}
        {tab === "lokasjoner" ? <LokasjonerTab /> : <FasiliteterTab />}
      </div>
    </CoachHQDarkShell>
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
        background: active ? "#D1F843" : "transparent",
        color: active ? "#0F1F18" : "rgba(255,255,255,0.65)",
      }}
    >
      <span
        className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
        style={{
          background: active
            ? "rgba(15,31,24,0.15)"
            : "rgba(255,255,255,0.06)",
        }}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0 text-left">
        <div className="text-sm font-bold leading-tight">{label}</div>
        <div
          className="text-[11px] leading-tight"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
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

async function LokasjonerTab() {
  const data = await getLocationsConfigData();
  return (
    <LokasjonerClient
      locations={data.locations}
      services={data.services}
      instructors={data.instructors}
      initialConfig={data.config}
    />
  );
}

async function FasiliteterTab() {
  const [bookings, liveStatus] = await Promise.all([
    getWeekBookings(),
    getLiveStatus(),
  ]);
  return <FasiliteterClient bookings={bookings} initialLive={liveStatus} />;
}
