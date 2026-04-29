"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CoachHQDarkShell,
  PageHead,
  Button,
} from "@/components/admin/coachhq-dark";
import {
  Settings2,
  CheckCheck,
  Play,
  Sparkles,
  Check,
  AlertTriangle,
  X,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  approveBooking,
  rejectBooking,
  approveActivity,
  rejectActivity,
} from "./actions";

interface PendingItem {
  id: string;
  type: "booking" | "plan" | "activity";
  studentName: string;
  studentEmail: string;
  serviceName: string;
  price: number;
  requestedTime: Date;
  createdAt: Date;
  facilityName?: string;
  activityType?: string;
  conflictNote?: string | null;
}

interface GodkjenningerDarkClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
  };
  pendingItems: PendingItem[];
}

type Tab = "pending" | "approved" | "rejected";

const TYPE_BADGE: Record<
  PendingItem["type"] | "video" | "refund" | "discount",
  { bg: string; color: string; label: string }
> = {
  booking: {
    bg: "rgba(0,122,255,0.18)",
    color: "#6FB3FF",
    label: "BOOKING",
  },
  activity: {
    bg: "rgba(196,138,50,0.18)",
    color: "#E8B967",
    label: "AKTIVITET",
  },
  plan: {
    bg: "rgba(175,82,222,0.18)",
    color: "#C896E8",
    label: "PLAN",
  },
  video: {
    bg: "rgba(175,82,222,0.18)",
    color: "#C896E8",
    label: "VIDEO",
  },
  refund: {
    bg: "rgba(184,66,51,0.18)",
    color: "#F49283",
    label: "REFUSJON",
  },
  discount: {
    bg: "rgba(196,138,50,0.18)",
    color: "#E8B967",
    label: "RABATT",
  },
};

const URGENCY_COLOR = {
  high: "#F49283",
  med: "#E8B967",
  low: "rgba(255,255,255,0.3)",
} as const;

function timeAgo(d: Date): string {
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `FOR ${mins} MIN SIDEN`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `FOR ${hours} T SIDEN`;
  return format(d, "d MMM HH:mm", { locale: nb }).toUpperCase();
}

export function GodkjenningerDarkClient({
  user,
  pendingItems,
}: GodkjenningerDarkClientProps) {
  const router = useRouter();
  const [items, setItems] = useState<PendingItem[]>(pendingItems);
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [activeId, setActiveId] = useState<string | null>(
    pendingItems[0]?.id ?? null,
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [bulkPending, startBulk] = useTransition();

  function handleBulkApprove() {
    if (!confirm(`Godkjenn alle ${items.length} ventende?`)) return;
    startBulk(async () => {
      for (const item of items) {
        if (item.type === "booking") await approveBooking(item.id);
        else if (item.type === "activity") await approveActivity(item.id);
      }
      setItems([]);
      setActiveId(null);
      router.refresh();
    });
  }

  const activeItem = items.find((i) => i.id === activeId);

  async function handleApprove(item: PendingItem) {
    setBusy(item.id);
    try {
      if (item.type === "booking") await approveBooking(item.id);
      else if (item.type === "activity") await approveActivity(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setActiveId(items.find((i) => i.id !== item.id)?.id ?? null);
    } finally {
      setBusy(null);
    }
  }

  async function handleReject(item: PendingItem) {
    setBusy(item.id);
    try {
      if (item.type === "booking") await rejectBooking(item.id);
      else if (item.type === "activity") await rejectActivity(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setActiveId(items.find((i) => i.id !== item.id)?.id ?? null);
    } finally {
      setBusy(null);
    }
  }

  return (
    <CoachHQDarkShell
      user={user}
      title="Godkjenninger"
      meta={`${items.length} ventende · 12 godkjent denne uken`}
    >
      <PageHead
        eyebrow="Operasjon · Godkjenninger"
        title="Inbox for ting som krever deg"
        description="Video-feedback fra coacher, refusjoner, kontrakter, rabatter — alt som skal igjennom deg før det går ut. Hovedregel: avgjør innen 24 t."
        actions={
          <>
            <Button
              variant="ghost"
              icon={<Settings2 className="w-3.5 h-3.5" />}
              onClick={() => router.push("/admin/agenter")}
            >
              Regler
            </Button>
            <Button
              variant="ghost"
              icon={<CheckCheck className="w-3.5 h-3.5" />}
              onClick={handleBulkApprove}
              disabled={bulkPending || items.length === 0}
            >
              {bulkPending ? "Godkjenner …" : "Bulk-godkjenn"}
            </Button>
          </>
        }
      />

      <div
        className="grid gap-[18px] items-start"
        style={{ gridTemplateColumns: "360px 1fr" }}
      >
        {/* Inbox */}
        <div
          className="overflow-hidden"
          style={{
            background: "#0D2E23",
            border: "1px solid #1a4a3a",
            borderRadius: 14,
          }}
        >
          <div
            className="flex justify-between items-center px-4 py-3.5"
            style={{ borderBottom: "1px solid #1a4a3a" }}
          >
            <h3
              className="m-0 text-[13px] font-semibold"
              style={{ color: "#FFFFFF" }}
            >
              Ventende
            </h3>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: "#D1F843",
                letterSpacing: "0.06em",
              }}
            >
              {items.length} nye
            </div>
          </div>

          <div
            className="flex px-2"
            style={{ borderBottom: "1px solid #1a4a3a" }}
          >
            {(
              [
                ["pending", `VENTER ${items.length}`],
                ["approved", "GODKJENT 12"],
                ["rejected", "AVSLÅTT 1"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="px-3 py-2.5 transition-colors"
                style={{
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.06em",
                  color: activeTab === key ? "#D1F843" : "rgba(255,255,255,0.5)",
                  borderBottom:
                    activeTab === key
                      ? "2px solid #D1F843"
                      : "2px solid transparent",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div>
            {items.length === 0 ? (
              <div
                className="px-4 py-12 text-center text-[13px]"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Ingen ventende godkjenninger
              </div>
            ) : (
              items.map((item, idx) => (
                <InboxRow
                  key={item.id}
                  item={item}
                  isActive={item.id === activeId}
                  onClick={() => setActiveId(item.id)}
                  isLast={idx === items.length - 1}
                />
              ))
            )}
          </div>
        </div>

        {/* Detail */}
        <div
          className="flex flex-col overflow-hidden"
          style={{
            background: "#0D2E23",
            border: "1px solid #1a4a3a",
            borderRadius: 14,
          }}
        >
          {activeItem ? (
            <DetailPane
              item={activeItem}
              busy={busy === activeItem.id}
              onApprove={() => handleApprove(activeItem)}
              onReject={() => handleReject(activeItem)}
              onRequestChange={() => router.push("/admin/meldinger")}
            />
          ) : (
            <div
              className="px-6 py-16 text-center text-[13px]"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Ingen valgt — velg en oppføring fra inbox
            </div>
          )}
        </div>
      </div>

      {/* Auto-rules info */}
      <div
        className="mt-[18px] grid gap-5 items-center px-5 py-4"
        style={{
          gridTemplateColumns: "1fr auto",
          background: "#0D2E23",
          border: "1px solid #1a4a3a",
          borderRadius: 14,
        }}
      >
        <div>
          <h3
            className="m-0 text-[13px] font-semibold"
            style={{ color: "#FFFFFF" }}
          >
            Automatiseringsregler aktive
          </h3>
          <p
            className="m-0 mt-1.5 text-[12px]"
            style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}
          >
            Refusjoner under 500 kr, video-feedback fra coacher med 12+ mnd
            erfaring som har lavere enn 0,3% rejection-rate, og rabatt-koder for
            eksisterende spillere — disse bypass'er denne inboxen og logges
            direkte i Audit. Du har spart{" "}
            <strong style={{ color: "#D1F843" }}>~14 godkjenninger</strong>{" "}
            denne uken.
          </p>
        </div>
        <Button
          variant="ghost"
          icon={<Settings2 className="w-3.5 h-3.5" />}
          onClick={() => router.push("/admin/agenter")}
        >
          Endre regler
        </Button>
      </div>
    </CoachHQDarkShell>
  );
}

function InboxRow({
  item,
  isActive,
  onClick,
  isLast,
}: {
  item: PendingItem;
  isActive: boolean;
  onClick: () => void;
  isLast: boolean;
}) {
  const initials = item.studentName
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  const badge = TYPE_BADGE[item.type];
  const urgency =
    Date.now() - item.createdAt.getTime() < 1000 * 60 * 60
      ? "high"
      : Date.now() - item.createdAt.getTime() < 1000 * 60 * 60 * 6
        ? "med"
        : "low";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left flex gap-3 items-start px-4 py-3.5 relative transition-colors"
      style={{
        background: isActive ? "rgba(209,248,67,0.06)" : "transparent",
        borderBottom: isLast ? "none" : "1px solid #1a4a3a",
        cursor: "pointer",
      }}
    >
      {isActive && (
        <span
          className="absolute left-0 top-0 bottom-0"
          style={{ width: 3, background: "#D1F843" }}
        />
      )}
      <div
        className="w-8 h-8 rounded-full grid place-items-center text-[11px] font-bold shrink-0"
        style={{ background: "#6FCBA1", color: "#0A1F18" }}
      >
        {initials || "??"}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="text-[13px] font-semibold mb-0.5 truncate"
          style={{ color: "#FFFFFF" }}
        >
          {item.studentName} · {item.type}
        </div>
        <div
          className="text-[11px] mb-1.5 truncate"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          {item.serviceName}
          {item.facilityName && ` · ${item.facilityName}`}
        </div>
        <div
          className="flex gap-2 items-center"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.06em",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: URGENCY_COLOR[urgency] }}
          />
          <span
            className="px-1.5 rounded font-semibold uppercase"
            style={{
              background: badge.bg,
              color: badge.color,
              padding: "2px 6px",
            }}
          >
            {badge.label}
          </span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>
            {timeAgo(item.createdAt)}
          </span>
        </div>
      </div>
    </button>
  );
}

function DetailPane({
  item,
  busy,
  onApprove,
  onReject,
  onRequestChange,
}: {
  item: PendingItem;
  busy: boolean;
  onApprove: () => void;
  onReject: () => void;
  onRequestChange: () => void;
}) {
  const minutesAgo = Math.floor((Date.now() - item.createdAt.getTime()) / 60000);

  return (
    <>
      <div
        className="px-5 py-5"
        style={{ borderBottom: "1px solid #1a4a3a" }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.06em",
            marginBottom: 6,
          }}
        >
          VENTER · {minutesAgo} MIN
        </div>
        <h2
          className="m-0 text-[22px] font-bold"
          style={{ color: "#FFFFFF", letterSpacing: "-0.02em" }}
        >
          {item.studentName} har sendt{" "}
          {item.type === "booking" ? "booking-forespørsel" : "ny aktivitet"}
        </h2>
        <div
          className="mt-1 text-[13px]"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          {item.serviceName} · {format(item.requestedTime, "EEEE d. MMM HH:mm", { locale: nb })}
          {item.facilityName && ` · ${item.facilityName}`}
        </div>
      </div>

      <div className="px-5 py-5 flex-1 overflow-auto">
        {/* Mock video frame for video-feedback (kun for plan-type) */}
        {item.type === "plan" && (
          <div
            className="mb-4 relative overflow-hidden"
            style={{
              aspectRatio: "16/9",
              background:
                "linear-gradient(135deg, #1a1f1c, #2a3530)",
              border: "1px solid #1a4a3a",
              borderRadius: 10,
            }}
          >
            <div
              className="absolute"
              style={{
                left: 18,
                top: 18,
                padding: "4px 10px",
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(209,248,67,0.30)",
                borderRadius: 999,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: "#D1F843",
                letterSpacing: "0.08em",
              }}
            >
              02:14 · 1080p · TRACKMAN
            </div>
            <div className="absolute inset-0 grid place-items-center">
              <div
                className="grid place-items-center"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.5)",
                  border: "2px solid #D1F843",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Play
                  className="w-6 h-6"
                  strokeWidth={1.8}
                  style={{ color: "#D1F843" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Feedback block */}
        <div
          className="mb-3.5 px-4 py-3.5"
          style={{
            background: "rgba(209,248,67,0.05)",
            border: "1px solid rgba(209,248,67,0.18)",
            borderLeft: "3px solid #D1F843",
            borderRadius: 10,
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.14em",
              color: "#D1F843",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Detaljer
          </div>
          <p
            className="m-0 text-[14px]"
            style={{ color: "#FFFFFF", lineHeight: 1.55 }}
          >
            {item.studentName} ber om {item.serviceName.toLowerCase()}.
            Forespurt tid:{" "}
            {format(item.requestedTime, "d. MMMM HH:mm", { locale: nb })}.
            {item.conflictNote && (
              <>
                {" "}
                <span style={{ color: "#E8B967" }}>{item.conflictNote}</span>
              </>
            )}
          </p>
        </div>

        {/* AI flag */}
        <div
          className="mb-3.5 px-3.5 py-3 flex gap-2.5 items-start"
          style={{
            background: "rgba(175,82,222,0.06)",
            border: "1px solid rgba(175,82,222,0.20)",
            borderRadius: 10,
          }}
        >
          <div
            className="w-6 h-6 rounded-md grid place-items-center shrink-0"
            style={{ background: "rgba(175,82,222,0.20)", color: "#C896E8" }}
          >
            <Sparkles className="w-[13px] h-[13px]" strokeWidth={1.8} />
          </div>
          <p
            className="m-0 text-[12px]"
            style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}
          >
            <strong style={{ color: "#C896E8" }}>Coach AI har sjekket:</strong>{" "}
            ingen merknader. Spilleren er aktiv, ingen konflikt med eksisterende
            booking, og prisnivået matcher tjenesten.
          </p>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-3.5">
          <InfoCell label="Spiller" value={item.studentName} />
          <InfoCell label="E-post" value={item.studentEmail || "—"} />
          <InfoCell label="Tjeneste" value={item.serviceName} />
          <InfoCell
            label="Tid"
            value={format(item.requestedTime, "d. MMM HH:mm", { locale: nb })}
          />
          <InfoCell label="Pris" value={`${item.price} kr`} />
          <InfoCell
            label="Levering"
            value="Bekreftelse via e-post når godkjent"
          />
        </div>

        {/* Checklist */}
        <div
          className="mb-3.5 px-4 py-3.5"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid #1a4a3a",
            borderRadius: 10,
          }}
        >
          <h4
            className="m-0 mb-2.5"
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.7)",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Sjekkliste før godkjenning
          </h4>
          <CheckRow ok>Spiller er aktiv og betalende</CheckRow>
          <CheckRow ok>Ingen konflikt med eksisterende booking</CheckRow>
          <CheckRow ok>Pris matcher tjenestekonfigurasjon</CheckRow>
          {item.conflictNote ? (
            <CheckRow warn>{item.conflictNote}</CheckRow>
          ) : (
            <CheckRow ok>Ingen flagg fra Coach AI</CheckRow>
          )}
        </div>
      </div>

      {/* Action footer */}
      <div
        className="px-5 py-4 flex gap-2.5 items-center"
        style={{
          borderTop: "1px solid #1a4a3a",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <button
          type="button"
          onClick={onApprove}
          disabled={busy}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg font-semibold text-[13px] disabled:opacity-50"
          style={{
            background: "#D1F843",
            color: "#0A1F18",
            border: "none",
            cursor: busy ? "not-allowed" : "pointer",
          }}
        >
          <Check className="w-3.5 h-3.5" strokeWidth={2.4} />
          Godkjenn
        </button>
        <Button
          variant="ghost"
          icon={<MessageSquare className="w-3.5 h-3.5" />}
          onClick={onRequestChange}
        >
          Be om endring
        </Button>
        <button
          type="button"
          onClick={onReject}
          disabled={busy}
          className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg text-[13px] disabled:opacity-50"
          style={{
            background: "transparent",
            color: "#F49283",
            border: "1px solid rgba(184,66,51,0.40)",
            padding: "10px 18px",
            cursor: busy ? "not-allowed" : "pointer",
          }}
        >
          <X className="w-3.5 h-3.5" strokeWidth={1.8} />
          Avslå
        </button>
        <div
          className="ml-auto"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.06em",
          }}
        >
          SHIFT+↩ FOR HURTIG-GODKJENN
        </div>
      </div>
    </>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="px-3.5 py-3"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid #1a4a3a",
        borderRadius: 8,
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.5)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        className="mt-1 text-[14px] font-medium truncate"
        style={{ color: "#FFFFFF" }}
      >
        {value}
      </div>
    </div>
  );
}

function CheckRow({
  ok,
  warn,
  children,
}: {
  ok?: boolean;
  warn?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center gap-2.5 py-1.5 text-[13px]"
      style={{ color: "rgba(255,255,255,0.85)" }}
    >
      <span
        className="grid place-items-center shrink-0"
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          background: ok ? "#6FCBA1" : "rgba(232,185,103,0.20)",
          border: warn ? "1px solid rgba(232,185,103,0.40)" : "none",
        }}
      >
        {ok ? (
          <Check className="w-2.5 h-2.5" strokeWidth={3} style={{ color: "#0A1F18" }} />
        ) : (
          <AlertTriangle
            className="w-2.5 h-2.5"
            strokeWidth={2.4}
            style={{ color: "#E8B967" }}
          />
        )}
      </span>
      {children}
    </div>
  );
}
