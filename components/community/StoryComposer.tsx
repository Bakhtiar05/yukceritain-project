'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useAuthModal } from './AuthModalProvider'
import { Button } from '@/components/ui/button'
import { createStory } from '@/lib/actions/community'
import { User } from 'lucide-react'

const MOODS = [
  { emoji: '😊', label: 'Senang' },
  { emoji: '😔', label: 'Sedih' },
  { emoji: '😰', label: 'Cemas' },
  { emoji: '😌', label: 'Tenang' },
  { emoji: '❤️', label: 'Bersyukur' },
]

export default function StoryComposer({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const { openModal } = useAuthModal()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const maxLength = 1000
  const remaining = maxLength - content.length

  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      textareaRef.current.focus()
      // Adjust height on focus if it was pre-filled
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [isExpanded])

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value.slice(0, maxLength))
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  const handleFocusClick = () => {
    if (!isAuthenticated) {
      openModal()
      return
    }
    setIsExpanded(true)
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const handleCancel = () => {
    setIsExpanded(false)
    if (!content.trim()) {
      setSelectedMood(null)
      setIsAnonymous(false)
    }
  }

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
      setSelectedMood(null)
      setIsExpanded(false)
    } catch (error) {
      console.error('Failed to post story:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white px-4 sm:px-6 pt-2 pb-2 sm:pb-4 transition-all duration-300">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-[48px] h-[48px] bg-slate-50 rounded-full flex items-center justify-center text-slate-300 border border-slate-200/60 shadow-sm">
            <User className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          
          {/* Textarea Container */}
          <div 
            className={`w-full bg-[#F8FAFC] rounded-2xl px-4 py-3 transition-all duration-200 border ${isFocused ? 'border-blue-500 shadow-sm bg-white' : 'border-slate-200 hover:bg-slate-100/60 hover:border-slate-300'} cursor-text`}
            onClick={!isExpanded ? handleFocusClick : undefined}
          >
            {!isExpanded ? (
              <div className="text-slate-500 font-medium text-[15px] select-none transition-opacity opacity-90">
                Bagikan ceritamu di ruang yang aman...
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                placeholder="Bagikan ceritamu di ruang yang aman..."
                className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-slate-900 text-[15px] sm:text-[16px] leading-[1.5] resize-none p-0 placeholder:text-slate-400 placeholder:font-medium placeholder:opacity-90 custom-scrollbar"
                style={{ minHeight: '44px' }}
              />
            )}
          </div>

          {isExpanded && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-400 flex flex-col gap-6">
              
              {/* Mood Selector */}
              <div>
                <h4 className="text-[13px] font-bold text-slate-400 mb-3 ml-1 tracking-wide">Bagaimana perasaanmu hari ini?</h4>
                <div className="flex flex-wrap gap-3">
                  {MOODS.map((mood) => {
                    const isSelected = selectedMood === mood.label
                    return (
                      <button
                        key={mood.label}
                        onClick={() => setSelectedMood(isSelected ? null : mood.label)}
                        className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-[13.5px] transition-all duration-200 ${
                          isSelected 
                            ? 'bg-blue-50 border border-blue-300 text-blue-700 font-bold scale-[1.03] shadow-[0_2px_8px_rgba(37,99,235,0.12)]' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:shadow-sm hover:-translate-y-0.5 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-[15px]">{mood.emoji}</span>
                        <span>{mood.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2.5 cursor-pointer group ml-1" onClick={(e) => e.preventDefault()}>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isAnonymous}
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`relative inline-flex h-[22px] w-[38px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-sm ${isAnonymous ? 'bg-blue-600' : 'bg-slate-200'}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${isAnonymous ? 'translate-x-[16px]' : 'translate-x-0'}`}
                    />
                  </button>
                  <span className="text-[13px] font-semibold text-slate-500 group-hover:text-slate-800 transition-colors" onClick={() => setIsAnonymous(!isAnonymous)}>
                    Anonim
                  </span>
                </label>
                
                <div className="flex items-center space-x-3 sm:space-x-5">
                  <span className={`text-[13px] font-semibold tracking-wide ${remaining < 100 ? 'text-rose-500' : 'text-slate-400'}`}>
                    {remaining}
                  </span>
                  <button 
                    onClick={handleCancel}
                    className="h-9 px-3 flex items-center justify-center rounded-full text-[14px] font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Batal
                  </button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!content.trim() || isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 h-9 text-[14px] font-semibold transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isSubmitting ? '...' : 'Bagikan'}
                  </Button>
                </div>
              </div>
              
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
