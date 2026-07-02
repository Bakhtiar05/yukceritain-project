'use client'

import React, { useState } from 'react'
import { useAuthModal } from './AuthModalProvider'
import { Button } from '@/components/ui/button'
import { addComment } from '@/lib/actions/community'

export default function CommentComposer({ postId, isAuthenticated }: { postId: string, isAuthenticated: boolean }) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { openModal } = useAuthModal()

  const maxLength = 500
  const remaining = maxLength - content.length

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      openModal()
      return
    }

    if (!content.trim()) return

    try {
      setIsSubmitting(true)
      await addComment(postId, content)
      setContent('')
    } catch (error) {
      console.error('Failed to post comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-50/50 p-4 sm:p-6 border-b border-slate-200">
      <div className="flex space-x-3 sm:space-x-4">
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
            placeholder="Write a supportive reply..."
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 text-sm sm:text-base resize-none min-h-[80px] placeholder:text-slate-400"
            onClick={() => {
              if (!isAuthenticated) openModal()
            }}
          />
          
          <div className="flex items-center justify-between mt-3">
            <span className={`text-xs ${remaining < 50 ? 'text-amber-500' : 'text-slate-400'}`}>
              {remaining} characters left
            </span>
            <Button 
              onClick={handleSubmit} 
              disabled={!content.trim() || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 h-9 text-sm font-semibold shadow-sm disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Replying...' : 'Reply'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
