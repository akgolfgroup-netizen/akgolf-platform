"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useTransition, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/portal/utils/cn";

interface SearchResult {
  id: string;
  name: string;
  image: string | null;
  email: string | null;
  friendshipStatus: string | null;
}

interface AddFriendDialogProps {
  open: boolean;
  onClose: () => void;
  onSearch: (query: string) => Promise<SearchResult[]>;
  onSendRequest: (friendId: string) => Promise<void>;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AddFriendDialog({
  open,
  onClose,
  onSearch,
  onSendRequest,
}: AddFriendDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, startSearch] = useTransition();
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [sendingId, setSendingId] = useState<string | null>(null);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      if (value.length < 2) {
        setResults([]);
        return;
      }
      startSearch(async () => {
        const data = await onSearch(value);
        setResults(data);
      });
    },
    [onSearch]
  );

  async function handleSend(friendId: string) {
    setSendingId(friendId);
    try {
      await onSendRequest(friendId);
      setSentIds((prev) => new Set(prev).add(friendId));
    } catch {
      // feilhåndtering kan legges til
    } finally {
      setSendingId(null);
    }
  }

  function getButtonState(result: SearchResult) {
    if (sentIds.has(result.id) || result.friendshipStatus === "PENDING") {
      return "pending";
    }
    if (result.friendshipStatus === "ACCEPTED") {
      return "accepted";
    }
    return "available";
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-[15%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md z-50 bg-surface-container-lowest rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30">
              <h2 className="text-base font-semibold text-on-surface">
                Legg til venn
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-surface transition-colors"
              >
                <Icon name="close" className="w-4 h-4 text-muted" />
              </button>
            </div>

            {/* Søkefelt */}
            <div className="px-5 py-3">
              <div className="relative">
                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Søk etter navn eller e-post..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border-none text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                {isSearching && (
                  <Icon name="progress_activity" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted animate-spin" />
                )}
              </div>
            </div>

            {/* Resultater */}
            <div className="max-h-72 overflow-y-auto">
              {query.length >= 2 && results.length === 0 && !isSearching && (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-muted">
                    Ingen spillere funnet for «{query}»
                  </p>
                </div>
              )}

              {results.map((result) => {
                const state = getButtonState(result);
                return (
                  <div
                    key={result.id}
                    className="flex items-center justify-between px-5 py-3 hover:bg-surface transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-surface text-xs font-bold shrink-0">
                        {getInitials(result.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-on-surface truncate">
                          {result.name}
                        </p>
                        {result.email && (
                          <p className="text-xs text-muted truncate">
                            {result.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {state === "accepted" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success-light text-success-text text-[11px] font-medium">
                        <Icon name="check" className="w-3 h-3" />
                        Venner
                      </span>
                    )}

                    {state === "pending" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-warning-light text-warning-text text-[11px] font-medium">
                        <Icon name="schedule" className="w-3 h-3" />
                        Sendt
                      </span>
                    )}

                    {state === "available" && (
                      <button
                        onClick={() => handleSend(result.id)}
                        disabled={sendingId === result.id}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                          "bg-primary text-surface hover:bg-primary-alt active:scale-[0.97]",
                          sendingId === result.id &&
                            "opacity-60 cursor-not-allowed"
                        )}
                      >
                        {sendingId === result.id ? (
                          <Icon name="progress_activity" className="w-3 h-3 animate-spin" />
                        ) : (
                          <Icon name="person"Plus className="w-3 h-3" />
                        )}
                        Legg til
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bunninfo */}
            <div className="px-5 py-3 border-t border-outline-variant/30 bg-surface">
              <p className="text-[11px] text-muted text-center">
                Skriv minst 2 tegn for å søke. Venneforespørsler må godkjennes.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
