"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className,
}: SliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onValueChange([newValue]);
  };

  const percentage = ((value[0] - min) / (max - min)) * 100;

  return (
    <div className={cn("relative w-full h-5 flex items-center", className)}>
      <div className="absolute w-full h-1.5 bg-grey-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-black rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={handleChange}
        className="absolute w-full h-full opacity-0 cursor-pointer"
      />
      <div
        className="absolute w-4 h-4 bg-black rounded-full border-2 border-white shadow transition-transform hover:scale-110 pointer-events-none"
        style={{ left: `calc(${percentage}% - 8px)` }}
      />
    </div>
  );
}
