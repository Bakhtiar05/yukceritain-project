'use client'

import React, { useState, useRef, useEffect } from 'react'
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

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [content])

  return (
    <div className="bg-white px-4 sm:px-8 py-6 mb-2">
      <div className="flex flex-col">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
          placeholder="Write a supportive reply..."
          className="w-full bg-slate-50 border-0 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-100 text-slate-900 text-base resize-none min-h-[56px] placeholder:text-slate-400 transition-all shadow-inner"
          onClick={() => {
            if (!isAuthenticated) openModal()
          }}
          rows={1}
        />
        
        {/* Actions bar appears when typing or focused */}
        <div className={`flex items-center justify-between mt-3 transition-opacity duration-200 ${content.length > 0 ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
          <span className={`text-[11px] font-medium tracking-wide uppercase ${remaining < 50 ? 'text-amber-500' : 'text-slate-400'}`}>
            {remaining} left
          </span>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setContent('')} 
              className="text-slate-400 hover:text-slate-600 font-medium text-sm px-3 py-1.5 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={!content.trim() || isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full px-6 py-2 text-sm font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? '...' : 'Reply'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
