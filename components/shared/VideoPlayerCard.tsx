"use client";

import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { useRef, useState, useCallback } from "react";

interface VideoComment {
  id: string;
  timestamp: number;
  author: string;
  content: string;
  createdAt: string;
}

interface VideoPlayerCardProps {
  videoUrl: string;
  title?: string;
  playerName?: string;
  comments?: VideoComment[];
  onAddComment?: (timestamp: number, content: string) => void;
  className?: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function VideoPlayerCard({
  videoUrl,
  title,
  playerName,
  comments = [],
  onAddComment,
  className,
}: VideoPlayerCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [commentText, setCommentText] = useState("");

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, []);

  const handleSubmitComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed || !onAddComment) return;
    onAddComment(currentTime, trimmed);
    setCommentText("");
  };

  const handleTimestampClick = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      videoRef.current.play().catch(() => {
        /* bruker har ikke interagert ennå */
      });
    }
  };

  const sortedComments = [...comments].sort(
    (a, b) => a.timestamp - b.timestamp
  );

  return (
    <div
      className={cn("flex flex-col overflow-hidden", className)}
      style={{
        borderRadius: 20,
        border: "1px solid #E5E3DD",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Video */}
      <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          onTimeUpdate={handleTimeUpdate}
          className="h-full w-full object-cover"
          style={{ borderRadius: "20px 20px 0 0" }}
        />
      </div>

      {/* Tittel og spillernavn */}
      {(title || playerName) && (
        <div className="px-5 pt-4">
          {title && (
            <h3
              style={{
                fontFamily: "var(--font-inter-tight)",
                fontSize: 16,
                fontWeight: 700,
                color: "#0A1F18",
                margin: 0,
              }}
            >
              {title}
            </h3>
          )}
          {playerName && (
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 12,
                color: "#5E5C57",
                margin: "2px 0 0",
              }}
            >
              {playerName}
            </p>
          )}
        </div>
      )}

      {/* Kommentarer */}
      <div className="flex flex-col gap-3 px-5 py-4">
        {sortedComments.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {sortedComments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2">
                <button
                  type="button"
                  onClick={() => handleTimestampClick(comment.timestamp)}
                  className="shrink-0 cursor-pointer border-0"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#0A1F18",
                    backgroundColor: "#D1F843",
                    borderRadius: 6,
                    padding: "2px 6px",
                    lineHeight: 1.4,
                  }}
                >
                  {formatTime(comment.timestamp)}
                </button>
                <div className="flex flex-col gap-0.5">
                  <span
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#0A1F18",
                    }}
                  >
                    {comment.author}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: 13,
                      color: "#0A1F18",
                      lineHeight: 1.4,
                    }}
                  >
                    {comment.content}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ny kommentar */}
        {onAddComment && (
          <div className="flex items-center gap-2" style={{ marginTop: 4 }}>
            <div
              className="flex flex-1 items-center overflow-hidden"
              style={{
                border: "1px solid #E5E3DD",
                borderRadius: 10,
                backgroundColor: "#FAFAF7",
              }}
            >
              <span
                className="shrink-0 select-none"
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: 11,
                  color: "#9C9990",
                  padding: "8px 0 8px 10px",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatTime(currentTime)}
              </span>
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmitComment();
                }}
                placeholder="Legg til kommentar..."
                className="flex-1 border-0 bg-transparent outline-none"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 13,
                  color: "#0A1F18",
                  padding: "8px 10px",
                }}
              />
            </div>
            <button
              type="button"
              onClick={handleSubmitComment}
              disabled={!commentText.trim()}
              className="flex shrink-0 items-center justify-center border-0"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: commentText.trim() ? "#005840" : "#EFEDE6",
                color: commentText.trim() ? "#FFFFFF" : "#C4C0B8",
                cursor: commentText.trim() ? "pointer" : "default",
                transition: "background-color 120ms ease-out",
              }}
            >
              <Send size={16} strokeWidth={1.75} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
