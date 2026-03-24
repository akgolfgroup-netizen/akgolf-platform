import { requirePortalUser } from "@/lib/portal/auth";
import { Sidebar } from "@/components/portal/layout/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requirePortalUser();

  return (
    <div className="min-h-screen flex" style={{ background: "#0A1929" }}>
      <Sidebar user={user} />
      <main className="flex-1 ml-60 min-h-screen p-8">
        {children}
      </main>
    </div>
  );
}
