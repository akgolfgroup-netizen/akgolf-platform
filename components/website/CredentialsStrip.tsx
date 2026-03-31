"use client";

import { Fragment } from "react";
import { CREDENTIALS } from "@/lib/website-constants";

function Divider() {
  return (
    <div className="hidden md:flex items-center justify-center shrink-0">
      <div className="w-px h-16 bg-gradient-to-b from-transparent via-grey-300 to-transparent" />
    </div>
  );
}

export function CredentialsStrip() {
  return (
    <section className="relative bg-grey-100 py-14 md:py-20 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-grey-200 opacity-50 rounded-full blur-3xl pointer-events-none" />

      <div className="w-container relative">
        <div className="flex flex-wrap justify-center items-center gap-y-8">
          {CREDENTIALS.map((cred, i) => (
            <Fragment key={cred.label}>
              <div className="text-center px-4 md:px-8">
                <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-grey-500">
                  {cred.label}
                </div>
              </div>
              {i < CREDENTIALS.length - 1 && <Divider />}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
