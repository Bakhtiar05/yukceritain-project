'use client'

import React from 'react'
import { useCommunityLanguage } from '@/lib/i18n/CommunityLanguageProvider'

export default function ExplorePage() {
  const { t } = useCommunityLanguage()

  const categories = [
    'Stress', 'College', 'Work', 'Relationship', 'Family', 'Self Growth'
  ]

  return (
    <div className="w-full bg-background min-h-screen">
      <div className="p-6 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">{t('explore.title')}</h2>
        
        <div className="relative mb-6">
          <input 
            type="text" 
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
              className="px-4 py-2 bg-muted border border-border rounded-full text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-border transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="p-12 text-center text-muted-foreground">
        <div className="text-4xl mb-4">🔍</div>
        <p>{t('explore.emptyState')}</p>
      </div>
    </div>
  )
}
