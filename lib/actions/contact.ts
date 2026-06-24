'use server'

import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/lib/types'

export async function subscribeNewsletter(
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get('email') as string

  if (!email || !email.includes('@')) {
    return { success: false, error: 'Email tidak valid.' }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email })

  if (error) {
    if (error.code === '23505') {
      // unique_violation — already subscribed
      return { success: false, error: 'Email sudah terdaftar.' }
    }
    console.error('Error subscribing:', error)
    return { success: false, error: 'Terjadi kesalahan. Coba lagi nanti.' }
  }

  return { success: true }
}
