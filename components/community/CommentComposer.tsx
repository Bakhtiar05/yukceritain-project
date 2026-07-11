'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useAuthModal } from './AuthModalProvider'
import { addComment } from '@/lib/actions/community'
import { containsProfanity } from '@/lib/actions/profanity'
import { useToast } from '@/hooks/use-toast'
import ProfanityModal from './ProfanityModal'
import { User, ArrowUp, Loader2 } from 'lucide-react'
import { useCommunityLanguage } from '@/lib/i18n/CommunityLanguageProvider'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'


export default function CommentComposer({
  postId,
  isAuthenticated,
  onSuccess,
  replyingTo,
  onCancelReply,
}: {
  postId: string
  isAuthenticated: boolean
  onSuccess?: () => void
  replyingTo?: { id: string; username: string } | null
  onCancelReply?: () => void
}) {
  const [content, setContent]         = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profanityWarningCount, setProfanityWarningCount] = useState(0)
  const [profanityModalOpen, setProfanityModalOpen] = useState(false)
  const [foundProfanities, setFoundProfanities] = useState<string[]>([])
  const [isFocused, setIsFocused]     = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const { openModal }                 = useAuthModal()
  const textareaRef                   = useRef<HTMLTextAreaElement>(null)
  const { t, language }               = useCommunityLanguage()
  const { toast }                     = useToast()
  const router                        = useRouter()

  const maxLength = 1000
  const remaining = maxLength - content.length
  const hasContent = content.trim().length > 0

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfile = async () => {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          const { data } = await supabase.from('profiles').select('avatar_url, username').eq('id', session.user.id).single()
          if (data) {
            setAvatarUrl(data.avatar_url || 'https://api.dicebear.com/7.x/notionists/svg?seed=' + data.username)
          }
        }
      }
      fetchProfile()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 240)}px`
    }
  }, [content])

  useEffect(() => {
    if (replyingTo) {
      setIsFocused(true)
      
      setContent((prev) => {
        const mention = `@${replyingTo.username} `
        if (prev.includes(mention)) return prev
        if (prev.trim().startsWith('@') && prev.trim().split(' ').length === 1) return mention
        return prev.length > 0 ? mention + prev : mention
      })

      // Slight delay to ensure the UI has expanded before focusing
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          // Optional: move cursor to end
          const length = textareaRef.current.value.length
          textareaRef.current.setSelectionRange(length, length)
        }
      }, 50)
    }
  }, [replyingTo])


  const handleSubmit = async () => {
    if (!isAuthenticated) { openModal(); return }
    if (!content.trim()) return
    try {
      setIsSubmitting(true)
      
      const profanityCheck = await containsProfanity(content)
      if (profanityCheck.hasProfanity) {
        setProfanityWarningCount(prev => prev + 1)
        setFoundProfanities(profanityCheck.foundWords)
        setProfanityModalOpen(true)
        setIsSubmitting(false)
        return
      }

      setProfanityWarningCount(0) // Reset on success

      await addComment(postId, content, replyingTo?.id)
      setContent('')
      setIsFocused(false)
      if (onCancelReply) onCancelReply()
      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error('Failed to post comment:', error)
      toast({
        title: 'Gagal Mengirim',
        description: error.message || 'Terjadi kesalahan saat mengirim komentar.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClick = () => {
    if (!isAuthenticated) { openModal(); return }
  }

  return (
    <div className="px-4 py-5 space-y-3">



      {/* ── Reply Composer ───────────────────────────── */}
      <div className="transition-all duration-200 relative pb-2">
        <div className="flex items-end gap-3 sm:gap-4 bg-card rounded-full border border-border p-3 sm:p-4 shadow-sm focus-within:border-primary/40 focus-within:shadow-[0_4px_16px_rgba(37,99,235,0.06)] focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-200">
          {/* Avatar */}
          <div className="relative z-10 flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm border border-border overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 sm:w-[20px] sm:h-[20px]" strokeWidth={2.5} />
            )}
          </div>

          {/* Textarea */}
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
              onFocus={() => { setIsFocused(true); handleClick() }}
              onBlur={() => setIsFocused(false)}
              placeholder={language === 'id' ? 'Tulis balasan...' : 'Write a reply...'}
              rows={1}
              className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-foreground text-[15px] leading-relaxed resize-none placeholder:text-muted-foreground placeholder:font-medium py-1.5"
              style={{ minHeight: '36px' }}
            />
          </div>

          {/* Send Button */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); handleSubmit() }}
            disabled={!hasContent || isSubmitting}
            className="relative z-10 flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 hover:shadow-blue-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
            ) : (
              <ArrowUp className="w-[18px] h-[18px]" strokeWidth={2.5} />
            )}
          </button>
        </div>


      </div>

      {/* Modal Profanity */}
      <ProfanityModal
        isOpen={profanityModalOpen}
        warningCount={profanityWarningCount}
        foundWords={foundProfanities}
        onClose={() => setProfanityModalOpen(false)}
      />
    </div>
  )
}
