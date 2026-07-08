'use client'

import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthModal } from './AuthModalProvider'
import { createStory } from '@/lib/actions/community'
import {
  User,
  Shield,
  ImageIcon,
  Tag,
  MapPin,
  Send,
  X,
} from 'lucide-react'

/* ─────────────────────── Data ────────────────────────── */
const MOODS = [
  { emoji: '😊', label: 'Happy',      bg: '#FEF9C3', color: '#92400E', ring: '#FDE68A' },
  { emoji: '😔', label: 'Sad',        bg: '#EEF2FF', color: '#3730A3', ring: '#C7D2FE' },
  { emoji: '😰', label: 'Anxious',    bg: '#FDF2F8', color: '#9D174D', ring: '#FBCFE8' },
  { emoji: '😌', label: 'Calm',       bg: '#ECFDF5', color: '#065F46', ring: '#A7F3D0' },
  { emoji: '❤️', label: 'Grateful',  bg: '#FFF1F2', color: '#9F1239', ring: '#FECDD3' },
  { emoji: '😤', label: 'Frustrated', bg: '#FFF7ED', color: '#9A3412', ring: '#FED7AA' },
  { emoji: '😴', label: 'Tired',      bg: '#F5F3FF', color: '#4C1D95', ring: '#DDD6FE' },
  { emoji: '🌤', label: 'Hopeful',    bg: '#EFF6FF', color: '#1E40AF', ring: '#BFDBFE' },
]

const MAX_LENGTH = 1000

/* ─────────────────────── Component ──────────────────── */
export default function StoryComposer({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [content, setContent]           = useState('')
  const [isAnonymous, setIsAnonymous]   = useState(false)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused]       = useState(false)
  const { openModal }                   = useAuthModal()
  const textareaRef                     = useRef<HTMLTextAreaElement>(null)

  const used      = content.length
  const remaining = MAX_LENGTH - used
  const hasContent = content.trim().length > 0

  /* Auto-resize textarea */
  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, MAX_LENGTH)
    setContent(val)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.max(el.scrollHeight, 160)}px`
  }, [])

  const handleFocus = () => {
    if (!isAuthenticated) { openModal(); return }
    setIsFocused(true)
  }

  const handleDiscard = () => {
    setContent('')
    setSelectedMood(null)
    setIsAnonymous(false)
    setIsFocused(false)
    if (textareaRef.current) {
      textareaRef.current.style.height = '160px'
    }
  }

  const handleSubmit = async () => {
    if (!isAuthenticated) { openModal(); return }
    if (!hasContent) return
    try {
      setIsSubmitting(true)
      await createStory(content, isAnonymous)
      handleDiscard()
    } catch (err) {
      console.error('Failed to post story:', err)
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
      /* Card */
      className={`mx-4 mb-3 bg-card rounded-[24px] border transition-all duration-300 ${
        isFocused
          ? 'border-primary shadow-[0_4px_24px_rgba(37,99,235,0.10)]'
          : 'border-border shadow-[0_2px_12px_rgba(0,0,0,0.05)]'
      }`}
    >
      <div className="p-6 flex flex-col gap-5">

        {/* ── HEADER ─────────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] border border-[#BFDBFE] dark:border-blue-500/30 flex items-center justify-center text-[#3B82F6] shadow-sm">
            <User className="w-5 h-5" strokeWidth={1.8} />
          </div>

          {/* Title block */}
          <div>
            <h2 className="text-[20px] font-bold text-foreground leading-tight">
              Share Your Story
            </h2>
            <p className="text-[14px] text-muted-foreground leading-snug mt-0.5">
              Your story may help someone feel less alone.
            </p>
          </div>
        </div>

        {/* ── WRITING AREA ────────────────────────────────────── */}
        <div
          className={`relative rounded-[16px] border transition-all duration-200 ${
            isFocused
              ? 'border-[#3B82F6] shadow-[0_0_0_3px_rgba(59,130,246,0.10)]'
              : 'border-[#D1D5DB] hover:border-[#9CA3AF]'
          }`}
        >
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleInput}
            onFocus={handleFocus}
            onBlur={() => setIsFocused(false)}
            placeholder={
              `What's on your mind today?\n\nShare your thoughts, experiences, or feelings in a safe and supportive space...`
            }
            className="w-full bg-transparent outline-none focus:outline-none focus:ring-0 border-0 resize-none text-[16px] text-foreground leading-[1.7] placeholder:text-muted-foreground placeholder:leading-[1.7] p-5 rounded-[16px] custom-scrollbar"
            style={{ minHeight: '160px' }}
          />
        </div>

        {/* ── MOOD SELECTOR ───────────────────────────────────── */}
        <AnimatePresence>
          {(isFocused || hasContent) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.26, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pt-1">
                <p className="text-[13px] font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                  How are you feeling today?
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {MOODS.map((mood) => {
                    const sel = selectedMood === mood.label
                    return (
                      <motion.button
                        key={mood.label}
                        type="button"
                        onClick={() => setSelectedMood(sel ? null : mood.label)}
                        whileTap={{ scale: 0.92 }}
                        animate={sel ? { scale: 1.04 } : { scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                        className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-full text-center transition-all duration-200"
                        style={{
                          background:   sel ? mood.bg   : '#F9FAFB',
                          color:        sel ? mood.color : '#6B7280',
                          border:       `1.5px solid ${sel ? mood.ring : '#E5E7EB'}`,
                          boxShadow:    sel ? `0 2px 8px ${mood.ring}80` : 'none',
                        }}
                      >
                        <span className="text-[18px] leading-none">{mood.emoji}</span>
                        <span className="text-[11px] font-semibold leading-none">{mood.label}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── PRIVACY CARD ────────────────────────────────────── */}
        <AnimatePresence>
          {(isFocused || hasContent) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.26, ease: 'easeOut' }}
              className="rounded-[16px] bg-[#EFF6FF] dark:bg-blue-500/10 border border-[#BFDBFE] dark:border-blue-500/30 px-4 py-3.5 flex items-center justify-between gap-4"
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-card border border-[#BFDBFE] dark:border-blue-500/30 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[13.5px] font-bold text-[#1E40AF] leading-tight">
                    Anonymous Posting
                  </p>
                  <p className="text-[12px] text-[#3B82F6] leading-snug mt-0.5">
                    Your identity will remain hidden.
                  </p>
                </div>
              </div>

              {/* Toggle */}
              <motion.button
                type="button"
                role="switch"
                aria-checked={isAnonymous}
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`relative flex-shrink-0 h-6 w-11 rounded-full border-2 border-transparent focus:outline-none transition-colors duration-200 ${
                  isAnonymous ? 'bg-primary' : 'bg-[#CBD5E1]'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="pointer-events-none absolute top-0.5 left-0.5 h-[18px] w-[18px] rounded-full bg-card shadow-sm"
                  animate={{ x: isAnonymous ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── OPTIONAL ACTIONS ────────────────────────────────── */}
        <AnimatePresence>
          {(isFocused || hasContent) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="flex items-center gap-2 flex-wrap"
            >
              {[
                { icon: <ImageIcon className="w-3.5 h-3.5" />, label: 'Add Image' },
                { icon: <Tag       className="w-3.5 h-3.5" />, label: 'Add Topic' },
                { icon: <MapPin    className="w-3.5 h-3.5" />, label: 'Add Context' },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[14px] border border-border text-[13px] font-semibold text-muted-foreground hover:border-primary hover:text-primary hover:bg-[#EFF6FF] dark:bg-blue-500/10 transition-all duration-200 active:scale-95"
                >
                  {icon}
                  {label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FOOTER ──────────────────────────────────────────── */}
        <div className={`flex items-center justify-between gap-4 ${(isFocused || hasContent) ? 'pt-1 border-t border-border' : ''}`}>
          {/* Left: counter + discard */}
          <div className="flex items-center gap-3">
            {/* Char counter — only when focused */}
            <AnimatePresence>
              {(isFocused || hasContent) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[13px] font-semibold tabular-nums"
                  style={{ color: counterColor }}
                >
                  {used} / {MAX_LENGTH}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Discard */}
            <AnimatePresence>
              {hasContent && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  type="button"
                  onClick={handleDiscard}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-[14px] border border-border text-[14px] font-semibold text-muted-foreground hover:border-[#EF4444] hover:text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-900/20 dark:bg-red-900/20 transition-all duration-200"
                >
                  <X className="w-3.5 h-3.5" />
                  Discard
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
            className={`inline-flex items-center gap-2 h-12 px-6 rounded-[16px] text-[15px] font-semibold text-white transition-colors duration-200 ${
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
                Sharing…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" strokeWidth={2} />
                Share Story
              </>
            )}
          </motion.button>
        </div>

        {/* ── GUIDANCE ────────────────────────────────────────── */}
        <p className="text-[12.5px] text-muted-foreground leading-snug text-center">
          💙 Please be respectful, protect privacy, and remember that kindness matters.
        </p>

      </div>
    </motion.div>
  )
}
