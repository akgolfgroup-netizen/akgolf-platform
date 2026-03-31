import { RevealOnScroll } from "./RevealOnScroll";
import { ImagePlaceholder } from "./ImagePlaceholder";

export function MethodRow({
  number,
  title,
  subtitle,
  description,
  image,
  reversed = false,
}: {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  reversed?: boolean;
}) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start ${reversed ? "lg:direction-rtl" : ""}`}>
      <RevealOnScroll direction={reversed ? "right" : "left"} className={reversed ? "lg:order-2" : ""}>
        <div>
          <span className="font-mono text-xs text-grey-400 tracking-[0.2em]">{number}</span>
          <h3 className="w-heading-md mt-2 mb-2">{title}</h3>
          <p className="text-sm text-black font-medium mb-4">{subtitle}</p>
          <p className="leading-relaxed text-grey-500">{description}</p>
        </div>
      </RevealOnScroll>

      <RevealOnScroll direction={reversed ? "left" : "right"} className={reversed ? "lg:order-1" : ""}>
        <ImagePlaceholder aspect="4/3" label={title} src={image} />
      </RevealOnScroll>
    </div>
  );
}
