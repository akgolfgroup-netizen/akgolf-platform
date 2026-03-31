"use client";

const ITEMS = [
  "Evidensbasert trening",
  "Individuell coaching",
  "Teknologidrevet analyse",
  "Personlig oppfølging",
  "Skreddersydde planer",
  "Mental styrke",
  "Teknisk presisjon",
  "Profesjonelt miljø",
];

export function Marquee() {
  return (
    <div className="overflow-hidden bg-grey-100 border-y border-grey-200 py-4 select-none">
      <div className="w-animate-marquee">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="flex items-center shrink-0 mx-8 md:mx-12">
            <span className="w-1.5 h-1.5 rounded-full bg-black mr-3" />
            <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-grey-500 whitespace-nowrap">
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
