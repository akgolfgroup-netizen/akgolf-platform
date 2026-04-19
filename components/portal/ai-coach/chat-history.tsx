"use client";

import { useState } from "react";
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  ChevronRight,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface ChatHistoryProps {
  sessions: ChatSession[];
  activeSessionId?: string;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession?: (sessionId: string) => void;
}

export function ChatHistory({ 
  sessions, 
  activeSessionId, 
  onSelectSession, 
  onNewChat,
  onDeleteSession 
}: ChatHistoryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Group sessions by date
  const groupedSessions = groupSessionsByDate(sessions);

  return (
    <div className="h-full flex flex-col">
      {/* New Chat Button */}
      <div className="p-3 border-b border-grey-100">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Ny samtale
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center px-4">
            <MessageSquare className="w-8 h-8 text-grey-300 mb-2" />
            <p className="text-sm text-grey-400">Ingen samtaler ennå</p>
          </div>
        ) : (
          <div className="p-2 space-y-4">
            {Object.entries(groupedSessions).map(([group, groupSessions]) => (
              <div key={group}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-grey-400 px-2 mb-1">
                  {group}
                </h4>
                <div className="space-y-0.5">
                  {groupSessions.map((session) => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      isActive={session.id === activeSessionId}
                      isHovered={session.id === hoveredId}
                      onHover={setHoveredId}
                      onSelect={() => onSelectSession(session.id)}
                      onDelete={onDeleteSession}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface SessionItemProps {
  session: ChatSession;
  isActive: boolean;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onSelect: () => void;
  onDelete?: (id: string) => void;
}

function SessionItem({ 
  session, 
  isActive, 
  isHovered,
  onHover, 
  onSelect,
  onDelete
}: SessionItemProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.button
      onClick={onSelect}
      onMouseEnter={() => {
        onHover(session.id);
        setShowActions(true);
      }}
      onMouseLeave={() => {
        onHover(null);
        setShowActions(false);
      }}
      className={`w-full text-left p-2.5 rounded-xl transition-all duration-200 group relative ${
        isActive 
          ? "bg-purple-50 border border-purple-200" 
          : "hover:bg-grey-50 border border-transparent"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
          isActive ? "bg-purple-100 text-purple-600" : "bg-grey-100 text-grey-400"
        }`}>
          <MessageSquare className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${
            isActive ? "text-purple-900" : "text-black"
          }`}>
            {session.title}
          </p>
          <p className="text-xs text-grey-400 truncate mt-0.5">
            {session.lastMessage}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-grey-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(session.timestamp)}
            </span>
            <span className="text-xs text-grey-300">
              {session.messageCount} meldinger
            </span>
          </div>
        </div>
        
        {/* Actions */}
        <AnimatePresence>
          {(isHovered || isActive) && onDelete && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex-shrink-0"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(session.id);
                }}
                className="p-1.5 rounded-lg text-grey-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-colors ${
          isActive ? "text-purple-400" : "text-grey-300 group-hover:text-grey-400"
        }`} />
      </div>
    </motion.button>
  );
}

// Helper functions
function groupSessionsByDate(sessions: ChatSession[]): Record<string, ChatSession[]> {
  const groups: Record<string, ChatSession[]> = {
    "I dag": [],
    "I går": [],
    "Denne uken": [],
    "Tidligere": [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  sessions.forEach((session) => {
    const sessionDate = new Date(session.timestamp);
    const sessionDay = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());

    if (sessionDay.getTime() === today.getTime()) {
      groups["I dag"].push(session);
    } else if (sessionDay.getTime() === yesterday.getTime()) {
      groups["I går"].push(session);
    } else if (sessionDay.getTime() > weekAgo.getTime()) {
      groups["Denne uken"].push(session);
    } else {
      groups["Tidligere"].push(session);
    }
  });

  // Remove empty groups
  return Object.fromEntries(
    Object.entries(groups).filter(([_, items]) => items.length > 0)
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
