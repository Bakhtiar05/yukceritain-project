import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/lib/types'

const categoryEmoji: Record<string, string> = {
  kecemasan: '😰', selfcare: '🌿', mindfulness: '💆', relasi: '💬', depresi: '🌙',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

interface BlogCardProps {
  post: Post
  variant?: 'default' | 'compact'
}

export default function BlogCard({ post, variant = 'default' }: BlogCardProps) {
  const imgH = variant === 'compact' ? 'h-40' : 'h-48'

  return (
    <Link href={`/blog/${post.slug}`} className="blog-card rounded-xl border border-neutral-200 overflow-hidden bg-white shadow-sm block">
      <div className={`relative ${imgH} overflow-hidden`}>
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
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="font-medium text-neutral-600">{post.author_name}</span>
            <span>·</span>
            <span>{formatDate(post.created_at)}</span>
          </div>
          {post.read_time && <span>{post.read_time}</span>}
        </div>
      </div>
    </Link>
  )
}
