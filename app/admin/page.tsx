import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth/roles";
import { LayoutDashboard } from "lucide-react";

export default async function AdminRootPage() {
  const role = await getUserRole();

  if (role === "admin_artikel") {
    redirect("/admin/artikel");
  }

  if (role === "admin_konseling") {
    redirect("/admin/konseling");
  }

  if (role === "admin_community") {
    redirect("/admin/community");
  }

  if (role === "admin_events") {
    redirect("/admin/events");
  }

  // If super_admin (or null, though null shouldn't happen if they are logged in and have a role)
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-blue-500" />
          Dashboard Super Admin
        </h1>
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center text-neutral-500">
        <h2 className="text-lg font-semibold text-neutral-800 mb-2">Selamat Datang, Super Admin</h2>
        <p>Anda memiliki akses penuh ke seluruh manajemen sistem.</p>
        <p className="text-sm mt-4 max-w-md mx-auto">
          Gunakan menu di sebelah kiri untuk mengelola Artikel atau meninjau Permohonan Konseling.
        </p>
      </div>
    </div>
  );
}
