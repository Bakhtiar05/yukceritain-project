'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useAuthModal } from './AuthModalProvider'
import { addComment } from '@/lib/actions/community'
import { motion, AnimatePresence } from 'framer-motion'
import { User } from 'lucide-react'

const TONE_CHIPS = [
  { emoji: '❤️', label: 'Support' },
  { emoji: '🤗', label: 'Encouragement' },
  { emoji: '💡', label: 'Advice' },
  { emoji: '🌱', label: 'Experience' },
]

export default function CommentComposer({
  postId,
  isAuthenticated,
}: {
  postId: string
  isAuthenticated: boolean
}) {
  const [content, setContent]         = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused]     = useState(false)
  const [guidelinesOpen, setGuidelinesOpen] = useState(false)
  const { openModal }                 = useAuthModal()
  const textareaRef                   = useRef<HTMLTextAreaElement>(null)

  const maxLength = 500
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



      {/* ── Reply Composer Card ───────────────────────────── */}
      <div
        className={`bg-card rounded-[22px] border transition-all duration-200 overflow-hidden ${
          isFocused
            ? 'border-primary shadow-[0_0_0_3px_rgba(37,99,235,0.08)]'
            : 'border-border shadow-[0_1px_4px_rgba(0,0,0,0.04)]'
        }`}
      >
        <div className="flex gap-3 p-4">
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
              placeholder="Write a supportive response..."
              rows={1}
              className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-foreground text-[15px] leading-relaxed resize-none placeholder:text-muted-foreground placeholder:font-medium"
              style={{ minHeight: '28px' }}
            />
            <p className="text-[11.5px] text-muted-foreground font-medium mt-1">
              Please be respectful and supportive.
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
              <div className="px-4 pb-4 space-y-3 pt-1">
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border text-[12.5px] font-semibold text-muted-foreground hover:bg-[#EFF6FF] dark:bg-blue-500/10 hover:border-[#BFDBFE] dark:border-blue-500/30 hover:text-primary transition-colors"
                    >
                      <span>{chip.emoji}</span>
                      <span>{chip.label}</span>
                    </button>
                  ))}
                </div>

                {/* Bottom bar */}
                <div className="flex items-center justify-between pt-1 border-t border-border">
                  <span className={`text-[12px] font-semibold tabular-nums ${remaining < 80 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                    {remaining} left
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); setContent(''); setIsFocused(false) }}
                      className="h-8 px-3 rounded-full text-[13px] font-semibold text-muted-foreground hover:text-muted-foreground hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); handleSubmit() }}
                      disabled={!hasContent || isSubmitting}
                      className="h-8 px-4 rounded-full text-[13px] font-semibold text-white bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_2px_8px_rgba(37,99,235,0.25)] active:scale-95"
                    >
                      {isSubmitting ? '…' : 'Post Reply'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Community Guidelines (collapsible) ───────────── */}
      <div className="rounded-[16px] border border-border bg-card overflow-hidden">
        <button
          type="button"
          onClick={() => setGuidelinesOpen(!guidelinesOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
        >
          <span className="text-[13px] font-bold text-muted-foreground flex items-center gap-2">
            📋 Community Guidelines
          </span>
          <motion.span
            animate={{ rotate: guidelinesOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-muted-foreground text-xs"
          >
            ▼
          </motion.span>
        </button>
        <AnimatePresence>
          {guidelinesOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <ul className="px-4 pb-4 space-y-1.5 border-t border-border">
                {[
                  'Be respectful and kind',
                  'Avoid judgment — everyone\'s journey is valid',
                  'Protect privacy — don\'t share others\' details',
                  'No hate speech or harmful content',
                  'Support each other with empathy',
                ].map((rule) => (
                  <li key={rule} className="flex items-start gap-2 pt-2">
                    <span className="text-primary mt-0.5 text-[13px]">•</span>
                    <span className="text-[13px] text-muted-foreground leading-snug">{rule}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}
