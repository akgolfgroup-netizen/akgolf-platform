"use client";

import {
  Bell,
  CreditCard,
  Download,
  Flag,
  Link as LinkIcon,
  Lock,
  MapPin,
  Radar,
  Sliders,
  Trash2,
  User,
  Watch,
} from "lucide-react";
import { useState, useTransition } from "react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { updateProfile } from "@/app/portal/(dashboard)/profil/actions";
import { CalendarSyncSettings } from "@/components/portal/kalender/calendar-sync-settings";
import { SettingsShell } from "./settings-shell";
import {
  FieldInput,
  FieldSelect,
  GhostButton,
  PanelHeader,
  Pill,
  PrimaryButton,
  SettingsRow,
  Toggle,
} from "./settings-primitives";

interface SettingsPageClientV2Props {
  profile: {
    name: string;
    email: string;
    phone: string;
    image: string | null;
    clubName: string | null;
    subscriptionTier: string;
  };
}

const SIDE_LINKS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "personal", label: "Personlig", icon: User },
  { id: "connections", label: "Koblinger", icon: LinkIcon },
  { id: "notifications", label: "Varsler", icon: Bell },
  { id: "training", label: "Trenings-pref.", icon: Sliders },
  { id: "privacy", label: "Personvern", icon: Lock },
  { id: "subscription", label: "Abonnement", icon: CreditCard },
  { id: "account", label: "Konto", icon: Trash2 },
];

const TIER_LABELS: Record<string, string> = {
  VISITOR: "Gjest",
  ACADEMY: "Academy",
  STARTER: "Starter",
  PRO: "Performance",
  ELITE: "Elite",
  BUSINESS: "Business",
};

export function SettingsPageClientV2({ profile }: SettingsPageClientV2Props) {
  const [active, setActive] = useState<string>("personal");
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const tierLabel = TIER_LABELS[profile.subscriptionTier] ?? profile.subscriptionTier;
  const dirty = name !== profile.name || phone !== profile.phone;

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      try {
        await updateProfile({ name, phone });
        setMessage({ type: "success", text: "Profilen er oppdatert." });
        router.refresh();
      } catch (err) {
        const text = err instanceof Error ? err.message : "Noe gikk galt.";
        setMessage({ type: "error", text });
      }
    });
  }

  const side = (
    <>
      {SIDE_LINKS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setActive(id)}
            className={`flex items-center gap-2.5 whitespace-nowrap rounded-lg border px-3 py-2.5 text-[13px] transition ${
              isActive
                ? "border-[#D1F843]/20 bg-[#D1F843]/10 text-[#D1F843]"
                : "border-transparent text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        );
      })}
    </>
  );

  return (
    <SettingsShell
      side={side}
      lede="Personlig info, koblinger, varsler og personvern. Endringer i navn og telefon lagres når du klikker Lagre."
    >
      {/* PERSONLIG */}
      <PanelHeader title="Personlig info" sub="SYNKES MED GOLFBOX" />
      <SettingsRow
        label="Navn"
        sub="FORNAVN ETTERNAVN"
        trailing={<Pill>Fra GolfBox</Pill>}
      >
        <FieldInput value={name} onChange={setName} />
      </SettingsRow>
      <SettingsRow
        label="E-post"
        sub="PRIMÆR · INNLOGGING"
        trailing={<GhostButton>Verifisert</GhostButton>}
      >
        <FieldInput value={profile.email} readOnly />
      </SettingsRow>
      <SettingsRow
        label="Mobil"
        sub="SMS-VARSLER"
        trailing={
          phone ? <Pill variant="success">Verifisert</Pill> : <GhostButton>Legg til</GhostButton>
        }
      >
        <FieldInput value={phone} onChange={setPhone} placeholder="+47 ..." />
      </SettingsRow>
      <SettingsRow label="Klubb" sub="HJEMMEKLUBB">
        <FieldSelect
          defaultValue={profile.clubName ?? "Ukjent"}
          options={[{ value: profile.clubName ?? "Ukjent", label: profile.clubName ?? "Ukjent" }]}
        />
      </SettingsRow>
      <SettingsRow
        label="Spillertype"
        sub="PERFORMANCE / FRITID / NYBEGYNNER"
        trailing={<Pill variant="lime">{tierLabel}</Pill>}
      >
        <FieldSelect
          defaultValue={tierLabel}
          options={Object.values(TIER_LABELS).map((v) => ({ value: v, label: v }))}
        />
      </SettingsRow>

      {message ? (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-[#2A7D5A]/15 text-[#6FCBA1]"
              : "bg-[#B84233]/15 text-[#F49283]"
          }`}
        >
          {message.text}
        </div>
      ) : null}
      <div className="flex justify-end">
        <PrimaryButton onClick={handleSave} disabled={!dirty || isPending}>
          {isPending ? "Lagrer …" : "Lagre endringer"}
        </PrimaryButton>
      </div>

      {/* KOBLINGER */}
      <PanelHeader title="Koblinger" sub="DATA-KILDER" />
      <ConnectRow
        icon={Flag}
        iconBg="#23304D"
        iconColor="#7FA3FF"
        title="GolfBox"
        sub="RUNDER · HCP · BOOKING"
        meta="Ikke koblet ennå"
        action={<GhostButton>Koble til</GhostButton>}
      />
      <ConnectRow
        icon={Radar}
        iconBg="#3D2820"
        iconColor="#F49283"
        title="TrackMan"
        sub="SVING-DATA · BALL FLIGHT"
        meta="Tilgjengelig via coach"
        action={<GhostButton>Les mer</GhostButton>}
      />
      <ConnectRow
        icon={MapPin}
        iconBg="#1F3A2C"
        iconColor="#6FCBA1"
        title="Arccos"
        sub="ON-COURSE · STROKES GAINED"
        meta="Ikke koblet ennå"
        action={<GhostButton>Koble til</GhostButton>}
      />
      <ConnectRow
        icon={Watch}
        iconBg="rgba(255,255,255,0.06)"
        iconColor="rgba(255,255,255,0.5)"
        title="Garmin / Apple Watch"
        sub="PULS · ENERGI"
        meta="Ikke tilkoblet"
        action={<PrimaryButton>Koble til</PrimaryButton>}
      />

      <div className="mt-4">
        <CalendarSyncSettings />
      </div>

      {/* VARSLER */}
      <PanelHeader title="Varsler" sub="NÅR · HVOR · HVA" />
      <SettingsRow
        label="Tildelte øvelser"
        sub="NÅR COACH SENDER NY ØVELSE"
        trailing={<Toggle defaultOn ariaLabel="Tildelte øvelser" />}
      >
        Push, e-post, SMS
      </SettingsRow>
      <SettingsRow
        label="Booking-påminnelser"
        sub="24T OG 1T FØR ØKT"
        trailing={<Toggle defaultOn ariaLabel="Booking-påminnelser" />}
      >
        Push + SMS
      </SettingsRow>
      <SettingsRow
        label="Coach-tilbakemelding"
        sub="VIDEO ELLER TEKST FRA COACH"
        trailing={<Toggle defaultOn ariaLabel="Coach-tilbakemelding" />}
      >
        Push + e-post
      </SettingsRow>
      <SettingsRow
        label="Daglig fokus 07:00"
        sub="DAGENS 3 ØVELSER"
        trailing={<Toggle defaultOn ariaLabel="Daglig fokus" />}
      >
        Push
      </SettingsRow>
      <SettingsRow
        label="Ukentlig progress-rapport"
        sub="SØNDAG KVELD"
        trailing={<Toggle ariaLabel="Ukentlig rapport" />}
      >
        E-post
      </SettingsRow>

      {/* PERSONVERN */}
      <PanelHeader title="Personvern" sub="HVEM SER HVA" />
      <SettingsRow
        label="Coach kan se all data"
        sub="GOLFBOX · TRACKMAN · ARCCOS"
        trailing={<Toggle defaultOn ariaLabel="Coach-tilgang" />}
      >
        Aktiv for alle dine coacher
      </SettingsRow>
      <SettingsRow
        label="Del statistikk på leaderboard"
        sub="KLUBB-RANKING"
        trailing={<Toggle ariaLabel="Leaderboard" />}
      >
        Klubb-ranking
      </SettingsRow>
      <SettingsRow
        label="Anonymisert AI-trening"
        sub="HJELP OSS BLI BEDRE"
        trailing={<Toggle ariaLabel="AI-trening" />}
      >
        Frivillig · ingen personlig info
      </SettingsRow>

      {/* KONTO */}
      <PanelHeader title="Konto" sub="EKSPORT · SLETTING" />
      <SettingsRow
        label="Last ned mine data"
        sub="JSON · PDF · CSV"
        trailing={
          <GhostButton>
            <Download className="h-3.5 w-3.5" /> Last ned
          </GhostButton>
        }
      >
        Inkluderer runder, økter, video, analyser
      </SettingsRow>
      <SettingsRow
        label="Slett konto"
        sub="PERMANENT · 30 DAGERS ANGRE"
        danger
        trailing={<GhostButton>Slett konto</GhostButton>}
      >
        All data slettes etter 30 dager
      </SettingsRow>
    </SettingsShell>
  );
}

function ConnectRow({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  sub,
  meta,
  action,
}: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  sub: string;
  meta: string;
  action: React.ReactNode;
}) {
  return (
    <SettingsRow
      label={
        <span className="flex items-center gap-3">
          <span
            className="grid h-9 w-9 place-items-center rounded-[9px]"
            style={{ background: iconBg, color: iconColor }}
          >
            <Icon className="h-[18px] w-[18px]" />
          </span>
          <span>
            <span className="block">{title}</span>
            <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
              {sub}
            </span>
          </span>
        </span>
      }
      trailing={action}
    >
      {meta}
    </SettingsRow>
  );
}
