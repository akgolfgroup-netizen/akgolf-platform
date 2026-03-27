import { Suspense } from "react";
import { InboxClient } from "./inbox-client";
// TODO: Aktiver når Prisma-modellene er lagt til
// import { prisma } from "@/lib/portal/prisma";
// import { requirePortalUser } from "@/lib/portal/auth";

// Mock data for utvikling - byttes ut med ekte data når Prisma er klar
const mockMessages = [
  {
    id: "msg-1",
    channel: "EMAIL" as const,
    senderName: "Ola Nordmann",
    senderHandle: "ola.nordmann@gmail.com",
    subject: "Sporsmal om trening",
    content:
      "Hei! Jeg lurer pa om det er mulig a fa en ekstra treningstime denne uken? Jeg har en turnering kommende helg og vil gjerne ove litt ekstra pa putting.",
    receivedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min siden
    status: "AI_READY" as const,
    aiResponse: {
      draftContent:
        "Hei Ola!\n\nSelfolgelge, det horer bra ut! Jeg har ledig tid pa torsdag kl. 16:00 eller fredag kl. 10:00. Hvilken tid passer best for deg?\n\nLykke til med turneringen!\n\nMvh,\nAnders",
      confidence: 0.92,
      category: "booking",
      modelUsed: "claude-haiku",
    },
  },
  {
    id: "msg-2",
    channel: "INSTAGRAM" as const,
    senderName: "Kari Hansen",
    senderHandle: "@kari_golf_no",
    subject: null,
    content:
      "Hei! Elsker innholdet ditt pa Instagram. Holder dere kurs for nybegynnere?",
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 timer siden
    status: "AI_READY" as const,
    aiResponse: {
      draftContent:
        "Hei Kari!\n\nTusen takk for de hyggelige ordene! Ja, vi har kurs for nybegynnere. Sjekk ut akgolfacademy.no/academy for mer info om vare pakker.\n\nVelkommen til a ta kontakt om du har sporsmal!\n\nMvh,\nAnders",
      confidence: 0.88,
      category: "info",
      modelUsed: "claude-haiku",
    },
  },
  {
    id: "msg-3",
    channel: "WHATSAPP" as const,
    senderName: "Per Johansen",
    senderHandle: "+47 912 34 567",
    subject: null,
    content: "Hei, ma dessverre avbestille timen i morgen. Er syk.",
    receivedAt: new Date(Date.now() - 1000 * 60 * 45), // 45 min siden
    status: "PENDING" as const,
    aiResponse: null,
  },
  {
    id: "msg-4",
    channel: "IMESSAGE" as const,
    senderName: "Live Eriksen",
    senderHandle: "+47 987 65 432",
    subject: null,
    content:
      "Hei Anders! Jeg har fatt mye bedre kontroll pa driven etter forrige time. Takk for tipset om greppet!",
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 timer siden
    status: "AI_READY" as const,
    aiResponse: {
      draftContent:
        "Hei Live!\n\nSa bra a hore! Greppet er jo fundamentet for alt annet, sa det er ikke rart du merker forskjell. Fortsett a ove pa det, sa tar vi det videre neste time!\n\nMvh,\nAnders",
      confidence: 0.95,
      category: "feedback",
      modelUsed: "ollama",
    },
  },
  {
    id: "msg-5",
    channel: "MESSENGER" as const,
    senderName: "Trond Berg",
    senderHandle: "Trond Berg",
    subject: null,
    content:
      "Hei! Jeg har slitt med hook pa de siste rundene. Har du tips til hva jeg kan gjore?",
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 timer siden
    status: "AI_PROCESSING" as const,
    aiResponse: null,
  },
  {
    id: "msg-6",
    channel: "EMAIL" as const,
    senderName: "Anna Svendsen",
    senderHandle: "anna.svendsen@outlook.com",
    subject: "Takk for flott time!",
    content:
      "Hei Anders!\n\nVille bare si tusen takk for den fantastiske treningsoekten i gar. Jeg folte virkelig at jeg tok et stort steg fremover med jernspillet mitt.\n\nGleder meg til neste gang!\n\nMvh Anna",
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dag siden
    status: "SENT" as const,
    aiResponse: {
      draftContent:
        "Hei Anna!\n\nDet var kos a hore! Du gjorde virkelig store fremskritt, spesielt med kontakten. Fortsett a ove pa de ovelsene vi gikk gjennom, sa tar vi neste steg snart!\n\nSes!\n\nMvh,\nAnders",
      confidence: 0.91,
      category: "feedback",
      modelUsed: "claude-haiku",
    },
  },
];

const mockChannelCounts = {
  ALL: 4,
  EMAIL: 1,
  INSTAGRAM: 1,
  MESSENGER: 1,
  WHATSAPP: 1,
  IMESSAGE: 0,
};

// TODO: Aktiver database-queries nar Prisma er klar
// async function getMessages(userId: string) {
//   return prisma.unifiedMessage.findMany({
//     where: {
//       OR: [{ assignedToId: userId }, { assignedToId: null }],
//     },
//     orderBy: { receivedAt: "desc" },
//     take: 50,
//     include: {
//       aiResponse: true,
//     },
//   });
// }

// async function getChannelCounts() {
//   const counts = await prisma.unifiedMessage.groupBy({
//     by: ["channel"],
//     where: { status: "PENDING" },
//     _count: true,
//   });
//
//   const result: Record<string, number> = { ALL: 0 };
//   counts.forEach((c) => {
//     result[c.channel] = c._count;
//     result.ALL += c._count;
//   });
//
//   return result;
// }

export default async function InboxPage() {
  // TODO: Aktiver auth og database nar klar
  // const user = await requirePortalUser();
  // const [messages, counts] = await Promise.all([
  //   getMessages(user.id),
  //   getChannelCounts(),
  // ]);

  return (
    <div className="h-[calc(100vh-8rem)]">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full text-[var(--color-ink-50)]">
            Laster meldinger...
          </div>
        }
      >
        <InboxClient
          initialMessages={mockMessages}
          channelCounts={mockChannelCounts}
        />
      </Suspense>
    </div>
  );
}
