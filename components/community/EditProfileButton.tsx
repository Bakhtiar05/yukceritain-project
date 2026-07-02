'use client'

import React, { useState } from 'react'
import EditProfileModal from './EditProfileModal'

type EditProfileButtonProps = {
  initialDisplayName: string
  initialUsername: string
  initialBio: string
}

export default function EditProfileButton({
  initialDisplayName,
  initialUsername,
  initialBio,
}: EditProfileButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="px-5 py-2 border border-slate-300 rounded-full font-semibold text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Edit Profile
      </button>

      {isModalOpen && (
        <EditProfileModal
          initialDisplayName={initialDisplayName}
          initialUsername={initialUsername}
          initialBio={initialBio}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
        />
      )}
    </>
  )
}
