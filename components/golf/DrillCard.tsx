import React from 'react';
import { Clock, Target, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrillCardProps {
  name: string;
  description: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  focus: string;
  completed?: boolean;
  onComplete?: () => void;
}

export const DrillCard: React.FC<DrillCardProps> = ({
  name,
  description,
  duration,
  difficulty,
  focus,
  completed = false,
  onComplete,
}) => {
  const difficultyStyles = {
    easy: 'bg-[#16A34A]/20 text-[#16A34A]',
    medium: 'bg-[#D4AF37]/20 text-[#D4AF37]',
    hard: 'bg-[#EF4444]/20 text-[#EF4444]',
  };

  const difficultyLabels = {
    easy: 'Lett',
    medium: 'Middels',
    hard: 'Krevende',
  };

  return (
    <div className={cn(
      "bg-[#1E293B] rounded-xl p-5 border-l-4 transition-all duration-200",
      completed ? 'border-l-[#16A34A] opacity-70' : 'border-l-[#D4AF37]'
    )}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className={cn("font-semibold text-lg", completed ? 'text-white/50 line-through' : 'text-white')}>
            {name}
          </h4>
          <p className="text-sm text-white/50 mt-1">{focus}</p>
        </div>
        <button
          onClick={onComplete}
          className={cn(
            "p-2 rounded-full transition-colors",
            completed 
              ? 'text-[#16A34A] hover:text-[#16A34A]/80' 
              : 'text-white/30 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10'
          )}
        >
          {completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
        </button>
      </div>

      <p className="text-white/70 text-sm mb-4">{description}</p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-white/50 text-sm">
          <Clock size={14} />
          <span>{duration}</span>
        </div>
        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", difficultyStyles[difficulty])}>
          {difficultyLabels[difficulty]}
        </span>
        <div className="flex items-center gap-1.5 text-white/50 text-sm">
          <Target size={14} />
          <span>{focus}</span>
        </div>
      </div>
    </div>
  );
};
