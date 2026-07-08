'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Settings,
  BookOpen,
  Bookmark,
  Bell,
  Heart,
  Award,
  Shield,
  Edit3,
  Lock,
  Globe,
  Moon,
  ChevronRight,
  LogOut,
  User,
  MessageCircle,
  Star,
  Feather,
  BarChart3,
  X,
  ChevronLeft,
  Share2
} from 'lucide-react'
import EditProfileModal from './EditProfileModal'
import AppearanceModal from './AppearanceModal'
import LanguageModal from './LanguageModal'
import StoryCard from './StoryCard'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useCommunityLanguage } from '@/lib/i18n/CommunityLanguageProvider'

/* ─────────────────────── Types ────────────────────── */
type Profile = {
  id: string
  display_name: string
  username: string
  bio: string | null
  avatar_url: string | null
}
type Post = {
  id: string
  content: string
  is_anonymous: boolean
  created_at: string
  likes: { profile_id: string }[]
  comments: { count: number }[]
}

/* ─────────────────────── Animation helpers ─────────── */
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.42, delay, ease: 'easeOut' as const },
})

function formatDate(dateStr: string) {
  const d    = new Date(dateStr)
  const now  = new Date()
  const diff = now.getTime() - d.getTime()
  const h    = Math.floor(diff / 3600000)
  const day  = Math.floor(diff / 86400000)
  if (h  < 1)  return 'Just now'
  if (h  < 24) return `${h}h ago`
  if (day === 1) return 'Yesterday'
  return `${day}d ago`
}

/* ═══════════════════════════════════════════════════════
   PROFILE CLIENT COMPONENT
═══════════════════════════════════════════════════════ */
export default function ProfileClient({
  profile,
  posts,
  totalLikesGiven,
  session,
}: {
  profile: Profile
  posts: Post[]
  totalLikesGiven: number
  session: any
}) {
  const router = useRouter()
  const { language, t } = useCommunityLanguage()
  const [isSettingsOpen, setIsSettingsOpen]     = useState(false)
  const [isEditOpen, setIsEditOpen]     = useState(false)
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen]     = useState(false)
  const [isAnonymous, setIsAnonymous]   = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const totalSupport = posts.reduce((sum, p) => sum + p.likes.length, 0)
  const avatarUrl    = profile.avatar_url
    || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(profile.username)}`

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/community/for-you')
      router.refresh()
    } catch {}
    finally { setIsLoggingOut(false) }
  }

  const handleShare = async (e: React.MouseEvent, id: string, content: string) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/community/post/${id}`
    const title = 'YukceritaIN Community'
    const text = content.substring(0, 100) + '...'

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch (err) {}
    } else {
      try {
        await navigator.clipboard.writeText(url)
      } catch {}
    }
  }

  /* Stat items */
  const stats = [
    { label: t('profile.stories'),       value: posts.length,  icon: <Feather  className="w-4 h-4" /> },
    { label: t('profile.likes'),         value: totalLikesGiven, icon: <Heart    className="w-4 h-4" /> },
    { label: t('profile.received'),      value: totalSupport,  icon: <Star     className="w-4 h-4" /> },
  ]



  return (
    <div className="w-full min-h-screen bg-background pb-32">

      {/* ── STICKY HEADER ──────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-card/92 backdrop-blur-xl border-b border-border md:hidden">
        <div className="h-[60px] flex items-center justify-between px-4">
          <button
            onClick={() => router.back()}
            aria-label="Kembali"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-muted text-muted-foreground transition-colors active:scale-95 flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.2} />
          </button>

          <div className="flex flex-col items-center flex-1 px-3">
            <span className="text-[17px] font-bold text-foreground leading-tight tracking-tight">
              Profile
            </span>
            <span className="text-[11.5px] font-medium text-muted-foreground leading-tight mt-0.5">
              @{profile.username}
            </span>
          </div>

          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted text-muted-foreground transition-colors active:scale-95 flex-shrink-0"
          >
            <Settings className="w-5 h-5" strokeWidth={2.2} />
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 space-y-4 pt-5">

        {/* ── PROFILE HERO ───────────────────────────────── */}
        <motion.div {...fadeUp(0)} className="relative bg-card rounded-[24px] border border-border shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-6">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="absolute top-4 right-4 w-10 h-10 hidden md:flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <Settings className="w-5 h-5" strokeWidth={1.8} />
          </button>
          
          <div className="flex flex-col items-center text-center">

            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative mb-4"
            >
              <img
                src={avatarUrl}
                alt={profile.display_name}
                className="w-24 h-24 rounded-full object-cover bg-muted ring-4 ring-background shadow-[0_4px_20px_rgba(0,0,0,0.10)]"
              />
              <button
                onClick={() => setIsEditOpen(true)}
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-primary/90 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-white" />
              </button>
            </motion.div>

            {/* Name + username */}
            <h1 className="text-[24px] font-bold text-foreground leading-tight">
              {profile.display_name}
            </h1>
            <p className="text-[15px] text-muted-foreground font-medium mt-1">@{profile.username}</p>

            {/* Bio */}
            {profile.bio && (
              <p className="text-[15px] text-muted-foreground leading-relaxed mt-3 max-w-[280px] line-clamp-2">
                {profile.bio}
              </p>
            )}

            <button
              onClick={() => setIsEditOpen(true)}
              className="mt-4 h-10 px-5 rounded-full border border-border text-[14px] font-semibold text-muted-foreground hover:border-primary hover:text-primary hover:bg-[#EFF6FF] dark:bg-blue-500/10 transition-all duration-200"
            >
              {t('profile.editProfile')}
            </button>

            {/* Stats row */}
            <div className="flex items-stretch gap-px w-full mt-5 pt-5 border-t border-border">
              {stats.map((s, i) => (
                <div key={s.label} className={`flex-1 flex flex-col items-center gap-1 px-2 ${i < stats.length - 1 ? 'border-r border-border' : ''}`}>
                  <span className="text-[22px] font-bold text-foreground tabular-nums">{s.value}</span>
                  <span className="text-[12px] text-muted-foreground font-medium text-center leading-tight">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>



        {/* ── ANONYMOUS MODE CARD ────────────────────────── */}
        <motion.div {...fadeUp(0.10)} className="bg-[#EFF6FF] dark:bg-blue-500/10 rounded-[20px] border border-[#BFDBFE] dark:border-blue-500/30 p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[14px] bg-card border border-[#BFDBFE] dark:border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-primary" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#1E40AF]">{t('profile.anonymousMode')}</p>
                <p className="text-[12.5px] text-[#3B82F6] leading-snug mt-0.5 max-w-[200px]">
                  {t('profile.identityHidden')}
                </p>
              </div>
            </div>
            <motion.button
              type="button"
              role="switch"
              aria-checked={isAnonymous}
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`relative flex-shrink-0 h-6 w-11 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${isAnonymous ? 'bg-primary' : 'bg-[#CBD5E1]'}`}
            >
              <motion.span
                className="pointer-events-none absolute top-0.5 left-0.5 h-[18px] w-[18px] rounded-full bg-card shadow-sm"
                animate={{ x: isAnonymous ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </motion.div>



        {/* ── RECENT STORIES ─────────────────────────────── */}
        <motion.div {...fadeUp(0.16)} id="stories">
          <div className="flex items-center justify-between px-1 mb-3">
            <h2 className="text-[14px] font-bold text-muted-foreground uppercase tracking-wider">{t('profile.recentStories')}</h2>
            <span className="text-[12px] font-semibold text-muted-foreground">{posts.length} total</span>
          </div>

          {posts.length === 0 ? (
            <div className="bg-card rounded-[20px] border border-border p-10 flex flex-col items-center text-center">
              <span className="text-4xl mb-3">✏️</span>
              <p className="text-[15px] font-semibold text-muted-foreground">{t('profile.noStoriesYet')}</p>
              <p className="text-[13px] text-muted-foreground mt-1">{t('profile.storiesDesc')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.slice(0, 5).map((post, i) => {
                const isLikedByMe = session ? post.likes?.some((like: any) => like.profile_id === session.user.id) : false
                const commentsCount = post.comments?.[0]?.count || 0

                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.18 + i * 0.05 }}
                  >
                    <StoryCard
                      id={post.id}
                      content={post.content}
                      is_anonymous={post.is_anonymous}
                      created_at={post.created_at}
                      profile={profile as any}
                      likes_count={post.likes?.length || 0}
                      comments_count={commentsCount}
                      is_liked_by_me={isLikedByMe}
                      isAuthenticated={!!session}
                      isOwner={true}
                      index={i}
                    />
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>



        {/* Bottom actions & spacer */}
        <motion.div {...fadeUp(0.20)} className="pt-4 pb-12">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full h-12 rounded-[16px] border border-[#FECACA] bg-red-50/50 dark:bg-red-900/10 text-[15px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            {isLoggingOut ? t('profile.loggingOut') : t('profile.logout')}
          </button>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <EditProfileModal
          initialDisplayName={profile.display_name}
          initialUsername={profile.username}
          initialBio={profile.bio || ''}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
        />
      )}

      {/* Appearance Modal */}
      {isAppearanceOpen && (
        <AppearanceModal
          isOpen={isAppearanceOpen}
          setIsOpen={setIsAppearanceOpen}
        />
      )}

      {/* Language Modal */}
      {isLanguageOpen && (
        <LanguageModal
          isOpen={isLanguageOpen}
          setIsOpen={setIsLanguageOpen}
        />
      )}

      {/* Settings Modal (Moved from inline profile) */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] dark:bg-black/60"
            />
            <div className="fixed inset-0 z-[9999] flex flex-col justify-end sm:items-center sm:justify-center p-0 sm:p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full sm:max-w-md bg-card sm:rounded-[24px] rounded-t-[24px] shadow-xl border border-border overflow-hidden pointer-events-auto flex flex-col max-h-[85vh]"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border/50 flex-shrink-0">
                  <h2 className="text-[18px] font-bold text-foreground">{t('profile.settings')}</h2>
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
                  >
                    <X className="w-5 h-5" strokeWidth={2} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-5 overflow-y-auto hide-scrollbar">
                  <div className="bg-card rounded-[20px] border border-border overflow-hidden divide-y divide-border">
                    <button onClick={() => { setIsSettingsOpen(false); setIsEditOpen(true) }} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted transition-colors text-left">
                      <div className="w-9 h-9 rounded-[10px] bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0"><Edit3 className="w-4 h-4" /></div>
                      <div className="flex-1 min-w-0"><p className="text-[15px] font-semibold text-foreground leading-tight">{t('profile.editProfile')}</p><p className="text-[12.5px] text-muted-foreground mt-0.5 leading-snug truncate">{t('profile.editProfileDesc')}</p></div><ChevronRight className="w-4 h-4 text-[#CBD5E1] flex-shrink-0" />
                    </button>
                    <button onClick={() => {}} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted transition-colors text-left">
                      <div className="w-9 h-9 rounded-[10px] bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0"><Lock className="w-4 h-4" /></div>
                      <div className="flex-1 min-w-0"><p className="text-[15px] font-semibold text-foreground leading-tight">Privacy</p><p className="text-[12.5px] text-muted-foreground mt-0.5 leading-snug truncate">Control your data and visibility</p></div><ChevronRight className="w-4 h-4 text-[#CBD5E1] flex-shrink-0" />
                    </button>
                    <button onClick={() => {}} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted transition-colors text-left">
                      <div className="w-9 h-9 rounded-[10px] bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0"><Shield className="w-4 h-4" /></div>
                      <div className="flex-1 min-w-0"><p className="text-[15px] font-semibold text-foreground leading-tight">{t('profile.security')}</p><p className="text-[12.5px] text-muted-foreground mt-0.5 leading-snug truncate">{t('profile.securityDesc')}</p></div><ChevronRight className="w-4 h-4 text-[#CBD5E1] flex-shrink-0" />
                    </button>
                    <button onClick={() => { setIsSettingsOpen(false); setIsLanguageOpen(true) }} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted transition-colors text-left">
                      <div className="w-9 h-9 rounded-[10px] bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0"><Globe className="w-4 h-4" /></div>
                      <div className="flex-1 min-w-0"><p className="text-[15px] font-semibold text-foreground leading-tight">{t('profile.language')}</p><p className="text-[12.5px] text-muted-foreground mt-0.5 leading-snug truncate">{t('profile.languageDesc')}</p></div><ChevronRight className="w-4 h-4 text-[#CBD5E1] flex-shrink-0" />
                    </button>
                    <button onClick={() => { setIsSettingsOpen(false); setIsAppearanceOpen(true) }} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted transition-colors text-left">
                      <div className="w-9 h-9 rounded-[10px] bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0"><Moon className="w-4 h-4" /></div>
                      <div className="flex-1 min-w-0"><p className="text-[15px] font-semibold text-foreground leading-tight">{t('profile.appearance')}</p><p className="text-[12.5px] text-muted-foreground mt-0.5 leading-snug truncate">{t('profile.appearanceDesc')}</p></div><ChevronRight className="w-4 h-4 text-[#CBD5E1] flex-shrink-0" />
                    </button>
                    <button onClick={() => {}} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted transition-colors text-left">
                      <div className="w-9 h-9 rounded-[10px] bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0"><Bell className="w-4 h-4" /></div>
                      <div className="flex-1 min-w-0"><p className="text-[15px] font-semibold text-foreground leading-tight">Notifications</p><p className="text-[12.5px] text-muted-foreground mt-0.5 leading-snug truncate">Manage alerts and reminders</p></div><ChevronRight className="w-4 h-4 text-[#CBD5E1] flex-shrink-0" />
                    </button>
                  </div>
                </div>

                {/* Footer (Always Visible) */}
                <div className="p-5 pt-0 border-t border-border/50 bg-card mt-auto flex-shrink-0">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full h-12 mt-4 rounded-[16px] border border-[#FECACA] text-[15px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 dark:bg-red-900/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <LogOut className="w-4 h-4" />
                    {isLoggingOut ? t('profile.loggingOut') : t('profile.logout')}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
