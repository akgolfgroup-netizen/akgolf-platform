import React from 'react';
import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  score: number;
  par?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  par,
  size = 'md',
  showLabel = true,
}) => {
  const diff = par ? score - par : 0;
  
  // Bestem farge basert på score vs par
  let colorClass = 'text-white';
  let bgClass = 'bg-[#334155]';
  let label = 'Par';
  
  if (diff < 0) {
    // Under par (birdie eller bedre)
    colorClass = 'text-[#3B82F6]'; // Birdie blå
    bgClass = 'bg-[#3B82F6]/20';
    label = diff === -1 ? 'Birdie' : diff === -2 ? 'Eagle' : diff === -3 ? 'Albatross' : 'Ace';
  } else if (diff > 0) {
    // Over par
    if (diff === 1) {
      colorClass = 'text-[#F97316]'; // Bogey oransje
      bgClass = 'bg-[#F97316]/20';
      label = 'Bogey';
    } else {
      colorClass = 'text-[#EF4444]'; // Dobbelt+ rød
      bgClass = 'bg-[#EF4444]/20';
      label = diff === 2 ? 'Dobbel' : 'Trippel';
    }
  } else {
    // Par
    colorClass = 'text-white';
    bgClass = 'bg-white/10';
    label = 'Par';
  }

  const sizes = {
    sm: { container: 'w-12 h-12', score: 'text-xl', label: 'text-xs' },
    md: { container: 'w-16 h-16', score: 'text-2xl', label: 'text-sm' },
    lg: { container: 'w-20 h-20', score: 'text-3xl', label: 'text-base' },
    xl: { container: 'w-24 h-24', score: 'text-4xl', label: 'text-lg' },
  };

  return (
    <div className="flex flex-col items-center">
      <div className={cn(
        "rounded-full flex items-center justify-center font-bold",
        bgClass,
        sizes[size].container
      )}>
        <span className={cn(colorClass, sizes[size].score)}>
          {score}
        </span>
      </div>
      {showLabel && (
        <span className={cn("mt-1 font-medium", colorClass, sizes[size].label)}>
          {label}
        </span>
      )}
    </div>
  );
};

// Simplified version for lists
export const ScoreBadge: React.FC<{ score: number; par?: number }> = ({ score, par }) => {
  const diff = par ? score - par : 0;
  
  if (diff < 0) {
    return <span className="px-2 py-0.5 rounded bg-[#3B82F6]/20 text-[#3B82F6] text-sm font-medium">{score}</span>;
  } else if (diff === 0) {
    return <span className="px-2 py-0.5 rounded bg-white/10 text-white text-sm font-medium">{score}</span>;
  } else if (diff === 1) {
    return <span className="px-2 py-0.5 rounded bg-[#F97316]/20 text-[#F97316] text-sm font-medium">{score}</span>;
  } else {
    return <span className="px-2 py-0.5 rounded bg-[#EF4444]/20 text-[#EF4444] text-sm font-medium">{score}</span>;
  }
};
