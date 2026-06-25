'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield } from '@/components/ui/Shield'
import { Navbar } from '@/components/layout/Navbar'
import { ParticleField } from '@/components/ui/ParticleField'
import { Onboarding } from '@/components/features/Onboarding'
import { AnalyserPanel } from '@/components/features/AnalyserPanel'
import { StatsBanner } from '@/components/features/StatsBanner'
import { ShieldCheck, Zap, Users, Lock } from 'lucide-react'

const FEATURES = [
  { icon: <ShieldCheck size={18} />, label: 'Gemini 2.5 Flash', sub: 'State-of-the-art AI model' },
  { icon: <Zap size={18} />, label: 'Instant Results', sub: 'Analysis in under 3 seconds' },
  { icon: <Users size={18} />, label: 'Community DB', sub: 'Crowd-sourced threat intel' },
  { icon: <Lock size={18} />, label: 'Nigerian Context', sub: 'GTBank, MTN, EFCC patterns' },
]

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem('scamshield-seen')
    if (!seen) setShowOnboarding(true)
  }, [])

  function dismissOnboarding() {
    localStorage.setItem('scamshield-seen', '1')
    setShowOnboarding(false)
  }

  return (
    <>
      {/* Onboarding */}
      {showOnboarding && <Onboarding onDone={dismissOnboarding} />}

      {/* Background */}
      <div className="fixed inset-0 dark:bg-[#0A0E1A] bg-[#EEF2FF]" style={{ zIndex: -2 }} />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -1,
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,212,255,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(124,58,237,0.08) 0%, transparent 60%)',
        }}
      />
      <div className="fixed inset-0 hex-bg opacity-20 pointer-events-none" style={{ zIndex: -1 }} />
      <ParticleField />

      <Navbar />

      <main className="relative min-h-screen pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-8">

          {/* ── Hero ── */}
          <motion.section
            className="text-center"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.34, 1.1, 0.64, 1] }}
          >
            {/* Animated shield */}
            <div className="flex justify-center mb-6 animate-float">
              <Shield size={100} pulse />
            </div>

            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-5 border"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                background: 'rgba(0,212,255,0.08)',
                borderColor: 'rgba(0,212,255,0.2)',
                color: '#00D4FF',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
              AI-Powered · Made for Nigeria
            </motion.div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-[1.1]"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Detect Scams
              <br />
              <span className="grad-text">Before They Strike</span>
            </h1>

            <p className="text-base sm:text-lg opacity-55 max-w-lg mx-auto leading-relaxed">
              Paste any suspicious text, link, screenshot, or voice note. ScamShield AI analyses it instantly and tells you exactly what to do.
            </p>
          </motion.section>

          {/* ── Feature pills ── */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            {FEATURES.map(f => (
              <div
                key={f.label}
                className="glass rounded-2xl p-3 flex flex-col items-center text-center gap-1.5 border border-white/5 hover:border-white/10 transition-colors"
              >
                <span className="text-[#00D4FF] opacity-80">{f.icon}</span>
                <span className="text-xs font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{f.label}</span>
                <span className="text-[10px] opacity-35">{f.sub}</span>
              </div>
            ))}
          </motion.div>

          {/* ── Stats banner ── */}
          <StatsBanner />

          {/* ── Main analyser ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <AnalyserPanel />
          </motion.div>

          {/* ── Disclaimer ── */}
          <motion.p
            className="text-center text-xs opacity-25 max-w-sm mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ delay: 0.9 }}
          >
            ScamShield AI assists in detection but is not a substitute for professional security advice. Always verify independently.
          </motion.p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative text-center py-6 text-xs opacity-20 border-t border-white/5">
        <p style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          ScamShield AI · Built with Gemini 2.5 · Protecting Nigeria 🇳🇬
        </p>
      </footer>
    </>
  )
}
