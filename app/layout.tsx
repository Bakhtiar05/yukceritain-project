import type { Metadata, Viewport } from 'next'
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

export const viewport: Viewport = {
  themeColor: '#0066FF',
}

export const metadata: Metadata = {
  applicationName: 'YukceritaIN',
  title: {
    default: 'YukceritaIN | Cerita. Didengar. Dimengerti.',
    template: '%s | YukceritaIN',
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
  authors: [{ name: 'YukceritaIN' }],
  creator: 'YukceritaIN',
  publisher: 'YukceritaIN',
  category: 'health',
  robots: 'index, follow',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/assets/fav_logo_iconv3.png',
    shortcut: '/assets/fav_logo_iconv3.png',
    apple: '/assets/fav_logo_iconv3.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'YukceritaIN',
    statusBarStyle: 'default',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'YukceritaIN',
    title: 'YukceritaIN | Cerita. Didengar. Dimengerti.',
    description:
      'Terhubung dengan psikolog profesional untuk konseling online yang aman, nyaman, dan terjangkau.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'YukceritaIN Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YukceritaIN | Cerita. Didengar. Dimengerti.',
    description:
      'Terhubung dengan psikolog profesional untuk konseling online yang aman, nyaman, dan terjangkau.',
    images: ['/og-image.png'],
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
