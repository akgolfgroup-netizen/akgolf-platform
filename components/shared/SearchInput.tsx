"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Sok...",
  debounceMs = 300,
  className,
}: SearchInputProps) {
  const [internal, setInternal] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    setInternal(value);
  }, [value]);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (internal !== value) onChange(internal);
    }, debounceMs);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [internal, debounceMs, onChange, value]);

  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9C9990]"
        strokeWidth={1.75}
      />
      <Input
        value={internal}
        onChange={(e) => setInternal(e.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-[10px] border-[#E5E3DD] bg-white pl-9 pr-9 text-sm text-[#0A1F18] placeholder:text-[#9C9990] focus-visible:border-[#005840] focus-visible:ring-[#005840]/20"
      />
      {internal && (
        <button
          type="button"
          onClick={() => { setInternal(""); onChange(""); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C9990] hover:text-[#5E5C57]"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
}
