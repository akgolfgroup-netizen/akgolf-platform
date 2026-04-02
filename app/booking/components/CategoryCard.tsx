"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { CategoryConfig } from "@/lib/booking-config";

interface Props {
  category: CategoryConfig;
  index: number;
}

export function CategoryCard({ category, index }: Props) {
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/booking/${category.slug}`}
        className="group flex flex-col h-full bg-white rounded-[20px] p-6 border border-grey-200 hover:border-grey-300 hover:shadow-lg transition-all duration-300"
      >
        <div className="w-12 h-12 rounded-xl bg-grey-100 flex items-center justify-center mb-4 group-hover:bg-black transition-colors">
          <Icon
            size={24}
            className="text-grey-500 group-hover:text-white transition-colors"
          />
        </div>

        <h3 className="text-lg font-semibold text-black mb-1">
          {category.name}
        </h3>

        <p className="text-sm text-grey-500 mb-4 flex-1">
          {category.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-grey-400">
            {category.priceRange}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-black group-hover:gap-2 transition-all">
            Velg
            <ArrowRight size={16} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
