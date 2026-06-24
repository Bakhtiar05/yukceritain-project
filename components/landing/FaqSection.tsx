'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'Apakah data dan privasi saya terjamin?',
    a: 'Absolut. Kami menggunakan enkripsi end-to-end untuk semua komunikasi dan data pribadi Anda. Kami bersertifikat ISO 27001 dan mematuhi regulasi perlindungan data Indonesia. Semua sesi konseling sepenuhnya rahasia.',
  },
  {
    q: 'Berapa biaya untuk menggunakan layanan ini?',
    a: 'Sesi pertama gratis untuk semua pengguna baru. Setelah itu, paket mulai dari Rp99.000/sesi. Kami juga menyediakan paket bulanan dengan harga lebih terjangkau. Tidak ada biaya tersembunyi atau komitmen jangka panjang.',
  },
  {
    q: 'Apakah psikolog di Akutemanmu memiliki lisensi resmi?',
    a: 'Ya, semua psikolog kami memiliki izin praktik resmi dari HIMPSI dan terdaftar di Kementerian Kesehatan RI. Setiap profesional melalui proses verifikasi ketat sebelum bergabung dengan platform kami.',
  },
  {
    q: 'Bisakah saya mengganti psikolog jika tidak cocok?',
    a: 'Tentu saja. Kenyamanan Anda adalah prioritas kami. Anda bebas mengganti psikolog kapan saja tanpa biaya tambahan. Tim kami juga siap membantu merekomendasikan psikolog yang sesuai dengan kebutuhan Anda.',
  },
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section id="faq" className="py-20 bg-neutral-50">
      <div className="max-w-container mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-bold text-neutral-900 mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto">
            Temukan jawaban untuk pertanyaan umum tentang layanan kami
          </p>
        </div>

        <div className="max-w-2xl mx-auto divide-y divide-neutral-200">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between py-5 text-left gap-4 group"
              >
                <span className="text-base font-semibold text-neutral-900 group-hover:text-blue-500 transition-colors">
                  {faq.q}
                </span>
                <svg
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`faq-chevron flex-shrink-0 text-neutral-400 ${openIndex === i ? 'open' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className={`faq-answer ${openIndex === i ? 'open' : ''}`}>
                <p className="pb-5 text-sm leading-relaxed text-neutral-500">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
