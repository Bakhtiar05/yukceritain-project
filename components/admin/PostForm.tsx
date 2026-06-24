'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { Post } from '@/lib/types'
import { createPost, updatePost } from '@/lib/actions/posts'

// Dynamic import to avoid SSR issues with the Markdown editor
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

const categories = [
  { value: 'kecemasan', label: 'Kecemasan', color: '#2E86DE', bg: '#EBF4FF' },
  { value: 'selfcare', label: 'Self-Care', color: '#27AE60', bg: '#E8F8F0' },
  { value: 'mindfulness', label: 'Mindfulness', color: '#8E44AD', bg: '#F5EEF8' },
  { value: 'relasi', label: 'Relasi', color: '#E67E22', bg: '#FEF5E7' },
  { value: 'depresi', label: 'Depresi', color: '#2E4057', bg: '#E8ECF0' },
]

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

export default function PostForm({ post }: { post?: Post }) {
  const isEdit = !!post
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [content, setContent] = useState(post?.content || '')

  const selectedCat = categories.find(c => c.value === (post?.category || 'kecemasan')) || categories[0]

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!isEdit) setSlug(generateSlug(val))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = isEdit
      ? await updatePost(post!.id, formData)
      : await createPost(formData)

    if (result.success) {
      router.push('/admin')
      router.refresh()
    } else {
      setError(result.error || 'Terjadi kesalahan')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Main Content */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-5">
            <h3 className="font-semibold text-neutral-900">Konten Artikel</h3>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Judul *</label>
              <input
                name="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">/blog/</span>
                <input
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Ringkasan</label>
              <textarea
                name="excerpt"
                rows={3}
                defaultValue={post?.excerpt || ''}
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-y"
                placeholder="Ringkasan singkat artikel..."
              />
            </div>

            {/* Markdown Editor */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Konten (Markdown)</label>
              {/* Hidden input syncs the editor value to FormData */}
              <input type="hidden" name="content" value={content} />
              <div data-color-mode="light" className="rounded-lg overflow-hidden border border-neutral-200">
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || '')}
                  height={460}
                  preview="edit"
                  visibleDragbar={false}
                />
              </div>
              <p className="text-xs text-neutral-400 mt-1.5">
                Gunakan Markdown: **bold**, *italic*, ## Heading, [link](url), ![gambar](url)
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-5">
            <h3 className="font-semibold text-neutral-900">Info Penulis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Nama Penulis *</label>
                <input
                  name="author_name"
                  defaultValue={post?.author_name || ''}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Jabatan Penulis</label>
                <input
                  name="author_title"
                  defaultValue={post?.author_title || ''}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  placeholder="Psikolog Klinis"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-5">
            <h3 className="font-semibold text-neutral-900">Pengaturan</h3>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Kategori</label>
              <select
                name="category"
                defaultValue={post?.category || 'kecemasan'}
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Warna Tag</label>
              <input name="tag_color" type="color" defaultValue={post?.tag_color || selectedCat.color} className="w-full h-10 rounded-lg border border-neutral-200 cursor-pointer" />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Background Tag</label>
              <input name="tag_bg" type="color" defaultValue={post?.tag_bg || selectedCat.bg} className="w-full h-10 rounded-lg border border-neutral-200 cursor-pointer" />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Waktu Baca</label>
              <input
                name="read_time"
                defaultValue={post?.read_time || ''}
                placeholder="5 menit baca"
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">URL Gambar Cover</label>
              <input
                name="cover_image"
                defaultValue={post?.cover_image || ''}
                placeholder="/assets/blog_anxiety.png"
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="text-sm font-medium text-neutral-700">Artikel Pilihan</label>
              <label className="relative inline-flex items-center cursor-pointer">

                <input
                  type="checkbox"
                  name="is_featured"
                  value="true"
                  defaultChecked={post?.is_featured || false}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-blue-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </label>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="text-sm font-medium text-neutral-700">Publikasikan</label>
              <label className="relative inline-flex items-center cursor-pointer">

                <input
                  type="checkbox"
                  name="published"
                  value="true"
                  defaultChecked={post?.published || false}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-blue-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center py-3 disabled:opacity-60">
              {loading ? 'Menyimpan...' : isEdit ? 'Update Artikel' : 'Publikasikan'}
            </button>
            <Link href="/admin" className="btn btn-outline w-full justify-center py-3 block text-center">
              Batal
            </Link>
          </div>
        </div>
      </div>
    </form>
  )
}
