import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/lib/auth'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'ScamShield AI — Intelligent Scam Detection',
  description: 'AI-powered scam detection for texts, URLs, images and voice notes. Powered by Gemini 2.5.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="scamshield-theme">
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
