'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { getStats } from '@/lib/api'
import type { StatsResponse, FraudCategory } from '@/types'
import { categoryLabel, categoryIcon, contactTypeIcon, formatCount } from '@/lib/utils'
import { Navbar } from '@/components/layout/Navbar'
import { ParticleField } from '@/components/ui/ParticleField'
import { Shield } from '@/components/ui/Shield'
import { TrendingUp, ArrowLeft, RefreshCw, AlertOctagon, Users, BarChart3, ShieldCheck, Activity } from 'lucide-react'

const THREAT_COLORS: Record<FraudCategory, string> = {
  PHISHING: '#EF4444', PRIZE_FRAUD: '#F59E0B', IMPERSONATION: '#7C3AED',
  INVESTMENT_FRAUD: '#00D4FF', ROMANCE_SCAM: '#EC4899', NONE: '#10B981',
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  async function load(showRefresh = false) {
    if (showRefresh) setRefreshing(true); else setLoading(true); setError(null)
    try { const data = await getStats(); setStats(data) }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Could not load stats.') }
    finally { setLoading(false); setRefreshing(false) }
  }

  useEffect(() => { load() }, [])
  const maxCat = stats?.top_fraud_categories[0]?.count ?? 1
  const maxActor = stats?.top_threat_actors[0]?.report_count ?? 1

  return (
    <>
      <div className="fixed inset-0 dark:bg-[#0A0E1A] bg-[#EEF2FF]" style={{ zIndex: -2 }} />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1, background: 'radial-gradient(ellipse 70% 50% at 20% 20%, rgba(239,68,68,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(124,58,237,0.07) 0%, transparent 60%)' }} />
      <div className="fixed inset-0 hex-bg opacity-20 pointer-events-none" style={{ zIndex: -1 }} />
      <ParticleField /><Navbar />
      <main className="relative min-h-screen pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <motion.div className="flex items-start justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div>
              <Link href="/" className="inline-flex items-center gap-1.5 text-xs opacity-40 hover:opacity-70 transition-opacity mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <ArrowLeft size={12} /> Back to Scanner
              </Link>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}><span className="grad-text">Threat Intelligence</span></h1>
              <p className="text-sm opacity-40 mt-1">Live scam patterns detected across Nigeria</p>
            </div>
            <button onClick={() => load(true)} disabled={refreshing} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-white/10 hover:bg-white/5 transition-all disabled:opacity-40" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} /> Refresh
            </button>
          </motion.div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Shield size={64} pulse scanning />
              <p className="text-sm opacity-40 font-mono">Loading threat data…</p>
              <div className="flex gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00D4FF] dot1" /><span className="w-2 h-2 rounded-full bg-[#7C3AED] dot2" /><span className="w-2 h-2 rounded-full bg-[#00D4FF] dot3" /></div>
            </div>
          )}

          {error && !loading && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 border border-red-500/20 text-center">
              <AlertOctagon size={32} className="text-red-400 mx-auto mb-3" />
              <p className="text-sm text-red-400 mb-1 font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Failed to load stats</p>
              <p className="text-xs opacity-40 mb-4">{error}</p>
              <button onClick={() => load()} className="px-4 py-2 rounded-xl text-xs font-semibold border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Try Again</button>
            </motion.div>
          )}

          <AnimatePresence>
            {stats && !loading && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { icon: <ShieldCheck size={20}/>, value: formatCount(stats.total_scans), label: 'Total scans run', color: '#00D4FF', delay: 0.1 },
                    { icon: <BarChart3 size={20}/>, value: String(stats.top_fraud_categories.length), label: 'Active threat types', color: '#7C3AED', delay: 0.2 },
                    { icon: <Users size={20}/>, value: String(stats.top_threat_actors.length), label: 'Known threat actors', color: '#EF4444', delay: 0.3 },
                  ].map(s => (
                    <motion.div key={s.label} className="glass rounded-2xl p-5 border border-white/5 flex items-center gap-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: s.delay }}>
                      <div className="p-3 rounded-xl shrink-0" style={{ background: s.color+'18' }}><span style={{ color: s.color }}>{s.icon}</span></div>
                      <div><p className="text-2xl font-bold leading-none mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif', color: s.color }}>{s.value}</p><p className="text-xs opacity-40">{s.label}</p></div>
                    </motion.div>
                  ))}
                </div>

                <motion.div className="glass rounded-2xl border border-white/5 overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                  <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                    <div className="p-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.12)' }}><TrendingUp size={15} className="text-red-400" /></div>
                    <h2 className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Top Attack Types</h2>
                  </div>
                  <div className="p-5 space-y-5">
                    {stats.top_fraud_categories.length === 0 ? (
                      <p className="text-sm opacity-30 text-center py-4">No data yet — run some scans first.</p>
                    ) : stats.top_fraud_categories.map((cat, i) => {
                      const pct = maxCat > 0 ? (cat.count/maxCat)*100 : 0
                      const color = THREAT_COLORS[cat.fraud_category] ?? '#00D4FF'
                      return (
                        <motion.div key={cat.fraud_category} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i*0.08 }}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{categoryIcon(cat.fraud_category)}</span>
                              <span className="text-sm font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{categoryLabel(cat.fraud_category)}</span>
                              {i === 0 && <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: color+'22', color }}>#1 Threat</span>}
                            </div>
                            <span className="text-sm font-bold tabular-nums" style={{ fontFamily: 'Space Grotesk, sans-serif', color }}>{formatCount(cat.count)}</span>
                          </div>
                          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${color}cc, ${color})` }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: i*0.08+0.2, duration: 0.9, ease: [0.34,1.1,0.64,1] }} />
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>

                <motion.div className="glass rounded-2xl border border-white/5 overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                  <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                    <div className="p-1.5 rounded-lg" style={{ background: 'rgba(124,58,237,0.12)' }}><Users size={15} className="text-[#7C3AED]" /></div>
                    <h2 className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Most Reported Threat Actors</h2>
                  </div>
                  <div className="divide-y divide-white/5">
                    {stats.top_threat_actors.length === 0 ? (
                      <p className="text-sm opacity-30 text-center py-6">No threat actors reported yet.</p>
                    ) : stats.top_threat_actors.map((actor, i) => (
                      <motion.div key={`${actor.contact_type}-${actor.contact_value}`} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45+i*0.07 }}>
                        <span className="text-lg font-bold w-6 text-center tabular-nums opacity-20" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{i+1}</span>
                        <span className="text-xl shrink-0">{contactTypeIcon(actor.contact_type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-mono font-medium truncate" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{actor.contact_value}</p>
                            <span className="text-xs font-bold ml-3 shrink-0" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#EF4444' }}>{formatCount(actor.report_count)} reports</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs opacity-35 truncate">{actor.label}</p>
                            <span className="text-[10px] px-1.5 py-0.5 rounded border opacity-30 shrink-0" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>{actor.contact_type}</span>
                          </div>
                          <div className="mt-2 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, rgba(239,68,68,0.7), #EF4444)' }} initial={{ width: 0 }} animate={{ width: `${maxActor>0?(actor.report_count/maxActor)*100:0}%` }} transition={{ delay: 0.5+i*0.07, duration: 0.8, ease: [0.34,1.1,0.64,1] }} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div className="glass rounded-2xl p-4 border border-white/5 flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                  <Activity size={14} className="text-[#00D4FF] shrink-0" />
                  <p className="text-xs opacity-40">Data reflects community-reported patterns. Every scan you run helps improve detection for everyone. Stats update in real time.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
                  <Link href="/" className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-semibold text-sm text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" style={{ fontFamily: 'Space Grotesk, sans-serif', background: 'linear-gradient(135deg, #00D4FF, #7C3AED)', boxShadow: '0 0 32px rgba(0,212,255,0.25)' }}>
                    <Shield size={16} pulse={false} /> Scan Something Now
                  </Link>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  )
}
