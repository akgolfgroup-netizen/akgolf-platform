"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  User,
  Calendar,
  MessageCircle,
  CalendarPlus,
  Target,
  LayoutDashboard,
  Flag,
  Dumbbell,
  Activity,
  Bot,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/admin/coachhq-dark";
import type { getStudentProfile } from "./actions";
import { ProfilTab } from "./tabs/profil-tab";
import { TreningTab } from "./tabs/trening-tab";
import { BookingerTab } from "./tabs/bookinger-tab";
import { StatistikkTab } from "./tabs/statistikk-tab";
import { CoachingTab } from "./tabs/coaching-tab";

type Profile = NonNullable<Awaited<ReturnType<typeof getStudentProfile>>>;

interface Props {
  profile: Profile;
}

type TabId = "profil" | "trening" | "bookinger" | "statistikk" | "coaching";

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "profil", label: "Profil", icon: LayoutDashboard },
  { id: "trening", label: "Trening", icon: Dumbbell },
  { id: "bookinger", label: "Bookinger", icon: Calendar },
  { id: "statistikk", label: "Statistikk", icon: Activity },
  { id: "coaching", label: "Coaching", icon: Flag },
];

export function ElevDetaljClientV2({ profile }: Props) {
  const [active, setActive] = useState<TabId>("profil");
  const memberYear = profile.createdAt ? new Date(profile.createdAt).getFullYear() : "—";
  const hcp = profile.handicap;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0D2E23 0%, #143A2D 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="px-6 py-6 md:px-8 md:py-7 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="flex items-end gap-4">
            <div
              className="w-[72px] h-[72px] md:w-[88px] md:h-[88px] rounded-full grid place-items-center text-[24px] md:text-[30px] font-extrabold shrink-0 tracking-[-0.02em]"
              style={{ background: avatarColor(profile.name), color: "#0A1F18", border: "3px solid #102B1E" }}
            >
              {initials(profile.name)}
            </div>
            <div className="pb-0.5 min-w-0">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] inline-flex items-center gap-2 mb-1.5" style={{ color: "#D1F843" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#D1F843", boxShadow: "0 0 8px #D1F843" }} />
                {profile.subscriptionTier ?? "Spiller"} · {profile.isActive ? "Aktiv" : "Inaktiv"}
              </div>
              <h1 className="m-0 font-extrabold text-[28px] md:text-[36px] text-white tracking-[-0.025em] leading-none truncate">
                {profile.name ?? "Uten navn"}
              </h1>
              <div className="mt-2 flex gap-3.5 text-[13px] flex-wrap text-white/60">
                <span className="inline-flex items-center gap-1.5"><MapPin className="w-3 h-3" /> AK Golf Academy</span>
                <span className="inline-flex items-center gap-1.5"><User className="w-3 h-3" /> {profile.subscriptionTier ?? "—"}</span>
                <span className="inline-flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Medlem siden {memberYear}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-end">
            <div className="rounded-xl px-4 py-3 text-center mr-2" style={{ background: "rgba(209,248,67,0.12)", border: "1px solid rgba(209,248,67,0.25)" }}>
              <div className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: "#D1F843" }}>HCP</div>
              <div className="text-[22px] font-bold text-white mt-0.5 tabular-nums">{hcp !== null ? hcp.toFixed(1) : "—"}</div>
            </div>
            <Link href={`/admin/meldinger?to=${profile.id}`}>
              <Button icon={<MessageCircle className="w-3.5 h-3.5" />}>Melding</Button>
            </Link>
            <Link href={`/admin/bookinger/ny?student=${profile.id}`}>
              <Button icon={<CalendarPlus className="w-3.5 h-3.5" />}>Bok økt</Button>
            </Link>
            <Link href={`/admin/elever/${profile.id}/tester`}>
              <Button icon={<ClipboardCheck className="w-3.5 h-3.5" />}>Tester</Button>
            </Link>
            <Link href={`/admin/elever/${profile.id}/coach-agent`}>
              <Button icon={<Bot className="w-3.5 h-3.5" />}>Coach AI</Button>
            </Link>
            <Link href={`/admin/treningsplan?student=${profile.id}`}>
              <Button variant="accent" icon={<Target className="w-3.5 h-3.5" />}>Sett mål</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <nav className="sticky z-[5] -mx-7 px-7 flex gap-0" style={{ top: 58, background: "#102B1E", borderBottom: "1px solid rgba(255,255,255,0.08)", marginTop: -1 }}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className="px-4 md:px-[18px] py-3.5 text-[13px] font-medium cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap transition-colors"
              style={{
                color: isActive ? "#D1F843" : "rgba(255,255,255,0.55)",
                borderBottom: `2px solid ${isActive ? "#D1F843" : "transparent"}`,
                fontWeight: isActive ? 600 : 500,
                marginBottom: -1,
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </nav>

      {/* Tab content */}
      {active === "profil" && <ProfilTab profile={profile} />}
      {active === "trening" && <TreningTab profile={profile} />}
      {active === "bookinger" && <BookingerTab profile={profile} />}
      {active === "statistikk" && <StatistikkTab profile={profile} />}
      {active === "coaching" && <CoachingTab profile={profile} />}
    </div>
  );
}

/* ─── Helpers ─── */

function initials(name: string | null): string {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const PALETTE = ["#6FCBA1", "#6FB3FF", "#E8B967", "#C896E8", "#F49283", "#D1F843"];

function avatarColor(seed: string | null): string {
  if (!seed) return PALETTE[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}
