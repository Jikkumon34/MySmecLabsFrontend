// app/student/layout.tsx (Server Component)
import { requireAuth } from "@/lib/auth";
import DashboardLayout from "@/components/students/DashboardLayout";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth(["ADMIN"]);
  return (
    <DashboardLayout role="admin"   username={user.username}>
      {children}
    </DashboardLayout>
  );
}
