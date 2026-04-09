"use client";

import { useSyncExternalStore, useCallback } from "react";
import Link from "next/link";

const STORAGE_KEY = "akgolf_cookie_consent_v2";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function CookieConsent() {
  const consent = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(STORAGE_KEY),
    () => "1",
  );

  const handleAccept = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "1");
    window.dispatchEvent(new Event("storage"));
  }, []);

  if (consent) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 bg-white rounded-2xl shadow-lg border border-[#E8E8ED] p-5">
      <p className="text-sm text-[#6E6E73] mb-4">
        Vi bruker informasjonskapsler for å forbedre din opplevelse.
      </p>
      <div className="flex items-center gap-3">
        <button 
          onClick={handleAccept} 
          className="bg-[#154212] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1B4332] transition-colors"
        >
          Godta
        </button>
        <Link 
          href="/personvern" 
          className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
        >
          Les mer
        </Link>
      </div>
    </div>
  );
}
