'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Bookmark, Heart, MessageCircle, Share2,
  MoreVertical, Trash2, AlertCircle, Link as LinkIcon,
  Flag, EyeOff, Check
} from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { useAuthModal } from './AuthModalProvider'
import { toggleLike, deleteStory, updateStory, deleteComment } from '@/lib/actions/community'
import CommentComposer from './CommentComposer'
import { useRouter } from 'next/navigation'
import { useCommunityLanguage } from '@/lib/i18n/CommunityLanguageProvider'

/* ─────────────────────── Types ─────────────────────── */
type Profile = { display_name: string; username: string; avatar_url: string }
type Comment = {
  id: string
  profile_id: string
  content: string
  created_at: string
  profile: Profile | Profile[]
}
type Post = {
  id: string
  content: string
  is_anonymous: boolean
  created_at: string
  profile: Profile
  profile_id: string
  likes: { profile_id: string }[]
}

/* ─────────────────────── Helpers ────────────────────── */
function formatDate(dateStr: string, t: (key: string) => string) {
  const d    = new Date(dateStr)
  const now  = new Date()
  const diff = now.getTime() - d.getTime()
  const m    = Math.floor(diff / 60000)
  const h    = Math.floor(diff / 3600000)
  const day  = Math.floor(diff / 86400000)
  if (m  < 1)  return t('time.justNow')
  if (h  < 1)  return `${m} ${t('time.mAgo')}`
  if (h  < 24) return `${h} ${t('time.hAgo')}`
  if (day === 1) return t('time.yesterday')
  return `${day} ${t('time.dAgo')}`
}

function avatarFor(username: string, url?: string) {
  return url || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(username)}`
}

/* ─────────────────────── Animation variants ────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 14, scale: 0.99 },
  visible: { opacity: 1, y: 0,  scale: 1    },
}

import ResponseCard from './ResponseCard'

/* ═══════════════════════════════════════════════════════
   STORY DETAIL CLIENT (main export)
═══════════════════════════════════════════════════════ */
export default function StoryDetailClient({
  post,
  comments,
  session,
  isAuthenticated,
  isLikedByMe,
  commentsCount,
}: {
  post: Post
  comments: Comment[]
  session: any
  isAuthenticated: boolean
  isLikedByMe: boolean
  commentsCount: number
}) {
  const { openModal }     = useAuthModal()
  const router            = useRouter()
  const { t }             = useCommunityLanguage()
  const [isLiked, setIsLiked]           = useState(isLikedByMe)
  const [likesCount, setLikesCount]     = useState(post.likes.length)
  const [isEditing, setIsEditing]       = useState(false)
  const [editContent, setEditContent]   = useState(post.content)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting]     = useState(false)
  const [isMenuOpen, setIsMenuOpen]     = useState(false)

  const isOwner = session?.user?.id === post.profile_id
  const displayName = post.is_anonymous ? t('storyDetail.anonymous') : post.profile?.display_name
  const username    = post.is_anonymous ? t('storyDetail.anonymous') : post.profile?.username
  const avatarUrl   = post.is_anonymous
    ? 'https://api.dicebear.com/7.x/notionists/svg?seed=anonymous'
    : avatarFor(post.profile?.username, post.profile?.avatar_url)

  const handleShare = async () => {
    const url = `${window.location.origin}/community/post/${post.id}`
    const title = 'YukceritaIN Community'
    const text = post.content.substring(0, 100) + '...'

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch (err) {
        // user cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(url).catch(() => {})
      // optionally add toast here
    }
    setIsMenuOpen(false)
  }

  const handleLike = async () => {
    if (!isAuthenticated) { openModal(); return }
    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
    try { await toggleLike(post.id) }
    catch { setIsLiked(isLiked); setLikesCount(likesCount) }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteStory(post.id)
      setIsDeleteOpen(false)
      router.push('/community/for-you')
    } catch {}
    finally { setIsDeleting(false) }
  }

  const handleEditSave = async () => {
    if (!editContent.trim() || editContent === post.content) { setIsEditing(false); return }
    try {
      setIsSubmitting(true)
      await updateStory(post.id, editContent)
      setIsEditing(false)
    } catch {}
    finally { setIsSubmitting(false) }
  }

  return (
    <div className="w-full min-h-screen bg-background pb-28">

      {/* ── Sticky Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-card/92 backdrop-blur-xl border-b border-border md:hidden">
        <div className="h-16 flex items-center justify-between px-3">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-muted hover:bg-muted text-muted-foreground transition-colors active:scale-95 flex-shrink-0"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.2} />
          </button>

          {/* Center */}
          <div className="flex flex-col items-center flex-1 px-3">
            <span className="text-[17px] font-bold text-foreground leading-tight tracking-tight text-center">
              {t('storyDetail.header')}
            </span>
          </div>

          {/* Right placeholder to keep center alignment */}
          <div className="w-10 h-10 flex-shrink-0" />
        </div>
      </header>

      {/* ── Desktop back button ────────────────────────────────── */}
      <div className="hidden md:flex px-6 pt-6 pb-2">
        <Link
          href="/community/for-you"
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> {t('storyDetail.backToFeed')}
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 space-y-4 pt-4 md:pt-2">

        {/* ── Story Card ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-card rounded-[24px] border border-border shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden"
        >
          <div className="p-6">

            {/* Author row */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-12 h-12 rounded-full object-cover bg-muted ring-2 ring-background flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {post.is_anonymous ? (
                      <span className="text-[17px] font-bold text-foreground">{displayName}</span>
                    ) : (
                      <Link href={`/community/user/${username}`} className="text-[17px] font-bold text-foreground hover:text-primary transition-colors">
                        {displayName}
                      </Link>
                    )}
                    {post.is_anonymous && (
                      <span className="community-badge-anon">🛡 {t('storyDetail.anonymous')}</span>
                    )}
                  </div>
                  <span className="text-[13px] text-muted-foreground font-medium">{formatDate(post.created_at, t)}</span>
                </div>
              </div>

              {/* More menu */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-muted-foreground hover:bg-muted transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.94, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.94, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1.5 w-52 bg-card rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-border py-2 z-20"
                    >
                      {isOwner && (
                        <>
                          <button
                            onClick={() => { setIsEditing(true); setIsMenuOpen(false) }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-semibold text-muted-foreground hover:bg-muted transition-colors"
                          >
                            <Check className="w-4 h-4 text-muted-foreground" /> {t('storyDetail.editPost')}
                          </button>
                          <button
                            onClick={() => { setIsDeleteOpen(true); setIsMenuOpen(false) }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:bg-red-900/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" /> {t('storyDetail.deletePost')}
                          </button>
                          <div className="h-px bg-muted my-1.5 mx-3" />
                        </>
                      )}
                      <button onClick={handleShare} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-semibold text-muted-foreground hover:bg-muted transition-colors">
                        <LinkIcon className="w-4 h-4 text-muted-foreground" /> {t('storyDetail.shareStory')}
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-semibold text-muted-foreground hover:bg-muted transition-colors">
                        <Flag className="w-4 h-4 text-muted-foreground" /> {t('storyDetail.report')}
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-semibold text-muted-foreground hover:bg-muted transition-colors">
                        <EyeOff className="w-4 h-4 text-muted-foreground" /> {t('storyDetail.hideStory')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Content */}
            {isEditing ? (
              <div className="mb-4">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-muted border border-border rounded-[16px] px-4 py-3 text-foreground text-[17px] leading-[1.8] focus:ring-2 focus:ring-ring focus:border-primary outline-none resize-none min-h-[120px] transition-all"
                />
                <div className="flex justify-end gap-2 mt-3">
                  <button onClick={() => { setIsEditing(false); setEditContent(post.content) }} className="px-4 py-2 text-[14px] font-semibold text-muted-foreground hover:bg-muted rounded-full transition-colors">{t('storyDetail.cancel')}</button>
                  <button onClick={handleEditSave} disabled={isSubmitting} className="px-4 py-2 text-[14px] font-semibold text-white bg-primary hover:bg-primary/90 rounded-full transition-colors disabled:opacity-50">
                    {isSubmitting ? t('storyDetail.saving') : t('storyDetail.save')}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[17px] text-foreground leading-[1.8] whitespace-pre-wrap break-words mb-5">
                {post.content}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-3 border-t border-[#F9FAFB]">
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={handleLike}
                className={`community-action-btn ${isLiked ? 'liked' : ''}`}
              >
                <Heart className="w-4 h-4" strokeWidth={isLiked ? 0 : 1.8} fill={isLiked ? '#93C5FD' : 'none'} />
                {likesCount > 0 && <span className="tabular-nums">{likesCount}</span>}
                <span className="hidden sm:inline">{t('storyDetail.support')}</span>
              </motion.button>

              <div className="community-action-btn cursor-default">
                <MessageCircle className="w-4 h-4" strokeWidth={1.8} />
                <span className="tabular-nums">{commentsCount}</span>
                <span className="hidden sm:inline">{t('storyDetail.responses')}</span>
              </div>

              <button onClick={handleShare} className="community-action-btn">
                <Share2 className="w-4 h-4" strokeWidth={1.8} />
                <span className="hidden sm:inline">{t('storyDetail.share')}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Reply Composer ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
          className="bg-card rounded-[22px] border border-border shadow-[0_1px_6px_rgba(0,0,0,0.04)] overflow-hidden"
        >
          <CommentComposer postId={post.id} isAuthenticated={isAuthenticated} />
        </motion.div>

        {/* ── Responses Section ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.18 }}
        >
          {/* Section header */}
          <div className="flex items-center justify-between px-1 py-2">
            <div>
              <h2 className="text-[18px] font-bold text-foreground">{t('storyDetail.responses')}</h2>
              <p className="text-[13px] text-muted-foreground font-medium mt-0.5">
                {comments.length === 0
                  ? t('storyDetail.noResponses')
                  : `${comments.length} ${comments.length === 1 ? t('storyDetail.supportiveReply') : t('storyDetail.supportiveReplies')}`}
              </p>
            </div>
          </div>
          <div className="h-px bg-muted mb-4" />

          {/* Empty state */}
          {comments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-16 text-center px-6"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center mb-5 shadow-inner">
                <span className="text-4xl">💌</span>
              </div>
              <h3 className="text-[19px] font-bold text-foreground mb-2">{t('storyDetail.noResponses')}</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[220px]">
                {t('storyDetail.beTheFirst')}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment, i) => {
                const canDelete = session?.user?.id === comment.profile_id || session?.user?.id === post.profile_id
                return (
                  <ResponseCard
                    key={comment.id}
                    comment={comment}
                    canDelete={canDelete}
                    postId={post.id}
                    delay={0.08 * i}
                  />
                )
              })}
            </div>
          )}
        </motion.div>

      </div>

      {/* ── Delete Story Modal ────────────────────────────────── */}
      <Dialog.Root open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-[9999] w-[90vw] max-w-sm translate-x-[-50%] translate-y-[-50%] bg-card rounded-[24px] p-6 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <Dialog.Title className="text-[18px] font-bold text-foreground mb-2">{t('storyDetail.deleteTitle')}</Dialog.Title>
              <Dialog.Description className="text-muted-foreground text-[14px] mb-6 leading-relaxed">
                {t('storyDetail.deleteDesc')}
              </Dialog.Description>
              <div className="flex gap-3 w-full">
                <Dialog.Close asChild>
                  <button className="flex-1 px-4 py-2.5 bg-muted hover:bg-muted text-muted-foreground rounded-full font-semibold text-[14px] transition-colors">{t('storyDetail.cancel')}</button>
                </Dialog.Close>
                <button onClick={handleDelete} disabled={isDeleting} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-[14px] transition-colors disabled:opacity-50">
                  {isDeleting ? t('storyDetail.deleting') : t('storyDetail.delete')}
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  )
}
