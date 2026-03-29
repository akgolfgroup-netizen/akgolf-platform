import { APPLICATION_STEPS } from "@/lib/website-constants";
import { StaggerContainer, StaggerItem } from "./RevealOnScroll";

export function ProcessSteps() {
  return (
    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {APPLICATION_STEPS.map((step) => (
        <StaggerItem key={step.step}>
          <div className="w-card h-full">
            <span className="font-mono text-2xl font-medium text-black">{step.step}</span>
            <h4 className="font-display text-base font-semibold text-black mt-3 mb-2">{step.title}</h4>
            <p className="text-sm text-grey-500 leading-relaxed">{step.description}</p>
          </div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
