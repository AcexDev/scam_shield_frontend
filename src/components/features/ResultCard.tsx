'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle, CheckCircle, ChevronDown, ChevronUp,
  Flag, Users, Lightbulb, Send, ShieldAlert
} from 'lucide-react'
import { RiskMeter } from '@/components/ui/RiskMeter'
import type { AnalyzeResponse, Agency } from '@/types'
import { threatMeta, categoryLabel, categoryIcon, contactTypeIcon, cn } from '@/lib/utils'
import { reportToAuthority } from '@/lib/api'

const AGENCIES: { id: Agency; name: string; color: string; desc: string }[] = [
  { id: 'EFCC',  name: 'EFCC',   color: '#EF4444', desc: 'Economic & Financial Crimes' },
  { id: 'CBN',   name: 'CBN',    color: '#F59E0B', desc: 'Central Bank of Nigeria' },
  { id: 'NITDA', name: 'NITDA',  color: '#7C3AED', desc: 'IT Development Agency' },
  { id: 'NPF',   name: 'Police', color: '#00D4FF', desc: 'Nigeria Police Force' },
]

interface Props { result: AnalyzeResponse; fingerprint?: string; onReset: () => void }

export function ResultCard({ result, fingerprint, onReset }: Props) {
  const [showActors, setShowActors] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [reporting, setReporting] = useState<Agency | null>(null)
  const [reportNote, setReportNote] = useState('')
  const [reportSuccess, setReportSuccess] = useState<string | null>(null)
  const [reportError, setReportError] = useState<string | null>(null)

  const meta = threatMeta(result.threat_level)

  // Reveal the report section after a short delay so it feels like
  // a new call-to-action appearing once the user has seen the verdict
  useEffect(() => {
    if (result.is_scam) {
      const t = setTimeout(() => setShowReport(true), 1200)
      return () => clearTimeout(t)
    }
  }, [result.is_scam])

  async function submitReport(agency: Agency) {
    if (!fingerprint) {
      setReportError('No fingerprint available for this scan — cannot file a report.')
      return
    }
    setReportError(null)
    setReporting(agency)
    try {
      const res = await reportToAuthority(fingerprint, agency, reportNote)
      setReportSuccess(res.message)
    } catch (e: unknown) {
      setReportError(e instanceof Error ? e.message : 'Report failed. Please try again.')
    } finally {
      setReporting(null)
    }
  }

  return (
    <motion.div className="result-enter space-y-4" initial={false}>

      {/* ── Verdict + meter ── */}
      <div className="glass rounded-3xl p-6 sm:p-8 border" style={{ borderColor: meta.color + '33' }}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <RiskMeter probability={result.scam_probability} threatLevel={result.threat_level} isScam={result.is_scam} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              {result.is_scam
                ? <AlertTriangle size={20} className="text-red-400" />
                : <CheckCircle size={20} className="text-emerald-400" />}
              <span className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: meta.color }}>
                {result.is_scam ? 'Scam Detected' : 'Looks Safe'}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-3"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {categoryIcon(result.fraud_category)} {categoryLabel(result.fraud_category)}
            </span>
            <p className="text-sm leading-relaxed opacity-70 mb-3">{result.explanation}</p>
            {result.social_proof && (
              <p className="text-xs opacity-50 italic">{result.social_proof}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Flagged phrases ── */}
      {result.flagged_phrases.length > 0 && (
        <div className="glass rounded-2xl p-5 border border-white/5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <Flag size={14} className="text-red-400" /> Flagged Phrases
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.flagged_phrases.map((phrase, i) => (
              <span key={i} className="px-3 py-1 rounded-lg text-xs font-mono"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#F87171' }}>
                "{phrase}"
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Recommended action ── */}
      <div className="glass rounded-2xl p-5 border" style={{ borderColor: meta.color + '22' }}>
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          <Lightbulb size={14} style={{ color: meta.color }} /> Recommended Action
        </h3>
        <p className="text-sm leading-relaxed opacity-70">{result.recommended_action}</p>
      </div>

      {/* ── Known actor ── */}
      {result.known_actor && (
        <div className="glass rounded-2xl p-5 border border-red-500/20" style={{ background: 'rgba(239,68,68,0.05)' }}>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-red-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <Users size={14} /> Known Threat Actor
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{contactTypeIcon(result.known_actor.contact_type)}</span>
            <div>
              <p className="text-sm font-medium font-mono">{result.known_actor.contact_value}</p>
              <p className="text-xs opacity-50">{result.known_actor.label} · {result.known_actor.report_count} reports</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Threat actors (collapsible) ── */}
      {result.threat_actors.length > 0 && (
        <div className="glass rounded-2xl overflow-hidden border border-white/5">
          <button
            className="w-full px-5 py-4 flex items-center justify-between text-sm font-semibold hover:bg-white/5 transition-colors"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            onClick={() => setShowActors(v => !v)}
          >
            <span className="flex items-center gap-2">
              <Users size={14} className="text-[#7C3AED]" />
              Extracted Threat Actors ({result.threat_actors.length})
            </span>
            {showActors ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <AnimatePresence>
            {showActors && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-5 pb-4 space-y-2">
                  {result.threat_actors.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <span>{contactTypeIcon(a.contact_type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono truncate">{a.contact_value}</p>
                        <p className="text-xs opacity-40">{a.label}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full border opacity-50 shrink-0"
                        style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                        {a.contact_type}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Report to authority — revealed after 1.2s only when is_scam ── */}
      <AnimatePresence>
        {result.is_scam && showReport && !reportSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease: [0.34, 1.2, 0.64, 1] }}
            className="rounded-2xl overflow-hidden border"
            style={{
              borderColor: 'rgba(239,68,68,0.3)',
              background: 'rgba(239,68,68,0.05)',
              boxShadow: '0 0 40px rgba(239,68,68,0.08)',
            }}
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-red-500/10">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="p-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.15)' }}>
                  <ShieldAlert size={16} className="text-red-400" />
                </div>
                <h3 className="text-sm font-bold text-red-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Report This Scam
                </h3>
              </div>
              <p className="text-xs opacity-50 leading-relaxed">
                This was flagged as a scam. Reporting it helps protect other Nigerians — your report goes directly to enforcement agencies.
              </p>
            </div>

            <div className="p-5 space-y-4">
              {/* Optional note */}
              <div>
                <label className="text-xs opacity-40 mb-1.5 block" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Add a note for the agency (optional)
                </label>
                <textarea
                  className="w-full text-xs rounded-xl p-3 resize-none focus:outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    minHeight: 60,
                    color: 'inherit',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(239,68,68,0.4)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  placeholder="e.g. Received via WhatsApp from +234…"
                  value={reportNote}
                  onChange={e => setReportNote(e.target.value)}
                />
              </div>

              {/* Agency buttons */}
              <div className="grid grid-cols-2 gap-2">
                {AGENCIES.map(ag => (
                  <button
                    key={ag.id}
                    onClick={() => submitReport(ag.id)}
                    disabled={!!reporting}
                    className={cn(
                      'p-3 rounded-xl text-left transition-all duration-200 border',
                      'hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                    style={{
                      background: reporting === ag.id ? ag.color + '18' : 'rgba(255,255,255,0.04)',
                      borderColor: ag.color + '33',
                    }}
                  >
                    <p className="text-xs font-bold mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif', color: ag.color }}>
                      {reporting === ag.id ? 'Reporting…' : `Report to ${ag.name}`}
                    </p>
                    <p className="text-[10px] opacity-40">{ag.desc}</p>
                  </button>
                ))}
              </div>

              {/* Report error */}
              {reportError && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl text-xs text-red-400"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  <AlertTriangle size={13} className="shrink-0" />
                  {reportError}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report success */}
      {reportSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4 border border-emerald-500/30 text-sm text-emerald-400 flex items-center gap-2"
        >
          <CheckCircle size={16} /> {reportSuccess}
        </motion.div>
      )}

      {/* Scan again */}
      <button
        onClick={onReset}
        className="w-full py-3.5 rounded-2xl text-sm font-semibold border transition-all duration-200 hover:bg-white/5 hover:scale-[1.01]"
        style={{ fontFamily: 'Space Grotesk, sans-serif', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        ← Scan Something Else
      </button>
    </motion.div>
  )
}
