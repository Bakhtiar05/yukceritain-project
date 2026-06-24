import Link from 'next/link'
import type { Post } from '@/lib/types'
import BlogCard from '@/components/blog/BlogCard'

export default function RelatedArticles({ posts }: { posts: Post[] }) {
  if (!posts.length) return null

  return (
    <section className="bg-neutral-100 border-t border-neutral-200 py-16">
      <div className="max-w-container mx-auto px-6">
        <h2 className="font-display text-2xl font-bold text-neutral-900 mb-8 text-center">
          Artikel Terkait
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} variant="compact" />
          ))}
        </div>
        <div className="text-center">
          <Link href="/blog" className="btn btn-outline text-sm">
            ← Kembali ke Blog
          </Link>
        </div>
      </div>
    </section>
  )
}
