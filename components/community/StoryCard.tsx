'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import { Heart, MessageCircle, Share2, MoreVertical, Trash2, X, AlertCircle, Link as LinkIcon, Flag, EyeOff, Check } from 'lucide-react'
import { useAuthModal } from './AuthModalProvider'
import { useCommentSheet } from './CommentSheetProvider'
import ShareModal from './ShareModal'
import { toggleLike, deleteStory, updateStory } from '@/lib/actions/community'

type Profile = {
  display_name: string
  username: string
  avatar_url: string
}

type StoryCardProps = {
  id: string
  content: string
  is_anonymous: boolean
  created_at: string
  profile: Profile
  likes_count: number
  comments_count: number
  is_liked_by_me: boolean
  isAuthenticated: boolean
  isOwner?: boolean
  disableCommentNavigation?: boolean
  index?: number
}

export default function StoryCard({
  id,
  content,
  is_anonymous,
  created_at,
  profile,
  likes_count,
  comments_count,
  is_liked_by_me,
  isAuthenticated,
  isOwner = false,
  disableCommentNavigation = false,
  index = 0,
}: StoryCardProps) {
  const { openModal }   = useAuthModal()
  const router          = useRouter()
  const { openSheet }   = useCommentSheet()
  const [isLiked, setIsLiked]             = useState(is_liked_by_me)
  const [likesCount, setLikesCount]       = useState(likes_count)
  const [isEditing, setIsEditing]         = useState(false)
  const [editContent, setEditContent]     = useState(content)
  const [isSubmitting, setIsSubmitting]   = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting]       = useState(false)
  const [isMenuOpen, setIsMenuOpen]       = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isExpanded, setIsExpanded]       = useState(false)
  const [needsClamp, setNeedsClamp]       = useState(false)
  const menuRef    = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLParagraphElement>(null)
  const heartRef   = useRef<HTMLButtonElement>(null)



  /* ── Detect if content overflows 5 lines ─────────────── */
  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseFloat(getComputedStyle(contentRef.current).lineHeight)
      const maxHeight  = lineHeight * 5
      setNeedsClamp(contentRef.current.scrollHeight > maxHeight + 2)
    }
  }, [content])

  /* ── Helpers ──────────────────────────────────────────── */
  const handleShare = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setIsShareModalOpen(true)
    setIsMenuOpen(false)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now   = new Date()
    const diff  = now.getTime() - date.getTime()
    const mins  = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days  = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (mins  < 1)  return 'Just now'
    if (hours < 1)  return `${mins}m`
    if (hours < 24) return `${hours}h`
    if (days  === 1) return 'Yesterday'
    return `${days}d`
  }

  /* ── Event handlers ───────────────────────────────────── */
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAuthenticated) { openModal(); return }

    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)

    // Micro-bounce
    if (heartRef.current) {
      heartRef.current.classList.remove('animate-community-heart-bounce')
      void heartRef.current.offsetWidth
      heartRef.current.classList.add('animate-community-heart-bounce')
    }

    try {
      await toggleLike(id)
    } catch {
      setIsLiked(isLiked)
      setLikesCount(likesCount)
    }
  }

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAuthenticated) { openModal(); return }
    if (!disableCommentNavigation) {
      openSheet(id)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteStory(id)
      setIsDeleteModalOpen(false)
      if (disableCommentNavigation) router.push('/community/for-you')
    } catch (e) {
      console.error(e)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditSave = async () => {
    if (!editContent.trim() || editContent === content) { setIsEditing(false); return }
    try {
      setIsSubmitting(true)
      await updateStory(id, editContent)
      setIsEditing(false)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayName = is_anonymous ? 'Teman Anonim' : profile?.display_name
  const username    = is_anonymous ? 'anonim' : profile?.username
  const avatarUrl   = is_anonymous
    ? 'https://api.dicebear.com/7.x/notionists/svg?seed=anonim'
    : profile?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${username}`

  return (
    <>
      <article
        onClick={() => !disableCommentNavigation && router.push(`/community/post/${id}`)}
        className={`community-card animate-community-card-appear relative ${isMenuOpen ? 'z-50' : 'z-0'} ${!disableCommentNavigation ? 'cursor-pointer' : ''}`}
        style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
      >

        {/* ── User Info Row ──────────────────────────────── */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-12 h-12 rounded-full object-cover bg-muted ring-2 ring-background"
              />
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {is_anonymous ? (
                  <span className="text-[16px] font-bold text-foreground leading-tight">
                    {displayName}
                  </span>
                ) : (
                  <span
                    onClick={(e) => e.stopPropagation()}
                    className="text-[16px] font-bold text-foreground leading-tight"
                  >
                    {displayName}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[13px] text-muted-foreground font-medium truncate">@{username}</span>
                <span className="text-[#D1D5DB] text-[11px]">·</span>
                <span className="text-[13px] text-muted-foreground font-medium whitespace-nowrap" suppressHydrationWarning>
                  {formatDate(created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* More menu button */}
          <div className="relative flex-shrink-0 ml-2" ref={menuRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen) }}
              className="w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-muted-foreground hover:bg-muted transition-colors active:scale-95"
              aria-label="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown */}
            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsMenuOpen(false);
                  }}
                />
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-card rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-border py-2 z-20 animate-community-expand-down">
                {isOwner && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsEditing(true); setIsMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-semibold text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <Check className="w-4 h-4 text-muted-foreground" />
                      Edit Post
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsDeleteModalOpen(true); setIsMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                      Delete Post
                    </button>
                    <div className="h-px bg-muted my-1.5 mx-3" />
                  </>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); handleShare() }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-semibold text-muted-foreground hover:bg-muted transition-colors"
                >
                  <LinkIcon className="w-4 h-4 text-muted-foreground" />
                  Share Story
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-semibold text-muted-foreground hover:bg-muted transition-colors"
                >
                  <Flag className="w-4 h-4 text-muted-foreground" />
                  Report
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-semibold text-muted-foreground hover:bg-muted transition-colors"
                >
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                  Hide Post
                </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Post Content ────────────────────────────────── */}
        {isEditing ? (
          <div className="mt-1 mb-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-muted border border-border rounded-[14px] px-4 py-3 text-foreground text-[15px] leading-relaxed focus:ring-2 focus:ring-ring focus:border-primary outline-none resize-none min-h-[80px] transition-all"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={(e) => { e.stopPropagation(); setIsEditing(false); setEditContent(content) }}
                className="px-3 py-1.5 text-[13px] font-semibold text-muted-foreground hover:text-muted-foreground hover:bg-muted rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleEditSave() }}
                disabled={isSubmitting}
                className="px-4 py-1.5 text-[13px] font-semibold text-white bg-primary hover:bg-primary/90 rounded-full transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-3">
            <p
              ref={contentRef}
              className={`text-foreground text-[16px] leading-[1.7] whitespace-pre-wrap break-words community-post-content ${
                isExpanded ? 'expanded' : ''
              }`}
            >
              {content}
            </p>
            {needsClamp && (
              <button
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded) }}
                className="mt-1 text-[13.5px] font-semibold text-primary hover:text-primary/90 transition-colors"
              >
                {isExpanded ? 'Read Less' : 'Read More'}
              </button>
            )}
          </div>
        )}

        {/* ── Card Footer ─────────────────────────────────── */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">

          {/* Support (like) */}
          <button
            ref={heartRef}
            onClick={handleLike}
            className={`community-action-btn ${isLiked ? 'liked' : ''}`}
            title="Kirim Dukungan"
          >
            <Heart
              className="w-4 h-4 transition-colors"
              strokeWidth={isLiked ? 0 : 1.8}
              fill={isLiked ? '#93C5FD' : 'none'}
            />
            {likesCount > 0 && <span className="tabular-nums">{likesCount}</span>}
            <span className="hidden sm:inline">Support</span>
          </button>

          {/* Reply */}
          <button
            onClick={handleComment}
            className="community-action-btn"
            title="Balas"
          >
            <MessageCircle className="w-4 h-4" strokeWidth={1.8} />
            {comments_count > 0 && <span className="tabular-nums">{comments_count}</span>}
            <span className="hidden sm:inline">Reply</span>
          </button>

          {/* Share */}
          <button
            onClick={(e) => { e.stopPropagation(); handleShare() }}
            className="community-action-btn"
            title="Bagikan"
          >
            <Share2 className="w-4 h-4" strokeWidth={1.8} />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

      </article>

      {/* ── Delete Confirmation Modal ────────────────────── */}
      <Dialog.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-[9999] w-[90vw] max-w-sm translate-x-[-50%] translate-y-[-50%] bg-card rounded-[24px] p-6 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4 text-red-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <Dialog.Title className="text-[18px] font-bold text-foreground mb-2">
                Delete this story?
              </Dialog.Title>
              <Dialog.Description className="text-muted-foreground text-[14px] mb-6 leading-relaxed">
                This action cannot be undone. Your story and all its replies will be permanently deleted.
              </Dialog.Description>
              <div className="flex gap-3 w-full">
                <Dialog.Close asChild>
                  <button className="flex-1 px-4 py-2.5 bg-muted hover:bg-muted text-muted-foreground rounded-full font-semibold text-[14px] transition-colors">
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-[14px] transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ── Share Modal ────────────────────────────────────── */}
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        post={{
          id,
          content,
          is_anonymous,
          profile
        }}
      />
    </>
  )
}
