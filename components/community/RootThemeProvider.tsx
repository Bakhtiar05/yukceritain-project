'use client'

import React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { usePathname } from 'next/navigation'

export default function RootThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isCommunity = pathname?.startsWith('/community')

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      value={{
        light: 'community-light',
        dark: 'community-dark',
      }}
      forcedTheme={isCommunity ? undefined : 'light'}
    >
      {children}
    </NextThemesProvider>
  )
}
