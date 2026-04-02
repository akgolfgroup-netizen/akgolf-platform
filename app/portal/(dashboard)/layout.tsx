import { requirePortalUser } from "@/lib/portal/auth";
import { PremiumSidebar } from "@/components/portal/layout/premium-sidebar";
import { MobileHeader } from "@/components/portal/layout/mobile-header";
import { SidebarProvider } from "@/components/portal/layout/sidebar-context";
import { TrialBannerWrapper } from "@/components/portal/layout/trial-banner-wrapper";
import { DashboardProviders } from "@/components/portal/layout/dashboard-providers";
import type { SubscriptionTier, SubscriptionStatus } from "@prisma/client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requirePortalUser();

  return (
    <SidebarProvider>
      <DashboardProviders
        currentTier={user.subscriptionTier as SubscriptionTier}
        logCount={user.portalMonthlyLogCount}
      >
        <div className="min-h-screen flex bg-[#F5F5F7]">
          <PremiumSidebar user={user} />
          <MobileHeader />
          <main className="flex-1 lg:ml-64 min-h-screen p-4 lg:p-8 pt-18 lg:pt-8">
            <TrialBannerWrapper
              subscriptionStatus={user.subscriptionStatus as SubscriptionStatus | null}
              subscriptionTier={user.subscriptionTier as SubscriptionTier}
              trialEndsAt={user.subscriptionExpiresAt}
            />
            {children}
          </main>
        </div>
      </DashboardProviders>
    </SidebarProvider>
  );
}
