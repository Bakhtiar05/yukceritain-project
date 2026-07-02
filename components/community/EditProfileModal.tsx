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
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[9999] w-[95vw] max-w-md translate-x-[-50%] translate-y-[-50%] bg-white p-6 shadow-xl sm:rounded-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-xl font-bold text-slate-900">
              Edit Profile
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-full p-2 hover:bg-slate-100 text-slate-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="displayName" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={50}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                placeholder="How you want to be called"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-slate-400 font-medium">@</span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={20}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  placeholder="username"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">Only letters, numbers, and underscores.</p>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none"
                placeholder="Write a short bio about yourself..."
              />
              <div className="text-right mt-1">
                <span className={`text-xs ${bio.length >= 150 ? 'text-amber-500' : 'text-slate-400'}`}>
                  {bio.length} / 160
                </span>
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <Dialog.Close asChild>
                <Button type="button" variant="outline" className="rounded-full px-5">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-sm">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
