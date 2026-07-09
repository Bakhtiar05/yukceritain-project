'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useAuthModal } from './AuthModalProvider'
import { addComment } from '@/lib/actions/community'
import { motion, AnimatePresence } from 'framer-motion'
import { Smile, ImageIcon, Send, Shield, Info, User, ChevronDown } from 'lucide-react'
import { useCommunityLanguage } from '@/lib/i18n/CommunityLanguageProvider'

const TONE_CHIPS = [
  { emoji: '❤️', label: 'Support' },
  { emoji: '🤗', label: 'Encouragement' },
  { emoji: '💡', label: 'Advice' },
  { emoji: '🌱', label: 'Experience' },
  { emoji: '👏', label: 'Applause' },
  { emoji: '💪', label: 'Strength' },
  { emoji: '🤝', label: 'Agreement' },
]

export default function CommentComposer({
  postId,
  isAuthenticated,
  onSuccess,
}: {
  postId: string
  isAuthenticated: boolean
  onSuccess?: () => void
}) {
  const [content, setContent]         = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused]     = useState(false)
  const [guidelinesOpen, setGuidelinesOpen] = useState(false)
  const { openModal }                 = useAuthModal()
  const textareaRef                   = useRef<HTMLTextAreaElement>(null)
  const { t }                         = useCommunityLanguage()

  const maxLength = 1000
  const remaining = maxLength - content.length
  const hasContent = content.trim().length > 0

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 240)}px`
    }
  }, [content])

  const handleSubmit = async () => {
    if (!isAuthenticated) { openModal(); return }
    if (!content.trim()) return
    try {
      setIsSubmitting(true)
      await addComment(postId, content)
      setContent('')
      setIsFocused(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Failed to post comment:', error)
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
      <div className="transition-all duration-200 relative">
        <div className="flex gap-3 py-2">
          {/* Avatar */}
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#EFF6FF] dark:bg-blue-500/10 border border-[#BFDBFE] dark:border-blue-500/30 flex items-center justify-center text-[#60A5FA]">
            <User className="w-4 h-4" />
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
              className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-foreground text-[15px] leading-relaxed resize-none placeholder:text-muted-foreground placeholder:font-medium"
              style={{ minHeight: '28px' }}
            />
            <p className="text-[11.5px] text-muted-foreground font-medium mt-1">
              {t('comment.respectful')}
            </p>
          </div>
        </div>

        {/* ── Tone Chips + Post Button ───────────────────── */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pb-2 space-y-3 pt-2">
                {/* Tone chips */}
                <div className="flex flex-wrap gap-2">
                  {TONE_CHIPS.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        setContent((prev) =>
                          prev ? `${prev} ${chip.emoji} ` : `${chip.emoji} `
                        )
                      }}
                      className="inline-flex items-center justify-center text-[22px] hover:scale-110 active:scale-95 transition-transform"
                    >
                      <span>{chip.emoji}</span>
                    </button>
                  ))}
                </div>

                {/* Bottom bar */}
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-border">
                  <div />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); setContent(''); setIsFocused(false) }}
                      className="h-8 px-3 rounded-full text-[13px] font-semibold text-muted-foreground hover:text-muted-foreground hover:bg-muted transition-colors"
                    >
                      {t('comment.cancel')}
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); handleSubmit() }}
                      disabled={!hasContent || isSubmitting}
                      className="h-8 px-4 rounded-full text-[13px] font-semibold text-white bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_2px_8px_rgba(37,99,235,0.25)] active:scale-95"
                    >
                      {isSubmitting ? t('comment.posting') : t('comment.postReply')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Community Guidelines (collapsible) ───────────── */}
      <div className="rounded-[14px] bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 mt-4 overflow-hidden">
        <button
          type="button"
          onClick={() => setGuidelinesOpen(!guidelinesOpen)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/40"
        >
          <span className="text-[13px] font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400" />
            {t('comment.guidelines')}
          </span>
          <motion.span
            animate={{ rotate: guidelinesOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="text-slate-400"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        </button>
        <AnimatePresence>
          {guidelinesOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pr-3.5 pl-[38px] pb-3.5 space-y-3 mt-1">
                {[
                  t('comment.rule1'),
                  t('comment.rule2'),
                  t('comment.rule3'),
                  t('comment.rule4'),
                  t('comment.rule5'),
                ].map((rule) => (
                  <div key={rule} className="flex items-start gap-2">
                    <div className="w-[6px] h-[6px] rounded-full bg-blue-400/50 dark:bg-blue-500/50 shrink-0 mt-1.5" />
                    <span className="text-[13px] text-slate-500 dark:text-slate-400 leading-[1.5]">
                      {rule.replace(/[-—]/g, '').replace(/\s+/g, ' ').trim()}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}
