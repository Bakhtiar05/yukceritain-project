'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface CommentSheetContextType {
  isOpen: boolean
  activePostId: string | null
  initialReplyingTo: { id: string; username: string } | null
  openSheet: (postId: string, replyingTo?: { id: string; username: string }) => void
  closeSheet: () => void
}

const CommentSheetContext = createContext<CommentSheetContextType | undefined>(undefined)

export function CommentSheetProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activePostId, setActivePostId] = useState<string | null>(null)
  const [initialReplyingTo, setInitialReplyingTo] = useState<{ id: string; username: string } | null>(null)

  const openSheet = (postId: string, replyingTo?: { id: string; username: string }) => {
    setActivePostId(postId)
    if (replyingTo) {
      setInitialReplyingTo(replyingTo)
    } else {
      setInitialReplyingTo(null)
    }
    setIsOpen(true)
  }

  const closeSheet = () => {
    setIsOpen(false)
    // Optional: add a slight delay before clearing activePostId to allow close animation to finish
    setTimeout(() => setActivePostId(null), 300)
  }

  return (
    <CommentSheetContext.Provider value={{ isOpen, activePostId, initialReplyingTo, openSheet, closeSheet }}>
      {children}
    </CommentSheetContext.Provider>
  )
}

export function useCommentSheet() {
  const context = useContext(CommentSheetContext)
  if (context === undefined) {
    throw new Error('useCommentSheet must be used within a CommentSheetProvider')
  }
  return context
}
