import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer id="footer" className="bg-blue-900 text-white pt-16 pb-8">
      <div className="max-w-container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-12">
          {/* Brand */}
          <div>
            <Image src="/assets/logo-yukceritain.png" alt="YukceritaIN" width={130} height={40} className="h-10 w-auto brightness-0 invert mb-4" style={{ width: "auto" }} />
            <p className="text-blue-200 text-sm leading-relaxed mb-5 max-w-[280px]">
              Platform kesehatan mental #1 di Indonesia. Terhubung dengan psikolog profesional kapan saja, di mana saja.
            </p>
            <div className="flex gap-3">
              {/* Instagram */}
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              {/* Twitter/X */}
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* TikTok */}
              <a href="#" aria-label="TikTok" className="w-9 h-9 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.33-6.33V9.19a8.16 8.16 0 0 0 4.29 1.2V6.69z"/></svg>
              </a>
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-blue-200 mb-4">Layanan</h4>
            <ul className="space-y-2.5">
              {['Konseling Individual', 'Komunitas Dukungan', 'Alat Self-Care', 'Bantuan Darurat'].map((item) => (
                <li key={item}><a href="#" className="text-blue-300 text-sm hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-blue-200 mb-4">Perusahaan</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-blue-300 text-sm hover:text-white transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="text-blue-300 text-sm hover:text-white transition-colors">Tim Ahli</a></li>
              <li><Link href="/blog" className="text-blue-300 text-sm hover:text-white transition-colors">Blog Kesehatan</Link></li>
              <li><a href="#" className="text-blue-300 text-sm hover:text-white transition-colors">Karir</a></li>
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-blue-200 mb-4">Bantuan</h4>
            <ul className="space-y-2.5">
              {['FAQ', 'Kebijakan Privasi', 'Syarat & Ketentuan', 'Hubungi Kami'].map((item) => (
                <li key={item}><a href="#" className="text-blue-300 text-sm hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-blue-400 text-xs text-center md:text-left">
            © 2026 YukceritaIN. All rights reserved.
          </p>
          <p className="text-blue-500 text-xs text-center md:text-right max-w-md">
            Jika Anda atau seseorang yang Anda kenal membutuhkan bantuan darurat, hubungi 119 ext 8.
          </p>
        </div>
      </div>
    </footer>
  )
}
