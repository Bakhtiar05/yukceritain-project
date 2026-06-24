'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Post, ActionResult } from '@/lib/types'

// ============================================
// PUBLIC ACTIONS (no auth required)
// ============================================

export async function getPosts(options?: {
  category?: string
  search?: string
  page?: number
  limit?: number
}): Promise<{ posts: Post[]; count: number }> {
  const supabase = await createClient()
  const { category, search, page = 1, limit = 6 } = options || {}
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (category && category !== 'semua') {
    query = query.eq('category', category)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching posts:', error)
    return { posts: [], count: 0 }
  }

  return { posts: (data as Post[]) || [], count: count || 0 }
}

export async function getLatestPosts(limit: number = 3): Promise<Post[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching latest posts:', error)
    return []
  }

  return (data as Post[]) || []
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) {
    console.error('Error fetching post:', error)
    return null
  }

  return data as Post
}

export async function getRelatedPosts(
  category: string,
  excludeId: string,
  limit: number = 3
): Promise<Post[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .neq('id', excludeId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching related posts:', error)
    return []
  }

  return (data as Post[]) || []
}

export async function getFeaturedPost(): Promise<Post | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching featured post:', error)
    return null
  }

  return data as Post
}

// ============================================
// ADMIN ACTIONS (auth required)
// ============================================

export async function getAllPostsAdmin(): Promise<Post[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching admin posts:', error)
    return []
  }

  return (data as Post[]) || []
}

export async function getPostById(id: string): Promise<Post | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching post by id:', error)
    return null
  }

  return data as Post
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function createPost(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const slug = (formData.get('slug') as string) || generateSlug(title)
  const excerpt = formData.get('excerpt') as string
  const content = formData.get('content') as string
  const category = formData.get('category') as string
  const tag_color = formData.get('tag_color') as string
  const tag_bg = formData.get('tag_bg') as string
  const cover_image = formData.get('cover_image') as string
  const author_name = formData.get('author_name') as string
  const author_title = formData.get('author_title') as string
  const read_time = formData.get('read_time') as string
  const is_featured = formData.get('is_featured') === 'true'
  const published = formData.get('published') === 'true'

  const { error } = await supabase.from('posts').insert({
    title,
    slug,
    excerpt,
    content,
    category,
    tag_color: tag_color || '#2E86DE',
    tag_bg: tag_bg || '#EBF4FF',
    cover_image: cover_image || null,
    author_name,
    author_title: author_title || null,
    read_time: read_time || '5 menit baca',
    is_featured,
    published,
  })

  if (error) {
    console.error('Error creating post:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/blog')
  revalidatePath('/')
  revalidatePath('/admin')

  return { success: true }
}

export async function updatePost(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const slug = (formData.get('slug') as string) || generateSlug(title)
  const excerpt = formData.get('excerpt') as string
  const content = formData.get('content') as string
  const category = formData.get('category') as string
  const tag_color = formData.get('tag_color') as string
  const tag_bg = formData.get('tag_bg') as string
  const cover_image = formData.get('cover_image') as string
  const author_name = formData.get('author_name') as string
  const author_title = formData.get('author_title') as string
  const read_time = formData.get('read_time') as string
  const is_featured = formData.get('is_featured') === 'true'
  const published = formData.get('published') === 'true'

  const { error } = await supabase
    .from('posts')
    .update({
      title,
      slug,
      excerpt,
      content,
      category,
      tag_color: tag_color || '#2E86DE',
      tag_bg: tag_bg || '#EBF4FF',
      cover_image: cover_image || null,
      author_name,
      author_title: author_title || null,
      read_time: read_time || '5 menit baca',
      is_featured,
      published,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating post:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  revalidatePath('/')
  revalidatePath('/admin')

  return { success: true }
}

export async function deletePost(id: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { error } = await supabase.from('posts').delete().eq('id', id)

  if (error) {
    console.error('Error deleting post:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/blog')
  revalidatePath('/')
  revalidatePath('/admin')

  return { success: true }
}
