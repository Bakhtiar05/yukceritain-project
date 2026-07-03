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

export interface Counselor {
  id: string
  slug: string
  full_name: string
  title: string | null
  profession: string
  photo_url: string | null
  gender: string | null
  specialization: string
  short_bio: string
  full_bio: string | null
  education: string | null
  experience_years: number
  languages: string[]
  rating: number
  total_reviews: number
  is_active: boolean
  is_public: boolean
  display_order: number
  created_at: string
  updated_at: string
}
