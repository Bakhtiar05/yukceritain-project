'use client'

import { useState } from 'react'
import { subscribeNewsletter } from '@/lib/actions/contact'

export default function NewsletterSection() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    const formData = new FormData(e.currentTarget)
    const result = await subscribeNewsletter(formData)

    if (result.success) {
      setStatus('success')
      ;(e.target as HTMLFormElement).reset()
      setTimeout(() => setStatus('idle'), 3500)
    } else {
      setErrorMsg(result.error || 'Terjadi kesalahan')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3500)
    }
  }

  return (
    <section className="py-16 bg-white dark:bg-background">
      <div className="max-w-container mx-auto px-6">
        <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl py-12 px-8 md:px-16 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="font-display text-xl md:text-2xl font-bold text-white mb-2">
                Dapatkan Artikel Terbaru Langsung di Kotak Masukmu
              </h2>
              <p className="text-blue-100 text-sm">
                Bergabung dengan 12.000+ pembaca yang mendapatkan tips kesehatan mental setiap minggu.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                name="email"
                required
                placeholder="Masukkan emailmu"
                className="newsletter-input flex-1 min-w-[240px]"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className={`btn whitespace-nowrap px-6 py-3 text-sm font-bold rounded-full transition-all ${
                  status === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-blue-500 hover:bg-blue-50'
                }`}
              >
                {status === 'loading' ? '...' : status === 'success' ? '✓ Berhasil!' : 'Berlangganan'}
              </button>
            </form>
          </div>

          {status === 'error' && (
            <p className="text-red-200 text-xs mt-3 relative z-10">{errorMsg}</p>
          )}

          <p className="text-blue-200/60 text-xs mt-4 text-center md:text-left relative z-10">
            Gratis · Tanpa spam · Berhenti kapan saja
          </p>
        </div>
      </div>
    </section>
  )
}
