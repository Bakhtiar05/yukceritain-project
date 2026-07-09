import React, { forwardRef } from 'react'
import { MessageCircle, Navigation, Lock, User, ChevronDown } from 'lucide-react'

type Profile = {
  display_name?: string
  username?: string
  avatar_url?: string
}

type StoryShareCardProps = {
  content: string
  isAnonymous: boolean
  profile?: Profile
  url: string
  aspectRatio?: '4:5' | '9:16'
  theme?: 'light' | 'dark'
}

const DotGrid = ({ className, theme }: { className?: string; theme?: 'light' | 'dark' }) => (
  <svg width="120" height="120" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle fill={theme === 'dark' ? '#334155' : '#94a3b8'} cx="3" cy="3" r="3"></circle>
      </pattern>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)"></rect>
  </svg>
)

export const StoryShareCard = forwardRef<HTMLDivElement, StoryShareCardProps>(
  ({ content, isAnonymous, profile, url, aspectRatio = '4:5', theme = 'light' }, ref) => {
    
    const displayName = isAnonymous ? 'Teman Anonim' : profile?.display_name || 'Someone'
    const displayUsername = isAnonymous ? '@anonim' : `@${profile?.username || 'user'}`

    const height = aspectRatio === '9:16' ? 1920 : 1350
    const cardHeight = 700
    
    const words = content.trim().split(/\s+/)
    const maxWords = 10
    const displayContent = words.length > maxWords ? words.slice(0, maxWords).join(' ') + '....' : content

    return (
      <div
        ref={ref}
        className={`flex flex-col relative overflow-hidden justify-center items-center font-sans ${theme === 'dark' ? 'dark' : ''}`}
        style={{
          width: '1080px',
          height: `${height}px`,
          backgroundColor: theme === 'dark' ? '#0F172A' : '#F3F8FF',
        }}
      >
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-200/50 dark:bg-blue-900/40 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-300/40 dark:bg-blue-800/30 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Background Dots Pattern (Left & Right) */}
        <DotGrid className="absolute top-[30%] left-[6%] opacity-40 pointer-events-none" theme={theme} />
        <DotGrid className="absolute top-[45%] right-[6%] opacity-40 pointer-events-none" theme={theme} />

        {/* Logo exactly above the card */}
        <div className="mb-[40px] z-10 flex flex-col items-center">
          <img 
            src={typeof window !== 'undefined' ? `${window.location.origin}/assets/logo-v11.png` : '/assets/logo-v11.png'} 
            alt="YukceritaIN Logo" 
            className={`h-[80px] object-contain drop-shadow-xl ${theme === 'dark' ? 'invert brightness-0' : ''}`} 
            crossOrigin="anonymous"
          />
        </div>

        {/* Bottom Pagination Dots & Chevron */}
        <div className="absolute bottom-[6%] flex flex-col items-center gap-6 opacity-80">
          <div className="flex gap-4">
            <div className="w-[16px] h-[16px] rounded-full bg-[#3B82F6]" />
            <div className="w-[16px] h-[16px] rounded-full bg-blue-200 dark:bg-blue-900/50" />
            <div className="w-[16px] h-[16px] rounded-full bg-blue-200 dark:bg-blue-900/50" />
          </div>
          <ChevronDown className="w-[40px] h-[40px] text-[#3B82F6] stroke-[4px]" />
        </div>

        {/* Main Card */}
        <div 
          className="bg-white dark:bg-[#1E293B] rounded-[40px] p-[64px] shadow-[0_40px_100px_-20px_rgba(40,100,200,0.15)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] w-[880px] relative z-10 flex flex-col border border-transparent dark:border-slate-700/50"
          style={{ height: `${cardHeight}px` }}
        >
          
          {/* Header */}
          <div className="flex items-center justify-between mb-[56px]">
            <div className="flex items-center gap-[24px]">
              <div className="w-[90px] h-[90px] rounded-full bg-[#1E1E1E] flex items-center justify-center shadow-lg relative overflow-hidden">
                <User className="w-[48px] h-[48px] text-white/50" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10" />
              </div>
              <div className="flex flex-col">
                <span className="text-[36px] font-bold text-slate-900 dark:text-white leading-tight">
                  {displayName}
                </span>
                <span className="text-[26px] text-slate-500 dark:text-slate-400 leading-tight mt-1">
                  {displayUsername}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-[#EEF5FF] dark:bg-blue-900/20 text-[#2563EB] dark:text-blue-400 px-[24px] py-[14px] rounded-full border border-blue-100 dark:border-blue-800/30">
              <Lock className="w-[22px] h-[22px] stroke-[2.5px]" />
              <span className="text-[22px] font-bold tracking-wide">
                {isAnonymous ? 'Anonim' : 'Publik'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 relative mb-[40px]">
            <p 
              className="text-[48px] font-bold text-[#1e293b] dark:text-slate-100 leading-[1.4] tracking-tight relative z-10"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 5,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                wordBreak: 'break-word',
              }}
            >
              {displayContent}
            </p>
            {/* Read More CTA */}
            <p className="mt-[24px] text-[22px] font-bold text-blue-500 dark:text-blue-400 opacity-90">
              Read more on yukceritain.id
            </p>
          </div>

          {/* Footer */}
          <div className="mt-auto border-t border-slate-100 dark:border-slate-700/50 pt-[32px]">
            <div className="bg-[#3B82F6] text-white px-[32px] py-[16px] rounded-full inline-flex items-center gap-[12px] shadow-[0_20px_40px_-10px_rgba(59,130,246,0.4)]">
              <MessageCircle className="w-[24px] h-[24px]" />
              <span className="text-[20px] font-bold tracking-wide">Yuk, Cerita Sekarang</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

StoryShareCard.displayName = 'StoryShareCard'
