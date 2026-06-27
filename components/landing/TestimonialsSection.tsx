const testimonials = [
  {
    name: 'Siti Aulia',
    role: 'Mahasiswi, Jakarta',
    initials: 'SA',
    gradient: 'from-pink-400 to-purple-500',
    quote: 'Awalnya saya ragu untuk konseling online, tapi pengalaman di YukceritaIN benar-benar mengubah pandangan saya. Psikolognya sangat profesional dan membuat saya merasa nyaman.',
  },
  {
    name: 'Rizki Handoko',
    role: 'Software Engineer, Bandung',
    initials: 'RH',
    gradient: 'from-blue-400 to-blue-600',
    quote: 'Sebagai orang yang sibuk, fleksibilitas jadwal di YukceritaIN sangat membantu. Saya bisa konseling kapan saja tanpa mengganggu pekerjaan.',
    featured: true,
  },
  {
    name: 'Dian Pratiwi',
    role: 'Ibu Rumah Tangga, Surabaya',
    initials: 'DP',
    gradient: 'from-emerald-400 to-teal-500',
    quote: 'Komunitas dukungan di sini luar biasa. Saya merasa tidak sendirian dalam menghadapi tantangan sebagai ibu. Terima kasih YukceritaIN!',
  },
]

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-container mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-bold text-neutral-900 mb-4">
            Apa Kata Mereka?
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto">
            Cerita nyata dari pengguna yang telah merasakan manfaat YukceritaIN
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className={`rounded-xl p-8 border transition-transform duration-base hover:-translate-y-1 ${
                t.featured
                  ? 'bg-gradient-to-br from-blue-500 to-blue-700 border-transparent text-white'
                  : 'bg-white border-neutral-200 shadow-sm'
              }`}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#F4C430] text-lg">★</span>
                ))}
              </div>

              <p className={`text-sm leading-relaxed mb-6 ${t.featured ? 'text-blue-50' : 'text-neutral-600'}`}>
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-sm font-bold`}>
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
    </section>
  )
}
