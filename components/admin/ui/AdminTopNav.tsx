'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

export default function AdminTopNav({ email }: { email: string }) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-slate-900">YukceritaIN</h1>
        <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">Admin System</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end mr-2">
          <span className="text-xs font-semibold text-slate-700">Administrator</span>
          <span className="text-[11px] text-slate-400">{email}</span>
        </div>
        <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Logout">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
