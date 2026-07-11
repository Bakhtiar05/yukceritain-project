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
import { getPostBySlug, getRelatedPosts, getPosts } from '@/lib/actions/posts'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import { ArticleJsonLd } from '@/components/seo/JsonLd'

export const revalidate = 3600;

export async function generateStaticParams() {
  const { posts } = await getPosts({ limit: 100 });
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

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
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
      images: post.cover_image ? [post.cover_image] : undefined,
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
      <ArticleJsonLd post={post} />
      <Navbar variant="blog" />
      <ReadingProgress />
      <main className="bg-white dark:bg-background">
        <div className="max-w-container mx-auto px-6 pb-0 pt-0">
          {/* Breadcrumb removed because it's already in ArticleHero */}
        </div>
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
