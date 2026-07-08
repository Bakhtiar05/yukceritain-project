import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth/roles";

export default async function AdminEventsLayout({ children }: { children: React.ReactNode }) {
  const role = await getUserRole();

  // Only super_admin and admin_events can access this section
  if (role !== "super_admin" && role !== "admin_events") {
    redirect("/admin");
  }

  return <>{children}</>;
}
