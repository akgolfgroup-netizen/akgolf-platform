"use client";

import Link from "next/link";
import {
  MessageCircle,
  CalendarPlus,
  Target,
  FileDown,
  Share2,
  Printer,
} from "lucide-react";

interface CtaRailProps {
  onMessage?: () => void;
}

export function CtaRail({ onMessage }: CtaRailProps) {
  return (
    <div
      className="sticky top-3 hidden lg:flex flex-col gap-2 self-start py-6 pl-7 pr-4"
      style={{ paddingTop: 22 }}
    >
      <RailLabel>Handlinger</RailLabel>
      <RailButton
        primary
        icon={<MessageCircle className="h-3.5 w-3.5" />}
        onClick={onMessage}
      >
        Send melding
      </RailButton>
      <RailButton
        href="/portal/bookinger/ny"
        icon={<CalendarPlus className="h-3.5 w-3.5" />}
      >
        Bok økt
      </RailButton>
      <RailButton
        href="/portal/min-plan"
        icon={<Target className="h-3.5 w-3.5" />}
      >
        Sett mål
      </RailButton>
      <RailButton icon={<FileDown className="h-3.5 w-3.5" />}>
        Generer rapport
      </RailButton>

      <RailLabel className="mt-3.5">Snarveier</RailLabel>
      <RailButton icon={<Share2 className="h-3.5 w-3.5" />}>
        Del med coach
      </RailButton>
      <RailButton icon={<Printer className="h-3.5 w-3.5" />}>
        Skriv ut
      </RailButton>
    </div>
  );
}

function RailLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mb-1 font-mono text-[9px] uppercase ${className ?? ""}`}
      style={{ letterSpacing: "0.16em", color: "rgba(255,255,255,0.45)" }}
    >
      {children}
    </div>
  );
}

interface RailButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
  href?: string;
}

function RailButton({
  children,
  icon,
  primary,
  onClick,
  href,
}: RailButtonProps) {
  const className =
    "flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-left text-[13px] font-semibold transition";
  const style: React.CSSProperties = primary
    ? {
        background: "#D1F843",
        color: "#0A1F18",
        border: "1px solid #D1F843",
        fontWeight: 800,
      }
    : {
        background: "rgba(255,255,255,0.04)",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.10)",
      };

  if (href) {
    return (
      <Link href={href} className={className} style={style}>
        {icon}
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className} style={style}>
      {icon}
      {children}
    </button>
  );
}
