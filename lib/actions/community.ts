'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { containsProfanity } from './profanity'

export async function createStory(content: string, isAnonymous: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const profanityCheck = await containsProfanity(content)
  if (profanityCheck.hasProfanity) {
    throw new Error(`Pesan mengandung kata yang tidak pantas: ${profanityCheck.foundWords.join(', ')}`)
  }

  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      profile_id: user.id,
      content,
      is_anonymous: isAnonymous,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/community/for-you')
  revalidatePath('/community/explore')
  return data
}

export async function toggleLike(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Check if like exists
  const { data: existingLike } = await supabase
    .from('community_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('profile_id', user.id)
    .single()

  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from('community_likes')
      .delete()
      .eq('id', existingLike.id)
      
    if (error) throw new Error(error.message)
  } else {
    // Like
    const { error } = await supabase
      .from('community_likes')
      .insert({
        post_id: postId,
        profile_id: user.id,
      })
      
    if (error) throw new Error(error.message)
  }

  revalidatePath('/community/for-you')
  revalidatePath('/community/explore')
}

export async function addComment(postId: string, content: string, parentId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const profanityCheck = await containsProfanity(content)
  if (profanityCheck.hasProfanity) {
    throw new Error(`Komentar mengandung kata yang tidak pantas: ${profanityCheck.foundWords.join(', ')}`)
  }

  const { data, error } = await supabase
    .from('community_comments')
    .insert({
      post_id: postId,
      profile_id: user.id,
      content,
      parent_id: parentId || null,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/community/post/${postId}`) // Or wherever the detail page is
  revalidatePath('/community/for-you')
  return data
}


export async function updateProfile(displayName: string, username: string, bio: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      display_name: displayName,
      username: username,
      bio: bio,
    })
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/community/profile')
  return data
}

export async function deleteStory(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('community_posts')
    .delete()
    .eq('id', postId)
    .eq('profile_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/community/for-you')
  revalidatePath('/community/profile')
}

export async function updateStory(postId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('community_posts')
    .update({ content })
    .eq('id', postId)
    .eq('profile_id', user.id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/community/for-you')
  revalidatePath('/community/for-you')
  revalidatePath('/community/profile')
  revalidatePath(`/community/post/${postId}`)
  return data
}

export async function deleteComment(commentId: string, postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  // The database RLS policy will check if the user is the comment owner OR the post owner
  const { error } = await supabase
    .from('community_comments')
    .delete()
    .eq('id', commentId)

  if (error) throw new Error(error.message)

  revalidatePath(`/community/post/${postId}`)
}

export async function fetchPostAndComments(postId: string) {
  const supabase = await createClient()
  
  const { data: post, error: postError } = await supabase
    .from('community_posts')
    .select(`
      *,
      profile:profiles(display_name, username, avatar_url),
      likes:community_likes(profile_id)
    `)
    .eq('id', postId)
    .single()

  if (postError) throw new Error(postError.message)

  const { data: comments, error: commentsError } = await supabase
    .from('community_comments')
    .select(`
      *,
      profile:profiles(display_name, username, avatar_url)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (commentsError) throw new Error(commentsError.message)

  return { post, comments }
}

export async function fetchFeedBatch(offset: number, limit: number = 5, mode: 'for-you' | 'explore' = 'for-you', searchQuery?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('community_posts')
    .select(`
      *,
      profile:profiles(display_name, username, avatar_url),
      likes:community_likes(profile_id),
      comments:community_comments(count)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (searchQuery && searchQuery.trim() !== '') {
    query = query.ilike('content', `%${searchQuery}%`)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)

  return data
}
