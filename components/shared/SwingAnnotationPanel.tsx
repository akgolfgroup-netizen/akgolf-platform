"use client";

import { cn } from "@/lib/utils";
import { Minus, Circle, ArrowRight, Type, Undo2, Trash2 } from "lucide-react";
import { useRef, useState, useCallback } from "react";

interface Annotation {
  id: string;
  type: "line" | "circle" | "arrow" | "text";
  points: Array<{ x: number; y: number }>;
  color: string;
  label?: string;
}

interface SwingAnnotationPanelProps {
  imageUrl: string;
  annotations?: Annotation[];
  onAnnotationsChange?: (annotations: Annotation[]) => void;
  readOnly?: boolean;
  className?: string;
}

type ToolType = "line" | "circle" | "arrow" | "text";

const COLORS = ["#A32D2D", "#D1F843", "#005840", "#FFFFFF"];

const TOOLS: { type: ToolType; icon: typeof Minus; label: string }[] = [
  { type: "line", icon: Minus, label: "Linje" },
  { type: "circle", icon: Circle, label: "Sirkel" },
  { type: "arrow", icon: ArrowRight, label: "Pil" },
  { type: "text", icon: Type, label: "Tekst" },
];

let nextId = 1;
function generateId(): string {
  return `ann-${Date.now()}-${nextId++}`;
}

export function SwingAnnotationPanel({
  imageUrl,
  annotations: externalAnnotations,
  onAnnotationsChange,
  readOnly = false,
  className,
}: SwingAnnotationPanelProps) {
  const [internalAnnotations, setInternalAnnotations] = useState<Annotation[]>(
    externalAnnotations ?? []
  );
  const annotations = externalAnnotations ?? internalAnnotations;

  const [activeTool, setActiveTool] = useState<ToolType>("line");
  const [activeColor, setActiveColor] = useState(COLORS[2]);
  const [drawing, setDrawing] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] =
    useState<Annotation | null>(null);
  const [history, setHistory] = useState<Annotation[][]>([]);

  const svgRef = useRef<SVGSVGElement>(null);

  const updateAnnotations = useCallback(
    (newAnnotations: Annotation[]) => {
      if (onAnnotationsChange) {
        onAnnotationsChange(newAnnotations);
      } else {
        setInternalAnnotations(newAnnotations);
      }
    },
    [onAnnotationsChange]
  );

  const getSvgPoint = (e: React.MouseEvent): { x: number; y: number } => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (readOnly) return;
    const pt = getSvgPoint(e);

    if (activeTool === "text") {
      const label = window.prompt("Tekst:");
      if (!label) return;
      const ann: Annotation = {
        id: generateId(),
        type: "text",
        points: [pt],
        color: activeColor,
        label,
      };
      setHistory((h) => [...h, annotations]);
      updateAnnotations([...annotations, ann]);
      return;
    }

    setDrawing(true);
    setCurrentAnnotation({
      id: generateId(),
      type: activeTool,
      points: [pt, pt],
      color: activeColor,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing || !currentAnnotation) return;
    const pt = getSvgPoint(e);
    setCurrentAnnotation({
      ...currentAnnotation,
      points: [currentAnnotation.points[0], pt],
    });
  };

  const handleMouseUp = () => {
    if (!drawing || !currentAnnotation) return;
    setDrawing(false);
    setHistory((h) => [...h, annotations]);
    updateAnnotations([...annotations, currentAnnotation]);
    setCurrentAnnotation(null);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    updateAnnotations(prev);
  };

  const handleClearAll = () => {
    if (annotations.length === 0) return;
    setHistory((h) => [...h, annotations]);
    updateAnnotations([]);
  };

  const renderAnnotation = (ann: Annotation) => {
    const [p1, p2] = ann.points;
    const strokeWidth = 2.5;

    switch (ann.type) {
      case "line":
        return (
          <line
            key={ann.id}
            x1={`${p1.x}%`}
            y1={`${p1.y}%`}
            x2={`${p2.x}%`}
            y2={`${p2.y}%`}
            stroke={ann.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        );
      case "circle": {
        const cx = (p1.x + p2.x) / 2;
        const cy = (p1.y + p2.y) / 2;
        const rx = Math.abs(p2.x - p1.x) / 2;
        const ry = Math.abs(p2.y - p1.y) / 2;
        return (
          <ellipse
            key={ann.id}
            cx={`${cx}%`}
            cy={`${cy}%`}
            rx={`${rx}%`}
            ry={`${ry}%`}
            stroke={ann.color}
            strokeWidth={strokeWidth}
            fill="none"
          />
        );
      }
      case "arrow":
        return (
          <g key={ann.id}>
            <defs>
              <marker
                id={`arrow-${ann.id}`}
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <path
                  d="M0,0 L8,4 L0,8 Z"
                  fill={ann.color}
                />
              </marker>
            </defs>
            <line
              x1={`${p1.x}%`}
              y1={`${p1.y}%`}
              x2={`${p2.x}%`}
              y2={`${p2.y}%`}
              stroke={ann.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              markerEnd={`url(#arrow-${ann.id})`}
            />
          </g>
        );
      case "text":
        return (
          <text
            key={ann.id}
            x={`${p1.x}%`}
            y={`${p1.y}%`}
            fill={ann.color}
            fontSize="14"
            fontFamily="var(--font-inter)"
            fontWeight="600"
          >
            {ann.label}
          </text>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Verktoyrad */}
      {!readOnly && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {TOOLS.map(({ type, icon: Icon, label }) => {
            const isActive = activeTool === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setActiveTool(type)}
                title={label}
                className="flex items-center justify-center border-0"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: isActive ? "#005840" : "#EFEDE6",
                  color: isActive ? "#FFFFFF" : "#5E5C57",
                  cursor: "pointer",
                  transition: "all 120ms ease-out",
                }}
              >
                <Icon size={18} strokeWidth={1.75} />
              </button>
            );
          })}

          <div
            style={{
              width: 1,
              height: 24,
              backgroundColor: "#E5E3DD",
              margin: "0 4px",
            }}
          />

          {/* Farge-velger */}
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setActiveColor(color)}
              className="border-0 p-0"
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                backgroundColor: color,
                cursor: "pointer",
                outline:
                  activeColor === color
                    ? "2px solid #005840"
                    : "1px solid #E5E3DD",
                outlineOffset: 2,
              }}
            />
          ))}

          <div
            style={{
              width: 1,
              height: 24,
              backgroundColor: "#E5E3DD",
              margin: "0 4px",
            }}
          />

          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            title="Angre"
            className="flex items-center justify-center border-0"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: "#EFEDE6",
              color: history.length > 0 ? "#5E5C57" : "#C4C0B8",
              cursor: history.length > 0 ? "pointer" : "default",
            }}
          >
            <Undo2 size={18} strokeWidth={1.75} />
          </button>

          <button
            type="button"
            onClick={handleClearAll}
            disabled={annotations.length === 0}
            title="Slett alle"
            className="flex items-center justify-center border-0"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: "#EFEDE6",
              color: annotations.length > 0 ? "#A32D2D" : "#C4C0B8",
              cursor: annotations.length > 0 ? "pointer" : "default",
            }}
          >
            <Trash2 size={18} strokeWidth={1.75} />
          </button>
        </div>
      )}

      {/* Bilde + SVG overlay */}
      <div
        className="relative w-full select-none overflow-hidden"
        style={{
          aspectRatio: "16 / 9",
          borderRadius: 16,
          border: "1px solid #E5E3DD",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Swing-analyse"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <svg
          ref={svgRef}
          className="absolute inset-0 h-full w-full"
          style={{ cursor: readOnly ? "default" : "crosshair" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            if (drawing) handleMouseUp();
          }}
        >
          {annotations.map(renderAnnotation)}
          {currentAnnotation && renderAnnotation(currentAnnotation)}
        </svg>
      </div>
    </div>
  );
}
