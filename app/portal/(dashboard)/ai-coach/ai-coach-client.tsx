"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useRef, useEffect, useCallback } from "react";

import type { ChatContext } from "./actions";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  {
    label: "Hva bor jeg trene denne uken?",
    message: "Hva bor jeg trene denne uken?",
  },
  {
    label: "Analyser mine siste 5 runder",
    message: "Analyser mine siste 5 runder",
  },
  {
    label: "Hvordan forbedrer jeg approach?",
    message: "Hvordan forbedrer jeg approach?",
  },
  {
    label: "Lag en treningsplan for neste turnering",
    message: "Lag en treningsplan for neste turnering",
  },
];

interface AiCoachClientProps {
  context: ChatContext;
  quickInsight: string;
}

export function AiCoachClient({ context, quickInsight }: AiCoachClientProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
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

      // Build message history for API
      const history = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      try {
        abortControllerRef.current = new AbortController();

        const response = await fetch("/api/portal/ai/chat", {
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
                ? { ...m, content: accumulated }
                : m
            )
          );
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
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

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-2xl bg-ai-light"
          >
            <Icon name="smart_toy"
              className="w-5 h-5 text-ai" />
          </div>
          <div>
            <h1
              className="text-xl font-bold tracking-tight text-on-surface"
            >
              AI Coach
            </h1>
            <p
              className="text-sm text-on-surface-variant"
            >
              Din personlige golfcoach
            </p>
          </div>
        </div>
      </div>

      {/* Quick insight banner */}
      {quickInsight && !hasMessages && (
        <div className="flex-shrink-0 mx-4 mb-4">
          <div
            className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm bg-ai-light border border-ai/15"
          >
            <Icon name="auto_awesome"
              className="w-4 h-4 mt-0.5 flex-shrink-0 text-ai" />
            <p className="text-ai-text">{quickInsight}</p>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4">
        {!hasMessages && (
          <div className="flex flex-col items-center justify-center h-full pb-8">
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center mb-6 bg-ai-light"
            >
              <Icon name="chat_bubble"
                className="w-8 h-8 text-ai" />
            </div>
            <h2
              className="text-lg font-semibold mb-2 text-on-surface"
            >
              Still et sporsmal
            </h2>
            <p
              className="text-sm text-center mb-8 max-w-md text-on-surface-variant"
            >
              AI Coach kjenner dine runder, treningshistorikk og mal. Spor om
              hva som helst relatert til golfen din.
            </p>

            {/* Quick questions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q.label}
                  onClick={() => sendMessage(q.message)}
                  disabled={isStreaming}
                  className="text-left px-4 py-3 rounded-full text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 bg-surface text-on-surface-variant border border-outline-variant/30 hover:border-outline-variant/50"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div
                className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 bg-ai-light"
              >
                <Icon name="smart_toy"
                  className="w-4 h-4 text-ai" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === "user" ? "rounded-br-md" : "rounded-bl-md"
              } ${
                message.role === "user"
                  ? "bg-on-surface text-surface"
                  : "bg-surface text-on-surface"
              }`}
            >
              {message.content ? (
                <div className="whitespace-pre-wrap">{message.content}</div>
              ) : (
                <div className="flex items-center gap-2">
                  <Icon name="progress_activity"
                    className="w-4 h-4 animate-spin text-ai" />
                  <span className="text-on-surface-variant">
                    Tenker...
                  </span>
                </div>
              )}
            </div>
            {message.role === "user" && (
              <div
                className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 bg-surface-variant"
              >
                <Icon name="person"
                  className="w-4 h-4 text-on-surface-variant" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2">
        {hasMessages && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q.label}
                onClick={() => sendMessage(q.message)}
                disabled={isStreaming}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 bg-surface text-on-surface-variant border border-outline-variant/30 hover:border-outline-variant/50"
              >
                {q.label}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 rounded-2xl p-2 bg-surface border border-outline-variant/30"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Spor AI Coach om hva som helst..."
            disabled={isStreaming}
            rows={1}
            className="flex-1 resize-none bg-transparent px-2 py-2 text-sm focus:outline-none placeholder:text-on-surface-variant disabled:opacity-50 text-on-surface"
            style={{
              maxHeight: "120px",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-30 text-surface"
            style={{
              backgroundColor: input.trim()
                ? "#AF52DE"
                : "#7A8C85",
            }}
          >
            {isStreaming ? (
              <Icon name="progress_activity" className="w-4 h-4 animate-spin" />
            ) : (
              <Icon name="send" className="w-4 h-4" />
            )}
          </button>
        </form>

        <p
          className="text-center text-xs mt-2 text-on-surface-variant"
        >
          AI Coach bruker dine data for personlige rad. Svar er veiledende.
        </p>
      </div>
    </div>
  );
}
