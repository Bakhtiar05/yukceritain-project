import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    const { error, data: sessionData } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && sessionData?.user) {
      const user = sessionData.user
      
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()
        
      if (!profile) {
        // Generate a username based on name or email
        let baseUsername = ''
        if (user.user_metadata?.full_name) {
          baseUsername = user.user_metadata.full_name.toLowerCase().replace(/[^a-z0-9]/g, '')
        } else if (user.email) {
          baseUsername = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
        } else {
          baseUsername = 'user'
        }

        // Deduplication logic
        let uniqueUsername = baseUsername
        let isUnique = false
        let attempt = 0
        
        while (!isUnique) {
          const { data: existingUser } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', uniqueUsername)
            .single()
            
          if (existingUser) {
            attempt++
            uniqueUsername = `${baseUsername}${Math.floor(Math.random() * 10000)}`
          } else {
            isUnique = true
          }
          
          if (attempt > 10) {
            // Failsafe
            uniqueUsername = `${baseUsername}${Date.now()}`
            isUnique = true
          }
        }
        
        // Insert profile
        await supabase.from('profiles').insert({
          id: user.id,
          username: uniqueUsername,
          display_name: user.user_metadata?.full_name || 'Anonymous User',
          avatar_url: user.user_metadata?.avatar_url || '',
        })
      }
      
      return NextResponse.redirect(`${origin}/community/for-you`)
    }
  }

  return NextResponse.redirect(`${origin}/community?error=auth`)
}
