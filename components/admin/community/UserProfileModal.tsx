'use client'

import React from 'react'
import { X, ShieldAlert, Ban, VolumeX, Mail } from 'lucide-react'

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: any // TODO: Replace with proper type
  onAction?: (action: string) => void
}

export default function UserProfileModal({ isOpen, onClose, user, onAction }: UserProfileModalProps) {
  if (!isOpen) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700'
      case 'Muted': return 'bg-amber-100 text-amber-700'
      case 'Suspended': return 'bg-orange-100 text-orange-700'
      case 'Banned': return 'bg-red-100 text-red-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <h2 className="text-lg font-bold text-slate-900">User Profile</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {user ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center space-x-4">
                <img 
                  src={user.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.username}`} 
                  alt="Avatar" 
                  className="w-16 h-16 rounded-full bg-slate-100 object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{user.display_name}</h3>
                  <p className="text-slate-500 font-medium">@{user.username}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(user.status || 'Active')}`}>
                      {user.status || 'Active'}
                    </span>
                    <span className="text-xs text-slate-400">
                      Joined {new Date(user.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                  <p className="text-2xl font-bold text-slate-900">{user.posts?.[0]?.count || 0}</p>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Posts</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                  <p className="text-2xl font-bold text-slate-900">{user.comments?.[0]?.count || 0}</p>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Comments</p>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Bio</h4>
                <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {user.bio || <span className="italic text-slate-400">No bio provided.</span>}
                </p>
              </div>

            </div>
          ) : (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Moderation Actions</h4>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => onAction?.('mute')}
              className="flex items-center justify-center bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              <VolumeX className="w-4 h-4 mr-2" />
              Mute User
            </button>
            <button 
              onClick={() => onAction?.('suspend')}
              className="flex items-center justify-center bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              <ShieldAlert className="w-4 h-4 mr-2" />
              Suspend
            </button>
            <button 
              onClick={() => onAction?.('ban')}
              className="flex items-center justify-center bg-red-600 text-white hover:bg-red-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm col-span-2"
            >
              <Ban className="w-4 h-4 mr-2" />
              Permanently Ban User
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
