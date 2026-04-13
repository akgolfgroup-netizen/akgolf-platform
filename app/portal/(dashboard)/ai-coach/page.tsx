"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, Send, Bot, User, Loader2, Video, Lightbulb, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  { label: "Hva bør jeg trene denne uken?", message: "Hva bør jeg trene denne uken?" },
  { label: "Analyser mine siste runder", message: "Analyser mine siste 5 runder" },
  { label: "Hvordan forbedrer jeg approach?", message: "Hvordan forbedrer jeg approach?" },
  { label: "Lag treningsplan til turnering", message: "Lag en treningsplan for neste turnering" },
];

const AI_FEATURES = [
  { icon: Lightbulb, label: "Personlige tips", desc: "Basert på din data" },
  { icon: TrendingUp, label: "Fremgangsanalyse", desc: "Se din utvikling" },
  { icon: Video, label: "Videoanalyse", desc: "Last opp svingvideo" },
];

export default function AiCoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
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

  const sendMessage = useCallback(async (content: string) => {
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

    try {
      abortControllerRef.current = new AbortController();
      const response = await fetch("/api/portal/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content.trim() }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error("Feil fra server");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Ingen streaming-stotte");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMessage.id ? { ...m, content: accumulated } : m))
        );
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? { ...m, content: "Beklager, det oppstod en feil. Prov igjen." }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [isStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-portal-text">AI Coach</h1>
          <p className="text-portal-secondary mt-1">Din personlige golf-assistent</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-bg-ai to-bg-ai-text flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-3">
        {AI_FEATURES.map((feature, index) => (
          <motion.div
            key={feature.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PremiumCard className="p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-ai/10 flex items-center justify-center mx-auto mb-2">
                <feature.icon className="w-5 h-5 text-ai" />
              </div>
              <p className="text-sm font-medium text-portal-text">{feature.label}</p>
              <p className="text-xs text-portal-muted">{feature.desc}</p>
            </PremiumCard>
          </motion.div>
        ))}
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-xl border border-portal-border flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-bg-ai/20 to-bg-ai/5 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-ai" />
              </div>
              <h3 className="font-semibold text-portal-text mb-2">Hei! Jeg er din AI Coach</h3>
              <p className="text-sm text-portal-secondary max-w-md mb-6">
                Jeg kan hjelpe deg med treningsplanlegging, analyse av dine runder, og tips for aa forbedre spillet ditt.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => sendMessage(q.message)}
                    className="px-4 py-2 rounded-[20px] bg-portal-hover text-sm text-portal-text hover:bg-portal-hover/80 transition-colors"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    message.role === "user" ? "bg-primary" : "bg-ai"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === "user"
                      ? "bg-primary text-white"
                      : "bg-portal-hover text-portal-text"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-[10px] opacity-60 mt-2 tabular-nums">
                    {message.timestamp.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))
          )}
          {isStreaming && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-ai flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-portal-hover rounded-2xl p-4 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-ai" />
                <span className="text-sm text-portal-secondary">Skriver...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-portal-border/30">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Spør AI Coach om noe..."
                className="w-full px-4 py-3 rounded-xl bg-portal-hover border border-portal-border/50 text-portal-text placeholder-portal-muted focus:outline-none focus:ring-2 focus:ring-ai/30"
              />
            </div>
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="px-4 py-3 rounded-[20px] bg-primary text-white hover:bg-primary-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-portal-muted hover:text-primary transition-colors"
            >
              <Video className="w-3 h-3" />
              Last opp video
            </button>
            <p className="text-xs text-portal-muted">AI-genererte svar kan inneholde feil</p>
          </div>
        </form>
      </div>
    </div>
  );
}
