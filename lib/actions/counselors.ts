'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Counselor, ActionResult } from '@/lib/types'

// ============================================
// PUBLIC ACTIONS (no auth required)
// ============================================

export async function getPublicCounselors(options?: {
  search?: string
  page?: number
  limit?: number
}): Promise<{ counselors: Counselor[]; count: number }> {
  const supabase = await createClient()
  const { search, page = 1, limit = 8 } = options || {}
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('counselors')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .eq('is_public', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,specialization.ilike.%${search}%,profession.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching public counselors:', error)
    return { counselors: [], count: 0 }
  }

  return { counselors: (data as Counselor[]) || [], count: count || 0 }
}

export async function getFeaturedCounselors(limit: number = 4): Promise<Counselor[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('counselors')
    .select('*')
    .eq('is_active', true)
    .eq('is_public', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured counselors:', error)
    return []
  }

  return (data as Counselor[]) || []
}

export async function getCounselorBySlug(slug: string): Promise<Counselor | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('counselors')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching counselor by slug:', error)
    return null
  }

  return data as Counselor
}

// ============================================
// ADMIN ACTIONS (auth required)
// ============================================

export async function getAllCounselorsAdmin(): Promise<Counselor[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('counselors')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching admin counselors:', error)
    return []
  }

  return (data as Counselor[]) || []
}

export async function getCounselorById(id: string): Promise<Counselor | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('counselors')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching counselor by id:', error)
    return null
  }

  return data as Counselor
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function createCounselor(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()

  const full_name = formData.get('full_name') as string
  const slug = (formData.get('slug') as string) || generateSlug(full_name)
  const title = formData.get('title') as string
  const profession = formData.get('profession') as string
  const photo_url = formData.get('photo_url') as string
  const gender = formData.get('gender') as string
  const specialization = formData.get('specialization') as string
  const short_bio = formData.get('short_bio') as string
  const full_bio = formData.get('full_bio') as string
  const education = formData.get('education') as string
  const experience_years = parseInt((formData.get('experience_years') as string) || '0')
  const languagesStr = formData.get('languages') as string
  const languages = languagesStr ? languagesStr.split(',').map(s => s.trim()).filter(Boolean) : ['Indonesia']
  const rating = parseFloat((formData.get('rating') as string) || '5.0')
  const total_reviews = parseInt((formData.get('total_reviews') as string) || '0')
  const display_order = parseInt((formData.get('display_order') as string) || '0')
  const is_active = formData.get('is_active') === 'true'
  const is_public = formData.get('is_public') === 'true'

  const { error } = await supabase.from('counselors').insert({
    slug,
    full_name,
    title: title || null,
    profession,
    photo_url: photo_url || null,
    gender: gender || null,
    specialization,
    short_bio,
    full_bio: full_bio || null,
    education: education || null,
    experience_years,
    languages,
    rating,
    total_reviews,
    is_active,
    is_public,
    display_order
  })

  if (error) {
    console.error('Error creating counselor:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/counselors')
  revalidatePath('/')
  revalidatePath('/admin/konseling/counselors')

  return { success: true }
}

export async function updateCounselor(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()

  const full_name = formData.get('full_name') as string
  const slug = (formData.get('slug') as string) || generateSlug(full_name)
  const title = formData.get('title') as string
  const profession = formData.get('profession') as string
  const photo_url = formData.get('photo_url') as string
  const gender = formData.get('gender') as string
  const specialization = formData.get('specialization') as string
  const short_bio = formData.get('short_bio') as string
  const full_bio = formData.get('full_bio') as string
  const education = formData.get('education') as string
  const experience_years = parseInt((formData.get('experience_years') as string) || '0')
  const languagesStr = formData.get('languages') as string
  const languages = languagesStr ? languagesStr.split(',').map(s => s.trim()).filter(Boolean) : ['Indonesia']
  const rating = parseFloat((formData.get('rating') as string) || '5.0')
  const total_reviews = parseInt((formData.get('total_reviews') as string) || '0')
  const display_order = parseInt((formData.get('display_order') as string) || '0')
  const is_active = formData.get('is_active') === 'true'
  const is_public = formData.get('is_public') === 'true'

  const { error } = await supabase
    .from('counselors')
    .update({
      slug,
      full_name,
      title: title || null,
      profession,
      photo_url: photo_url || null,
      gender: gender || null,
      specialization,
      short_bio,
      full_bio: full_bio || null,
      education: education || null,
      experience_years,
      languages,
      rating,
      total_reviews,
      is_active,
      is_public,
      display_order
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating counselor:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/counselors')
  revalidatePath(`/counselors/${slug}`)
  revalidatePath('/')
  revalidatePath('/admin/konseling/counselors')

  return { success: true }
}

export async function deleteCounselor(id: string): Promise<ActionResult> {
  const supabase = await createClient()

  // Soft delete: set is_active to false instead of deleting the row
  const { error } = await supabase
    .from('counselors')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    console.error('Error soft-deleting counselor:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/counselors')
  revalidatePath('/')
  revalidatePath('/admin/konseling/counselors')

  return { success: true }
}
