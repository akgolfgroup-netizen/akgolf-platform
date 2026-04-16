"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, Square, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageBubble } from "./message-bubble";
import { QuickQuestions } from "./quick-questions";
import type { ChatContext } from "@/app/portal/(dashboard)/ai-coach/actions";

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
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center mb-6 shadow-sm">
                <Bot className="w-10 h-10 text-purple-500" />
              </div>
              
              <h2 className="text-xl font-semibold mb-2 text-black">
                Hei! Hva kan jeg hjelpe deg med?
              </h2>
              <p className="text-sm text-center mb-8 max-w-md text-grey-400">
                AI Coach kjenner dine runder, treningshistorikk og mal. Spor om
                hva som helst relatert til golfen din.
              </p>

              {/* Quick insight banner */}
              {quickInsight && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-lg mb-8"
                >
                  <div className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm bg-purple-50 border border-purple-500/15">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                    <p className="text-purple-700">{quickInsight}</p>
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
          className="flex items-end gap-2 rounded-2xl p-2 bg-grey-50 border border-grey-200 focus-within:border-grey-300 focus-within:ring-2 focus-within:ring-purple-500/10 transition-all"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Skriv en melding til AI Coach..."
            disabled={isStreaming}
            rows={1}
            className="flex-1 resize-none bg-transparent px-2 py-2 text-sm focus:outline-none placeholder:text-grey-400 disabled:opacity-50 text-black min-h-[40px]"
            style={{
              maxHeight: "120px",
            }}
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={handleStop}
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white transition-colors"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-30 text-white bg-purple-500 hover:bg-purple-600 disabled:hover:bg-grey-400"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </form>

        <p className="text-center text-xs mt-2 text-grey-400">
          AI Coach bruker dine data for personlige rad. Svar er veiledende.
        </p>
      </div>
    </div>
  );
}
