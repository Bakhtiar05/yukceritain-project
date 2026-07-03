'use client'

import React, { useState } from 'react'
import { useAuthModal } from './AuthModalProvider'
import { Button } from '@/components/ui/button'
import { addComment } from '@/lib/actions/community'

export default function ProfessionalResponseComposer({ 
  postId, 
  isAuthenticated, 
  profile 
}: { 
  postId: string, 
  isAuthenticated: boolean, 
  profile: any 
}) {
  const [content, setContent] = useState('')
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
      await addComment(postId, content)
      setContent('')
    } catch (error: any) {
      alert(error.message)
      console.error('Failed to post response:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-blue-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/30 px-6 py-4 border-b border-blue-100/50">
        <h3 className="font-bold text-blue-900 flex items-center gap-2">
          <span className="text-xl">🧠</span> Professional Response
        </h3>
        <p className="text-xs text-blue-700/70 mt-1 font-medium">
          Only verified psychologists, counselors, psychiatrists, and peer supporters can publish top-level responses.
        </p>
      </div>

      <div className="p-6">
        <div className="flex gap-4">
          <div className="shrink-0">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.display_name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm border-2 border-white">
                {profile?.display_name?.charAt(0)?.toUpperCase() || 'P'}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-slate-900 text-sm">{profile?.display_name || 'Professional Name'}</span>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                Verified
              </span>
              <span className="text-xs text-slate-500">{profile?.professional_title || 'Mental Health Professional'}</span>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
              placeholder="Write an empathetic and supportive response..."
              className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 text-base resize-none min-h-[120px] placeholder:text-slate-400 transition-all"
              onClick={() => {
                if (!isAuthenticated) openModal()
              }}
            />
            
            <div className="flex items-center justify-between mt-4">
              <span className={`text-xs font-medium ${remaining < 100 ? 'text-amber-500' : 'text-slate-400'}`}>
                {remaining} characters left
              </span>
              <div className="flex gap-3">
                <Button 
                  variant="ghost"
                  onClick={() => setContent('')}
                  className="text-slate-500 hover:text-slate-700 rounded-full px-5 font-semibold"
                  disabled={isSubmitting || !content}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!content.trim() || isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-6 shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all font-semibold"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Response'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
