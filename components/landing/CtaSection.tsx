import Link from 'next/link'

export default function CtaSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-container mx-auto px-6">
        <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl py-16 px-8 md:px-16 text-center overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-[-40px] right-[-40px] w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute bottom-[-20px] left-[10%] w-20 h-20 rounded-full bg-white/5" />
          <div className="absolute top-[40%] left-[-30px] w-16 h-16 rounded-full bg-white/10" />

          <span className="text-4xl mb-4 block">🌱</span>

          <h2 className="font-display text-[clamp(1.6rem,4vw,2.4rem)] font-bold text-white mb-4 relative z-10">
            Mulai Perjalanan Menuju Kesehatan<br className="hidden md:block" /> Mentalmu Hari Ini
          </h2>

          <p className="text-blue-100 text-base mb-8 max-w-lg mx-auto relative z-10">
            Ribuan orang telah memulai perjalanan mereka bersama kami. Sekarang giliran kamu.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-6 relative z-10">
            <Link href="/#services" className="btn btn-white btn-large">Coba Gratis Sekarang</Link>
            <Link href="/#services" className="btn btn-outline-white btn-large">Pelajari Paket Harga</Link>
          </div>

          <p className="text-blue-200 text-xs relative z-10">
            Tidak perlu kartu kredit · Sesi pertama gratis · Batalkan kapan saja
          </p>
        </div>
      </div>
    </section>
  )
}
