export const metadata = {
  title: "Design Review | AK Golf Heritage Grid",
  description: "Review all screens for Heritage Grid design compliance",
};

export default function DesignReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb">
      <body className="min-h-screen bg-surface text-on-surface">
        {children}
      </body>
    </html>
  );
}
