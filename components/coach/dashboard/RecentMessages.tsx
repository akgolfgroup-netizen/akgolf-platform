import { Mail, Instagram, MessageCircle, Phone, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";

// Channel type - vil erstattes av Prisma type når modellen er opprettet
type Channel = "EMAIL" | "INSTAGRAM" | "MESSENGER" | "WHATSAPP" | "IMESSAGE";

const channelIcons: Record<Channel, React.ReactNode> = {
  EMAIL: <Mail className="h-4 w-4" />,
  INSTAGRAM: <Instagram className="h-4 w-4" />,
  MESSENGER: <MessageCircle className="h-4 w-4" />,
  WHATSAPP: <Phone className="h-4 w-4" />,
  IMESSAGE: <MessageSquare className="h-4 w-4" />,
};

const channelColors: Record<Channel, string> = {
  EMAIL: "bg-red-500",
  INSTAGRAM: "bg-pink-500",
  MESSENGER: "bg-blue-500",
  WHATSAPP: "bg-green-500",
  IMESSAGE: "bg-emerald-500",
};

export interface Message {
  id: string;
  channel: Channel;
  senderName: string;
  content: string;
  receivedAt: Date;
  status: string;
}

interface RecentMessagesProps {
  messages: Message[];
}

export function RecentMessages({ messages }: RecentMessagesProps) {
  if (messages.length === 0) {
    return (
      <div className="rounded-xl bg-white border border-[var(--color-grey-200)]">
        <div className="p-4 border-b border-[var(--color-grey-200)]">
          <h3 className="font-semibold text-[var(--color-grey-900)]">Nylige meldinger</h3>
        </div>
        <div className="p-8 text-center">
          <p className="text-[var(--color-grey-400)]">Ingen meldinger enda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white border border-[var(--color-grey-200)]">
      <div className="p-4 border-b border-[var(--color-grey-200)]">
        <h3 className="font-semibold text-[var(--color-grey-900)]">Nylige meldinger</h3>
      </div>
      <div className="divide-y divide-[var(--color-grey-200)]">
        {messages.map((message) => (
          <div
            key={message.id}
            className="p-4 hover:bg-[var(--color-grey-100)] transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div
                className={`rounded-lg p-2 ${channelColors[message.channel]}`}
              >
                {channelIcons[message.channel]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[var(--color-grey-900)] truncate">
                    {message.senderName}
                  </p>
                  <span className="text-xs text-[var(--color-grey-500)]">
                    {formatDistanceToNow(message.receivedAt, {
                      addSuffix: true,
                      locale: nb,
                    })}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-grey-400)] truncate mt-1">
                  {message.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
