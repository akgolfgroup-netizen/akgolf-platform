"use client";

import { FullDetailLink } from "../accordion-section";

interface IdentitySectionProps {
  birth?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  nextOfKin?: string | null;
  goal?: string | null;
}

export function IdentitySection({
  birth,
  phone,
  email,
  address,
  nextOfKin,
  goal,
}: IdentitySectionProps) {
  return (
    <>
      <MiniGrid>
        <MiniCell label="Født" value={birth ?? "Ikke registrert"} />
        <MiniCell label="Telefon" value={phone ?? "—"} />
        <MiniCell label="E-post" value={email ?? "—"} small />
        <MiniCell label="Adresse" value={address ?? "Ikke registrert"} small />
        <MiniCell label="Pårørende" value={nextOfKin ?? "Ikke registrert"} small />
        <MiniCell
          label="Allergier"
          value="Ingen registrert"
          mutedValue
          small
        />
      </MiniGrid>

      <div
        className="mt-5 rounded-xl px-5 py-4"
        style={{
          background: "rgba(209,248,67,0.06)",
          border: "1px solid rgba(209,248,67,0.20)",
        }}
      >
        <div
          className="mb-1.5 font-mono text-[9px] uppercase"
          style={{ letterSpacing: "0.14em", color: "#D1F843" }}
        >
          Mitt mål · 12 mnd
        </div>
        <div className="text-[16px] font-semibold leading-snug text-white">
          {goal ?? "Sett et mål sammen med coachen din."}
        </div>
      </div>

      <FullDetailLink
        meta="SAMTYKKER · BANKKONTO · FAMILIEKONTI"
        href="/portal/profil/innstillinger"
      />
    </>
  );
}

function MiniGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mt-3 grid gap-3"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      }}
    >
      {children}
    </div>
  );
}

interface MiniCellProps {
  label: string;
  value: string;
  small?: boolean;
  mutedValue?: boolean;
}

function MiniCell({ label, value, small, mutedValue }: MiniCellProps) {
  return (
    <div
      className="rounded-xl p-3.5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="mb-1.5 font-mono text-[9px] uppercase"
        style={{
          letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {label}
      </div>
      <div
        className="font-extrabold tracking-[-0.025em] text-white"
        style={{
          fontFamily: "var(--font-inter-tight, Inter)",
          fontSize: small ? 14 : 22,
          lineHeight: 1.2,
          color: mutedValue ? "rgba(255,255,255,0.6)" : "#fff",
        }}
      >
        {value}
      </div>
    </div>
  );
}
