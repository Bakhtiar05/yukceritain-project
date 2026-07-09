'use client'

import React, { useRef, useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Image as ImageIcon, Link as LinkIcon, Share2, Download, Check, Loader2 } from 'lucide-react'
import { useShareImage } from '@/hooks/useShareImage'
import { StoryShareCard } from './StoryShareCard'
import { useCommunityLanguage } from '@/lib/i18n/CommunityLanguageProvider'

type Profile = {
  display_name?: string
  username?: string
  avatar_url?: string
}

type ShareModalProps = {
  isOpen: boolean
  onClose: () => void
  post: {
    id: string
    content: string
    is_anonymous: boolean
    profile: Profile
  }
}

export default function ShareModal({ isOpen, onClose, post }: ShareModalProps) {
  const { t } = useCommunityLanguage()
  const [view, setView] = useState<'options' | 'preview'>('options')
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  
  const cardRef = useRef<HTMLDivElement>(null)
  const { generateImage, shareImage, downloadImage, isGenerating, error } = useShareImage()

  const storyUrl = typeof window !== 'undefined' ? `${window.location.origin}/community/post/${post.id}` : ''
  const storyTitle = `Cerita dari ${post.is_anonymous ? 'Teman Anonim' : post.profile.display_name}`
  const storyText = post.content.substring(0, 100) + '...'

  // Reset view when modal closes
  useEffect(() => {
    let isMounted = true
    if (!isOpen) {
      setTimeout(() => {
        if (!isMounted) return
        setView('options')
        setDataUrl(null)
        setIsCopied(false)
      }, 300)
    }
    return () => { isMounted = false }
  }, [isOpen])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(storyUrl)
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
        onClose()
      }, 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  const handleShareDevice = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: storyTitle,
          text: storyText,
          url: storyUrl,
        })
        onClose()
      } catch (err) {
        // user cancelled
      }
    } else {
      handleCopyLink()
    }
  }

  const handleGeneratePreview = async () => {
    setView('preview')
    // We need to wait a tick for the StoryShareCard to be rendered in the DOM before capturing it
    setTimeout(async () => {
      const generated = await generateImage(cardRef)
      if (generated) {
        setDataUrl(generated)
      }
    }, 100)
  }

  const handleShareImage = async () => {
    if (!dataUrl) return
    const success = await shareImage(dataUrl, storyTitle, storyText, storyUrl)
    if (!success) {
      // Fallback if sharing fails (e.g. not supported)
      downloadImage(dataUrl, `yukceritain-story-${post.id}.png`)
    }
  }

  const handleDownloadImage = () => {
    if (!dataUrl) return
    downloadImage(dataUrl, `yukceritain-story-${post.id}.png`)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998]"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ y: '100%', opacity: 1, scale: 1 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: '100%', opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-[9999] flex flex-col bg-card rounded-t-[32px] sm:rounded-[24px] sm:bottom-auto sm:top-[50%] sm:left-[50%] sm:right-auto sm:translate-x-[-50%] sm:translate-y-[-50%] sm:w-[90vw] sm:max-w-md shadow-2xl overflow-hidden focus:outline-none"
                style={{ 
                  // In sm breakpoints, Framer Motion's y:0 will conflict with translateY(-50%),
                  // so we handle positioning carefully.
                  // For a perfect hybrid, we often override the transform on sm+ using CSS.
                }}
              >
                {/* Mobile Handle */}
                <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
                  <div className="w-12 h-1.5 rounded-full bg-border" />
                </div>

                <div className="flex items-center justify-between px-6 pt-4 pb-2">
                  <Dialog.Title className="text-[18px] font-bold text-foreground">
                    {view === 'options' ? t('storyDetail.shareStory') : 'Preview Cerita'}
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="px-6 pb-6 pt-2">
                  {view === 'options' && (
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={handleGeneratePreview}
                        className="w-full flex items-center gap-4 p-4 rounded-[16px] bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-colors text-left group"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-[15px]">{t('storyDetail.shareAsImage') || 'Bagikan sebagai Gambar'}</p>
                          <p className="text-[13px] text-muted-foreground mt-0.5">Sempurna untuk IG Story atau WhatsApp</p>
                        </div>
                      </button>

                      <button 
                        onClick={handleCopyLink}
                        className="w-full flex items-center gap-4 p-4 rounded-[16px] bg-muted/50 hover:bg-muted border border-transparent transition-colors text-left group"
                      >
                        <div className="w-10 h-10 rounded-full bg-background text-foreground flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                          {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <LinkIcon className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-[15px]">
                            {isCopied ? (t('storyDetail.linkCopied') || 'Link disalin!') : (t('storyDetail.copyLink') || 'Salin Link')}
                          </p>
                        </div>
                      </button>

                      <button 
                        onClick={handleShareDevice}
                        className="w-full flex items-center gap-4 p-4 rounded-[16px] bg-muted/50 hover:bg-muted border border-transparent transition-colors text-left group"
                      >
                        <div className="w-10 h-10 rounded-full bg-background text-foreground flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                          <Share2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-[15px]">{t('storyDetail.shareViaDevice') || 'Bagikan melalui Device'}</p>
                        </div>
                      </button>
                    </div>
                  )}

                  {view === 'preview' && (
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-muted rounded-[20px] overflow-hidden relative shadow-inner flex items-center justify-center mb-6">
                        {isGenerating && !dataUrl ? (
                          <div className="flex flex-col items-center text-muted-foreground">
                            <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary" />
                            <p className="text-[14px] font-medium animate-pulse">
                              {t('storyDetail.generatingImage') || 'Menyiapkan gambar...'}
                            </p>
                          </div>
                        ) : dataUrl ? (
                          <motion.img 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={dataUrl} 
                            alt="Story Preview" 
                            className="w-full h-full object-contain"
                          />
                        ) : error ? (
                          <div className="text-center p-4">
                            <p className="text-red-500 text-sm mb-2">Gagal membuat gambar.</p>
                            <button onClick={() => setView('options')} className="text-primary text-sm font-semibold hover:underline">
                              Kembali
                            </button>
                          </div>
                        ) : null}
                      </div>

                      {dataUrl && (
                        <div className="w-full flex gap-3">
                          <button 
                            onClick={handleShareImage}
                            className="flex-1 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full flex items-center justify-center gap-2 transition-colors"
                          >
                            <Share2 className="w-4 h-4" /> {t('storyDetail.share') || 'Bagikan'}
                          </button>
                          <button 
                            onClick={handleDownloadImage}
                            className="flex-1 py-3.5 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-full flex items-center justify-center gap-2 transition-colors"
                          >
                            <Download className="w-4 h-4" /> {t('storyDetail.download') || 'Download'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 
                  Hidden container for generating the high-res image.
                  It must be in the DOM but positioned off-screen.
                  We wrap it in a pointer-events-none container off-screen.
                */}
                <div className="absolute top-[-9999px] left-[-9999px] pointer-events-none">
                  {view === 'preview' && (
                    <StoryShareCard 
                      ref={cardRef} 
                      content={post.content} 
                      isAnonymous={post.is_anonymous} 
                      profile={post.profile} 
                      url={storyUrl} 
                    />
                  )}
                </div>

              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
