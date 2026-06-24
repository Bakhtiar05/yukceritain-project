import Link from 'next/link'
import type { Post } from '@/lib/types'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function ArticleHero({ post }: { post: Post }) {
  return (
    <section className="bg-gradient-to-b from-neutral-50 to-white border-b border-neutral-200" style={{ paddingTop: 'calc(72px + 3px + 40px)' }}>
      <div className="max-w-[860px] mx-auto px-6 pb-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[0.82rem] text-neutral-400 mb-6">
          <Link href="/" className="hover:text-blue-500 transition-colors">Beranda</Link>
          <span>›</span>
          <Link href="/blog" className="hover:text-blue-500 transition-colors">Blog</Link>
          <span>›</span>
          <span className="text-neutral-500 truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Tag & Read Time */}
        <div className="flex items-center gap-3 mb-5">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ color: post.tag_color || '#2E86DE', backgroundColor: post.tag_bg || '#EBF4FF' }}
          >
            {post.category}
          </span>
          {post.read_time && (
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {post.read_time}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display text-[clamp(1.9rem,4vw,2.8rem)] font-bold text-neutral-900 leading-tight tracking-[-0.02em] mb-5">
          {post.title}
        </h1>

        {/* Lead */}
        {post.excerpt && (
          <p className="text-neutral-600 text-[1.12rem] leading-relaxed border-l-[3px] border-blue-200 pl-5 mb-6 max-w-xl">
            {post.excerpt}
          </p>
        )}

        {/* Byline */}
        <div className="flex flex-wrap items-center gap-4 pt-5 border-t border-neutral-200">
          <div>
            <p className="text-sm font-bold text-neutral-900">{post.author_name}</p>
            {post.author_title && <p className="text-xs text-neutral-400">{post.author_title}</p>}
          </div>
          <div className="w-px h-8 bg-neutral-200" />
          <div className="text-xs text-neutral-400">
            <p>{formatDate(post.created_at)}</p>
            {post.updated_at !== post.created_at && (
              <p>Diperbarui {formatDate(post.updated_at)}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
