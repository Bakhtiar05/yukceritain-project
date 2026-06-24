import type { Metadata } from 'next'
import Link from 'next/link'
import PostForm from '@/components/admin/PostForm'

export const metadata: Metadata = { title: 'Artikel Baru' }

export default function NewPostPage() {
  return (
    <div>
      <nav className="flex items-center gap-1.5 text-sm text-neutral-400 mb-4">
        <Link href="/admin" className="hover:text-blue-500">Dashboard</Link>
        <span>›</span>
        <span className="text-neutral-600">Artikel Baru</span>
      </nav>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Artikel Baru</h1>
      <PostForm />
    </div>
  )
}
