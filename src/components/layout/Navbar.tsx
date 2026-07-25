'use client'
import { useTheme } from 'next-themes'
import { Sun, Moon, Shield, BarChart3, LogOut, User } from 'lucide-react'
import { LogoMark } from '@/components/ui/Shield'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function handleLogout() {
    await logout()
    router.push('/auth/login')
  }

  return (
    <header className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', scrolled ? 'glass border-b border-white/5 shadow-2xl' : 'bg-transparent')}>
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/"><LogoMark /></Link>

        <div className="flex items-center gap-2">
          <Link href="/stats"
            className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border',
              pathname === '/stats' ? 'border-[#7C3AED]/40 text-[#7C3AED]' : 'border-white/10 opacity-50 hover:opacity-80')}
            style={{ fontFamily: 'Space Grotesk, sans-serif', background: pathname === '/stats' ? 'rgba(124,58,237,0.1)' : 'transparent' }}>
            <BarChart3 size={12} />
            <span className="hidden sm:inline">Threat Intel</span>
            <span className="sm:hidden">Stats</span>
          </Link>

          {/* User pill or sign in */}
          {mounted && (
            user ? (
              <div className="flex items-center gap-1.5">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border border-white/10 opacity-60"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <User size={11} />
                  <span className="max-w-[120px] truncate">{user.email}</span>
                </div>
                <button onClick={handleLogout}
                  className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 transition-all"
                  aria-label="Sign out">
                  <LogOut size={14} className="opacity-50 hover:opacity-100 hover:text-red-400 transition-colors" />
                </button>
              </div>
            ) : (
              <Link href="/auth/login"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#00D4FF]/30 text-[#00D4FF] hover:bg-[#00D4FF]/10 transition-all"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Sign In
              </Link>
            )
          )}

          {/* Theme toggle */}
          {mounted && (
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10 border border-white/10"
              aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={15} className="text-[#00D4FF]" /> : <Moon size={15} className="text-[#7C3AED]" />}
            </button>
          )}

          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
            style={{ fontFamily: 'Space Grotesk, sans-serif', background: 'rgba(0,212,255,0.08)', borderColor: 'rgba(0,212,255,0.25)', color: '#00D4FF' }}>
            <Shield size={10} /> Gemini 2.5
          </span>
        </div>
      </nav>
    </header>
  )
}
