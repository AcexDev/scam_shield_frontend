'use client'
import { useTheme } from 'next-themes'
import { Sun, Moon, Shield, BarChart3 } from 'lucide-react'
import { LogoMark } from '@/components/ui/Shield'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'glass border-b border-white/5 shadow-2xl' : 'bg-transparent'
    )}>
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/"><LogoMark /></Link>

        <div className="flex items-center gap-2">
          {/* Stats nav link */}
          <Link
            href="/stats"
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border',
              pathname === '/stats'
                ? 'border-[#7C3AED]/40 text-[#7C3AED]'
                : 'border-white/10 opacity-50 hover:opacity-80 hover:border-white/20'
            )}
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              background: pathname === '/stats' ? 'rgba(124,58,237,0.1)' : 'transparent',
            }}
          >
            <BarChart3 size={12} />
            <span className="hidden sm:inline">Threat Intel</span>
            <span className="sm:hidden">Stats</span>
          </Link>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-white/10 border border-white/10"
              aria-label="Toggle theme"
            >
              {theme === 'dark'
                ? <Sun size={15} className="text-[#00D4FF]" />
                : <Moon size={15} className="text-[#7C3AED]" />}
            </button>
          )}

          {/* Gemini badge */}
          <span
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              background: 'rgba(0,212,255,0.08)',
              borderColor: 'rgba(0,212,255,0.25)',
              color: '#00D4FF',
            }}
          >
            <Shield size={10} />
            Gemini 2.5
          </span>
        </div>
      </nav>
    </header>
  )
}
