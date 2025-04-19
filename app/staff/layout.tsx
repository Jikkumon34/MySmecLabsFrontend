// app/student/layout.tsx (Server Component)
import { requireAuth } from "@/lib/auth";
import DashboardLayout from "@/components/students/DashboardLayout";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await  requireAuth(["STAFF"]);
  
  return (
    <DashboardLayout role="staff"  username={user.username}>
      {children}
    </DashboardLayout>
  );
}
