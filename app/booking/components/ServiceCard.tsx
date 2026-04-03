"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Star } from "lucide-react";

interface ServiceType {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
}

interface Props {
  service: ServiceType;
  isRecommended: boolean;
  index: number;
}

export function ServiceCard({ service, isRecommended, index }: Props) {
  if (isRecommended) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
      >
        <Link
          href={`/booking/new?serviceTypeId=${service.id}`}
          className="group block bg-black text-white rounded-[20px] p-6 hover:bg-black/90 transition-colors"
        >
          <div className="flex items-center gap-2 mb-3">
            <Star size={14} className="text-white/70" />
            <span className="text-xs font-medium uppercase tracking-wider text-white/70">
              Anbefalt
            </span>
          </div>

          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">{service.name}</h3>
              {service.description && (
                <p className="text-sm text-white/70 line-clamp-2">
                  {service.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-3 text-sm text-white/60">
                <Clock size={14} />
                <span>{service.duration} min</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xl font-bold">
                {service.price.toLocaleString("nb-NO")} kr
              </div>
              <div className="inline-flex items-center gap-1 mt-2 text-sm text-white/70 group-hover:gap-2 transition-[gap]">
                Velg
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link
        href={`/booking/new?serviceTypeId=${service.id}`}
        className="group flex items-center justify-between bg-grey-100 rounded-[16px] p-4 hover:bg-grey-200 transition-colors"
      >
        <div>
          <h4 className="font-semibold text-black">{service.name}</h4>
          <div className="flex items-center gap-2 text-sm text-grey-500">
            <Clock size={14} />
            <span>{service.duration} min</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-bold text-black">
            {service.price.toLocaleString("nb-NO")} kr
          </span>
          <ArrowRight size={16} className="text-grey-400 group-hover:text-black transition-colors" />
        </div>
      </Link>
    </motion.div>
  );
}
