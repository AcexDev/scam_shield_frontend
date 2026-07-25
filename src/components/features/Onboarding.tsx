'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield } from '@/components/ui/Shield'
import { ChevronRight, ShieldCheck, Zap, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { icon: <ShieldCheck size={36} className="text-[#00D4FF]" />, title: 'Detect Scams Instantly', body: 'Paste any suspicious text, SMS, or email. ScamShield AI analyses it in seconds using Gemini 2.5 — trained on Nigerian fraud patterns.', cta: 'Next' },
  { icon: <Globe size={36} className="text-[#7C3AED]" />, title: 'URLs, Images & Voice Notes', body: 'Submit a suspicious link and we fetch the page content for deep analysis. Upload a screenshot or voice note — AI reads and listens for you.', cta: 'Next' },
  { icon: <Zap size={36} className="text-[#10B981]" />, title: 'Report to Authorities', body: 'Found a scam? Report it directly to EFCC, CBN, NITDA or Nigeria Police with one tap. Every report trains the model to protect more people.', cta: 'Start Scanning' },
]

interface Props { onDone: () => void }

export function Onboarding({ onDone }: Props) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  function next() { if (step < STEPS.length-1) setStep(s => s+1); else onDone() }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(4,6,15,0.97)', backdropFilter: 'blur(12px)' }}>
      <div className="absolute inset-0 hex-bg opacity-30 pointer-events-none" />
      <motion.div className="relative w-full max-w-md" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.34,1.3,0.64,1] }}>
        <div className="glass rounded-3xl p-8 sm:p-10 text-center border border-white/10 shadow-2xl">
          <div className="flex justify-center mb-8"><Shield size={96} pulse scanning={step===0} /></div>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <div className="flex justify-center mb-5"><span className="p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>{current.icon}</span></div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{current.title}</h2>
              <p className="text-sm sm:text-base leading-relaxed opacity-60 mb-8">{current.body}</p>
            </motion.div>
          </AnimatePresence>
          <button onClick={next} className="w-full py-3.5 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" style={{ fontFamily: 'Space Grotesk, sans-serif', background: 'linear-gradient(135deg, #00D4FF, #7C3AED)', boxShadow: '0 0 32px rgba(0,212,255,0.35)' }}>
            {current.cta}<ChevronRight size={16} />
          </button>
          <button onClick={onDone} className="mt-4 text-xs opacity-30 hover:opacity-60 transition-opacity">Skip intro</button>
          <div className="flex justify-center gap-2 mt-6">
            {STEPS.map((_, i) => (
              <button key={i} onClick={() => setStep(i)} className={cn('h-2 rounded-full transition-all duration-300', i===step ? 'w-8 bg-[#00D4FF] shadow-[0_0_8px_rgba(0,212,255,0.8)]' : 'w-2 bg-white/20 hover:bg-white/40')} aria-label={`Step ${i+1}`} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
