// app/student/layout.tsx (Server Component)
import { requireAuth } from "@/lib/auth";
import DashboardLayout from "@/components/students/DashboardLayout";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await  requireAuth(["STUDENT"]);
  
  return (
    <DashboardLayout role="student"  username={user.username}>
      {children}
    </DashboardLayout>
  );
}
