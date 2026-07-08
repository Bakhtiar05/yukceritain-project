'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
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
} from 'lucide-react'
import EditProfileModal from './EditProfileModal'
import AppearanceModal from './AppearanceModal'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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
  const [isEditOpen, setIsEditOpen]     = useState(false)
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false)
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

  /* Stat items */
  const stats = [
    { label: 'Stories',       value: posts.length,  icon: <Feather  className="w-4 h-4" /> },
    { label: 'Support Given', value: totalLikesGiven, icon: <Heart   className="w-4 h-4" /> },
    { label: 'Received',      value: totalSupport,  icon: <Star     className="w-4 h-4" /> },
  ]

  /* Quick action grid */
  const quickActions = [
    { icon: <BookOpen className="w-5 h-5" />,  label: 'My Stories',    href: '#stories' },
    { icon: <Bookmark className="w-5 h-5" />,  label: 'Bookmarks',     href: '#' },
    { icon: <Heart    className="w-5 h-5" />,  label: 'Support History', href: '#' },
    { icon: <Award    className="w-5 h-5" />,  label: 'Achievements',  href: '#' },
    { icon: <Bell     className="w-5 h-5" />,  label: 'Notifications', href: '#' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'My Stats',      href: '#' },
  ]

  /* Settings items */
  const settingItems = [
    { icon: <Edit3  className="w-4 h-4" />, title: 'Edit Profile',   desc: 'Update your name, username, bio', action: () => setIsEditOpen(true) },
    { icon: <Lock   className="w-4 h-4" />, title: 'Privacy',        desc: 'Control your data and visibility', action: () => {} },
    { icon: <Shield className="w-4 h-4" />, title: 'Security',       desc: 'Password and login settings',      action: () => {} },
    { icon: <Globe  className="w-4 h-4" />, title: 'Language',       desc: 'Bahasa Indonesia',                 action: () => {} },
    { icon: <Moon   className="w-4 h-4" />, title: 'Appearance',     desc: 'Theme and display settings',       action: () => setIsAppearanceOpen(true) },
    { icon: <Bell   className="w-4 h-4" />, title: 'Notifications',  desc: 'Manage alerts and reminders',      action: () => {} },
  ]

  /* Achievements */
  const achievements = [
    { emoji: '🌱', label: 'First Story',    color: '#D1FAE5', textColor: '#065F46' },
    { emoji: '💙', label: 'Supporter',      color: '#DBEAFE', textColor: '#1E40AF' },
    { emoji: '💡', label: 'Helpful Member', color: '#FEF9C3', textColor: '#92400E' },
    { emoji: '🌟', label: 'Trusted Member', color: '#EDE9FE', textColor: '#4C1D95' },
    { emoji: '🤝', label: 'Community Hero', color: '#FFE4E6', textColor: '#9F1239' },
  ]

  return (
    <div className="w-full min-h-screen bg-background pb-32">

      {/* ── STICKY HEADER ──────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-card/92 backdrop-blur-xl border-b border-border md:hidden">
        <div className="h-16 flex items-center justify-between px-4">
          <span className="text-[17px] font-bold text-foreground">Profile</span>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors">
            <Settings className="w-5 h-5" strokeWidth={1.8} />
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 space-y-4 pt-5">

        {/* ── PROFILE HERO ───────────────────────────────── */}
        <motion.div {...fadeUp(0)} className="bg-card rounded-[24px] border border-border shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-6">
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

            {/* Edit button */}
            <button
              onClick={() => setIsEditOpen(true)}
              className="mt-4 h-10 px-5 rounded-[14px] border border-border text-[14px] font-semibold text-muted-foreground hover:border-primary hover:text-primary hover:bg-[#EFF6FF] dark:bg-blue-500/10 transition-all duration-200"
            >
              Edit Profile
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

        {/* ── QUICK ACTIONS ──────────────────────────────── */}
        <motion.div {...fadeUp(0.06)}>
          <h2 className="text-[14px] font-bold text-muted-foreground uppercase tracking-wider px-1 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.08 + i * 0.04 }}
                className="bg-card rounded-[20px] border border-border p-4 flex flex-col items-center gap-2.5 hover:border-primary hover:shadow-[0_2px_12px_rgba(37,99,235,0.08)] transition-all duration-200 active:scale-95"
              >
                <div className="w-10 h-10 rounded-[12px] bg-muted flex items-center justify-center text-muted-foreground">
                  {item.icon}
                </div>
                <span className="text-[12px] font-semibold text-muted-foreground text-center leading-tight">{item.label}</span>
              </motion.a>
            ))}
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
                <p className="text-[15px] font-bold text-[#1E40AF]">Anonymous Mode</p>
                <p className="text-[12.5px] text-[#3B82F6] leading-snug mt-0.5 max-w-[200px]">
                  Your identity stays hidden when sharing stories.
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

        {/* ── ACHIEVEMENTS ───────────────────────────────── */}
        <motion.div {...fadeUp(0.13)}>
          <h2 className="text-[14px] font-bold text-muted-foreground uppercase tracking-wider px-1 mb-3">Achievements</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 hide-scrollbar">
            {achievements.map((a) => (
              <div
                key={a.label}
                className="flex-shrink-0 flex flex-col items-center gap-2 px-4 py-3.5 rounded-[18px] border border-border bg-card min-w-[90px]"
                style={{ borderColor: a.color }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-2xl"
                  style={{ background: a.color }}
                >
                  {a.emoji}
                </div>
                <span className="text-[11px] font-bold text-center leading-tight" style={{ color: a.textColor }}>
                  {a.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── RECENT STORIES ─────────────────────────────── */}
        <motion.div {...fadeUp(0.16)} id="stories">
          <div className="flex items-center justify-between px-1 mb-3">
            <h2 className="text-[14px] font-bold text-muted-foreground uppercase tracking-wider">Recent Stories</h2>
            <span className="text-[12px] font-semibold text-muted-foreground">{posts.length} total</span>
          </div>

          {posts.length === 0 ? (
            <div className="bg-card rounded-[20px] border border-border p-10 flex flex-col items-center text-center">
              <span className="text-4xl mb-3">✏️</span>
              <p className="text-[15px] font-semibold text-muted-foreground">No stories yet</p>
              <p className="text-[13px] text-muted-foreground mt-1">Your shared stories will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.slice(0, 5).map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.18 + i * 0.05 }}
                >
                  <Link
                    href={`/community/post/${post.id}`}
                    className="block bg-card rounded-[20px] border border-border p-5 hover:border-primary hover:shadow-[0_2px_12px_rgba(37,99,235,0.06)] transition-all duration-200"
                  >
                    {post.is_anonymous && (
                      <span className="community-badge-anon mb-2 inline-flex">🛡 Anonymous</span>
                    )}
                    <p className="text-[15px] text-foreground leading-relaxed line-clamp-2 mb-3">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-[13px] text-muted-foreground font-medium">
                      <span>{formatDate(post.created_at)}</span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" /> {post.comments[0]?.count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" /> {post.likes.length}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── SETTINGS ───────────────────────────────────── */}
        <motion.div {...fadeUp(0.20)}>
          <h2 className="text-[14px] font-bold text-muted-foreground uppercase tracking-wider px-1 mb-3">Account</h2>
          <div className="bg-card rounded-[20px] border border-border overflow-hidden divide-y divide-border">
            {settingItems.map((item) => (
              <button
                key={item.title}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-[10px] bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-foreground leading-tight">{item.title}</p>
                  <p className="text-[12.5px] text-muted-foreground mt-0.5 leading-snug truncate">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#CBD5E1] flex-shrink-0" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── LOGOUT ─────────────────────────────────────── */}
        <motion.div {...fadeUp(0.24)}>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full h-12 rounded-[16px] border border-[#FECACA] text-[15px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 dark:bg-red-900/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            {isLoggingOut ? 'Logging out…' : 'Log Out'}
          </button>
        </motion.div>

        {/* Bottom spacer */}
        <div className="h-4" />
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
    </div>
  )
}
