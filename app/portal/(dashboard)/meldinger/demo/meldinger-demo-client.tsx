"use client";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/portal/utils/cn";
import {
  MonoLabel,
  BentoGrid,
  BentoCard,
  NightSurface,
  GlassPanel,
} from "@/components/portal/patterns";

const DEMO_MESSAGES = [
  {
    id: "1",
    content: "Hei! Hvordan går det med svingen?",
    senderId: "thomas",
    senderName: "Coach Thomas",
    createdAt: new Date(Date.now() - 86400000 + 3600000 * 9).toISOString(),
  },
  {
    id: "2",
    content: "Bra, men sliter litt med driveren.",
    senderId: "me",
    senderName: "Deg",
    createdAt: new Date(Date.now() - 86400000 + 3600000 * 10).toISOString(),
  },
  {
    id: "3",
    content: "La oss fokusere på det i neste økt. Jeg sender noen øvelser.",
    senderId: "thomas",
    senderName: "Coach Thomas",
    createdAt: new Date(Date.now() + 3600000 * 8).toISOString(),
  },
  {
    id: "4",
    content: "Supert, takk!",
    senderId: "me",
    senderName: "Deg",
    createdAt: new Date(Date.now() + 3600000 * 9).toISOString(),
  },
];

export function MeldingerDemoClient() {
  return (
    <div className="space-y-8">
      <BentoGrid cols={1} gap="md">
        <BentoCard variant="light" padding="none" className="overflow-hidden">
          {/* Thread header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant/10">
            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center">
              <span className="text-xs font-semibold text-on-surface-variant">
                CT
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">
                Coach Thomas
              </p>
              <MonoLabel size="xs" className="text-on-surface-variant">
                Online
              </MonoLabel>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-container-lowest">
            {DEMO_MESSAGES.map((msg) => {
              const isMe = msg.senderId === "me";
              return (
                <div
                  key={msg.id}
                  className={cn("flex", isMe ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2.5",
                      isMe
                        ? "bg-on-surface text-surface"
                        : "bg-surface text-on-surface"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p
                      className={cn(
                        "text-[10px] mt-1",
                        isMe
                          ? "text-surface/60"
                          : "text-on-surface-variant"
                      )}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString("nb-NO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input placeholder */}
          <div className="p-3 border-t border-outline-variant/10 bg-surface">
            <div className="flex items-center gap-2 rounded-full border border-outline-variant/30 bg-surface px-4 py-2.5">
              <span className="text-sm text-on-surface-variant">
                Skriv en melding...
              </span>
              <Icon
                name="send"
                className="w-4 h-4 text-on-surface-variant ml-auto"
              />
            </div>
          </div>
        </BentoCard>
      </BentoGrid>

      <NightSurface variant="ambient" className="rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <MonoLabel size="xs" uppercase>Samtale-statistikk</MonoLabel>
          <Icon name="analytics" size={20} className="text-on-surface" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <MonoLabel size="lg" className="text-primary font-bold">
              {DEMO_MESSAGES.length}
            </MonoLabel>
            <p className="text-xs text-surface/60 mt-1">Meldinger</p>
          </div>
          <div className="text-center">
            <MonoLabel size="lg" className="text-primary font-bold">
              1
            </MonoLabel>
            <p className="text-xs text-surface/60 mt-1">Samtale</p>
          </div>
          <div className="text-center">
            <MonoLabel size="lg" className="text-primary font-bold">
              2
            </MonoLabel>
            <p className="text-xs text-surface/60 mt-1">Deltakere</p>
          </div>
        </div>
      </NightSurface>

      <GlassPanel variant="light" padding="md">
        <div className="flex items-center gap-4">
          <Icon name="chat" size={24} className="text-primary" />
          <div>
            <h3 className="font-semibold text-on-surface">Dine meldinger</h3>
            <p className="text-sm text-outline">
              Gå til innboksen for å se ekte samtaler
            </p>
          </div>
          <a
            href="/portal/meldinger"
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-surface transition-opacity hover:opacity-90"
          >
            Åpne
            <Icon name="arrow_forward" size={14} />
          </a>
        </div>
      </GlassPanel>
    </div>
  );
}
