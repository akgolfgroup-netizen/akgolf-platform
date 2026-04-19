"use client";


import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { Instagram } from "lucide-react";

export type Channel =
  | "EMAIL"
  | "INSTAGRAM"
  | "MESSENGER"
  | "WHATSAPP"
  | "IMESSAGE";

const channels: {
  value: Channel | "ALL";
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    value: "ALL",
    label: "Alle",
    icon: <Icon name="inbox" className="h-4 w-4" />,
    color: "bg-[var(--color-grey-200)]",
  },
  {
    value: "EMAIL",
    label: "E-post",
    icon: <Icon name="mail" className="h-4 w-4" />,
    color: "bg-[var(--color-error)]",
  },
  {
    value: "INSTAGRAM",
    label: "Instagram",
    icon: <Instagram className="h-4 w-4" />,
    color: "bg-pink-500",
  },
  {
    value: "MESSENGER",
    label: "Messenger",
    icon: <Icon name="chat_bubble" className="h-4 w-4" />,
    color: "bg-blue-500",
  },
  {
    value: "WHATSAPP",
    label: "WhatsApp",
    icon: <Icon name="phone" className="h-4 w-4" />,
    color: "bg-[var(--color-brand)]",
  },
  {
    value: "IMESSAGE",
    label: "iMessage",
    icon: <Icon name="chat" className="h-4 w-4" />,
    color: "bg-[var(--color-brand)]",
  },
];

interface ChannelFilterProps {
  selected: Channel | "ALL";
  onChange: (channel: Channel | "ALL") => void;
  counts: Record<Channel | "ALL", number>;
}

export function ChannelFilter({
  selected,
  onChange,
  counts,
}: ChannelFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {channels.map((channel) => (
        <button
          key={channel.value}
          onClick={() => onChange(channel.value)}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            selected === channel.value
              ? "bg-[var(--color-black)] text-white"
              : "bg-white border border-[var(--color-grey-200)] text-[var(--color-grey-400)] hover:bg-[var(--color-grey-100)] hover:text-[var(--color-grey-900)]"
          )}
        >
          <span className={cn("rounded p-1 text-white", channel.color)}>
            {channel.icon}
          </span>
          {channel.label}
          {counts[channel.value] > 0 && (
            <span className="ml-1 rounded-full bg-[var(--color-error)] px-2 py-0.5 text-xs text-white">
              {counts[channel.value]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
