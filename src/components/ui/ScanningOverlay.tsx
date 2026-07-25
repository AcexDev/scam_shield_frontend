'use client'
import { motion } from 'framer-motion'
import { Shield } from '@/components/ui/Shield'

export function ScanningOverlay({ message }: { message?: string }) {
  return (
    <motion.div className="flex flex-col items-center justify-center py-16 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="relative">
        <Shield size={100} pulse scanning />
        <div className="relative mt-4 w-48 h-0.5 overflow-hidden rounded-full mx-auto" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="scan-line" />
        </div>
      </div>
      <motion.p className="text-sm font-mono opacity-60 tracking-wide" style={{ fontFamily: 'JetBrains Mono, monospace' }} key={message} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 0.6, y: 0 }} transition={{ duration: 0.3 }}>
        {message ?? 'Scanning…'}
      </motion.p>
      <div className="flex gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#00D4FF] dot1" />
        <span className="w-2 h-2 rounded-full bg-[#7C3AED] dot2" />
        <span className="w-2 h-2 rounded-full bg-[#00D4FF] dot3" />
      </div>
    </motion.div>
  )
}
