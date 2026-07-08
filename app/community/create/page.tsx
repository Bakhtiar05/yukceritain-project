import React from 'react'
import { createClient } from '@/lib/supabase/server'
import CreateStoryClient from './CreateStoryClient'

export const dynamic = 'force-dynamic'

export default async function CreateStoryPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  return <CreateStoryClient isAuthenticated={!!session} />
}
