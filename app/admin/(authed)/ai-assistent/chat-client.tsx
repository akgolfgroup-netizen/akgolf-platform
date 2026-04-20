"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useRef, useEffect, useCallback } from "react";
import { Send, TrendingUp, Users, Calendar, BarChart3, Lightbulb, ThumbsUp, ThumbsDown, Clock } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";

const suggestedQuestions = [
  { icon: Users, text: "Hvem har ikke booket på 2 uker?", category: "elever" },
  {
    icon: Calendar,
    text: "Hva er kapasiteten neste uke?",
    category: "booking",
  },
  {
    icon: TrendingUp,
    text: "Hvordan går det med en spesifikk elev?",
    category: "analyse",
  },
  {
    icon: BarChart3,
    text: "Gi meg en oppsummering av denne måneden",
    category: "rapport",
  },
  {
    icon: Lightbulb,
    text: "Hvilke elever trenger oppfølging?",
    category: "anbefaling",
  },
  { icon: Clock, text: "Når er neste ledige time?", category: "booking" },
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hei! Jeg er din AI-assistent for AK Golf Academy. Jeg kan hjelpe deg med:\n\n- Spørsmål om elever, bookinger og kapasitet\n- Analyse av trender og statistikk\n- Forslag til oppfølging\n- Rapporter og oppsummeringer\n\nHva kan jeg hjelpe deg med i dag?",
  timestamp: new Date(),
};

export function ChatClient() {
  const { toggle } = useMCSidebar();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setInput("");
      setIsStreaming(true);

      const apiMessages = [...messages, userMessage]
        .filter((m) => m.id !== "welcome" && m.content.trim() !== "")
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        abortControllerRef.current = new AbortController();
        const response = await fetch("/api/portal/ai/admin-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(
            errorData?.error ?? `Serverfeil (${response.status})`,
          );
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("Ingen streaming-støtte");

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? { ...m, content: accumulated }
                : m,
            ),
          );
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Beklager, det oppstod en feil. Prøv igjen.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id ? { ...m, content: errorMsg } : m,
          ),
        );
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [isStreaming, messages],
  );

  const handleSend = useCallback(
    (text: string = input) => {
      sendMessage(text);
    },
    [input, sendMessage],
  );

  const handleCopy = useCallback((content: string) => {
    navigator.clipboard.writeText(content).catch(() => {
      /* ignore */
    });
  }, []);

  return (
    <>
      <MCTopbar
        title="AI-assistent"
        subtitle="Still spørsmål om data, elever og analytikk"
        onMenuClick={toggle}
      />

      <div className="p-6 flex flex-col" style={{ height: "calc(100vh - 56px)" }}>
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-surface-container-lowest border border-outline-variant/30 rounded-xl">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "flex-row-reverse" : "",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    msg.role === "assistant"
                      ? "bg-surface text-on-surface"
                      : "bg-surface text-on-surface",
                  )}
                >
                  {msg.role === "assistant" ? (
                    <Icon name="auto_awesome" className="w-4 h-4" />
                  ) : (
                    <Icon name="person" className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl p-4",
                    msg.role === "assistant"
                      ? "bg-surface text-on-surface rounded-tl-sm"
                      : "bg-on-surface text-surface rounded-tr-sm",
                  )}
                >
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </div>
                  {msg.role === "assistant" && msg.content && (
                    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-outline-variant/30">
                      <button
                        onClick={() => handleCopy(msg.content)}
                        className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant transition-colors"
                        title="Kopier"
                        aria-label="Kopier svar"
                      >
                        <Icon name="content_copy" className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant transition-colors"
                        aria-label="Nyttig svar"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant transition-colors"
                        aria-label="Ikke nyttig"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] text-on-surface-variant ml-auto">
                        {msg.timestamp.toLocaleTimeString("nb-NO", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isStreaming && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center shrink-0">
                  <Icon name="auto_awesome" className="w-4 h-4 text-on-surface" />
                </div>
                <div className="bg-surface rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                  <Icon name="progress_activity" className="w-4 h-4 text-on-surface animate-spin" />
                  <span className="text-sm text-on-surface-variant">Tenker...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length < 3 && (
            <div className="px-6 py-3 border-t border-outline-variant/30">
              <p className="text-xs text-on-surface-variant mb-2">Foreslåtte spørsmål:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, i) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSend(q.text)}
                      disabled={isStreaming}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-surface-container-lowest hover:bg-surface text-on-surface rounded-full transition-colors border border-outline-variant/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Icon className="w-3 h-3" />
                      {q.text}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-outline-variant/30 bg-surface">
            <div className="flex items-end gap-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-2 focus-within:border-outline-variant/50 focus-within:ring-2 focus-within:ring-black/10 transition-all">
              <div className="p-2 rounded-lg bg-surface">
                <Icon name="auto_awesome" className="w-4 h-4 text-on-surface" />
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Still et spørsmål om akademiet, elevene eller data..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant outline-none resize-none py-3"
                style={{ minHeight: "20px", maxHeight: "120px" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isStreaming}
                className="p-3 rounded-full bg-on-surface text-surface hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                aria-label="Send melding"
              >
                <Icon name="send" className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-2 text-center">
              AI-assistenten kan gjøre feil. Viktig informasjon bør
              dobbeltsjekkes.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
