'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle } from 'lucide-react'
import { useCommentSheet } from './CommentSheetProvider'
import { fetchPostAndComments } from '@/lib/actions/community'
import ResponseCard from './ResponseCard'
import CommentComposer from './CommentComposer'
import { useAuthModal } from './AuthModalProvider'
import { useCommunityLanguage } from '@/lib/i18n/CommunityLanguageProvider'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function CommentSideSheet({ session }: { session: any }) {
  const { isOpen, activePostId, initialReplyingTo, closeSheet } = useCommentSheet()
  const { openModal } = useAuthModal()
  const { t } = useCommunityLanguage()
  
  const [loading, setLoading] = useState(true)
  const [postData, setPostData] = useState<any>(null)
  const [commentsData, setCommentsData] = useState<any[]>([])
  const [replyingTo, setReplyingTo] = useState<{ id: string; username: string } | null>(null)
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({})

  const isAuthenticated = !!session

  // Fetch data when sheet opens
  useEffect(() => {
    let isMounted = true
    
    if (isOpen && activePostId) {
      if (initialReplyingTo) {
        setReplyingTo(initialReplyingTo)
      }

      setLoading(true)
      fetchPostAndComments(activePostId)
        .then(({ post, comments }) => {
          if (!isMounted) return
          setPostData(post)
          setCommentsData(comments)
          setLoading(false)
        })
        .catch(err => {
          if (!isMounted) return
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
    
    return () => {
      isMounted = false
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
                {t('comment.title')}
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
                  <div className="flex flex-col gap-4 pb-32">
                    <h3 className="font-semibold text-sm text-muted-foreground px-2">{t('storyDetail.responses')} ({commentsData.length})</h3>
                    {commentsData.length === 0 ? (
                      <div className="text-center py-10 px-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                          <MessageCircle className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">{t('storyDetail.noResponses')}. {t('storyDetail.beTheFirst')}</p>
                      </div>
                    ) : (
                      (() => {
                        const topLevelComments = commentsData
                          .filter(c => !c.parent_id)
                          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                        return topLevelComments.map((comment, index) => {
                          const isOwner = session?.user?.id === postData.profile_id
                          const isCommenter = session?.user?.id === comment.profile_id
                          const replies = commentsData.filter(c => c.parent_id === comment.id)
                          
                          const profile = Array.isArray(comment.profile) ? comment.profile[0] : comment.profile

                          return (
                            <div key={comment.id} className="flex flex-col">
                              <ResponseCard
                                comment={comment}
                                canDelete={isOwner || isCommenter}
                                postId={activePostId!}
                                delay={index * 0.05}
                                onCommentDeleted={handleCommentDeleted}
                                onReply={() => setReplyingTo({ id: comment.id, username: profile?.username || 'user' })}
                                isActiveReply={replyingTo?.id === comment.id}
                                footerActions={
                                  replies.length > 0 && (
                                    <button
                                      onClick={() => setExpandedReplies(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                                      className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-primary transition-colors"
                                    >
                                      {expandedReplies[comment.id] ? (
                                        <>
                                          <ChevronUp className="w-3.5 h-3.5" />
                                          Tutup balasan
                                        </>
                                      ) : (
                                        <>
                                          <ChevronDown className="w-3.5 h-3.5" />
                                          Lihat {replies.length} balasan
                                        </>
                                      )}
                                    </button>
                                  )
                                }
                              />
                              {replies.length > 0 && (
                                <div className="ml-12 mt-1">
                                  <AnimatePresence>
                                    {expandedReplies[comment.id] && (
                                      <motion.div 
                                        initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                        animate={{ opacity: 1, height: 'auto', transitionEnd: { overflow: 'visible' } }}
                                        exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                        className="flex flex-col ml-1 relative mt-1"
                                      >
                                        <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-[#E5E7EB] dark:bg-[#374151] rounded-full" />
                                        {replies.map((reply, rIndex) => {
                                          const isReplyOwner = session?.user?.id === reply.profile_id
                                          const replyProfile = Array.isArray(reply.profile) ? reply.profile[0] : reply.profile
                                          return (
                                            <ResponseCard
                                              key={reply.id}
                                              comment={reply}
                                              canDelete={isOwner || isReplyOwner}
                                              postId={activePostId!}
                                              delay={(index * 0.05) + ((rIndex + 1) * 0.05)}
                                              onCommentDeleted={handleCommentDeleted}
                                              isReply
                                              onReply={() => setReplyingTo({ id: comment.id, username: replyProfile?.username || 'user' })}
                                              isActiveReply={replyingTo?.id === comment.id && replyingTo?.username === replyProfile?.username}
                                            />
                                          )
                                        })}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}
                            </div>
                          )
                        })
                      })()
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-10 text-muted-foreground">{t('comment.notFound')}</div>
              )}
            </div>

            {/* Composer Footer */}
            <div className="bg-card p-4 shrink-0">
              {activePostId && (
                <CommentComposer
                  postId={activePostId}
                  isAuthenticated={isAuthenticated}
                  onSuccess={() => {
                    setReplyingTo(null)
                    handleCommentAdded()
                  }}
                  replyingTo={replyingTo}
                  onCancelReply={() => setReplyingTo(null)}
                />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
