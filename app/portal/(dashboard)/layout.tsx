import { requirePortalUser } from "@/lib/portal/auth";
import { PlayerHQSidebar } from "@/components/portal/playerhq/PlayerHQSidebar";
import { MobileHeader } from "@/components/portal/layout/mobile-header";
import { SidebarProvider } from "@/components/portal/layout/sidebar-context";
import { TrialBannerWrapper } from "@/components/portal/layout/trial-banner-wrapper";
import { PlayerHQTrialBanner } from "@/components/portal/playerhq-trial-banner";
import { DashboardProviders } from "@/components/portal/layout/dashboard-providers";
import { LenisProvider } from "@/components/portal/layout/lenis-provider";
import { ServiceWorkerRegistration } from "@/components/portal/layout/service-worker-registration";
import { getPlayerHQAccess } from "@/lib/portal/playerhq-access";
import type { SubscriptionTier, SubscriptionStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requirePortalUser();
  const playerhqStatus = getPlayerHQAccess({
    subscriptionTier: user.subscriptionTier,
    playerhqAccessUntil: user.playerhqAccessUntil,
    playerhqStripeSubscriptionId: user.playerhqStripeSubscriptionId,
  });

  return (
    <SidebarProvider>
      <DashboardProviders
        currentTier={user.subscriptionTier as SubscriptionTier}
        logCount={user.portalMonthlyLogCount}
      >
        <LenisProvider>
          <div className="min-h-screen flex bg-surface relative">
            <PlayerHQSidebar user={user} />
            <MobileHeader />
            <main className="flex-1 min-h-screen p-4 lg:p-8 pt-18 lg:pt-8 relative z-10">
              <PlayerHQTrialBanner status={playerhqStatus} />
              <TrialBannerWrapper
                subscriptionStatus={user.subscriptionStatus as SubscriptionStatus | null}
                subscriptionTier={user.subscriptionTier as SubscriptionTier}
                trialEndsAt={user.subscriptionExpiresAt}
              />
              {children}
            </main>
          </div>
          <ServiceWorkerRegistration />
        </LenisProvider>
      </DashboardProviders>
    </SidebarProvider>
  );
}
