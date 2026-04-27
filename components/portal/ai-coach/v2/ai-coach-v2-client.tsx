"use client";

import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import type { ChatContext } from "@/app/portal/(dashboard)/ai-coach/actions";
import { ContextRail, type ContextItem, type QuickQuestion } from "./context-rail";
import { ChatMessage, type ChatMessageData } from "./chat-message";
import { ChatComposer } from "./chat-composer";

interface AiCoachV2ClientProps {
  context: ChatContext;
  quickInsight: string;
}

const DEFAULT_QUICK_QUESTIONS: QuickQuestion[] = [
  { text: "Hvor er min storste svakhet na?" },
  { text: "Lag ukesplan for neste uke" },
  { text: "Beste drill for impact?" },
  { text: "Sammenlign med min HCP-peer" },
  { text: "Er jeg klar for neste turnering?" },
];

const COMPOSER_SUGGESTIONS = [
  "Vis meg 50-100-150-testen",
  "Sammenlign min Approach vs peer",
  "Hvilke ovelser gir mest SG?",
  "Lag mental-strategi for lordag",
];

export function AiCoachV2Client({ context, quickInsight }: AiCoachV2ClientProps) {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [busy, setBusy] = useState(false);

  const userInitials = useMemo(() => {
    const name = context.userName || "Spiller";
    return name
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [context.userName]);

  const contextItems: ContextItem[] = useMemo(() => {
    const items: ContextItem[] = [];

    if (context.recentRounds.length > 0) {
      const last = context.recentRounds[0];
      items.push({
        title: `Runder · siste ${context.recentRounds.length}`,
        meta: [
          last.courseName ?? "Bane",
          last.totalScore !== null ? `score ${last.totalScore}` : null,
          "Lest",
        ]
          .filter(Boolean)
          .join(" · "),
        active: true,
      });
    }

    if (context.trackmanAverages.length > 0) {
      items.push({
        title: "TrackMan",
        meta: `${context.trackmanAverages.length} okter · siste klubb ${context.trackmanAverages[0].club}`,
        active: true,
      });
    }

    if (context.recentTrainingLogs.length > 0) {
      const last = context.recentTrainingLogs[0];
      items.push({
        title: `Trening · siste ${context.recentTrainingLogs.length}`,
        meta: [
          format(new Date(last.date), "d. MMM", { locale: nb }),
          last.focusArea ?? "okt",
        ].join(" · "),
        active: true,
      });
    }

    if (context.activePlan) {
      items.push({
        title: `Treningsplan · ${context.activePlan.title}`,
        meta: `${context.activePlan.periodType}`,
      });
    }

    if (context.upcomingTournaments.length > 0) {
      const t = context.upcomingTournaments[0];
      items.push({
        title: `Turnering · ${t.name}`,
        meta: format(new Date(t.startDate), "d. MMM", { locale: nb }),
      });
    }

    return items;
  }, [context]);

  const handleSend = useCallback(
    async (text: string) => {
      const userMsg: ChatMessageData = {
        role: "user",
        initials: userInitials,
        text,
      };
      const newHistory: ChatMessageData[] = [...messages, userMsg];
      setMessages(newHistory);
      setBusy(true);

      try {
        const res = await fetch("/api/portal/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newHistory.map((m) => ({
              role: m.role,
              content: typeof m.text === "string" ? m.text : "",
            })),
            context,
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error("AI-tjenesten er ikke tilgjengelig.");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", initials: "AI", text: "" },
        ]);

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last && last.role === "assistant") {
              next[next.length - 1] = { ...last, text: buffer };
            }
            return next;
          });
        }
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            initials: "AI",
            text:
              err instanceof Error
                ? err.message
                : "Noe gikk galt. Prov igjen om litt.",
          },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [messages, userInitials, context]
  );

  return (
    <div className="-mx-6 lg:-mx-8 -mt-8 lg:-mt-10 grid grid-cols-[260px_1fr] h-[calc(100vh-4rem)] bg-[#FAFAF7]">
      <ContextRail
        contextItems={contextItems}
        quickQuestions={DEFAULT_QUICK_QUESTIONS}
        onPickQuestion={handleSend}
      />

      <div className="flex flex-col h-full min-w-0">
        <header className="px-6 py-3.5 border-b border-[color:var(--color-line)] bg-card flex justify-between items-center">
          <div>
            <h1 className="m-0 text-lg font-bold tracking-tight flex items-center gap-2.5">
              <span
                className="w-2.5 h-2.5 rounded-full bg-[#AF52DE]"
                style={{ boxShadow: "0 0 12px #AF52DE" }}
              />
              AI Coach
            </h1>
            <div className="font-mono text-[10px] text-[#5A6E66] tracking-wider mt-0.5 uppercase">
              Grounded · {contextItems.length} kilder
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMessages([])}
              className="text-xs px-3 py-1.5 rounded-lg border border-[color:var(--color-line)] bg-card text-ink-muted hover:border-[#AF52DE] hover:text-[#AF52DE] transition-colors"
            >
              Ny samtale
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-5">
          {messages.length === 0 ? (
            <div className="m-auto max-w-md text-center">
              <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#AF52DE] mb-3">
                Klar nar du er
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-ink mb-2">
                Hva vil du forbedre i dag?
              </h2>
              <p className="text-sm text-ink-muted leading-relaxed">
                {quickInsight ||
                  "Spor om data, drills, plan eller taktikk. Jeg er grunnet i din egne data."}
              </p>
            </div>
          ) : (
            messages.map((m, i) => <ChatMessage key={i} message={m} />)
          )}
        </div>

        <ChatComposer
          suggestions={COMPOSER_SUGGESTIONS}
          onSend={handleSend}
          onPickSuggestion={handleSend}
          busy={busy}
        />
      </div>
    </div>
  );
}
