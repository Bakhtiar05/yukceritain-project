'use client'

import React, { useState } from 'react'
import { X, ShieldCheck, Trash2, Ban } from 'lucide-react'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  report: any
  onResolve?: (id: string, action: string, note: string) => void
}

export default function ReportModal({ isOpen, onClose, report, onResolve }: ReportModalProps) {
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleAction = async (action: string) => {
    if (!onResolve) return
    setIsSubmitting(true)
    await onResolve(report.id, action, note)
    setIsSubmitting(false)
    setNote('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900">Review Report</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {report ? (
            <div className="space-y-6">
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-rose-800 mb-1">Reason for report</h3>
                <p className="text-rose-600 font-medium">{report.reason}</p>
                {report.description && (
                  <p className="text-sm text-rose-700/80 mt-2">"{report.description}"</p>
                )}
                <div className="mt-3 text-xs text-rose-500">
                  Reported by: <span className="font-semibold">{report.reporter?.display_name || 'Unknown'}</span> • {new Date(report.created_at).toLocaleString('id-ID')}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Content</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {report.post?.content || report.comment?.content || <span className="italic text-slate-400">Content not found or deleted</span>}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Resolution Note (Optional)</h3>
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white resize-none"
                  rows={3}
                  placeholder="Leave a note for other admins..."
                />
              </div>
            </div>
          ) : (
             <div className="flex justify-center p-8">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
             </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-3">
          <button 
            disabled={isSubmitting}
            onClick={() => handleAction('ignore')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors disabled:opacity-50"
          >
            <ShieldCheck className="w-5 h-5 mb-1" />
            <span className="text-xs font-semibold">Keep Content</span>
          </button>
          
          <button 
            disabled={isSubmitting}
            onClick={() => handleAction('delete_content')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5 mb-1" />
            <span className="text-xs font-semibold">Delete Content</span>
          </button>
          
          <button 
            disabled={isSubmitting}
            onClick={() => handleAction('ban_user')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Ban className="w-5 h-5 mb-1" />
            <span className="text-xs font-semibold">Ban User</span>
          </button>
        </div>
      </div>
    </div>
  )
}
