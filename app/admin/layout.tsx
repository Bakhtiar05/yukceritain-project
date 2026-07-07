import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  }
}
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/auth/roles'
import AdminSidebar from '@/components/admin/ui/AdminSidebar'
import AdminTopNav from '@/components/admin/ui/AdminTopNav'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const role = await getUserRole()

  if (!user) {
    // Middleware sudah mengurus proteksi route, jadi jika user tidak ada,
    // berarti mereka sedang berada di halaman /admin/login.
    // Kita cukup mengembalikan children tanpa menampilkan sidebar dan topnav.
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminTopNav email={user.email || ''} />
      <div className="flex">
        <AdminSidebar role={role} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
