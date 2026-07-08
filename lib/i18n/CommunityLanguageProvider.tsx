'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import idDict from './community/id.json'
import enDict from './community/en.json'

type Language = 'id' | 'en'

interface LanguageContextProps {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'id',
  setLanguage: () => {},
  t: (key) => key,
})

const dictionaries: Record<Language, any> = {
  id: idDict,
  en: enDict,
}

export function CommunityLanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('id')

  useEffect(() => {
    const stored = localStorage.getItem('community_language') as Language
    if (stored === 'id' || stored === 'en') {
      setLanguageState(stored)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('community_language', lang)
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let val = dictionaries[language]
    for (const k of keys) {
      if (val && typeof val === 'object') {
        val = val[k]
      } else {
        return key
      }
    }
    return typeof val === 'string' ? val : key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useCommunityLanguage = () => useContext(LanguageContext)
