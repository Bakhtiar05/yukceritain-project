export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  category: string
  tag_color: string | null
  tag_bg: string | null
  cover_image: string | null
  author_name: string
  author_title: string | null
  read_time: string | null
  is_featured: boolean
  published: boolean
  created_at: string
  updated_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  subscribed_at: string
}

export interface ActionResult {
  success: boolean
  error?: string
}
