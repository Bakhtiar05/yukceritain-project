'use client'

import ScrollReveal, { ScrollRevealItem } from '@/components/ui/ScrollReveal'

const testimonials = [
  {
    name: 'Siti Aulia',
    role: 'Mahasiswi, Jakarta',
    initials: 'SA',
    gradient: 'from-pink-400 to-purple-500',
    quote: 'Awalnya ragu karena harganya sangat terjangkau, tapi kualitas konselornya luar biasa. Saya merasa benar-benar didengar dan dimengerti. Terima kasih YukceritaIN!',
  },
  {
    name: 'Rizki Handoko',
    role: 'Karyawan Swasta, Bandung',
    initials: 'RH',
    gradient: 'from-blue-400 to-blue-600',
    quote: 'Prosesnya simpel banget. Booking, bayar Rp20.000, langsung dihubungi via WhatsApp. Nggak perlu ribet download aplikasi lain. Sangat membantu di saat butuh tempat cerita.',
    featured: true,
  },
  {
    name: 'Dian Pratiwi',
    role: 'Ibu Rumah Tangga, Surabaya',
    initials: 'DP',
    gradient: 'from-emerald-400 to-teal-500',
    quote: 'Sebagai ibu, kadang saya butuh tempat untuk bercerita tanpa dihakimi. Di sini saya menemukan ruang aman itu. Konselor-nya profesional dan sangat pengertian.',
  },
]

export default function TestimonialsSection() {
  return (
    <section id="testimoni" className="scroll-mt-24 py-12 md:py-20 bg-white">
      <div className="max-w-container mx-auto px-6">
        <ScrollReveal variant="fade-up" className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Testimoni</p>
          <h2 className="text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold text-neutral-900 mb-4">
            Cerita Mereka yang Telah Terbantu
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto text-lg">
            Ribuan orang telah menemukan ruang aman mereka bersama YukceritaIN
          </p>
        </ScrollReveal>

        <div className="relative w-full overflow-hidden py-4 -mx-6 px-6 md:mx-auto md:px-0">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(calc(-50%)); } 
            }
            .animate-scroll {
              animation: scroll 40s linear infinite;
              display: flex;
              width: max-content;
            }
            .animate-scroll:hover {
              animation-play-state: paused;
            }
          `}} />
          
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 md:w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 md:w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

          <div className="animate-scroll gap-6 pr-6">
            {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, idx) => (
              <div
                key={idx}
                className={`w-[85vw] sm:w-[350px] md:w-[400px] flex-shrink-0 rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1 ${
                  t.featured
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-transparent text-white shadow-[0_8px_30px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.35)]'
                    : 'bg-white border-blue-200 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-blue-400'
                }`}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${t.featured ? 'text-yellow-300' : 'text-yellow-400'}`}>★</span>
                  ))}
                </div>

                <p className={`text-sm leading-relaxed mb-8 ${t.featured ? 'text-blue-50' : 'text-neutral-600'}`}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${t.featured ? 'text-white' : 'text-neutral-900'}`}>{t.name}</p>
                    <p className={`text-xs ${t.featured ? 'text-blue-200' : 'text-neutral-400'}`}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
