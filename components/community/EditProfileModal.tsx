'use client'

import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { updateProfile } from '@/lib/actions/community'
import { Button } from '@/components/ui/button'

type EditProfileModalProps = {
  initialDisplayName: string
  initialUsername: string
  initialBio: string
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function EditProfileModal({
  initialDisplayName,
  initialUsername,
  initialBio,
  isOpen,
  setIsOpen,
}: EditProfileModalProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName)
  const [username, setUsername] = useState(initialUsername)
  const [bio, setBio] = useState(initialBio || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Basic validation
    if (!displayName.trim() || !username.trim()) {
      setError('Display name and username are required.')
      return
    }

    if (username.length < 3 || username.length > 20 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username must be 3-20 characters long and can only contain letters, numbers, and underscores.')
      return
    }

    try {
      setIsSubmitting(true)
      await updateProfile(displayName.trim(), username.trim().toLowerCase(), bio.trim())
      setIsOpen(false)
    } catch (err: any) {
      if (err.message.includes('unique constraint')) {
        setError('This username is already taken. Please choose another one.')
      } else {
        setError('Failed to update profile. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[9999] w-[92vw] max-w-md translate-x-[-50%] translate-y-[-50%] bg-card p-6 shadow-[0_10px_40px_rgba(0,0,0,0.12)] rounded-[28px] border border-border/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
            <Dialog.Title className="text-[20px] font-bold text-foreground">
              Edit Profile
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted text-muted-foreground transition-colors focus:outline-none">
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-[14px] text-[13px] font-medium border border-red-100 dark:border-red-900/30">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="displayName" className="block text-[12px] font-bold text-muted-foreground uppercase tracking-wider pl-1">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={50}
                className="w-full bg-muted border-2 border-transparent rounded-[16px] px-4 py-3 text-[15px] font-semibold text-foreground focus:outline-none focus:border-primary/30 focus:bg-background transition-all"
                placeholder="How you want to be called"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-[12px] font-bold text-muted-foreground uppercase tracking-wider pl-1">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-muted-foreground font-bold">@</span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={20}
                  className="w-full bg-muted border-2 border-transparent rounded-[16px] pl-[34px] pr-4 py-3 text-[15px] font-semibold text-foreground focus:outline-none focus:border-primary/30 focus:bg-background transition-all"
                  placeholder="username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center pl-1 pr-1">
                <label htmlFor="bio" className="block text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                  Bio
                </label>
                <span className={`text-[11px] font-bold ${bio.length >= 150 ? 'text-amber-500' : 'text-muted-foreground/60'}`}>
                  {bio.length} / 160
                </span>
              </div>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
                rows={3}
                className="w-full bg-muted border-2 border-transparent rounded-[16px] px-4 py-3 text-[15px] font-semibold text-foreground focus:outline-none focus:border-primary/30 focus:bg-background transition-all resize-none"
                placeholder="Write a short bio about yourself..."
              />
            </div>

            <div className="pt-3 flex gap-3 w-full">
              <Dialog.Close asChild>
                <button type="button" className="flex-1 h-12 bg-transparent border border-border rounded-[16px] text-[15px] font-bold text-foreground hover:bg-muted transition-colors">
                  Cancel
                </button>
              </Dialog.Close>
              <button type="submit" disabled={isSubmitting} className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white rounded-[16px] text-[15px] font-bold shadow-[0_4px_14px_rgba(37,99,235,0.25)] active:scale-95 transition-all disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
