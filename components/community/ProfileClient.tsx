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
  const [activeTab, setActiveTab] = useState<'aktivitas' | 'cerita' | 'pengaturan'>('pengaturan')
  const [isEditOpen, setIsEditOpen]     = useState(false)
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
      <header className="sticky top-0 z-40 bg-white dark:bg-background md:hidden">
        <div className="h-[60px] flex items-center px-4">
          <button
            onClick={() => router.back()}
            aria-label="Kembali"
            className="flex items-center justify-center text-[#9CA3AF] hover:text-foreground transition-colors active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={1.75} />
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 space-y-6 pt-5">
        {/* ── PROFILE HERO ───────────────────────────────── */}
        <motion.div {...fadeUp(0)} className="relative bg-white dark:bg-background p-6">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative mb-6"
            >
              <img
                src={avatarUrl}
                alt={profile.display_name}
                className="w-24 h-24 rounded-full object-cover bg-muted shadow-sm"
              />
              <button
                onClick={() => setIsEditOpen(true)}
                className="absolute bottom-0 right-0 w-8 h-8 bg-[#2563EB] dark:bg-primary rounded-full flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity"
              >
                <Edit3 className="w-4 h-4 text-white" strokeWidth={2} />
              </button>
            </motion.div>

            {/* Name + username */}
            <h1 className="text-[24px] font-bold text-foreground leading-tight">
              {profile.display_name}
            </h1>
            <p className="text-[15px] text-[#9CA3AF] font-medium mt-1">@{profile.username}</p>

            {/* Bio */}
            {profile.bio && (
              <p className="text-[15px] text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed mt-4 max-w-[280px] line-clamp-2">
                {profile.bio}
              </p>
            )}

            {/* Stats row */}
            <div className="flex items-stretch w-full mt-8 gap-4">
              {stats.map((s, i) => (
                <div key={s.label} className="flex-1 flex flex-col items-center gap-1.5 px-2">
                  <span className="text-[22px] font-bold text-foreground tabular-nums leading-none">{s.value}</span>
                  <span className="text-[12px] text-[#9CA3AF] font-medium text-center leading-tight uppercase tracking-wider">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── TABS ───────────────────────────────────────── */}
        <motion.div {...fadeUp(0.05)} className="bg-[#F1F5F9] dark:bg-slate-800/60 p-1.5 rounded-full flex items-center shadow-inner">
          <button 
             onClick={() => setActiveTab('aktivitas')}
             className={`flex-1 text-center text-[14px] font-semibold py-2.5 rounded-full transition-all ${activeTab === 'aktivitas' ? 'bg-white dark:bg-card shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
             Aktivitas
          </button>
          <button 
             onClick={() => setActiveTab('cerita')}
             className={`flex-1 text-center text-[14px] font-semibold py-2.5 rounded-full transition-all ${activeTab === 'cerita' ? 'bg-white dark:bg-card shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
             {t('profile.myStories')}
          </button>
          <button 
             onClick={() => setActiveTab('pengaturan')}
             className={`flex-1 text-center text-[14px] font-semibold py-2.5 rounded-full transition-all ${activeTab === 'pengaturan' ? 'bg-white dark:bg-card shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
             Pengaturan
          </button>
        </motion.div>

        {/* ── TAB CONTENTS ───────────────────────────────── */}
        <div className="pb-12 min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'aktivitas' && (
              <motion.div key="aktivitas" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} transition={{duration: 0.2}}>
                <div className="space-y-4">
                  {/* removed anonymous mode */}
                </div>
              </motion.div>
            )}

            {activeTab === 'cerita' && (
              <motion.div key="cerita" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} transition={{duration: 0.2}}>
                {/* RECENT STORIES */}
                {posts.length === 0 ? (
                  <div className="bg-card rounded-[20px] border border-border p-10 flex flex-col items-center text-center">
                    <span className="text-4xl mb-3">✏️</span>
                    <p className="text-[15px] font-semibold text-muted-foreground">{t('profile.noStoriesYet')}</p>
                    <p className="text-[13px] text-muted-foreground mt-1">{t('profile.storiesDesc')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {posts.map((post, i) => {
                      const isLikedByMe = session ? post.likes?.some((like: any) => like.profile_id === session.user.id) : false
                      const commentsCount = post.comments?.[0]?.count || 0

                      return (
                        <StoryCard
                          key={post.id}
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
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'pengaturan' && (
              <motion.div key="pengaturan" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} transition={{duration: 0.2}}>
                {/* SETTINGS CARD */}
                <div className="bg-white dark:bg-background overflow-hidden px-4">
                  <div className="flex flex-col gap-2">
                    {/* Edit Profile */}
                    <button onClick={() => setIsEditOpen(true)} className="w-full flex items-center justify-between py-5 group text-left transition-opacity hover:opacity-80">
                      <div className="flex items-center gap-6">
                        <div className="text-[#9CA3AF] group-hover:text-[#2563EB] dark:group-hover:text-primary transition-colors">
                          <Edit3 className="w-6 h-6" strokeWidth={1.75} />
                        </div>
                        <div>
                          <p className="text-[16px] font-semibold text-foreground leading-tight">{t('profile.editProfile')}</p>
                          <p className="text-[13px] text-[#9CA3AF] mt-1 leading-snug">{t('profile.editProfileDesc')}</p>
                        </div>
                      </div>
                    </button>
                    {/* Privacy */}
                    <button onClick={() => {}} className="w-full flex items-center justify-between py-5 group text-left transition-opacity hover:opacity-80">
                      <div className="flex items-center gap-6">
                        <div className="text-[#9CA3AF] group-hover:text-[#2563EB] dark:group-hover:text-primary transition-colors">
                          <Lock className="w-6 h-6" strokeWidth={1.75} />
                        </div>
                        <div>
                          <p className="text-[16px] font-semibold text-foreground leading-tight">Privacy</p>
                          <p className="text-[13px] text-[#9CA3AF] mt-1 leading-snug">Control your data and visibility</p>
                        </div>
                      </div>
                    </button>
                    {/* Security */}
                    <button onClick={() => {}} className="w-full flex items-center justify-between py-5 group text-left transition-opacity hover:opacity-80">
                      <div className="flex items-center gap-6">
                        <div className="text-[#9CA3AF] group-hover:text-[#2563EB] dark:group-hover:text-primary transition-colors">
                          <Shield className="w-6 h-6" strokeWidth={1.75} />
                        </div>
                        <div>
                          <p className="text-[16px] font-semibold text-foreground leading-tight">{t('profile.security')}</p>
                          <p className="text-[13px] text-[#9CA3AF] mt-1 leading-snug">{t('profile.securityDesc')}</p>
                        </div>
                      </div>
                    </button>
                    {/* Language */}
                    <button onClick={() => setIsLanguageOpen(true)} className="w-full flex items-center justify-between py-5 group text-left transition-opacity hover:opacity-80">
                      <div className="flex items-center gap-6">
                        <div className="text-[#9CA3AF] group-hover:text-[#2563EB] dark:group-hover:text-primary transition-colors">
                          <Globe className="w-6 h-6" strokeWidth={1.75} />
                        </div>
                        <div>
                          <p className="text-[16px] font-semibold text-foreground leading-tight">{t('profile.language')}</p>
                          <p className="text-[13px] text-[#9CA3AF] mt-1 leading-snug">{t('profile.languageDesc')}</p>
                        </div>
                      </div>
                    </button>
                    {/* Notifications */}
                    <button onClick={() => {}} className="w-full flex items-center justify-between py-5 group text-left transition-opacity hover:opacity-80">
                      <div className="flex items-center gap-6">
                        <div className="text-[#9CA3AF] group-hover:text-[#2563EB] dark:group-hover:text-primary transition-colors">
                          <Bell className="w-6 h-6" strokeWidth={1.75} />
                        </div>
                        <div>
                          <p className="text-[16px] font-semibold text-foreground leading-tight">Notifications</p>
                          <p className="text-[13px] text-[#9CA3AF] mt-1 leading-snug">Manage alerts and reminders</p>
                        </div>
                      </div>
                    </button>
                  </div>
                  {/* LOGOUT */}
                  <div className="py-8 mt-4">
                    <button onClick={handleLogout} disabled={isLoggingOut} className="w-full flex items-center gap-6 group text-left disabled:opacity-50 transition-opacity hover:opacity-80">
                      <div className="text-[#EF4444] group-hover:text-[#DC2626] transition-colors">
                        <LogOut className="w-6 h-6" strokeWidth={1.75} />
                      </div>
                      <div className="text-[16px] font-semibold text-[#EF4444] group-hover:text-[#DC2626] transition-colors leading-tight">
                        {isLoggingOut ? t('profile.loggingOut') : "Keluar Akun"}
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
