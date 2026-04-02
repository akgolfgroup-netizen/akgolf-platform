"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

interface BookingUpsellCardProps {
  userName?: string | null;
  bookingPrice: number;
  isLoggedIn: boolean;
}

const PERFORMANCE_PRICE = 1600;
const SESSIONS_PER_MONTH = 2;

export function BookingUpsellCard({
  userName,
  bookingPrice,
  isLoggedIn,
}: BookingUpsellCardProps) {
  // Calculate potential savings
  const singleSessionPrice = bookingPrice;
  const monthlyValue = singleSessionPrice * SESSIONS_PER_MONTH;
  const savings = monthlyValue - PERFORMANCE_PRICE;
  const savingsPercent = Math.round((savings / monthlyValue) * 100);

  if (savings <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-gradient-to-br from-grey-50 to-white border border-grey-200 rounded-2xl p-6 mt-6"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-black rounded-xl flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-grey-900">
              Spar {savingsPercent}% med Performance
            </h3>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Populaert
            </span>
          </div>
          <p className="text-grey-500 text-sm mb-4">
            {userName ? `${userName}, f` : "F"}a mer ut av treningen med fast
            oppfolging og personlig treningsplan.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-grey-600">
              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>2 x 20 min okter/mnd</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-grey-600">
              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>TrackMan-analyse hver okt</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-grey-600">
              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>Personlig treningsplan</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-grey-600">
              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>Full portal-tilgang</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-grey-900">
                {PERFORMANCE_PRICE.toLocaleString("nb-NO")} kr
              </span>
              <span className="text-grey-500 text-sm">/mnd</span>
              <span className="text-grey-400 text-sm line-through">
                {monthlyValue.toLocaleString("nb-NO")} kr
              </span>
            </div>

            <Link
              href={isLoggedIn ? "/portal/apper" : "/portal/login?redirect=/portal/apper"}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black text-white font-medium rounded-full hover:bg-grey-800 transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              Oppgrader na
            </Link>
          </div>

          <p className="text-xs text-grey-400 mt-3">
            Ingen binding. Avslutt nar som helst.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
