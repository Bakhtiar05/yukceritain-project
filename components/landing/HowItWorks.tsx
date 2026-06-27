import Image from 'next/image'

const steps = [
  { num: '01', title: 'Buat Akunmu', desc: 'Daftar gratis dalam hitungan detik. Tidak perlu kartu kredit atau komitmen jangka panjang.' },
  { num: '02', title: 'Pilih Psikolog Ideal', desc: 'Jelajahi profil psikolog bersertifikat. Filter berdasarkan spesialisasi, bahasa, dan jadwal.' },
  { num: '03', title: 'Mulai Sesi Pertamamu', desc: 'Lakukan sesi konseling pertamamu secara gratis. Video call atau chat, sesuai kenyamananmu.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-neutral-50">
      <div className="max-w-container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Steps */}
        <div>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-bold text-neutral-900 mb-12">
            Bagaimana Cara Kerjanya?
          </h2>

          <div className="relative pl-10">
            {/* Connecting line */}
            <div className="absolute left-[18px] top-2 bottom-2 w-px bg-blue-200" />

            <div className="space-y-10">
              {steps.map((step) => (
                <div key={step.num} className="relative">
                  <div className="absolute -left-10 top-0 w-9 h-9 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center z-10">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">{step.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Illustration */}
        <div className="relative hidden lg:block">
          <Image src="/assets/services_illustration.png" alt="Cara kerja YukceritaIN" width={480} height={440} className="w-full h-auto" />

          <div className="absolute bottom-8 left-4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 animate-gentle-bounce">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <div>
              <p className="text-sm font-semibold text-neutral-900">1,248</p>
              <p className="text-xs text-neutral-400">pengguna online sekarang</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
