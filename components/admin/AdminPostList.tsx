'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Post } from '@/lib/types'
import { deletePost } from '@/lib/actions/posts'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminPostList({ posts }: { posts: Post[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus artikel "${title}"? Tindakan ini tidak bisa dibatalkan.`)) return
    setDeleting(id)
    await deletePost(id)
    router.refresh()
    setDeleting(null)
  }

  if (!posts.length) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-neutral-200">
        <p className="text-4xl mb-3">📝</p>
        <p className="text-neutral-500 mb-4">Belum ada artikel</p>
        <Link href="/admin/editor" className="btn btn-primary text-sm">Buat Artikel Baru</Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-x-auto">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Judul</th>
            <th>Kategori</th>
            <th>Status</th>
            <th>Tanggal</th>
            <th className="text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>
                <p className="font-semibold text-neutral-900 line-clamp-1">{post.title}</p>
                <p className="text-xs text-neutral-400 mt-0.5">/blog/{post.slug}</p>
              </td>
              <td>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ color: post.tag_color || '#2E86DE', backgroundColor: post.tag_bg || '#EBF4FF' }}
                >
                  {post.category}
                </span>
              </td>
              <td>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  post.published ? 'bg-green-50 text-green-600' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </td>
              <td className="text-sm text-neutral-500 whitespace-nowrap">{formatDate(post.created_at)}</td>
              <td className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/editor/${post.id}`} className="text-sm font-medium text-blue-500 hover:text-blue-600">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={deleting === post.id}
                    className="text-sm font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
                  >
                    {deleting === post.id ? '...' : 'Hapus'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
