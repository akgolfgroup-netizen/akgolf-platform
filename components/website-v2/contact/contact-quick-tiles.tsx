"use client";

import type { LucideIcon } from "lucide-react";
import { Mail, Phone, MessageCircle, Instagram } from "lucide-react";

interface Tile {
  Icon: LucideIcon;
  title: string;
  value: string;
  meta: string;
  href?: string;
}

const TILES: Tile[] = [
  {
    Icon: Mail,
    title: "E-post",
    value: "post@akgolf.no",
    meta: "Vi svarer innen 4 timer i åpningstid",
    href: "mailto:post@akgolf.no",
  },
  {
    Icon: Phone,
    title: "Telefon — Anders",
    value: "+47 909 67 995",
    meta: "Mandag–lørdag · 09:00–17:00",
    href: "tel:+4790967995",
  },
  {
    Icon: Phone,
    title: "Telefon — Markus",
    value: "+47 905 86 097",
    meta: "Mandag–fredag · 09:00–17:00",
    href: "tel:+4790586097",
  },
  {
    Icon: MessageCircle,
    title: "Direkte melding",
    value: "Skriv til oss",
    meta: "Vi følger opp samme dag",
    href: "#kontakt-skjema",
  },
  {
    Icon: Instagram,
    title: "Sosialt",
    value: "@akgolfacademy",
    meta: "DM på Instagram · svarer raskt",
    href: "https://www.instagram.com/akgolfacademy/",
  },
];

export function ContactQuickTiles() {
  return (
    <section className="px-10 pb-[30px] pt-[50px]">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TILES.slice(0, 4).map(({ Icon, title, value, meta, href }) => (
            <a
              key={title}
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noreferrer" : undefined}
              className="group flex flex-col gap-2.5 rounded-[22px] border-[1.5px] bg-white px-7 pb-7 pt-[26px] transition-all hover:-translate-y-[3px] hover:shadow-[0_18px_40px_rgba(10,31,24,0.06)]"
              style={{
                borderColor: "var(--akgolf-line-light, #E4EAE6)",
              }}
            >
              <div
                className="mb-1 grid h-11 w-11 place-items-center rounded-xl transition-colors"
                style={{
                  background: "rgba(0,88,64,0.08)",
                  color: "var(--akgolf-primary, #005840)",
                }}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h4
                className="m-0 text-[16px] font-bold tracking-[-0.01em]"
                style={{
                  color: "var(--akgolf-ink, #0A1F18)",
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                }}
              >
                {title}
              </h4>
              <div
                className="mt-1 text-[15px] font-bold"
                style={{ color: "var(--akgolf-primary, #005840)" }}
              >
                {value}
              </div>
              <div
                className="mt-auto border-t pt-3 text-[12px] leading-[1.5]"
                style={{
                  color: "var(--akgolf-muted, #5C6B62)",
                  borderColor: "var(--akgolf-line-light, #E4EAE6)",
                }}
              >
                {meta}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
