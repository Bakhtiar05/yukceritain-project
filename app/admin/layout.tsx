import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AdminHeader from './AdminHeader'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // PERBAIKAN: Jika belum login, tampilkan form login tanpa Header/Sidebar
  // Kita tidak menggunakan redirect karena sudah diurus oleh middleware.ts
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        {children}
      </div>
    )
  }

  // Jika sudah login, tampilkan Dashboard Admin secara utuh
  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminHeader email={user.email || ''} />

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 border-r border-neutral-200 bg-white min-h-[calc(100vh-64px)]">
          <nav className="p-4 space-y-1">
            <Link href="/admin" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-neutral-700 rounded-lg hover:bg-blue-50 hover:text-blue-500 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              Dashboard
            </Link>
            <Link href="/admin/editor" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-neutral-700 rounded-lg hover:bg-blue-50 hover:text-blue-500 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Artikel Baru
            </Link>
            <Link href="/" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-neutral-400 rounded-lg hover:bg-neutral-50 hover:text-neutral-600 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
              Kembali ke Situs
            </Link>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 md:p-8 max-w-5xl">
          {children}
        </main>
      </div>
    </div>
  )
}
