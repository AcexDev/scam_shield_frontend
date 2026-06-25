'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { ThreatLevel } from '@/types'
import { threatMeta } from '@/lib/utils'

interface Props {
  probability: number   // 0-100
  threatLevel: ThreatLevel
  isScam: boolean
}

export function RiskMeter({ probability, threatLevel, isScam }: Props) {
  const meta = threatMeta(threatLevel)

  // Arc params
  const size = 220
  const cx = size / 2
  const cy = size / 2 + 20
  const r = 85
  // Arc from 210° to 330° (total 240°)
  const startAngle = 210
  const totalAngle = 240
  const circumference = 2 * Math.PI * r
  const arcLength = (totalAngle / 360) * circumference

  function polarToXY(deg: number) {
    const rad = ((deg - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  const start = polarToXY(startAngle)
  const end = polarToXY(startAngle + totalAngle)

  const bgArc = `M ${start.x} ${start.y} A ${r} ${r} 0 1 1 ${end.x} ${end.y}`
  // Progress arc — fraction of totalAngle
  const progressAngle = (probability / 100) * totalAngle
  const progressEnd = polarToXY(startAngle + progressAngle)
  const largeArc = progressAngle > 180 ? 1 : 0
  const fgArc = `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${progressEnd.x} ${progressEnd.y}`

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size * 0.8 }}>
        <svg width={size} height={size * 0.9} viewBox={`0 0 ${size} ${size * 0.9}`}>
          {/* Glow filter */}
          <defs>
            <filter id="arc-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <linearGradient id="arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>

          {/* Background track */}
          <path
            d={bgArc}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Progress arc */}
          <motion.path
            d={fgArc}
            fill="none"
            stroke={meta.color}
            strokeWidth="12"
            strokeLinecap="round"
            filter="url(#arc-glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: [0.34, 1.2, 0.64, 1] }}
          />

          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map(tick => {
            const angle = startAngle + (tick / 100) * totalAngle
            const inner = polarToXY(angle)
            const outerR = r + 10
            const rad = ((angle - 90) * Math.PI) / 180
            const ox = cx + outerR * Math.cos(rad)
            const oy = cy + outerR * Math.sin(rad)
            return (
              <g key={tick}>
                <line x1={inner.x} y1={inner.y} x2={ox} y2={oy}
                  stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              </g>
            )
          })}

          {/* Needle dot */}
          <motion.circle
            cx={progressEnd.x}
            cy={progressEnd.y}
            r="8"
            fill={meta.color}
            filter="url(#arc-glow)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, duration: 0.4, ease: [0.34,1.4,0.64,1] }}
          />
          <motion.circle
            cx={progressEnd.x}
            cy={progressEnd.y}
            r="4"
            fill="white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.3, duration: 0.3 }}
          />
        </svg>

        {/* Centre value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
          <motion.span
            className="text-5xl font-bold"
            style={{ fontFamily: 'Space Grotesk, sans-serif', color: meta.color }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.34, 1.3, 0.64, 1] }}
          >
            {probability}
          </motion.span>
          <span className="text-xs opacity-40 mt-0.5 tracking-widest uppercase">Risk Score</span>
        </div>
      </div>

      {/* Threat level badge */}
      <motion.div
        className="mt-2 px-5 py-2 rounded-full text-sm font-semibold border"
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          background: meta.bg,
          borderColor: meta.color + '44',
          color: meta.color,
          boxShadow: `0 0 20px ${meta.color}33`,
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {isScam ? '⚠️' : '✅'} {meta.label} Threat
      </motion.div>
    </div>
  )
}
