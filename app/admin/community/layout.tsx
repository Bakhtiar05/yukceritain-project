import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth/roles";

export default async function AdminCommunityLayout({ children }: { children: React.ReactNode }) {
  const role = await getUserRole();

  // Only super_admin and admin_community can access this section
  if (role !== "super_admin" && role !== "admin_community") {
    redirect("/admin");
  }

  return <>{children}</>;
}
