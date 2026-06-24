import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Akutemanmu',
    template: '%s | Akutemanmu',
  },
  description:
    'Terhubung dengan psikolog profesional untuk konseling online yang aman, nyaman, dan terjangkau. Dipercaya oleh 50.000+ pengguna di seluruh Indonesia.',
  keywords: [
    'kesehatan mental',
    'psikolog online',
    'konseling online',
    'terapi',
    'kecemasan',
    'mindfulness',
    'self-care',
    'Indonesia',
  ],
  authors: [{ name: 'Akutemanmu' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Akutemanmu',
    title: 'Akutemanmu — Kesehatan Mentalmu Adalah Prioritas',
    description:
      'Terhubung dengan psikolog profesional untuk konseling online yang aman, nyaman, dan terjangkau.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  )
}
