'use client'

import React from 'react'
import { X, MessageCircle, AlertTriangle, EyeOff, Trash2, RotateCcw } from 'lucide-react'

interface PostDrawerProps {
  isOpen: boolean
  onClose: () => void
  post: any // TODO: Replace with proper type
  onHide?: (id: string) => void
  onDelete?: (id: string) => void
  onRestore?: (id: string) => void
}

export default function PostDrawer({ isOpen, onClose, post, onHide, onDelete, onRestore }: PostDrawerProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <h2 className="text-lg font-bold text-slate-900">Post Details</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {post ? (
            <>
              {/* Author Info */}
              <div className="flex items-center space-x-3">
                {post.is_anonymous ? (
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl">
                    🕵️
                  </div>
                ) : (
                  <img 
                    src={post.profile?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${post.profile?.username}`} 
                    alt="Avatar" 
                    className="w-10 h-10 rounded-full bg-slate-100 object-cover"
                  />
                )}
                <div>
                  <p className="font-bold text-slate-900 text-sm">
                    {post.is_anonymous ? 'Anonymous' : post.profile?.display_name}
                  </p>
                  {!post.is_anonymous && (
                    <p className="text-slate-500 text-xs">@{post.profile?.username}</p>
                  )}
                  <p className="text-slate-400 text-xs mt-0.5">
                    {new Date(post.created_at).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Content</h3>
                <div className="bg-slate-50 p-4 rounded-xl text-slate-800 whitespace-pre-wrap text-sm leading-relaxed border border-slate-100">
                  {post.content}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                  <div className="flex items-center justify-center text-blue-500 mb-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  </div>
                  <p className="text-xl font-bold text-slate-900">{post.likes?.[0]?.count || 0}</p>
                  <p className="text-xs font-medium text-slate-500">Likes</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                  <div className="flex items-center justify-center text-slate-500 mb-1">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <p className="text-xl font-bold text-slate-900">{post.comments?.[0]?.count || 0}</p>
                  <p className="text-xs font-medium text-slate-500">Comments</p>
                </div>
                <div className="bg-rose-50 p-4 rounded-xl text-center border border-rose-100">
                  <div className="flex items-center justify-center text-rose-500 mb-1">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <p className="text-xl font-bold text-slate-900">{post.reports?.[0]?.count || 0}</p>
                  <p className="text-xs font-medium text-slate-500">Reports</p>
                </div>
              </div>
              
              {/* Status */}
              <div>
                 <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Current Status</h3>
                 <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    post.status === 'Published' ? 'bg-green-100 text-green-700' : 
                    post.status === 'Hidden' ? 'bg-amber-100 text-amber-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {post.status || 'Published'}
                 </span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
          {post?.status !== 'Published' && (
            <button 
              onClick={() => onRestore?.(post.id)}
              className="flex-1 flex items-center justify-center bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restore
            </button>
          )}
          {post?.status !== 'Hidden' && (
            <button 
              onClick={() => onHide?.(post.id)}
              className="flex-1 flex items-center justify-center bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              <EyeOff className="w-4 h-4 mr-2" />
              Hide
            </button>
          )}
          {post?.status !== 'Deleted' && (
            <button 
              onClick={() => onDelete?.(post.id)}
              className="flex-1 flex items-center justify-center bg-red-600 text-white hover:bg-red-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          )}
        </div>
      </div>
    </>
  )
}
