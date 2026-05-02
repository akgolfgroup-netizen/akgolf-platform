"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Sparkles } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { MessageBubble } from "./message-bubble";
import { QuickQuestions } from "./quick-questions";
import type { ChatContext } from "@/app/portal/(dashboard)/ai-coach/actions";
import type { AttributionSource } from "@/components/portal/patterns";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatInterfaceProps {
  context: ChatContext;
  quickInsight: string;
  onNewChat?: () => void;
}

export function ChatInterface({ context, quickInsight, onNewChat }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const aiSources = useMemo<AttributionSource[]>(() => {
    const sources: AttributionSource[] = [];
    const [round] = context.recentRounds;
    if (round) {
      sources.push({
        type: "runde",
        id: round.date,
        label: `${round.courseName ?? "Runde"} · ${format(new Date(round.date), "d. MMM", { locale: nb })}`,
      });
    }
    const [tm] = context.trackmanAverages;
    if (tm) {
      sources.push({
        type: "trackman",
        id: tm.club,
        label: tm.club,
      });
    }
    const [log] = context.recentTrainingLogs;
    if (log && log.focusArea) {
      sources.push({
        type: "treningslogg",
        id: log.date,
        label: `${log.focusArea} · ${format(new Date(log.date), "d. MMM", { locale: nb })}`,
      });
    }
    if (context.handicap !== null) {
      sources.push({
        type: "handicap",
        id: "hcp",
        label: context.handicap.toFixed(1),
      });
    }
    return sources;
  }, [context]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

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
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setInput("");
      setIsStreaming(true);

      // Build message history for API
      const history = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      try {
        abortControllerRef.current = new AbortController();

        const response = await fetch("/api/ai-coach/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, context }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.error ?? `Feil fra server (${response.status})`
          );
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("Ingen streaming-stotte");

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? { ...m, content: accumulated, isStreaming: true }
                : m
            )
          );
        }

        // Mark streaming as complete
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, isStreaming: false }
              : m
          )
        );
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? { ...m, content: m.content + "\n\n[Avbrutt]", isStreaming: false }
                : m
            )
          );
          return;
        }
        const errorText =
          error instanceof Error ? error.message : "Noe gikk galt";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? {
                  ...m,
                  content: `Beklager, det oppsto en feil: ${errorText}. Prov igjen.`,
                  isStreaming: false,
                }
              : m
          )
        );
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [isStreaming, messages, context]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4">
        <AnimatePresence mode="wait">
          {!hasMessages ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-full pb-8 pt-8"
            >
              {/* AI Avatar */}
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-primary, #005840) 0%, var(--color-primary-deep, #003B2A) 100%)",
                  boxShadow: "0 8px 24px rgba(0,88,64,0.18)",
                }}
              >
                <Sparkles
                  className="w-9 h-9"
                  style={{ color: "var(--color-accent, #D1F843)" }}
                  strokeWidth={1.8}
                />
              </div>

              <h2
                className="text-2xl font-bold mb-2 tracking-tight text-center"
                style={{
                  color: "var(--color-ink, #0A1F18)",
                  fontFamily: "var(--font-inter-tight), Inter, sans-serif",
                }}
              >
                Hei! Hva kan jeg hjelpe deg med?
              </h2>
              <p
                className="text-sm text-center mb-8 max-w-md leading-relaxed"
                style={{ color: "var(--color-ink-muted, #5C6B62)" }}
              >
                AI Coach kjenner dine runder, treningshistorikk og mål. Spør om
                hva som helst relatert til golfen din.
              </p>

              {/* Quick insight banner */}
              {quickInsight && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-lg mb-8"
                >
                  <div
                    className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
                    style={{
                      background: "var(--color-primary-soft, #E8F0EC)",
                      border: "1px solid rgba(0,88,64,0.16)",
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: "var(--color-primary, #005840)" }}
                    />
                    <p style={{ color: "var(--color-primary-deep, #003B2A)" }}>
                      {quickInsight}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Quick questions grid */}
              <QuickQuestions onSelect={sendMessage} disabled={isStreaming} />
            </motion.div>
          ) : (
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 pt-4"
            >
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isStreaming={message.isStreaming}
                  sources={message.role === "assistant" ? aiSources : undefined}
                />
              ))}
              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2">
        {/* Inline quick questions when has messages */}
        {hasMessages && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
            <QuickQuestions 
              onSelect={sendMessage} 
              disabled={isStreaming}
              variant="chips"
            />
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 rounded-2xl p-2 bg-surface border border-outline-variant/30 focus-within:border-outline-variant/50 focus-within:ring-2 focus-within:ring-ai/10 transition-all"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Skriv en melding til AI Coach..."
            disabled={isStreaming}
            rows={1}
            className="flex-1 resize-none bg-transparent px-2 py-2 text-sm focus:outline-none placeholder:text-on-surface-variant disabled:opacity-50 text-on-surface min-h-[40px]"
            style={{
              maxHeight: "120px",
            }}
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={handleStop}
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-error hover:opacity-90 text-surface transition-colors"
            >
              <Icon name="stop" className="w-4 h-4 fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-30 text-surface bg-ai hover:opacity-90 disabled:hover:bg-surface-variant"
            >
              <Icon name="send" className="w-4 h-4" />
            </button>
          )}
        </form>

        <p className="text-center text-xs mt-2 text-on-surface-variant">
          AI Coach bruker dine data for personlige rad. Svar er veiledende.
        </p>
      </div>
    </div>
  );
}
