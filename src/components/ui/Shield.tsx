'use client'
import { cn } from '@/lib/utils'

interface Props { size?: number; pulse?: boolean; scanning?: boolean; className?: string }

export function Shield({ size = 80, pulse = true, scanning = false, className }: Props) {
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      {pulse && (
        <>
          <span className="absolute rounded-full border border-[#00D4FF]/30 animate-pulse-ring" style={{ width: size * 1.45, height: size * 1.45 }} />
          <span className="absolute rounded-full border border-[#7C3AED]/20 animate-pulse-ring" style={{ width: size * 1.85, height: size * 1.85, animationDelay: '1.1s' }} />
        </>
      )}
      {scanning && <div className="absolute inset-0 radar-sweep opacity-80" style={{ borderRadius: '50%' }} />}
      <svg viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg"
        className={cn('relative z-10', pulse && 'animate-glow')} width={size} height={size * 1.15} role="img" aria-label="ScamShield logo">
        <defs>
          <linearGradient id="sg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00D4FF"/><stop offset="100%" stopColor="#7C3AED"/></linearGradient>
          <linearGradient id="sg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="rgba(0,212,255,0.18)"/><stop offset="100%" stopColor="rgba(124,58,237,0.18)"/></linearGradient>
          <filter id="sf"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <path d="M50 4 L90 20 L90 54 C90 76 72 94 50 110 C28 94 10 76 10 54 L10 20 Z" fill="url(#sg2)" stroke="url(#sg1)" strokeWidth="2.5" filter="url(#sf)"/>
        <path d="M50 13 L82 27 L82 54 C82 72 67 88 50 102 C33 88 18 72 18 54 L18 27 Z" fill="none" stroke="url(#sg1)" strokeWidth="0.7" opacity="0.35"/>
        <circle cx="50" cy="14" r="2" fill="url(#sg1)" opacity="0.7"/>
        <circle cx="82" cy="32" r="1.5" fill="url(#sg1)" opacity="0.4"/>
        <circle cx="18" cy="32" r="1.5" fill="url(#sg1)" opacity="0.4"/>
        {scanning
          ? <g><ellipse cx="50" cy="60" rx="16" ry="11" fill="none" stroke="url(#sg1)" strokeWidth="2.5"/><circle cx="50" cy="60" r="6" fill="url(#sg1)" opacity="0.9"/><circle cx="50" cy="60" r="2.5" fill="white" opacity="0.95"/></g>
          : <path d="M34 58 L46 70 L68 46" stroke="url(#sg1)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>}
      </svg>
    </div>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Shield size={32} pulse={false} />
      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }} className="text-[1.15rem] tracking-tight">
        <span className="grad-text">ScamShield</span>
        <span className="opacity-30 font-light"> AI</span>
      </span>
    </div>
  )
}
