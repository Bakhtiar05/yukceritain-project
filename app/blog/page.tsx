import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/layout/ScrollToTop'
import FeaturedPost from '@/components/blog/FeaturedPost'
import BlogGrid from '@/components/blog/BlogGrid'
import NewsletterSection from '@/components/blog/NewsletterSection'
import { getPosts, getFeaturedPost } from '@/lib/actions/posts'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog & Artikel',
  description: 'Tips, panduan, dan wawasan dari para ahli kesehatan mental untuk membantumu menjalani hidup yang lebih baik.',
}

export default async function BlogPage() {
  const [{ posts }, featured] = await Promise.all([
    getPosts({ limit: 50 }),
    getFeaturedPost(),
  ])

  return (
    <>
      <Navbar variant="blog" />
      <main>
        {/* Blog Hero */}
        <section className="bg-gradient-to-b from-neutral-50 to-white border-b border-neutral-200" style={{ paddingTop: 'calc(72px + 48px)' }}>
          <div className="max-w-container mx-auto px-6 pb-10">
            <nav className="flex items-center gap-1.5 text-[0.82rem] text-neutral-400 mb-6">
              <Link href="/" className="hover:text-blue-500 transition-colors">Beranda</Link>
              <span>›</span>
              <span className="text-neutral-500">Blog</span>
            </nav>
            <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-bold text-neutral-900 mb-3">
              Blog &amp; Artikel
            </h1>
            <p className="text-neutral-500 max-w-lg">
              Tips, panduan, dan wawasan dari para ahli kesehatan mental untuk membantumu menjalani hidup yang lebih seimbang.
            </p>
          </div>
        </section>

        {/* Featured Post */}
        {featured && (
          <section className="max-w-container mx-auto px-6 py-10">
            <FeaturedPost post={featured} />
          </section>
        )}

        {/* Blog Grid */}
        <section className="max-w-container mx-auto px-6 pb-16">
          <BlogGrid initialPosts={posts} />
        </section>

        <NewsletterSection />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
