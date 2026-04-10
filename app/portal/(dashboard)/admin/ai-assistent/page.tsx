"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Sparkles,
  User,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Lightbulb,
  Loader2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";

const suggestedQuestions = [
  { icon: Users, text: "Hvem har ikke booket på 2 uker?", category: "elever" },
  { icon: Calendar, text: "Hva er kapasiteten neste uke?", category: "booking" },
  { icon: TrendingUp, text: "Hvordan går det med en spesifikk elev?", category: "analyse" },
  { icon: BarChart3, text: "Gi meg en oppsummering av denne måneden", category: "rapport" },
  { icon: Lightbulb, text: "Hvilke elever trenger oppfølging?", category: "anbefaling" },
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
    "Hei! Jeg er din AI-assistent for AK Golf Academy. Jeg kan hjelpe deg med:\n\n- Sporsmal om elever, bookinger og kapasitet\n- Analyse av trender og statistikk\n- Forslag til oppfolging\n- Rapporter og oppsummeringer\n\nHva kan jeg hjelpe deg med i dag?",
  timestamp: new Date(),
};

export default function AIAssistentPage() {
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

      // Build message history for API (exclude welcome message and empty assistant placeholder)
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
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.error ?? `Serverfeil (${response.status})`
          );
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("Ingen streaming-stotte");

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
                : m
            )
          );
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Beklager, det oppstod en feil. Prov igjen.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id ? { ...m, content: errorMsg } : m
          )
        );
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [isStreaming, messages]
  );

  const handleSend = useCallback(
    (text: string = input) => {
      sendMessage(text);
    },
    [input, sendMessage]
  );

  const handleCopy = useCallback((content: string) => {
    navigator.clipboard.writeText(content).catch(() => {
      // Clipboard access denied — ignore silently
    });
  }, []);

  return (
    <>
      <MCTopbar
        title="AI Assistent"
        subtitle="Stil sporsmal om data, elever og analytikk"
        onMenuClick={toggle}
      />

      <div className="p-5 h-[calc(100vh-64px)]">
        <div className="bg-white rounded-2xl border border-[#c2c9bb]/50 h-full flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "flex-row-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    msg.role === "assistant"
                      ? "bg-gradient-to-br from-[#154212] to-[#0d2e0c]"
                      : "bg-[#f7f3ea] border border-[#c2c9bb]/50"
                  )}
                >
                  {msg.role === "assistant" ? (
                    <Sparkles className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-[#1c1c16]" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl p-4",
                    msg.role === "assistant"
                      ? "bg-[#f7f3ea] rounded-tl-sm"
                      : "bg-[#154212] text-white rounded-tr-sm"
                  )}
                >
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </div>
                  {msg.role === "assistant" && msg.content && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#c2c9bb]/30">
                      <button
                        onClick={() => handleCopy(msg.content)}
                        className="p-1.5 rounded hover:bg-[#e8e4db] text-[#6b7366] transition-colors"
                        title="Kopier"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-[#e8e4db] text-[#6b7366] transition-colors">
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-[#e8e4db] text-[#6b7366] transition-colors">
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] text-[#8a9385] ml-auto">
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
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#154212] to-[#0d2e0c] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-[#f7f3ea] rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#154212] animate-spin" />
                  <span className="text-sm text-[#6b7366]">Tenker...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length < 3 && (
            <div className="px-4 py-3 border-t border-[#c2c9bb]/30">
              <p className="text-xs text-[#8a9385] mb-2">
                Foreslatte sporsmal:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, i) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSend(q.text)}
                      disabled={isStreaming}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#f7f3ea] hover:bg-[#e8e4db] text-[#6b7366] hover:text-[#1c1c16] rounded-full transition-colors border border-[#c2c9bb]/50 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="p-4 border-t border-[#c2c9bb]/30">
            <div className="flex items-end gap-2 bg-white border border-[#c2c9bb]/50 rounded-xl p-2 focus-within:border-[#154212] focus-within:ring-2 focus-within:ring-[#154212]/20 transition-all">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#154212] to-[#0d2e0c]">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Stil et sporsmal om akademiet, elevene eller data..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-[#1c1c16] placeholder:text-[#8a9385] outline-none resize-none py-3"
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
                className="p-3 rounded-lg bg-[#154212] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-[#8a9385] mt-2 text-center">
              AI-assistenten kan gjore feil. Viktig informasjon bor
              dobbeltsjekkes.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
