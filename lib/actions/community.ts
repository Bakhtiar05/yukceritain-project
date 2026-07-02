'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createStory(content: string, isAnonymous: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
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

export async function addComment(postId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('community_comments')
    .insert({
      post_id: postId,
      profile_id: user.id,
      content,
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

export async function reportContent(postId: string | null, commentId: string | null, reason: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('community_reports')
    .insert({
      post_id: postId,
      comment_id: commentId,
      profile_id: user.id,
      reason,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

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
