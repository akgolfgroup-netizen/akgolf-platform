import { requirePortalUser } from "@/lib/portal/auth";
import { Sidebar } from "@/components/portal/layout/sidebar";
import { MobileHeader } from "@/components/portal/layout/mobile-header";
import { SidebarProvider } from "@/components/portal/layout/sidebar-context";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requirePortalUser();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-[var(--portal-bg)]">
        <Sidebar user={user} />
        <MobileHeader />
        <main className="flex-1 lg:ml-60 min-h-screen p-4 lg:p-8 pt-18 lg:pt-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
