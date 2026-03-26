"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const answerId = `faq-answer-${index}`;

  return (
    <div className="border-b border-ink-10">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 text-left group"
        aria-expanded={open}
        aria-controls={answerId}
      >
        <span className="font-display text-base font-semibold text-ink-80 pr-8 group-hover:text-ink-90 transition-colors">
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
            className={`text-ink-40 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={answerId}
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
      {items.map((item, index) => (
        <FAQItem key={item.q} q={item.q} a={item.a} index={index} />
      ))}
    </div>
  );
}
