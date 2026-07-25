import Link from 'next/link'
import { LogoMark } from '@/components/ui/Shield'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col dark:bg-[#0A0E1A] bg-[#EEF2FF]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,212,255,0.1) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(124,58,237,0.07) 0%, transparent 60%)' }} />
      <div className="fixed inset-0 hex-bg opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 pt-6">
        <Link href="/"><LogoMark /></Link>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      <footer className="relative z-10 text-center py-4 text-xs opacity-20" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        ScamShield AI · Protecting Nigeria 🇳🇬
      </footer>
    </div>
  )
}
