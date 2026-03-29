// MAINTENANCE MODE — Original page backed up in page.original.tsx
// To restore: cp app/page.original.tsx app/page.tsx

import { MaintenancePage } from "@/components/website/MaintenancePage";

export default function HomePage() {
  return (
    <MaintenancePage
      title="Vi oppgraderer"
      message="Vi jobber med et helt nytt design og nye funksjoner. Vi er snart tilbake med en enda bedre opplevelse."
      showContactInfo={true}
    />
  );
}
