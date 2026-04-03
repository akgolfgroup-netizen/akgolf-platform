import Image from "next/image";

export function TestimonialCard({
  quote,
  name,
  role,
  photo,
}: {
  quote: string;
  name: string;
  role: string;
  photo?: string;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-card group flex flex-col h-full border-l-[3px] border-l-black">
      <svg width="24" height="24" viewBox="0 0 24 24" className="text-grey-300 mb-4 shrink-0 transition-[color,transform] duration-300 group-hover:text-black group-hover:scale-110" fill="currentColor">
        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
      </svg>
      <p className="text-sm leading-relaxed text-grey-500 flex-1 mb-6">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        {photo ? (
          <div className="w-9 h-9 rounded-full overflow-hidden relative shrink-0">
            <Image src={photo} alt={name} fill className="object-cover" sizes="36px" />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-grey-100 flex items-center justify-center shrink-0">
            <span className="font-mono text-[10px] text-grey-500">{initials}</span>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-black">{name}</p>
          <p className="text-xs text-grey-500">{role}</p>
        </div>
      </div>
    </div>
  );
}
