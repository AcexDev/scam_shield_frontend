'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Link2, Image, Mic, Send, AlertCircle } from 'lucide-react'
import { analyzeText, analyzeUrl, analyzeImage, analyzeAudio } from '@/lib/api'
import type { AnalyzeResponse, AnalysisTab } from '@/types'
import { ScanningOverlay } from '@/components/ui/ScanningOverlay'
import { ImageDropzone } from '@/components/ui/ImageDropzone'
import { AudioDropzone } from '@/components/ui/AudioDropzone'
import { ResultCard } from '@/components/features/ResultCard'
import { cn } from '@/lib/utils'

const TABS = [
  { id: 'text' as AnalysisTab, label: 'Text / SMS / Email', shortLabel: 'Text', icon: <MessageSquare size={15} />, placeholder: 'Paste a suspicious SMS, email body, or any text here…\n\nExamples:\n• "Congratulations! You won ₦5,000,000…"\n• "Dear customer, your GTBank account has been suspended…"\n• "Your OTP is 847291. Never share this…"' },
  { id: 'url' as AnalysisTab, label: 'URL', shortLabel: 'URL', icon: <Link2 size={15} />, placeholder: 'Paste a suspicious link, e.g. https://gtbank-verify-now.com/login' },
  { id: 'image' as AnalysisTab, label: 'Screenshot', shortLabel: 'Image', icon: <Image size={15} />, placeholder: '' },
  { id: 'audio' as AnalysisTab, label: 'Voice Note', shortLabel: 'Audio', icon: <Mic size={15} />, placeholder: '' },
]

const SCAN_MESSAGES = ['Initialising ShieldAI…','Extracting threat indicators…','Cross-referencing known actors…','Running Gemini 2.5 analysis…','Calculating risk score…','Preparing your report…']

export function AnalyserPanel() {
  const [tab, setTab] = useState<AnalysisTab>('text')
  const [textInput, setTextInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [scanning, setScanning] = useState(false)
  const [msgIdx, setMsgIdx] = useState(0)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const msgTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (scanning) { msgTimer.current = setInterval(() => setMsgIdx(i => (i+1)%SCAN_MESSAGES.length), 1400) }
    else { if (msgTimer.current) clearInterval(msgTimer.current); setMsgIdx(0) }
    return () => { if (msgTimer.current) clearInterval(msgTimer.current) }
  }, [scanning])

  function reset() { setResult(null); setError(null); setTextInput(''); setUrlInput(''); setImageFile(null); setAudioFile(null) }

  async function handleSubmit() {
    setError(null); setScanning(true)
    try {
      let res: AnalyzeResponse
      if (tab === 'text') {
        if (!textInput.trim()) { setError('Please enter some text to analyse.'); setScanning(false); return }
        res = await analyzeText(textInput.trim())
      } else if (tab === 'url') {
        if (!urlInput.trim()) { setError('Please enter a URL.'); setScanning(false); return }
        res = await analyzeUrl(urlInput.trim())
      } else if (tab === 'image') {
        if (!imageFile) { setError('Please upload an image.'); setScanning(false); return }
        res = await analyzeImage(imageFile)
      } else {
        if (!audioFile) { setError('Please upload or record an audio clip.'); setScanning(false); return }
        res = await analyzeAudio(audioFile)
      }
      setResult(res)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Scan failed. Make sure your backend is running.')
    } finally { setScanning(false) }
  }

  function canSubmit() {
    if (tab === 'text') return textInput.trim().length > 0
    if (tab === 'url') return urlInput.trim().length > 0
    if (tab === 'image') return imageFile !== null
    return audioFile !== null
  }

  if (result) return <ResultCard result={result} fingerprint={result.fingerprint ?? undefined} onReset={reset} />

  return (
    <div className="glass rounded-3xl overflow-hidden border border-white/8">
      <div className="flex border-b border-white/6">
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setError(null) }}
            className={cn('relative flex-1 flex items-center justify-center gap-1.5 py-4 text-xs font-semibold transition-all duration-200', tab===t.id ? 'opacity-100' : 'opacity-35 hover:opacity-60')}
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {t.icon}
            <span className="hidden md:inline">{t.label}</span>
            <span className="md:hidden">{t.shortLabel}</span>
            {tab===t.id && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #00D4FF, #7C3AED)' }} />}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-7">
        <AnimatePresence mode="wait">
          {scanning ? (
            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ScanningOverlay message={SCAN_MESSAGES[msgIdx]} />
            </motion.div>
          ) : (
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }} className="space-y-4">
              {tab === 'text' && (
                <textarea value={textInput} onChange={e => setTextInput(e.target.value)} placeholder={TABS[0].placeholder}
                  className="w-full rounded-2xl p-4 text-sm leading-relaxed resize-none focus:outline-none transition-all duration-200"
                  style={{ minHeight: 200, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'inherit' }}
                  onFocus={e => (e.target.style.borderColor='rgba(0,212,255,0.4)')} onBlur={e => (e.target.style.borderColor='rgba(255,255,255,0.08)')} />
              )}
              {tab === 'url' && (
                <div className="space-y-3">
                  <div className="relative">
                    <Link2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                    <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="https://suspicious-link.com/verify-now"
                      className="w-full pl-10 pr-4 py-4 rounded-2xl text-sm focus:outline-none transition-all duration-200"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'inherit' }}
                      onFocus={e => (e.target.style.borderColor='rgba(0,212,255,0.4)')} onBlur={e => (e.target.style.borderColor='rgba(255,255,255,0.08)')}
                      onKeyDown={e => e.key==='Enter' && canSubmit() && handleSubmit()} />
                  </div>
                  <p className="text-xs opacity-30 pl-1">We fetch the page content and run a full AI analysis — not just the URL pattern.</p>
                </div>
              )}
              {tab === 'image' && (
                <div className="space-y-3">
                  <ImageDropzone onFile={setImageFile} disabled={scanning} />
                  <p className="text-xs opacity-30 pl-1">Upload a screenshot of a suspicious message. Gemini will extract and analyse all visible text.</p>
                </div>
              )}
              {tab === 'audio' && (
                <div className="space-y-3">
                  <AudioDropzone onFile={setAudioFile} disabled={scanning} />
                  <p className="text-xs opacity-30 pl-1">Upload a voice note or record live. Gemini transcribes and checks for spoken scam tactics, fake bank numbers, and impersonation.</p>
                </div>
              )}
              {error && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2.5 p-3.5 rounded-xl text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <AlertCircle size={15} className="shrink-0 mt-0.5" /><span>{error}</span>
                </motion.div>
              )}
              <button onClick={handleSubmit} disabled={!canSubmit()||scanning}
                className={cn('w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200', canSubmit() ? 'text-white hover:scale-[1.02] active:scale-[0.98]' : 'opacity-30 cursor-not-allowed')}
                style={{ fontFamily: 'Space Grotesk, sans-serif', background: canSubmit() ? 'linear-gradient(135deg, #00D4FF, #7C3AED)' : 'rgba(255,255,255,0.08)', boxShadow: canSubmit() ? '0 0 32px rgba(0,212,255,0.3)' : 'none' }}>
                <Send size={15} /> Scan for Scams
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
