"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";



export interface PendingRequest {
  friendshipId: string;
  id: string;
  name: string;
  image: string | null;
  createdAt: string;
}

interface PendingRequestsProps {
  requests: PendingRequest[];
  onAccept: (friendshipId: string) => Promise<void>;
  onDecline: (friendshipId: string) => Promise<void>;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function PendingRequests({
  requests,
  onAccept,
  onDecline,
}: PendingRequestsProps) {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  if (requests.length === 0) return null;

  const visible = requests.filter((r) => !dismissedIds.has(r.friendshipId));
  if (visible.length === 0) return null;

  async function handleAction(
    friendshipId: string,
    action: "accept" | "decline"
  ) {
    setProcessingId(friendshipId);
    try {
      if (action === "accept") {
        await onAccept(friendshipId);
      } else {
        await onDecline(friendshipId);
      }
      setDismissedIds((prev) => new Set(prev).add(friendshipId));
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-grey-200/70 overflow-hidden">
      <div className="px-5 py-3 border-b border-grey-200/50 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-grey-900">
          Venneforespørsler
        </h3>
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold">
          {visible.length}
        </span>
      </div>
      <AnimatePresence>
        {visible.map((request) => (
          <motion.div
            key={request.friendshipId}
            layout
            exit={{ opacity: 0, height: 0 }}
            className="px-5 py-3 flex items-center justify-between border-b border-grey-200/30 last:border-b-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                {getInitials(request.name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-grey-900 truncate">
                  {request.name}
                </p>
                <p className="text-[11px] text-muted">
                  Vil bli din venn
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {processingId === request.friendshipId ? (
                <Icon name="progress_activity" className="w-4 h-4 text-muted animate-spin" />
              ) : (
                <>
                  <button
                    onClick={() =>
                      handleAction(request.friendshipId, "accept")
                    }
                    className="p-1.5 rounded-lg bg-success-light text-success hover:bg-success/20 transition-colors"
                  >
                    <Icon name="check" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      handleAction(request.friendshipId, "decline")
                    }
                    className="p-1.5 rounded-lg bg-error-light text-error hover:bg-error/20 transition-colors"
                  >
                    <Icon name="close" className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
