'use client'

import React, { useState } from 'react'
import { useAuthModal } from './AuthModalProvider'
import { Button } from '@/components/ui/button'
import { createStory } from '@/lib/actions/community'

export default function StoryComposer({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { openModal } = useAuthModal()

  const maxLength = 1000
  const remaining = maxLength - content.length

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      openModal()
      return
    }

    if (!content.trim()) return

    try {
      setIsSubmitting(true)
      await createStory(content, isAnonymous)
      setContent('')
      setIsAnonymous(false)
    } catch (error) {
      console.error('Failed to post story:', error)
      // Ideally trigger a toast notification here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-4 sm:p-6 border-b border-slate-200">
      <div className="flex space-x-4">
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
        </div>
        
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
            placeholder="What's on your mind today?"
            className="w-full bg-transparent border-0 focus:ring-0 text-slate-900 text-base lg:text-lg resize-none min-h-[100px] placeholder:text-slate-400"
            onClick={() => {
              if (!isAuthenticated) openModal()
            }}
          />
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                Post anonymously
              </span>
            </label>
            
            <div className="flex items-center space-x-4">
              <span className={`text-xs ${remaining < 100 ? 'text-amber-500' : 'text-slate-400'}`}>
                {remaining}
              </span>
              <Button 
                onClick={handleSubmit} 
                disabled={!content.trim() || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 font-semibold shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Sharing...' : 'Share Story'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
