"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CoachAgentChatProps {
  studentId: string;
  initialMessages?: Message[];
  onSend: (msg: string) => Promise<{ reply: string }>;
}

export function CoachAgentChat({ studentId: _studentId, initialMessages = [], onSend }: CoachAgentChatProps) {
  void _studentId;
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const { reply } = await onSend(userMsg);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Beklager, noe gikk galt. Prøv igjen." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-xl bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <Bot className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Start samtalen med coach-agenten</p>
            <p className="text-xs mt-1">F.eks: &quot;Øk putting neste uke&quot; eller &quot;Legg til taper før Oslo Open&quot;</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className="w-8 h-8 rounded-full grid place-items-center shrink-0"
              style={{
                background: m.role === "assistant" ? "#D1F843" : "#0A1F18",
                color: m.role === "assistant" ? "#0A1F18" : "#fff",
              }}
            >
              {m.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div
              className="rounded-xl px-4 py-3 text-sm max-w-[80%]"
              style={{
                background: m.role === "assistant" ? "#f3f4f6" : "#0A1F18",
                color: m.role === "assistant" ? "#111" : "#fff",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full grid place-items-center shrink-0" style={{ background: "#D1F843" }}>
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-xl px-4 py-3 bg-gray-100">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.1s]" />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Skriv til coach-agenten..."
          className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lime-300"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="rounded-lg px-4 py-2 text-sm font-semibold transition-opacity disabled:opacity-40"
          style={{ background: "#D1F843", color: "#0A1F18" }}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
