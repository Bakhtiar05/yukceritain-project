'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminHeader({ email }: { email: string }) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-neutral-900">YukceritaIN</h1>
        <span className="text-xs font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">Admin</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-neutral-400 hidden sm:block">{email}</span>
        <button onClick={handleLogout} className="text-sm font-medium text-neutral-500 hover:text-red-500 transition-colors">
          Logout
        </button>
      </div>
    </header>
  )
}
