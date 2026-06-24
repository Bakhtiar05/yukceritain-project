import type { Metadata } from 'next'
import Link from 'next/link'
import AdminPostList from '@/components/admin/AdminPostList'
import { getAllPostsAdmin } from '@/lib/actions/posts'

export const metadata: Metadata = { title: 'Dashboard Admin' }

export default async function AdminDashboard() {
  const posts = await getAllPostsAdmin()
  const published = posts.filter(p => p.published).length
  const drafts = posts.length - published

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <Link href="/admin/editor" className="btn btn-primary text-sm">
          + Artikel Baru
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-2xl font-bold text-neutral-900">{posts.length}</p>
          <p className="text-sm text-neutral-400">Total Artikel</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-2xl font-bold text-green-600">{published}</p>
          <p className="text-sm text-neutral-400">Published</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-2xl font-bold text-neutral-500">{drafts}</p>
          <p className="text-sm text-neutral-400">Draft</p>
        </div>
      </div>

      <AdminPostList posts={posts} />
    </div>
  )
}
