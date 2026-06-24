import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/lib/types'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function FeaturedPost({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-card grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] rounded-xl border border-neutral-200 overflow-hidden bg-white shadow-sm">
      <div className="relative h-64 lg:h-[340px] overflow-hidden">
        {post.cover_image ? (
          <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-400" />
        )}
        <span className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full">
          Artikel Pilihan
        </span>
      </div>
      <div className="p-8 flex flex-col justify-center">
        <span
          className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit"
          style={{ color: post.tag_color || '#2E86DE', backgroundColor: post.tag_bg || '#EBF4FF' }}
        >
          {post.category}
        </span>
        <h2 className="font-display text-xl lg:text-2xl font-bold text-neutral-900 mb-3 line-clamp-3">
          {post.title}
        </h2>
        <p className="text-sm text-neutral-500 leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <span className="font-medium text-neutral-600">{post.author_name}</span>
          <span>·</span>
          <span>{formatDate(post.created_at)}</span>
          {post.read_time && <><span>·</span><span>{post.read_time}</span></>}
        </div>
      </div>
    </Link>
  )
}
