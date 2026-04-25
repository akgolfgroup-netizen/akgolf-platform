"use client";

import { Icon } from "@/components/ui/icon";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";

import { ChatInterface, ContextPanel, ChatHistory, type ChatSession, type Message } from "@/components/portal/ai-coach";
import type { ChatContext } from "./actions";

interface AiCoachChatClientProps {
  context: ChatContext;
  quickInsight: string;
}

// Mock chat history - in production this would come from the database
const MOCK_CHAT_HISTORY: ChatSession[] = [
  {
    id: "1",
    title: "Tips for driving",
    lastMessage: "Prøv å fokusere på tempo i overgangen...",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    messageCount: 8,
  },
  {
    id: "2",
    title: "Treningsplan for uke 15",
    lastMessage: "Basert på din HCP og mål...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    messageCount: 12,
  },
  {
    id: "3",
    title: "Analyse av siste runde",
    lastMessage: "Din putting trenger oppmerksomhet...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    messageCount: 6,
  },
];

export function AiCoachChatClient({ context, quickInsight }: AiCoachChatClientProps) {
  const [showHistory, setShowHistory] = useState(true);
  const [showContext, setShowContext] = useState(true);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
  const [chatHistory, setChatHistory] = useState<ChatSession[]>(MOCK_CHAT_HISTORY);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleNewChat = useCallback(() => {
    setActiveSessionId(undefined);
    setMessages([]);
  }, []);

  const handleSelectSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
    // In production, this would load the session messages from the database
  }, []);

  const handleDeleteSession = useCallback((sessionId: string) => {
    setChatHistory((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(undefined);
      setMessages([]);
    }
  }, [activeSessionId]);

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Left Sidebar - Chat History */}
      <motion.aside
        initial={false}
        animate={{ 
          width: showHistory ? 280 : 0,
          opacity: showHistory ? 1 : 0
        }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="flex-shrink-0 border-r border-outline-variant/20 overflow-hidden bg-surface-container-lowest"
      >
        <div className="w-[280px] h-full">
          <ChatHistory
            sessions={chatHistory}
            activeSessionId={activeSessionId}
            onSelectSession={handleSelectSession}
            onNewChat={handleNewChat}
            onDeleteSession={handleDeleteSession}
          />
        </div>
      </motion.aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface-container-lowest">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-lg transition-colors ${
                showHistory ? "bg-ai/10 text-ai" : "hover:bg-surface-container text-on-surface-variant"
              }`}
              title={showHistory ? "Skjul historikk" : "Vis historikk"}
            >
              {showHistory ? <Icon name="left_panel_open" className="w-5 h-5" /> : <Icon name="menu" className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-lg font-semibold text-on-surface">AI Coach</h1>
              <p className="text-xs text-on-surface-variant">Din personlige golfcoach</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowContext(!showContext)}
            className={`p-2 rounded-lg transition-colors ${
              showContext ? "bg-ai/10 text-ai" : "hover:bg-surface-container text-on-surface-variant"
            }`}
            title={showContext ? "Skjul kontekst" : "Vis kontekst"}
          >
            {showContext ? <Icon name="left_panel_open" className="w-5 h-5" /> : <Icon name="left_panel_open" className="w-5 h-5 rotate-180" />}
          </button>
        </header>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            context={context}
            quickInsight={quickInsight}
            onNewChat={handleNewChat}
          />
        </div>
      </div>

      {/* Right Sidebar - Context Panel */}
      <motion.aside
        initial={false}
        animate={{ 
          width: showContext ? 280 : 0,
          opacity: showContext ? 1 : 0
        }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="flex-shrink-0 border-l border-outline-variant/20 overflow-hidden bg-surface/50"
      >
        <div className="w-[280px] h-full overflow-y-auto p-4">
          <ContextPanel context={context} />
        </div>
      </motion.aside>
    </div>
  );
}
