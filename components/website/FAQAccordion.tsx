"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border-b border-ink-10 transition-all duration-300 ${
        open ? "border-l-2 border-l-gold pl-4 -ml-4 bg-gold/[0.02]" : "border-l-2 border-l-transparent pl-4 -ml-4"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 text-left group"
        aria-expanded={open}
      >
        <span className={`font-display text-base font-semibold pr-8 transition-colors ${
          open ? "text-ink-90" : "text-ink-80 group-hover:text-ink-90"
        }`}>
          {q}
        </span>
        <span className="shrink-0 w-6 h-6 flex items-center justify-center">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-all duration-300 ${open ? "rotate-45 text-gold" : "text-ink-40"}`}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-ink-50 leading-relaxed pb-5 pr-12">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQAccordion({
  items,
}: {
  items: readonly { readonly q: string; readonly a: string }[];
}) {
  return (
    <div>
      {items.map((item) => (
        <FAQItem key={item.q} q={item.q} a={item.a} />
      ))}
    </div>
  );
}
