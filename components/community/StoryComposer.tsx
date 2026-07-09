'use client'

import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuthModal } from './AuthModalProvider'
import { createStory } from '@/lib/actions/community'
import { containsProfanity } from '@/lib/actions/profanity'
import { useToast } from '@/hooks/use-toast'
import ProfanityModal from './ProfanityModal'
import {
  User,
  Shield,
  ImageIcon,
  Smile,
  Tag,
  MapPin,
  Send,
  X,
} from 'lucide-react'
import { useCommunityLanguage } from '@/lib/i18n/CommunityLanguageProvider'

const MAX_LENGTH = 2000

/* ─────────────────────── Component ──────────────────── */
export default function StoryComposer({ isAuthenticated, onStoryCreated }: { isAuthenticated: boolean, onStoryCreated?: () => void }) {
  const [content, setContent]           = useState('')
  const [isAnonymous, setIsAnonymous]   = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused]       = useState(false)
  const [profanityWarningCount, setProfanityWarningCount] = useState(0)
  const [profanityModalOpen, setProfanityModalOpen] = useState(false)
  const [foundProfanities, setFoundProfanities] = useState<string[]>([])
  const { openModal }                   = useAuthModal()
  const textareaRef                     = useRef<HTMLTextAreaElement>(null)
  const router                          = useRouter()
  const { t } = useCommunityLanguage()
  const { toast } = useToast()

  const used      = content.length
  const remaining = MAX_LENGTH - used
  const hasContent = content.trim().length > 0

  /* Auto-resize textarea */
  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, MAX_LENGTH)
    setContent(val)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.max(el.scrollHeight, 240)}px`
  }, [])

  const handleFocus = () => {
    if (!isAuthenticated) { openModal(); return }
    setIsFocused(true)
  }

  const handleEmojiClick = (emoji: string) => {
    setContent(prev => {
      const val = (prev + emoji).slice(0, MAX_LENGTH)
      if (textareaRef.current) {
        // adjust height safely
        setTimeout(() => {
          if(textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 240)}px`
          }
        }, 10)
      }
      return val
    })
  }

  const handleDiscard = () => {
    setContent('')
    setIsAnonymous(false)
    setIsFocused(false)
    if (textareaRef.current) {
      textareaRef.current.style.height = '240px'
    }
  }

  const handleSubmit = async () => {
    if (!isAuthenticated) { openModal(); return }
    if (!hasContent) return
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

      await createStory(content, isAnonymous)
      handleDiscard()
      if (onStoryCreated) {
        onStoryCreated()
      } else {
        router.push('/community/for-you')
      }
    } catch (err: any) {
      console.error('Failed to post story:', err)
      toast({
        title: 'Gagal Mengirim',
        description: err.message || 'Terjadi kesalahan saat mengirim cerita.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  /* Progress ring colour */
  const counterColor =
    remaining < 50  ? '#EF4444' :
    remaining < 150 ? '#F59E0B' :
    '#9CA3AF'

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col gap-5"
    >

        {/* ── HEADER ─────────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
            <User className="w-5 h-5" strokeWidth={1.8} />
          </div>

          {/* Title block */}
          <div>
            <h2 className="text-[20px] font-bold text-foreground leading-tight">
              {t('composer.shareYourStory')}
            </h2>
            <p className="text-[14px] text-muted-foreground leading-snug mt-0.5">
              {t('composer.shareSubtitle')}
            </p>
          </div>
        </div>

        {/* ── WRITING AREA ────────────────────────────────────── */}
        <div
          className={`relative rounded-[16px] transition-all duration-200 ${
            isFocused
              ? 'bg-primary/5 dark:bg-primary/10'
              : 'bg-muted/30 hover:bg-muted/50'
          }`}
        >
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleInput}
            onFocus={handleFocus}
            onBlur={() => setIsFocused(false)}
            placeholder={t('composer.placeholder')}
            className="w-full bg-transparent outline-none focus:outline-none focus:ring-0 border-0 resize-none text-[16px] text-foreground leading-[1.7] placeholder:text-muted-foreground placeholder:leading-[1.7] p-5 rounded-[16px] custom-scrollbar"
            style={{ minHeight: '240px' }}
          />
        </div>

        {/* ── OPTIONAL ACTIONS & COMPACT PRIVACY ──────────────── */}
        <div className="flex items-center gap-2 flex-wrap relative">
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full border text-[13px] font-semibold transition-all duration-200 active:scale-95 ${
                  isAnonymous 
                    ? 'border-primary text-primary bg-[#EFF6FF] dark:bg-blue-500/10' 
                    : 'border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-[#EFF6FF] dark:bg-blue-500/10'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                {t('composer.postAnonymously')}
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-border text-[13px] font-semibold text-muted-foreground hover:border-primary hover:text-primary hover:bg-[#EFF6FF] dark:bg-blue-500/10 transition-all duration-200 active:scale-95"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                {t('composer.addImage')}
              </button>
              
              <div className="flex items-center gap-1.5 ml-2">
                {['😊', '😂', '🥰', '😢', '🙏'].map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleEmojiClick(emoji)
                    }}
                    className="w-9 h-9 flex items-center justify-center text-[18px] rounded-full hover:bg-muted transition-colors active:scale-95"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
          </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 mt-1">
          {/* Left: counter + discard */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Discard */}
            <AnimatePresence>
              {hasContent && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  type="button"
                  onClick={handleDiscard}
                  className="inline-flex items-center justify-center gap-1.5 h-9 sm:h-10 px-3 sm:px-4 rounded-full border border-border text-[13px] sm:text-[14px] font-semibold text-muted-foreground hover:border-[#EF4444] hover:text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 whitespace-nowrap flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                  {t('composer.discard')}
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Share Story */}
          <motion.button
            type="button"
            onClick={!hasContent ? handleFocus : handleSubmit}
            disabled={isSubmitting}
            animate={hasContent ? { opacity: 1, scale: 1 } : { opacity: 0.55, scale: 1 }}
            whileHover={hasContent ? { scale: 1.02 } : {}}
            whileTap={hasContent ? { scale: 0.97 } : {}}
            transition={{ duration: 0.18 }}
            className={`inline-flex items-center justify-center gap-2 h-10 sm:h-12 px-4 sm:px-6 rounded-full text-[14px] sm:text-[15px] font-semibold text-white transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
              hasContent
                ? 'bg-primary hover:bg-primary/90 shadow-[0_4px_14px_rgba(37,99,235,0.30)] cursor-pointer'
                : 'bg-primary cursor-default'
            } disabled:cursor-wait`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                {t('composer.sharing')}
              </>
            ) : (
              <>
                <Send className="w-4 h-4" strokeWidth={2} />
                {t('composer.shareStoryBtn')}
              </>
            )}
          </motion.button>
        </div>
      {/* Modal Profanity */}
      <ProfanityModal
        isOpen={profanityModalOpen}
        warningCount={profanityWarningCount}
        foundWords={foundProfanities}
        onClose={() => setProfanityModalOpen(false)}
      />
    </motion.div>
  )
}
