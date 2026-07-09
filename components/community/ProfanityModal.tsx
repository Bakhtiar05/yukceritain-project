'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProfanityModalProps {
  isOpen: boolean
  warningCount: number
  foundWords: string[]
  onClose: () => void
}

export default function ProfanityModal({ isOpen, warningCount, foundWords, onClose }: ProfanityModalProps) {
  const router = useRouter()
  
  const isSecondWarning = warningCount >= 2
  const wordsText = foundWords.join(', ')

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Top red accent */}
            <div className="h-2 w-full bg-red-500" />
            
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>

              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                {isSecondWarning ? 'Butuh Teman Cerita?' : 'Peringatan Kata Kotor'}
              </h3>
              
              <p className="text-slate-600 leading-relaxed mb-8">
                {isSecondWarning ? (
                  <>Kami melihat Anda sedang kesal atau marah (<span className="font-semibold text-red-500">{wordsText}</span>). Psikolog kami selalu siap mendengarkan cerita Anda tanpa menghakimi.</>
                ) : (
                  <>Maaf, pesan Anda mengandung kata-kata yang tidak pantas (<span className="font-semibold text-red-500">{wordsText}</span>). Mohon perbaiki sebelum mengirim.</>
                )}
              </p>

              <div className="flex flex-col sm:flex-row w-full gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Perbaiki
                </button>
                
                {isSecondWarning && (
                  <button
                    onClick={() => {
                      onClose()
                      router.push('/konsultasi')
                    }}
                    className="flex-1 py-3 px-4 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all"
                  >
                    Daftar Konseling
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
