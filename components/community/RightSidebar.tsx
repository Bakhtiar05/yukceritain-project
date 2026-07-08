'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, TrendingUp, BarChart3, Users, HeartHandshake, CalendarClock } from 'lucide-react'

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
      
      {/* Daily Mental Health Tip */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 rounded-3xl p-5 border border-indigo-100/50 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md transition-all">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-100/50 rounded-full blur-2xl group-hover:bg-blue-200/50 transition-colors"></div>
        <div className="relative z-10">
          <h3 className="font-bold text-indigo-900 mb-2 flex items-center text-[15px]">
            <span className="text-xl mr-2">🌱</span>
            Inspirasi Harian
          </h3>
          <p className="text-[14px] text-indigo-800/80 leading-relaxed">
            Jangan lupa bernapas dalam. Teknik pernapasan 4-7-8 bisa membantumu lebih tenang.
          </p>
        </div>
      </div>

      {/* Today's Mood Distribution */}
      <div className="bg-card rounded-3xl p-5 border border-border/80 shadow-sm">
        <h3 className="font-bold text-foreground mb-4 flex items-center text-[14px] uppercase tracking-wider">
          <BarChart3 className="w-4 h-4 mr-2 text-blue-500" />
          Suasana Komunitas
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center space-x-2"><span className="text-lg">😌</span> <span>Tenang</span></span>
            <span className="text-muted-foreground font-medium">42%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '42%' }}></div>
          </div>
          
          <div className="flex items-center justify-between text-sm pt-1">
            <span className="flex items-center space-x-2"><span className="text-lg">😰</span> <span>Cemas</span></span>
            <span className="text-muted-foreground font-medium">28%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '28%' }}></div>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-card rounded-3xl p-5 border border-border/80 shadow-sm">
        <h3 className="font-bold text-foreground mb-4 flex items-center text-[14px] uppercase tracking-wider">
          <TrendingUp className="w-4 h-4 mr-2 text-rose-500" />
          Topik Hangat
        </h3>
        <div className="flex flex-wrap gap-2">
          {['#burnout', '#relationships', '#career-anxiety', '#healing', '#self-love'].map((tag) => (
            <Link key={tag} href={`/community/explore?tag=${tag.replace('#', '')}`} className="px-3 py-1.5 bg-muted hover:bg-blue-50 dark:hover:bg-blue-500/10 dark:bg-blue-500/10 dark:hover:bg-blue-500/10 dark:bg-blue-500/10 text-muted-foreground hover:text-blue-700 text-[13px] font-medium rounded-lg transition-colors border border-border">
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Community Statistics */}
      <div className="bg-card rounded-3xl p-5 border border-border/80 shadow-sm">
        <h3 className="font-bold text-foreground mb-4 flex items-center text-[14px] uppercase tracking-wider">
          <Users className="w-4 h-4 mr-2 text-indigo-500" />
          Dampak Hari Ini
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted rounded-2xl border border-border">
            <div className="text-xl mb-1">📝</div>
            <div className="text-lg font-bold text-foreground">124</div>
            <div className="text-[11px] font-medium text-muted-foreground uppercase">Cerita Dibagikan</div>
          </div>
          <div className="p-3 bg-muted rounded-2xl border border-border">
            <div className="text-xl mb-1">🫂</div>
            <div className="text-lg font-bold text-foreground">892</div>
            <div className="text-[11px] font-medium text-muted-foreground uppercase">Pelukan Dikirim</div>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions & Volunteers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border/80 shadow-sm group cursor-pointer hover:border-blue-200 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-foreground">12 Relawan</div>
              <div className="text-[12px] text-muted-foreground">Sedang aktif</div>
            </div>
          </div>
        </div>
        
        <Link href="/konsultasi" className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border/80 shadow-sm group cursor-pointer hover:border-blue-200 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-foreground">Butuh Konseling?</div>
              <div className="text-[12px] text-muted-foreground">Pesan sesi hari ini</div>
            </div>
          </div>
        </Link>
      </div>

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
