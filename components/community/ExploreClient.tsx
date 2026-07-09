'use client'

import React, { useState, useEffect } from 'react'
import { useCommunityLanguage } from '@/lib/i18n/CommunityLanguageProvider'
import InfiniteFeed from '@/components/community/InfiniteFeed'

interface ExploreClientProps {
  initialPosts: any[]
  session: any
}

export default function ExploreClient({ initialPosts, session }: ExploreClientProps) {
  const { t } = useCommunityLanguage()
  const [searchInput, setSearchInput] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  // Custom debounce logic
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchInput])

  const categories = [
    'Stress', 'College', 'Work', 'Relationship', 'Family', 'Self Growth'
  ]

  const activeQuery = selectedCategory || debouncedSearch

  return (
    <div className="w-full bg-background min-h-screen">
      <div className="p-6 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">{t('explore.title')}</h2>
        
        <div className="relative mb-6">
          <input 
            type="text" 
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value)
              setSelectedCategory(null) // clear category if typing
            }}
            placeholder={t('explore.searchPlaceholder')} 
            className="w-full bg-muted border-0 rounded-full py-3 pl-12 pr-4 text-foreground focus:ring-2 focus:ring-primary outline-none transition-colors"
          />
          <svg className="w-5 h-5 absolute left-4 top-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button 
              key={category}
              onClick={() => {
                if (selectedCategory === category) {
                  setSelectedCategory(null)
                } else {
                  setSelectedCategory(category)
                  setSearchInput('') // clear input if clicking category
                }
              }}
              className={`px-4 py-2 border rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category 
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="community-feed pt-2 pb-10">
        <InfiniteFeed 
          initialPosts={initialPosts} 
          mode="explore" 
          session={session} 
          searchQuery={activeQuery}
        />
      </div>
    </div>
  )
}
