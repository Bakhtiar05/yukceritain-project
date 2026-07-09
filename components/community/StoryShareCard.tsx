import React, { forwardRef } from 'react'

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
}

export const StoryShareCard = forwardRef<HTMLDivElement, StoryShareCardProps>(
  ({ content, isAnonymous, profile, url }, ref) => {
    
    const displayName = isAnonymous ? 'Teman Anonim' : profile?.display_name || 'Someone'
    const displayUsername = isAnonymous ? '@anonim' : `@${profile?.username || 'user'}`

    return (
      <div
        ref={ref}
        className="w-[1080px] h-[1080px] bg-gradient-to-br from-blue-50 to-white flex flex-col relative overflow-hidden justify-center items-center"
        style={{
          width: '1080px',
          height: '1080px',
        }}
      >
        {/* Logo exactly above the card */}
        <div className="mb-[48px] z-10">
          <img src="/assets/logo-v11.png" alt="YukceritaIN Logo" className="h-[90px] object-contain drop-shadow-xl" />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[48px] p-[64px] shadow-[0_32px_80px_-20px_rgba(15,23,42,0.15)] w-[920px] relative z-10 border border-slate-100 flex flex-col min-h-[500px]">
          
          {/* Header */}
          <div className="flex items-center gap-[16px] mb-[48px] pb-[32px] border-b border-slate-100">
            <span className="text-[44px] font-bold text-slate-900 leading-none tracking-tight">
              {displayName}
            </span>
            <span className="text-[32px] text-slate-400 font-medium leading-none tracking-tight">
              •
            </span>
            <span className="text-[34px] text-slate-500 font-medium leading-none tracking-tight">
              {displayUsername}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 relative pl-[10px]">
            <p 
              className="text-[46px] text-slate-800 leading-[1.6] font-medium relative z-10"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 8,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {content}
            </p>
          </div>
        </div>
      </div>
    )
  }
)

StoryShareCard.displayName = 'StoryShareCard'
