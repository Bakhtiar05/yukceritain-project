'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// Custom hook — framer-motion v12+ removed useReducedMotion
function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mql.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])
  return prefersReduced
}

// ─── Conversation Data ────────────────────────────────────────────
interface Message {
  role: 'counselor' | 'user'
  text: string
  pauseAfter: number // ms to hold visible after typing finishes
}

const MESSAGES: Message[] = [
  { role: 'counselor', text: 'Hai, gimana kabarmu hari ini?', pauseAfter: 800 },
  { role: 'user', text: 'Sejujurnya... aku lagi nggak baik-baik aja.', pauseAfter: 1000 },
  { role: 'counselor', text: 'Terima kasih sudah mau cerita.', pauseAfter: 800 },
  { role: 'counselor', text: 'Kita nggak perlu buru-buru. Cerita pelan-pelan aja, aku di sini.', pauseAfter: 1500 },
]

const TYPING_SPEED = 30 // ms per character
const TYPING_INDICATOR_DURATION = 900 // ms
const BUBBLE_EXIT_DURATION = 400 // ms
const GAP_BETWEEN_MESSAGES = 300 // ms

// ─── Typing Indicator ─────────────────────────────────────────────
function TypingIndicator({ role }: { role: 'counselor' | 'user' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.96 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex ${role === 'counselor' ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className="flex items-center gap-1 md:gap-[3px] px-4 py-3 md:px-[22px] md:py-[16px] rounded-[24px] bg-white border border-[#E5EEFF] w-fit"
        style={{
          boxShadow: '0 12px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block w-[6px] h-[6px] md:w-[7px] md:h-[7px] rounded-full bg-[#94A3B8]"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

// ─── Single Conversation Bubble ───────────────────────────────────
interface BubbleProps {
  message: Message
  onTypingComplete: () => void
}

function ConversationBubble({ message, onTypingComplete }: BubbleProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const charIndexRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Keep a stable ref to the callback so we don't re-trigger the typing effect
  const onTypingCompleteRef = useRef(onTypingComplete)
  useEffect(() => {
    onTypingCompleteRef.current = onTypingComplete
  }, [onTypingComplete])

  useEffect(() => {
    charIndexRef.current = 0
    setDisplayedText('')
    setIsTyping(true)

    intervalRef.current = setInterval(() => {
      charIndexRef.current++
      const nextText = message.text.slice(0, charIndexRef.current)
      setDisplayedText(nextText)

      if (charIndexRef.current >= message.text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setIsTyping(false)
        onTypingCompleteRef.current()
      }
    }, TYPING_SPEED)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [message.text]) // removed onTypingComplete from dependencies to avoid loop

  const isCounselor = message.role === 'counselor'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        opacity: { duration: 0.45, ease: 'easeOut' },
        scale: { duration: 0.45, ease: 'easeOut' },
        y: { duration: 0.45, ease: 'easeOut' },
      }}
      className={`flex ${isCounselor ? 'justify-start' : 'justify-end'}`}
      style={{ willChange: 'transform, opacity' }}
    >
      <div
        className={`rounded-[24px] relative px-[16px] py-[12px] md:px-[22px] md:py-[16px] text-[13px] md:text-[15px] ${
          isCounselor ? 'max-w-[260px] md:max-w-[320px]' : 'max-w-[250px] md:max-w-[300px]'
        }`}
        style={{
          background: isCounselor ? '#FFFFFF' : '#4F8CFF',
          border: isCounselor ? '1px solid #E5EEFF' : 'none',
          color: isCounselor ? '#1E293B' : '#FFFFFF',
          boxShadow: isCounselor
            ? '0 12px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)'
            : '0 20px 60px rgba(79,140,255,.18)',
          lineHeight: '1.5',
          letterSpacing: '-0.01em',
          fontWeight: 400,
        }}
      >
        <span>{displayedText}</span>
        {isTyping && (
          <span
            className="inline-block w-[2px] h-[1em] ml-[1px] align-middle bg-current"
            style={{
              animation: 'intro-cursor-blink 0.8s step-end infinite',
              opacity: 0.7,
            }}
          />
        )}
      </div>
    </motion.div>
  )
}

// ─── Ambient Glow ─────────────────────────────────────────────────
function AmbientGlow() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none flex items-center justify-center"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      <motion.div
        className="rounded-full"
        style={{
          width: '80vmax',
          height: '80vmax',
          background: 'radial-gradient(circle, rgba(79,140,255,0.06) 0%, transparent 70%)',
          filter: 'blur(220px)',
          willChange: 'transform',
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  )
}

// ─── Floating Particles ───────────────────────────────────────────
// Deterministic values to avoid SSR/client hydration mismatch
const PARTICLES = [
  { id: 0, size: 2.4, left: 15, delay: 0, duration: 19 },
  { id: 1, size: 3.1, left: 28, delay: 4, duration: 21 },
  { id: 2, size: 2.0, left: 42, delay: 7, duration: 18 },
  { id: 3, size: 3.6, left: 55, delay: 2, duration: 20 },
  { id: 4, size: 2.7, left: 68, delay: 9, duration: 22 },
  { id: 5, size: 2.2, left: 80, delay: 5, duration: 19 },
  { id: 6, size: 3.0, left: 35, delay: 1, duration: 21 },
]

function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }} aria-hidden="true">
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            bottom: '-10px',
            opacity: 0,
            filter: 'blur(2px)',
            animation: `intro-particle-float ${p.duration}s linear ${p.delay}s infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  )
}

// ─── Conversation State ───────────────────────────────────────────
type ConvStep =
  | { type: 'waiting' }                    // initial pause
  | { type: 'indicator'; index: number }   // showing •••
  | { type: 'bubble'; index: number }      // typing message
  | { type: 'pausing'; index: number }     // holding message visible
  | { type: 'gap'; index: number }         // bubble unmounted, exit anim playing
  | { type: 'finished' }                   // all done

type IntroPhase = 'idle' | 'showing' | 'hiding' | 'done'

// ─── Main Component ──────────────────────────────────────────────
export default function IntroOverlay({ children }: { children: React.ReactNode }) {
  const [introState, setIntroState] = useState<IntroPhase>('idle')
  const prefersReducedMotion = useReducedMotion()

  const [convStep, setConvStep] = useState<ConvStep>({ type: 'waiting' })
  const convStepRef = useRef<ConvStep>(convStep)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  // Keep ref in sync so callbacks always read the latest step
  useEffect(() => {
    convStepRef.current = convStep
  }, [convStep])

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }, [])

  const addTimeout = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay)
    timeoutsRef.current.push(id)
    return id
  }, [])

  // Typing complete → hold visible, then unmount bubble to trigger exit
  const onBubbleTypingComplete = useCallback((msgIndex: number) => {
    const msg = MESSAGES[msgIndex]
    if (!msg) return

    setConvStep({ type: 'pausing', index: msgIndex })

    // After pause, set to 'gap' — this UNMOUNTS the bubble
    // AnimatePresence then plays the exit animation automatically
    addTimeout(() => {
      setConvStep({ type: 'gap', index: msgIndex })
    }, msg.pauseAfter)
  }, [addTimeout])

  // AnimatePresence exit complete → advance to next message or finish
  const onExitComplete = useCallback(() => {
    const step = convStepRef.current
    if (step.type !== 'gap') return // only advance after a bubble exit

    const exitedIndex = step.index
    const isLastMessage = exitedIndex === MESSAGES.length - 1

    if (isLastMessage) {
      setConvStep({ type: 'finished' })
    } else {
      const nextIndex = exitedIndex + 1
      addTimeout(() => {
        setConvStep({ type: 'indicator', index: nextIndex })

        addTimeout(() => {
          setConvStep({ type: 'bubble', index: nextIndex })
        }, TYPING_INDICATOR_DURATION)
      }, GAP_BETWEEN_MESSAGES)
    }
  }, [addTimeout])

  // Start conversation sequence
  const startConversation = useCallback(() => {
    addTimeout(() => {
      setConvStep({ type: 'indicator', index: 0 })

      addTimeout(() => {
        setConvStep({ type: 'bubble', index: 0 })
      }, TYPING_INDICATOR_DURATION)
    }, 600)
  }, [addTimeout])

  // Finished → begin landing page transition
  useEffect(() => {
    if (convStep.type !== 'finished') return

    const exitTimer = addTimeout(() => {
      setIntroState('hiding')
      document.body.style.overflow = ''
      document.body.style.pointerEvents = ''

      addTimeout(() => {
        setIntroState('done')
      }, 1800)
    }, 200)

    return () => clearTimeout(exitTimer)
  }, [convStep, addTimeout])

  // Main lifecycle
  useEffect(() => {
    setIntroState('showing')
    document.body.style.overflow = 'hidden'
    document.body.style.pointerEvents = 'none'

    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        setIntroState('hiding')
        document.body.style.overflow = ''
        document.body.style.pointerEvents = ''
        setTimeout(() => setIntroState('done'), 300)
      }, 1000)
      return () => {
        clearTimeout(timer)
        document.body.style.overflow = ''
        document.body.style.pointerEvents = ''
      }
    }

    startConversation()

    return () => {
      clearAllTimeouts()
      document.body.style.overflow = ''
      document.body.style.pointerEvents = ''
    }
  }, [prefersReducedMotion, startConversation, clearAllTimeouts])

  // ─── Render helpers ─────────────────────────────────────────────
  const showIndicator = convStep.type === 'indicator'
  const showBubble = convStep.type === 'bubble' || convStep.type === 'pausing'

  const activeMsgIndex =
    convStep.type === 'indicator' ||
    convStep.type === 'bubble' ||
    convStep.type === 'pausing'
      ? convStep.index
      : null

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <>
      <AnimatePresence>
        {introState !== 'done' && (
          <motion.div
            key="intro-overlay"
            data-ssr={introState === 'idle'}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(12px)' }}
            transition={
              prefersReducedMotion
                ? { duration: 0.3 }
                : { duration: 1.4, ease: [0.4, 0, 0.2, 1] }
            }
            className="intro-overlay-container fixed inset-0 z-[9999] overflow-hidden bg-background"
            style={{ willChange: 'opacity, transform, filter' }}
            aria-hidden="true"
          >
            {/* Ambient Glow */}
            {!prefersReducedMotion && <AmbientGlow />}

            {/* Camera Zoom + Cloud Drift */}
            <motion.div
              className="absolute inset-0"
              style={{
                willChange: 'transform',
                zIndex: 2,
                animation: !prefersReducedMotion
                  ? 'intro-cloud-drift 12s ease-in-out infinite'
                  : undefined,
              }}
              initial={{ scale: 1 }}
              animate={!prefersReducedMotion ? { scale: 1.03 } : { scale: 1 }}
              transition={{ duration: 16, ease: 'linear' }}
            >
              <Image
                src="/assets/latar-v3.webp"
                alt="Welcome to YukCeritain"
                fill
                priority
                sizes="100vw"
                className="hidden md:block object-cover object-center"
              />
              <Image
                src="/assets/latar-mobilev1.webp"
                alt="Welcome to YukCeritain Mobile"
                fill
                priority
                sizes="100vw"
                className="block md:hidden object-cover object-center"
              />
            </motion.div>

            {/* Floating Particles */}
            {!prefersReducedMotion && <FloatingParticles />}

            {/* ── Conversation Area ── */}
            {!prefersReducedMotion && (
              <div
                className="absolute inset-x-0 flex justify-center top-[32%] md:top-[22%]"
                style={{ zIndex: 10 }}
              >
                <div
                  className="w-[88%] md:w-[60%] flex flex-col items-center"
                  style={{ maxWidth: '780px' }}
                >
                  <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
                    {/* Typing indicator */}
                    {showIndicator && activeMsgIndex !== null && (
                      <motion.div
                        key={`indicator-${activeMsgIndex}`}
                        className="w-full"
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        <TypingIndicator role={MESSAGES[activeMsgIndex].role} />
                      </motion.div>
                    )}

                    {/* Active bubble */}
                    {showBubble && activeMsgIndex !== null && (
                      <motion.div
                        key={`bubble-${activeMsgIndex}`}
                        className="w-full"
                        exit={{
                          opacity: 0,
                          y: -10,
                          filter: 'blur(6px)',
                        }}
                        transition={{
                          duration: BUBBLE_EXIT_DURATION / 1000,
                          ease: 'easeInOut',
                        }}
                      >
                        <ConversationBubble
                          message={MESSAGES[activeMsgIndex]}
                          onTypingComplete={() => onBubbleTypingComplete(activeMsgIndex)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        className="main-content-container"
        data-ssr={introState === 'idle'}
        initial={introState === 'showing' ? { opacity: 0, y: 30 } : false}
        animate={
          introState === 'hiding' || introState === 'done'
            ? { opacity: 1, y: 0 }
            : introState === 'showing'
              ? { opacity: 0, y: 30 }
              : { opacity: 1, y: 0 }
        }
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </>
  )
}
