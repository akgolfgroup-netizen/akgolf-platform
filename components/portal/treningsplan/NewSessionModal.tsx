"use client";

import { useState, useCallback } from "react";
import { X, Plus, Clock, Target, Copy, Sparkles } from "lucide-react";
import type { StandardTemplate, TrainingSession } from "./types";

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (template: StandardTemplate, dayOfWeek: number) => Promise<void>;
  dayOfWeek: number | null;
  standardTemplates: StandardTemplate[];
}

// Fargekoding for fokusområder
const FOCUS_COLORS: Record<string, { bg: string; border: string; text: string; dot: string; gradient: string }> = {
  FYS: { 
    bg: "bg-blue-500/10", 
    border: "border-blue-500/30", 
    text: "text-blue-400", 
    dot: "bg-blue-500",
    gradient: "from-blue-500/20 to-blue-600/5"
  },
  TEK: { 
    bg: "bg-emerald-500/10", 
    border: "border-emerald-500/30", 
    text: "text-emerald-400", 
    dot: "bg-emerald-500",
    gradient: "from-emerald-500/20 to-emerald-600/5"
  },
  SLAG: { 
    bg: "bg-amber-500/10", 
    border: "border-amber-500/30", 
    text: "text-amber-400", 
    dot: "bg-amber-500",
    gradient: "from-amber-500/20 to-amber-600/5"
  },
  SPILL: { 
    bg: "bg-orange-500/10", 
    border: "border-orange-500/30", 
    text: "text-orange-400", 
    dot: "bg-orange-500",
    gradient: "from-orange-500/20 to-orange-600/5"
  },
  TURN: { 
    bg: "bg-red-500/10", 
    border: "border-red-500/30", 
    text: "text-red-400", 
    dot: "bg-red-500",
    gradient: "from-red-500/20 to-red-600/5"
  },
};

const FOCUS_LABELS: Record<string, string> = {
  FYS: "Fysisk",
  TEK: "Teknikk",
  SLAG: "Slag",
  SPILL: "Spill",
  TURN: "Turnering",
};

const DAY_NAMES: Record<number, string> = {
  1: "Mandag",
  2: "Tirsdag",
  3: "Onsdag",
  4: "Torsdag",
  5: "Fredag",
  6: "Lørdag",
  7: "Søndag",
};

// Standard templates (fallback if none provided)
const DEFAULT_TEMPLATES: StandardTemplate[] = [
  {
    id: "std-putting",
    title: "Putting-drill",
    duration: 20,
    focus: "TEK",
    exercises: [
      { id: "e1", name: "3-fots cirkel", pyramid: "TEK", area: "PUTT3-6" },
      { id: "e2", name: "Avstandskontroll", pyramid: "TEK", area: "PUTT20-40" },
    ],
  },
  {
    id: "std-shortgame",
    title: "Short game",
    duration: 30,
    focus: "SLAG",
    exercises: [
      { id: "e3", name: "Chipping rutine", pyramid: "SLAG", area: "CHIP" },
      { id: "e4", name: "Pitching 30m", pyramid: "SLAG", area: "PITCH" },
      { id: "e5", name: "Bunker basis", pyramid: "SLAG", area: "BUNKER" },
    ],
  },
  {
    id: "std-driving",
    title: "Driving range",
    duration: 45,
    focus: "SLAG",
    exercises: [
      { id: "e6", name: "Oppvarming", pyramid: "TEK", area: "INN50" },
      { id: "e7", name: "Iron-sekvens", pyramid: "SLAG", area: "INN150" },
      { id: "e8", name: "Driver treff", pyramid: "SLAG", area: "TEE" },
    ],
  },
  {
    id: "std-styrke",
    title: "Styrke-økt",
    duration: 50,
    focus: "FYS",
    exercises: [
      { id: "e9", name: "Kjerneaktivering", pyramid: "FYS", area: "KROPP" },
      { id: "e10", name: "Rotasjonsstyrke", pyramid: "FYS", area: "KROPP" },
      { id: "e11", name: "Mobilitet", pyramid: "FYS", area: "KROPP" },
    ],
  },
  {
    id: "std-9hull",
    title: "Spill 9 hull",
    duration: 120,
    focus: "SPILL",
    exercises: [
      { id: "e12", name: "Banemanagement", pyramid: "SPILL", area: "TEE" },
      { id: "e13", name: "Scoring", pyramid: "SPILL", area: "PUTT3-6" },
    ],
  },
  {
    id: "std-analyse",
    title: "Svinganalyse",
    duration: 40,
    focus: "TEK",
    exercises: [
      { id: "e14", name: "Videoanalyse", pyramid: "TEK", area: "INN100" },
      { id: "e15", name: "Teknikk-justering", pyramid: "TEK", area: "INN150" },
    ],
  },
];

export function NewSessionModal({ isOpen, onClose, onAdd, dayOfWeek, standardTemplates }: NewSessionModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<StandardTemplate | null>(null);
  const [customTitle, setCustomTitle] = useState("");
  const [customDuration, setCustomDuration] = useState(30);
  const [customFocus, setCustomFocus] = useState<TrainingSession["focus"]>("TEK");
  const [activeTab, setActiveTab] = useState<"templates" | "custom">("templates");
  const [isAdding, setIsAdding] = useState(false);

  const templates = standardTemplates.length > 0 ? standardTemplates : DEFAULT_TEMPLATES;

  const handleClose = useCallback(() => {
    setSelectedTemplate(null);
    setCustomTitle("");
    setCustomDuration(30);
    setCustomFocus("TEK");
    setActiveTab("templates");
    setIsAdding(false);
    onClose();
  }, [onClose]);

  const handleAddTemplate = useCallback(async (template: StandardTemplate) => {
    if (dayOfWeek === null) return;
    
    setIsAdding(true);
    try {
      await onAdd(template, dayOfWeek);
      handleClose();
    } catch (error) {
      console.error("Failed to add session:", error);
    } finally {
      setIsAdding(false);
    }
  }, [dayOfWeek, onAdd, handleClose]);

  const handleAddCustom = useCallback(async () => {
    if (dayOfWeek === null || !customTitle.trim()) return;
    
    const customTemplate: StandardTemplate = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      duration: customDuration,
      focus: customFocus,
      exercises: [],
    };
    
    setIsAdding(true);
    try {
      await onAdd(customTemplate, dayOfWeek);
      handleClose();
    } catch (error) {
      console.error("Failed to add custom session:", error);
    } finally {
      setIsAdding(false);
    }
  }, [dayOfWeek, customTitle, customDuration, customFocus, onAdd, handleClose]);

  if (!isOpen || dayOfWeek === null) return null;

  const dayName = DAY_NAMES[dayOfWeek];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] bg-[#0F172A] rounded-xl border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">
              Legg til økt
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {dayName}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button
            onClick={() => setActiveTab("templates")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "templates"
                ? "text-blue-400 border-b-2 border-blue-400 bg-blue-500/5"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Copy className="w-4 h-4" />
              Fra mal
            </span>
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "custom"
                ? "text-blue-400 border-b-2 border-blue-400 bg-blue-500/5"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Egendefinert
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === "templates" ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-400 mb-4">
                Velg en standardmal for å raskt legge til en økt:
              </p>
              
              {templates.map((template) => {
                const colors = FOCUS_COLORS[template.focus] || FOCUS_COLORS.TEK;
                
                return (
                  <button
                    key={template.id}
                    onClick={() => handleAddTemplate(template)}
                    disabled={isAdding}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 group ${
                      selectedTemplate?.id === template.id
                        ? `${colors.border} ${colors.bg} ring-2 ring-blue-500/50`
                        : "border-slate-700 hover:border-slate-600 hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                          <span className="font-medium text-slate-200">
                            {template.title}
                          </span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                            {template.focus}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {template.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-3.5 h-3.5" />
                            {template.exercises.length} øvelse{template.exercises.length !== 1 ? "r" : ""}
                          </span>
                        </div>
                        
                        {/* Exercise preview */}
                        {template.exercises.length > 0 && (
                          <div className="mt-2 text-xs text-slate-500">
                            {template.exercises.slice(0, 3).map(e => e.name).join(", ")}
                            {template.exercises.length > 3 && ` +${template.exercises.length - 3} flere`}
                          </div>
                        )}
                      </div>
                      
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        selectedTemplate?.id === template.id
                          ? "bg-blue-500 text-white"
                          : "bg-slate-800 text-slate-400 opacity-0 group-hover:opacity-100"
                      }`}>
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-400 mb-4">
                Opprett en egendefinert økt:
              </p>
              
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Tittel
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="F.eks. Teknikktrening"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                />
              </div>
              
              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Varighet (minutter)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={5}
                    max={240}
                    step={5}
                    value={customDuration}
                    onChange={(e) => setCustomDuration(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <span className="w-16 text-right text-slate-300 font-medium">
                    {customDuration} min
                  </span>
                </div>
              </div>
              
              {/* Focus */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Fokusområde
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {(["FYS", "TEK", "SLAG", "SPILL", "TURN"] as const).map((focus) => {
                    const colors = FOCUS_COLORS[focus];
                    return (
                      <button
                        key={focus}
                        onClick={() => setCustomFocus(focus)}
                        className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                          customFocus === focus
                            ? `${colors.bg} ${colors.text} ring-1 ${colors.border}`
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        {focus}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Add button */}
              <button
                onClick={handleAddCustom}
                disabled={isAdding || !customTitle.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {isAdding ? "Legger til..." : "Legg til økt"}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-700 bg-slate-900/50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Avbryt
          </button>
        </div>
      </div>
    </div>
  );
}
