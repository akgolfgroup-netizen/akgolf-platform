"use client";


import { Icon } from "@/components/ui/icon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { TrainingSession } from "./types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Fargekoding for fokusområder (AK Golf standard)
const FOCUS_COLORS: Record<TrainingSession["focus"], { bg: string; border: string; text: string; dot: string }> = {
  FYS: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  TEK: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  SLAG: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  SPILL: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    dot: "bg-orange-500",
  },
  TURN: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    dot: "bg-red-500",
  },
};

const FOCUS_LABELS: Record<TrainingSession["focus"], string> = {
  FYS: "Fysisk",
  TEK: "Teknikk",
  SLAG: "Slag",
  SPILL: "Spill",
  TURN: "Turnering",
};

interface SessionCardProps {
  session: TrainingSession;
  onEdit?: (session: TrainingSession) => void;
  onDelete?: (sessionId: string) => void;
  onDuplicate?: (session: TrainingSession) => void;
  onClick?: (session: TrainingSession) => void;
}

export function SessionCard({ session, onEdit, onDelete, onDuplicate, onClick }: SessionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: session.id,
    data: {
      type: "session",
      session,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 300ms ease, opacity 300ms ease",
  };

  const colors = FOCUS_COLORS[session.focus];
  const startTime = `${session.startH.toString().padStart(2, "0")}:${session.startM.toString().padStart(2, "0")}`;
  const endH = Math.floor((session.startH * 60 + session.startM + session.duration) / 60);
  const endM = (session.startH * 60 + session.startM + session.duration) % 60;
  const endTime = `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;

  const handleClick = () => {
    if (onClick && !isDragging) {
      onClick(session);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleClick}
      className={`
        group relative rounded-lg border ${colors.border} ${colors.bg}
        transition-all duration-300 ease cursor-pointer
        ${isDragging ? "shadow-lg scale-105 z-50 opacity-90" : "shadow-sm hover:shadow-md hover:scale-[1.02]"}
        ${session.completed ? "opacity-60" : ""}
      `}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-1 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Icon name="drag_indicator" className="w-4 h-4 text-gray-400" />
      </div>

      {/* Card content */}
      <div className="pl-6 pr-2 py-2">
        {/* Header: Time and menu */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Icon name="schedule" className="w-3 h-3" />
            <span>{startTime} - {endTime}</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-container-lowest/50"
              >
                <Icon name="more_horiz" className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(session)}>
                  <Icon name="edit" className="w-4 h-4 mr-2" />
                  Rediger
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(session)}>
                  <Icon name="content_copy" className="w-4 h-4 mr-2" />
                  Dupliser
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(session.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Icon name="delete" className="w-4 h-4 mr-2" />
                  Slett
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title */}
        <h4 className={`font-medium text-sm ${colors.text} line-clamp-2`}>
          {session.title}
        </h4>

        {/* Footer: Focus badge, exercise count and duration */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
            <span className={`text-xs font-medium ${colors.text}`}>
              {FOCUS_LABELS[session.focus]}
            </span>
            {session.exercises.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full bg-surface-container-lowest/60 text-gray-600 font-medium">
                {session.exercises.length}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {session.duration} min
          </span>
        </div>

        {/* Completed indicator - larger and more visible */}
        {session.completed && (
          <div className="absolute top-2 right-2">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
              <svg className="w-3 h-3 text-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Non-draggable version for display only
export function SessionCardStatic({ session }: { session: TrainingSession }) {
  const colors = FOCUS_COLORS[session.focus];
  const startTime = `${session.startH.toString().padStart(2, "0")}:${session.startM.toString().padStart(2, "0")}`;

  return (
    <div
      className={`
        rounded-lg border ${colors.border} ${colors.bg}
        p-2 shadow-sm
        ${session.completed ? "opacity-60" : ""}
      `}
    >
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
        <Icon name="schedule" className="w-3 h-3" />
        <span>{startTime}</span>
      </div>
      <h4 className={`font-medium text-sm ${colors.text} line-clamp-2`}>
        {session.title}
      </h4>
      <div className="flex items-center gap-1.5 mt-1">
        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
        <span className={`text-[10px] font-medium ${colors.text}`}>
          {FOCUS_LABELS[session.focus]}
        </span>
      </div>
    </div>
  );
}
