'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { addComment } from '@/lib/actions/community'
import { useAuthModal } from './AuthModalProvider'
import DeleteCommentButton from './DeleteCommentButton'

type CommentType = {
  id: string
  post_id: string
  parent_id: string | null
  profile_id: string
  content: string
  created_at: string
  is_pinned: boolean
  profile: any
  children?: CommentType[]
}

function buildCommentTree(comments: any[]): CommentType[] {
  const map = new Map<string, CommentType>()
  const roots: CommentType[] = []

  // Initialize all comments
  comments.forEach(c => {
    map.set(c.id, { ...c, children: [] })
  })

  // Build tree
  comments.forEach(c => {
    if (c.parent_id) {
      const parent = map.get(c.parent_id)
      if (parent) {
        parent.children!.push(map.get(c.id)!)
      } else {
        // Fallback if parent is missing
        roots.push(map.get(c.id)!)
      }
    } else {
      roots.push(map.get(c.id)!)
    }
  })

  return roots
}

function ReplyComposer({ 
  postId, 
  parentId, 
  onClose,
  isAuthenticated
}: { 
  postId: string, 
  parentId: string, 
  onClose: () => void,
  isAuthenticated: boolean
}) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { openModal } = useAuthModal()
  const maxLength = 300
  const remaining = maxLength - content.length

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      openModal()
      return
    }
    if (!content.trim()) return

    try {
      setIsSubmitting(true)
      await addComment(postId, content, parentId)
      onClose()
    } catch (error: any) {
      alert(error.message)
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 animate-in fade-in slide-in-from-top-2">
      <textarea
        autoFocus
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
        placeholder="Write a respectful reply..."
        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 text-sm resize-none min-h-[80px] placeholder:text-slate-400"
      />
      <div className="flex items-center justify-between mt-3">
        <span className={`text-xs ${remaining < 50 ? 'text-amber-500' : 'text-slate-400'}`}>
          {remaining}
        </span>
        <div className="flex gap-2">
          <button onClick={onClose} className="px-4 py-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700 rounded-full transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="px-4 py-1.5 text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-full disabled:opacity-50 transition-colors shadow-sm"
          >
            {isSubmitting ? '...' : 'Reply'}
          </button>
        </div>
      </div>
    </div>
  )
}

function CommentNode({ 
  comment, 
  level, 
  postId, 
  isAuthenticated, 
  currentUserId 
}: { 
  comment: CommentType, 
  level: number, 
  postId: string, 
  isAuthenticated: boolean,
  currentUserId?: string 
}) {
  const [isReplying, setIsReplying] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { openModal } = useAuthModal()
  
  const profile = Array.isArray(comment.profile) ? comment.profile[0] : comment.profile
  const canDelete = currentUserId === comment.profile_id
  const maxNesting = 3

  // Format date
  const dateStr = new Intl.DateTimeFormat('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(comment.created_at))

  return (
    <div className={`group/node ${level > 0 ? 'mt-4' : 'mb-6'} relative`}>
      {/* Vertical connector line for nested replies */}
      {level > 0 && !isCollapsed && comment.children && comment.children.length > 0 && (
         <div className="absolute left-[19px] top-12 bottom-0 w-[2px] bg-slate-100 -z-10 rounded-full"></div>
      )}

      {/* Main Comment Card */}
      <div className={`flex gap-3 sm:gap-4 ${level === 0 ? 'bg-white p-5 rounded-2xl border border-slate-100 shadow-sm' : 'bg-white p-4'}`}>
        {/* Avatar */}
        <div className="shrink-0 flex flex-col items-center">
          <Link href={`/community/user/${profile.username}`}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} className="w-10 h-10 rounded-full object-cover bg-slate-100 ring-2 ring-white" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold ring-2 ring-white">
                {profile.display_name?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </Link>
          
          {/* Collapse button for roots with children */}
          {comment.children && comment.children.length > 0 && (
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="mt-2 w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors z-10"
            >
              {isCollapsed ? '+' : '-'}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
            <Link href={`/community/user/${profile.username}`} className="font-bold text-slate-900 text-sm hover:underline">
              {profile.display_name}
            </Link>
            
            <span className="text-xs text-slate-400">· {dateStr}</span>
            
            {comment.is_pinned && (
              <span className="text-xs font-semibold text-amber-500 flex items-center gap-1 ml-auto">
                ⭐ Dipasematkan
              </span>
            )}
          </div>

          <div className={`text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words mt-2 text-slate-800`}>
            {comment.content}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-3">
            <button 
              onClick={() => {
                if (!isAuthenticated) return openModal()
                setIsReplying(!isReplying)
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Reply
            </button>
            
            {canDelete && (
              <div className="opacity-0 group-hover/node:opacity-100 transition-opacity">
                <DeleteCommentButton commentId={comment.id} postId={postId} />
              </div>
            )}
          </div>

          {/* Reply Composer */}
          {isReplying && (
            <ReplyComposer 
              postId={postId} 
              parentId={level >= maxNesting ? (comment.parent_id || comment.id) : comment.id} 
              onClose={() => setIsReplying(false)}
              isAuthenticated={isAuthenticated}
            />
          )}

          {/* Children */}
          {!isCollapsed && comment.children && comment.children.length > 0 && (
            <div className="mt-2">
              {comment.children.map(child => (
                <CommentNode 
                  key={child.id} 
                  comment={child} 
                  level={level + 1} 
                  postId={postId} 
                  isAuthenticated={isAuthenticated} 
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}

          {isCollapsed && comment.children && comment.children.length > 0 && (
            <button 
              onClick={() => setIsCollapsed(false)}
              className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full"
            >
              View {comment.children.length} more replies
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ThreadedResponseList({ 
  comments, 
  postId, 
  isAuthenticated,
  currentUserId 
}: { 
  comments: any[], 
  postId: string, 
  isAuthenticated: boolean,
  currentUserId?: string
}) {
  const tree = useMemo(() => buildCommentTree(comments), [comments])

  // Sort pinned to top, then by creation date
  const sortedTree = useMemo(() => {
    return [...tree].sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1
      if (!a.is_pinned && b.is_pinned) return 1
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [tree])

  return (
    <div className="flex flex-col gap-2">
      {sortedTree.map(rootComment => (
        <CommentNode 
          key={rootComment.id} 
          comment={rootComment} 
          level={0} 
          postId={postId} 
          isAuthenticated={isAuthenticated} 
          currentUserId={currentUserId}
        />
      ))}
    </div>
  )
}
