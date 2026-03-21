"use client";

import { useSyncExternalStore, useCallback } from "react";
import Link from "next/link";

const STORAGE_KEY = "akgolf_cookie_consent";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function CookieConsent() {
  const consent = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(STORAGE_KEY),
    () => "1", // Server: assume consent to avoid flash
  );

  const handleAccept = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "1");
    window.dispatchEvent(new Event("storage"));
  }, []);

  if (consent) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-40 bg-white rounded-2xl shadow-lg border border-ink-10 p-5">
      <p className="text-sm text-ink-60 mb-4">
        Vi bruker informasjonskapsler for å forbedre din opplevelse.
      </p>
      <div className="flex items-center gap-3">
        <button onClick={handleAccept} className="w-btn w-btn-primary text-sm !py-2 !px-5">
          Godta
        </button>
        <Link href="/personvern" className="text-sm text-ink-40 hover:text-ink-70 transition-colors">
          Les mer
        </Link>
      </div>
    </div>
  );
}
