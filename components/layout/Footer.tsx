import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer id="footer" className="bg-neutral-900 text-white pt-20 pb-8">
      <div className="max-w-container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2.5fr_1fr_1fr_1fr] gap-10 lg:gap-12 mb-16">
          {/* Brand */}
          <div>
            <Image src="/assets/logov2_yukceritain.png" alt="YukceritaIN" width={200} height={60} className="h-14 w-auto brightness-0 invert mb-6" style={{ width: "auto" }} />
            <p className="text-neutral-400 text-sm leading-relaxed mb-6 max-w-[300px]">
              Ruang aman untuk setiap ceritamu. Konseling bersama konselor &amp; psikolog klinis profesional, hanya Rp20.000 per sesi via WhatsApp.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="#" aria-label="TikTok" className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.33-6.33V9.19a8.16 8.16 0 0 0 4.29 1.2V6.69z" /></svg>
              </a>
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-neutral-400 mb-5">Layanan</h3>
            <ul className="space-y-3">
              {['Konseling Individu', 'Psikolog Klinis', 'Konselor Profesional', 'Konsultasi WhatsApp'].map((item) => (
                <li key={item}><a href="#" className="text-neutral-400 text-sm hover:text-white transition-colors duration-200">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-neutral-400 mb-5">Perusahaan</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-neutral-400 text-sm hover:text-white transition-colors duration-200">Tentang Kami</a></li>
              <li><a href="#" className="text-neutral-400 text-sm hover:text-white transition-colors duration-200">Tim Ahli</a></li>
              <li><Link href="/blog" className="text-neutral-400 text-sm hover:text-white transition-colors duration-200">Blog Kesehatan</Link></li>
              <li><a href="#" className="text-neutral-400 text-sm hover:text-white transition-colors duration-200">Karir</a></li>
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-neutral-400 mb-5">Bantuan</h3>
            <ul className="space-y-3">
              {['FAQ', 'Kebijakan Privasi', 'Syarat & Ketentuan', 'Hubungi Kami'].map((item) => (
                <li key={item}><a href="#" className="text-neutral-400 text-sm hover:text-white transition-colors duration-200">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 text-neutral-500 text-xs text-center md:text-left">
            <span>© 2026 YukceritaIN. All rights reserved.</span>
            <span className="hidden md:block w-1 h-1 rounded-full bg-neutral-700" />
            <Link href="/admin/login" className="hover:text-white transition-colors duration-200 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Admin Dashboard
            </Link>
          </div>
          <p className="text-neutral-600 text-xs text-center md:text-right max-w-md">
            Jika Anda atau seseorang yang Anda kenal membutuhkan bantuan darurat, hubungi <span className="text-white font-semibold">110</span>.
          </p>
        </div>
      </div>
    </footer>
  )
}
