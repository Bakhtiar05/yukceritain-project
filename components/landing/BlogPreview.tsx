import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/lib/types'

const categoryEmoji: Record<string, string> = {
  kecemasan: '😰',
  selfcare: '🌿',
  mindfulness: '💆',
  relasi: '💬',
  depresi: '🌙',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogPreview({ posts }: { posts: Post[] }) {
  if (!posts.length) return null

  return (
    <section id="blog" className="scroll-mt-24 py-12 md:py-20 bg-white">
      <div className="max-w-container mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-bold text-neutral-900 mb-4">
            Artikel &amp; Insight Terbaru
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto">
            Tips, panduan, dan wawasan dari para ahli kesehatan mental
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {posts.map((post, idx) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className={`blog-card rounded-xl border border-neutral-200 overflow-hidden bg-white shadow-sm ${idx === 0 ? 'md:row-span-2' : ''}`}
            >
              <div className={`relative ${idx === 0 ? 'h-56 md:h-72' : 'h-44'} overflow-hidden`}>
                {post.cover_image ? (
                  <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-5xl">
                    {categoryEmoji[post.category] || '📝'}
                  </div>
                )}
              </div>
              <div className="p-5">
                <span
                  className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
                  style={{ color: post.tag_color || '#2E86DE', backgroundColor: post.tag_bg || '#EBF4FF' }}
                >
                  {post.category}
                </span>
                <h3 className="text-base font-bold text-neutral-900 mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-neutral-500 line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <span className="font-medium text-neutral-600">{post.author_name}</span>
                  <span>·</span>
                  <span>{formatDate(post.created_at)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/blog" className="text-blue-500 font-semibold text-sm hover:underline underline-offset-4">
            Lihat Semua Artikel →
          </Link>
        </div>
      </div>
    </section>
  )
}
