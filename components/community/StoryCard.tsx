'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import { Heart, MessageCircle, Share2, MoreHorizontal, Edit2, Trash2, X, Check, AlertCircle } from 'lucide-react'
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
  disableCommentNavigation = false
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

  const handleLike = async () => {
    if (!isAuthenticated) {
      openModal()
      return
    }

    // Optimistic update
    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)

    try {
      await toggleLike(id)
    } catch (error) {
      // Revert on error
      setIsLiked(isLiked)
      setLikesCount(likesCount)
    }
  }

  const handleComment = () => {
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
    <article className="p-4 sm:p-6 bg-white border-b border-slate-200 transition-colors hover:bg-slate-50/50">
      <div className="flex space-x-3 sm:space-x-4">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-1 truncate">
              {is_anonymous ? (
                <span className="font-bold text-slate-900 truncate">{displayName}</span>
              ) : (
                <Link href={`/community/user/${username}`} onClick={(e) => e.stopPropagation()} className="flex items-center space-x-1 group truncate cursor-pointer">
                  <span className="font-bold text-slate-900 truncate group-hover:text-blue-600 group-hover:underline transition-colors">{displayName}</span>
                  <span className="text-slate-500 text-sm truncate group-hover:text-blue-500 transition-colors">@{username}</span>
                </Link>
              )}
              <span className="text-slate-400 mx-1">·</span>
              <span className="text-slate-500 text-sm whitespace-nowrap">{formatDate(created_at)}</span>
            </div>
            {isOwner && !isEditing && (
              <div className="flex items-center space-x-2">
                <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-blue-600 transition-colors p-1">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => setIsDeleteModalOpen(true)} className="text-slate-400 hover:text-red-600 transition-colors p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[80px]"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button onClick={() => { setIsEditing(false); setEditContent(content); }} className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  Cancel
                </button>
                <button onClick={handleEditSave} disabled={isSubmitting} className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 sm:mt-2 text-slate-800 text-base sm:text-[17px] leading-relaxed whitespace-pre-wrap break-words">
              {content}
            </p>
          )}

          {/* Action Buttons */}
          <div className="mt-4 sm:mt-5 flex items-center space-x-6 text-slate-500">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 group transition-colors ${isLiked ? 'text-rose-500' : 'hover:text-rose-500'}`}
            >
              <div className={`p-1.5 sm:p-2 rounded-full group-hover:bg-rose-50 transition-colors ${isLiked ? 'bg-rose-50' : ''}`}>
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
              </div>
              <span className="text-sm font-medium">{likesCount > 0 ? likesCount : ''}</span>
            </button>

            <button 
              onClick={handleComment}
              className="flex items-center space-x-2 group hover:text-blue-500 transition-colors"
            >
              <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-sm font-medium">{comments_count > 0 ? comments_count : ''}</span>
            </button>

            <button className="flex items-center space-x-2 group hover:text-green-500 transition-colors ml-auto">
              <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-green-50 transition-colors">
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
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

