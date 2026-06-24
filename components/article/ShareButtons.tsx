'use client'

import { useState } from 'react'

export default function ShareButtons() {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const shareWhatsApp = () => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(document.title)
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank')
  }

  return (
    <div className="flex gap-3 lg:hidden py-6 border-t border-neutral-200 mt-8">
      <button
        onClick={copyLink}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
          copied ? 'bg-green-50 border-green-300 text-green-600' : 'border-neutral-200 text-neutral-600 hover:bg-blue-50'
        }`}
      >
        {copied ? '✓ Disalin!' : '🔗 Salin Tautan'}
      </button>
      <button
        onClick={shareWhatsApp}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-green-50 transition-all"
      >
        💬 WhatsApp
      </button>
    </div>
  )
}
