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
  metadataBase: new URL('https://www.yukceritain.com'),
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
    startupImage: [
      '/assets/logo-v9.png'
    ],
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
        url: '/assets/logo-v9.png',
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
    images: ['/assets/logo-v9.png'],
  },
}

import { Toaster } from "@/components/ui/toaster"
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd"

import RootThemeProvider from '@/components/community/RootThemeProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
      </head>
      <body className="font-body antialiased">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <RootThemeProvider>
          {children}
        </RootThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
