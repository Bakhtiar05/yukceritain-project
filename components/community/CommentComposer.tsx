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
  const { t }                         = useCommunityLanguage()
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

  // Auto-focus on mount so keyboard appears automatically
  useEffect(() => {
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 100)
  }, [])

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
        <div className="flex items-end gap-3 p-2 pl-2.5 border border-border/40 bg-muted/30 dark:bg-[#1D1F24]/80 rounded-[26px] shadow-sm focus-within:border-primary/40 focus-within:shadow-[0_4px_16px_rgba(37,99,235,0.06)] focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-200">
          {/* Avatar */}
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#EFF6FF] dark:bg-blue-500/10 border border-[#BFDBFE] dark:border-blue-500/30 flex items-center justify-center text-[#60A5FA] overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5" />
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
              placeholder={t('comment.placeholder')}
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
            className="w-[36px] h-[36px] flex-shrink-0 rounded-full flex items-center justify-center text-white bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_2px_8px_rgba(37,99,235,0.25)] active:scale-95"
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
