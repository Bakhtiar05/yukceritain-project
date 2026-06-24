import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/layout/ScrollToTop'
import ReadingProgress from '@/components/article/ReadingProgress'
import ArticleHero from '@/components/article/ArticleHero'
import ArticleCover from '@/components/article/ArticleCover'
import ArticleContent from '@/components/article/ArticleContent'
import TableOfContents from '@/components/article/TableOfContents'
import ShareButtons from '@/components/article/ShareButtons'
import RelatedArticles from '@/components/article/RelatedArticles'
import { getPostBySlug, getRelatedPosts } from '@/lib/actions/posts'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Artikel Tidak Ditemukan' }

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
      type: 'article',
      locale: 'id_ID',
    },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const related = await getRelatedPosts(post.category, post.id, 3)

  return (
    <>
      <Navbar variant="blog" />
      <ReadingProgress />
      <main>
        <ArticleHero post={post} />
        <ArticleCover
          src={post.cover_image}
          alt={post.title}
          caption={post.cover_image ? `${post.title} — ${post.author_name}` : undefined}
        />

        <div id="article-content" className="max-w-[960px] mx-auto px-6 py-8 flex gap-10">
          <TableOfContents content={post.content || ''} />
          <div className="flex-1 min-w-0">
            <ArticleContent content={post.content || ''} />
            <ShareButtons />
          </div>
        </div>

        <RelatedArticles posts={related} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
