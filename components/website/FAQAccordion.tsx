"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const answerId = `faq-answer-${index}`;

  return (
    <div
      className={`border-b border-grey-200 transition-[border-color,background-color] duration-300 ${
        open ? "border-l-2 border-l-black pl-4 -ml-4 bg-grey-100/50" : "border-l-2 border-l-transparent pl-4 -ml-4"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 text-left group"
        aria-expanded={open}
        aria-controls={answerId}
      >
        <span className={`font-display text-base font-semibold pr-8 transition-colors ${
          open ? "text-black" : "text-grey-700 group-hover:text-black"
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
            className={`transition-[transform,color] duration-300 ${open ? "rotate-45 text-black" : "text-grey-400"}`}
            aria-hidden="true"
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
            <p className="text-sm text-grey-500 leading-relaxed pb-5 pr-12">
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
