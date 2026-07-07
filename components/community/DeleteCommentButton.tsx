'use client'

import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Trash2, AlertCircle, MoreHorizontal } from 'lucide-react'
import { deleteComment } from '@/lib/actions/community'

type Props = {
  commentId: string
  postId: string
}

export default function DeleteCommentButton({ commentId, postId }: Props) {
  const [isOpen, setIsOpen]       = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteComment(commentId, postId)
      setIsOpen(false)
    } catch (e) {
      console.error(e)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 transition-colors"
          aria-label="Delete comment"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[9999] w-[90vw] max-w-sm translate-x-[-50%] translate-y-[-50%] bg-white rounded-[24px] p-6 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <Dialog.Title className="text-[17px] font-bold text-[#111827] mb-2">
              Delete this response?
            </Dialog.Title>
            <Dialog.Description className="text-[#6B7280] text-[14px] mb-6 leading-relaxed">
              This action cannot be undone.
            </Dialog.Description>
            <div className="flex gap-3 w-full">
              <Dialog.Close asChild>
                <button className="flex-1 px-4 py-2.5 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] rounded-full font-semibold text-[14px] transition-colors">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-[14px] transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
