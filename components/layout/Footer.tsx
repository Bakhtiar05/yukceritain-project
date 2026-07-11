import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Heart } from 'lucide-react'

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
)

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
)

const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.33-6.33V9.19a8.16 8.16 0 0 0 4.29 1.2V6.69z" /></svg>
)

export default function Footer() {
  return (
    <footer id="footer" className="relative bg-[#0A0F1C] text-white pt-24 pb-28 md:pb-12 overflow-hidden border-t border-white/5">
      {/* Background Enhancements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Newsletter - Takes up 5 columns */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Link href="/" className="mb-6 inline-block group">
              <Image 
                src="/assets/logov2_yukceritain.png" 
                alt="YukceritaIN" 
                width={180} 
                height={54} 
                className="h-12 w-auto brightness-0 invert group-hover:opacity-80 transition-opacity duration-300" 
              />
            </Link>
            <p className="text-slate-400 text-[15px] leading-relaxed mb-8 max-w-md">
              Ruang aman untuk setiap ceritamu. Konseling profesional dengan psikolog klinis berlisensi, kapan saja, di mana saja.
            </p>
            
            {/* Minimalist Subscribe Box */}
            <div className="w-full max-w-sm relative">
              <input 
                type="email" 
                placeholder="Berlangganan artikel kesehatan..." 
                className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3.5 text-[14px] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
              />
              <button className="absolute right-1.5 top-1.5 bottom-1.5 w-10 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
          
          {/* Links - 7 columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12">
            {/* Layanan */}
            <div>
              <h3 className="font-bold text-white text-[15px] tracking-wide mb-6">Layanan</h3>
              <ul className="space-y-4">
                {['Konseling Individu', 'Psikolog Klinis', 'Konselor Profesional', 'Konsultasi WhatsApp'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-slate-400 text-[14px] hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-300">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Perusahaan */}
            <div>
              <h3 className="font-bold text-white text-[15px] tracking-wide mb-6">Perusahaan</h3>
              <ul className="space-y-4">
                {['Tentang Kami', 'Tim Ahli', 'Blog Kesehatan', 'Karir'].map((item) => (
                  <li key={item}>
                    <Link href={item === 'Blog Kesehatan' ? '/blog' : '#'} className="text-slate-400 text-[14px] hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-300">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bantuan */}
            <div>
              <h3 className="font-bold text-white text-[15px] tracking-wide mb-6">Bantuan</h3>
              <ul className="space-y-4">
                {['Pusat Bantuan', 'Kebijakan Privasi', 'Syarat & Ketentuan', 'Hubungi Kami'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-slate-400 text-[14px] hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-300">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-slate-400 text-[13px] text-center md:text-left">
            <span>© {new Date().getFullYear()} YukceritaIN. Hak cipta dilindungi.</span>
            <span className="hidden md:block w-1 h-1 rounded-full bg-slate-700" />
            <Link href="/admin/login" className="hover:text-white transition-colors duration-200 flex items-center gap-1.5 opacity-60 hover:opacity-100">
              Admin Portal
            </Link>
          </div>
          
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {[
              { icon: InstagramIcon, label: "Instagram" },
              { icon: TwitterIcon, label: "Twitter" },
              { icon: TikTokIcon, label: "TikTok" }
            ].map((social, i) => (
              <a 
                key={i}
                href="#" 
                aria-label={social.label} 
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
              >
                <social.icon />
              </a>
            ))}
          </div>
        </div>
        
        {/* Emergency Contact */}
        <div className="mt-8 text-center md:text-left flex flex-wrap items-center justify-center md:justify-start gap-2 text-slate-400 text-[13px] bg-white/[0.03] w-fit px-5 py-2.5 rounded-full border border-white/5 mx-auto md:mx-0">
          <Heart size={14} className="text-red-400/80 shrink-0" />
          <span>Butuh bantuan darurat? Hubungi <strong className="text-white font-semibold">119</strong> atau <strong className="text-white font-semibold">110</strong>.</span>
        </div>
        
      </div>
    </footer>
  )
}
