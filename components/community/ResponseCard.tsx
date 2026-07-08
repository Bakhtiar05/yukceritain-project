'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MoreVertical, Trash2, AlertCircle, Flag, EyeOff } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { deleteComment } from '@/lib/actions/community'

type Profile = { display_name: string; username: string; avatar_url: string }
type Comment = {
  id: string
  profile_id: string
  content: string
  created_at: string
  profile: Profile | Profile[]
}

function formatDate(dateStr: string) {
  const d    = new Date(dateStr)
  const now  = new Date()
  const diff = now.getTime() - d.getTime()
  const m    = Math.floor(diff / 60000)
  const h    = Math.floor(diff / 3600000)
  const day  = Math.floor(diff / 86400000)
  if (m  < 1)  return 'Just now'
  if (h  < 1)  return `${m}m ago`
  if (h  < 24) return `${h}h ago`
  if (day === 1) return 'Yesterday'
  return `${day}d ago`
}

function avatarFor(username: string, url?: string) {
  return url || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(username)}`
}

const fadeUp = {
  hidden:  { opacity: 0, y: 14, scale: 0.99 },
  visible: { opacity: 1, y: 0,  scale: 1    },
}

export default function ResponseCard({
  comment,
  canDelete,
  postId,
  delay = 0,
  onCommentDeleted,
}: {
  comment: Comment
  canDelete: boolean
  postId: string
  delay?: number
  onCommentDeleted?: (commentId: string) => void
}) {
  const profile = Array.isArray(comment.profile) ? comment.profile[0] : comment.profile
  const [helpful, setHelpful]       = useState(false)
  const [helpCount, setHelpCount]   = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleHelpful = (e: React.MouseEvent) => {
    e.stopPropagation()
    const next = !helpful
    setHelpful(next)
    setHelpCount(prev => next ? prev + 1 : prev - 1)
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteComment(comment.id, postId)
      setIsDeleteOpen(false)
      if (onCommentDeleted) onCommentDeleted(comment.id)
    } catch {}
    finally { setIsDeleting(false) }
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      className="bg-card rounded-[20px] border border-border p-3.5 shadow-[0_1px_6px_rgba(0,0,0,0.04)]"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Link href={`/community/user/${profile?.username}`} className="flex-shrink-0">
            <img
              src={avatarFor(profile?.username, profile?.avatar_url)}
              alt={profile?.display_name}
              className="w-10 h-10 rounded-full object-cover bg-muted ring-2 ring-background"
            />
          </Link>
          <div>
            <Link
              href={`/community/user/${profile?.username}`}
              className="text-[15px] font-bold text-foreground hover:text-primary transition-colors leading-tight block"
            >
              {profile?.display_name}
            </Link>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[12px] text-muted-foreground font-medium">@{profile?.username}</span>
              <span className="text-[#D1D5DB] text-[10px]">·</span>
              <span className="text-[12px] text-muted-foreground font-medium">{formatDate(comment.created_at)}</span>
            </div>
          </div>
        </div>

        {/* More menu */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-muted-foreground hover:bg-muted transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1.5 w-44 bg-card rounded-[14px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-border py-1.5 z-20"
              >
                <button
                  onClick={() => { setIsMenuOpen(false) }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-semibold text-muted-foreground hover:bg-muted transition-colors"
                >
                  <Flag className="w-3.5 h-3.5 text-muted-foreground" /> Report
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false) }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-semibold text-muted-foreground hover:bg-muted transition-colors"
                >
                  <EyeOff className="w-3.5 h-3.5 text-muted-foreground" /> Hide
                </button>
                {canDelete && (
                  <>
                    <div className="h-px bg-muted my-1 mx-2" />
                    <button
                      onClick={() => { setIsMenuOpen(false); setIsDeleteOpen(true) }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" /> Delete
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <p className="text-[16px] text-foreground leading-[1.7] whitespace-pre-wrap break-words mb-3">
        {comment.content}
      </p>

      {/* Helpful button */}
      <div className="border-t border-[#F9FAFB] pt-3">
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={handleHelpful}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium transition-all duration-200 ${
            helpful
              ? 'bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE] dark:border-blue-500/30'
              : 'bg-muted text-muted-foreground border border-border hover:bg-[#EFF6FF] dark:bg-blue-500/10 hover:text-primary hover:border-[#BFDBFE] dark:border-blue-500/30'
          }`}
        >
          <span className="text-[13px]">{helpful ? '💙' : '💙'}</span>
          <span>Helpful</span>
          {helpCount > 0 && <span className="tabular-nums">{helpCount}</span>}
        </motion.button>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog.Root open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-[9999] w-[90vw] max-w-sm translate-x-[-50%] translate-y-[-50%] bg-card rounded-[24px] p-6 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <Dialog.Title className="text-[17px] font-bold text-foreground mb-2">Delete this response?</Dialog.Title>
              <Dialog.Description className="text-muted-foreground text-[14px] mb-6">This cannot be undone.</Dialog.Description>
              <div className="flex gap-3 w-full">
                <Dialog.Close asChild>
                  <button className="flex-1 px-4 py-2.5 bg-muted hover:bg-muted text-muted-foreground rounded-full font-semibold text-[14px] transition-colors">Cancel</button>
                </Dialog.Close>
                <button onClick={handleDelete} disabled={isDeleting} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-[14px] transition-colors disabled:opacity-50">
                  {isDeleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </motion.div>
  )
}
