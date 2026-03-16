import { requirePortalUser } from "@/lib/portal/auth";
import { Sidebar } from "@/components/portal/layout/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requirePortalUser();

  return (
    <div className="min-h-screen flex" style={{ background: "#FAFBFC" }}>
      <Sidebar user={user} />
      <main className="flex-1 ml-60 min-h-screen relative z-10 p-8">
        {children}
      </main>
    </div>
  );
}
