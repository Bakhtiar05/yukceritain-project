'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserRole } from '@/lib/auth/roles'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'

export const getBlockedWords = unstable_cache(
  async (): Promise<string[]> => {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('community_profanity')
      .select('word')

    if (error || !data) {
      console.error('Failed to fetch blocked words:', error)
      return []
    }

    return data.map((item) => item.word.toLowerCase())
  },
  ['profanity-words'], // Cache key
  { tags: ['profanity'] } // Tag for revalidation
)

export async function addBlockedWord(word: string) {
  const role = await getUserRole()
  if (!role || (role !== 'super_admin' && role !== 'admin_community')) {
    throw new Error('Unauthorized')
  }

  const supabase = createAdminClient()
  
  const cleanWord = word.trim().toLowerCase()
  if (!cleanWord) throw new Error('Word cannot be empty')

  // Check for duplicates
  const { data: existing } = await supabase
    .from('community_profanity')
    .select('id')
    .eq('word', cleanWord)
    .single()

  if (existing) {
    throw new Error(`Kata "${cleanWord}" sudah ada di dalam daftar.`)
  }

  const { error } = await supabase
    .from('community_profanity')
    .insert({ word: cleanWord })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/community/profanity')
}

export async function removeBlockedWord(id: string) {
  const role = await getUserRole()
  if (!role || (role !== 'super_admin' && role !== 'admin_community')) {
    throw new Error('Unauthorized')
  }

  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('community_profanity')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/community/profanity')
}

export async function getBlockedWordsList() {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('community_profanity')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

/**
 * Helper to normalize "leet speak" numbers and symbols to letters
 */
function normalizeLeetSpeak(text: string): string {
  return text
    .replace(/4/g, 'a')
    .replace(/@/g, 'a')
    .replace(/1/g, 'i')
    .replace(/!/g, 'i')
    .replace(/0/g, 'o')
    .replace(/3/g, 'e')
    .replace(/5/g, 's')
    .replace(/8/g, 'b')
    .replace(/\$/g, 's')
}

/**
 * Validates text against the blocked words list.
 * Returns true if profanity is detected.
 */
export async function containsProfanity(text: string): Promise<{ hasProfanity: boolean; foundWords: string[] }> {
  if (!text) return { hasProfanity: false, foundWords: [] }
  
  const blockedWords = await getBlockedWords()
  if (blockedWords.length === 0) return { hasProfanity: false, foundWords: [] }

  const normalizedText = text.toLowerCase()
  const leetNormalizedText = normalizeLeetSpeak(normalizedText)
  
  const foundWords: string[] = []
  
  // Basic substring check against normal and leet versions
  for (const word of blockedWords) {
    if (normalizedText.includes(word) || leetNormalizedText.includes(word)) {
      foundWords.push(word)
    }
  }

  return {
    hasProfanity: foundWords.length > 0,
    foundWords
  }
}
