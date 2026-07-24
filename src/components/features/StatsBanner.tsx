'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getStats } from '@/lib/api'
import type { StatsResponse } from '@/types'
import { categoryIcon, categoryLabel, formatCount } from '@/lib/utils'
import { TrendingUp, Shield, AlertOctagon } from 'lucide-react'

export function StatsBanner() {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  useEffect(() => { getStats().then(setStats).catch(() => null) }, [])
  if (!stats) return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full max-w-2xl mx-auto">
      <div className="glass rounded-2xl p-4 sm:p-5 border border-white/5">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl" style={{ background: 'rgba(0,212,255,0.1)' }}><Shield size={16} className="text-[#00D4FF]" /></div>
            <div><p className="text-lg font-bold leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#00D4FF' }}>{formatCount(stats.total_scans)}</p><p className="text-[11px] opacity-40">Scans run</p></div>
          </div>
          <div className="w-px h-8 bg-white/10 hidden sm:block" />
          {stats.top_fraud_categories[0] && (
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)' }}><AlertOctagon size={16} className="text-red-400" /></div>
              <div><p className="text-sm font-semibold leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{categoryIcon(stats.top_fraud_categories[0].fraud_category)} {categoryLabel(stats.top_fraud_categories[0].fraud_category)}</p><p className="text-[11px] opacity-40">Top threat type</p></div>
            </div>
          )}
          <div className="w-px h-8 bg-white/10 hidden sm:block" />
          {stats.top_threat_actors[0] && (
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl" style={{ background: 'rgba(124,58,237,0.1)' }}><TrendingUp size={16} className="text-[#7C3AED]" /></div>
              <div><p className="text-sm font-semibold leading-none font-mono truncate max-w-[120px]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{stats.top_threat_actors[0].contact_value}</p><p className="text-[11px] opacity-40">Most reported actor</p></div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
