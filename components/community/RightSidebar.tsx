'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'

const GuidelineItem = ({ title, content }: { title: string, content: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="border-b border-border last:border-0 py-2.5">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full text-left group"
      >
        <span className="text-[14px] font-bold text-foreground group-hover:text-blue-600 transition-colors">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 dark:text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-slate-400 dark:text-muted-foreground" />}
      </button>
      {isOpen && (
        <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-1">
          {content}
        </p>
      )}
    </div>
  )
}

export default function RightSidebar() {
  return (
    <div className="flex flex-col h-full w-full space-y-6 pb-10 pr-2">
      
      {/* Community Guidelines */}
      <div className="bg-card rounded-3xl p-5 border border-border/80 shadow-sm">
        <h3 className="font-bold text-foreground mb-3 flex items-center text-[14px] uppercase tracking-wider">
          <span className="text-lg mr-2">📜</span>
          Pedoman
        </h3>
        <div className="space-y-1">
          <GuidelineItem title="Ruang Aman & Empati" content="Jadilah baik dan saling mendukung. Ini adalah zona bebas penghakiman. Empati adalah nilai utama kita." />
          <GuidelineItem title="Lindungi Privasi" content="Jangan pernah membagikan informasi pribadi (nomor telepon, alamat, dll.), baik milikmu maupun orang lain." />
          <GuidelineItem title="Gunakan Anonim dengan Bijak" content="Fitur anonim ada agar kamu bisa berbagi dengan nyaman, bukan untuk menyebarkan kebencian." />
          <GuidelineItem title="Dilarang Spam atau Promosi" content="Mari tetap fokus berbagi cerita dan mendukung satu sama lain." />
        </div>
      </div>

      {/* Footer Links */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[12px] font-medium text-slate-400 dark:text-muted-foreground px-2 pt-4">
        <Link href="/about" className="hover:text-muted-foreground transition-colors">Tentang</Link>
        <Link href="/blog" className="hover:text-muted-foreground transition-colors">Blog</Link>
        <Link href="/konsultasi" className="hover:text-muted-foreground transition-colors">Konseling</Link>
        <Link href="/privacy" className="hover:text-muted-foreground transition-colors">Privasi</Link>
        <span className="w-full text-center mt-2 opacity-60">© 2026 YukCeritain</span>
      </div>

    </div>
  )
}
