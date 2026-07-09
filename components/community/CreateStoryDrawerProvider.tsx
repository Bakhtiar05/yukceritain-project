'use client'

import React, { createContext, useContext, useState } from 'react'

type CreateStoryDrawerContextType = {
  isOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

const CreateStoryDrawerContext = createContext<CreateStoryDrawerContextType | undefined>(undefined)

export function CreateStoryDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openDrawer = () => setIsOpen(true)
  const closeDrawer = () => setIsOpen(false)

  return (
    <CreateStoryDrawerContext.Provider value={{ isOpen, openDrawer, closeDrawer }}>
      {children}
    </CreateStoryDrawerContext.Provider>
  )
}

export function useCreateStoryDrawer() {
  const context = useContext(CreateStoryDrawerContext)
  if (context === undefined) {
    throw new Error('useCreateStoryDrawer must be used within a CreateStoryDrawerProvider')
  }
  return context
}
