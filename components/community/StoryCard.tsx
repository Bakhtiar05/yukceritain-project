'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import { HeartHandshake, MessageCircle, Share, MoreHorizontal, Edit2, Trash2, X, Check, AlertCircle, Link as LinkIcon } from 'lucide-react'
import { useAuthModal } from './AuthModalProvider'
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
  index = 0
}: StoryCardProps) {
  const { openModal } = useAuthModal()
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(is_liked_by_me)
  const [likesCount, setLikesCount] = useState(likes_count)
  
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/community/post/${id}`)
      setIsMenuOpen(false)
      // Optional: Add toast here
    } catch (err) {
      console.error('Failed to copy link')
    }
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      openModal()
      return
    }

    // Optimistic update
    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
    
    // Heart bounce animation trigger
    const btn = e.currentTarget
    btn.classList.remove('animate-heart-bounce')
    void btn.offsetWidth // trigger reflow
    btn.classList.add('animate-heart-bounce')

    try {
      await toggleLike(id)
    } catch (error) {
      // Revert on error
      setIsLiked(isLiked)
      setLikesCount(likesCount)
    }
  }

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      openModal()
      return
    }
    if (!disableCommentNavigation) {
      router.push(`/community/post/${id}`)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteStory(id)
      setIsDeleteModalOpen(false)
      if (disableCommentNavigation) {
        router.push('/community/for-you') // If on detail page, go back
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditSave = async () => {
    if (!editContent.trim() || editContent === content) {
      setIsEditing(false)
      return
    }
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

  const displayName = is_anonymous ? 'Anonymous' : profile.display_name
  const username = is_anonymous ? 'anonymous' : profile.username
  
  const avatarUrl = is_anonymous 
    ? 'https://api.dicebear.com/7.x/notionists/svg?seed=anonymous' 
    : profile.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${username}`
  
  // Format date relative (e.g., "2h", "5d")
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h`
    return `${Math.floor(hours / 24)}d`
  }

  return (
    <article 
      onClick={() => !disableCommentNavigation && router.push(`/community/post/${id}`)}
      className={`px-3 sm:px-5 pt-3 pb-2 transition-colors cursor-pointer border-b border-slate-100/80 last:border-0 animate-feed-slide-up ${!disableCommentNavigation ? 'hover:bg-slate-50/50' : ''}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img src={avatarUrl} alt={displayName} className="w-[48px] h-[48px] rounded-full object-cover bg-slate-100 ring-1 ring-slate-200/50" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0 pb-1">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-1.5 truncate pt-0.5">
              {is_anonymous ? (
                <span className="font-bold text-[15px] text-slate-900 truncate">{displayName}</span>
              ) : (
                <Link href={`/community/user/${username}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 group truncate cursor-pointer">
                  <span className="font-bold text-[15px] text-slate-900 truncate group-hover:text-blue-600 transition-colors">{displayName}</span>
                  <span className="text-slate-500 font-medium text-[13px] truncate group-hover:text-blue-500 transition-colors">@{username}</span>
                </Link>
              )}
              <span className="text-slate-300 text-[13px]">·</span>
              <span className="text-slate-400 text-[13px] whitespace-nowrap">{formatDate(created_at)}</span>
            </div>
            
            <div className="relative" ref={menuRef}>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }} 
                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors active:scale-95"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-10 animate-menu-slide-up">
                  {isOwner && (
                    <>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setIsEditing(true); setIsMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-slate-400" />
                        Edit Post
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setIsDeleteModalOpen(true); setIsMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                        Delete Post
                      </button>
                      <div className="h-px bg-slate-100 my-1 mx-3" />
                    </>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); copyLink(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <LinkIcon className="w-4 h-4 text-slate-400" />
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[80px]"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button onClick={(e) => { e.stopPropagation(); setIsEditing(false); setEditContent(content); }} className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  Cancel
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleEditSave(); }} disabled={isSubmitting} className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-slate-900 text-[15px] sm:text-[16px] leading-[1.5] whitespace-pre-wrap break-words max-w-2xl">
              {content}
            </p>
          )}

          {/* Action Buttons */}
          <div className="mt-2 flex items-center justify-start gap-4 sm:gap-6 text-slate-500">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 h-10 min-w-[44px] group transition-colors duration-200 ${isLiked ? 'text-emerald-500' : 'hover:text-emerald-500'}`}
              title="Kirim Pelukan"
            >
              <div className={`flex items-center justify-center w-9 h-9 -ml-2 rounded-full group-hover:bg-emerald-50 transition-colors ${isLiked ? 'bg-emerald-50' : ''}`}>
                <HeartHandshake className={`w-5 h-5 ${isLiked ? 'stroke-emerald-500 text-emerald-500 fill-emerald-50' : ''}`} />
              </div>
              {likesCount > 0 && <span className="text-[13px] font-semibold -ml-0.5">{likesCount}</span>}
            </button>

            <button 
              onClick={handleComment}
              className="flex items-center gap-1.5 h-10 min-w-[44px] group hover:text-blue-500 transition-all duration-200 active:scale-95"
              title="Komentar"
            >
              <div className="flex items-center justify-center w-9 h-9 -ml-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </div>
              {comments_count > 0 && <span className="text-[13px] font-semibold -ml-0.5">{comments_count}</span>}
            </button>

            <button 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 h-10 min-w-[44px] group hover:text-indigo-500 transition-all duration-200 active:scale-95"
              title="Share"
            >
              <div className="flex items-center justify-center w-9 h-9 -ml-2 rounded-full group-hover:bg-indigo-50 transition-colors">
                <Share className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-[9999] w-[90vw] max-w-sm translate-x-[-50%] translate-y-[-50%] bg-white p-6 shadow-xl sm:rounded-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <Dialog.Title className="text-lg font-bold text-slate-900 mb-2">
                Delete this story?
              </Dialog.Title>
              <Dialog.Description className="text-slate-500 text-sm mb-6">
                This action cannot be undone. This will permanently delete your story and all of its replies.
              </Dialog.Description>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Dialog.Close asChild>
                  <button className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                    Cancel
                  </button>
                </Dialog.Close>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </article>
  )
}

