'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle } from 'lucide-react'
import { useCommentSheet } from './CommentSheetProvider'
import { fetchPostAndComments } from '@/lib/actions/community'
import ResponseCard from './ResponseCard'
import CommentComposer from './CommentComposer'
import { useAuthModal } from './AuthModalProvider'

export default function CommentSideSheet({ session }: { session: any }) {
  const { isOpen, activePostId, closeSheet } = useCommentSheet()
  const { openModal } = useAuthModal()
  
  const [loading, setLoading] = useState(true)
  const [postData, setPostData] = useState<any>(null)
  const [commentsData, setCommentsData] = useState<any[]>([])

  const isAuthenticated = !!session

  // Fetch data when sheet opens
  useEffect(() => {
    if (isOpen && activePostId) {
      setLoading(true)
      fetchPostAndComments(activePostId)
        .then(({ post, comments }) => {
          setPostData(post)
          setCommentsData(comments)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    } else {
      // Clear data when closed
      if (!isOpen) {
        setTimeout(() => {
          setPostData(null)
          setCommentsData([])
        }, 300)
      }
    }
  }, [isOpen, activePostId])

  const handleCommentAdded = () => {
    if (activePostId) {
      fetchPostAndComments(activePostId).then(({ comments }) => {
        setCommentsData(comments)
      })
    }
  }

  const handleCommentDeleted = (commentId: string) => {
    setCommentsData(prev => prev.filter(c => c.id !== commentId))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-start items-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={closeSheet}
          />

          {/* Popup (Left Slide-Over) */}
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md h-[85vh] max-h-[800px] bg-card rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-border bg-card z-10 shrink-0">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Comments
              </h2>
              <button
                onClick={closeSheet}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted-foreground/20 text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-6">
              {loading ? (
                <div className="flex flex-col gap-4 animate-pulse">
                  <div className="h-32 bg-muted rounded-[20px]"></div>
                  <div className="h-24 bg-muted rounded-[20px]"></div>
                  <div className="h-24 bg-muted rounded-[20px]"></div>
                </div>
              ) : postData ? (
                <>


                  {/* Comments List */}
                  <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-sm text-muted-foreground px-2">Responses ({commentsData.length})</h3>
                    {commentsData.length === 0 ? (
                      <div className="text-center py-10 px-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                          <MessageCircle className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">No responses yet. Be the first to share your thoughts.</p>
                      </div>
                    ) : (
                      commentsData.map((comment, index) => {
                        const isOwner = session?.user?.id === postData.profile_id
                        const isCommenter = session?.user?.id === comment.profile_id
                        return (
                          <ResponseCard
                            key={comment.id}
                            comment={comment}
                            canDelete={isOwner || isCommenter}
                            postId={activePostId!}
                            delay={index * 0.05}
                            onCommentDeleted={handleCommentDeleted}
                          />
                        )
                      })
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-10 text-muted-foreground">Post not found.</div>
              )}
            </div>

            {/* Composer Footer */}
            <div className="border-t border-border bg-card p-4 shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
              {activePostId && (
                <CommentComposer
                  postId={activePostId}
                  isAuthenticated={isAuthenticated}
                  onSuccess={handleCommentAdded}
                />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
