// MAINTENANCE MODE — Original page backed up in page.original.tsx
// To restore: cp app/booking/page.original.tsx app/booking/page.tsx

import { MaintenancePage } from "@/components/website/MaintenancePage";

export default function BookingPage() {
  return (
    <MaintenancePage
      title="Booking er midlertidig utilgjengelig"
      message="Vi oppgraderer booking-systemet vart. For a booke time i mellomtiden, ta kontakt med oss direkte."
      showContactInfo={true}
    />
  );
}
