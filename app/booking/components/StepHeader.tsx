import { SectionLabel } from "@/components/website/SectionLabel";

interface Props {
  eyebrow: string;
  heading: string;
  description: string;
}

export function StepHeader({ eyebrow, heading, description }: Props) {
  return (
    <div className="mb-8">
      <SectionLabel>{eyebrow}</SectionLabel>
      <h2 className="w-heading-md mt-4 mb-2">{heading}</h2>
      <p className="text-grey-500">{description}</p>
    </div>
  );
}
