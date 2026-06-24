import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PostForm from '@/components/admin/PostForm'
import { getPostById } from '@/lib/actions/posts'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const post = await getPostById(id)
  return { title: post ? `Edit: ${post.title}` : 'Edit Artikel' }
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPostById(id)
  if (!post) notFound()

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-sm text-neutral-400 mb-4">
        <Link href="/admin" className="hover:text-blue-500">Dashboard</Link>
        <span>›</span>
        <span className="text-neutral-600">Edit Artikel</span>
      </nav>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Edit Artikel</h1>
      <PostForm post={post} />
    </div>
  )
}
