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
    <div className="bg-white px-3 sm:px-6 pt-2 pb-4 sm:pb-8 transition-all duration-300">
      <div className="flex gap-3 sm:gap-5">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 sm:w-[48px] sm:h-[48px] bg-slate-50 rounded-full flex items-center justify-center text-slate-300 border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <User className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col gap-4 sm:gap-6">
          
          {/* Textarea Container */}
          <div 
            className={`w-full bg-[#F8FAFC] rounded-[16px] sm:rounded-[20px] px-4 py-2.5 sm:px-5 sm:py-3.5 transition-all duration-200 border-[1.5px] ${isFocused ? 'border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.12)]' : 'border-transparent hover:bg-slate-100/60'} cursor-text`}
            onClick={!isExpanded ? handleFocusClick : undefined}
          >
            {!isExpanded ? (
              <div className="text-slate-400 text-[15px] sm:text-[16px] select-none py-1 transition-opacity opacity-80">
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
                className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-slate-800 text-[15px] sm:text-[16px] leading-[1.6] resize-none p-0 py-1 placeholder:text-slate-400 placeholder:font-normal placeholder:opacity-80 custom-scrollbar"
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
                  <span className={`text-[12px] sm:text-[12.5px] font-semibold tracking-wide ${remaining < 100 ? 'text-rose-500' : 'text-slate-300'}`}>
                    {remaining}
                  </span>
                  <button 
                    onClick={handleCancel}
                    className="text-[13px] sm:text-[14px] font-semibold text-slate-400 hover:text-slate-600 transition-colors px-1"
                  >
                    Batal
                  </button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!content.trim() || isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-5 sm:px-7 h-[38px] sm:h-[44px] text-[13px] sm:text-[14px] font-bold shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] transition-all disabled:opacity-50 border-none hover:scale-[1.02] active:scale-[0.98]"
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
