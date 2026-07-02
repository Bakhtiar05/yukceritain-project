import React from 'react'
import Link from 'next/link'

export default function RightSidebar() {
  return (
    <div className="flex flex-col h-full w-full space-y-8 pb-10">
      
      {/* Community Guidelines */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center">
          <span className="text-xl mr-2">📜</span>
          Community Guidelines
        </h3>
        <ul className="space-y-4">
          <li className="text-sm">
            <strong className="text-slate-800 block mb-1">Safe & Empathetic Space</strong>
            <span className="text-slate-600">Be kind and supportive. This is a judgment-free zone.</span>
          </li>
          <li className="text-sm">
            <strong className="text-slate-800 block mb-1">Protect Privacy</strong>
            <span className="text-slate-600">Never share personal information (phone numbers, addresses, etc.), yours or others.</span>
          </li>
          <li className="text-sm">
            <strong className="text-slate-800 block mb-1">Use Anonymous Wisely</strong>
            <span className="text-slate-600">The anonymous toggle is there so you can share comfortably, not for spreading hate.</span>
          </li>
          <li className="text-sm">
            <strong className="text-slate-800 block mb-1">No Spam or Promos</strong>
            <span className="text-slate-600">Let's keep the focus on sharing stories and supporting one another.</span>
          </li>
        </ul>
      </div>

      {/* Mental Health Tips */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center">
          <span className="text-xl mr-2">💡</span>
          Quick Tip
        </h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          Remember to take deep breaths. If you're feeling overwhelmed, the 4-7-8 breathing technique can help calm your nervous system.
        </p>
      </div>

      {/* Footer Links */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400 px-2">
        <Link href="/about" className="hover:text-slate-600">About</Link>
        <Link href="/blog" className="hover:text-slate-600">Blog</Link>
        <Link href="/konsultasi" className="hover:text-slate-600">Counseling</Link>
        <span>© 2026 YukCeritain</span>
      </div>

    </div>
  )
}
