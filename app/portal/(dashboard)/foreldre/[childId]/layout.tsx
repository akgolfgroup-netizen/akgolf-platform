import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { canViewPlayerData } from "@/lib/portal/parent/relations";

export const dynamic = "force-dynamic";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ childId: string }>;
}

export default async function ChildDetailLayout({ children, params }: LayoutProps) {
  const { childId } = await params;
  const user = await requirePortalUser();

  // RBAC: må være barnet selv, ADMIN/INSTRUCTOR, eller koblet forelder
  const allowed = await canViewPlayerData(user.id, childId, user.role);
  if (!allowed) {
    redirect("/portal/foreldre");
  }

  const child = await prisma.user.findUnique({
    where: { id: childId },
    select: { id: true, name: true, email: true },
  });
  if (!child) {
    notFound();
  }

  const tabs = [
    { href: `/portal/foreldre/${childId}/trening`, label: "Trening" },
    { href: `/portal/foreldre/${childId}/turneringer`, label: "Turneringer" },
    { href: `/portal/foreldre/${childId}/betalinger`, label: "Betalinger" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/portal/foreldre"
          className="text-sm text-on-surface-variant hover:text-on-surface"
        >
          ← Tilbake til oversikt
        </Link>
        <h1 className="text-2xl font-bold text-on-surface mt-2">
          {child.name ?? "(uten navn)"}
        </h1>
        <p className="text-sm text-on-surface-variant">{child.email}</p>
      </div>

      <nav className="flex gap-2 mb-6 border-b border-outline-variant/30">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container rounded-t-lg"
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
