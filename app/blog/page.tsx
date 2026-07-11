import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/layout/ScrollToTop'
import FeaturedPost from '@/components/blog/FeaturedPost'
import BlogGrid from '@/components/blog/BlogGrid'
import NewsletterSection from '@/components/blog/NewsletterSection'
import { getPosts, getFeaturedPost } from '@/lib/actions/posts'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import MobileHeader from '@/components/events/mobile/MobileHeader'
import BlogMobileSearchBar from '@/components/blog/BlogMobileSearchBar'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Artikel',
  description: 'Tips, panduan, dan wawasan dari para ahli kesehatan mental untuk membantumu menjalani hidup yang lebih baik.',
  openGraph: {
    title: 'Artikel | YukceritaIN',
    description: 'Tips, panduan, dan wawasan dari para ahli kesehatan mental untuk membantumu menjalani hidup yang lebih baik.',
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artikel | YukceritaIN',
    description: 'Tips, panduan, dan wawasan dari para ahli kesehatan mental untuk membantumu menjalani hidup yang lebih baik.',
  },
}

export default async function BlogPage() {
  const [{ posts }, featured] = await Promise.all([
    getPosts({ limit: 50 }),
    getFeaturedPost(),
  ])

  return (
    <>
      <Navbar variant="blog" hideMobileHeader={true} />
      <MobileHeader title="Community Article" />
      <Suspense fallback={null}>
        <BlogMobileSearchBar />
      </Suspense>
      <main className="min-h-screen bg-white dark:bg-background">
        {/* Blog Hero */}
        <section className="bg-gradient-to-b from-neutral-50 to-white dark:from-background dark:to-background border-b border-neutral-200 dark:border-border hidden md:block pt-40 pb-10">
          <div className="max-w-container mx-auto px-6 pb-10">
            <Breadcrumbs items={[
              { name: 'Beranda', url: '/' },
              { name: 'Artikel', url: '/blog' }
            ]} />
            <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-bold text-neutral-900 dark:text-foreground mb-3">
              Artikel &amp; Insight
            </h1>
            <p className="text-neutral-500 dark:text-muted-foreground max-w-lg">
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
          <Suspense fallback={null}>
            <BlogGrid initialPosts={posts} />
          </Suspense>
        </section>

        <NewsletterSection />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
