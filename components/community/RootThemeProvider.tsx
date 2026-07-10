'use client'

import React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export default function RootThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      value={{
        light: 'community-light',
        dark: 'community-dark',
      }}
    >
      {children}
    </NextThemesProvider>
  )
}
